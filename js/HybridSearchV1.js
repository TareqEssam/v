import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

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
            this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            
            // تحميل البيانات
            this.vectors.activities = await fetch('activities_vectors.json').then(res => res.json());
            this.vectors.areas = await fetch('areas_vectors.json').then(res => res.json());
            this.vectors.decision104 = await fetch('decision104_vectors.json').then(res => res.json());

            // pre-calculate intent embeddings to save time
            this.intentVectors = {
                activities: await this.getVector('تراخيص وأوراق مطلوبة وإجراءات بدء نشاط'),
                areas: await this.getVector('مواقع ومساحات المناطق الصناعية والمحافظات والتبعية'),
                decision104: await this.getVector('حوافز وإعفاءات وقطاعات قرار رئيس الوزراء 104')
            };

            this.isReady = true;
            console.log("✅ المحرك المتجهي جاهز 100%");
        } catch (error) {
            console.error("❌ فشل تهيئة المحرك المتجهي:", error);
        }
    }

    async getVector(text) {
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
        if (!this.isReady) await this.initialize();

        const queryVector = await this.getVector(query);
        const targetDB = await this.detectIntent(queryVector);
        
        console.log(`🎯 قاعدة البيانات المستهدفة: ${targetDB}`);

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
