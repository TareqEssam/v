/****************************************************************************
 * 🧠 HybridSearchEngine V7 - PRODUCTION FINAL (SCIENTIFIC REFACTOR)
 * 
 * ✅ CRITICAL FIX: Base64 Vector Decompression
 * ✅ SCIENTIFIC UPGRADE: Context injection, strict intent routing, RRF ranking
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
            const binaryString = atob(base64String);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
            // جراحة: التأكد من سلامة الـ Buffer وفكه كـ Float32 بشكل مباشر
            return Array.from(new Float32Array(bytes.buffer));
        } catch (error) {
            console.error("Vector Decode Failed:", error);
            return null;
        }
    }

    async initialize() {
        if (this.isReady) return;
        console.log("⏳ Initializing E5 Hybrid Search Engine...");
        
        try {
            this.embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
            
            // جراحة: تحميل الملف الموحد الجديد وتوزيعه دلالياً
            const res = await fetch('vector_knowledge_db.json');
            if (!res.ok) throw new Error("فشل تحميل قاعدة البيانات الموحدة");
            const fullData = await res.json();

            this.databases.activities = this.normalizeData(fullData.activities);
            this.databases.areas = this.normalizeData(fullData.areas);
            this.databases.decision104 = this.normalizeData(fullData.decision104);

            console.log(`✅ Loaded: activities(${this.databases.activities.length}), areas(${this.databases.areas.length}), decision104(${this.databases.decision104.length})`);

            if (this.databases.activities.length > 0 && this.databases.activities[0].vector) {
                console.log(`📊 Sample vector: [${this.databases.activities[0].vector.slice(0, 3).map(v => v.toFixed(4)).join(', ')}...] (length: ${this.databases.activities[0].vector.length})`);
            }

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

    /**
     * Normalize and decode items from the raw JSON data
     */
    normalizeData(items) {
        if (!Array.isArray(items)) return [];
        
        return items.map(item => ({
            id: item.id,
            vector: this.decodeVector(item.vector),
            text: item.content["الاسم"] || item.content["النشاط_المحدد"], // للبحث بالكلمات
            original_data: item.content // الحفاظ على البيانات اللبقة كاملة
        })).filter(i => i.vector !== null);
    }

    async embed(text) {
        if (!this.embedder) throw new Error("Embedder not initialized");
        
        // نضمن إزالة أي بادئة قديمة وإضافة بادئة البحث الصحيحة لنموذج E5
        const cleanText = text.replace(/^(query:|passage:)\s*/, '');
        const queryText = `query: ${cleanText}`;
        
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

    /**
     * 🧠 Context-aware query preparation
     */
    async prepareQuery(query) {
        const context = window.AgentMemory ? window.AgentMemory.getContext() : null;
        let enhancedQuery = query;

        // Detect follow-up question (short, pronoun, etc.)
        const isFollowUp = /^(ما|هي|هو|كم|اين|فين|شروط|حوافز|تراخيص|قرار|ده|دي)/i.test(query.trim());
        
        if (isFollowUp && context && context.data) {
            const contextName = context.data.text || context.data.name || "";
            // جراحة: نرسل الاستعلامين منفصلين للموديل ليقوم هو بالربط الدلالي بدلاً من الدمج النصي المشوه
            enhancedQuery = `query: ${query} context: ${contextName}`; 
            console.log("🧠 Semantic Context Linking:", enhancedQuery);
        }
        return enhancedQuery;
    }

    /**
     * 🎯 Strict intent routing with keyword override
     */
    async classifyIntent(query, queryVector) {
        const q = query.toLowerCase();
        
        // Hard keyword-based routing (domain filtering)
        if (q.includes("محافظة") || q.includes("منطقة صناعية") || q.includes("تبعية")) return ['areas'];
        if (q.includes("قرار 104") || q.includes("حافز") || q.includes("قطاع أ") || q.includes("قطاع ب")) return ['decision104'];
        if (q.includes("ترخيص") || q.includes("رخصة") || q.includes("مطلوب")) return ['activities'];

        // Semantic similarity with higher threshold (0.45)
        const scores = [];
        for (const [dbName, signature] of Object.entries(this.intentSignatures)) {
            const score = this.similarity(signature, queryVector);
            scores.push({ database: dbName, confidence: score });
        }
        scores.sort((a, b) => b.confidence - a.confidence);

        console.log("📊 Intent:", scores.map(s => 
            `${s.database}: ${Math.round(s.confidence * 100)}%`
        ).join(' | '));

        if (scores[0].confidence > 0.45) return [scores[0].database];
        
        return ['activities', 'decision104', 'areas']; // Fallback
    }

    /**
     * 🔀 Reciprocal Rank Fusion (RRF) for hybrid ranking
     */
    rerankRRF(vectorResults, keywordResults, k = 60) {
        const scores = new Map();

        vectorResults.forEach((res, index) => {
            const rrfScore = 1.0 / (k + index + 1);
            scores.set(res.id, { 
                rrfScore: rrfScore,
                cosineScore: res.score,  // ← حفظ cosine similarity الأصلية
                score: rrfScore,         // للترتيب
                data: res.data, 
                source: 'vector' 
            });
        });

        keywordResults.forEach((res, index) => {
            const rrfScore = 1.0 / (k + index + 1);
            if (scores.has(res.id)) {
                const existing = scores.get(res.id);
                existing.score += rrfScore;
                existing.rrfScore += rrfScore;
                existing.source = 'hybrid';
            } else {
                scores.set(res.id, { 
                    rrfScore: rrfScore,
                    cosineScore: 0,  // من keyword فقط
                    score: rrfScore, 
                    data: res.data, 
                    source: 'keyword' 
                });
            }
        });

        return Array.from(scores.entries())
            .map(([id, val]) => ({ id, ...val }))
            .sort((a, b) => b.score - a.score);
    }

    /**
     * 🔍 Vector‑only search (used as one component)
     */
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

    /**
     * 🔤 Keyword score (used for keyword‑based ranking)
     */
    keywordScore(query, item) {
        const queryLower = query.toLowerCase();
        
        const d = item.original_data;
        const searchableText = [
            item.text,
            d["النشاط_الرئيسي"],
            d["القطاع_العام"],
            d["جهة_الولاية"],
            d["الجهة"],
            d["وصف"]
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

    /**
     * 🚀 Main search method (scientifically refactored)
     */
    async search(query, options = {}) {
        if (!this.isReady) await this.initialize();
        
        const { topK = 5 } = options;
        
        console.log(`\n🔍 Query: "${query}"`);
        
        const refinedQuery = await this.prepareQuery(query);
        const queryVector = await this.embed(refinedQuery);
        const targetDatabases = await this.classifyIntent(refinedQuery, queryVector);
        
        let allResults = [];
        
        for (const dbName of targetDatabases) {
            const db = this.databases[dbName];
            if (!db || db.length === 0) {
                console.warn(`⚠️ Empty: ${dbName}`);
                continue;
            }
            
            console.log(`🔎 Searching [${dbName}] (${db.length} items)...`);
            
            // Get top 20 from vector search
            const vectorResults = this.vectorSearch(queryVector, db, 20);
            
            // Get top 20 from keyword search (score > 0)
            const keywordResults = db
                .map(item => ({
                    id: item.id,
                    score: this.keywordScore(refinedQuery, item),
                    data: item
                }))
                .filter(r => r.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, 20);
            
            // Fuse with RRF
            const combined = this.rerankRRF(vectorResults, keywordResults);
            combined.forEach(r => r.dbName = dbName);
            
            allResults.push(...combined);
        }
        
        // Final global ranking
        const sortedResults = allResults.sort((a, b) => b.score - a.score);
        const finalResults = sortedResults.slice(0, topK);
        
        const topScore = finalResults.length > 0 ? finalResults[0].score : 0;
        
        console.log(`✅ Found ${finalResults.length} results (from ${allResults.length})`);
        if (finalResults.length > 0) {
            const top = finalResults[0];
            console.log(`🏆 ${top.id} - Cosine: ${Math.round((top.cosineScore || 0) * 100)}% | RRF: ${Math.round(top.score * 100)}% [${top.dbName}]`);
        }
        
        // جراحة: استخراج درجة التشابه الأصلية (Cosine) للنتيجة الأولى بدلاً من الرقم الثابت
        // استخراج Cosine Similarity الحقيقية من النتيجة الأولى
        const topCosineScore = finalResults[0]?.cosineScore || 0;

        return {
            query: query,
            intent: finalResults[0]?.dbName,
            results: finalResults.map(r => ({
                ...r,
                full_report: r.data.original_data // هذا السطر يضمن ظهور الحوافز والشروط والوصف والموقع
            })),
            confidence: topCosineScore,
            metadata: { generated_at: new Date().toISOString(), total_found: allResults.length }
        };
    }
}

export const hybridEngine = new HybridSearchEngine();
