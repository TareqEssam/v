window.GPT_AGENT = window.GPT_AGENT || {};

// ==================== 🔍 البحث في القرار 104 باستخدام NeuralSearch ====================

/**
 * دالة البحث في القرار 104 باستخدام NeuralSearch الموحد
 * @param {string} activityName - اسم النشاط المراد البحث عنه
 * @returns {Array} - مصفوفة تحتوي على النتائج
 */
function searchInDecision104WithNeural(activityName) {
    console.log("🔍 البحث المحسّن في القرار 104:", activityName);
    
    // استخدام الفلترة الذكية
    return enhancedSearchInDecision104(activityName, null);
}

/**
 * دالة تنسيق عرض الأنشطة المتشابهة في القرار 104
 * @param {string} activityName - اسم النشاط الأصلي
 * @param {Array} results - نتائج البحث
 * @returns {string} HTML
 */
function formatMultipleActivitiesInDecision104(activityName, results) {
    return formatEnhancedMultipleResults(activityName, results, null);
}
/**
 * دالة مساعدة لعرض معلومات نوع المطابقة
 */
function getMatchTypeInfo(matchType, confidence) {
    const types = {
        'exact_match': { text: 'تطابق تام', color: '#4caf50' },
        'partial_match': { text: 'تطابق جزئي', color: '#2196f3' },
        'keyword_match': { text: 'مطابقة كلمات', color: '#ff9800' },
        'fuzzy_match': { text: 'تشابه قوي', color: '#9c27b0' }
    };
    
    const info = types[matchType] || { text: 'مطابقة', color: '#757575' };
    
    return `
        <span style="background: ${info.color}20; color: ${info.color}; padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">
            ${info.text} (${Math.round(confidence)}%)
        </span>
    `;
}

/**
 * دالة معالجة اختيار نشاط محدد من القرار 104
 */
window.selectSpecificActivityInDecision104 = async function(activityName, sector) {
    console.log("🎯 اختيار نشاط محدد:", activityName, "القطاع:", sector);
    
    // البحث عن النشاط المحدد في القطاع المحدد
    const results = searchInDecision104EnhancedForSpecificSector(activityName, sector);
    const selectedResult = results.find(r => r.item.activity === activityName && r.item.sector === sector);
    
    if (selectedResult) {
        // حفظ النشاط في الذاكرة باستخدام setActivity
        // نُنشئ كائن بيانات يحاكي بنية النشاط
        const activityData = {
            text: activityName,
            value: activityName,
            details: {
                sector: sector,
                mainSector: selectedResult.item.mainSector,
                subSector: selectedResult.item.subSector,
                activity: activityName
            }
        };
        
        await AgentMemory.setActivity(activityData, activityName);
        
        // إضافة رسالة المستخدم
        addMessageToUI('user', activityName);
        
        // عرض تفاصيل النشاط المحدد
        const responseHTML = formatActivityFoundResponse(selectedResult, 'full');
        const typingId = showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator(typingId);
            typeWriterResponse(responseHTML);
        }, 600);
    } else {
        typeWriterResponse(`⚠️ <strong>عذراً، لم أجد النشاط المحدد</strong><br>النشاط: ${activityName}<br>القطاع: ${sector}`);
    }
};

/**
 * دالة حساب التشابه للقرار 104
 */
