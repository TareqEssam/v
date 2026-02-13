/****************************************************************************
 * 🧠 HybridSearchEngine V3 - Professional Semantic Router
 * 
 * Core Features:
 * 1. Intelligent Intent Classification (Multi-Database Detection)
 * 2. True Vector Search with Cosine Similarity
 * 3. Hybrid Search (Semantic + Keyword Fusion)
 * 4. Automatic Data Format Normalization
 * 5. Production-Ready Error Handling
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
        this.intentThreshold = 0.35; // Minimum confidence to select a database
        this.multiIntentThreshold = 0.30; // Threshold for multi-database queries
    }

    /**
     * Initialize the engine
     */
    async initialize() {
        if (this.isReady) return;
        console.log("⏳ Initializing Semantic Router...");
        
        try {
            // Load embedding model
            this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            
            // Load vector databases
            const loadDatabase = async (filename) => {
                const res = await fetch(`js/${filename}`);
                if (!res.ok) throw new Error(`Failed to load: ${filename}`);
                const data = await res.json();
                return this.normalizeData(data);
            };

            const [activities, areas, decision104] = await Promise.all([
                loadDatabase('activities_vectors.json'),
                loadDatabase('areas_vectors.json'),
                loadDatabase('decision104_vectors.json')
            ]);

            this.databases.activities = activities;
            this.databases.areas = areas;
            this.databases.decision104 = decision104;

            console.log(`✅ Loaded databases: activities(${activities.length}), areas(${areas.length}), decision104(${decision104.length})`);

            // Create intent signatures (semantic fingerprints)
            this.intentSignatures = {
                activities: await this.embed('industrial activities, business operations, manufacturing processes, production stages, licenses, permits, regulatory requirements'),
                areas: await this.embed('geographic locations, industrial zones, land areas, regional boundaries, coordinates, administrative regions'),
                decision104: await this.embed('tax exemptions, financial incentives, investment benefits, customs duties, strategic industries, ministerial decree 104')
            };

            this.isReady = true;
            console.log("✅ Hybrid Search Engine ready!");
        } catch (error) {
            console.error("❌ Initialization error:", error);
            throw error;
        }
    }

    /**
     * Normalize data from Object or Array format to unified Array format
     */
    normalizeData(data) {
        // Already an array
        if (Array.isArray(data)) {
            return data;
        }
        
        // Convert object to array
        if (typeof data === 'object' && data !== null) {
            return Object.values(data);
        }
        
        console.warn("⚠️ Unexpected data format, returning empty array");
        return [];
    }

    /**
     * Convert text to embedding vector
     */
    async embed(text) {
        if (!this.embedder) throw new Error("Model not ready");
        const output = await this.embedder(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    similarity(vecA, vecB) {
        let dot = 0, normA = 0, normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Classify user intent and determine target database(s)
     * Returns array of databases to search, ordered by relevance
     */
    async classifyIntent(queryVector) {
        const scores = [];
        
        for (const [dbName, signature] of Object.entries(this.intentSignatures)) {
            const score = this.similarity(signature, queryVector);
            scores.push({ database: dbName, confidence: score });
        }
        
        // Sort by confidence
        scores.sort((a, b) => b.confidence - a.confidence);
        
        console.log("📊 Intent Analysis:", scores.map(s => 
            `${s.database}: ${Math.round(s.confidence * 100)}%`
        ).join(' | '));
        
        // Determine which databases to search
        const targets = [];
        
        // Primary database (highest confidence)
        if (scores[0].confidence >= this.intentThreshold) {
            targets.push(scores[0].database);
        }
        
        // Secondary databases (for complex queries)
        for (let i = 1; i < scores.length; i++) {
            if (scores[i].confidence >= this.multiIntentThreshold && 
                scores[i].confidence > scores[0].confidence * 0.7) {
                targets.push(scores[i].database);
            }
        }
        
        // Fallback: search all if no strong match
        if (targets.length === 0) {
            console.log("⚠️ No strong intent match, searching all databases");
            return ['activities', 'areas', 'decision104'];
        }
        
        console.log(`🎯 Target databases: [${targets.join(', ')}]`);
        return targets;
    }

    /**
     * Vector search within a specific database
     */
    vectorSearch(queryVector, database, topK = 5) {
        const results = [];
        
        for (const item of database) {
            if (!item.vector || !Array.isArray(item.vector)) {
                console.warn("⚠️ Invalid item (missing vector):", item.id);
                continue;
            }
            
            const score = this.similarity(queryVector, item.vector);
            results.push({
                id: item.id,
                score: score,
                data: item
            });
        }
        
        // Sort and return top K
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    /**
     * Keyword-based scoring (for hybrid approach)
     */
    keywordScore(query, text) {
        if (!text) return 0;
        
        const queryTokens = query.toLowerCase()
            .replace(/[^\u0600-\u06FF\w\s]/g, '') // Keep Arabic + alphanumeric
            .split(/\s+/)
            .filter(t => t.length > 2);
        
        const textLower = text.toLowerCase();
        let matches = 0;
        
        for (const token of queryTokens) {
            if (textLower.includes(token)) {
                matches++;
            }
        }
        
        return queryTokens.length > 0 ? matches / queryTokens.length : 0;
    }

    /**
     * Hybrid search combining vector similarity and keyword matching
     */
    hybridSearch(query, queryVector, database, topK = 5) {
        const results = [];
        
        for (const item of database) {
            if (!item.vector || !Array.isArray(item.vector)) continue;
            
            // Vector similarity (70% weight)
            const vectorScore = this.similarity(queryVector, item.vector);
            
            // Keyword matching (30% weight)
            const searchableText = [
                item.name_ar,
                item.name_en,
                item.description,
                item.activity_name
            ].filter(Boolean).join(' ');
            
            const keywordScore = this.keywordScore(query, searchableText);
            
            // Combined score
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
        if (!this.isReady) await this.initialize();
        
        const {
            topK = 5,
            useHybrid = true,
            minScore = 0.3
        } = options;
        
        console.log(`\n🔍 Search Query: "${query}"`);
        
        // Step 1: Convert query to vector
        const queryVector = await this.embed(query);
        
        // Step 2: Classify intent and determine target databases
        const targetDatabases = await this.classifyIntent(queryVector);
        
        // Step 3: Search in each target database
        const allResults = [];
        
        for (const dbName of targetDatabases) {
            const database = this.databases[dbName];
            
            if (!database || database.length === 0) {
                console.warn(`⚠️ Database "${dbName}" is empty or missing`);
                continue;
            }
            
            console.log(`🔎 Searching in [${dbName}]...`);
            
            const results = useHybrid 
                ? this.hybridSearch(query, queryVector, database, topK)
                : this.vectorSearch(queryVector, database, topK);
            
            // Add database source to results
            results.forEach(r => {
                r.source = dbName;
                allResults.push(r);
            });
        }
        
        // Step 4: Sort all results and filter by minimum score
        const finalResults = allResults
            .sort((a, b) => (b.finalScore || b.score) - (a.finalScore || a.score))
            .filter(r => (r.finalScore || r.score) >= minScore)
            .slice(0, topK);
        
        // Step 5: Return structured response
        const response = {
            query: query,
            targetDatabases: targetDatabases,
            resultsCount: finalResults.length,
            results: finalResults,
            topMatch: finalResults[0] || null,
            confidence: finalResults[0] ? (finalResults[0].finalScore || finalResults[0].score) : 0
        };
        
        console.log(`✅ Found ${finalResults.length} results`);
        if (finalResults.length > 0) {
            console.log(`🏆 Top match: ${finalResults[0].id} (${Math.round(response.confidence * 100)}%)`);
        }
        
        return response;
    }
}

// Export singleton instance
export const hybridEngine = new HybridSearchEngine();
