/****************************************************************************
 * 🧠 HybridSearchEngine V5 - Professional E5 Integration
 * 
 * Features:
 * ✓ E5 Model with proper query/passage prefix handling
 * ✓ Intelligent intent classification (multi-database support)
 * ✓ Hybrid search (70% semantic + 30% keyword)
 * ✓ Dynamic score filtering (relative to top result)
 * ✓ Production-ready error handling
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
        this.intentThreshold = 0.30;
        this.multiIntentThreshold = 0.25;
    }

    async initialize() {
        if (this.isReady) return;
        console.log("⏳ Initializing Semantic Router with E5...");
        
        try {
            // Load E5 model (same as Python)
            this.embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
            
            const loadDatabase = async (filename) => {
                const res = await fetch(`js/${filename}`);
                if (!res.ok) throw new Error(`Failed to load: ${filename}`);
                const jsonData = await res.json();
                return this.normalizeData(jsonData);
            };

            const [activities, areas, decision104] = await Promise.all([
                loadDatabase('activities_vectors.json'),
                loadDatabase('areas_vectors.json'),
                loadDatabase('decision104_vectors.json')
            ]);

            this.databases.activities = activities;
            this.databases.areas = areas;
            this.databases.decision104 = decision104;

            console.log(`✅ Loaded: activities(${activities.length}), areas(${areas.length}), decision104(${decision104.length})`);

            // Intent signatures - use query mode for classification
            this.intentSignatures = {
                activities: await this.embed('industrial activities manufacturing licenses permits regulatory requirements', false),
                areas: await this.embed('geographic locations industrial zones land areas coordinates regions', false),
                decision104: await this.embed('tax exemptions financial incentives investment benefits customs duties decree 104', false)
            };

            this.isReady = true;
            console.log("✅ E5 Hybrid Search Engine ready!");
        } catch (error) {
            console.error("❌ Initialization error:", error);
            throw error;
        }
    }

    normalizeData(jsonData) {
        // Extract from "data" property
        if (jsonData.data && Array.isArray(jsonData.data)) {
            console.log(`📦 Extracted ${jsonData.data.length} items`);
            return jsonData.data;
        }
        
        // Already an array
        if (Array.isArray(jsonData)) {
            console.log(`📦 Data is array: ${jsonData.length} items`);
            return jsonData;
        }
        
        console.warn("⚠️ Unexpected format");
        return [];
    }

    /**
     * Generate embedding with proper E5 prefix handling
     * @param {string} text - Text to embed
     * @param {boolean} isDocument - false = query mode (query:), true = document mode (passage:)
     */
    async embed(text, isDocument = false) {
        if (!this.embedder) throw new Error("Model not ready");
        
        // E5 model requires different prefixes for queries vs documents
        let prefixedText;
        if (isDocument) {
            // Document mode: "passage:" prefix (matches Python generation)
            prefixedText = text.startsWith('passage:') ? text : `passage: ${text}`;
        } else {
            // Query mode: "query:" prefix (for user searches)
            prefixedText = text.startsWith('query:') ? text : `query: ${text}`;
        }
        
        const output = await this.embedder(prefixedText, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    similarity(vecA, vecB) {
        let dot = 0, normA = 0, normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    async classifyIntent(queryVector) {
        const scores = [];
        
        for (const [dbName, signature] of Object.entries(this.intentSignatures)) {
            const score = this.similarity(signature, queryVector);
            scores.push({ database: dbName, confidence: score });
        }
        
        scores.sort((a, b) => b.confidence - a.confidence);
        
        console.log("📊 Intent:", scores.map(s => 
            `${s.database}: ${Math.round(s.confidence * 100)}%`
        ).join(' | '));
        
        const targets = [];
        
        // Primary database
        if (scores[0].confidence >= this.intentThreshold) {
            targets.push(scores[0].database);
        }
        
        // Secondary databases (for complex queries)
        for (let i = 1; i < scores.length; i++) {
            if (scores[i].confidence >= this.multiIntentThreshold && 
                scores[i].confidence > scores[0].confidence * 0.75) {
                targets.push(scores[i].database);
            }
        }
        
        // Fallback: search all if no strong match
        if (targets.length === 0) {
            console.log("⚠️ Low confidence, searching all databases");
            return ['activities', 'areas', 'decision104'];
        }
        
        console.log(`🎯 Target databases: [${targets.join(', ')}]`);
        return targets;
    }

    vectorSearch(queryVector, database, topK = 10) {
        const results = [];
        
        for (const item of database) {
            if (!item.vector || !Array.isArray(item.vector)) continue;
            
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

    keywordScore(query, item) {
        const queryLower = query.toLowerCase();
        
        // Extract searchable text from item
        const searchableText = [
            item.name_ar,
            item.name_en,
            item.description,
            item.activity_name,
            item.location,
            item.area_name,
            item.sector,
            item.main_activity,
            item.isic_code
        ].filter(Boolean).join(' ').toLowerCase();
        
        // Tokenize query (keep Arabic + alphanumeric)
        const tokens = queryLower
            .replace(/[^\u0600-\u06FF\w\s]/g, ' ')
            .split(/\s+/)
            .filter(t => t.length > 2);
        
        if (tokens.length === 0) return 0;
        
        // Count matching tokens
        let matches = 0;
        let partialMatches = 0;
        
        for (const token of tokens) {
            if (searchableText.includes(token)) {
                matches++;
            } else {
                // Check for partial matches (substring)
                const parts = searchableText.split(/\s+/);
                for (const part of parts) {
                    if (part.includes(token) || token.includes(part)) {
                        partialMatches += 0.5;
                        break;
                    }
                }
            }
        }
        
        return (matches + partialMatches) / tokens.length;
    }

    hybridSearch(query, queryVector, database, topK = 10) {
        const results = [];
        
        for (const item of database) {
            if (!item.vector || !Array.isArray(item.vector)) continue;
            
            const vectorScore = this.similarity(queryVector, item.vector);
            const keywordScore = this.keywordScore(query, item);
            
            // Weighted combination: 70% semantic, 30% keyword
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

    async search(query, options = {}) {
        if (!this.isReady) await this.initialize();
        
        const {
            topK = 5,
            useHybrid = true,
            minScore = 0.05,  // Absolute minimum (E5 with prefix gives lower scores)
            relativeThreshold = 0.65  // Keep results within 65% of top score
        } = options;
        
        console.log(`\n🔍 Query: "${query}"`);
        
        // Generate query embedding (query mode = false)
        const queryVector = await this.embed(query, false);
        
        // Classify intent and determine target databases
        const targetDatabases = await this.classifyIntent(queryVector);
        
        // Search in each target database
        const allResults = [];
        
        for (const dbName of targetDatabases) {
            const database = this.databases[dbName];
            
            if (!database || database.length === 0) {
                console.warn(`⚠️ Empty database: ${dbName}`);
                continue;
            }
            
            console.log(`🔎 Searching [${dbName}] (${database.length} items)...`);
            
            // Use hybrid or pure vector search
            const results = useHybrid 
                ? this.hybridSearch(query, queryVector, database, topK * 3)
                : this.vectorSearch(queryVector, database, topK * 3);
            
            // Tag results with source database
            results.forEach(r => {
                r.source = dbName;
                allResults.push(r);
            });
        }
        
        // Sort all results
        const sortedResults = allResults
            .sort((a, b) => (b.finalScore || b.score) - (a.finalScore || a.score));
        
        // Dynamic filtering: keep results within threshold of top result
        const topScore = sortedResults[0] ? (sortedResults[0].finalScore || sortedResults[0].score) : 0;
        const dynamicMinScore = Math.max(minScore, topScore * relativeThreshold);
        
        console.log(`📊 Top score: ${Math.round(topScore * 100)}%, Dynamic threshold: ${Math.round(dynamicMinScore * 100)}%`);
        
        const finalResults = sortedResults
            .filter(r => (r.finalScore || r.score) >= dynamicMinScore)
            .slice(0, topK);
        
        console.log(`✅ Found ${finalResults.length} results (from ${allResults.length} total)`);
        
        if (finalResults.length > 0) {
            const top = finalResults[0];
            console.log(`🏆 Top match: ${top.id} (${Math.round((top.finalScore || top.score) * 100)}%) [${top.source}]`);
            
            // Show breakdown for top result
            if (top.vectorScore !== undefined) {
                console.log(`   Vector: ${Math.round(top.vectorScore * 100)}%, Keyword: ${Math.round(top.keywordScore * 100)}%`);
            }
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

export const hybridEngine = new HybridSearchEngine();
