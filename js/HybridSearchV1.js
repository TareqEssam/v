/****************************************************************************
 * 🧠 HybridSearchEngine V7 - PRODUCTION FINAL
 * 
 * ✅ CRITICAL FIX: Base64 Vector Decompression
 * 
 * Issue: Vectors in JSON are stored as Base64-encoded Float32 arrays
 * Solution: Decode Base64 → Convert to Float32Array → Extract values
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
        
        this.intentThreshold = 0.28;
        this.multiIntentThreshold = 0.24;
    }

    /**
     * Decode Base64-encoded vector to Float32Array
     * CRITICAL: Python saves vectors as base64(float32_bytes)
     */
    decodeVector(base64String) {
        try {
            // Decode base64 to binary string
            const binaryString = atob(base64String);
            
            // Convert binary string to Uint8Array
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Convert Uint8Array to Float32Array
            const float32Array = new Float32Array(bytes.buffer);
            
            // Convert to regular array
            return Array.from(float32Array);
            
        } catch (error) {
            console.error("Failed to decode vector:", error);
            return null;
        }
    }

    async initialize() {
        if (this.isReady) return;
        console.log("⏳ Initializing E5 Hybrid Search Engine...");
        
        try {
            // Load E5 model
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

            // Verify vector decoding
            if (activities.length > 0 && activities[0].vector) {
                console.log(`📊 Sample vector: [${activities[0].vector.slice(0, 3).map(v => v.toFixed(4)).join(', ')}...] (length: ${activities[0].vector.length})`);
            }

            // Create intent signatures
            this.intentSignatures = {
                activities: await this.embed('أنشطة صناعية تراخيص تشغيل متطلبات'),
                areas: await this.embed('مناطق صناعية مواقع جغرافية'),
                decision104: await this.embed('إعفاءات ضريبية حوافز استثمارية قرار 104')
            };

            this.isReady = true;
            console.log("✅ E5 Hybrid Search Engine ready!");
            
        } catch (error) {
            console.error("❌ Initialization failed:", error);
            throw error;
        }
    }

    normalizeData(jsonData) {
        let items = [];
        
        // Extract items array
        if (jsonData.data && Array.isArray(jsonData.data)) {
            items = jsonData.data;
            console.log(`📦 Extracted ${items.length} items from 'data' property`);
        } else if (Array.isArray(jsonData)) {
            items = jsonData;
            console.log(`📦 Data is array: ${items.length} items`);
        } else {
            console.warn("⚠️ Unexpected data format");
            return [];
        }
        
        // Decode vectors from Base64
        const decodedItems = [];
        let successCount = 0;
        let failCount = 0;
        
        for (const item of items) {
            if (typeof item.vector === 'string') {
                // Vector is Base64-encoded - decode it
                const decodedVector = this.decodeVector(item.vector);
                if (decodedVector && decodedVector.length > 0) {
                    decodedItems.push({
                        ...item,
                        vector: decodedVector
                    });
                    successCount++;
                } else {
                    console.warn(`Failed to decode vector for item: ${item.id}`);
                    failCount++;
                }
            } else if (Array.isArray(item.vector)) {
                // Vector is already an array
                decodedItems.push(item);
                successCount++;
            } else {
                console.warn(`Invalid vector format for item: ${item.id}`);
                failCount++;
            }
        }
        
        console.log(`✅ Decoded ${successCount} vectors, ${failCount} failed`);
        
        return decodedItems;
    }

    async embed(text) {
        if (!this.embedder) throw new Error("Embedder not initialized");
        
        const queryText = text.startsWith('query:') ? text : `query: ${text}`;
        const output = await this.embedder(queryText, { 
            pooling: 'mean', 
            normalize: true 
        });
        
        return Array.from(output.data);
    }

    similarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) {
            return 0;
        }
        
        let dot = 0, normA = 0, normB = 0;
        
        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        
        if (normA === 0 || normB === 0) return 0;
        
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
                scores[i].confidence >= scores[0].confidence * 0.75) {
                targets.push(scores[i].database);
            }
        }
        
        if (targets.length === 0) {
            console.log("⚠️ Low confidence - searching all");
            return ['activities', 'decision104', 'areas'];
        }
        
        console.log(`🎯 Targets: [${targets.join(', ')}]`);
        return targets;
    }

    vectorSearch(queryVector, database, topK = 15) {
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
        
        // Extract searchable text
        const searchableText = [
            item.text,
            item.original_data?.name_ar,
            item.original_data?.name_en,
            item.original_data?.description,
            item.original_data?.activity_name,
            item.original_data?.sector,
            item.original_data?.main_activity
        ].filter(Boolean).join(' ').toLowerCase();
        
        const tokens = queryLower
            .replace(/[^\u0600-\u06FF\u0660-\u0669\w\s]/g, ' ')
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

    hybridSearch(query, queryVector, database, topK = 15) {
        const results = [];
        
        for (const item of database) {
            if (!item.vector || !Array.isArray(item.vector)) continue;
            
            const vectorScore = this.similarity(queryVector, item.vector);
            const keywordScore = this.keywordScore(query, item);
            
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
            minScore = 0.15,
            relativeThreshold = 0.70
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
                ? this.hybridSearch(query, queryVector, database, topK * 3)
                : this.vectorSearch(queryVector, database, topK * 3);
            
            results.forEach(r => {
                r.source = dbName;
                allResults.push(r);
            });
        }
        
        const sortedResults = allResults
            .sort((a, b) => (b.finalScore || b.score) - (a.finalScore || a.score));
        
        const topScore = sortedResults[0] ? (sortedResults[0].finalScore || sortedResults[0].score) : 0;
        const dynamicMinScore = Math.max(minScore, topScore * relativeThreshold);
        
        console.log(`📊 Top: ${Math.round(topScore * 100)}%, Threshold: ${Math.round(dynamicMinScore * 100)}%`);
        
        const finalResults = sortedResults
            .filter(r => (r.finalScore || r.score) >= dynamicMinScore)
            .slice(0, topK);
        
        console.log(`✅ Found ${finalResults.length} results (from ${allResults.length})`);
        
        if (finalResults.length > 0) {
            const top = finalResults[0];
            console.log(`🏆 ${top.id} (${Math.round((top.finalScore || top.score) * 100)}%) [${top.source}]`);
            if (top.vectorScore !== undefined) {
                console.log(`   Vec: ${Math.round(top.vectorScore * 100)}%, Kwd: ${Math.round(top.keywordScore * 100)}%`);
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
