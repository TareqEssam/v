window.GPT_AGENT = window.GPT_AGENT || {};

// ==================== 🔍 دوال مساعدة عامة ====================

/**
 * تطبيع النص العربي (إزالة التشكيل، توحيد الأحرف)
 */
function normalizeArabic(text) {
    if (!text) return '';
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
}

/**
 * هروب النص لاستخدامه داخل JavaScript (للاستخدام في onclick)
 */
function escapeForJS(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'")
              .replace(/"/g, '&quot;')
              .replace(/\n/g, '\\n')
              .replace(/\r/g, '\\r');
}

/**
 * إضافة رسالة إلى واجهة المحادثة (يجب أن تكون معرفة في المشروع)
 */
function addMessageToUI(role, content) {
    if (window.addMessageToUI) {
        window.addMessageToUI(role, content);
    } else {
        console.warn("addMessageToUI غير معرفة، الرسالة:", role, content);
    }
}

/**
 * إظهار مؤشر الكتابة (يجب أن تكون معرفة)
 */
function showTypingIndicator() {
    return Date.now() + '_' + Math.random();
}

/**
 * إزالة مؤشر الكتابة
 */
function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

/**
 * كتابة الرد بشكل تدريجي (اختياري)
 */
function typeWriterResponse(html) {
    if (window.typeWriterResponse) {
        window.typeWriterResponse(html);
    } else {
        addMessageToUI('ai', html);
    }
}

// ==================== 🔍 البحث في القرار 104 باستخدام NeuralSearch ====================

/**
 * دالة البحث في القرار 104 باستخدام NeuralSearch الموحد
 * @param {string} activityName - اسم النشاط المراد البحث عنه
 * @returns {Array} - مصفوفة تحتوي على النتائج
 */
function searchInDecision104WithNeural(activityName) {
    console.log("🔍 البحث المحسّن في القرار 104:", activityName);
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
    
    const results = searchInDecision104EnhancedForSpecificSector(activityName, sector);
    const selectedResult = results.find(r => r.item.activity === activityName && r.item.sector === sector);
    
    if (selectedResult) {
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
        addMessageToUI('user', activityName);
        
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
    
    if (s1.includes(s2) || s2.includes(s1)) {
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        return shorter.length / longer.length;
    }
    
    const words1 = s1.split(/\s+/).filter(w => w.length > 2);
    const words2 = s2.split(/\s+/).filter(w => w.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
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
    
    if (s1.includes(s2) || s2.includes(s1)) {
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        return shorter.length / longer.length;
    }
    
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

    const searchResults = NeuralSearch(activityName, window.decision104.unifiedSearchDB, {
        minScore: 50,
        limit: 10
    });

    let mapped = searchResults.results.map(r => ({
        item: r.originalData,
        score: r.finalScore,
        confidence: Math.min(Math.round(r.finalScore / 10), 100),
        sector: r.originalData.sector
    }));

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

// ==================== 🎯 handleDecision104Query - النسخة الذكية ====================

function handleDecision104Query(query, questionType) {
    let q = normalizeArabic(query).replace(/القطا\s+ع/g, 'القطاع').replace(/\s+/g, ' ').trim();
    
    console.log("🎯 محرك القرار 104: بدء المعالجة لـ:", query);

    if (q.includes('انشط') && (q.includes('قطاع') || q.includes('القطاع'))) {
        if (q.includes('عرض انشطه') && q.includes('في القطاع')) {
            const targetSector = (q.includes('قطاع ب') || q.includes('القطاع ب')) ? 'B' : 'A';
            const data = (targetSector === 'A') ? window.sectorAData : window.sectorBData;
            
            for (const mainName in data) {
                if (q.includes(normalizeArabic(mainName))) {
                    console.log("🎯 العقل المدبر: عرض تفاصيل النشاط الرئيسي: " + mainName);
                    return renderSingleMainSector(targetSector, mainName);
                }
            }
        }

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

    if (q.includes('عرض انشطه') && q.includes('في القطاع')) {
        const targetSector = q.includes('قطاع ب') ? 'B' : 'A';
        const data = (targetSector === 'A') ? window.sectorAData : window.sectorBData;
        for (const mainName in data) {
            if (q.includes(normalizeArabic(mainName))) {
                console.log("🎯 عرض تفصيلي للنشاط الرئيسي: " + mainName);
                return renderSingleMainSector(targetSector, mainName);
            }
        }
    }

    const context = AgentMemory.getContext();
    let activityName = extractActivityFromQueryEnhanced(q);

    if (q.includes('شروط') && q.includes('ب')) {
        console.log("🎯 تم طلب عرض شروط القطاع ب");
        return renderSectorBConditions();
    }

    if (/ما\s*(هو|هي).*قرار.*104/.test(q) || /قرار.*104.*ايه/.test(q)) {
        return formatDecision104Overview();
    }

    if (/(ما|ماهي|اذكر).*مناطق.*(قطاع|القطاع)\s*(أ|ا|1)/.test(q) || 
        q.includes('المناطق المحددة للقطاع أ')) {
        return formatSectorARegionsDetailed();
    }

    if (/(ما|ماهي|اذكر|اين|أين).*مناطق.*(قطاع|القطاع)\s*(ب|2)/.test(q) || 
        q.includes('المناطق المحددة للقطاع ب') ||
        q.includes('مناطق القطاع ب')) {
        return formatSectorBRegions();
    }

    if (/(ما|ماهي|اذكر).*حوافز.*(قطاع|القطاع)\s*(أ|ا|1)/.test(q)) {
        return formatSectorIncentives('A');
    }

    if (/(ما|ماهي|اذكر).*حوافز.*(قطاع|القطاع)\s*(ب|2)/.test(q)) {
        return formatSectorIncentives('B');
    }

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

    const scopeDetection = detectSearchScopeEnhanced(q);
    const searchScope = scopeDetection.scope;

    console.log(`🎯 [Search Scope] النطاق: ${scopeDetection.scopeName}`);

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

    if (searchScope !== 'both') {
        results = results.filter(r => (r.sector || r.item?.sector) === searchScope);
    }

    results = deduplicateResults(results);
    console.log(`✅ [After Deduplication] ${results.length} نتيجة`);

    const commonVerbs = [
        'تصنيع', 'انتاج', 'إنتاج', 'تجميع', 'اقامة', 'إقامة', 
        'تشغيل', 'تجهيز', 'توريد', 'مشروع', 'نشاط', 'صناعة', 
        'خدمات', 'مركز', 'وحدات', 'مكونات', 'محطات', 'توليد',
        'وارد', 'وارده', 'واردة', 'موجود', 'موجودة', 'مدرج', 'مدرجة', 'مذكور'
    ];

    const queryTerms = activityName.split(/\s+/).map(w => normalizeArabic(w));
    const significantTerms = queryTerms.filter(w => !commonVerbs.includes(w) && w.length > 2);

    console.log(`🧠 [Smart Filter] الكلمات الجوهرية: [${significantTerms.join(', ')}]`);

    if (significantTerms.length > 0 && results.length > 0) {
        const strictResults = results.filter(r => {
            const itemText = normalizeArabic(r.item.activity);
            const matchedTermsCount = significantTerms.filter(term => itemText.includes(term)).length;
            const matchPercentage = (matchedTermsCount / significantTerms.length);
            return matchPercentage >= 0.7;
        });

        if (strictResults.length > 0) {
            console.log(`🧹 [Smart Filter] تم تقليص النتائج من ${results.length} إلى ${strictResults.length} نتيجة دقيقة.`);
            results = strictResults;
        } else {
            console.log("⚠️ [Smart Filter] لم نجد نشاطاً يطابق أغلب الكلمات الجوهرية، تم الحفاظ على النتائج الأصلية.");
        }
    }

    if (results.length > 1) {
        if (significantTerms.length > 0) {
            results.sort((a, b) => {
                const textA = normalizeArabic(a.item.activity);
                const textB = normalizeArabic(b.item.activity);
                const matchA = significantTerms.filter(t => textA.includes(t)).length;
                const matchB = significantTerms.filter(t => textB.includes(t)).length;
                return (matchB - matchA) || (b.score - a.score);
            });
        }

        const topScore = results[0].confidence || results[0].score || 0;
        if (topScore >= 80) {
            results = results.filter(r => (r.confidence || r.score || 0) >= (topScore * 0.7));
        } else if (topScore >= 50) {
            results = results.filter(r => (r.confidence || r.score || 0) >= 40);
        }
    }

    if (!results || results.length === 0) {
        console.log("❌ [No Results] لم يتم العثور على أي نتائج");
        return formatActivityNotFoundInDecision104(activityName, searchScope);
    }

    if (results.length === 1) {
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
        console.log(`📋 [Multiple Results] عرض ${results.length} نشاط للاختيار`);
        return formatMultipleActivitiesInDecision104WithBothSectorsFixed(
            activityName,
            results,
            searchScope
        );
    }
}

// وظائف مساعدة إضافية

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
║  ✓ Smart Keyword Filtering                                   ║
║  ✓ Sector B Fix                                              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

function searchInDecision104EnhancedForBothSectors(activityName) {
    const normalizedQuery = normalizeArabic(activityName);
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
    
    let allResults = [];
    
    if (window.sectorAData) {
        allResults.push(...searchInSectorData(window.sectorAData, 'A', 'القطاع أ', normalizedQuery, queryWords));
    }
    if (window.sectorBData) {
        allResults.push(...searchInSectorData(window.sectorBData, 'B', 'القطاع ب', normalizedQuery, queryWords));
    }
    
    allResults.sort((a, b) => b.score - a.score);
    return deduplicateResults(allResults);
}

function searchInDecision104EnhancedForSpecificSector(activityName, targetSector) {
    const normalizedQuery = normalizeArabic(activityName);
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
    
    if (targetSector === 'A') {
        return searchInSectorData(window.sectorAData, 'A', 'القطاع أ', normalizedQuery, queryWords);
    } else {
        return searchInSectorData(window.sectorBData, 'B', 'القطاع ب', normalizedQuery, queryWords);
    }
}

function searchInSectorData(sectorData, sectorId, sectorName, normalizedQuery, queryWords) {
    let flatData = [];
    for (const [mainSector, subSectors] of Object.entries(sectorData)) {
        for (const [subSector, activities] of Object.entries(subSectors)) {
            activities.forEach(act => {
                flatData.push({ activity: act, mainSector, subSector, sector: sectorId });
            });
        }
    }

    const searchResults = NeuralSearch(normalizedQuery, flatData, { 
        minScore: 35, 
        cacheScope: `sector_${sectorId}`
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

function evaluateActivityMatch(normalizedActivity, normalizedQuery, queryWords, item) {
    let score = 0;
    let matchedWords = 0;
    let matchType = 'none';
    
    if (normalizedActivity === normalizedQuery) {
        score = 1000;
        matchedWords = queryWords.length;
        matchType = 'exact_match';
    }
    else if (normalizedActivity.includes(normalizedQuery) || normalizedQuery.includes(normalizedActivity)) {
        score = 800;
        matchedWords = Math.min(queryWords.length, normalizedActivity.split(/\s+/).length);
        matchType = 'partial_match';
    }
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
            score = Math.round(matchPercentage * 8);
            matchedWords = keywordMatches;
            matchType = 'keyword_match';
        }
    }
    
    if (score < 500) {
        const similarity = calculateWordSimilarityForDecision104(normalizedQuery, normalizedActivity);
        if (similarity >= 0.5) {
            score = Math.max(score, Math.round(similarity * 600));
            matchType = 'fuzzy_match';
        }
    }
    
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

// ==================== FIX #3 & #4: إصلاح القطاع ب + إخفاء المعلومات الزائدة ====================

function formatMultipleActivitiesInDecision104WithBothSectorsFixed(activityName, results, searchScope = 'both') {
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
    
    const sectorAResults = results.filter(r => (r.item?.sector || r.sector) === 'A');
    const sectorBResults = results.filter(r => (r.item?.sector || r.sector) === 'B');
    
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
    
    if ((searchScope === 'both' || searchScope === 'A') && sectorAResults.length > 0) {
        html += formatSectorResultsSection('A', sectorAResults, activityName);
    }
    
    if ((searchScope === 'both' || searchScope === 'B') && sectorBResults.length > 0) {
        html += formatSectorResultsSection('B', sectorBResults, activityName);
    }
    
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
    
    html += `
        <div style="margin-top: 16px; padding: 12px; background: #fff3e0; border-radius: 10px; border: 1px solid #ffcc80;">
            <div style="color: #e65100; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-lightbulb" style="color: #ff9800;"></i>
                <span>💡 الفرق بين القطاعين:</span>
            </div>
            <div style="color: #bf360c; font-size: 0.9em; margin-top: 8px; line-height: 1.5;">
                <strong>القطاع أ:</strong> يتطلب ممارسة النشاط في مناطق محددة (حوافز أعلى 50%)<br>
                <strong>القطاع ب:</strong> يمكن ممارسته في أي مكان بالجمهورية (حوافز 30%)
            </div>
        </div>
    `;
    
    return html;
}

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
        
        html += `
            <div class="choice-btn" onclick="selectSpecificActivityInDecision104('${escapeForJS(itemData.activity)}', '${sector}')" 
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

// ==================== FIX #5: تحسين كشف القطاعات ====================

function detectSearchScopeEnhanced(query) {
    const q = normalizeArabic(query);
    
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
    
    const sectorBPatterns = [
        /بالقطاع\s*ب/,
        /في\s*القطاع\s*ب/,
        /قطاع\s*ب/,
        /القطاع\s*الثاني/,
        /القطاع\s*2/
    ];
    
    if (sectorBPatterns.some(pattern => pattern.test(q))) {
        console.log("🎯 [Scope Detection] تم كشف: القطاع ب");
        return { scope: 'B', scopeName: 'القطاع ب' };
    }
    
    if (sectorAPatterns.some(pattern => pattern.test(q))) {
        console.log("🎯 [Scope Detection] تم كشف: القطاع أ");
        return { scope: 'A', scopeName: 'القطاع أ' };
    }
    
    console.log("🎯 [Scope Detection] بحث شامل في كلا القطاعين");
    return { scope: 'both', scopeName: 'كلا القطاعين' };
}

window.selectSpecificActivityInDecision104 = function(activityName, sector) {
    console.log(`🚀 [Click Handler] تم اختيار النشاط: "${activityName}" - القطاع: ${sector}`);
    
    let itemData = null;
    let dataSource = (sector === 'A') ? window.sectorAData : window.sectorBData;
    
    if (dataSource) {
        const normalizedTarget = normalizeArabic(activityName);
        
        for (const [mainSector, subSectors] of Object.entries(dataSource)) {
            for (const [subSector, activities] of Object.entries(subSectors)) {
                const found = activities.find(act => {
                    const normAct = normalizeArabic(act);
                    return normAct === normalizedTarget || normAct.includes(normalizedTarget) || normalizedTarget.includes(normAct);
                });
                
                if (found) {
                    itemData = {
                        activity: found,
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
    addMessageToUI('user', activityName);
    AgentMemory.setDecisionActivity(itemData, activityName);
    
    const responseHTML = formatSingleActivityInDecision104WithIncentives(
        itemData.activity,
        itemData,
        sector
    );
    
    const typingId = showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator(typingId);
        typeWriterResponse(responseHTML);
    }, 500);
};

// ==================== استخراج اسم النشاط من السؤال ====================

function extractActivityFromQueryEnhanced(normalizedQuery) {
    const context = AgentMemory.getContext();
    
    const pronounPatterns = [
        /^(هو|هي|ذلك|تلك|هذا|هذه|النشاط|ده|دي)\s/,
        /\s(هو|هي|ذلك|تلك|هذا|هذه)\s/,
        /\s(هو|هي|ذلك|تلك|هذا|هذه)$/
    ];
    
    const hasPronoun = pronounPatterns.some(pattern => pattern.test(normalizedQuery));
    
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
    
    let cleaned = normalizedQuery;
    
    cleaned = cleaned.replace(/^(هل|ما|ماذا|كيف|اين)\s+(هو|هي|عن|بخصوص|نشاط)?\s*/g, '');
    cleaned = cleaned.replace(/^نشاط\s+/g, '');

    const patternsToRemove = [
        /\b(وارد|وارده|واردة|موجود|موجوده|موجودة|مدرج|مدرجه|مدرجة|مذكور|مذكوره|مشمول|مشموله|منصوص|منصوصه)\b/gi,
        /\b(نشاط|النشاط)\b/gi,
        /\s+(بالقرار|في القرار|داخل القرار|ضمن القرار)\s*104?/g,
        /\s+(بالقطاع|في القطاع|داخل القطاع)\s*[أابب]/g,
        /\s+قطاع\s*[أابب]/g,
        /قرار\s*104/g,
        /104/g,
        /\s+(في|عن|على)\s*$/g
    ];
    
    patternsToRemove.forEach(pattern => {
        cleaned = cleaned.replace(pattern, ' ');
    });
    
    cleaned = cleaned.trim().replace(/\s+/g, ' ');

    if (cleaned.startsWith('ال') && cleaned.length > 4) {
        cleaned = cleaned.substring(2);
    }

    cleaned = cleaned.replace(/(وارده|واردة|موجوده|موجودة)$/, '').trim();
    
    console.log(`🧼 تنظيف الاستعلام النهائي: من [${normalizedQuery}] إلى [${cleaned}]`);
    
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

function extractActivityFromQueryFallback(normalizedQuery) {
    let activityName = null;
    
    if (/هل.*نشاط.*104/.test(normalizedQuery)) {
        activityName = normalizedQuery.replace(/هل.*نشاط\s*/g, '')
                                      .replace(/\s*(وارد|موجود|مدرج|مذكور).*/g, '')
                                      .trim();
    }
    else if (/هل.*104/.test(normalizedQuery)) {
        activityName = normalizedQuery.replace(/هل\s*/g, '')
                                     .replace(/\s*104.*/g, '')
                                     .trim();
    }
    else if (/(نشاط|انشطة|انشطه)\s/.test(normalizedQuery)) {
        activityName = normalizedQuery.replace(/.*?(نشاط|انشطة|انشطه)\s*/g, '')
                                     .replace(/\s*(في|ب|بالقرار|104).*/g, '')
                                     .trim();
    }
    else if (/بحث.*عن/.test(normalizedQuery)) {
        activityName = normalizedQuery.replace(/.*بحث.*عن\s*/g, '')
                                     .replace(/\s*(في|ب|بالقرار).*/g, '')
                                     .trim();
    }
    
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

function extractActivityFromQuery(query) {
    let cleaned = query;
    
    cleaned = cleaned
        .replace(/^(هل|ما|ماذا|اين|كيف|متى|هل نشاط|هل\s*)/g, '')
        .replace(/\s*(وارد|موجود|مدرج|مذكور)\s*(ب|في)?\s*(قرار|القرار)?\s*104/g, '')
        .replace(/\s*(يحصل|تحصل|احصل|نحصل)\s*على?\s*(حافز|حوافز)/g, '')
        .replace(/\s*(في|ب|باي|بأي|اي|أي)\s*قطاع/g, '')
        .replace(/\s*يجب\s*ممارسة\s*/g, '')
        .replace(/\s*منطقة\s*محددة/g, '')
        .replace(/\s*104/g, '')
        .trim();
    
    cleaned = cleaned.replace(/^نشاط\s+/, '');
    cleaned = cleaned.replace(/^ال/, '');
    cleaned = normalizeArabic(cleaned);
    
    if (cleaned.length >= 3 && cleaned.length <= 100) {
        return cleaned;
    }
    
    return null;
}

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

function formatActivityFoundResponse(result, responseType) {
    const item = result.item;
    const sectorName = item.sector === 'A' ? 'القطاع أ' : 'القطاع ب';
    const sectorColor = item.sector === 'A' ? '#4caf50' : '#2196f3';
    
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
        
        const isMassTransit = item.activityName && item.activityName.includes("النقل الجماعي");
        
        if (item.mainSector === "النقل" && isMassTransit) {
            html += formatTransportSpecialConditions();
        }
        
        if (shouldShowGeneralConditions(item.mainSector)) {
            html += formatSectorBGeneralConditions();
        }
    }
    
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
}

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
    const data = (sector === 'A') ? window.sectorAData : window.sectorBData;
    
    if (!data) return "⚠️ عذراً، لم يتم العثور على بيانات هذا القطاع.";

    const color = (sector === 'A') ? '#4caf50' : '#2196f3';
    let html = `<div style="border-right: 5px solid ${color}; padding: 15px; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); direction: rtl;">`;
    html += `<h4 style="color: ${color}; margin-top:0;">📋 أنشطة القرار 104 - القطاع ${sector === 'A' ? 'أ' : 'ب'}</h4>`;

    if (sector === 'B' && !isMainOnly) {
        html += `
        <div class="choice-btn" onclick="sendMessage('عرض الشروط العامة والخاصة للقطاع ب')" style="background: #e3f2fd; border: 1px solid #2196f3; color: #1565c0; margin: 10px 0;">
            <span class="choice-icon">⚖️</span> <strong>عرض الشروط العامة والخاصة للقطاع ب</strong>
        </div>`;
    }

    for (const mainSector in data) {
        if (isMainOnly) {
            html += `
            <div class="choice-btn" onclick="sendMessage('عرض انشطة ${mainSector} في القطاع ${sector === 'A' ? 'أ' : 'ب'}')" style="margin: 8px 0; border-right: 4px solid ${color}; text-align: right;">
                <span class="choice-icon">📁</span> <strong>${mainSector}</strong>
            </div>`;
        } else {
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
    }

    html += `</div>`;
    return html;
}

function renderSectorBConditions() {
    const genConditions = window.decision104.sectorBGeneralConditions;
    const transConditions = window.decision104.transportSpecialConditions;

    let html = `<div style="border-right: 5px solid #2196f3; padding: 15px; background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); direction: rtl;">`;
    html += `<h4 style="color: #1565c0; margin-top:0; border-bottom: 2px solid #e3f2fd; padding-bottom: 10px;">⚖️ الشروط العامة والخاصة - للقطاع ب</h4>`;

    html += `<div style="margin-bottom: 20px;">`;
    html += `<strong style="color: #0d47a1; display: block; margin-bottom: 8px;">📌 الشروط العامة للاستحقاق:</strong>`;
    html += `<p style="font-size: 0.9em; color: #444; line-height: 1.6; background: #e3f2fd; padding: 10px; border-radius: 8px;">${genConditions.title}</p>`;
    html += `<ul style="font-size: 0.85em; color: #555; padding-right: 20px;">`;
    genConditions.conditions.forEach(c => {
        html += `<li style="margin-bottom: 5px;">${c.text}</li>`;
    });
    html += `</ul></div>`;

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

// ==================== دوال العرض الجمالي الذكي (UI Presentation Layer) ====================

function formatSingleActivityInDecision104WithIncentives(activityName, itemData, searchScope) {
    const sector = itemData.sector || 'B';
    const isSectorA = (sector === 'A' || sector === 'أ');
    const sectorLabel = isSectorA ? 'القطاع (أ)' : 'القطاع (ب)';
    const sectorColor = isSectorA ? '#4caf50' : '#2196f3';
    
    let mainTitle = itemData.activity;
    let isLegalReference = mainTitle.startsWith('(') || mainTitle.includes('بموجب نص المادة');
    
    if (isLegalReference) {
        mainTitle = activityName;
    }

    let html = `
    <div class="info-card" style="background: linear-gradient(135deg, ${isSectorA ? '#e8f5e9' : '#e3f2fd'}, white); border-left: 6px solid ${sectorColor}; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div class="info-card-header" style="color: ${isSectorA ? '#2e7d32' : '#1565c0'}; border-bottom: 2px solid ${sectorColor}22; padding-bottom: 12px; margin-bottom: 15px; font-weight: bold;">
            <i class="fas fa-file-signature"></i> نتيجة الفحص: النشاط مدرج بالقرار 104 لسنة 2022
        </div>
        
        <div class="info-card-content">
            <div style="margin-bottom: 20px;">
                <div style="color: #666; font-size: 0.85rem; margin-bottom: 6px; letter-spacing: 0.5px;">النشاط المستعلم عنه:</div>
                <div style="font-size: 1.3rem; font-weight: 800; color: #1a1a1a; line-height: 1.4; padding-right: 15px; border-right: 4px solid ${sectorColor}; text-transform: capitalize;">
                    ${mainTitle}
                </div>
                ${isLegalReference ? `
                <div style="background: #f8f9fa; padding: 10px 15px; border-radius: 8px; margin-top: 12px; font-size: 0.9rem; color: #4b6584; border: 1px solid #d1d8e0; line-height: 1.5;">
                    <i class="fas fa-balance-scale-right"></i> <b>النص الرسمي بالقرار:</b> ${itemData.activity}
                </div>` : ''}
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
                <div style="background: white; padding: 12px 15px; border-radius: 12px; border-right: 5px solid ${sectorColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                    <span style="color: #7f8c8d; font-size: 0.85rem;">📊 فئة الاستحقاق الضريبي:</span><br>
                    <strong style="color: ${sectorColor}; font-size: 1.2rem;">${sectorLabel}</strong>
                </div>
                
                <div style="background: white; padding: 12px 15px; border-radius: 12px; border-right: 5px solid #bdc3c7; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                    <span style="color: #7f8c8d; font-size: 0.85rem;">🏢 القطاع الرئيسي:</span><br>
                    <strong style="color: #2d3436;">${itemData.mainSector || 'الصناعة'}</strong>
                </div>

                <div style="background: white; padding: 12px 15px; border-radius: 12px; border-right: 5px solid #bdc3c7; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                    <span style="color: #7f8c8d; font-size: 0.85rem;">📂 التبويب الفرعي بالقرار:</span><br>
                    <strong style="color: #2d3436;">${itemData.subSector}</strong>
                </div>
            </div>
        </div>
    </div>
    `;
    
    html += formatSectorIncentivesEnhanced(sector, itemData);
    
    return html;
}

function formatSectorIncentivesEnhanced(sector, itemData) {
    const isSectorA = (sector === 'A' || sector === 'أ');
    const sectorName = isSectorA ? 'القطاع أ' : 'القطاع ب';
    const sectorColor = isSectorA ? '#4caf50' : '#2196f3';
    
    let incentives = '';
    
    if (isSectorA) {
        incentives = `
            <div style="background: white; padding: 14px; border-radius: 10px; margin: 10px 0; border-right: 4px solid #4caf50; box-shadow: 0 2px 8px rgba(76,175,80,0.15);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span style="font-size: 24px;">💰</span>
                    <strong style="color: #2e7d32;">خصم 50% من صافي الأرباح الخاضعة للضريبة من التكاليف الاستثمارية. يشمل ذلك المناطق الجغرافية الأكثر احتياجًا للتنمية وفقًا للخريطة الاستثمارية وقرارات رئيس مجلس الوزراء.</strong>
                </div>
                <div style="color: #666; font-size: 0.9em; padding-right: 34px;">
                    يجب ألا يتجاوز الحافز الاستثماري نسبة 80% من رأس المال المدفوع حتى تاريخ بدء مزاولة النشاط، وألا تزيد مدة الخصم على 7 سنوات من تاريخ بدء مزاولة النشاط. كما تشمل الحوافز العامة
                </div>
            </div>
            
            <div style="background: white; padding: 14px; border-radius: 10px; margin: 10px 0; border-right: 4px solid #4caf50; box-shadow: 0 2px 8px rgba(76,175,80,0.15);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span style="font-size: 24px;">🏗️</span>
                    <strong style="color: #2e7d32;">الإعفاء من ضريبة الدمغة ورسوم التوثيق والشهر لمدة خمس سنوات.</strong>
                </div>
                <div style="color: #666; font-size: 0.9em; padding-right: 34px;">
                    ستم الإعفاء من ضريبة الدمغة ورسوم التوثيق والشهر لمدة خمس سنوات فقط
                </div>
            </div>
            
            <div style="background: white; padding: 14px; border-radius: 10px; margin: 10px 0; border-right: 4px solid #4caf50; box-shadow: 0 2px 8px rgba(76,175,80,0.15);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span style="font-size: 24px;">📝</span>
                    <strong style="color: #2e7d32;">تطبيق ضريبة جمركية موحدة على المعدات والآلات اللازمة لإنشاء المشروع.</strong>
                </div>
                <div style="color: #666; font-size: 0.9em; padding-right: 34px;">
                    ويشمل المناطق الجغرافية الأكثر احتياجا للتنمية طبقا للخريطة الاستثمارية وبناء على البيانات والإحصاءات الصادرة من الجهاز المركزي للتعبئة العامة والاحصاء، المعتمدة بالخطة العامة للتنمية الاقتصادية
                </div>
            </div>
            
            <div style="background: white; padding: 14px; border-radius: 10px; margin: 10px 0; border-right: 4px solid #4caf50; box-shadow: 0 2px 8px rgba(76,175,80,0.15);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span style="font-size: 24px;">⭐</span>
                    <strong style="color: #2e7d32;"> المشروعات في المناطق الأقل نمواً</strong>
                </div>
                <div style="color: #666; font-size: 0.9em; padding-right: 34px;">
                    ويشمل هذا القطاع المنطقة الاقتصادية لقناة السويس، والمنطقة الاقتصادية للمثلث الذهبي، والمناطق الأخرى الأكثر احتياجا للتنمية التي تتصف بانخفاض مستويات التنمية الاقتصادية، والناتج المحلى، ومستويات التشغيل، وفرص العمل، وجودة التعليم، والخدمات الصحية، وارتفاع معدلات البطالة، والكثافة السكانية، ونسب الأمية،ومعدلات الفقر
                </div>
            </div>
        `;
    } else {
        incentives = `
            <div style="background: white; padding: 14px; border-radius: 10px; margin: 10px 0; border-right: 4px solid #2196f3; box-shadow: 0 2px 8px rgba(33,150,243,0.15);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span style="font-size: 24px;">💰</span>
                    <strong style="color: #1565c0;">خصم 30% من التكاليف الاستثمارية </strong>
                </div>
                <div style="color: #666; font-size: 0.9em; padding-right: 34px;">
                    ويشمل باقي أنحاء الجمهورية وفقا لتوزيع أنشطة الاستثمار، وذلك للمشروعات الاستثمارية الآتية 
                </div>
            </div>
        `;
    }
    
    return `
        <div class="info-card" style="margin-top: 16px; background: linear-gradient(135deg, ${sectorColor}10, white); border-left: 4px solid ${sectorColor};">
            <div class="info-card-header" style="background: ${sectorColor}; color: white;">
                🎁 الحوافز الاستثمارية لـ ${sectorName}
            </div>
            <div class="info-card-content">
                ${incentives}
                
                <div style="background: #fff3e0; padding: 12px; border-radius: 8px; margin-top: 16px; border: 1px solid #ffe0b2;">
                    <div style="color: #e65100; font-weight: 600; margin-bottom: 6px;">
                        ⚠️ شرط أساسي للحصول على الحوافز
                    </div>
                    <div style="color: #bf360c; font-size: 0.9em; line-height: 1.6;">
                        يجب أن تكون الشركة قد تأسست بعد العمل بقانون الاستثمار رقم 72 لسنة 2017
                    </div>
                </div>
                <a href="https://www.investinegypt.gov.eg/PublishingImages/Lists/ContentPageDetails/AllItems/%D8%AD%D9%88%D8%A7%D9%81%D8%B2%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%AB%D9%85%D8%A7%D8%B1.pdf" 
                   target="_blank" 
                   class="choice-btn" 
                   style="margin-top: 15px; text-decoration: none; background: linear-gradient(135deg, #ef5350, #d32f2f); color: white; justify-content: center; font-weight: bold; border: none; box-shadow: 0 4px 15px rgba(211, 47, 47, 0.2);">
                    <i class="fas fa-file-pdf" style="margin-left: 8px;"></i> عرض ملف حوافز الاستثمار (PDF)
                </a>
            </div>
        </div>
    `;
}

function formatActivityNotFoundInDecision104(activityName, sector) {
    const sectorText = sector === 'A' ? 'القطاع أ' : sector === 'B' ? 'القطاع ب' : 'القرار 104';
    
    return `
    <div class="info-card" style="background: linear-gradient(135deg, #fff3e0, #ffe0b2); border-left: 4px solid #ff9800; margin-bottom: 15px;">
        <div class="info-card-header" style="color: #e65100;">
            ⚠️ لم يتم العثور على النشاط في ${sectorText}
        </div>
        <div class="info-card-content" style="color: #bf360c;">
            <p>المسمى "<strong>${activityName}</strong>" غير مدرج بشكل حرفي في قوائم القرار.</p>
            <div style="background: #fff; padding: 10px; border-radius: 8px; margin-top: 8px; font-size: 0.9em; color: #666;">
                💡 يمكنك استكشاف القطاعات يدوياً عبر الخيارات التالية:
            </div>
        </div>
    </div>
    
    <!-- أولاً: أزرار القوائم الكاملة -->
    <div class="choice-btn" onclick="sendMessage('ما هي أنشطة القطاع أ')">
        <span class="choice-icon">📋</span> قائمة كافة أنشطة القطاع أ
    </div>
    
    <div class="choice-btn" onclick="sendMessage('ما هي أنشطة القطاع ب')">
        <span class="choice-icon">📋</span> قائمة كافة أنشطة القطاع ب
    </div>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

    <!-- ثانياً: شبكة الأنشطة الرئيسية (A & B) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
        <div class="choice-btn" onclick="sendMessage('الأنشطة الرئيسية للقطاع أ')" style="margin:0; font-size: 0.85em; background: #f1f8e9; border-color: #c8e6c9;">
            <span class="choice-icon">📁</span> الأنشطة الرئيسية (أ)
        </div>
        <div class="choice-btn" onclick="sendMessage('الأنشطة الرئيسية للقطاع ب')" style="margin:0; font-size: 0.85em; background: #e3f2fd; border-color: #bbdefb;">
            <span class="choice-icon">📁</span> الأنشطة الرئيسية (ب)
        </div>
    </div>

    <!-- ثالثاً: شبكة المعلومات الخاصة (مواقع أ & شروط ب) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div class="choice-btn" onclick="sendMessage('ما هي المناطق الجغرافيه للقطاع أ')" style="margin:0; font-size: 0.85em; background: #fffde7; border: 1px dashed #fbc02d; color: #f57f17;">
            <span class="choice-icon">🗺️</span> مواقع القطاع (أ)
        </div>
        <div class="choice-btn" onclick="sendMessage('عرض الشروط العامة والخاصة للقطاع ب')" style="margin:0; font-size: 0.85em; background: #f0f7ff; border: 1px dashed #2196f3; color: #1565c0;">
            <span class="choice-icon">⚖️</span> شروط القطاع (ب)
        </div>
    </div>
    `;
}

function formatSectorARegionsDetailed() {
    return `
    <div class="info-card" style="background: linear-gradient(135deg, #e8f5e9, #ffffff); border-left: 4px solid #4caf50;">
        <div class="info-card-header" style="color: #2e7d32;">
            🗺️ المناطق الجغرافية للقطاع (أ)
            <span style="font-size: 0.8em; background: #4caf50; color: white; padding: 2px 8px; border-radius: 10px; margin-right: 8px;">الأكثر احتياجاً للتنمية</span>
        </div>
        <div class="info-card-content" style="color: #1b5e20;">
            تتميز هذه المناطق بأعلى نسبة حوافز (خصم 50% من التكاليف الاستثمارية من صافي الأرباح الخاضعة للضريبة).
        </div>
    </div>
    <div class="area-list" style="max-height: 400px; overflow-y: auto;">
        <div class="area-item" style="border-right: 4px solid #4caf50;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #e8f5e9; padding: 8px; border-radius: 50%;">🚢</span>
                <div>
                    <strong>1. المنطقة الاقتصادية لقناة السويس</strong>
                    <br><small style="color: #666;">المنطقة الاقتصادية ذات الطبيعة الخاصة</small>
                </div>
            </div>
        </div>
        
        <div class="area-item" style="border-right: 4px solid #4caf50;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #e8f5e9; padding: 8px; border-radius: 50%;">🔺</span>
                <div>
                    <strong>2. منطقة المثلث الذهبي</strong>
                    <br><small style="color: #666;">(المثلث الذهبي)</small>
                </div>
            </div>
        </div>
        
        <div class="area-item" style="border-right: 4px solid #4caf50;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #e8f5e9; padding: 8px; border-radius: 50%;">🏙️</span>
                <div>
                    <strong>3. العاصمة الإدارية الجديدة</strong>
                    <br><small style="color: #666;">وفقاً للخريطة الاستثمارية</small>
                </div>
            </div>
        </div>

        <div class="area-item" style="border-right: 4px solid #4caf50;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #e8f5e9; padding: 8px; border-radius: 50%;">🏙️</span>
                <div>
                    <strong>4.   منطقة رأس الحكمة</strong>
                    <br><small style="color: #666;">وفقاً للخريطة الاستثمارية</small>
                </div>
            </div>
        </div>

        
        <div class="area-item" style="border-right: 4px solid #4caf50;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #e8f5e9; padding: 8px; border-radius: 50%;">🏭</span>
                <div>
                    <strong>5. جنوب محافظة الجيزة</strong>
                    <br><small style="color: #666;">الواحات البحرية – الصف - العياط</small>
                </div>
            </div>
        </div>
        
        <div class="area-item" style="border-right: 4px solid #4caf50;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #e8f5e9; padding: 8px; border-radius: 50%;">🏜️</span>
                <div>
                    <strong>6. محافظات الصعيد</strong>
                    <br><small style="color: #666;">الفيوم – بني سويف - المنيا – أسيوط – سوهاج – قنا – الأقصر - أسوان</small>
                </div>
            </div>
        </div>

        
        <div class="area-item" style="border-right: 4px solid #4caf50;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #e8f5e9; padding: 8px; border-radius: 50%;">🏜️</span>
                <div>
                    <strong>7. محافظة القاهرة الكبري لنشاط السياحة فقط</strong>
                    <br><small style="color: #666;">القاهرة –  الجيزة القليوبية</small>
                </div>
            </div>
        </div>
              
        
        <div class="area-item" style="border-right: 4px solid #4caf50;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #e8f5e9; padding: 8px; border-radius: 50%;">🛂</span>
                <div>
                    <strong>8. محافظات الحدود</strong>
                    <br><small style="color: #666;">أسوان – مرسي مطروح – جنوب سيناء - شمال سيناء - الوادي الجديد – محافظة البحر الأحمر من جنوب سفاجا</small>
                </div>
            </div>
        </div>
    </div>
    
    <div style="margin-top: 15px; padding: 12px; background: #f1f8e9; border-radius: 8px; border: 1px solid #c8e6c9;">
        <strong style="color: #2e7d32;">💡 قاعدة عامة:</strong>
        <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #33691e;">
            أي نشاط يقع خارج هذه المناطق المحددة يعتبر تلقائياً ضمن <strong>القطاع (ب)</strong> ويتمتع بحوافز 30%، بشرط أن يكون النشاط مدرجاً في قوائم القرار.
        </p>
    </div>
    `;
}

function formatSectorBRegions() {
    return `
    <div class="info-card" style="background: linear-gradient(135deg, #e3f2fd, #ffffff); border-left: 4px solid #2196f3;">
        <div class="info-card-header" style="color: #1565c0;">
            🌍 المناطق الجغرافية للقطاع (ب)
            <span style="font-size: 0.8em; background: #2196f3; color: white; padding: 2px 8px; border-radius: 10px; margin-right: 8px;">باقي أنحاء الجمهورية</span>
        </div>
        <div class="info-card-content" style="color: #0d47a1; font-size: 1.05rem; line-height: 1.7;">
            يغطي هذا القطاع <strong>جميع أنحاء الجمهورية</strong> (بخلاف المناطق المحددة للقطاع أ).
            <br>
            بمعنى أنه لا يوجد تقيد بمنطقة جغرافية معينة لممارسة النشاط.
        </div>
    </div>

    <div style="background: #fff3e0; padding: 14px; border-radius: 10px; border: 1px solid #ffe0b2; margin-top: 15px;">
        <div style="color: #e65100; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-exclamation-triangle"></i> الشرط الجوهري للاستحقاق
        </div>
        <div style="color: #bf360c; font-size: 0.95em; line-height: 1.6;">
            رغم أن المنطقة مفتوحة، <strong>يجب</strong> أن يكون النشاط مدرجاً نصاً ضمن <strong>قوائم أنشطة القطاع (ب)</strong> الواردة بالقرار 104 للحصول على الحوافز.
        </div>
    </div>

    <div style="margin-top: 15px;">
        <div class="choice-btn" onclick="sendMessage('ما هي أنشطة القطاع ب')">
            <span class="choice-icon">📋</span> التأكد من أنشطة القطاع ب
        </div>
    </div>
    `;
}

function formatSectorIncentives(sector) {
    return formatSectorIncentivesEnhanced(sector, { activity: 'عرض عام' });
}

function formatSectorActivities(sector) {
    const sectorName = sector === 'A' ? 'القطاع أ' : 'القطاع ب';
    const sectorColor = sector === 'A' ? '#4caf50' : '#2196f3';
    
    let activitiesCount = 0;
    let dataSource = (sector === 'A') ? window.sectorAData : window.sectorBData;
    
    if (dataSource) {
        for (const main in dataSource) {
            for (const sub in dataSource[main]) {
                activitiesCount += dataSource[main][sub].length;
            }
        }
    }
    
    return `
    <div class="info-card" style="border-left: 4px solid ${sectorColor};">
        <div class="info-card-header" style="color: ${sectorColor};">
            📋 أنشطة ${sectorName}
        </div>
        <div class="info-card-content">
            يحتوي هذا القطاع على حوالي <strong>${activitiesCount}</strong> نشاط استثماري متنوع.
            <br><br>
            نظراً لكثرة الأنشطة، يفضل البحث عن نشاط محدد.
        </div>
    </div>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border: 1px solid #e0e0e0;">
        <strong>🔍 كيف تبحث؟</strong>
        <p>اكتب اسم النشاط مباشرة، مثال:</p>
        <div class="choice-btn" onclick="sendMessage('هل نشاط الغزل والنسيج وارد بالقطاع ${sector}')">
            هل نشاط الغزل والنسيج وارد بالقطاع ${sector}؟
        </div>
        <div class="choice-btn" onclick="sendMessage('هل نشاط البرمجيات وارد بالقطاع ${sector}')">
            هل نشاط البرمجيات وارد بالقطاع ${sector}؟
        </div>
    </div>
    `;
}

function formatTransportSpecialConditions() {
    const conditions = window.decision104?.transportSpecialConditions;
    
    if (!conditions) {
        return '';
    }
    
    let html = `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <div style="background: #e67e22; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-bus" style="color: white; font-size: 11px;"></i>
                </div>
                <div style="color: #d35400; font-size: 1.1rem; font-weight: 700;">
                    🚌 ضوابط خاصة: النقل الجماعي (المدن الجديدة)
                </div>
            </div>
            
            <div style="background: #fff5eb; padding: 16px; border-radius: 12px; border-right: 4px solid #e67e22; color: #a04000; line-height: 1.7; margin-bottom: 12px;">
                <div style="font-weight: 600; margin-bottom: 10px;">
                    ${conditions.title}
                </div>
                <ul style="margin: 10px 0; padding-right: 20px; list-style-type: none;">
    `;
    
    conditions.conditions.forEach((condition, index) => {
        html += `
                    <li style="margin-bottom: 8px; position: relative; padding-right: 25px;">
                        <span style="position: absolute; right: 0; color: #e67e22; font-weight: bold;">${index + 1}.</span>
                        ${condition.text}
                    </li>
        `;
    });
    
    html += `
                </ul>
            </div>
        </div>
    `;
    
    return html;
}

function shouldShowGeneralConditions(mainSector) {
    const applicableSectors = [
        "السياحة",
        "الاتصالات وتكنولوجيا المعلومات",
        "البترول والثروات الطبيعية",
        "الزراعة والإنتاج الحيواني الداجني والسمكي",
        "النقل"
    ];
    
    return applicableSectors.includes(mainSector);
}

function formatSectorBGeneralConditions() {
    // هذه دالة افتراضية، يمكن تخصيصها حسب الحاجة
    return `
    <div style="background: #e3f2fd; padding: 16px; border-radius: 12px; border-right: 4px solid #2196f3; color: #1565c0; margin-bottom: 20px; line-height: 1.6;">
        <strong>📌 الشروط العامة للقطاع ب:</strong>
        <ul style="margin-top: 8px; padding-right: 20px;">
            <li>يجب أن يكون النشاط مدرجاً في قوائم القرار 104.</li>
            <li>تأسيس الشركة بعد قانون الاستثمار 72 لسنة 2017.</li>
            <li>الالتزام بالاشتراطات البيئية والتراخيص اللازمة.</li>
        </ul>
    </div>
    `;
}

window.toggleExpandChat = function() {
    const container = document.getElementById('gptChatContainer');
    const expandBtn = document.getElementById('gptExpandBtn');
    const icon = expandBtn.querySelector('i');
    
    container.classList.toggle('expanded');
    
    if (container.classList.contains('expanded')) {
        icon.classList.replace('fa-expand-alt', 'fa-compress-alt');
        expandBtn.title = "تصغير النافذة";
    } else {
        icon.classList.replace('fa-compress-alt', 'fa-expand-alt');
        expandBtn.title = "توسيع النافذة";
    }
    
    setTimeout(() => {
        document.getElementById('gptInput').focus();
    }, 400);
};

// ==================== 🆕 دوال الأزرار الذكية للبحث - النسخة المُصلحة ====================

/**
 * عرض الأزرار الذكية للبحث عن النشاط في القرار 104
 * النسخة المُصلحة - تحل مشكلة ظهور النص خارج الأزرار
 * @param {string} activityName - اسم النشاط المحدد
 * @returns {string} HTML الأزرار
 */
function showSmartSearchButtons(activityName) {
    const escapedActivity = escapeForJS(activityName);
    
    return '<div class="smart-search-container">' +
        '<div class="smart-search-header">' +
            '<i class="fas fa-search"></i>' +
            '<span>للبحث فى قرار مجلس الوزراء رقم 104</span>' +
        '</div>' +
        '<div class="smart-search-text">يمكنك البحث عن هذا النشاط بسرعة باستخدام الأزرار التالية:</div>' +
        '<div class="smart-search-buttons">' +
            '<div class="smart-btn smart-btn-comprehensive" onclick="window.gptAgent.smartSearch(\'' + escapedActivity + '\', \'comprehensive\')">' +
                '<div class="smart-btn-left">' +
                    '<div class="smart-btn-icon"><i class="fas fa-globe"></i></div>' +
                    '<div class="smart-btn-text">هل نشاط ' + activityName + ' وارد بالقرار 104</div>' +
                '</div>' +
                '<i class="fas fa-arrow-left smart-btn-arrow"></i>' +
            '</div>' +
            '<div class="smart-btn smart-btn-sector-a" onclick="window.gptAgent.smartSearch(\'' + escapedActivity + '\', \'sectorA\')">' +
                '<div class="smart-btn-left">' +
                    '<div class="smart-btn-icon"><i class="fas fa-industry"></i></div>' +
                    '<div class="smart-btn-text">هل نشاط ' + activityName + ' وارد بالقطاع أ</div>' +
                '</div>' +
                '<i class="fas fa-arrow-left smart-btn-arrow"></i>' +
            '</div>' +
            '<div class="smart-btn smart-btn-sector-b" onclick="window.gptAgent.smartSearch(\'' + escapedActivity + '\', \'sectorB\')">' +
                '<div class="smart-btn-left">' +
                    '<div class="smart-btn-icon"><i class="fas fa-building"></i></div>' +
                    '<div class="smart-btn-text">هل نشاط ' + activityName + ' وارد بالقطاع ب</div>' +
                '</div>' +
                '<i class="fas fa-arrow-left smart-btn-arrow"></i>' +
            '</div>' +
        '</div>' +
    '</div>';
}

/**
 * عرض الحوافز مباشرة - النسخة النهائية المصححة (Fix 'bot' to 'ai')
 */
function smartSearchFixed(activityName, searchType) {
    console.log(`🎯 [Smart Search] النشاط: "${activityName}" - النوع: ${searchType}`);
    
    const context = AgentMemory.getContext();
    let currentActivity = activityName;
    
    if (context && (context.type === 'activity' || context.type === 'decision_activity')) {
        currentActivity = context.data.text || context.data.name || activityName;
    }
    
    let results = [];
    let sector = null;
    
    switch(searchType) {
        case 'comprehensive':
            results = enhancedSearchInDecision104(currentActivity, null);
            break;
        case 'sectorA':
            results = enhancedSearchInDecision104(currentActivity, 'A');
            sector = 'A';
            break;
        case 'sectorB':
            results = enhancedSearchInDecision104(currentActivity, 'B');
            sector = 'B';
            break;
    }
    
    if (sector) {
        results = results.filter(r => r.sector === sector || r.item.sector === sector);
    }
    
    results = deduplicateResults(results);
    
    console.log(`📊 [Smart Search] عدد النتائج: ${results.length}`);
    
    let responseHTML = '';
    
    if (!results || results.length === 0) {
        responseHTML = formatActivityNotFoundInDecision104(currentActivity, sector);
    } else if (results.length === 1) {
        const result = results[0];
        const itemData = result.item || result;
        
        responseHTML = formatSingleActivityInDecision104WithIncentives(
            currentActivity,
            itemData,
            sector || 'both'
        );
        
        AgentMemory.setDecisionActivity(itemData, currentActivity);
    } else {
        responseHTML = formatEnhancedMultipleResults(currentActivity, results, sector || 'both');
    }
    
    addMessageToUI('ai', responseHTML);
}

/**
 * دالة مساعدة لتنسيق النتائج المتعددة (إذا لم تكن موجودة)
 */
function formatEnhancedMultipleResults(activityName, results, scope) {
    return formatMultipleActivitiesInDecision104WithBothSectorsFixed(activityName, results, scope);
}

// ==================== دالة checkDecision104Full المطلوبة ====================

window.checkDecision104Full = function(activityName) {
    if (typeof window.decision104 === 'undefined' || !window.decision104.unifiedSearchDB) {
        return null;
    }
    
    const found = window.decision104.unifiedSearchDB.find(item => 
        activityName.includes(item.activity) || item.activity.includes(activityName)
    );
    
    if (found) {
        return `<div class="decision-badge">
                ⭐ هذا النشاط مدرج في القرار 104 لسنة 2022            </div>
            <div class="info-card" style="background: linear-gradient(135deg, #fff9c4, #fffde7); border-left-color: #f57f17;">
                <div class="info-card-header" style="color: #f57f17;">
                    🎯 تفاصيل القرار 104
                </div>
                <div class="info-card-content" style="color: #e65100;">
                    <div class="info-row">
                        <div class="info-label">📊 القطاع:</div>
                        <div class="info-value"><strong>القطاع ${found.sector}</strong></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">🏢 القطاع الرئيسي:</div>
                        <div class="info-value">${found.mainSector}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">📂 القطاع الفرعي:</div>
                        <div class="info-value">${found.subSector}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">💰 الحوافز:</div>
                        <div class="info-value">يتمتع بالحوافز والإعفاءات المقررة</div>
                    </div>
                </div>
            </div>`;
    }
    
    const smartButtons = showSmartSearchButtons(activityName);
    
    return `${smartButtons}
<div style="background: #fdf6f0; border-right: 4px solid #d97706; padding: 16px; border-radius: 12px; margin: 15px 0; font-family: sans-serif; direction: rtl;">
    <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 20px; margin-left: 10px;">🔍</span>
        <strong style="color: #92400e; font-size: 15px;">كما يمكنك استخدام المايك لمعرفة هل النشاط وارد بالقرار 104:</strong>
    </div>
    
    <ul style="margin: 0; padding-right: 20px; color: #4b5563; font-size: 13px; line-height: 1.6;">
        <li style="margin-bottom: 8px;">
            <strong>للبحث الشامل:</strong> 
            <code style="background: #fef3c7; padding: 2px 6px; border-radius: 4px; color: #b45309;">هل نشاط (اسم النشاط) وارد بالقرار 104</code>
        </li>
        <li>
            <strong>للبحث في قطاع محدد:</strong> 
            <span style="display: block; margin-top: 4px; color: #6b7280;">
                • هل نشاط (اسم النشاط) وارد بـ <span style="color: #d97706; font-weight: bold;">القطاع أ</span><br>
                • هل نشاط (اسم النشاط) وارد بـ <span style="color: #d97706; font-weight: bold;">القطاع ب</span>
            </span>
        </li>
    </ul>
</div>`;
};

// ==================== التصدير للنطاق العالمي ====================

window.formatSingleActivityInDecision104WithIncentives = formatSingleActivityInDecision104WithIncentives;
window.formatSectorIncentivesEnhanced = formatSectorIncentivesEnhanced;
window.formatActivityNotFoundInDecision104 = formatActivityNotFoundInDecision104;
window.formatSectorARegionsDetailed = formatSectorARegionsDetailed;
window.formatSectorBRegions = formatSectorBRegions;
window.formatSectorIncentives = formatSectorIncentives;
window.formatSectorActivities = formatSectorActivities;
window.gptAgent = window.gptAgent || {};
window.gptAgent.smartSearch = smartSearchFixed;
window.gptAgent.showSmartSearchButtons = showSmartSearchButtons;
window.showSmartSearchButtons = showSmartSearchButtons; // للاستخدام المباشر
window.smartSearchFixed = smartSearchFixed;
