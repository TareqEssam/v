// HybridSearchV1.js - المحرك الهجين الذكي
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

class HybridSearchEngine {
    constructor() {
        this.embedder = null;
        this.vectors = { activities: [], areas: [], decision104: [] };
        this.isReady = false;
    }

    // 1. تحميل المحرك والبيانات
    async initialize() {
        console.log("⏳ جاري تشغيل العقل المدبر...");
        this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        
        // تحميل ملفات المتجهات التي أنتجتها أنت
        this.vectors.activities = await fetch('activities_vectors.json').then(res => res.json());
        this.vectors.areas = await fetch('areas_vectors.json').then(res => res.json());
        this.vectors.decision104 = await fetch('decision104_vectors.json').then(res => res.json());
        
        this.isReady = true;
        console.log("✅ العقل المدبر جاهز للعمل!");
    }

    // 2. حساب التشابه (Cosine Similarity)
    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    // 3. المُوجّه الذكي (Router) - اكتشاف النية
    async detectIntent(queryVector) {
        // تعريف "بصمات" القواعد (هذه جمل نموذجية لكل قاعدة)
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
            if (score > maxScore) {
                maxScore = score;
                bestIntent = intent.id;
            }
        }
        return bestIntent;
    }

    // 4. البحث الفعلي
    async search(query) {
        if (!this.isReady) return { error: "المحرك لم يكتمل تحميله" };

        // تحويل السؤال لمتجه
        const output = await this.embedder(query, { pooling: 'mean', normalize: true });
        const queryVector = Array.from(output.data);

        // اكتشاف أي قاعدة بيانات نفتح
        const targetDB = await this.detectIntent(queryVector);
        console.log(`🎯 توجيه البحث إلى قاعدة: ${targetDB}`);

        // البحث داخل القاعدة المستهدفة
        const results = this.vectors[targetDB].map(item => ({
            id: item.id,
            score: this.cosineSimilarity(queryVector, item.vector)
        }));

        // ترتيب النتائج (الأعلى تشابهاً أولاً)
        return results.sort((a, b) => b.score - a.score).slice(0, 5);
    }
}

export const hybridEngine = new HybridSearchEngine();