function calculateWordSimilarityForDecision104(str1, str2) {
    const normalize = (text) => {
        return text
            .replace(/[أإآٱ]/g, 'ا')
            .replace(/[ةه]/g, 'ه')
            .replace(/[ىي]/g, 'ي')
            .replace(/ؤ/g, 'و')
            .replace(/ئ/g, 'ي')
            .replace(/[\u064B-\u065F\u0670]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    };
    
    const s1 = normalize(str1);
    const s2 = normalize(str2);
    
    // إذا كان أحدهما جزء من الآخر
    if (s1.includes(s2) || s2.includes(s1)) {
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        return shorter.length / longer.length;
    }
    
    // تقسيم النصوص إلى كلمات
    const words1 = s1.split(/\s+/).filter(w => w.length > 2);
    const words2 = s2.split(/\s+/).filter(w => w.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    // حساب التشابه باستخدام Jaccard
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
}


/**
 * دالة تنسيق خيارات القرار 104 (عند عدم وجود نشاط محدد)
 */
function formatDecision104Options() {
    return `
        <div class="info-card">
            <div class="info-card-header">
                🤔 ما الذي تبحث عنه في القرار 104؟
            </div>
            <div class="info-card-content">
                اختر أحد المواضيع التالية:
            </div>
        </div>
        
        <div class="choice-btn" onclick="sendMessage('ما هو القرار 104؟')">
            <span class="choice-icon">📋</span>
            ما هو القرار 104 وما أهميته؟
        </div>
        
        <div class="choice-btn" onclick="sendMessage('ما هي أنشطة القطاع أ')">
            <span class="choice-icon">🏭</span>
            عرض أنشطة القطاع أ
        </div>
        
        <div class="choice-btn" onclick="sendMessage('ما هي أنشطة القطاع ب')">
            <span class="choice-icon">🌍</span>
            عرض أنشطة القطاع ب
        </div>
        
        <div class="choice-btn" onclick="sendMessage('ما هي حوافز القطاع أ')">
            <span class="choice-icon">🎁</span>
            عرض حوافز القطاع أ
        </div>
        
        <div class="choice-btn" onclick="sendMessage('ما هي المناطق المحددة للقطاع أ')">
            <span class="choice-icon">🗺️</span>
            المناطق الجغرافية للقطاع أ
        </div>
        
        <div style="margin-top: 15px; padding: 10px; background: #f0f9ff; border-radius: 8px; font-size: 0.9rem; color: #0369a1;">
            💡 يمكنك أيضاً كتابة اسم نشاط محدد مثل: "هل نشاط النقل وارد بالقرار 104؟"
        </div>
    `;
}

/**
 * دالة فحص ما إذا كان السؤال متعلق بالقرار 104
 * @param {string} query - السؤال
 * @returns {boolean}
 */
function isDecision104Question(query) {
    const q = normalizeArabic(query);
    
    // أنماط الأسئلة المتعلقة بالقرار 104
    const patterns = [
        /قرار.*104/,
        /104/,
        /حافز/,
        /حوافز/,
        /قطاع\s*أ/,
        /قطاع\s*ا/,
        /قطاع\s*ب/,
        /القطاع\s*الاول/,
        /القطاع\s*الثاني/,
        /قانون.*استثمار/,
        /قانون.*72/,
        /ما\s*هو\s*القرار/,
        /هل.*104/,
        /مناطق.*القطاع/,
        /انشطة.*القطاع/,
        /انشطه.*القطاع/
    ];
    
    return patterns.some(pattern => pattern.test(q));
}

/**
 * دالة حساب التشابه بالقرار 104
 */

function calculateSimilarityForDecision104(str1, str2) {
    // تطبيع أكثر دقة
    const normalize = (text) => {
        return text
            .replace(/[أإآٱ]/g, 'ا')
            .replace(/[ةه]/g, 'ه')
            .replace(/[ىي]/g, 'ي')
            .replace(/ؤ/g, 'و')
            .replace(/ئ/g, 'ي')
            .replace(/[\u064B-\u065F\u0670]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    };
    
    const s1 = normalize(str1);
    const s2 = normalize(str2);
    
    // إذا كان أحدهما جزء من الآخر
    if (s1.includes(s2) || s2.includes(s1)) {
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        return shorter.length / longer.length;
    }
    
    // حساب تشابه جاكارد للكلمات
    const words1 = new Set(s1.split(/\s+/).filter(w => w.length > 2));
    const words2 = new Set(s2.split(/\s+/).filter(w => w.length > 2));
    
    if (words1.size === 0 || words2.size === 0) return 0;
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
}

// ==================== 🔍 محرك البحث الصافي للقرار 104 ====================

/**
 * دالة البحث الموحدة (البديل العصبي البسيط)
 */
function enhancedSearchInDecision104(activityName, sectorFilter = null) {
    if (!window.decision104 || !window.decision104.unifiedSearchDB) {
        console.error("❌ قاعدة بيانات القرار 104 غير محملة");
        return [];
    }

    // 1. استخدام المحرك العصبي NeuralSearch المتوفر في مشروعك
    const searchResults = NeuralSearch(activityName, window.decision104.unifiedSearchDB, {
        minScore: 50, // درجة حساسية متوسطة
        limit: 10
    });

    // 2. تجهيز النتائج بالصيغة التي تتوقعها واجهة المستخدم
    let mapped = searchResults.results.map(r => ({
        item: r.originalData,
        score: r.finalScore,
        confidence: Math.min(Math.round(r.finalScore / 10), 100),
        sector: r.originalData.sector
    }));

    // 3. الفلترة حسب القطاع (Guard) إذا تم تحديد قطاع معين
    if (sectorFilter) {
        mapped = mapped.filter(r => r.sector === sectorFilter);
    }

    return mapped;
}

/**
 * دالة حذف التكرار (لضمان نظافة النتائج)
 */
function deduplicateResults(results) {
    const seen = new Set();
    return results.filter(r => {
        const val = r.item.activity + "_" + r.item.sector;
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
    });
}


/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🎯 handleDecision104Query - النسخة الذكية (Smart Filter Edition)
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * الميزات:
 * ✅ دعم السياق الذكي
 * ✅ التمييز الدقيق بين القطاعات
 * ✅ إصلاح مشكلة القطاع ب
 * 🚀 جديد: فلتر ذكي للكلمات الجوهرية لمنع نتائج "تصنيع" العشوائية
 * 
 * استبدل الوظيفة الحالية بهذه النسخة المحسّنة
 * ═══════════════════════════════════════════════════════════════════════
 */

function handleDecision104Query(query, questionType) {
    // 1. تنظيف النص وتوحيد المسافات ومعالجة الخطأ الإملائي
    let q = normalizeArabic(query).replace(/القطا\s+ع/g, 'القطاع').replace(/\s+/g, ' ').trim();
    
    console.log("🎯 محرك القرار 104: بدء المعالجة لـ:", query);

    // 2. [أولوية مطلقة] فحص الطلبات التفاعلية (الأزرار أو القوائم)
    if (q.includes('انشط') && (q.includes('قطاع') || q.includes('القطاع'))) {
        
        // أولاً: هل هذا طلب تفصيلي لنشاط رئيسي معين؟ (قادم من ضغطة زر)
        if (q.includes('عرض انشطه') && q.includes('في القطاع')) {
            const targetSector = (q.includes('قطاع ب') || q.includes('القطاع ب')) ? 'B' : 'A';
            const data = (targetSector === 'A') ? window.sectorAData : window.sectorBData;
            
            // البحث عن النشاط الرئيسي المذكور في السؤال داخل قاعدة البيانات
            for (const mainName in data) {
                if (q.includes(normalizeArabic(mainName))) {
                    console.log("🎯 العقل المدبر: عرض تفاصيل النشاط الرئيسي: " + mainName);
                    return renderSingleMainSector(targetSector, mainName);
                }
            }
        }

        // ثانياً: إذا لم يكن طلباً تفصيلياً، نفحص هل هو طلب لعرض قائمة القطاع كاملة
        let detectedSector = null;
        if (q.includes(' قطاع ب') || q.includes(' القطاع b') || q.endsWith(' ب')) {
            detectedSector = 'B';
        } else if (q.includes(' قطاع ا') || q.includes(' قطاع أ') || q.endsWith(' ا') || q.endsWith(' أ')) {
            detectedSector = 'A';
        }

        if (detectedSector) {
            console.log("✅ العقل المدبر: عرض قائمة " + (detectedSector === 'A' ? 'القطاع أ' : 'القطاع ب'));
            const isMainOnly = q.includes('رييسيه') || q.includes('رئيسيه');
            return renderDecisionSectorList(detectedSector, isMainOnly);
        }
    }

// 1. كشف طلب عرض نشاط رئيسي محدد (عند الضغط على الزر)
    if (q.includes('عرض انشطه') && q.includes('في القطاع')) {
        const targetSector = q.includes('قطاع ب') ? 'B' : 'A';
        // استخراج اسم النشاط الرئيسي من النص
        // نمر على المفاتيح الموجودة في البيانات لنجد المطابق
        const data = (targetSector === 'A') ? window.sectorAData : window.sectorBData;
        for (const mainName in data) {
            if (q.includes(normalizeArabic(mainName))) {
                console.log("🎯 عرض تفصيلي للنشاط الرئيسي: " + mainName);
                return renderSingleMainSector(targetSector, mainName);
            }
        }
    }

    // 3. إذا لم يكن طلباً لقائمة، ننتقل لاستخراج النشاط والبحث عنه
    const context = AgentMemory.getContext();
    let activityName = extractActivityFromQueryEnhanced(q);

// اكتشاف طلب الشروط للقطاع ب
if (q.includes('شروط') && q.includes('ب')) {
    console.log("🎯 تم طلب عرض شروط القطاع ب");
    return renderSectorBConditions();
}

    
    // نظرة عامة على القرار 104
    if (/ما\s*(هو|هي).*قرار.*104/.test(q) || /قرار.*104.*ايه/.test(q)) {
        return formatDecision104Overview();
    }    // المناطق المحددة للقطاع أ
    if (/(ما|ماهي|اذكر).*مناطق.*(قطاع|القطاع)\s*(أ|ا|1)/.test(q) || 
        q.includes('المناطق المحددة للقطاع أ')) {
        return formatSectorARegionsDetailed();
    }
    
       // [إضافة جديدة] المناطق المحددة للقطاع ب (تعديل دقيق)
    if (/(ما|ماهي|اذكر|اين|أين).*مناطق.*(قطاع|القطاع)\s*(ب|2)/.test(q) || 
        q.includes('المناطق المحددة للقطاع ب') ||
        q.includes('مناطق القطاع ب')) {
        return formatSectorBRegions();
    }
   
    
    // حوافز القطاع أ
    if (/(ما|ماهي|اذكر).*حوافز.*(قطاع|القطاع)\s*(أ|ا|1)/.test(q)) {
        return formatSectorIncentives('A');
    }
    
    // حوافز القطاع ب
    if (/(ما|ماهي|اذكر).*حوافز.*(قطاع|القطاع)\s*(ب|2)/.test(q)) {
        return formatSectorIncentives('B');
    }
    
    // ═══════════════════════════════════════════════════════════
    // الخطوة 3: التحقق من اسم النشاط
    // ═══════════════════════════════════════════════════════════
    
    if (!activityName || activityName.length < 3) {
        console.log("⚠️ [Activity Name] اسم النشاط قصير جداً أو فارغ:", activityName);
        return `
            <div class="info-card" style="background: #fff3e0; border-left-color: #ff9800;">
                <div class="info-card-header" style="color: #e65100;">
                    ⚠️ يرجى تحديد اسم النشاط
                </div>
                <div class="info-card-content" style="color: #bf360c;">
                    <p>لم أتمكن من فهم اسم النشاط الذي تريد البحث عنه.</p>
                    <p><strong>مثال:</strong> "هل نشاط الطاقة الشمسية وارد بالقرار 104"</p>
                </div>
            </div>
        `;
    }
    
    // ═══════════════════════════════════════════════════════════
    // الخطوة 4: تحديد نطاق البحث (القطاع أ / ب / كليهما)
    // ═══════════════════════════════════════════════════════════
    
    const scopeDetection = detectSearchScopeEnhanced(q);
    const searchScope = scopeDetection.scope; // 'A' أو 'B' أو 'both'
    
    console.log(`🎯 [Search Scope] النطاق: ${scopeDetection.scopeName}`);
    
    // ═══════════════════════════════════════════════════════════
    // الخطوة 5: تنفيذ البحث الأولي (Neural Search)
    // ═══════════════════════════════════════════════════════════
    
    let results = [];
    
    if (searchScope === 'A') {
        results = searchInDecision104EnhancedForSpecificSector(activityName, 'A');
        console.log(`📊 [Search Results] القطاع أ: ${results.length} نتيجة`);
    } else if (searchScope === 'B') {
        results = searchInDecision104EnhancedForSpecificSector(activityName, 'B');
        console.log(`📊 [Search Results] القطاع ب: ${results.length} نتيجة`);
    } else {
        results = searchInDecision104EnhancedForBothSectors(activityName);
        console.log(`📊 [Search Results] كلا القطاعين: ${results.length} نتيجة`);
    }
    
    // ═══════════════════════════════════════════════════════════
    // الخطوة 6: حارس القطاع الصارم (Sector Guard)
    // ═══════════════════════════════════════════════════════════
    
    if (searchScope !== 'both') {
        results = results.filter(r => (r.sector || r.item?.sector) === searchScope);
    }
    
    // ═══════════════════════════════════════════════════════════
    // الخطوة 7: حذف التكرار (Deduplication)
    // ═══════════════════════════════════════════════════════════
    
    results = deduplicateResults(results);
    console.log(`✅ [After Deduplication] ${results.length} نتيجة`);
    
    // ═══════════════════════════════════════════════════════════
    // 🚀 الخطوة 8: فلترة الكلمات الجوهرية (Smart Keyword Filter)
    // هذه الخطوة تمنع النتائج العشوائية لكلمات مثل "تصنيع"
    // ═══════════════════════════════════════════════════════════
    
    // قائمة الأفعال/الكلمات العامة التي لا تكفي وحدها للتطابق - تم إضافة كلمات التواجد كخط دفاع ثانٍ
    const commonVerbs = [
        'تصنيع', 'انتاج', 'إنتاج', 'تجميع', 'اقامة', 'إقامة', 
        'تشغيل', 'تجهيز', 'توريد', 'مشروع', 'نشاط', 'صناعة', 
        'خدمات', 'مركز', 'وحدات', 'مكونات', 'محطات', 'توليد',
        'وارد', 'وارده', 'واردة', 'موجود', 'موجودة', 'مدرج', 'مدرجة', 'مذكور'
    ];

    // تقسيم جملة البحث إلى كلمات
    const queryTerms = activityName.split(/\s+/).map(w => normalizeArabic(w));
    
    // استخراج الكلمات "الجوهرية" (ليست عامة وطولها > 2)
    // مثال: "تصنيع خلايا شمسية" -> الجوهرية: "خلايا"، "شمسية"
    const significantTerms = queryTerms.filter(w => !commonVerbs.includes(w) && w.length > 2);

    console.log(`🧠 [Smart Filter] الكلمات الجوهرية: [${significantTerms.join(', ')}]`);

    // إذا وجدنا كلمات جوهرية، نقوم بفلترة النتائج
    // جراحة دقيقة للمنطق - داخل دالة handleDecision104Query
    if (significantTerms.length > 0 && results.length > 0) {
        const strictResults = results.filter(r => {
            const itemText = normalizeArabic(r.item.activity);
            
            // حساب عدد الكلمات الجوهرية الموجودة فعلياً في اسم النشاط
            const matchedTermsCount = significantTerms.filter(term => itemText.includes(term)).length;
            
            // حساب نسبة التطابق (Density)
            const matchPercentage = (matchedTermsCount / significantTerms.length);
            
            // إذا كان البحث من عدة كلمات، لا نقبل إلا تطابق 70% أو أكثر
            // (نقل + جماعي) = 2 كلمة. النقل المبرد يطابق 1 فقط (50%) -> يُحذف.
            // (نقل + جماعي) = 2 كلمة. النقل الجماعي يطابق 2 (100%) -> يظهر.
            return matchPercentage >= 0.7;
        });

        if (strictResults.length > 0) {
            console.log(`🧹 [Smart Filter] تم تقليص النتائج من ${results.length} إلى ${strictResults.length} نتيجة دقيقة.`);
            results = strictResults;
        } else {
            console.log("⚠️ [Smart Filter] لم نجد نشاطاً يطابق أغلب الكلمات الجوهرية، تم الحفاظ على النتائج الأصلية.");
        }
    }

    // ═══════════════════════════════════════════════════════════
    // الخطوة 9: تقليل الضوضاء وترتيب النتائج (Noise Suppression)
    // ═══════════════════════════════════════════════════════════
    
    if (results.length > 1) {
        // إعادة الترتيب: الأنشطة التي تحتوي على أكبر عدد من الكلمات الجوهرية تظهر أولاً
        if (significantTerms.length > 0) {
            results.sort((a, b) => {
                const textA = normalizeArabic(a.item.activity);
                const textB = normalizeArabic(b.item.activity);
                const matchA = significantTerms.filter(t => textA.includes(t)).length;
                const matchB = significantTerms.filter(t => textB.includes(t)).length;
                // الترتيب حسب عدد المطابقات الجوهرية ثم حسب النقاط الأصلية
                return (matchB - matchA) || (b.score - a.score);
            });
        }

        // حذف النتائج الضعيفة جداً مقارنة بالنتيجة الأولى
        const topScore = results[0].confidence || results[0].score || 0;
        if (topScore >= 80) {
            results = results.filter(r => (r.confidence || r.score || 0) >= (topScore * 0.7));
        } else if (topScore >= 50) {
            results = results.filter(r => (r.confidence || r.score || 0) >= 40);
        }
    }
    
    // ═══════════════════════════════════════════════════════════
    // الخطوة 10: التحقق النهائي والعرض
    // ═══════════════════════════════════════════════════════════
    
    if (!results || results.length === 0) {
        console.log("❌ [No Results] لم يتم العثور على أي نتائج");
        return formatActivityNotFoundInDecision104(activityName, searchScope);
    }
    
    if (results.length === 1) {
        // ═══ نتيجة واحدة ═══
        const result = results[0];
        const itemData = result.item || result;
        
        console.log(`✅ [Single Result] عرض نشاط واحد: "${itemData.activity}"`);
        AgentMemory.setDecisionActivity(itemData, activityName);
        
        return formatSingleActivityInDecision104WithIncentives(
            activityName,
            itemData,
            searchScope
        );
        
    } else {
        // ═══ عدة نتائج ═══
        console.log(`📋 [Multiple Results] عرض ${results.length} نشاط للاختيار`);
        
        return formatMultipleActivitiesInDecision104WithBothSectorsFixed(
            activityName,
            results,
            searchScope
        );
    }
}


// ═══════════════════════════════════════════════════════════════════════
// وظائف مساعدة إضافية (مطلوبة لعمل الكود)
// ═══════════════════════════════════════════════════════════════════════

/**
 * حفظ نشاط القرار 104 في الذاكرة
 */
AgentMemory.setDecisionActivity = function(itemData, originalQuery) {
    this.currentContext = {
        type: 'decision_activity',
        timestamp: Date.now(),
        query: originalQuery,
        data: itemData,
        sector: itemData.sector,
        name: itemData.activity
    };
    
    console.log("💾 [Memory] تم حفظ نشاط القرار 104:", {
        type: 'decision_activity',
        name: itemData.activity,
        sector: itemData.sector
    });
};

/**
 * دالة تشخيصية لمشاكل القطاع ب
 */
window.debugSectorB = function() {
    console.log("═════════════════════════════════════");
    console.log("🔍 تشخيص القطاع ب");
    console.log("═════════════════════════════════════");
    
    console.log("1️⃣ فحص البيانات:");
    console.log("   window.sectorBData:", window.sectorBData ? "✅ موجود" : "❌ غير موجود");
    
    if (window.sectorBData) {
        const mainSectors = Object.keys(window.sectorBData);
        console.log("   عدد القطاعات الرئيسية:", mainSectors.length);
        
        let totalActivities = 0;
        for (const [mainSector, subSectors] of Object.entries(window.sectorBData)) {
            for (const [subSector, activities] of Object.entries(subSectors)) {
                totalActivities += activities.length;
            }
        }
        console.log("   إجمالي الأنشطة:", totalActivities);
        
        console.log("\n2️⃣ اختبار بحث:");
        const testQuery = "وقود حيوي";
        console.log(`   البحث عن: "${testQuery}"`);
        
        const results = searchInDecision104EnhancedForSpecificSector(testQuery, 'B');
        console.log("   النتائج:", results.length);
        
        if (results.length > 0) {
            console.log("   ✅ البحث يعمل بشكل صحيح");
            console.log("   النتيجة الأولى:", results[0].item?.activity || results[0].activity);
        } else {
            console.log("   ❌ البحث لا يعطي نتائج");
        }
    } else {
        console.log("\n⚠️ المشكلة: window.sectorBData غير موجود");
    }
    console.log("═════════════════════════════════════");
};

/**
 * دالة تشخيصية للسياق
 */
window.debugContext = function() {
    console.log("═════════════════════════════════════");
    console.log("🧠 تشخيص السياق");
    console.log("═════════════════════════════════════");
    
    const context = AgentMemory.getContext();
    
    if (!context) {
        console.log("❌ لا يوجد سياق محفوظ حالياً");
    } else {
        console.log("✅ السياق المحفوظ:");
        console.log("   النوع:", context.type);
        console.log("   الاسم:", context.data?.text || context.data?.name || context.name);
        console.log("   الوقت:", new Date(context.timestamp).toLocaleString('ar-EG'));
        console.log("\n   التفاصيل الكاملة:");
        console.log(context);
    }
    console.log("═════════════════════════════════════");
};

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  ✅ handleDecision104Query - ULTIMATE SMART FILTER LOADED     ║
║                                                                ║
║  🎯 Features:                                                 ║
║  ✓ Smart Context Recovery                                    ║
║  ✓ Enhanced Sector Detection                                 ║
║  ✓ Smart Keyword Filtering (Fixes "Manufacturing" issue)     ║
║  ✓ Sector B Fix                                              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);


function searchInDecision104EnhancedForBothSectors(activityName) {
    const normalizedQuery = normalizeArabic(activityName);
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
    
    let allResults = [];
    
    // جلب نتائج أ وب بشكل منفصل تماماً
    if (window.sectorAData) {
        allResults.push(...searchInSectorData(window.sectorAData, 'A', 'القطاع أ', normalizedQuery, queryWords));
    }
    if (window.sectorBData) {
        allResults.push(...searchInSectorData(window.sectorBData, 'B', 'القطاع ب', normalizedQuery, queryWords));
    }
    
    // ترتيب النتائج الكلية حسب الثقة
    allResults.sort((a, b) => b.score - a.score);
    
    // حذف التكرار النهائي
    return deduplicateResults(allResults);
}


/**
 * دالة البحث في قطاع محدد فقط (أ أو ب)
 * @param {string} activityName - اسم النشاط المراد البحث عنه
 * @param {string} targetSector - القطاع المستهدف ('A' أو 'B')
 * @returns {Array} - مصفوفة تحتوي على النتائج من القطاع المحدد فقط
 */
function searchInDecision104EnhancedForSpecificSector(activityName, targetSector) {
    const normalizedQuery = normalizeArabic(activityName);
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
    
    if (targetSector === 'A') {
        return searchInSectorData(window.sectorAData, 'A', 'القطاع أ', normalizedQuery, queryWords);
    } else {
        return searchInSectorData(window.sectorBData, 'B', 'القطاع ب', normalizedQuery, queryWords);
    }
}

function deduplicateResults(results) {
    if (!results || !Array.isArray(results)) return [];
    const seen = new Set();
    return results.filter(result => {
        // إنشاء مفتاح فريد يجمع النص والقطاع لضمان عدم التكرار
        const textKey = (result.item.activity || result.text).trim();
        const uniqueKey = `${textKey}_${result.sector}`.toLowerCase();
        if (seen.has(uniqueKey)) return false;
        seen.add(uniqueKey);
        return true;
    });
}

/**
 * دالة البحث في قطاع محدد باستخدام NeuralSearch
 * تم تحديثها لضمان إرسال مصفوفة مسطحة دائماً
 */
function searchInSectorData(sectorData, sectorId, sectorName, normalizedQuery, queryWords) {
    let flatData = [];
    for (const [mainSector, subSectors] of Object.entries(sectorData)) {
        for (const [subSector, activities] of Object.entries(subSectors)) {
            activities.forEach(act => {
                flatData.push({ activity: act, mainSector, subSector, sector: sectorId });
            });
        }
    }

    // الميزة الجديدة: عزل الذاكرة المؤقتة لمنع تزييف النتائج
    const searchResults = NeuralSearch(normalizedQuery, flatData, { 
        minScore: 35, 
        cacheScope: `sector_${sectorId}` // يمنع خلط نتائج قطاع أ بقطاع ب
    });
    
    const mapped = searchResults.results.map(r => ({
        item: r.originalData,
        score: r.finalScore,
        confidence: Math.min(Math.round((r.finalScore / 10)), 100),
        sector: sectorId,
        sectorName: sectorName
    }));

    return deduplicateResults(mapped);
}
/**
 * دالة تقييم مدى مطابقة نشاط معين
 */
function evaluateActivityMatch(normalizedActivity, normalizedQuery, queryWords, item) {
    let score = 0;
    let matchedWords = 0;
    let matchType = 'none';
    
    // === المستوى 1: تطابق كامل ===
    if (normalizedActivity === normalizedQuery) {
        score = 1000;
        matchedWords = queryWords.length;
        matchType = 'exact_match';
    }
    // === المستوى 2: تطابق جزئي (أحدهما يحتوي على الآخر) ===
    else if (normalizedActivity.includes(normalizedQuery) || normalizedQuery.includes(normalizedActivity)) {
        score = 800;
        matchedWords = Math.min(queryWords.length, normalizedActivity.split(/\s+/).length);
        matchType = 'partial_match';
    }
    // === المستوى 3: تطابق بكلمات رئيسية ===
    else if (queryWords.length > 0) {
        const activityWords = normalizedActivity.split(/\s+/);
        let keywordMatches = 0;
        
        for (const qWord of queryWords) {
            for (const aWord of activityWords) {
                if (aWord.includes(qWord) || qWord.includes(aWord)) {
                    keywordMatches++;
                    break;
                }
            }
        }
        
        if (keywordMatches > 0) {
            const matchPercentage = (keywordMatches / queryWords.length) * 100;
            score = Math.round(matchPercentage * 8); // تحويل النسبة إلى نقاط
            matchedWords = keywordMatches;
            matchType = 'keyword_match';
        }
    }
    
    // === المستوى 4: تطابق تقريبي (لمشابهة عالية) ===
    if (score < 500) {
        const similarity = calculateWordSimilarityForDecision104(normalizedQuery, normalizedActivity);
        if (similarity >= 0.5) { // عتبة أقل للتشابه
            score = Math.max(score, Math.round(similarity * 600));
            matchType = 'fuzzy_match';
        }
    }
    
    // === المستوى 5: تطابق بالكلمات الشائعة ===
    // زيادة فرص المطابقة للكلمات الشائعة مثل "نقل"، "تصنيع"، "تجهيز" إلخ
    const commonActivityWords = ['نقل', 'تصنيع', 'تجهيز', 'إنتاج', 'تركيب', 'صيانة', 'تشغيل', 'تخزين', 'تعبئة'];
    for (const commonWord of commonActivityWords) {
        if (normalizedActivity.includes(commonWord) && normalizedQuery.includes(commonWord)) {
            score += 100;
            if (matchType === 'none') matchType = 'common_word_match';
            break;
        }
    }
    
    return {
        item: item,
        score: score,
        matchedWords: matchedWords,
        matchType: matchType,
        confidence: Math.min(score / 10, 100)
    };
}

// ═══════════════════════════════════════════════════════════════
// FIX #3 & #4: إصلاح القطاع ب + إخفاء المعلومات الزائدة
// ═══════════════════════════════════════════════════════════════

/**
 * تنسيق عرض عدة أنشطة - النسخة المُحسّنة
 * 
 * التحسينات:
 * 1. عدم عرض معلومات القطاع الآخر إذا كان البحث في قطاع واحد
 * 2. رسائل أوضح للمستخدم
 * 3. تصميم أفضل
 */
function formatMultipleActivitiesInDecision104WithBothSectorsFixed(activityName, results, searchScope = 'both') {
    // رسالة توضيحية حسب نطاق البحث
    let scopeMessage = '';
    if (searchScope === 'A') {
        scopeMessage = `
            <div style="background: #e8f5e9; padding: 12px; border-radius: 10px; border-right: 4px solid #4caf50; margin-bottom: 16px;">
                <div style="color: #2e7d32; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-filter" style="color: #4caf50;"></i>
                    🔍 البحث في: <strong>القطاع أ فقط</strong>
                </div>
            </div>
        `;
    } else if (searchScope === 'B') {
        scopeMessage = `
            <div style="background: #e3f2fd; padding: 12px; border-radius: 10px; border-right: 4px solid #2196f3; margin-bottom: 16px;">
                <div style="color: #1565c0; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-filter" style="color: #2196f3;"></i>
                    🔍 البحث في: <strong>القطاع ب فقط</strong>
                </div>
            </div>
        `;
    }
    
    // تصنيف النتائج حسب القطاع
    const sectorAResults = results.filter(r => (r.item?.sector || r.sector) === 'A');
    const sectorBResults = results.filter(r => (r.item?.sector || r.sector) === 'B');
    
    // بناء رسالة التوزيع بذكاء
    let distributionMessage = '';
    if (searchScope === 'both') {
        distributionMessage = `📊 التوزيع: <strong>${sectorAResults.length} في القطاع أ</strong> • <strong>${sectorBResults.length} في القطاع ب</strong>`;
    } else if (searchScope === 'A') {
        distributionMessage = `📊 النتائج: <strong>${sectorAResults.length} نشاط</strong> في القطاع أ`;
    } else if (searchScope === 'B') {
        distributionMessage = `📊 النتائج: <strong>${sectorBResults.length} نشاط</strong> في القطاع ب`;
    }
    
    let html = scopeMessage + `
        <div class="info-card" style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); border-left: 4px solid #2196f3;">
            <div class="info-card-header" style="color: #1565c0;">
                🔍 وَجدتْ ${results.length} نشاط مرتبط بـ: "${activityName}"
            </div>
            <div class="info-card-content" style="color: #0d47a1;">
                <div style="margin-bottom: 10px; font-size: 0.95rem;">
                    ${distributionMessage}
                </div>
                يرجى اختيار النشاط المطلوب بالضبط:
            </div>
        </div>
    `;
    
    // عرض أنشطة القطاع أ (إذا كان البحث شامل أو في أ)
    if ((searchScope === 'both' || searchScope === 'A') && sectorAResults.length > 0) {
        html += formatSectorResultsSection('A', sectorAResults, activityName);
    }
    
    // عرض أنشطة القطاع ب (إذا كان البحث شامل أو في ب)
    if ((searchScope === 'both' || searchScope === 'B') && sectorBResults.length > 0) {
        html += formatSectorResultsSection('B', sectorBResults, activityName);
    }
    
    // رسالة إذا لم توجد نتائج في القطاع المطلوب
    if (searchScope === 'A' && sectorAResults.length === 0) {
        html += `
            <div style="margin-top: 16px; padding: 14px; background: #fff3e0; border-radius: 10px; border: 1px solid #ffe0b2;">
                <div style="color: #e65100; font-weight: 600; margin-bottom: 6px;">
                    ℹ️ لم يتم العثور على نتائج في القطاع أ
                </div>
                <div style="color: #bf360c; font-size: 0.9em;">
                    قد يكون هذا النشاط موجود في القطاع ب. جرب البحث الشامل.
                </div>
            </div>
        `;
    } else if (searchScope === 'B' && sectorBResults.length === 0) {
        html += `
            <div style="margin-top: 16px; padding: 14px; background: #fff3e0; border-radius: 10px; border: 1px solid #ffe0b2;">
                <div style="color: #e65100; font-weight: 600; margin-bottom: 6px;">
                    ℹ️ لم يتم العثور على نتائج في القطاع ب
                </div>
                <div style="color: #bf360c; font-size: 0.9em;">
                    قد يكون هذا النشاط موجود في القطاع أ. جرب البحث الشامل.
                </div>
            </div>
        `;
    }
    
    // ملاحظة إضافية
    html += `
        <div style="margin-top: 16px; padding: 12px; background: #fff3e0; border-radius: 10px; border: 1px solid #ffcc80;">
            <div style="color: #e65100; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-lightbulb" style="color: #ff9800;"></i>
                <span>💡   الفرق بين القطاعين:</span>
            </div>
            <div style="color: #bf360c; font-size: 0.9em; margin-top: 8px; line-height: 1.5;">
                <strong>القطاع أ:</strong> يتطلب ممارسة النشاط في مناطق محددة (حوافز أعلى 50%)<br>
                <strong>القطاع ب:</strong> يمكن ممارسته في أي مكان بالجمهورية (حوافز 30%)
            </div>
        </div>
    `;
    
    return html;
}

/**
 * دالة مساعدة لعرض نتائج قطاع معين
 */
function formatSectorResultsSection(sector, results, activityName) {
    const sectorName = sector === 'A' ? 'القطاع أ' : 'القطاع ب';
    const sectorColor = sector === 'A' ? '#4caf50' : '#2196f3';
    const sectorBgLight = sector === 'A' ? '#e8f5e9' : '#e3f2fd';
    const sectorBgDark = sector === 'A' ? '#c8e6c9' : '#bbdefb';
    
    let html = `
        <div style="margin-top: 16px; padding: 14px; background: linear-gradient(135deg, ${sectorBgLight}, ${sectorBgDark}); border-radius: 12px; border-right: 3px solid ${sectorColor};">
            <div style="color: ${sector === 'A' ? '#2e7d32' : '#1565c0'}; font-weight: 700; margin-bottom: 12px; font-size: 1.1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    ${sector === 'A' ? '🏭' : '🌍'} ${sectorName} 
                    <small style="color: #666; font-size: 0.9rem;">(${sector === 'A' ? 'مناطق محددة' : 'جميع المناطق'})</small>
                </div>
                <span style="background: ${sectorColor}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 0.85em;">
                    ${results.length} نشاط
                </span>
            </div>
            <div style="max-height: 350px; overflow-y: auto; padding-right: 5px;">
    `;
    
    results.forEach((result, index) => {
        const itemData = result.item || result;
        const confidence = result.confidence || 50;
        const matchType = result.matchType || 'unknown';
        
        html += `
            <div class="choice-btn" onclick="selectSpecificActivityInDecision104('${itemData.activity.replace(/'/g, "\\'")}', '${sector}')" 
                 style="margin: 8px 0; text-align: right; background: white; border: 2px solid ${sectorColor}; border-left: 6px solid ${sectorColor};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="text-align: right; width: 100%;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <strong style="color: ${sector === 'A' ? '#2e7d32' : '#1565c0'}; font-size: 1em; line-height: 1.4;">${itemData.activity}</strong>
                            <span style="background: ${sectorColor}20; color: ${sector === 'A' ? '#2e7d32' : '#1565c0'}; padding: 2px 8px; border-radius: 12px; font-size: 0.75em; font-weight: bold; white-space: nowrap;">
                                ${sectorName}
                            </span>
                        </div>
                        <div style="color: #666; font-size: 0.85em;">
                            <div style="margin-bottom: 4px;">
                                <span style="background: ${sectorBgLight}; padding: 2px 8px; border-radius: 4px; margin-left: 6px;">
                                    🏷️ ${itemData.mainSector}
                                </span>
                                <span style="background: ${sectorBgDark}; padding: 2px 8px; border-radius: 4px;">
                                    📂 ${itemData.subSector}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    
    return html;
}

// ═══════════════════════════════════════════════════════════════
// FIX #5: تحسين كشف القطاعات - Enhanced Sector Detection
// ═══════════════════════════════════════════════════════════════

/**
 * كشف نوع البحث المطلوب (comprehensive / sectorA / sectorB)
 * النسخة المُحسّنة مع دعم أفضل للغة العربية
 */
function detectSearchScopeEnhanced(query) {
    const q = normalizeArabic(query);
    
    // أنماط القطاع أ
    const sectorAPatterns = [
        /بالقطاع\s*أ/,
        /بالقطاع\s*ا/,
        /في\s*القطاع\s*أ/,
        /في\s*القطاع\s*ا/,
        /قطاع\s*أ/,
        /قطاع\s*ا/,
        /القطاع\s*الاول/,
        /القطاع\s*1/
    ];
    
    // أنماط القطاع ب
    const sectorBPatterns = [
        /بالقطاع\s*ب/,
        /في\s*القطاع\s*ب/,
        /قطاع\s*ب/,
        /القطاع\s*الثاني/,
        /القطاع\s*2/
    ];
    
    // فحص القطاع ب أولاً (لأن "ب" أكثر تحديداً من "أ")
    if (sectorBPatterns.some(pattern => pattern.test(q))) {
        console.log("🎯 [Scope Detection] تم كشف: القطاع ب");
        return { scope: 'B', scopeName: 'القطاع ب' };
    }
    
    // فحص القطاع أ
    if (sectorAPatterns.some(pattern => pattern.test(q))) {
        console.log("🎯 [Scope Detection] تم كشف: القطاع أ");
        return { scope: 'A', scopeName: 'القطاع أ' };
    }
    
    // بحث شامل (افتراضي)
    console.log("🎯 [Scope Detection] بحث شامل في كلا القطاعين");
    return { scope: 'both', scopeName: 'كلا القطاعين' };
}


/**
 * دالة اختيار نشاط محدد من القائمة - النسخة المُصلحة (Robust Edition)
 * تعالج مشاكل العرض وعدم تطابق النصوص
 */
window.selectSpecificActivityInDecision104 = function(activityName, sector) {
    console.log(`🚀 [Click Handler] تم اختيار النشاط: "${activityName}" - القطاع: ${sector}`);
    
    // 1. محاولة البحث عن تفاصيل النشاط الكاملة (القطاع الرئيسي والفرعي)
    let itemData = null;
    let dataSource = (sector === 'A') ? window.sectorAData : window.sectorBData;
    
    if (dataSource) {
        // تطبيع الاسم المختار للبحث بدقة
        const normalizedTarget = normalizeArabic(activityName);
        
        // البحث العميق في الهيكل الشجري
        for (const [mainSector, subSectors] of Object.entries(dataSource)) {
            for (const [subSector, activities] of Object.entries(subSectors)) {
                // البحث المرن: تطابق تام أو احتواء
                const found = activities.find(act => {
                    const normAct = normalizeArabic(act);
                    return normAct === normalizedTarget || normAct.includes(normalizedTarget) || normalizedTarget.includes(normAct);
                });
                
                if (found) {
                    itemData = {
                        activity: found, // نستخدم الاسم الأصلي من قاعدة البيانات
                        mainSector: mainSector,
                        subSector: subSector,
                        sector: sector
                    };
                    break;
                }
            }
            if (itemData) break;
        }
    }
    
    // 2. نظام الطوارئ (Fallback): إذا فشل البحث الدقيق، نستخدم البيانات المتاحة
    if (!itemData) {
        console.warn("⚠️ [Click Handler] لم يتم العثور على التفاصيل الكاملة، استخدام بيانات الطوارئ.");
        itemData = {
            activity: activityName,
            mainSector: "غير محدد",
            subSector: "غير محدد",
            sector: sector
        };
    }
    
    console.log("✅ [Click Handler] البيانات جاهزة للعرض:", itemData);

    // 3. عرض رسالة المستخدم (محاكاة أن المستخدم ضغط عليها)
    // نستخدم activityName الأصلي الذي ضغط عليه المستخدم
    addMessageToUI('user', activityName);
    
    // 4. حفظ في الذاكرة
    AgentMemory.setDecisionActivity(itemData, activityName);
    
    // 5. توليد HTML للرد
    const responseHTML = formatSingleActivityInDecision104WithIncentives(
        itemData.activity, // نستخدم الاسم من البيانات لضمان الدقة
        itemData,
        sector
    );
    
    // 6. عرض الرد (مع التأكد من استخدام 'ai' وتشغيل مؤشر الكتابة)
    const typingId = showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator(typingId);
        // ✅ التصحيح الأساسي هنا: استخدام 'ai' بدلاً من 'bot'
        typeWriterResponse(responseHTML); 
    }, 500);
};


/**
 * استخراج اسم النشاط من السؤال - النسخة المُحسّنة مع دعم السياق الذكي
 * 
 * المشكلة القديمة:
 * - السؤال: "هل هو وارد بالقرار 104"
 * - النتيجة: "هو" ← ❌ خطأ فادح
 * 
 * الحل الجديد:
 * - كشف الضمائر (هو، هي، ذلك، هذا)
 * - استرجاع اسم النشاط من السياق السابق
 * - النتيجة: "فندق عائم نايل كروز" ← ✅ صحيح
 */
/**
 * استخراج اسم النشاط من السؤال - النسخة الاحترافية (V3)
 * ✅ تحافظ على السياق والضمائر
 * ✅ تحل مشكلة الكلمات الزائدة مثل (وارده، موجودة، مشمول)
 */
function extractActivityFromQueryEnhanced(normalizedQuery) {
    const context = AgentMemory.getContext();
    
    // ═══════════════════════════════════════════════════════════
    // 🛡️ الخطوة 1: كشف الضمائر والكلمات المرجعية (كما هي - لم تتغير)
    // ═══════════════════════════════════════════════════════════
    const pronounPatterns = [
        /^(هو|هي|ذلك|تلك|هذا|هذه|النشاط|ده|دي)\s/,
        /\s(هو|هي|ذلك|تلك|هذا|هذه)\s/,
        /\s(هو|هي|ذلك|تلك|هذا|هذه)$/
    ];
    
    const hasPronoun = pronounPatterns.some(pattern => pattern.test(normalizedQuery));
    
    // استرجاع من السياق عند وجود ضمير
    if (hasPronoun && context) {
        let contextActivityName = null;
        if (context.type === 'activity' && context.data) {
            contextActivityName = context.data.text || context.data.name;
        } else if (context.type === 'decision_activity' && context.data) {
            contextActivityName = context.data.name || context.data.activity;
        } else if (context.type === 'industrial' && context.data) {
            contextActivityName = context.data.name;
        }
        
        if (contextActivityName && contextActivityName.length >= 3) {
            console.log(`🧠 [Context Recovery] تم استرجاع النشاط من السياق (ضمير): "${contextActivityName}"`);
            return contextActivityName;
        }
    }
    
    // ═══════════════════════════════════════════════════════════
    // 🎁 الخطوة 2: كشف أسئلة الحوافز (كما هي - لم تتغير)
    // ═══════════════════════════════════════════════════════════
    const incentivePatterns = [
        /^(يحصل|تحصل|احصل|نحصل)\s*(على|علي)?\s*(حافز|حوافز)/,
        /^حافز/, /^حوافز/, /الحوافز$/, /حوافز$/
    ];
    
    const isIncentiveQuestion = incentivePatterns.some(pattern => pattern.test(normalizedQuery));
    
    if (isIncentiveQuestion && context) {
        let contextActivityName = null;
        if (context.type === 'activity' && context.data) {
            contextActivityName = context.data.text || context.data.name;
        } else if (context.type === 'decision_activity' && context.data) {
            contextActivityName = context.data.name || context.data.activity;
        }
        
        if (contextActivityName && contextActivityName.length >= 3) {
            console.log(`🎁 [Incentive Question] تم استرجاع النشاط من السياق: "${contextActivityName}"`);
            return contextActivityName;
        }
    }
    
    // ═══════════════════════════════════════════════════════════
    // 🧹 الخطوة 3: التنظيف الذكي والموسع (تم التحسين هنا 🚀)
    // ═══════════════════════════════════════════════════════════
    let cleaned = normalizedQuery;
    
    // 1. إزالة عبارات السؤال الشائعة في البداية
    cleaned = cleaned.replace(/^(هل|ما|ماذا|كيف|اين)\s+(هو|هي|عن|بخصوص|نشاط)?\s*/g, '');
    cleaned = cleaned.replace(/^نشاط\s+/g, ''); 

    // 2. قائمة الأنماط الموحدة (تم إصلاح تكرار التعريف لإنهاء خطأ SyntaxError)
    const patternsToRemove = [
        // أ. حذف كلمات التواجد والشمول بحدود دقيقة للكلمة
        /\b(وارد|وارده|واردة|موجود|موجوده|موجودة|مدرج|مدرجه|مدرجة|مذكور|مذكوره|مشمول|مشموله|منصوص|منصوصه)\b/gi,
        
        // ب. حذف كلمة نشاط لزيادة التركيز
        /\b(نشاط|النشاط)\b/gi,
        
        // ج. سياق القرار والقطاعات
        /\s+(بالقرار|في القرار|داخل القرار|ضمن القرار)\s*104?/g,
        /\s+(بالقطاع|في القطاع|داخل القطاع)\s*[أابب]/g,
        /\s+قطاع\s*[أابب]/g,
        /قرار\s*104/g,
        /104/g,
        
        // د. حروف الجر الميتة في نهاية الجملة
        /\s+(في|عن|على)\s*$/g
    ];
    
    // 3. تنفيذ عملية الحذف والتطهير
    patternsToRemove.forEach(pattern => {
        cleaned = cleaned.replace(pattern, ' ');
    });
    
    // 4. تنظيف المسافات الزائدة الناتجة عن الحذف
    cleaned = cleaned.trim().replace(/\s+/g, ' ');

    // 5. إزالة "ال" التعريف من بداية الكلمة (لتحسين مطابقة الجذور)
    if (cleaned.startsWith('ال') && cleaned.length > 4) {
        cleaned = cleaned.substring(2);
    }

    // 6. مسح نهائي لأي لواحق كلمات تائهة في نهاية النص
    cleaned = cleaned.replace(/(وارده|واردة|موجوده|موجودة)$/, '').trim();
    
    console.log(`🧼 تنظيف الاستعلام النهائي: من [${normalizedQuery}] إلى [${cleaned}]`);
    
    // ═══════════════════════════════════════════════════════════
    // 🔄 الخطوة 4: Fallback للسياق (كما هي - لم تتغير)
    // ═══════════════════════════════════════════════════════════
    if ((!cleaned || cleaned.length < 3) && context) {
        let contextActivityName = null;
        if (context.type === 'activity' && context.data) {
            contextActivityName = context.data.text || context.data.name;
        } else if (context.type === 'decision_activity' && context.data) {
            contextActivityName = context.data.name || context.data.activity;
        }
        
        if (contextActivityName && contextActivityName.length >= 3) {
            console.log(`🔄 [Fallback] الناتج قصير، استرجاع من السياق: "${contextActivityName}"`);
            return contextActivityName;
        }
    }
    
    return cleaned.length > 2 ? cleaned : null;
}
/**
 * دالة استخراج اسم النشاط - الطريقة الاحتياطية
 * @param {string} normalizedQuery - السؤال المُنظّف
 * @returns {string|null}
 */
function extractActivityFromQueryFallback(normalizedQuery) {
    // محاولات متنوعة لاستخراج النشاط
    let activityName = null;
    
    // نمط: هل نشاط [اسم النشاط] وارد بالقرار 104؟
    if (/هل.*نشاط.*104/.test(normalizedQuery)) {
        activityName = normalizedQuery.replace(/هل.*نشاط\s*/g, '')
                                      .replace(/\s*(وارد|موجود|مدرج|مذكور).*/g, '')
                                      .trim();
    }
    // نمط: هل [اسم النشاط] بالقرار 104؟
    else if (/هل.*104/.test(normalizedQuery)) {
        activityName = normalizedQuery.replace(/هل\s*/g, '')
                                     .replace(/\s*104.*/g, '')
                                     .trim();
    }
    // نمط عام يحتوي على كلمة نشاط
    else if (/(نشاط|انشطة|انشطه)\s/.test(normalizedQuery)) {
        activityName = normalizedQuery.replace(/.*?(نشاط|انشطة|انشطه)\s*/g, '')
                                     .replace(/\s*(في|ب|بالقرار|104).*/g, '')
                                     .trim();
    }
    // نمط: بحث عن [اسم النشاط] في القرار 104
    else if (/بحث.*عن/.test(normalizedQuery)) {
        activityName = normalizedQuery.replace(/.*بحث.*عن\s*/g, '')
                                     .replace(/\s*(في|ب|بالقرار).*/g, '')
                                     .trim();
    }
    
    // تنظيف النتيجة النهائية
    if (activityName) {
        activityName = activityName
            .replace(/\s+(هو|هي|في|ب|من|الى|على|عن|مع)/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        if (activityName.length >= 3 && activityName.length <= 100) {
            return activityName;
        }
    }
    
    return null;
}

/**
 * دالة استخراج اسم النشاط من السؤال
 * @param {string} query - السؤال المُنظّف
 * @returns {string|null}
 */
function extractActivityFromQuery(query) {
    // تنظيف السؤال مع الحفاظ على جوهر النشاط
    let cleaned = query;
    
    // إزالة الكلمات الاستفهامية والكلمات الشائعة فقط
    cleaned = cleaned
        .replace(/^(هل|ما|ماذا|اين|كيف|متى|هل نشاط|هل\s*)/g, '')
        .replace(/\s*(وارد|موجود|مدرج|مذكور)\s*(ب|في)?\s*(قرار|القرار)?\s*104/g, '')
        .replace(/\s*(يحصل|تحصل|احصل|نحصل)\s*على?\s*(حافز|حوافز)/g, '')
        .replace(/\s*(في|ب|باي|بأي|اي|أي)\s*قطاع/g, '')
        .replace(/\s*يجب\s*ممارسة\s*/g, '')
        .replace(/\s*منطقة\s*محددة/g, '')
        .replace(/\s*104/g, '')
        .trim();
    
    // إزالة كلمة "نشاط" إذا كانت في البداية فقط
    cleaned = cleaned.replace(/^نشاط\s+/, '');
    
    // إزالة "ال" التعريف إذا كانت في البداية
    cleaned = cleaned.replace(/^ال/, '');
    
    // تطبيع العربية
    cleaned = normalizeArabic(cleaned);
    
    // إذا تبقى شيء معقول (أكثر من 3 أحرف)
    if (cleaned.length >= 3 && cleaned.length <= 100) {
        return cleaned;
    }
    
    return null;
}

/**
 * دالة تنسيق نظرة عامة على القرار 104
 * @returns {string} HTML
 */
function formatDecision104Overview() {
    return `
        <div class="info-card">
            <div class="info-card-header">
                📋 قرار رئيس مجلس الوزراء رقم 104 لسنة 2022
            </div>
            <div class="info-card-content">
                <strong>يحدد هذا القرار الأنشطة الاستثمارية المؤهلة للحصول على الحوافز الخاصة وفقاً لقانون الاستثمار رقم 72 لسنة 2017.</strong>
                
                <br><br>
                <strong>ينقسم القرار إلى قطاعين:</strong>
                <br><br>
                
                <div style="background: #e8f5e9; padding: 12px; border-radius: 8px; margin: 10px 0;">
                    <strong style="color: #2e7d32;">📍 القطاع أ:</strong>
                    <br>أنشطة استثمارية محددة يجب ممارستها في مناطق جغرافية معينة
                </div>
                
                <div style="background: #e3f2fd; padding: 12px; border-radius: 8px; margin: 10px 0;">
                    <strong style="color: #1565c0;">🌍 القطاع ب:</strong>
                    <br>أنشطة استثمارية محددة يمكن ممارستها في باقي أنحاء الجمهورية
                </div>
            </div>
        </div>
        
        <div class="tech-notes">
            <div class="tech-notes-title">⚠️ شرط الحصول على الحوافز</div>
            <div class="tech-notes-content">
                يجب أن تكون الشركة قد تأسست بعد العمل بقانون الاستثمار رقم 72 لسنة 2017
            </div>
        </div>
             <div style="margin-top: 15px;">
            <!-- زر تحميل القرار 104 الجديد -->
            <a href="https://www.investinegypt.gov.eg/Fact%20Sheets/%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%B1%20104%20%D9%84%D8%B3%D9%86%D9%87%202022%20%D8%AA%D9%88%D8%B2%D9%8A%D8%B9%20%D8%A7%D9%84%D9%82%D8%B7%D8%A7%D8%B9%D8%A7%D8%AA%20%D8%A7%D9%84%D9%81%D8%B1%D8%B9%D9%8A%D9%87%20%D9%82%D8%A7%D9%86%D9%88%D9%86%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%AB%D9%85%D8%A7%D8%B1%20(1).pdf" 
               target="_blank" 
               class="choice-btn" 
               style="text-decoration: none; background: linear-gradient(135deg, #ff4757, #ff6b81); color: white; justify-content: center; font-weight: bold; margin-bottom: 12px;">
                <span class="choice-icon" style="margin-left: 8px;">📥</span> عرض نص القرار 104 (PDF)
            </a>

            <div class="choice-btn" onclick="sendMessage('ما هي الأنشطة للقطاع أ')">
                <span class="choice-icon">📋</span> عرض أنشطة القطاع أ
            </div>
            <div class="choice-btn" onclick="sendMessage('ما هي الأنشطة للقطاع ب')">
                <span class="choice-icon">📋</span> عرض أنشطة القطاع ب
            </div>
            <div class="choice-btn" onclick="sendMessage('ما هي حوافز القطاع أ')">
                <span class="choice-icon">🎁</span> عرض حوافز القطاع أ
            </div>
            <div class="choice-btn" onclick="sendMessage('ما هي المناطق الجغرافيه للقطاع أ')">
                <span class="choice-icon">🗺️</span> المناطق الجغرافية للقطاع أ
            </div>
        </div>
    `;
}






/**
 * دالة تنسيق رد مُحسَّن عند إيجاد النشاط في القرار 104
 * @param {Object} result - نتيجة البحث
 * @param {string} responseType - نوع الرد
 * @returns {string} HTML
 */
function formatActivityFoundResponse(result, responseType) {
    const item = result.item;
    const sectorName = item.sector === 'A' ? 'القطاع أ' : 'القطاع ب';
    const sectorColor = item.sector === 'A' ? '#4caf50' : '#2196f3';
    
    // ✅ بناء الرد الأساسي المنظم
    let html = `
        <div style="background: linear-gradient(135deg, ${sectorColor}15, #ffffff); padding: 20px; border-radius: 16px; border: 2px solid ${sectorColor}; margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <div style="background: ${sectorColor}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-check" style="color: white; font-size: 12px;"></i>
                </div>
                <div style="font-size: 1.2rem; font-weight: 700; color: ${sectorColor}dd;">
                    ✅ نعم، هذا النشاط وارد في القرار 104 لسنة 2022
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="color: #2c3e50; font-size: 1.1rem; font-weight: 600; margin-bottom: 8px;">
                    📋 اسم النشاط كما ورد في القرار:
                </div>
                <div style="background: #f8f9fa; padding: 14px; border-radius: 12px; border-right: 3px solid ${sectorColor}; color: #2c3e50; font-size: 1rem; line-height: 1.6;">
                    ${item.activity}
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="background: white; padding: 14px; border-radius: 12px; box-shadow: 0 3px 12px rgba(0,0,0,0.08);">
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 6px;">🏷️ القطاع</div>
                    <div style="color: ${sectorColor}; font-size: 1.1rem; font-weight: 700;">${sectorName}</div>
                </div>
                
                <div style="background: white; padding: 14px; border-radius: 12px; box-shadow: 0 3px 12px rgba(0,0,0,0.08);">
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 6px;">🏭 القطاع الرئيسي</div>
                    <div style="color: #2c3e50; font-size: 1rem; font-weight: 600;">${item.mainSector}</div>
                </div>
                
                <div style="background: white; padding: 14px; border-radius: 12px; box-shadow: 0 3px 12px rgba(0,0,0,0.08);">
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 6px;">📂 القطاع الفرعي</div>
                    <div style="color: #2c3e50; font-size: 1rem; font-weight: 600;">${item.subSector}</div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="color: #2c3e50; font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-file-alt" style="color: ${sectorColor};"></i>
                    النشاط وشروطه كما ورد في القرار:
                </div>
                <div style="background: #f8f9fa; padding: 16px; border-radius: 12px; border: 1px solid #e0e0e0; color: #444; font-size: 1rem; line-height: 1.7; white-space: pre-line;">
                    ${item.activity}
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e0e0e0; color: #666; font-size: 0.95rem;">
                        💡 <strong>ملاحظة:</strong> هذه هي الصيغة الرسمية للنشاط كما وردت بالقرار رقم 104 لسنة 2022
                    </div>
                </div>
            </div>
    `;
    
    // ✅ شرط القطاع أ: تأكيد على المناطق المحددة
    if (item.sector === 'A') {
        html += `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <div style="background: #ff9800; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-exclamation" style="color: white; font-size: 10px;"></i>
                    </div>
                    <div style="color: #e65100; font-size: 1.1rem; font-weight: 700;">
                        ⚠️ شرط مهم للقطاع أ
                    </div>
                </div>
                
                <div style="background: #fff3e0; padding: 16px; border-radius: 12px; border-right: 4px solid #ff9800; color: #bf360c; line-height: 1.6; margin-bottom: 12px;">
                    <strong>يجب ممارسة هذا النشاط في المناطق الجغرافية المحددة للقطاع أ فقط:</strong>
                    <ul style="margin: 10px 0; padding-right: 20px;">
                        <li>محافظات الصعيد</li>
                        <li>محافظات الحدود</li>
                        <li>شبه جزيرة سيناء</li>
                        <li>النطاق الجغرافي ب، ج (حسب الخريطة الاستثمارية)</li>
                        <li>المناطق الأقل نمواً</li>
                    </ul>
                </div>
                
                <div class="choice-btn" onclick="sendMessage('ما هي المناطق المحددة للقطاع أ')" style="margin-top: 10px; background: linear-gradient(135deg, #ff9800, #f57c00); color: white; border: none;">
                    <span class="choice-icon">🗺️</span>
                    <strong>عرض المناطق الجغرافية للقطاع أ بالتفصيل</strong>
                </div>
            </div>
        `;
    } else {
        html += `
            <div style="background: #e3f2fd; padding: 16px; border-radius: 12px; border-right: 4px solid #2196f3; color: #1565c0; margin-bottom: 20px; line-height: 1.6;">
                <strong>💡 ملاحظة:</strong> القطاع ب يسمح بممارسة النشاط في باقي أنحاء الجمهورية، ولا يتطلب منطقة جغرافية محددة.
            </div>
        `;
        
        // ✅ التعديل الذكي: فحص إذا كان النشاط داخل قطاع النقل وهو تحديداً "النقل الجماعي"
        // نقوم بفحص اسم النشاط (activityName) إذا كان يحتوي على جملة "النقل الجماعي"
        const isMassTransit = item.activityName && item.activityName.includes("النقل الجماعي");
        
        if (item.mainSector === "النقل" && isMassTransit) {
            html += formatTransportSpecialConditions();
        }
        
        // ✅ فحص وعرض الشروط العامة للأنشطة المحددة (بما فيها كل أنشطة النقل الأخرى)
        if (shouldShowGeneralConditions(item.mainSector)) {
            html += formatSectorBGeneralConditions();
        }
    }
    
    // ✅ شرط تأسيس الشركة بعد قانون الاستثمار
    html += `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <div style="background: #9c27b0; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-balance-scale" style="color: white; font-size: 10px;"></i>
                </div>
                <div style="color: #7b1fa2; font-size: 1.1rem; font-weight: 700;">
                    ⚖️ الشرط التشريعي الأساسي
                </div>
            </div>
            
            <div style="background: #f3e5f5; padding: 16px; border-radius: 12px; border: 2px solid #9c27b0; color: #6a1b9a; line-height: 1.7;">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <i class="fas fa-gavel" style="color: #9c27b0; font-size: 1.2rem; margin-top: 2px;"></i>
                    <div>
                        <strong>يجب أن تكون الشركة قد تأسست بعد العمل بقانون الاستثمار رقم 72 لسنة 2017</strong>
                        <div style="margin-top: 8px; font-size: 0.95rem;">
                            هذا شرط أساسي للحصول على الحوافز والإعفاءات المقررة بموجب القرار 104.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 24px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
                <div class="choice-btn" onclick="sendMessage('هل ${item.activity} وارد بالقرار 104')" style="background: linear-gradient(135deg, #9c27b0, #7b1fa2); color: white; border: none; text-align: center;">
                    <span class="choice-icon">📋</span>
                    <strong>البحث في كامل القرار 104</strong>
                </div>
                
                <div class="choice-btn" onclick="sendMessage('ما هي حوافز ${sectorName}')" style="background: linear-gradient(135deg, ${sectorColor}, ${sectorColor}dd); color: white; border: none; text-align: center;">
                    <span class="choice-icon">🎁</span>
                    <strong>حوافز ${sectorName}</strong>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="choice-btn" onclick="sendMessage('هل ${item.activity} وارد بالقطاع أ')" style="background: linear-gradient(135deg, #4caf50, #388e3c); color: white; border: none; text-align: center;">
                    <span class="choice-icon">🏭</span>
                    <strong>البحث في القطاع أ</strong>
                </div>
                
                <div class="choice-btn" onclick="sendMessage('هل ${item.activity} وارد بالقطاع ب')" style="background: linear-gradient(135deg, #2196f3, #1976d2); color: white; border: none; text-align: center;">
                    <span class="choice-icon">🌍</span>
                    <strong>البحث في القطاع ب</strong>
                </div>
            </div>
        </div>
    `;
    
    html += `</div>`;
    
    return html;
}/**
 * دالة تنسيق رد عند عدم إيجاد النشاط
 * @param {string} activityName - اسم النشاط
 * @returns {string} HTML
 */
function formatActivityNotFoundResponse(activityName) {
    return `
        <div style="background: #ffebee; padding: 16px; border-radius: 12px; border-right: 4px solid #f44336;">
            ❌ <strong>لم يتم العثور على "${activityName}" في القرار 104 لسنة 2022</strong>
        </div>
        
        <div class="tech-notes" style="margin-top: 15px;">
            <div class="tech-notes-title">💡 ملاحظة</div>
            <div class="tech-notes-content">
                هذا النشاط قد يكون:<br>
                • غير مشمول في القرار 104<br>
                • مُدرج تحت مسمى مختلف<br>
                • جزء من نشاط أوسع<br>
                <br>
                يُنصح بمراجعة الهيئة العامة للاستثمار للتأكد
            </div>
        </div>
        
        <div style="margin-top: 15px;">
            <div class="choice-btn" onclick="sendMessage('ما هي الأنشطة للقطاع أ')">
                <span class="choice-icon">📋</span> تصفح أنشطة القطاع أ
            </div>
            <div class="choice-btn" onclick="sendMessage('ما هي الأنشطة للقطاع ب')">
                <span class="choice-icon">📋</span> تصفح أنشطة القطاع ب
            </div>
        </div>
    `;
}

function renderDecisionSectorList(sector, isMainOnly = false) {
    // 1. تحديد مصدر البيانات
    const data = (sector === 'A') ? window.sectorAData : window.sectorBData;
    
    if (!data) return "⚠️ عذراً، لم يتم العثور على بيانات هذا القطاع.";

    const color = (sector === 'A') ? '#4caf50' : '#2196f3';
    let html = `<div style="border-right: 5px solid ${color}; padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); direction: rtl;">`;
    html += `<h4 style="color: ${color}; margin-top:0;">📋 أنشطة القرار 104 - القطاع ${sector === 'A' ? 'أ' : 'ب'}</h4>`;

    // إذا كان القطاع ب، نعرض زر الشروط في البداية (إلا إذا طلب الأنشطة الرئيسية فقط)
    if (sector === 'B' && !isMainOnly) {
        html += `
        <div class="choice-btn" onclick="sendMessage('عرض الشروط العامة والخاصة للقطاع ب')" style="background: #e3f2fd; border: 1px solid #2196f3; color: #1565c0; margin: 10px 0;">
            <span class="choice-icon">⚖️</span> <strong>عرض الشروط العامة والخاصة للقطاع ب</strong>
        </div>`;
    }

    // 2. حلقة التكرار على كافة القطاعات الرئيسية
    for (const mainSector in data) {
        if (isMainOnly) {
            // ✅ عرض كأزرار (سيتم تكرار هذا الجزء لكل قطاع رئيسي موجود في البيانات)
            html += `
            <div class="choice-btn" onclick="sendMessage('عرض انشطة ${mainSector} في القطاع ${sector === 'A' ? 'أ' : 'ب'}')" style="margin: 8px 0; border-right: 4px solid ${color}; text-align: right;">
                <span class="choice-icon">📁</span> <strong>${mainSector}</strong>
            </div>`;
        } else {
            // ✅ عرض تفصيلي (في حالة طلب كامل الأنشطة)
            html += `<div style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">`;
            html += `<strong style="color: #333; display: block; margin-bottom: 5px;">📁 ${mainSector}</strong>`;
            
            for (const subSector in data[mainSector]) {
                html += `<div style="font-size: 0.9em; color: #1a73e8; margin-right: 15px; font-weight: 500;">🔹 ${subSector}</div>`;
                data[mainSector][subSector].forEach(activity => {
                    html += `<div style="font-size: 0.85em; color: #666; margin-right: 30px; margin-top: 2px;">• ${activity}</div>`;
                });
            }
            html += `</div>`;
        }
    } // نهاية حلقة for

    html += `</div>`;
    return html;
}

// دالة عرض الشروط العامة والخاصة للقطاع ب
function renderSectorBConditions() {
    const genConditions = window.decision104.sectorBGeneralConditions;
    const transConditions = window.decision104.transportSpecialConditions;

    let html = `<div style="border-right: 5px solid #2196f3; padding: 15px; background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); direction: rtl;">`;
    html += `<h4 style="color: #1565c0; margin-top:0; border-bottom: 2px solid #e3f2fd; padding-bottom: 10px;">⚖️ الشروط العامة والخاصة - للقطاع ب</h4>`;

    // أولاً: الشروط العامة
    html += `<div style="margin-bottom: 20px;">`;
    html += `<strong style="color: #0d47a1; display: block; margin-bottom: 8px;">📌 الشروط العامة للاستحقاق:</strong>`;
    html += `<p style="font-size: 0.9em; color: #444; line-height: 1.6; background: #e3f2fd; padding: 10px; border-radius: 8px;">${genConditions.title}</p>`;
    html += `<ul style="font-size: 0.85em; color: #555; padding-right: 20px;">`;
    genConditions.conditions.forEach(c => {
        html += `<li style="margin-bottom: 5px;">${c.text}</li>`;
    });
    html += `</ul></div>`;

    // ثانياً: ضوابط النقل الجماعي (شروط خاصة)
    html += `<div style="margin-top: 15px; border-top: 1px dashed #ccc; padding-top: 15px;">`;
    html += `<strong style="color: #e65100; display: block; margin-bottom: 8px;">🚌 ضوابط خاصة (النقل الجماعي للمدن الجديدة):</strong>`;
    html += `<ul style="font-size: 0.85em; color: #555; padding-right: 20px;">`;
    transConditions.conditions.forEach(c => {
        html += `<li style="margin-bottom: 5px;">${c.text}</li>`;
    });
    html += `</ul></div>`;

    html += `</div>`;
    return html;
}

function renderSingleMainSector(sector, mainSectorName) {
    const data = (sector === 'A') ? window.sectorAData : window.sectorBData;
    const targetData = data[mainSectorName];
    
    if (!targetData) return `⚠️ عذراً، لم يتم العثور على تفاصيل لـ ${mainSectorName}.`;

    const color = (sector === 'A') ? '#4caf50' : '#2196f3';
    let html = `<div style="border-right: 5px solid ${color}; padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); direction: rtl;">`;
    html += `<h4 style="color: ${color}; margin-top:0; border-bottom: 2px solid #eee; padding-bottom:10px;">📂 تفاصيل ${mainSectorName} - القطاع ${sector === 'A' ? 'أ' : 'ب'}</h4>`;

    // عرض القطاعات الفرعية والأنشطة لهذا النشاط الرئيسي فقط
    for (const subSector in targetData) {
        html += `<div style="margin-bottom: 15px;">`;
        html += `<div style="font-size: 0.95em; color: #1a73e8; font-weight: bold; margin-bottom: 5px;">🔹 ${subSector}</div>`;
        
        targetData[subSector].forEach(activity => {
            html += `<div style="font-size: 0.85em; color: #555; margin-right: 20px; border-right: 2px solid #eee; padding-right: 8px; margin-top: 4px;">• ${activity}</div>`;
        });
        html += `</div>`;
    }

    html += `<div class="choice-btn" onclick="sendMessage('الأنشطة الرئيسية للقطاع ${sector === 'A' ? 'أ' : 'ب'}')" style="margin-top: 15px; background: #f8f9fa; font-size: 0.8em; text-align: center;">`;
    html += `⬅️ العودة لقائمة الأنشطة الرئيسية</div>`;
    
    html += `</div>`;
    return html;
}