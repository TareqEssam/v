/****************************************************************************
 * 🧠 HybridSearchEngine V6 - Production Ready
 * 
 * ✅ FINAL VERSION - Tested & Working
 * 
 * Technical Details:
 * - Model: Xenova/multilingual-e5-small (384 dimensions)
 * - Python vectors: Generated with "passage:" prefix
 * - JS queries: Must use "query:" prefix for proper E5 asymmetric search
 * - Hybrid scoring: 70% semantic + 30% keyword matching
 * - Dynamic filtering: Relative threshold (70% of top score)
 * 
 * Important Notes:
 * - E5 is asymmetric: queries use "query:", documents use "passage:"
 * - Python already added "passage:" when generating vectors
 * - JavaScript must add "query:" when searching
 * - This creates the proper semantic space for retrieval
 ****************************************************************************/

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

env.allowLocalModels = false;
env.useBrowserCache = true;

class HybridSearchEngine {
    constructor() {
        this.embedder = null;
        this.databases = {
            activities: [],
            areas: [],
            decision104: []
        };
        this.intentSignatures = {};
        this.isReady = false;
        
        // Intent classification thresholds
        this.intentThreshold = 0.28;
        this.multiIntentThreshold = 0.24;
    }

    async initialize() {
        if (this.isReady) return;
        console.log("⏳ Initializing E5 Hybrid Search Engine...");
        
        try {
            // Load E5 model (same model used in Python)
            this.embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
            
            const loadDatabase = async (filename) => {
                const res = await fetch(`js/${filename}`);
                if (!res.ok) throw new Error(`Failed to load: ${filename}`);
                const jsonData = await res.json();
                return this.normalizeData(jsonData);
            };

            // Load all vector databases in parallel
            const [activities, areas, decision104] = await Promise.all([
                loadDatabase('activities_vectors.json'),
                loadDatabase('areas_vectors.json'),
                loadDatabase('decision104_vectors.json')
            ]);

            this.databases.activities = activities;
            this.databases.areas = areas;
            this.databases.decision104 = decision104;

            console.log(`✅ Loaded databases: activities(${activities.length}), areas(${areas.length}), decision104(${decision104.length})`);

            // Create intent signatures for database classification
            // These help route queries to the right database
            this.intentSignatures = {
                activities: await this.embed('أنشطة صناعية تراخيص تشغيل متطلبات قانونية إجراءات إدارية'),
                areas: await this.embed('مناطق صناعية مواقع جغرافية إحداثيات أراضي محافظات'),
                decision104: await this.embed('إعفاءات ضريبية حوافز استثمارية مزايا مالية قرار 104 جمارك')
            };

            this.isReady = true;
            console.log("✅ E5 Hybrid Search Engine ready!");
            
        } catch (error) {
            console.error("❌ Initialization failed:", error);
            throw error;
        }
    }

    /**
     * Normalize data from different JSON structures
     */
    normalizeData(jsonData) {
        // Structure: { version, model, data: [...] }
        if (jsonData.data && Array.isArray(jsonData.data)) {
            console.log(`📦 Extracted ${jsonData.data.length} items from 'data' property`);
            return jsonData.data;
        }
        
        // Structure: [...]
        if (Array.isArray(jsonData)) {
            console.log(`📦 Data is already an array: ${jsonData.length} items`);
            return jsonData;
        }
        
        console.warn("⚠️ Unexpected data format, returning empty array");
        return [];
    }

    /**
     * Generate embedding vector using E5 model
     * CRITICAL: Must use "query:" prefix for user queries
     * (Documents in JSON files already have "passage:" prefix from Python)
     */
    async embed(text) {
        if (!this.embedder) throw new Error("Embedder not initialized");
        
        // E5 asymmetric search: queries use "query:" prefix
        // This matches against "passage:" prefixed documents from Python
        const queryText = text.startsWith('query:') ? text : `query: ${text}`;
        
        const output = await this.embedder(queryText, { 
            pooling: 'mean', 
            normalize: true 
        });
        
        return Array.from(output.data);
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    similarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) {
            console.error("Invalid vectors for similarity calculation");
            return 0;
        }
        
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        
        if (normA === 0 || normB === 0) return 0;
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Classify user intent to determine which database(s) to search
     */
    async classifyIntent(queryVector) {
        const scores = [];
        
        for (const [dbName, signature] of Object.entries(this.intentSignatures)) {
            const score = this.similarity(signature, queryVector);
            scores.push({ database: dbName, confidence: score });
        }
        
        scores.sort((a, b) => b.confidence - a.confidence);
        
        console.log("📊 Intent analysis:", scores.map(s => 
            `${s.database}: ${Math.round(s.confidence * 100)}%`
        ).join(' | '));
        
        const targets = [];
        
        // Add primary database
        if (scores[0].confidence >= this.intentThreshold) {
            targets.push(scores[0].database);
        }
        
        // Add secondary databases for multi-domain queries
        for (let i = 1; i < scores.length; i++) {
            if (scores[i].confidence >= this.multiIntentThreshold && 
                scores[i].confidence >= scores[0].confidence * 0.75) {
                targets.push(scores[i].database);
            }
        }
        
        // Fallback: search all databases if no strong match
        if (targets.length === 0) {
            console.log("⚠️ Low confidence - searching all databases");
            return ['activities', 'decision104', 'areas'];
        }
        
        console.log(`🎯 Target databases: [${targets.join(', ')}]`);
        return targets;
    }

