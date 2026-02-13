// HybridSearchV1.js
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

class HybridSearchEngine {
    constructor() {
        this.embedder = null;
        this.vectors = { activities: [], areas: [], decision104: [] };
        this.isReady = false;
    }

    async initialize() {
        if (this.isReady) return;
        try {
            console.log("⏳ جاري تحميل الموديل الذكي (all-MiniLM-L6-v2)...");
            this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            
            // تأكد من أن المسار يبدأ بـ / أو اسم المجلد إذا كانت الملفات داخل مجلد
            console.log("⏳ جاري تحميل ملفات المتجهات...");
            this.vectors.activities = await fetch('activities_vectors.json').then(res => res.json());
            this.vectors.areas = await fetch('areas_vectors.json').then(res => res.json());
            this.vectors.decision104 = await fetch('decision104_vectors.json').then(res => res.json());
            
            this.isReady = true;
            console.log("✅ العقل المدبر جاهز تماماً للبحث بالمعنى!");
        } catch (error) {
            console.error("❌ فشل في تهيئة المحرك المتجهي:", error);
        }
    }

    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0; let normA = 0; let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    async detectIntent(queryVector) {
        const intents = [
            { id: 'activities', text: 'تراخيص وأوراق مطلوبة وإجراءات بدء نشاط' },
            { id: 'areas', text: 'مواقع ومساحات المناطق الصناعية والمحافظات والتبعية' },
            { id: 'decision104', text: 'حوافز وإعفاءات وقطاعات قرار رئيس الوزراء 104' }
        ];
        let bestIntent = 'activities';
        let maxScore = -1;
        for (let intent of intents) {
            const intentEmbedding = await this.embedder(intent.text, { pooling: 'mean', normalize: true });
            const score = this.cosineSimilarity(Array.from(intentEmbedding.data), queryVector);
            if (score > maxScore) { maxScore = score; bestIntent = intent.id; }
        }
        return bestIntent;
    }

    async search(query) {
        if (!this.isReady) {
            console.warn("⚠️ المحرك غير جاهز، يحاول التهيئه الآن...");
            await this.initialize();
        }
        const output = await this.embedder(query, { pooling: 'mean', normalize: true });
        const queryVector = Array.from(output.data);
        const targetDB = await this.detectIntent(queryVector);
        console.log(`🎯 العقل المتجهي وجه البحث إلى: ${targetDB}`);

        const results = this.vectors[targetDB].map(item => ({
            id: item.id,
            score: this.cosineSimilarity(queryVector, item.vector)
        }));
        return results.sort((a, b) => b.score - a.score).slice(0, 5);
    }
}
export const hybridEngine = new HybridSearchEngine();
