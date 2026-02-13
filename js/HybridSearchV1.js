/****************************************************************************
 * 🧠 HybridSearchEngine V4 - E5 Model + Fixed Everything
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
        
        // Lower thresholds for better recall
        this.intentThreshold = 0.25;
        this.multiIntentThreshold = 0.20;
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

            // Intent signatures with E5 prefix
            this.intentSignatures = {
                activities: await this.embed('query: industrial activities manufacturing licenses permits'),
                areas: await this.embed('query: geographic locations industrial zones regions'),
                decision104: await this.embed('query: tax exemptions financial incentives decree 104')
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

    async embed(text) {
        if (!this.embedder) throw new Error("Model not ready");
        
        // E5 requires "query: " prefix for queries
        const prefixedText = text.startsWith('query:') ? text : `query: ${text}`;
        
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
        
        if (scores[0].confidence >= this.intentThreshold) {
            targets.push(scores[0].database);
        }
        
        for (let i = 1; i < scores.length; i++) {
            if (scores[i].confidence >= this.multiIntentThreshold && 
                scores[i].confidence > scores[0].confidence * 0.75) {
                targets.push(scores[i].database);
            }
        }
        
        if (targets.length === 0) {
            console.log("⚠️ Low confidence, searching all");
            return ['activities', 'areas', 'decision104'];
        }
        
        console.log(`🎯 Targets: [${targets.join(', ')}]`);
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
        const searchableText = [
            item.name_ar,
            item.name_en,
            item.description,
            item.activity_name,
            item.location,
            item.area_name,
            item.isic_code
        ].filter(Boolean).join(' ').toLowerCase();
        
        // Split query into tokens
        const tokens = queryLower
            .replace(/[^\u0600-\u06FF\w\s]/g, ' ')
            .split(/\s+/)
            .filter(t => t.length > 2);
        
        if (tokens.length === 0) return 0;
        
        let matches = 0;
        for (const token of tokens) {
            if (searchableText.includes(token)) {
                matches++;
            }
        }
        
        return matches / tokens.length;
    }

    hybridSearch(query, queryVector, database, topK = 10) {
        const results = [];
        
        for (const item of database) {
            if (!item.vector || !Array.isArray(item.vector)) continue;
            
            const vectorScore = this.similarity(queryVector, item.vector);
            const keywordScore = this.keywordScore(query, item);
            
            // 75% vector, 25% keyword
            const finalScore = (vectorScore * 0.75) + (keywordScore * 0.25);
            
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
            minScore = 0.15  // Lower threshold for E5
        } = options;
        
        console.log(`\n🔍 Query: "${query}"`);
        
        const queryVector = await this.embed(query);
        const targetDatabases = await this.classifyIntent(queryVector);
        
        const allResults = [];
        
        for (const dbName of targetDatabases) {
            const database = this.databases[dbName];
            
            if (!database || database.length === 0) {
                console.warn(`⚠️ Empty: ${dbName}`);
                continue;
            }
            
            console.log(`🔎 Searching [${dbName}] (${database.length} items)...`);
            
            const results = useHybrid 
                ? this.hybridSearch(query, queryVector, database, topK * 2)
                : this.vectorSearch(queryVector, database, topK * 2);
            
            results.forEach(r => {
                r.source = dbName;
                allResults.push(r);
            });
        }
        
        const finalResults = allResults
            .sort((a, b) => (b.finalScore || b.score) - (a.finalScore || a.score))
            .filter(r => (r.finalScore || r.score) >= minScore)
            .slice(0, topK);
        
        console.log(`✅ Found ${finalResults.length} results`);
        if (finalResults.length > 0) {
            const top = finalResults[0];
            console.log(`🏆 Top: ${top.id} (${Math.round((top.finalScore || top.score) * 100)}%) [${top.source}]`);
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
