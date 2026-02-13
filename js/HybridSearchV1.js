this.embedder = await pipeline/****************************************************************************
 * 🧠 HybridSearchEngine V3.2 - Fixed JSON Structure
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
        
        this.intentThreshold = 0.35;
        this.multiIntentThreshold = 0.30;
    }

    async initialize() {
        if (this.isReady) return;
        console.log("⏳ Initializing Semantic Router...");
        
        try {
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

            // Intent signatures
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
     * ✅ الإصلاح الرئيسي: معالجة بنية JSON الصحيحة
     */
    normalizeData(jsonData) {
        // Case 1: البيانات موجودة في خاصية "data"
        if (jsonData.data && Array.isArray(jsonData.data)) {
            console.log(`📦 Extracted ${jsonData.data.length} items from "data" property`);
            return jsonData.data;
        }
        
        // Case 2: البيانات موجودة في خاصية "items"
        if (jsonData.items && Array.isArray(jsonData.items)) {
            console.log(`📦 Extracted ${jsonData.items.length} items from "items" property`);
            return jsonData.items;
        }
        
        // Case 3: الملف نفسه Array
        if (Array.isArray(jsonData)) {
            console.log(`📦 Data is already an array: ${jsonData.length} items`);
            return jsonData;
        }
        
        // Case 4: Object يحتوي على بيانات مباشرة (استبعاد metadata)
        if (typeof jsonData === 'object' && jsonData !== null) {
            // فلترة المفاتيح التي هي metadata
            const metadataKeys = ['version', 'model', 'dimension', 'count', 'database', 'created_at'];
            const dataEntries = Object.entries(jsonData)
                .filter(([key]) => !metadataKeys.includes(key))
                .map(([_, value]) => value)
                .filter(item => item && typeof item === 'object' && item.vector);
            
            if (dataEntries.length > 0) {
                console.log(`📦 Extracted ${dataEntries.length} items from object properties`);
                return dataEntries;
            }
        }
        
        console.warn("⚠️ Unexpected data format, returning empty array");
        return [];
    }

    async embed(text) {
        if (!this.embedder) throw new Error("Model not ready");
        const output = await this.embedder(text, { pooling: 'mean', normalize: true });
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
        
        console.log("📊 Intent Analysis:", scores.map(s => 
            `${s.database}: ${Math.round(s.confidence * 100)}%`
        ).join(' | '));
        
        const targets = [];
        
        if (scores[0].confidence >= this.intentThreshold) {
            targets.push(scores[0].database);
        }
        
        for (let i = 1; i < scores.length; i++) {
            if (scores[i].confidence >= this.multiIntentThreshold && 
                scores[i].confidence > scores[0].confidence * 0.7) {
                targets.push(scores[i].database);
            }
        }
        
        if (targets.length === 0) {
            console.log("⚠️ No strong intent match, searching all databases");
            return ['activities', 'areas', 'decision104'];
        }
        
        console.log(`🎯 Target databases: [${targets.join(', ')}]`);
        return targets;
    }

    vectorSearch(queryVector, database, topK = 5) {
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

    keywordScore(query, text) {
        if (!text) return 0;
        
        const queryTokens = query.toLowerCase()
            .replace(/[^\u0600-\u06FF\w\s]/g, '')
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

    hybridSearch(query, queryVector, database, topK = 5) {
        const results = [];
        
        for (const item of database) {
            if (!item.vector || !Array.isArray(item.vector)) continue;
            
            const vectorScore = this.similarity(queryVector, item.vector);
            
            const searchableText = [
                item.name_ar,
                item.name_en,
                item.description,
                item.activity_name,
                item.location,
                item.area_name
            ].filter(Boolean).join(' ');
            
            const keywordScore = this.keywordScore(query, searchableText);
            
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
            minScore = 0.3
        } = options;
        
        console.log(`\n🔍 Search Query: "${query}"`);
        
        const queryVector = await this.embed(query);
        const targetDatabases = await this.classifyIntent(queryVector);
        
        const allResults = [];
        
        for (const dbName of targetDatabases) {
            const database = this.databases[dbName];
            
            if (!database || database.length === 0) {
                console.warn(`⚠️ Database "${dbName}" is empty or missing`);
                continue;
            }
            
            console.log(`🔎 Searching in [${dbName}] (${database.length} items)...`);
            
            const results = useHybrid 
                ? this.hybridSearch(query, queryVector, database, topK)
                : this.vectorSearch(queryVector, database, topK);
            
            results.forEach(r => {
                r.source = dbName;
                allResults.push(r);
            });
        }
        
        const finalResults = allResults
            .sort((a, b) => (b.finalScore || b.score) - (a.finalScore || a.score))
            .filter(r => (r.finalScore || r.score) >= minScore)
            .slice(0, topK);
        
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
            console.log(`🏆 Top match: ${finalResults[0].id} (${Math.round(response.confidence * 100)}%) from [${finalResults[0].source}]`);
        }
        
        return response;
    }
}

export const hybridEngine = new HybridSearchEngine();

