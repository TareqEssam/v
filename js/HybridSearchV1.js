/****************************************************************************
 * 🧠 HybridSearchEngine V2 - Surgical Semantic Router Edition
 * 
 * الميزات الاحترافية:
 * 1. تصنيف النوايا الاحتمالي (Probabilistic Intent Classification)
 * 2. عزل النطاق المعرفي (Domain Isolation) لمنع تداخل القواعد
 * 3. دعم التوسع الديناميكي لقواعد بيانات جديدة
 * 4. تحسين الدقة باستخدام مرابط دلالية (Semantic Anchors) عالية الجودة
 ****************************************************************************/

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// إعدادات البيئة للعمل على GitHub Pages و Hugging Face CDN
env.allowLocalModels = false;
env.useBrowserCache = true;

class HybridSearchEngine {
    constructor() {
        this.embedder = null;
        this.vectors = { activities: [], areas: [], decision104: [] };
        this.intentAnchors = {};
        this.isReady = false;
        
        // عتبات الثقة لكل قاعدة لضبط الحساسية
        this.thresholds = {
            activities: 0.60,
            areas: 0.70,      // المناطق تحتاج ثقة أعلى لمنع "سرقة" الأسئلة
            decision104: 0.55 // القرار 104 حساس للكلمات المالية لذا العتبة مرنة
        };
    }

    /**
     * تهيئة المحرك وتحميل الموديل والبيانات
     */
    async initialize() {
        if (this.isReady) return;
        console.log("⏳ جاري تشغيل الموجه الدلالي (Semantic Router)...");
        
        try {
            // تحميل الموديل
            this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            
            // تحميل ملفات المتجهات
            const loadJSON = async (filename) => {
                const res = await fetch(`js/${filename}`);
                if (!res.ok) throw new Error(`فشل تحميل: ${filename}`);
                return res.json();
            };

            [this.vectors.activities, this.vectors.areas, this.vectors.decision104] = await Promise.all([
                loadJSON('activities_vectors.json'),
                loadJSON('areas_vectors.json'),
                loadJSON('decision104_vectors.json')
            ]);

            // توليد بصمات النوايا (Intent Fingerprints)
            // ملاحظة: الوصف بالإنجليزية يعطي دقة فصل أعلى في هذا الموديل الصغير
            this.intentAnchors = {
                activities: await this.getVector('Administrative procedures, operating licenses, industrial registry, and official government documents for business setup'),
                areas: await this.getVector('Geographic coordinates, industrial zones locations, land areas, and administrative dependency of regions'),
                decision104: await this.getVector('Financial investment incentives, tax exemptions, strategic industry benefits, and council of ministers decree 104 rules')
            };

            this.isReady = true;
            console.log("✅ العقل المتجهي جاهز للفهم والتوجيه.");
        } catch (error) {
            console.error("❌ خطأ في تهيئة النظام المتجهي:", error);
            throw error;
        }
    }

    /**
     * تحويل النص إلى متجه
     */
    async getVector(text) {
        if (!this.embedder) throw new Error("الموديل غير جاهز");
        const output = await this.embedder(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    /**
     * حساب التشابه الجيبي (Cosine Similarity)
     */
    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0, normA = 0, normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * تصنيف نية السؤال (Surgical Intent Classification)
     * يحدد أي قاعدة بيانات هي الأقرب دلالياً لسؤال المستخدم
     */
    async classifyIntent(queryVector) {
        let scores = [];
        for (const [id, anchorVec] of Object.entries(this.intentAnchors)) {
            const score = this.cosineSimilarity(anchorVec, queryVector);
            scores.push({ id, score });
        }
        
        // ترتيب النوايا حسب الثقة
        scores.sort((a, b) => b.score - a.score);
        
        console.log("📊 نتائج تحليل النية:", scores.map(s => `${s.id}: ${Math.round(s.score*100)}%`));
        
        // نرجع النية الأعلى بشرط تجاوز العتبة
        const best = scores[0];
        return best.score >= 0.40 ? best.id : 'activities'; // الافتراضي أنشطة
    }

    /**
     * البحث الهجين (البحث في النية أولاً ثم استخراج البيانات)
     */
    async search(query) {
        if (!this.isReady) await this.initialize();

        // 1. تحويل السؤال لمتجه
        const queryVector = await this.getVector(query);

        // 2. تحديد القاعدة المستهدفة (Routing)
        const targetIntent = await this.classifyIntent(queryVector);
        console.log(`🎯 توجيه ذكي للمسار: [${targetIntent}]`);

        // 3. البحث فقط داخل القاعدة المستهدفة لضمان السرعة والدقة (Precision)
        const candidates = this.vectors[targetIntent].map(item => ({
            id: item.id,
            score: this.cosineSimilarity(queryVector, item.vector)
        }));

        // 4. ترتيب النتائج
        const matches = candidates
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        return {
            intent: targetIntent,
            topMatch: matches[0] || null,
            matches: matches,
            confidence: matches[0]?.score || 0
        };
    }
}

export const hybridEngine = new HybridSearchEngine();
