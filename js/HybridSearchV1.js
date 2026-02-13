// HybridSearchV1.js - النسخة المصححة للعمل على GitHub Pages
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// 🛠️ إصلاح هام جداً: إجبار المكتبة على التحميل من Hugging Face CDN وليس من سيرفرك الشخصي
env.allowLocalModels = false;
env.useBrowserCache = true;

class HybridSearchEngine {
    constructor() {
        this.embedder = null;
        this.vectors = { activities: [], areas: [], decision104: [] };
        this.isReady = false;
        this.intentVectors = null;
    }

    async initialize() {
        if (this.isReady) return;
        console.log("⏳ جاري تحميل العقل المتجهي (Xenova MiniLM)...");
        
        try {
            // 1. تحميل الموديل من الإنترنت (سيفعل ذلك مرة واحدة فقط ويخزنه في المتصفح)
            this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            
            // 2. تحميل ملفات المتجهات من مجلد js (تم إضافة js/ للمسار)
            console.log("📂 جاري تحميل ملفات المتجهات من مجلد js...");
            
            const loadJSON = async (filename) => {
                const res = await fetch(`js/${filename}`); // ✅ تعديل المسار هنا
                if (!res.ok) throw new Error(`فشل تحميل الملف: js/${filename}`);
                return res.json();
            };

            this.vectors.activities = await loadJSON('activities_vectors.json');
            this.vectors.areas = await loadJSON('areas_vectors.json');
            this.vectors.decision104 = await loadJSON('decision104_vectors.json');

            // 3. تحويل جمل النوايا لمتجهات (Pre-calculation)
            this.intentVectors = {
                activities: await this.getVector('تراخيص وأوراق مطلوبة وإجراءات بدء نشاط'),
                areas: await this.getVector('مواقع ومساحات المناطق الصناعية والمحافظات والتبعية'),
                decision104: await this.getVector('حوافز وإعفاءات وقطاعات قرار رئيس الوزراء 104')
            };

            this.isReady = true;
            console.log("✅ المحرك المتجهي جاهز للعمل 100%");
        } catch (error) {
            console.error("❌ فشل تهيئة المحرك المتجهي:", error);
            throw error; // نمرر الخطأ ليتم معالجته في gpt_agent
        }
    }

    async getVector(text) {
        if (!this.embedder) throw new Error("الموديل لم يتم تحميله بعد");
        const output = await this.embedder(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0, normA = 0, normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    async detectIntent(queryVector) {
        if (!this.intentVectors) return 'activities';
        let bestIntent = 'activities';
        let maxScore = -1;
        
        for (let [intentId, intentVec] of Object.entries(this.intentVectors)) {
            const score = this.cosineSimilarity(intentVec, queryVector);
            if (score > maxScore) {
                maxScore = score;
                bestIntent = intentId;
            }
        }
        return bestIntent;
    }

    async search(query) {
        // التأكد من الجاهزية
        if (!this.isReady) {
            await this.initialize();
        }

        const queryVector = await this.getVector(query);
        const targetDB = await this.detectIntent(queryVector);
        
        console.log(`🎯 توجيه البحث لـ: ${targetDB}`);

        const results = this.vectors[targetDB].map(item => ({
            id: item.id,
            score: this.cosineSimilarity(queryVector, item.vector)
        }));

        return {
            intent: targetDB,
            matches: results.sort((a, b) => b.score - a.score).slice(0, 5)
        };
    }
}

export const hybridEngine = new HybridSearchEngine();
