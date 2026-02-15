/****************************************************************************
 * 🧠 HybridSearchEngine V8 - THE UNIFIED SURGICAL EDITION
 * * ✅ COMPREHENSIVE: Supports Activities, Areas, and Decision 104
 * ✅ SMART DATA: Reads from unified vector_knowledge_db.json
 * ✅ POLISHED: Handles professional Arabic placeholders
 ****************************************************************************/

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

env.allowLocalModels = false;
env.useBrowserCache = true;

class HybridSearchEngine {
    constructor() {
        this.embedder = null;
        this.databases = { activities: [], areas: [], decision104: [] };
        this.intentSignatures = {};
        this.isReady = false;
        this.intentThreshold = 0.45; 
    }

    decodeVector(base64String) {
        try {
            const binaryString = atob(base64String);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
            return Array.from(new Float32Array(bytes.buffer));
        } catch (e) { return null; }
    }

    // --- الموضع المعدل 1: تهيئة موحدة لكل القواعد ---
    async initialize() {
        if (this.isReady) return;
        try {
            this.embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
            
            const res = await fetch('vector_knowledge_db.json');
            const fullData = await res.json();

            // جراحة: توزيع البيانات على الأقسام الثلاثة وفك تشفيرها
            this.databases.activities = this.normalizeData(fullData.activities, 'activities');
            this.databases.areas = this.normalizeData(fullData.areas, 'areas');
            this.databases.decision104 = this.normalizeData(fullData.decision104, 'decision104');

            this.intentSignatures = {
                activities: await this.embed('أنشطة صناعية تراخيص متطلبات فنية'),
                areas: await this.embed('مناطق صناعية مواقع جغرافية خريطة ولاية'),
                decision104: await this.embed('إعفاءات ضريبية حوافز استثمارية قرار 104')
            };
            this.isReady = true;
            console.log("✅ المحرك الموحد جاهز (أنشطة + مناطق + قرار 104)");
        } catch (error) { console.error("Initialization failed", error); }
    }

    // --- الموضع المعدل 2: معالجة البيانات بما يخدم الأقسام الثلاثة ---
    normalizeData(items, dbName) {
        if (!Array.isArray(items)) return [];
        return items.map(item => ({
            id: item.id,
            vector: this.decodeVector(item.vector),
            // نأخذ الاسم من أي حقل متاح حسب نوع القاعدة
            text: item.content["الاسم"] || item.content["النشاط_المحدد"] || "بيانات غير مسمية",
            dbName: dbName,
            original_data: item.content 
        })).filter(i => i.vector !== null);
    }

    async embed(text) {
        const queryText = `query: ${text.replace(/^(query:|passage:)\s*/, '')}`;
        const output = await this.embedder(queryText, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    similarity(vecA, vecB) {
        let dot = 0, nA = 0, nB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i] * vecB[i];
            nA += vecA[i] * vecA[i];
            nB += vecB[i] * vecB[i];
        }
        return dot / (Math.sqrt(nA) * Math.sqrt(nB));
    }

    // --- الموضع المعدل 3: البحث بالكلمات ليشمل تفاصيل المناطق والأنشطة ---
    keywordScore(query, item) {
        const q = query.toLowerCase();
        const d = item.original_data;
        // هنا وسعنا النطاق ليشمل كل أنواع البيانات (محافظة، ولاية، وصف، قطاع)
        const searchableText = [
            item.text,
            d["الوصف"], d["الجهة"], d["المحافظة"], 
            d["جهة_الولاية"], d["النشاط_الرئيسي"], d["القطاع_العام"]
        ].filter(Boolean).join(' ').toLowerCase();

        const tokens = q.split(/\s+/).filter(t => t.length > 2);
        if (tokens.length === 0) return 0;
        const matches = tokens.filter(t => searchableText.includes(t)).length;
        return matches / tokens.length;
    }

    async search(query, options = { topK: 5 }) {
        if (!this.isReady) await this.initialize();
        const queryVector = await this.embed(query);
        
        // تصنيف النية (Intent)
        const scores = Object.entries(this.intentSignatures).map(([db, sig]) => ({
            db, confidence: this.similarity(sig, queryVector)
        })).sort((a, b) => b.confidence - a.confidence);
        
        const targets = scores[0].confidence > this.intentThreshold ? [scores[0].db] : ['activities', 'decision104', 'areas'];

        let allResults = [];
        for (const dbName of targets) {
            const db = this.databases[dbName];
            const vecRes = db.map(item => ({ id: item.id, score: this.similarity(queryVector, item.vector), data: item }))
                             .sort((a, b) => b.score - a.score).slice(0, 20);
            
            const keyRes = db.map(item => ({ id: item.id, score: this.keywordScore(query, item), data: item }))
                             .filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 20);

            // دمج النتائج بتقنية RRF
            const combined = this.rerankRRF(vecRes, keyRes);
            allResults.push(...combined.map(c => ({ ...c, dbName })));
        }

        const final = allResults.sort((a, b) => b.score - a.score).slice(0, options.topK);
        return {
            query,
            intent: final[0]?.dbName,
            results: final.map(f => ({
                id: f.id,
                score: f.score,
                cosine: f.cosine,
                db: f.dbName,
                // إرجاع البيانات اللبقة كاملة للواجهة
                display: f.content.original_data 
            }))
        };
    }

    rerankRRF(vL, kL, k = 60) {
        const s = new Map();
        vL.forEach((r, i) => s.set(r.id, { rrf: 1/(k+i+1), cos: r.score, data: r.data }));
        kL.forEach((r, i) => {
            const e = s.get(r.id) || { rrf: 0, cos: 0, data: r.data };
            e.rrf += 1/(k+i+1);
            s.set(r.id, e);
        });
        return Array.from(s.entries()).map(([id, v]) => ({ id, score: v.rrf, cosine: v.cos, content: v.data }));
    }
}

export const hybridEngine = new HybridSearchEngine();