    /**
     * Pure vector search (semantic similarity only)
     */
    vectorSearch(queryVector, database, topK = 15) {
        const results = [];
        
        for (const item of database) {
            if (!item.vector || !Array.isArray(item.vector)) {
                continue;
            }
            
            const score = this.similarity(queryVector, item.vector);
            
            results.push({
                id: item.id,
                score: score,
                data: item
            });
        }
        
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    /**
     * Keyword matching score
     */
    keywordScore(query, item) {
        const queryLower = query.toLowerCase();
        
        // Build searchable text from all relevant fields
        const searchableFields = [
            item.name_ar,
            item.name_en,
            item.description,
            item.activity_name,
            item.location,
            item.area_name,
            item.sector,
            item.main_activity,
            item.sub_activity,
            item.isic_code
        ];
        
        const searchableText = searchableFields
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        
        // Tokenize query (preserve Arabic and alphanumeric)
        const tokens = queryLower
            .replace(/[^\u0600-\u06FF\u0660-\u0669\w\s]/g, ' ')
            .split(/\s+/)
            .filter(t => t.length > 2);
        
        if (tokens.length === 0) return 0;
        
        let exactMatches = 0;
        let partialMatches = 0;
        
        for (const token of tokens) {
            // Check for exact token match
            if (searchableText.includes(token)) {
                exactMatches++;
            } else {
                // Check for partial matches in word boundaries
                const words = searchableText.split(/\s+/);
                for (const word of words) {
                    if (word.includes(token) && token.length >= 3) {
                        partialMatches += 0.5;
                        break;
                    } else if (token.includes(word) && word.length >= 3) {
                        partialMatches += 0.3;
                        break;
                    }
                }
            }
        }
        
        return (exactMatches + partialMatches) / tokens.length;
    }

    /**
     * Hybrid search: combines semantic similarity with keyword matching
     */
    hybridSearch(query, queryVector, database, topK = 15) {
        const results = [];
        
        for (const item of database) {
            if (!item.vector || !Array.isArray(item.vector)) {
                continue;
            }
            
            const vectorScore = this.similarity(queryVector, item.vector);
            const keywordScore = this.keywordScore(query, item);
            
            // Weighted combination: 70% semantic, 30% lexical
            const finalScore = (vectorScore * 0.7) + (keywordScore * 0.3);
            
            results.push({
                id: item.id,
                vectorScore: vectorScore,
                keywordScore: keywordScore,
                finalScore: finalScore,
                data: item
            });
        }
        
        return results
            .sort((a, b) => b.finalScore - a.finalScore)
            .slice(0, topK);
    }

    /**
     * Main search function
     */
    async search(query, options = {}) {
        if (!this.isReady) {
            await this.initialize();
        }
        
        const {
            topK = 5,
            useHybrid = true,
            absoluteMinScore = 0.03,  // Absolute minimum to filter noise
            relativeThreshold = 0.70   // Keep results within 70% of top score
        } = options;
        
        console.log(`\n🔍 Search query: "${query}"`);
        
        // Step 1: Convert query to vector (with "query:" prefix)
        const queryVector = await this.embed(query);
        
        // Step 2: Classify intent to determine target databases
        const targetDatabases = await this.classifyIntent(queryVector);
        
        // Step 3: Search in each target database
        const allResults = [];
        
        for (const dbName of targetDatabases) {
            const database = this.databases[dbName];
            
            if (!database || database.length === 0) {
                console.warn(`⚠️ Database "${dbName}" is empty`);
                continue;
            }
            
            console.log(`🔎 Searching [${dbName}] with ${database.length} items...`);
            
            // Perform hybrid or pure vector search
            const results = useHybrid 
                ? this.hybridSearch(query, queryVector, database, topK * 3)
                : this.vectorSearch(queryVector, database, topK * 3);
            
            // Tag results with source database
            results.forEach(r => {
                r.source = dbName;
                allResults.push(r);
            });
        }
        
        // Step 4: Sort and filter results
        const sortedResults = allResults
            .sort((a, b) => (b.finalScore || b.score) - (a.finalScore || a.score));
        
        // Dynamic threshold: keep results within X% of the top result
        const topScore = sortedResults[0] ? (sortedResults[0].finalScore || sortedResults[0].score) : 0;
        const dynamicMinScore = Math.max(absoluteMinScore, topScore * relativeThreshold);
        
        console.log(`📊 Analysis: Top score=${Math.round(topScore * 100)}%, Threshold=${Math.round(dynamicMinScore * 100)}%`);
        
        const finalResults = sortedResults
            .filter(r => {
                const score = r.finalScore || r.score;
                return score >= dynamicMinScore;
            })
            .slice(0, topK);
        
        // Step 5: Log results
        console.log(`✅ Found ${finalResults.length} results (filtered from ${allResults.length} total)`);
        
        if (finalResults.length > 0) {
            const top = finalResults[0];
            const topScore = top.finalScore || top.score;
            console.log(`🏆 Top result: ${top.id} (${Math.round(topScore * 100)}%) from [${top.source}]`);
            
            if (top.vectorScore !== undefined && top.keywordScore !== undefined) {
                console.log(`   └─ Breakdown: Semantic=${Math.round(top.vectorScore * 100)}%, Keyword=${Math.round(top.keywordScore * 100)}%`);
            }
        } else {
            console.log("❌ No results found matching the criteria");
        }
        
        return {
            query: query,
            targetDatabases: targetDatabases,
            resultsCount: finalResults.length,
            results: finalResults,
            topMatch: finalResults[0] || null,
            confidence: finalResults[0] ? (finalResults[0].finalScore || finalResults[0].score) : 0
        };
    }
}

// Export singleton instance
export const hybridEngine = new HybridSearchEngine();
