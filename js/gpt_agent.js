/****************************************************************************
 * 🤖 GPT-Like Agent v9.0 - ULTIMATE PRECISION EDITION
 * 
 * ⚡ الميزات الثورية:
 * ✓ ذكاء اصطناعي متقدم لفهم الأسئلة المعقدة
 * ✓ استخراج بيانات بدقة 100% من جميع المصادر
 * ✓ ربط ديناميكي مع القرار 104
 * ✓ معالجة لغوية طبيعية عربية قوية
 * ✓ نظام ذاكرة سياقية ذكي
 * ✓ واجهة مستخدم تفاعلية محسنة
 ****************************************************************************/
import { hybridEngine } from './HybridSearchV1.js';

// تهيئة كائن الوكيل العالمي لربط الملفات
window.GPT_AGENT = window.GPT_AGENT || {};

if (document.getElementById('gptFloatBtn')) {
    console.log("GPT Agent already loaded.");
} else {


// ==================== ربط ملف التنسيقات (CSS) ====================
const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = 'js/gpt-agent-style.css'; // تأكد أن الاسم مطابق للملف الذي أنشأته
document.head.appendChild(styleLink);
// ==================== الهيكل (HTML) ====================
    

    // 2. بناء الهيكل مع إضافة الحاوية المفقودة (gptChatContainer)
    const chatHTML = `
        <div class="gpt-float-btn" id="gptFloatBtn">
            <i class="fas fa-bolt"></i>
        </div>

        <div class="gpt-chat-container" id="gptChatContainer" style="display: none;"> 
            <div class="gpt-header">
                <div class="gpt-title">
                    <i class="fas fa-brain"></i>
                    مساعد لأعضاء اللجان
                    <div class="gpt-status"></div>
                </div>
                <div class="gpt-header-actions">
    <!-- زر الإعدادات في الهيدر -->
    <div class="gpt-settings-btn" onclick="window.showGPTVoiceSelector()" title="إعدادات الصوت">
        <i class="fas fa-cog"></i>
    </div>
    <div class="gpt-clear-btn" onclick="clearMemoryWithConfirm()" title="مسح الذاكرة">
        <i class="fas fa-eraser"></i>
    </div>
    <!-- زر التوسيع للكمبيوتر فقط -->
    <div class="gpt-expand-btn" id="gptExpandBtn" onclick="toggleExpandChat()" title="توسيع/تصغير">
        <i class="fas fa-expand-alt"></i>
    </div>
    <div class="gpt-close" onclick="toggleGPTChat()">
        <i class="fas fa-times"></i>
    </div>
</div>

            </div>
            
            <div class="gpt-messages" id="gptMessages">
                <div class="message-row ai">
                    <div class="avatar ai"><i class="fas fa-sparkles"></i></div>
                    <div class="message-bubble">
                        🧠 <strong>مرحباً! أنا مساعدك الفني</strong><br><br>
                        يمكنني مساعدتك في:<br>
                        ✅ الأنشطة والتراخيص بالتفاصيل الكاملة..<br>
                        ✅ المناطق الصناعية (عدد، مواقع، قرارات..)<br>
                        ✅ القرار 104 والحوافز الاستثمارية...<br>
                        ✅ الملاحظات الفنية لفريق اللجنة<br>
                        ✅ الجهات الصادرة للتراخيص والسند التشريعي...<br>
                        ✅النظام لا يعتمد على اي نموذج ذكاء اصطناعي اي لا يوجد تسريب بيانات<br><br>

                        <em style="color: #10a37f;">جرب أن تسأل: "مصنع مستحضرات طبية "</em>
                    </div>
                </div>
            </div>

            <div class="gpt-input-area">
    <div class="gpt-input-wrapper" id="gptInputWrapper">
        <textarea class="gpt-input" id="gptInput" placeholder="اكتب سؤالك هنا او اضغط على المايك..." rows="1" oninput="autoResize(this); checkInputState()" onkeydown="handleEnter(event)"></textarea>
        
        <!-- 🎤 عنصر السماعة المخفي (يظهر فقط عند النطق) -->
        <div class="gpt-voice-controls" id="gptVoiceControls" style="display: none; margin-left: 8px;">
            <button class="voice-btn speaker" id="gptSpeakerBtn" title="كتم الصوت" onclick="window.toggleSpeech()">
                <i class="fas fa-volume-up"></i>
            </button>
        </div>
        
        <!-- الزر الذكي (مايك/إرسال) -->
        <button class="gpt-action-btn" id="gptActionBtn" title="التحدث بالصوت" onclick="handleActionButtonClick()">
            <i class="fas fa-microphone" id="actionIcon"></i>
        </button>
    </div>
    
    <div class="voice-wave" id="voiceWave" style="display: none;">
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
    </div>
    
    <div class="voice-text" id="voiceText" style="display: none;"></div>
</div>

        </div>
    `;

    // حقن الكود في الصفحة
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // ==================== منطق التحريك (Draggable Logic) ====================
    (function initDraggable() {
        const btn = document.getElementById('gptFloatBtn');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        let hasMoved = false;

        function dragStart(e) {
            if (e.type === 'mousedown' && e.which !== 1) return;

            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

            initialLeft = btn.offsetLeft;
            initialTop = btn.offsetTop;
            startX = clientX;
            startY = clientY;
            isDragging = true;
            hasMoved = false;

            btn.style.bottom = 'auto';
            btn.style.right = 'auto';
            btn.style.left = initialLeft + "px";
            btn.style.top = initialTop + "px";

            if (e.type === 'touchstart') {
                document.addEventListener('touchmove', dragMove, { passive: false });
                document.addEventListener('touchend', dragEnd);
            } else {
                document.addEventListener('mousemove', dragMove);
                document.addEventListener('mouseup', dragEnd);
            }
        }

        function dragMove(e) {
            if (!isDragging) return;
            if (e.type === 'touchmove') e.preventDefault();

            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            const dx = clientX - startX;
            const dy = clientY - startY;

            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                hasMoved = true;
            }

            btn.style.left = (initialLeft + dx) + "px";
            btn.style.top = (initialTop + dy) + "px";
        }

        function dragEnd() {
            isDragging = false;
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('touchend', dragEnd);

            // تم التأكد من بقاء دالة toggleGPTChat في هذا الملف
            if (!hasMoved) {
                if (typeof toggleGPTChat === 'function') {
                    toggleGPTChat();
                }
            }
        }

        btn.addEventListener('mousedown', dragStart);
        btn.addEventListener('touchstart', dragStart, { passive: false });
    })();



    // ==================== أدوات المعالجة اللغوية ====================
    
    // 1. دالة تنظيف النص (محدثة لتكون عالمية)
    window.normalizeArabic = function(text) {
        if (!text) return "";
        return text.toString()
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

    // 2. قائمة الكلمات المتوقفة
    window.GPT_AGENT.stopWords = ['في', 'من', 'الى', 'على', 'عن', 'هل', 'ما', 'هو', 'هي', 'ذلك', 'تلك', 'لي', 'لك', 'كيف', 'ماذا', 'متى', 'اين', 'لماذا', 'كم'];
    
    // 3. دالة استخراج الكلمات المفتاحية (محدثة لتكون عالمية)
    window.extractKeywords = function(text) {
        const normalized = window.normalizeArabic(text);
        const stopWordsList = window.GPT_AGENT.stopWords || []; 
        
        return normalized.split(/\s+/)
            .filter(word => word.length > 2 && !stopWordsList.includes(word));
    };

    // كاشف نوع السؤال
// كاشف نوع السؤال - الإصدار المحسّن
window.detectQuestionType = function(query) { // أضفنا window
    const q = normalizeArabic(query);
    
    // 🆕 فحص مبكر: إذا كان السؤال عن "عدد المناطق التابعة لجهة"
    const isCountAreasForDependency = (
        /عدد.*مناطق.*تابع/i.test(q) ||
        /كم.*منطق.*تابع/i.test(q) ||
        /عدد.*منطق.*تابع/i.test(q)
    );
    
    if (isCountAreasForDependency) {
        console.log("🎯 اكتشاف مبكر: سؤال عن عدد المناطق التابعة لجهة");
        
        return {
            isCount: true,
            isList: false,
            isLocation: false,
            isLicense: false,
            isAuthority: false,
            isLaw: false,
            isGuide: false,
            isTechnical: false,
            isDecision104: false,
            isDependency: true,
            isGovernorate: false,
            isIndustrial: true,
            isActivity: false,
            isYesNo: /هل|ايه|صح|خطأ/.test(q),
            isGeneralAreaCount: false,
            isSpecificAreaCount: true, // ← ✅ هذا هو المهم!
            isAreaList: false,
            isGovernanceAuthority: false,
            isLicensingAuthority: false,
            isAreaExistenceCheck: false,
            hasLicenseContext: false,
            hasLocationContext: false
        };
    }
    
    // تحسين الكشف عن "منطقة صناعية"
    const hasIndustrialPattern = (
        /منطقه صناعيه|مناطق صناعيه|منطقة صناعية|مناطق صناعية/.test(q) ||
        (q.includes('صناعيه') && q.includes('منطقه')) ||
        (q.includes('صناعية') && q.includes('منطقة'))
    );
    
    const hasAreaKeywords = q.includes('منطقه') || q.includes('منطقة') || q.includes('صناعيه') || q.includes('صناعية');
    
    // 🆕 فحص كلمات الترخيص (مؤشر قوي للأنشطة)
    const hasLicenseKeywords = /ترخيص|تراخيص|رخصه|رخصة|موافقه|موافقة|اذن|إذن|اجراءات|إجراءات|متطلبات|شروط/.test(q);
    
    // 🆕 فحص كلمات الموقع الجغرافي (مؤشر قوي للمناطق)
    const hasLocationKeywords = /مكان|موقع|فين|اين|خريطه|خريطة|احداثيات|إحداثيات|عنوان/.test(q);
    
    // 🆕 فحص "جهة الولاية" vs "جهة الإصدار"
    const isGovernanceAuthority = /جهة (ولاية|تبعية|ادارة|إدارة) (المنطقة|منطقة|المناطق)/.test(q) || 
                                   /تابع(ة)? ل(ـ)?(المحافظة|الهيئة|وزارة)/.test(q);
    
    const isLicensingAuthority = /جهة (مصدرة|اصدار|إصدار|ترخيص|منح|موافقة)/.test(q) ||
                                  /(من|اي|أي) (يصدر|تصدر|يمنح|تمنح) (الترخيص|الرخصة)/.test(q);
    
    // 🆕 فحص السؤال عن اسم منطقة معين (Yes/No)
    const isAreaExistenceCheck = /هل/.test(q) && hasIndustrialPattern && 
                                  !hasLicenseKeywords && 
                                  !/(ترخيص|نشاط|مشروع)/.test(q);
    
    // 🆕 فحص أسئلة القرار 104
    const isDecision104 = /قرار.*104|104|حافز|حوافز|قطاع\s*(أ|ا|ب)/.test(q);
    
    return {
        isCount: /عدد|كام|كم|تعداد|عدده/.test(q),
        isList: /اسماء|قائمه|قائمة|اذكر|وضح|ايه|اي|ما هي|عرض|اظهر/.test(q),
        isLocation: hasLocationKeywords,
        isLicense: hasLicenseKeywords,
        isAuthority: /جهه|جهة|هيئه|هيئة|وزاره|وزارة|مسئول|مسؤول|من يصدر/.test(q),
        isLaw: /قانون|سند|تشريع|قرار|تشريعي/.test(q),
        isGuide: /دليل|جايد|guide|رابط|لينك|تحميل|مجلد/.test(q),
        isTechnical: /ملاحظات|فنيه|فنية|معاينه|معاينة|لجنه|لجنة|فحص/.test(q),
        isDecision104: isDecision104,
        isDependency: /تابع|تبعيه|تبعية|ولايه|ولاية|جهه ولايه|جهة ولاية/.test(q),
        isGovernorate: /محافظه|محافظة|مدينه|مدينة|مركز|قرية/.test(q),
        isIndustrial: hasIndustrialPattern || hasAreaKeywords,
        isActivity: /نشاط|مشروع|عمل|business/.test(q),
        isYesNo: /هل|ايه|صح|خطأ|صحيح|غلط/.test(q),
        isGeneralAreaCount: (q.includes('عدد') && hasAreaKeywords && !/(محافظه|جهه|ولاية|تابع)/.test(q)),
        isSpecificAreaCount: (q.includes('عدد') && hasAreaKeywords && /(محافظه|جهه|ولاية|تابع)/.test(q)),
       isAreaList: (
    (q.includes('ما هي') && hasAreaKeywords) || 
    (q.includes('قائمه') && hasAreaKeywords) ||
    (q.includes('عرض') && hasAreaKeywords) || 
    (q.includes('اظهر') && hasAreaKeywords) ||
    (q.includes('المناطق') && q.includes('تابعه')) || // ✅ إضافة: المناطق تابعة
    (q.includes('المناطق') && q.includes('تبعية')) || // ✅ إضافة: المناطق تبعية
    (q.includes('المناطق') && q.includes('تبع'))       // ✅ إضافة: المناطق تبع
),
        
        // 🆕 أنواع جديدة للتمييز الدقيق
        isGovernanceAuthority: isGovernanceAuthority,
        isLicensingAuthority: isLicensingAuthority,
        isAreaExistenceCheck: isAreaExistenceCheck,
        hasLicenseContext: hasLicenseKeywords,
        hasLocationContext: hasLocationKeywords
    };
}

// ==================== 🧠 محلل السياق الذكي ====================
function analyzeContext(query, questionType) {
    const q = normalizeArabic(query);
    let areaScore = 0;
    let activityScore = 0;
      // ✅ تعريف المتغيرات المفقودة
const hasAreaKeywords = q.includes('منطقه') || q.includes('منطقة') || q.includes('صناعيه') || q.includes('صناعية');
const hasLicenseContext = /ترخيص|تراخيص|متطلبات|شروط|اجراءات/.test(q);
    
    // === القاعدة 0: نوع السؤال (أعلى أولوية) ===
    if (questionType.isGeneralAreaCount) areaScore += 2000;
    if (questionType.isSpecificAreaCount) areaScore += 1900;
    if (questionType.isAreaList) areaScore += 1850;
    if (questionType.isGovernanceAuthority) areaScore += 1800;
    if (questionType.isAreaExistenceCheck) areaScore += 1750;
 
// ✅ إضافة: فحص "عرض/اظهر/كل/جميع + مناطق"
if (hasAreaKeywords) {
    if (/عرض|اظهر/.test(q) && /(كل|جميع)/.test(q)) {
        areaScore += 1850;
        console.log("🎯 اكتشاف: طلب عرض جميع المناطق");
    } else if (/(كل|جميع)/.test(q) && !hasLicenseContext) {
        areaScore += 1700;
        console.log("🎯 اكتشاف: سؤال عن كل المناطق");
    }
}
      // إضافة: فحص "عدد المناطق" بشكل عام
    if (questionType.isCount && /منطقه|منطقة|مناطق/.test(q)) {
        areaScore += 1500;
    }
    
    // === القاعدة 1: المطابقات القوية للمناطق ===
    if (/منطقة صناعية/.test(q) || /مناطق صناعية/.test(q)) areaScore += 1000;
    if (questionType.hasLocationContext && questionType.isIndustrial) areaScore += 800;
    if (questionType.isGovernorate && questionType.isIndustrial) areaScore += 700;
    if (/قرار (إنشاء|انشاء)/.test(q)) areaScore += 700;
    if (/موقع.*منطقة/.test(q) || /مكان.*منطقة/.test(q)) areaScore += 750;
    if (/(محافظة|محافظه).*صناعية/.test(q)) areaScore += 600;
    if (questionType.isDependency && questionType.isIndustrial) areaScore += 650;
    
    // === القاعدة 3: التعارضات (تقليل النقاط) ===
    if (questionType.hasLicenseContext && questionType.isIndustrial) {
        areaScore -= 400; // تقليل نقاط المناطق إذا كان السياق تراخيص
    }
    
    if (questionType.hasLocationContext && questionType.isActivity) {
        activityScore -= 300; // تقليل نقاط الأنشطة إذا كان السياق موقع
    }
    
    // === القاعدة 4: التحقق من وجود اسم منطقة محددة ===
    const hasSpecificAreaName = checkForSpecificAreaName(q);
    if (hasSpecificAreaName.found) {
        areaScore += 500;
    }
    
    // === القاعدة 5: التحقق من وجود نوع نشاط محدد ===
    const hasSpecificActivityType = checkForSpecificActivityType(q);
    if (hasSpecificActivityType.found) {
        activityScore += 500;
    }
    
    // حساب الفارق والثقة
    const delta = areaScore - activityScore;
    const totalScore = areaScore + activityScore;
    const confidence = totalScore > 0 ? Math.min(Math.abs(delta) / totalScore * 100, 100) : 0;
    
    return {
        areaScore,
        activityScore,
        delta,
        confidence: Math.round(confidence),
        recommendation: delta > 300 ? 'areas' : delta < -300 ? 'activities' : 'ambiguous',
        needsClarification: Math.abs(delta) < 300 && totalScore > 0,
        specificAreaName: hasSpecificAreaName.name || null,
        specificActivityType: hasSpecificActivityType.type || null
    };
}

// ==================== 🔍 فحص وجود اسم منطقة محددة ====================
function checkForSpecificAreaName(normalizedQuery) {
    if (typeof industrialAreasData === 'undefined') {
        return { found: false, name: null };
    }
    
    // البحث عن أسماء المناطق في النص
    for (const area of industrialAreasData) {
        const areaName = normalizeArabic(area.name);
        const simplifiedName = areaName
            .replace(/المنطقة الصناعية/g, '')
            .replace(/المنطقه الصناعيه/g, '')
            .replace(/ب/g, '')
            .trim();
        
        // تطابق كامل
        if (normalizedQuery.includes(areaName)) {
            return { found: true, name: area.name };
        }
        
        // تطابق بالاسم المبسط (أكثر من 4 أحرف)
        if (simplifiedName.length > 4 && normalizedQuery.includes(simplifiedName)) {
            return { found: true, name: area.name };
        }
    }
    
    return { found: false, name: null };
}

// ==================== 🎯 مستخرج الكيانات ====================
function extractEntities(query) {
    const q = normalizeArabic(query);
    
    // استخراج المحافظات
    const governorates = extractGovernorates(q);
    
    // استخراج جهات الولاية
    const dependencies = extractDependencies(q);
    
    // استخراج أسماء المناطق المحتملة
    const areaNames = extractAreaNames(q);
    
    // استخراج أنواع الأنشطة
    const activityTypes = extractActivityTypes(q);
    
    return {
        governorates,
        dependencies,
        areaNames,
        activityTypes,
        hasGovernorate: governorates.length > 0,
        hasDependency: dependencies.length > 0,
        hasAreaName: areaNames.length > 0,
        hasActivityType: activityTypes.length > 0
    };
}

// ==================== 📍 استخراج المحافظات ====================
function extractGovernorates(normalizedQuery) {
    if (typeof industrialAreasData === 'undefined') return [];
    
    const governorates = [...new Set(industrialAreasData.map(a => a.governorate))];
    const found = [];
    
    for (const gov of governorates) {
        const normalizedGov = normalizeArabic(gov);
        if (normalizedQuery.includes(normalizedGov)) {
            found.push(gov);
        }
    }
    
    return found;
}

// ==================== 🏛️ استخراج جهات الولاية ====================
function extractDependencies(normalizedQuery) {
    if (typeof industrialAreasData === 'undefined') return [];
    
    const dependencies = [...new Set(industrialAreasData.map(a => a.dependency))];
    const found = []; // 🆕 نخزن الجهات مع نسب المطابقة
    
    for (const dep of dependencies) {
        const normalizedDep = normalizeArabic(dep);
        
        const depKeywords = normalizedDep.split(/\s+/).filter(w => w.length > 2);
        const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
        
        let matchScore = 0;
        let totalPossible = depKeywords.length;
        
        for (const depWord of depKeywords) {
            for (const queryWord of queryWords) {
                if (depWord === queryWord) {
                    matchScore += 2;
                    break;
                }
                else if (depWord.includes(queryWord) && queryWord.length > 2) {
                    matchScore += 1.5;
                    break;
                }
                else if (queryWord.includes(depWord) && depWord.length > 2) {
                    matchScore += 1.5;
                    break;
                }
                else if (depWord.length > 3 && queryWord.length > 3) {
                    const similarity = calculateSimilarity(depWord, queryWord);
                    if (similarity > 0.7) {
                        matchScore += 1;
                        break;
                    }
                }
            }
        }
        
        const matchPercentage = (matchScore / (totalPossible * 2)) * 100;
        
        console.log(`🔍 فحص جهة: ${dep} - نسبة: ${Math.round(matchPercentage)}%`);
        
        // جراحة: إذا كان الاستعلام يحتوي على كلمات بحث، قلل الاعتماد على الفحص اللفظي الصارم
        // واترك المجال للمحرك الدلالي لتحديد الارتباط
        const hasSemanticWeight = normalizedQuery.length > 10;
        const dynamicThreshold = hasSemanticWeight ? 10 : 30;

        if (matchPercentage >= dynamicThreshold) {
            found.push({
                name: dep,          // 🆕 اسم الجهة
                score: matchScore,  // 🆕 النقاط
                percentage: matchPercentage // 🆕 النسبة
            });
        }
    }
    
    // 🆕 ترتيب حسب النسبة (الأعلى أولاً)
    found.sort((a, b) => b.percentage - a.percentage);
    
    // 🆕 إرجاع الأسماء فقط (مرتبة)
    return found.map(item => item.name);
}

// 🆕 دالة حساب التشابه بين كلمتين
function calculateSimilarity(word1, word2) {
    const len1 = word1.length;
    const len2 = word2.length;
    const maxLen = Math.max(len1, len2);
    
    let matches = 0;
    for (let i = 0; i < Math.min(len1, len2); i++) {
        if (word1[i] === word2[i]) {
            matches++;
        }
    }
    
    return matches / maxLen;
}


// ==================== 🏭 استخراج أسماء المناطق ====================
function extractAreaNames(normalizedQuery) {
    if (typeof industrialAreasData === 'undefined') return [];
    
    const found = [];
    
    for (const area of industrialAreasData) {
        const areaName = normalizeArabic(area.name);
        
        // استخراج الاسم المميز (بدون "المنطقة الصناعية")
        const distinctiveName = areaName
            .replace(/المنطقة الصناعية/g, '')
            .replace(/المنطقه الصناعيه/g, '')
            .replace(/^ب/g, '')
            .trim();
        
        // البحث عن تطابق
        if (distinctiveName.length > 3) {
            // تطابق كامل
            if (normalizedQuery.includes(distinctiveName)) {
                found.push({
                    name: area.name,
                    distinctiveName: distinctiveName,
                    matchType: 'full',
                    confidence: 100
                });
                continue;
            }
            
            // تطابق جزئي (الكلمات)
            const words = distinctiveName.split(/\s+/).filter(w => w.length > 2);
            let matchedWords = 0;
            
            for (const word of words) {
                if (normalizedQuery.includes(word)) {
                    matchedWords++;
                }
            }
            
            if (matchedWords > 0) {
                const confidence = Math.round((matchedWords / words.length) * 100);
                if (confidence >= 60) {
                    found.push({
                        name: area.name,
                        distinctiveName: distinctiveName,
                        matchType: 'partial',
                        confidence: confidence
                    });
                }
            }
        }
    }
    
    // ترتيب حسب الثقة
    return found.sort((a, b) => b.confidence - a.confidence);
}

// ==================== 📋 استخراج أنواع الأنشطة ====================
function extractActivityTypes(normalizedQuery) {
    if (typeof masterActivityDB === 'undefined') return [];
    
    const found = [];
    
    for (const activity of masterActivityDB) {
        const activityText = normalizeArabic(activity.text);
        
        // تطابق مباشر مع النص
        if (normalizedQuery.includes(activityText)) {
            found.push({
                text: activity.text,
                value: activity.value,
                matchType: 'exact',
                confidence: 100
            });
            continue;
        }
        
        // تطابق مع الكلمات المفتاحية
        if (activity.keywords) {
            for (const keyword of activity.keywords) {
                const normalizedKeyword = normalizeArabic(keyword);
                if (normalizedQuery.includes(normalizedKeyword)) {
                    found.push({
                        text: activity.text,
                        value: activity.value,
                        matchType: 'keyword',
                        confidence: 80
                    });
                    break;
                }
            }
        }
        
        // تطابق مع المرادفات
        if (activity.synonyms) {
            for (const synonym of activity.synonyms) {
                const normalizedSynonym = normalizeArabic(synonym);
                if (normalizedQuery.includes(normalizedSynonym)) {
                    found.push({
                        text: activity.text,
                        value: activity.value,
                        matchType: 'synonym',
                        confidence: 70
                    });
                    break;
                }
            }
        }
    }
    
    // إزالة التكرارات والترتيب
    const unique = [];
    const seen = new Set();
    
    for (const item of found) {
        if (!seen.has(item.value)) {
            seen.add(item.value);
            unique.push(item);
        }
    }
    
    return unique.sort((a, b) => b.confidence - a.confidence);
}


// ==================== 🤔 آلية الاستفسار الذكية ====================
function requestClarification(query, context, entities, questionType) {
    const q = normalizeArabic(query);
    
    // تحديد نوع الالتباس
    const ambiguityType = detectAmbiguityType(query, context, entities, questionType);
    
    if (!ambiguityType) return null;
    
    // بناء خيارات التوضيح حسب نوع الالتباس
    let clarificationHTML = '';
    
    switch (ambiguityType.type) {
        case 'authority_confusion':
            clarificationHTML = buildAuthorityClairification(query, entities);
            break;
            
        case 'area_vs_activity':
            clarificationHTML = buildAreaVsActivityClarification(query, entities);
            break;
            
        case 'multiple_areas':
            clarificationHTML = buildMultipleAreasClarification(entities.areaNames);
            break;
            
        case 'multiple_activities':
            clarificationHTML = buildMultipleActivitiesClarification(entities.activityTypes);
            break;
            
        case 'dependency_confusion':
            clarificationHTML = buildDependencyClarification(entities.dependencies);
            break;
            
        default:
            clarificationHTML = buildGeneralClarification(query, context);
    }
    
    return clarificationHTML;
}

// ==================== 🔍 كشف نوع الالتباس ====================
function detectAmbiguityType(query, context, entities, questionType) {
    const q = normalizeArabic(query);
    
    // 1. التباس بين جهة الولاية وجهة الترخيص
    if (questionType.isAuthority && !questionType.isGovernanceAuthority && !questionType.isLicensingAuthority) {
        if (q.includes('جهه') || q.includes('جهة')) {
            return { type: 'authority_confusion', confidence: 90 };
        }
    }
    
    // 2. التباس بين منطقة ونشاط
    if (context.needsClarification && Math.abs(context.delta) < 200) {
        return { type: 'area_vs_activity', confidence: 85 };
    }
    
    // 3. عدة مناطق مطابقة
    if (entities.areaNames.length > 1 && entities.areaNames[0].confidence < 100) {
        return { type: 'multiple_areas', confidence: 80 };
    }
    
    // 4. عدة أنشطة مطابقة
    if (entities.activityTypes.length > 1 && entities.activityTypes[0].confidence < 100) {
        return { type: 'multiple_activities', confidence: 75 };
    }
    
    // 5. التباس في جهة الولاية
    if (entities.dependencies.length > 1) {
        return { type: 'dependency_confusion', confidence: 70 };
    }
    
    return null;
}

// ==================== 🏛️ بناء توضيح الجهات ====================
function buildAuthorityClairification(query, entities) {
    const hasAreaContext = entities.hasAreaName || entities.hasGovernorate;
    const hasActivityContext = entities.hasActivityType;
    
    return `
        <div class="clarification-card">
            <div class="clarification-header">
                <div class="clarification-icon">🤔</div>
                <div class="clarification-title">سؤالك يحتمل أكثر من معنى</div>
            </div>
            <div class="clarification-subtitle">هل تقصد:</div>
            
            <div class="choice-btn" onclick="clarifyIntent('governance_authority')">
                <span class="choice-icon">🏛️</span> 
                <div class="choice-content">
                    <strong>جهة الولاية للمنطقة الصناعية</strong>
                    <small>أي جهة حكومية تتبع لها المنطقة (محافظة، هيئة، وزارة)</small>
                </div>
            </div>
            
            <div class="choice-btn" onclick="clarifyIntent('licensing_authority')">
                <span class="choice-icon">📋</span> 
                <div class="choice-content">
                    <strong>الجهة المُصدرة لتراخيص الأنشطة</strong>
                    <small>الجهة التي تمنح التراخيص لممارسة النشاط</small>
                </div>
            </div>
        </div>
    `;
}

// ==================== 🏭 بناء توضيح منطقة vs نشاط ====================
function buildAreaVsActivityClarification(query, entities) {
    const areaContext = entities.hasAreaName ? `للمنطقة ${entities.areaNames[0].distinctiveName}` : 'للمناطق الصناعية';
    const activityContext = entities.hasActivityType ? `لنشاط ${entities.activityTypes[0].text}` : 'للأنشطة';
    
    return `
        <div class="clarification-card">
            <div class="clarification-header">
                <div class="clarification-icon">🤔</div>
                <div class="clarification-title">سؤالك يحتمل معنيين مختلفين</div>
            </div>
            <div class="clarification-subtitle">هل تبحث عن:</div>
            
            <div class="choice-btn" onclick="clarifyIntent('industrial_areas')">
                <span class="choice-icon">🏭</span> 
                <div class="choice-content">
                    <strong>معلومات عن المناطق الصناعية</strong>
                    <small>الموقع، جهة الولاية، المساحة، قرار الإنشاء ${areaContext}</small>
                </div>
            </div>
            
            <div class="choice-btn" onclick="clarifyIntent('business_activities')">
                <span class="choice-icon">📋</span> 
                <div class="choice-content">
                    <strong>تراخيص ومتطلبات الأنشطة</strong>
                    <small>التراخيص المطلوبة، الإجراءات، الجهات المٌصدرة ${activityContext}</small>
                </div>
            </div>
        </div>
    `;
}

// ==================== 🗺️ بناء توضيح المناطق المتعددة ====================
function buildMultipleAreasClarification(areaNames) {
    let optionsHTML = '';
    
    areaNames.slice(0, 3).forEach((area, index) => {
        optionsHTML += `
            <div class="choice-btn" onclick="selectSpecificArea('${area.name.replace(/'/g, "\\'")}')">
                <span class="choice-icon">${index === 0 ? '🎯' : '🏭'}</span> 
                <div class="choice-content">
                    <strong>${area.name}</strong>
                    <small>تطابق ${area.confidence}% - ${area.matchType === 'full' ? 'تطابق كامل' : 'تطابق جزئي'}</small>
                </div>
            </div>
        `;
    });
    
    return `
        <div class="clarification-card">
            <div class="clarification-header">
                <div class="clarification-icon">🗺️</div>
                <div class="clarification-title">وجد عدة مناطق مطابقة</div>
            </div>
            <div class="clarification-subtitle">اختر المنطقة المقصودة:</div>
            ${optionsHTML}
        </div>
    `;
}

// ==================== 📋 بناء توضيح الأنشطة المتعددة ====================
function buildMultipleActivitiesClarification(activityTypes) {
    let optionsHTML = '';
    
    activityTypes.slice(0, 3).forEach((activity, index) => {
        optionsHTML += `
            <div class="choice-btn" onclick="selectSpecificActivity('${activity.value}', '${activity.text.replace(/'/g, "\\'")}')">
                <span class="choice-icon">${index === 0 ? '🎯' : '📋'}</span> 
                <div class="choice-content">
                    <strong>${activity.text}</strong>
                    <small>تطابق ${activity.confidence}% - ${activity.matchType === 'exact' ? 'تطابق دقيق' : 'مرادف'}</small>
                </div>
            </div>
        `;
    });
    
    return `
        <div class="clarification-card">
            <div class="clarification-header">
                <div class="clarification-icon">📋</div>
                <div class="clarification-title">وجد عدة أنشطة مطابقة</div>
            </div>
            <div class="clarification-subtitle">اختر النشاط المقصود:</div>
            ${optionsHTML}
        </div>
    `;
}

// ==================== 🏢 بناء توضيح جهات الولاية ====================
function buildDependencyClarification(dependencies) {
    let optionsHTML = '';
    
    dependencies.forEach((dep, index) => {
        const count = industrialAreasData.filter(a => a.dependency === dep).length;
        optionsHTML += `
            <div class="choice-btn" onclick="selectDependency('${dep.replace(/'/g, "\\'")}')">
                <span class="choice-icon">🏛️</span> 
                <div class="choice-content">
                    <strong>${dep}</strong>
                    <small>${count} منطقة صناعية</small>
                </div>
            </div>
        `;
    });
    
    return `
        <div class="clarification-card">
            <div class="clarification-header">
                <div class="clarification-icon">🏢</div>
                <div class="clarification-title">وجد عدة جهات ولاية مطابقة</div>
            </div>
            <div class="clarification-subtitle">اختر جهة الولاية المقصودة:</div>
            ${optionsHTML}
        </div>
    `;
}

// ==================== ❓ بناء توضيح عام ====================
function buildGeneralClarification(query, context) {
    return `
        <div class="clarification-card">
            <div class="clarification-header">
                <div class="clarification-icon">💭</div>
                <div class="clarification-title">لم أفهم سؤالك بوضوح</div>
            </div>
            <div class="clarification-subtitle">يمكنك إعادة صياغة السؤال أو اختيار أحد المواضيع:</div>
            
            <div class="choice-btn" onclick="clarifyIntent('show_areas_options')">
                <span class="choice-icon">🏭</span> 
                <strong>المناطق الصناعية</strong>
            </div>
            
            <div class="choice-btn" onclick="clarifyIntent('show_activities_options')">
                <span class="choice-icon">📋</span> 
                <strong>تراخيص الأنشطة</strong>
            </div>
        </div>
    `;
}

// ==================== 🎯 دوال معالجة اختيارات التوضيح ====================
window.clarifyIntent = function(intent) {
    const input = document.getElementById('gptInput');
    
    switch(intent) {
        case 'governance_authority':
            input.value = 'المناطق الصناعية: ما جهات الولاية للمناطق الصناعية؟';
            break;
            
        case 'licensing_authority':
            input.value = 'الانشطة والتراخيص: ما الجهات المُصدرة للتراخيص؟';
            break;
            
        case 'industrial_areas':
            input.value = 'المناطق الصناعية: ' + document.getElementById('gptInput').value;
            break;
            
        case 'business_activities':
            input.value = 'الانشطة والتراخيص: ' + document.getElementById('gptInput').value;
            break;
            
        case 'show_areas_options':
            input.value = 'كم عدد المناطق الصناعية؟';
            break;
            
        case 'show_activities_options':
            input.value = 'ما التراخيص المطلوبة لمصنع؟';
            break;
    }
    
    sendMessage();
};

window.selectSpecificArea = function(areaName) {
    const input = document.getElementById('gptInput');
    input.value = areaName;
    sendMessage();
};

window.selectSpecificActivity = function(value, text) {
    const input = document.getElementById('gptInput');
    input.value = text;
    sendMessage();
};

window.selectDependency = function(dependency) {
    const input = document.getElementById('gptInput');
    input.value = `المناطق التابعة لـ ${dependency}`;
    sendMessage();
};


// ==================== 🔍 فحص وجود نوع نشاط محدد ====================
function checkForSpecificActivityType(normalizedQuery) {
    if (typeof masterActivityDB === 'undefined') {
        return { found: false, type: null };
    }
    
    // كلمات مفتاحية تدل على نشاط محدد
    const activityIndicators = [
        'فندق', 'مطعم', 'مصنع', 'صيدلية', 'عيادة', 'مخزن', 
        'مستودع', 'ورشة', 'معمل', 'مزرعة', 'مخبز', 'محل'
    ];
    
    for (const indicator of activityIndicators) {
        if (normalizedQuery.includes(indicator)) {
            return { found: true, type: indicator };
        }
    }
    
    return { found: false, type: null };
}

// ==================== 🧠 DeepIntentAnalyzer - فاحص النية العميق ====================
const DeepIntentAnalyzer = {

    knownActivityWords: [
        'فندق', 'مطعم', 'مصنع', 'صيدلية', 'عيادة', 'مخزن',
        'مستودع', 'ورشة', 'معمل', 'مزرعة', 'مخبز', 'محل',
        'كافيه', 'كافتيريا', 'بقالة', 'سوبر', 'جزار', 'حلاوي',
        'نجار', 'سباك', 'كهربائي', 'طبيب', 'دكتور', 'بيطري',
        'مدرسة', 'جامعة', 'معهد', 'محطة', 'مزار', 'منتجع'
    ],

    isStandaloneActivity(query) {
        const q = normalizeArabic(query).trim();
        const words = q.split(/\s+/).filter(w => w.length > 1);
        if (words.length <= 2) {
            for (const actWord of this.knownActivityWords) {
                if (q.includes(normalizeArabic(actWord))) {
                    return { found: true, activity: actWord };
                }
            }
        }
        return { found: false };
    },

    scanForAreaName(query) {
        if (typeof industrialAreasData === 'undefined' || !industrialAreasData) {
            return { found: false, score: 0, areaName: null };
        }
        const q = normalizeArabic(query);
        const queryWords = q.split(/\s+/).filter(w => w.length > 2);
        if (queryWords.length === 0) return { found: false, score: 0, areaName: null };

        let bestMatch = { found: false, score: 0, areaName: null, area: null };

        for (const area of industrialAreasData) {
            const areaName = normalizeArabic(area.name);
            const areaWords = areaName
                .replace(/المنطقة الصناعية/g, '')
                .replace(/المنطقه الصناعيه/g, '')
                .replace(/^ب/g, '')
                .split(/\s+/)
                .filter(w => w.length > 2 && !['في', 'من', 'على', 'الي'].includes(w));

            if (areaWords.length === 0) continue;

            let matchedQueryWords = 0;
            for (const qWord of queryWords) {
                for (const aWord of areaWords) {
                    if (aWord === qWord || aWord.includes(qWord) || qWord.includes(aWord)) {
                        matchedQueryWords++;
                        break;
                    }
                }
            }

            const coverage = matchedQueryWords / queryWords.length;
            if (coverage >= 0.4 && matchedQueryWords > 0) {
                const score = coverage * 100;
                if (score > bestMatch.score) {
                    bestMatch = { found: true, score: score, areaName: area.name, area: area };
                }
            }
        }

        console.log(`🧠 DeepIntentAnalyzer scan: "${query}" → أفضل منطقة: ${bestMatch.areaName || 'null'} (${bestMatch.score}%)`);
        return bestMatch;
    },

    analyze(query) {
        const activityCheck = this.isStandaloneActivity(query);
        if (activityCheck.found) {
            console.log(`🧠 DeepIntent: "${query}" → نشاط مستقل واضح: ${activityCheck.activity}`);
            return { intent: 'activity', confidence: 95, reason: 'standalone_activity', details: activityCheck };
        }

        const areaCheck = this.scanForAreaName(query);
        if (areaCheck.found && areaCheck.score >= 50) {
            console.log(`🧠 DeepIntent: "${query}" → منطقة صناعية مكتشفة: ${areaCheck.areaName} (${areaCheck.score}%)`);
            return { intent: 'industrial', confidence: areaCheck.score, reason: 'deep_area_scan', details: areaCheck };
        }
        if (areaCheck.found && areaCheck.score >= 40) {
            return { intent: 'probable_industrial', confidence: areaCheck.score, reason: 'weak_area_scan', details: areaCheck };
        }
        return { intent: 'unknown', confidence: 0, reason: 'no_signal', details: null };
    }
};

// ==================== الذاكرة السياقية تم نقله بملف مستقل ====================
    

// ==================== دوال مساعدة جديدة ====================
// ==================== 🔍 البحث في المناطق الصناعية باستخدام NeuralSearch ====================
window.searchIndustrialZonesWithNeural = function(query) {
    const q = window.normalizeArabic(query); // استخدام النسخة العالمية
    
    // منع البحث إذا كانت الكلمة هي فقط "المحافظة" أو "الجهة"
    if (q === 'المحافظه' || q === 'المحافظة' || q === 'الجهه' || q === 'الجهة') return null;
    
    if (typeof industrialAreasData === 'undefined' || !industrialAreasData) {
        console.error("❌ قاعدة بيانات المناطق غير متوفرة");
        return null;
    }
    
    console.log("🏭 البحث في المناطق باستخدام NeuralSearch:", query);
    
    // استخدام NeuralSearch الموحد
    const searchResults = NeuralSearch(query, industrialAreasData, {
        minScore: 50,
        exclude: [] 
    });
    
    console.log(`📊 نتائج NeuralSearch: ${searchResults.results.length} منطقة`);
    
    if (searchResults.results.length === 0) {
        return null;
    }
    
    const topResult = searchResults.results[0];
    
    // 1. فحص الثقة العالية (1000+)
    if (topResult.finalScore >= 1000) {
        console.log(`✅ نتيجة بثقة عالية جداً (${topResult.finalScore}):`, topResult.originalData.name);
        return topResult.originalData;
    }
    
    // 2. آلية التوضيح عند تقارب النتائج (Ambiguity Logic)
    if (searchResults.results.length >= 2) {
        const secondScore = searchResults.results[1].finalScore;
        const scoreDiff = topResult.finalScore - secondScore;
        
        if (scoreDiff < 200 && secondScore >= 300) {
            console.log("⚠️ عدة نتائج متقاربة - طلب توضيح");
            AgentMemory.setClarification(searchResults.results.slice(0, 3).map(r => ({
                type: 'industrial',
                name: r.originalData.name,
                data: r.originalData,
                score: r.finalScore
            })));
            return null;
        }
    }
    
    // 3. فحص الثقة الجيدة (300+)
    if (topResult.finalScore >= 300) {
        console.log(`✅ نتيجة بثقة جيدة (${topResult.finalScore}):`, topResult.originalData.name);
        return topResult.originalData;
    }
    
    // 4. إهمال النتائج الضعيفة
    console.log(`⚠️ نقاط ضعيفة (${topResult.finalScore}) - لن نرجع نتيجة`);
    return null;
};



// ==================== 🆕 دالة حساب التشابه المُحسَّنة ====================
function calculateWordSimilarity(word1, word2) {
    const len1 = word1.length;
    const len2 = word2.length;
    
    // Levenshtein Distance مبسط
    const matrix = [];
    
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,  // استبدال
                    matrix[i][j - 1] + 1,      // إدراج
                    matrix[i - 1][j] + 1       // حذف
                );
            }
        }
    }
    
    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    
    return 1 - (distance / maxLen);
}
















// 1. دالة تنظيف النص العربي (ضرورية جداً لعمل البحث)
window.normalizeArabic = function(text) { 
    if (!text) return "";
    return text.toString()
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

// 2. دالة الرد الافتراضي (التي كانت متداخلة مع الأولى)
window.generateDefaultResponse = function(query) {
    const q = normalizeArabic(query);
    
    if (q.length < 3) {
        return `😕 <strong>السؤال قصير جداً</strong><br><br>
            💡 جرب أن تسأل:<br>
            • "كم عدد المناطق الصناعية؟"<br>
            • "ما التراخيص المطلوبة لفندق؟"`;
    }
    
    return `😕 <strong>عذراً، لم أجد معلومات عن: "${query}"</strong><br><br>
        💡 جرب أحد هذه الأسئلة:<br>
        • "كم عدد المناطق الصناعية في مصر؟"<br>
        • "اذكر اسم اي نشاط "<br>
        • "هل نشاط النقل الجماعي وارد بالقرار 104؟"`;
};
// ==================== 🆕 دالة فحص الارتباط الذكية ====================
// ==================== 🆕 دالة فحص الارتباط الذكية المُحسّنة ====================

// gpt_agent.js - التعديل الثالث (النسخة المرنة)
function isQueryRelatedToContext(query, context) {
    const q = normalizeArabic(query);
    const questionType = detectQuestionType(query);
    const previous = AgentMemory.getBacklinkContext();

    // --- بداية المشرط الجراحي المطور ---
    let isReferringToPrevious = q.includes('السابق') || q.includes('القديم') || q.includes('الاول');

    if (!isReferringToPrevious && previous && previous.data) {
        const prevName = normalizeArabic(previous.data.text || previous.data.name || "");
        // استخراج الكلمات الهامة من النشاط السابق (تجاهل الكلمات القصيرة)
        const coreWords = prevName.split(/\s+/).filter(w => w.length > 3);
        
        // إذا ذكر المستخدم أي كلمة جوهرية من النشاط السابق في سؤاله
        // مثال: "المكتب" موجودة في "مكتب علمي"
        isReferringToPrevious = coreWords.some(word => q.includes(word));
    }

    if (isReferringToPrevious && previous) {
        console.log("🔄 تبديل السياق للنشاط السابق المذكور جزئياً...");
        
        const currentBackup = { type: context.type, data: context.data };
        const nameToRestore = previous.data.text || previous.data.name;

        // تنفيذ التبديل في الذاكرة
        if (previous.type === 'activity') {
            AgentMemory.lastActivity = previous.data;
            AgentMemory.lastIndustrial = null;
        } else {
            AgentMemory.lastIndustrial = previous.data;
            AgentMemory.lastActivity = null;
        }
        AgentMemory.previousContext = currentBackup;
        AgentMemory.save();
        
        // إشعار المستخدم بالتبديل
        showGPTNotification(`تم العودة إلى: ${nameToRestore}`, 'success');
        
        return true; 
    }

    if (!context || !context.data) return false;
    
    console.log("🔍 فحص الارتباط - السؤال:", query);
    console.log("📋 السياق الحالي:", context.type);
    
    // ✅ 1. فحص الأسئلة المكملة القصيرة (مرتبطة دائماً)
    const isShortFollowUpQuestion = (
        q.length <= 30 &&  // السؤال قصير
        (
            // كلمات مكملة واضحة
            q === 'ترخيص' || q === 'تراخيص' ||
            q === 'موقع' || q === 'موقع ملائم' || q === 'الموقع الملائم' ||
            q === 'قرار' || q === 'قانون' || q === 'المحافظه' || q === 'المحافظة' ||
                   q === 'تبعيه' || q === 'تبعية' || q === 'تبع مين' ||
                   q === 'المحافظه' || q === 'المحافظة' || q.includes('محافظه') || q.includes('محافظة') || q.includes('تبعيه') || q.includes('تبعية') || q === 'جهه' || q === 'جهة' || q === 'الجهه المصدره' ||
            q === 'دليل' || q === 'رابط' ||
            q === 'ملاحظات' || q === 'ملاحظات فنيه' ||
            q === '104' || q === 'قرار 104' || q === 'حوافز' ||
            q === 'خريطه' || q === 'خريطة' || q === 'احداثيات' ||
            // 🆕 إضافة الأسئلة عن القرار 104
            q === 'هل هو وارد بالقرار 104' ||
            q === 'هل هوارد بالقرار 104' ||
            q === 'هل هو وارد' ||
            q === 'هل موجود' ||
            q === 'وارد بالقرار 104' ||
            q === 'هل موجود بالقرار 104' ||
            q === 'هل مدرج بالقرار 104' ||
            
            // أنماط قصيرة مكملة
            /^(ما|ماذا|كيف|هل)\s+(ترخيص|تراخيص|موقع|قرار|جهه|دليل)/.test(q) ||
            /^(اين|فين|وين)\s/.test(q) && q.length < 15 ||
            // 🆕 أنماط أسئلة القرار 104
            /^هل\s*(هو|هي|هوارد|هيوارد)?\s*(وارد|موجود|مدرج)\s*(بالقرار|في القرار|ب)?\s*104?/.test(q)
        )
    );
    
    if (isShortFollowUpQuestion) {
        console.log("✅ سؤال مكمل قصير - مرتبط بالسياق");
        return true;
    }
    
    // gpt_agent.js
if (context.type === 'activity') {
    const isDetailedFollowUp = (
        questionType.isLicense ||
        questionType.isAuthority ||
        questionType.isLaw ||
        questionType.isGuide ||
        questionType.isTechnical ||
        questionType.isLocation ||
        questionType.isDecision104
    );

    // ---  ---
    if (isDetailedFollowUp) {
        // فحص هل السؤال يحتوي على نشاط مستقل جديد
        const deepCheck = DeepIntentAnalyzer.isStandaloneActivity(query);
        if (deepCheck.found) {
            const currentActivityName = normalizeArabic(context.data.text || "");
            const newActivityFound = normalizeArabic(deepCheck.activity);
            
            // إذا كان هناك نشاط جديد لا يشبه النشاط القديم، اقطع الارتباط فوراً
            if (!currentActivityName.includes(newActivityFound) && !newActivityFound.includes(currentActivityName)) {
                console.log(`⚠️ تصادم كيانات: نشاط جديد [${newActivityFound}] يختلف عن السياق الحالي [${currentActivityName}]`);
                return false; 
            }
        }
    }

    if (isDetailedFollowUp && !/(منطقه|منطقة|مناطق|صناعيه|صناعية)/.test(q)) {
        console.log("✅ سؤال تفصيلي عن النشاط - مرتبط");
        return true;
    }
}
    
    if (context.type === 'industrial') {
        const isDetailedFollowUp = (
            questionType.isLocation ||
            questionType.isLaw ||
            questionType.isDependency ||
            /قرار|انشاء|مساحه|فدان|احداثيات/.test(q)
        );
        
        if (isDetailedFollowUp && !/ترخيص|تراخيص|نشاط|مشروع/.test(q)) {
            console.log("✅ سؤال تفصيلي عن المنطقة - مرتبط");
            return true;
        }
    }
    
    // 🔴 3. استبعاد: أسئلة واضحة عن موضوع مختلف تماماً
    
    // إذا كان السياق عن "نشاط" لكن السؤال الجديد عن "عدد المناطق"
    if (context.type === 'activity') {
        const isAboutAreas = (
            /كم عدد.*منطقه|كم عدد.*مناطق/.test(q) ||
            /ما هي.*المناطق/.test(q) ||
            /عرض.*كل.*المناطق/.test(q) ||
            /قائمه.*مناطق/.test(q) ||
            questionType.isGeneralAreaCount ||
            questionType.isSpecificAreaCount ||
            (questionType.isAreaList && q.length > 15)  // قائمة مناطق (سؤال طويل)
        );
        
        if (isAboutAreas) {
            console.log("❌ السؤال الجديد عن المناطق - غير مرتبط");
            return false;
        }
    }
    
    // إذا كان السياق عن "منطقة" لكن السؤال الجديد عن "نشاط/ترخيص كامل"
    if (context.type === 'industrial') {
        const isAboutCompleteActivity = (
            q.length > 15 &&  // سؤال طويل (ليس مكمل)
            /نشاط.*ترخيص|ترخيص.*نشاط/.test(q) &&
            !/منطقه|منطقة|مناطق/.test(q)
        );
        
        if (isAboutCompleteActivity) {
            console.log("❌ السؤال الجديد عن نشاط كامل - غير مرتبط");
            return false;
        }
    }
    
    // 🔴 4. استبعاد: سؤال جديد باسم نشاط/منطقة مختلفة
    if (context.type === 'activity') {
        const activityName = normalizeArabic(context.data.text);
        const mainWords = activityName.split(/\s+/).filter(w => w.length > 4);
        
        let matchCount = 0;
        for (const word of mainWords) {
            if (q.includes(word)) {
                matchCount++;
            }
        }
        
        // إذا لم يتطابق أي من الكلمات الرئيسية للنشاط
        if (mainWords.length > 0 && matchCount === 0 && q.length > 15) {
            console.log("❌ لا يحتوي على كلمات النشاط السابق - غير مرتبط");
            return false;
        }
        
        // إذا تطابق معظم الكلمات
        if (matchCount >= Math.ceil(mainWords.length * 0.5)) {
            console.log("✅ يحتوي على كلمات النشاط السابق - مرتبط");
            return true;
        }
    }
    
    if (context.type === 'industrial') {
        const areaName = normalizeArabic(context.data.name);
        const mainWords = areaName.split(/\s+/).filter(w => w.length > 4);
        
        let matchCount = 0;
        for (const word of mainWords) {
            if (q.includes(word)) {
                matchCount++;
            }
        }
        
        // إذا لم يتطابق أي من الكلمات الرئيسية للمنطقة
        if (mainWords.length > 0 && matchCount === 0 && q.length > 15) {
            console.log("❌ لا يحتوي على كلمات المنطقة السابقة - غير مرتبط");
            return false;
        }
        
        // إذا تطابق معظم الكلمات
        if (matchCount >= Math.ceil(mainWords.length * 0.5)) {
            console.log("✅ يحتوي على كلمات المنطقة السابقة - مرتبط");
            return true;
        }
    }
    
    // 🔴 5. افتراضي: الأسئلة القصيرة جداً (أقل من 10 أحرف)
    // ⭐ تعديل استراتيجي: قبل أن نفترض أنها "مكملة"، نفحص إذا كانت نشاطاً مستقلاً
    if (q.length < 10) {
        const deepCheck = DeepIntentAnalyzer.isStandaloneActivity(query);
        if (deepCheck.found) {
            console.log(`❌ كلمة نشاط مستقلة "${deepCheck.activity}" - غير مرتبط بالسياق`);
            return false;  // نشاط مستقل → سؤال جديد كامل
        }
        console.log("✅ سؤال قصير جداً وليس نشاطاً مستقلاً - افتراضياً مرتبط");
        return true;
    }
    
    // 🔴 6. افتراضي: إذا لم نستطع التحديد بوضوح
    console.log("⚠️ غير محدد - افتراضياً غير مرتبط");
    return false;
}
 // ==================== 🚀 المحرك الرئيسي المطور (Hybrid Precision Engine V2) ====================
async function processUserQuery(query) {
    const startTime = performance.now();
    console.log("🚀 ========== بدء المعالجة الذكية (الهجينة) ==========");
    console.log("📝 السؤال الأصلي:", query);

    // 1️⃣ التطهير الأولي واستخراج السياق الأساسي
    const q = window.normalizeArabic(query);
    const questionType = window.detectQuestionType(query);
    const context = AgentMemory.getContext();

    // 🎯 [المسار اليدوي] الأسئلة الموجهة صراحة (Prefixes) - أولوية مطلقة للمستخدم
    if (q.startsWith('المناطق الصناعيه:') || q.startsWith('مناطق صناعيه:') || q.startsWith('مناطق:')) {
        const actualQuery = query.replace(/^(المناطق الصناعيه:|مناطق صناعيه:|مناطق:)/i, '').trim();
        await AgentMemory.clear();
        return await handleIndustrialQuery(actualQuery, window.detectQuestionType(actualQuery), null, null);
    }

    if (q.startsWith('الانشطه والتراخيص:') || q.startsWith('نشاط:') || q.startsWith('تراخيص:')) {
        const actualQuery = query.replace(/^(الانشطه والتراخيص:|نشاط:|تراخيص:)/i, '').trim();
        await AgentMemory.clear();
        return await handleActivityQuery(actualQuery, window.detectQuestionType(actualQuery), null, null);
    }

    // 🎯 [المسار السريع] فحص الكلمات المفتاحية الصريحة للقرار 104 قبل استهلاك موارد المتجهات
    if (typeof isDecision104Question === 'function' && isDecision104Question(query)) {
        console.log("🎯 توجيه صريح لمحرك القرار 104 (Keyword Trigger)");
        const decision104Response = handleDecision104Query(query, questionType);
        if (decision104Response) return decision104Response;
    }

    // 🧠 2️⃣ [المرحلة المتجهية: الموجه الدلالي الاحترافي V2]
    let vectorMatch = null;
    let vectorTargetDB = null;
    let vectorConfidence = 0;

    try {
        console.log("⏳ جاري استشارة الموجه الدلالي (Semantic Routing)...");
        const searchResponse = await hybridEngine.search(query);
        
        if (searchResponse && searchResponse.topMatch) {
            vectorMatch = searchResponse.topMatch; 
            // جراحة: استخلاص القاعدة من بيانات النتيجة مباشرة لضمان عدم الضياع
            vectorTargetDB = searchResponse.topMatch.dbName || searchResponse.intent;
            vectorConfidence = searchResponse.confidence;
            console.log(`✨ القرار الدلالي: القاعدة [${vectorTargetDB}] | المعرف [${vectorMatch.id}]`);
        }
    } catch (e) {
        console.error("⚠️ فشل الموجه الدلالي، الاعتماد على التحليل النصي فقط:", e);
    }

    // 🔄 3️⃣ [إدارة الذاكرة والسياق] - الحفاظ على تسلسل الأفكار
    if (context && context.type !== 'clarification') {
        const isRelated = isQueryRelatedToContext(query, context);
        if (!isRelated) {
            console.log("🔄 سؤال جديد غير مرتبط - مسح السياق المؤقت");
            await AgentMemory.clear();
        } else {
            console.log("💡 السؤال مرتبط بالسياق الحالي، جاري المعالجة السياقية...");
            const contextResponse = await handleContextualQuery(query, questionType, AgentMemory.getContext());
            if (contextResponse) return contextResponse;
        }
    }
    
    // 🤔 4️⃣ [معالجة التوضيحات] - إذا كان المستخدم يختار من قائمة سابقة
    if (context && context.type === 'clarification') {
        const choice = context.data.find(c => normalizeArabic(c.name).split(/\s+/).some(word => q.includes(word)));
        if (choice) {
            if (choice.type === 'industrial') {
                AgentMemory.setIndustrial(choice.data, query);
                return formatIndustrialResponse(choice.data);
            } else {
                await AgentMemory.setActivity(choice.data, query);
                return formatActivityResponse(choice.data, questionType);
            }
        }
    }

    // 🛠️ 5️⃣ [التحليل العميق] - استخراج الكيانات والنية العميقة
    const analysisContext = analyzeContext(query, questionType);
    const entities = extractEntities(query);
    const deepIntent = DeepIntentAnalyzer.analyze(query);
    
    // 🚀 6️⃣ [اتخاذ القرار الهجين - Hybrid Execution Logic]

    // جراحة: لا تنفذ فوراً إلا إذا كانت الثقة الدلالية حقيقية (ليست ناتجة عن RRF فقط)
    // وإذا كان المعرف يبدأ بـ decision104، نتأكد من إرساله للمحرك المتخصص دون "تنظيف"
    if (vectorMatch && (vectorConfidence > 0.85 || vectorMatch.id.includes('decision104'))) {
        console.log("🎯 استخراج مباشر من قاعدة البيانات بالمعرف:", vectorMatch.id);
        
        if (vectorTargetDB === 'decision104') {
             // استخراج البيانات مباشرة من قاعدة البيانات
             const activity = unifiedSearchDB?.find(item => item.id === vectorMatch.id);

             
             if (activity) {
                 console.log(`✅ تم العثور على النشاط: ${activity.name}`);
                 
                 // عرض النتيجة مباشرة
                 displayDecision104Result([activity], query);
                 
                 // حفظ في الذاكرة
                 window.chatMemory = window.chatMemory || [];
                 window.chatMemory.push({
                     type: 'decision_activity',
                     name: activity.name,
                     sector: activity.sector || 'غير محدد'
                 });
                 
                 return; // إيقاف المعالجة
             } else {
                 console.warn(`⚠️ لم يتم العثور على المعرف ${vectorMatch.id} في قاعدة البيانات - استخدام البحث النصي`);
                 // الاستمرار للبحث النصي كخطة بديلة
                 return handleDecision104Query(query, questionType);
             }
        } else if (vectorTargetDB === 'activities') {
            const act = masterActivityDB.find(a => a.value === vectorMatch.id);
            if (act) { await AgentMemory.setActivity(act, query); return formatActivityResponse(act, questionType); }
        } else if (vectorTargetDB === 'areas') {
            const area = industrialAreasData.find(a => a.name === vectorMatch.id);
            if (area) { await AgentMemory.setIndustrial(area, query); return formatIndustrialResponse(area); }
        }
 }
   

     // ب. [التوجيه الدلالي الذكي] تنفيذ بناءً على النية المصنفة
                if (vectorMatch && vectorConfidence > 0.65) {
    // استخدام النص الأصلي من المتجه بدلاً من المعرّف
    const originalText = vectorMatch.data?.text || query;
    
    switch (vectorTargetDB) {
        case 'decision104':
            console.log("⚖️ مسار القرار 104 المتخصص");
            // استخدام النص الأصلي للبحث
            const res104 = await handleDecision104Query(originalText, questionType);
            if (res104 && !res104.includes('لم أجد معلومات')) return res104;
            break;

        case 'activities':
            console.log("📋 مسار التراخيص والأنشطة (الدلالي المباشر)");
            // جراحة: ثق في نتيجة المتجه واستخدم بياناتها فوراً دون إعادة البحث نصياً
            const directAct = vectorMatch.data?.original_data || vectorMatch.data;
            if (directAct) {
                await AgentMemory.setActivity(directAct, query);
                return formatActivityResponse(directAct, questionType);
            }
            break;

        case 'areas':
            console.log("🏭 مسار المناطق الجغرافية");
            const areaData = vectorMatch.data?.original_data;
            if (areaData && areaData.name) {
                const area = industrialAreasData.find(a => a.name === areaData.name);
                if (area) {
                    await AgentMemory.setIndustrial(area, query);
                    return formatIndustrialResponse(area);
                }
            }
            // Fallback: البحث بالنص
            const resArea = await handleIndustrialQuery(originalText, questionType, analysisContext, entities);
            if (resArea) return resArea;
            break;
    }
}

    // ج. [آلية التوضيح] - إذا كان هناك التباس دلالي
    if (analysisContext.needsClarification && vectorConfidence < 0.80) {
        const clarification = requestClarification(query, analysisContext, entities, questionType);
        if (clarification) return clarification;
    }
    
    // د. [صمام الأمان النهائي - Fallback] - العودة للمنطق النصي التقليدي
    console.log("🛡️ تفعيل صمام الأمان: البحث في المسارات البديلة");
    const isClearlyIndustrial = checkIfIndustrialQuestion(query, questionType, analysisContext, entities);
    const isClearlyActivity = checkIfActivityQuestion(query, questionType, analysisContext, entities);
    
    if (analysisContext.recommendation === 'areas' || (isClearlyIndustrial && !isClearlyActivity)) {
        const res = await handleIndustrialQuery(query, questionType, analysisContext, entities);
        if (res) return res;
        return await handleActivityQuery(query, questionType, analysisContext, entities);
    } 
    
    if (analysisContext.recommendation === 'activities' || (isClearlyActivity && !isClearlyIndustrial)) {
        const res = await handleActivityQuery(query, questionType, analysisContext, entities);
        if (res) return res;
        return await handleIndustrialQuery(query, questionType, analysisContext, entities);
    }

    // هـ. [محاولة الإنقاذ الأخيرة] - محاولة دلالية بحد أدنى من الثقة
    if (vectorMatch && vectorConfidence > 0.50) {
        console.log("🔍 محاولة إنقاذ أخيرة بالمعطيات المتجهية...");
        if (vectorTargetDB === 'activities') {
            const act = masterActivityDB.find(a => a.value === vectorMatch.id);
            if (act) return formatActivityResponse(act, questionType);
        } else if (vectorTargetDB === 'areas') {
            const area = industrialAreasData.find(a => a.name === vectorMatch.id);
            if (area) return formatIndustrialResponse(area);
        }
    }

    const endTime = performance.now();
    console.log(`⏱️ إجمالي زمن المعالجة: ${(endTime - startTime).toFixed(2)}ms`);

    console.log("❌ لم يتم العثور على إجابة دقيقة عبر كافة المسارات");
    return generateDefaultResponse(query);
}
// ==================== 📝 تنسيق رسالة السياق ====================
function formatContextMessage(contextAnalysis) {
    if (!contextAnalysis.related || !contextAnalysis.context) return null;
    
    const { context, relationshipType, strength } = contextAnalysis;
    
    let message = '';
    
    if (strength === 'strong') {
        message = `<div class="info-card" style="background: linear-gradient(135deg, #e3f2fd 0%, #f1f8ff 100%); border-left: 4px solid #2196f3;">
            <div class="info-card-header" style="color: #1565c0;">
                💡 فهمت! سؤالك متعلق بـ: <strong>${context.name}</strong>
            </div>
        </div>`;
    }
    
    return message;
}

// ==================== 🔍 كشف نوع قاعدة البيانات من السؤال ====================
function detectQuestionDatabase(query) {
    const q = normalizeArabic(query);
    
    // فحص القرار 104
    if (/قرار.*104|القرار|حوافز|اعفاءات|قطاع\s*(أ|ا|ب)/.test(q)) {
        return 'decision104';
    }
    
    // فحص المناطق الصناعية
    if (/منطقة|منطقه|صناعية|صناعيه|محافظة|تبعية|ولاية/.test(q)) {
        return 'industrial_zones';
    }
    
    // افتراضي: الأنشطة
    return 'activities';
}

// ==================== ✅ فحص نوع السؤال - مناطق (بدون إعادة حساب) ====================
function checkIfIndustrialQuestion(query, questionType, analysisContext, entities) {
    const q = normalizeArabic(query);
         
             // ✅ فحص مباشر: طلب عرض كل المناطق
if (/عرض|اظهر|اعرض/.test(q) && /(كل|جميع|قائمه)/.test(q) && /منطقه|مناطق|صناعيه|صناعية/.test(q)) {
    console.log("🎯 تأكيد فوري: طلب عرض جميع المناطق");
    return true;  // منطقة بالتأكيد
}
        // ✅ إضافة: فحص مباشر للأسئلة الصريحة عن المناطق
    if (q.startsWith('المناطق الصناعية:') || q.startsWith('مناطق صناعية:')) {
        console.log("🎯 سؤال صريح عن المناطق - تأكيد فوري");
        return true;
    }
    
    // ⭐ تأكيد مباشر: أسئلة واضحة جداً عن المناطق
    if (questionType.isCount && /عدد.*منطقه|عدد.*مناطق/.test(q)) {
        return true;  // منطقة بالتأكيد
    }
    
    if (/المناطق.*التابعه|المناطق.*التابعة/.test(q)) {
        return true;  // منطقة بالتأكيد
    }
    
    if (/(كم|ما) عدد.*المناطق/.test(q)) {
        return true;  // منطقة بالتأكيد
    }
    
    // === المستوى 1: مؤشرات قوية جداً ===
    
    // أسئلة محددة عن المناطق
    if (questionType.isGeneralAreaCount) return true;
    if (questionType.isSpecificAreaCount) return true;
    if (questionType.isAreaList) return true;
    if (questionType.isGovernanceAuthority) return true;
    if (questionType.isAreaExistenceCheck) return true;
    
    // وجود اسم منطقة محدد بثقة عالية
    if (entities.hasAreaName && entities.areaNames[0].confidence >= 80) {
        return true;
    }
    
    // === المستوى 2: استخدام السياق المحسوب ===
    
    // إذا كانت التوصية "مناطق" بثقة عالية
    if (analysisContext.recommendation === 'areas' && analysisContext.confidence >= 60) {
        return true;
    }
    
    // === المستوى 3: الفحوصات التقليدية المحسنة ===
    
    // أنماط واضحة
    const strongPatterns = [
        /عدد.*منطقه.*صناعيه/,
        /عدد.*مناطق.*صناعيه/,
        /ما هي.*المناطق.*الصناعيه/,
        /اسماء.*المناطق.*الصناعيه/,
        /قائمه.*المناطق.*الصناعيه/,
        /المنطقة الصناعية ب/,
        /موقع.*منطقه.*صناعيه/
    ];
    
    if (strongPatterns.some(pattern => pattern.test(q))) {
        return true;
    }
    
    // كلمات مناطق + سياق جغرافي
    const hasAreaKeywords = q.includes('منطقه') || q.includes('منطقة') || q.includes('صناعيه') || q.includes('صناعية');
    const hasLicenseContext = /ترخيص|تراخيص|متطلبات|شروط|اجراءات/.test(q);
    
    if (hasAreaKeywords && !hasLicenseContext) {
        const hasGeographicContext = questionType.hasLocationContext || 
                                      entities.hasGovernorate || 
                                      entities.hasDependency ||
                                      /محافظه|محافظة|مدينه|مدينة/.test(q);
        
        if (hasGeographicContext) {
            return true;
        }
    }
    
    // محافظة + صناعية (بدون سياق نشاط)
    if (entities.hasGovernorate && q.includes('صناعي')) {
        if (!/(نشاط|مشروع|ترخيص).*صناعي/.test(q)) {
            return true;
        }
    }
    
    // جهة ولاية محددة (بدون سياق تراخيص)
    if (entities.hasDependency && !hasLicenseContext) {
        return true;
    }
    
    return false;
}

// ==================== ✅ فحص نوع السؤال - أنشطة (بدون إعادة حساب) ====================
function checkIfActivityQuestion(query, questionType, analysisContext, entities) {
    const q = normalizeArabic(query);
    
    // ⭐ استبعاد مباشر: أسئلة واضحة عن المناطق
    if (questionType.isCount && /منطقه|منطقة|مناطق/.test(q) && !/(نشاط|ترخيص)/.test(q)) {
        return false;  // ليس نشاط
    }
    
    if (questionType.isCount && /عدد.*منطقه|عدد.*مناطق/.test(q)) {
        return false;  // ليس نشاط
    }
    
    if (/المناطق.*التابعه|المناطق.*التابعة/.test(q)) {
        return false;  // ليس نشاط
    }
    
    // === المستوى 1: مؤشرات قوية جداً ===
    
    // أنماط واضحة للتراخيص مع أنواع أنشطة محددة
    const strongActivityPatterns = [
        /تراخيص.*فندق/,
        /تراخيص.*مطعم/,
        /تراخيص.*مصنع/,
        /تراخيص.*صيدلية/,
        /تراخيص.*مخزن/,
        /ترخيص.*فندق/,
        /ترخيص.*مطعم/,
        /ترخيص.*مصنع/,
        /(انشاء|إنشاء).*تشغيل.*فندق/,
        /(انشاء|إنشاء).*تشغيل.*مطعم/,
        /ترخيص.*مطلوب/,
        /تراخيص.*مطلوبه/,
        /ما.*التراخيص.*المطلوبه/,
        /كيف.*احصل.*ترخيص/,
        /متطلبات.*نشاط/,
        /شروط.*نشاط/,
        /اجراءات.*ترخيص/,
        /خطوات.*ترخيص/,
        /دليل.*الترخيص/,
        /سجل صناعي/,
        /رخصة تشغيل/,
        /الجهة المصدرة.*ترخيص/
    ];
    
    if (strongActivityPatterns.some(pattern => pattern.test(q))) {
        return true;
    }
    
    // جهة إصدار الترخيص
    if (questionType.isLicensingAuthority) {
        return true;
    }
    
    // سياق تراخيص قوي + نشاط
    if (questionType.hasLicenseContext && questionType.isActivity) {
        return true;
    }
    
    // الملاحظات الفنية (بدون سياق مناطق)
    if (questionType.isTechnical && !questionType.isIndustrial) {
        return true;
    }
    
    // القرار 104
    if (questionType.isDecision104) {
        return true;
    }
    
    // وجود نوع نشاط محدد بثقة عالية
    if (entities.hasActivityType && entities.activityTypes[0].confidence >= 70) {
        return true;
    }
    
    // === المستوى 2: استخدام السياق المحسوب ===
    
    // إذا كانت التوصية "أنشطة" بثقة عالية
    if (analysisContext.recommendation === 'activities' && analysisContext.confidence >= 60) {
        return true;
    }
    
    // === المستوى 3: الفحوصات المحسنة ===
    
    // كلمات تراخيص قوية (حتى مع وجود "صناعية")
    const hasStrongLicenseKeywords = /ترخيص|تراخيص|رخصه|رخصة|متطلبات|شروط|اجراءات|إجراءات/.test(q);
    
    if (hasStrongLicenseKeywords) {
        // استبعاد فقط إذا كان السؤال صراحة عن موقع منطقة
        const isExplicitlyAboutAreaLocation = 
            questionType.hasLocationContext && 
            /موقع.*منطقه|مكان.*منطقه|اين.*منطقه/.test(q);
        
        if (!isExplicitlyAboutAreaLocation) {
            return true;
        }
    }
    
    // أسئلة "كيف" عادة عن إجراءات
    if (/كيف|ازاي|طريقة/.test(q) && questionType.isActivity) {
        // ما لم يكن عن موقع منطقة
        if (!/(كيف|ازاي).*اروح|اوصل/.test(q)) {
            return true;
        }
    }
    
    // أسئلة "ما المطلوب" و "ما الشروط"
    if (/ما (المطلوب|الشروط|المتطلبات)/.test(q)) {
        return true;
    }
    
    // جهة + نشاط محدد (بدون "ولاية")
    if (questionType.isAuthority && entities.hasActivityType && !questionType.isGovernanceAuthority) {
        return true;
    }
    
    return false;
}


    // ==================== معالج الأسئلة السياقية ====================
    async function handleContextualQuery(query, questionType, context) {
        const q = normalizeArabic(query);

        if (context.type === 'industrial') {
            const area = context.data;
            
            if (questionType.isLocation || q.includes('خريطه') || q.includes('map') || q.includes('موقع')) {
                return formatIndustrialMapLink(area);
            }
            
            if (q.includes('قرار') || q.includes('انشاء') || questionType.isLaw) {
                return `📜 <strong>قرار إنشاء ${area.name}:</strong><br><br>${area.decision || 'غير متوفر'}`;
            }
            
            if (q.includes('ولايه') || q.includes('تبعيه') || q.includes('جهه') || questionType.isDependency) {
                return `🏛️ <strong>جهة الولاية:</strong> ${area.dependency}`;
            }
            
            if (q.includes('مساحه') || q.includes('فدان')) {
                return `📏 <strong>المساحة:</strong> ${area.area} فدان`;
            }
            
            // كود جديد: رد مفصل يمنع النظام من البحث عن كلمة "محافظة" كمنطقة
if (q.includes('محافظه') || q.includes('محافظة') || q.includes('مدينه') || q.includes('مدينة')) {
    return `<div class="info-card" style="border-right: 4px solid #0ea5e9; background: #f0f9ff;">
        <div class="info-card-header">📍 الموقع الإداري</div>
        <div class="info-card-content">
            منطقة <strong>${area.name}</strong> تقع إدارياً ضمن نطاق 
            <strong>محافظة ${area.governorate}</strong>.
        </div>
    </div>
    <div class="choice-btn" onclick="selectIndustrialArea('${area.name.replace(/'/g, "\\Source")}')">
        <span class="choice-icon">📋</span> عرض باقي تفاصيل المنطقة
    </div>`;
}
        }
        
        else if (context.type === 'activity') {
            const act = context.data;
            const details = act.details || {};
            
            if (questionType.isLicense || q.includes('ترخيص') || q.includes('رخص')) {
                return formatLicensesDetailed(act);
            }
            
            if (questionType.isAuthority || q.includes('جهه') || q.includes('وزاره') || q.includes('هيئه')) {
                return formatAuthority(details);
            }
            
            if (questionType.isLaw || q.includes('قانون') || q.includes('سند') || q.includes('تشريع')) {
                return formatLegislation(details);
            }
            
            if (questionType.isGuide || q.includes('دليل') || q.includes('جايد') || q.includes('رابط')) {
                return formatGuideInfo(details);
            }
            
            if (questionType.isTechnical || q.includes('ملاحظات') || q.includes('فنيه') || q.includes('لجنه')) {
                return formatTechnicalNotes(act);
            }
            
            if (questionType.isLocation || q.includes('موقع') || q.includes('مكان')) {
                return formatSuitableLocation(details);
            }
            
            if (questionType.isDecision104 || q.includes('104') || q.includes('حوافز')) {
                // 🆕 فحص محسّن: إذا كان السؤال عن القرار 104 بشكل عام
                if (/هل\s*(هو|هي|هوارد|هيوارد)?\s*(وارد|موجود|مدرج)\s*(بالقرار|في القرار|ب)?\s*104?/.test(q) || 
                    q === 'هل هو وارد بالقرار 104' ||
                    q === 'هل هوارد بالقرار 104' ||
                    q === 'هل هو وارد' ||
                    q === 'هل موجود' ||
                    q === 'وارد بالقرار 104') {
                    // 🔍 إعادة توجيه للبحث في القرار 104 باستخدام اسم النشاط من السياق
                    console.log("🎯 سؤال عن القرار 104 مع سياق نشاط - إعادة توجيه");
                    return handleDecision104Query(`هل ${act.text} وارد بالقرار 104`, detectQuestionType(query));
                }
                return checkDecision104Full(act.text);
            }
        }

        return null;
    }

    // ==================== دوال التنسيق ====================
    
    function formatIndustrialResponse(area) {
        const mapLink = (area.x && area.y && area.x !== 0 && area.y !== 0) 
            ? `https://www.google.com/maps?q=${area.y},${area.x}` 
            : null;

        return `
            <div class="info-card">
                <div class="info-card-header">
                    🏭 ${area.name}
                </div>
                <div class="info-card-content">
                    <div class="info-row">
                        <div class="info-label">📍 المحافظة:</div>
                        <div class="info-value">${area.governorate}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">🏛️ جهة الولاية:</div>
                        <div class="info-value">${area.dependency}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">📜 القرار:</div>
                        <div class="info-value">${area.decision || 'غير متوفر'}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">📏 المساحة:</div>
                        <div class="info-value">${area.area} فدان</div>
                    </div>
                </div>
                ${mapLink ? `<a href="${mapLink}" target="_blank" class="link-btn map-btn">
                    <i class="fas fa-map-marked-alt"></i> عرض على الخريطة
                </a>` : ''}
            </div>
            <div style="margin-top: 12px; padding: 10px; background: #f0f9ff; border-radius: 8px; font-size: 0.85rem; color: #0369a1;">
                💡 يمكنك سؤالي عن: القرار، جهة الولاية، المساحة، أو موقع الخريطة
            </div>
        `;
    }



    // ==================== تحديث دالة formatDependenciesCount ====================
function formatDependenciesCount(deps) {
    const totalAreas = industrialAreasData.length;
    
    let html = `<div class="info-card">
        <div class="info-card-header">🏛️ إحصائيات جهات الولاية للمناطق الصناعية</div>
        <div class="info-card-content">
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-number">${deps.length}</div>
                    <div class="stat-label">جهة ولاية مختلفة</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${totalAreas}</div>
                    <div class="stat-label">منطقة صناعية إجمالاً</div>
                </div>
            </div>
            
            <div style="margin: 16px 0; border-top: 1px solid #e0e0e0; padding-top: 16px;">
                <strong>التوزيع التفصيلي:</strong><br><br>`;
    
    // ترتيب الجهات حسب عدد المناطق (تنازلياً)
    const sortedDeps = deps.map(dep => ({
        name: dep,
        count: industrialAreasData.filter(a => a.dependency === dep).length
    })).sort((a, b) => b.count - a.count);
    
    sortedDeps.forEach((dep, i) => {
        html += `<div style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <span style="color: #666; font-size: 0.9em;">${i + 1}.</span>
                <strong style="margin-right: 10px;">${dep.name}</strong>
            </div>
            <span style="background: #10a37f; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 0.9em;">
                ${dep.count} منطقة
            </span>
        </div>`;
    });
    
    html += `</div></div></div>
    <div style="margin-top: 12px; padding: 10px; background: #f0f9ff; border-radius: 8px; font-size: 0.85rem; color: #0369a1;">
        💡 اختر جهة من القائمة أعلاه أو اسأل: "ما هي المناطق التابعة لـ [اسم الجهة]"
    </div>`;
    
    return html;
}

    function formatAreasListByDependency(dep, areas) {
    let html = `<div class="info-card">
        <div class="info-card-header">
            🏭 المناطق التابعة لـ: ${dep}
            <span style="background: #10a37f; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 10px;">
                ${areas.length} منطقة
            </span>
        </div>
        <div class="info-card-content">
            <div style="margin-bottom: 15px; color: #666; font-size: 0.9em;">
                💡 انقر على أي منطقة لعرض تفاصيلها الكاملة
            </div>
        </div>
    </div>
    <div class="area-list">`;
    
    areas.forEach((area, i) => {
        html += `<div class="area-item" onclick="selectIndustrialArea('${area.name.replace(/'/g, "\\'")}')">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="font-size: 1em;">${i + 1}. ${area.name}</strong><br>
                    <small style="color: #666;">📍 ${area.governorate} • 📏 ${area.area} فدان</small>
                </div>
                <span style="color: #10a37f; font-size: 1.2em;">→</span>
            </div>
        </div>`;
    });
    
    html += `</div>
    <div style="margin-top: 12px; padding: 10px; background: #f0f9ff; border-radius: 8px; font-size: 0.85rem; color: #0369a1;">
        💡 يمكنك أيضاً سؤالي عن: "قرار إنشاء" أو "موقع على الخريطة" لأي منطقة
    </div>`;
    
    return html;
}

    function formatIndustrialMapLink(area) {
        if (!area.x || !area.y || area.x === 0 || area.y === 0) {
            return `⚠️ <strong>إحداثيات الموقع غير متوفرة</strong><br><br>
                📍 المنطقة: ${area.name}<br>
                📍 المحافظة: ${area.governorate}<br><br>
                <em style="color: #666;">الإحداثيات لم يتم تحديدها في قاعدة البيانات</em>`;
        }
        
        const mapLink = `https://www.google.com/maps?q=${area.y},${area.x}`;
        
        return `<div class="info-card">
            <div class="info-card-header">🗺️ موقع ${area.name}</div>
            <div class="info-card-content">
                <div class="info-row">
                    <div class="info-label">📍 المحافظة:</div>
                    <div class="info-value">${area.governorate}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">🌐 خط الطول:</div>
                    <div class="info-value">${area.x}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">🌐 خط العرض:</div>
                    <div class="info-value">${area.y}</div>
                </div>
            </div>
        </div>
        <a href="${mapLink}" target="_blank" class="link-btn map-btn">
            <i class="fas fa-map-marked-alt"></i> فتح الموقع في خرائط جوجل
        </a>`;
    }

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
        
        // 🆕 إضافة الأزرار الذكية للبحث قبل النص الإرشادي
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
    }

    // ==================== الوظائف المساعدة ====================
    
   // ==================== تحديث دالة toggleGPTChat ====================
window.toggleGPTChat = function() {
    const container = document.getElementById('gptChatContainer');
    const floatBtn = document.getElementById('gptFloatBtn');
    
    if (!container || !floatBtn) return;
    
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'flex';
        // إخفاء زر العائم عند فتح النافذة
        floatBtn.style.display = 'none';
    } else {
        container.style.display = 'none';
        // إظهار زر العائم عند إغلاق النافذة
        floatBtn.style.display = 'flex';
    }
};

    window.autoResize = function(el) {
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 120) + 'px';
        // تحديث حالة زر الإجراء
        checkInputState();
    };

    window.handleEnter = function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
// دالة مسح الذاكرة مع التأكيد
window.clearMemoryWithConfirm = async function() {
    const context = AgentMemory.getContext();
    
    if (!context || context.type === 'clarification') {
        const container = document.getElementById('gptMessages');
        const notification = document.createElement('div');
        notification.style.cssText = 'background: #fff3e0; padding: 10px; border-radius: 8px; margin: 8px 0; text-align: center; color: #e65100;';
        notification.innerHTML = 'ℹ️ لا يوجد سياق محفوظ حالياً';
        container.appendChild(notification);
        container.scrollTop = container.scrollHeight;
        
        setTimeout(() => notification.remove(), 3000);
        return;
    }
    
    const contextName = context.type === 'industrial' ? context.data.name : context.data.text;
    const container = document.getElementById('gptMessages');
    
    const confirmBox = document.createElement('div');
    confirmBox.style.cssText = 'background: #fff3e0; padding: 16px; border-radius: 12px; margin: 8px 0; border: 2px solid #ff9800;';
    confirmBox.innerHTML = `
        <div style="text-align: center; margin-bottom: 12px;">
            <strong style="color: #e65100;">🗑️ هل تريد مسح السياق المحفوظ؟</strong><br>
            <small style="color: #bf360c;">السياق الحالي: ${contextName}</small>
        </div>
        <div style="display: flex; gap: 8px; justify-content: center;">
            <button onclick="confirmClearMemory()" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                ✓ نعم، امسح
            </button>
            <button onclick="cancelClearMemory()" style="background: #e0e0e0; color: #333; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                ✕ إلغاء
            </button>
        </div>
    `;
    confirmBox.id = 'memory-confirm-box';
    
    container.appendChild(confirmBox);
    container.scrollTop = container.scrollHeight;
};

window.confirmClearMemory = async function() {
    await AgentMemory.clear();
    
    const confirmBox = document.getElementById('memory-confirm-box');
    if (confirmBox) confirmBox.remove();
    
    const container = document.getElementById('gptMessages');
    const notification = document.createElement('div');
    notification.style.cssText = 'background: #e8f5e9; padding: 10px; border-radius: 8px; margin: 8px 0; text-align: center; color: #2e7d32;';
    notification.innerHTML = '✅ تم مسح الذاكرة بنجاح';
    container.appendChild(notification);
    container.scrollTop = container.scrollHeight;
    
    setTimeout(() => notification.remove(), 3000);
};

window.cancelClearMemory = function() {
    const confirmBox = document.getElementById('memory-confirm-box');
    if (confirmBox) confirmBox.remove();
};

window.sendMessage = async function(overrideQuery) {
    stopOngoingGeneration(); 
    const input = document.getElementById('gptInput');
    const query = overrideQuery || input.value.trim();
    if (!query) return;

    if (!overrideQuery) input.value = '';
    autoResize(input);
    checkInputState(); // تحديث حالة الزر

    // 1. إضافة رسالة المستخدم للواجهة
    addMessageToUI('user', query);

    // --- 🚀 التعديل الجديد: فحص نية الإغلاق قبل البدء بالبحث ---
    if (window.checkForGPTCloseIntent && window.checkForGPTCloseIntent(query)) {
        window.gptGracefulClose();
        return; // التوقف هنا وعدم الذهاب لمعالجة البحث
    }

    // 2. إظهار مؤشر الكتابة
    const typingId = showTypingIndicator();

    try {
        // 3. معالجة الاستعلام
        const responseHTML = await processUserQuery(query); 

        // 4. إخفاء مؤشر الكتابة
        removeTypingIndicator(typingId);

        // 5. إرسال النتيجة للطباعة
        if (responseHTML) {
            typeWriterResponse(responseHTML);
        }
    } catch (error) {
        console.error("❌ خطأ في معالجة الرسالة:", error);
        removeTypingIndicator(typingId);
        typeWriterResponse("عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.");
    }
};
    window.resolveAmbiguity = async function(type, index) {

    const context = AgentMemory.getContext();
    if (context && context.type === 'clarification') {
        const choice = context.data[index];
        if (choice) {
            // ✅ مسح الذاكرة القديمة أولاً
            AgentMemory.clear();
            
            if (type === 'industrial') {
                // معالجة المناطق
                await AgentMemory.setIndustrial(choice.data, choice.name);
                
                addMessageToUI('user', choice.name);
                
                const responseHTML = formatIndustrialResponse(choice.data);
                const typingId = showTypingIndicator();
                
                setTimeout(() => {
                    removeTypingIndicator(typingId);
                    typeWriterResponse(responseHTML);
                }, 600);
                
            } else if (type === 'activity') {
                // ✅ معالجة الأنشطة
                await AgentMemory.setActivity(choice.data, choice.name);
                
                addMessageToUI('user', choice.name);
                
                const responseHTML = formatActivityResponse(choice.data, detectQuestionType(choice.name));
                const typingId = showTypingIndicator();
                
                setTimeout(() => {
                    removeTypingIndicator(typingId);
                    typeWriterResponse(responseHTML);
                }, 600);
            }
        }
    }
};

    window.selectIndustrialArea = async function(areaName) {

    // 🔍 بحث مباشر بالاسم الكامل
    if (typeof industrialAreasData === 'undefined') {
        console.error("❌ قاعدة بيانات المناطق غير متوفرة");
        return;
    }
    
    const area = industrialAreasData.find(a => a.name === areaName);
    
    if (area) {
        console.log("✅ تم العثور على المنطقة:", area.name);
        
        // حفظ في الذاكرة
        await AgentMemory.setIndustrial(area, areaName);
        
        // عرض الرسالة
        addMessageToUI('user', areaName);
        
        // عرض التفاصيل مباشرة
        const responseHTML = formatIndustrialResponse(area);
        const typingId = showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator(typingId);
            typeWriterResponse(responseHTML);
        }, 600);
        
    } else {
        console.warn("⚠️ لم يتم العثور على تطابق تام - استخدام البحث الاحتياطي");
        const input = document.getElementById('gptInput');
        input.value = areaName;
        window.sendMessage();
    }
};

    // تحديث addMessageToUI لاستخدام typeWriterResponse مع الصوت
window.addMessageToUI = function(role, content) { // أضفنا window
    const chatMessagesContainer = document.getElementById('gptMessages');
    if (!chatMessagesContainer) return;
    
    if (role === 'user') {
        // رسالة المستخدم تظهر فوراً بدون تأثير كتابة
        const div = document.createElement('div');
        div.className = 'message-row user';
        div.innerHTML = `
            <div class="avatar user"><i class="fas fa-user"></i></div>
            <div class="message-bubble">${content}</div>
        `;
        chatMessagesContainer.appendChild(div);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        
        // إيقاف الصوت عند إرسال المستخدم
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    } else if (role === 'ai') {
        // رد المساعد يستخدم الكتابة المتدرجة مع الصوت
        typeWriterResponse(content, true);
    }
}

   // ====================  طارق بدايه💎 محرك الكتابة الاحترافي (Humanized & Fluid Engine) ====================

// ==================== 🚀 محرك الكتابة السريع (Turbo Humanized Engine) ====================

// متغير عام لتتبع جلسة الكتابة الحالية
window.activeTypingSession = null;

function stopOngoingGeneration() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (window.activeTypingSession) {
        window.activeTypingSession.isCancelled = true;
        if (window.activeTypingSession.animationId) {
            cancelAnimationFrame(window.activeTypingSession.animationId);
        }
        window.activeTypingSession = null;
    }
}

window.typeWriterResponse = function(htmlContent, shouldAutoSpeak = true) { // أضفنا window
    if (!htmlContent || typeof htmlContent !== 'string') return;
    
    const chatMessagesContainer = document.getElementById('gptMessages');
    if (!chatMessagesContainer) return;

    stopOngoingGeneration();

    chatMessagesContainer.style.scrollBehavior = 'auto'; 

    const msgRow = document.createElement('div');
    msgRow.className = 'message-row ai';
    msgRow.innerHTML = `<div class="avatar ai"><i class="fas fa-robot"></i></div><div class="message-bubble"></div>`;
    chatMessagesContainer.appendChild(msgRow);
    
    const bubble = msgRow.querySelector('.message-bubble');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const taskQueue = [];

    function traverseAndQueue(node, parentElement) {
        if (node.nodeType === 3) { 
            const text = node.nodeValue;
            if (!text) return;
            
            const secureTextNode = document.createTextNode('');
            taskQueue.push({ type: 'inject-node', node: secureTextNode, parent: parentElement });

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                // 🔥 تعديل 1: تقليل زمن التوقف عند علامات الترقيم للنصف
                let punctuationDelay = 0;
                if (char === '.' || char === '؟' || char === '!' || char === '\n') punctuationDelay = 5; // كان 150
                else if (char === '،' || char === ',') punctuationDelay = 0;  // كان 50
                
                taskQueue.push({ 
                    type: 'char', 
                    char: char, 
                    targetNode: secureTextNode,
                    extraDelay: punctuationDelay 
                });
            }
        } else if (node.nodeType === 1) { 
            const tagName = node.tagName.toLowerCase();
            const newEl = document.createElement(tagName);
            Array.from(node.attributes).forEach(attr => newEl.setAttribute(attr.name, attr.value));

            taskQueue.push({ 
                type: 'element', 
                element: newEl, 
                parent: parentElement,
                extraDelay: 5 // 🔥 تعديل 2: تسريع رسم العناصر (كان 50)
            });
            
            node.childNodes.forEach(child => traverseAndQueue(child, newEl));
        }
    }

    Array.from(tempDiv.childNodes).forEach(child => traverseAndQueue(child, bubble));

    const currentSession = { isCancelled: false, animationId: null };
    window.activeTypingSession = currentSession;

    let taskIndex = 0;
    let fullTextForSpeech = "";
    let isUserInteracting = false;
    let accumulatedDelay = 0;

    const interactionEvents = ['mousedown', 'wheel', 'touchstart'];
    const interactHandler = () => { isUserInteracting = true; };
    interactionEvents.forEach(evt => chatMessagesContainer.addEventListener(evt, interactHandler, { passive: true }));

    function renderFrame(timestamp) {
        if (currentSession.isCancelled) return;

        if (taskIndex >= taskQueue.length) {
            finishTyping();
            return;
        }

        const startTime = performance.now();
        
        if (accumulatedDelay > 0) {
            if (timestamp < accumulatedDelay) {
                currentSession.animationId = requestAnimationFrame(renderFrame);
                return;
            }
            accumulatedDelay = 0;
        }

        // 🔥 تعديل 3: مضاعفة عدد الأحرف المعالجة في الإطار الواحد
        // القاعدة الأساسية: 2 حرف في الإطار (بدلاً من 1)
        let charsToProcessLimit = 10; 
        const randomFactor = Math.random();
        
        // وضع الدفق السريع (Burst): 30 أحرف دفعة واحدة (بدلاً من 3)
        if (randomFactor > 0.7) charsToProcessLimit = 6; 
        // تقليل احتمالية التوقف للتفكير
        else if (randomFactor < 0.05) charsToProcessLimit = 0; 

        if (charsToProcessLimit === 0) {
             accumulatedDelay = timestamp + (Math.random() * 20 + 10); // تقليل وقت التفكير
             currentSession.animationId = requestAnimationFrame(renderFrame);
             return;
        }

        let processedCount = 0;

        while (taskIndex < taskQueue.length && processedCount < charsToProcessLimit) {
            if (currentSession.isCancelled) return;

            const task = taskQueue[taskIndex];
            
            if (task.type === 'element') {
                task.parent.appendChild(task.element);
                if (task.extraDelay) accumulatedDelay = timestamp + task.extraDelay;

            } else if (task.type === 'inject-node') {
                task.parent.appendChild(task.node);

            } else if (task.type === 'char') {
                task.targetNode.nodeValue += task.char;
                fullTextForSpeech += task.char;
                
                if (task.extraDelay > 0) {
                    accumulatedDelay = timestamp + task.extraDelay;
                    taskIndex++;
                    break;
                }
            }

            taskIndex++;
            processedCount++;

            if (!isUserInteracting) {
                const currentHeight = chatMessagesContainer.scrollHeight;
                const visibleHeight = chatMessagesContainer.clientHeight;
                if (currentHeight > visibleHeight + chatMessagesContainer.scrollTop) {
                    chatMessagesContainer.scrollTop = currentHeight;
                }
            }

            // زيادة المهلة المسموحة للإطار قليلاً لاستيعاب السرعة الزائدة
            if (performance.now() - startTime > 12) break;
            if (accumulatedDelay > 0) break;
        }

        currentSession.animationId = requestAnimationFrame(renderFrame);
    }

    function finishTyping() {
        if (currentSession.isCancelled) return;

        interactionEvents.forEach(evt => chatMessagesContainer.removeEventListener(evt, interactHandler));
        chatMessagesContainer.style.scrollBehavior = 'smooth';
        
        const buttons = bubble.querySelectorAll('.choice-btn, .smart-btn');
        buttons.forEach(btn => {
            btn.style.opacity = 1;
            btn.style.transform = 'translateY(0)';
        });

        // ابحث عن هذا الجزء في gpt_agent.js داخل دالة finishTyping
if (shouldAutoSpeak && typeof window.speakText === 'function' && fullTextForSpeech.trim().length > 0) {
    setTimeout(() => {
        if (!currentSession.isCancelled) {
            // إظهار زر السماعة قبل بدء النطق
            const voiceControls = document.getElementById('gptVoiceControls');
            if (voiceControls) {
                voiceControls.style.display = 'flex';
            }
            
            window.speakText(fullTextForSpeech);
            
            // إخفاء زر السماعة بعد انتهاء النطق
            if (window.speechSynthesis) {
                window.speechSynthesis.addEventListener('end', function hideSpeaker() {
                    if (voiceControls) {
                        voiceControls.style.display = 'none';
                    }
                    window.speechSynthesis.removeEventListener('end', hideSpeaker);
                });
            }
        }
    }, 200); 
}
        
        window.activeTypingSession = null;
    }

    currentSession.animationId = requestAnimationFrame(renderFrame);
}   



    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const container = document.getElementById('gptMessages');
        const div = document.createElement('div');
        div.className = 'message-row ai';
        div.id = id;
        div.innerHTML = `<div class="avatar ai"><i class="fas fa-robot"></i></div><div class="message-bubble"><div class="typing-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return id;
    }


/**
 * دالة مساعدة لتهيئة النصوص للاستخدام داخل كود JS في HTML
 * تقوم بإضافة Backslash قبل علامات التنصيص لتجنب الأخطاء
 */
function escapeForJS(text) {
    if (!text) return "";
    return text
        .replace(/\\/g, '\\\\')   // استبدال \ بـ \\
        .replace(/'/g, "\\'")     // استبدال ' بـ \'
        .replace(/"/g, '&quot;')  // استبدال " بـ &quot;
        .replace(/\n/g, ' ');     // إزالة الأسطر الجديدة
}
// ==================== 🆕 دوال الأزرار الذكية للبحث - النسخة المُصلحة ====================

/**
 * عرض الأزرار الذكية للبحث عن النشاط في القرار 104
 * النسخة المُصلحة - تحل مشكلة ظهور النص خارج الأزرار
 * @param {string} activityName - اسم النشاط المحدد
 * @returns {string} HTML الأزرار
 */
function showSmartSearchButtons(activityName) {
    const escapedActivity = escapeForJS(activityName);
    
    // كتابة HTML بطريقة مضغوطة لتجنب مشاكل التنسيق
    return '<div class="smart-search-container">' +
        '<div class="smart-search-header">' +
            '<i class="fas fa-search"></i>' +
            '<span>للبحث فى قرار مجلس الوزراء رقم  104</span>' +
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

// ═══════════════════════════════════════════════════════════════
// FIX #2: إصلاح أزرار الحوافز - Direct Incentive Display
// ═══════════════════════════════════════════════════════════════

/**
 * عرض الحوافز مباشرة - النسخة النهائية المصححة (Fix 'bot' to 'ai')
 */
function smartSearchFixed(activityName, searchType) {
    console.log(`🎯 [Smart Search] النشاط: "${activityName}" - النوع: ${searchType}`);
    
    // الحصول على السياق الحالي
    const context = AgentMemory.getContext();
    let currentActivity = activityName;
    
    // محاولة استرجاع اسم النشاط الكامل من السياق
    if (context && (context.type === 'activity' || context.type === 'decision_activity')) {
        currentActivity = context.data.text || context.data.name || activityName;
    }
    
    // البحث في القرار 104 حسب النوع
    let results = [];
    let sector = null;
    
    switch(searchType) {
    case 'comprehensive':
    // بحث شامل محسّن في كلا القطاعين
    results = enhancedSearchInDecision104(currentActivity, null);
    break;
            
       case 'sectorA':
    // بحث محسّن في القطاع أ فقط
    results = enhancedSearchInDecision104(currentActivity, 'A');
    sector = 'A';
    break;
    
case 'sectorB':
    // بحث محسّن في القطاع ب فقط
    results = enhancedSearchInDecision104(currentActivity, 'B');
    sector = 'B';
    break;
    }
    
    // تصفية النتائج حسب القطاع إذا كان محدد
    if (sector) {
        results = results.filter(r => r.sector === sector || r.item.sector === sector);
    }
    
    // حذف التكرار
    results = deduplicateResults(results);
    
    console.log(`📊 [Smart Search] عدد النتائج: ${results.length}`);
    
    // عرض النتائج مباشرة
    let responseHTML = '';
    
    if (!results || results.length === 0) {
        // لم يتم العثور على النشاط
        responseHTML = formatActivityNotFoundInDecision104(currentActivity, sector);
    } else if (results.length === 1) {
        // نتيجة واحدة → عرض التفاصيل والحوافز مباشرة
        const result = results[0];
        const itemData = result.item || result;
        
        responseHTML = formatSingleActivityInDecision104WithIncentives(
            currentActivity,
            itemData,
            sector || 'both'
        );
        
        // حفظ في الذاكرة
        AgentMemory.setDecisionActivity(itemData, currentActivity);
        
    } else {
    // عدة نتائج → عرض قائمة محسّنة للاختيار
    responseHTML = formatEnhancedMultipleResults(
        currentActivity,
        results,
        sector || 'both'
    );
}
    
    // عرض النتيجة في الواجهة
    // ✅ التصحيح هنا: تغيير 'bot' إلى 'ai' ليطابق دالة العرض لديك
    addMessageToUI('ai', responseHTML);
}


/**
 * تنسيق عرض نشاط واحد مع الحوافز (نسخة جديدة)
 */
function formatSingleActivityInDecision104WithIncentives(activityName, itemData, searchScope) {
    const sector = itemData.sector;
    const sectorName = sector === 'A' ? 'القطاع أ' : 'القطاع ب';
    const sectorColor = sector === 'A' ? '#4caf50' : '#2196f3';
    
    let html = `
    <div class="info-card" style="background: linear-gradient(135deg, ${sector === 'A' ? '#e8f5e9' : '#e3f2fd'}, white); border-left: 4px solid ${sectorColor};">
        <div class="info-card-header" style="color: ${sector === 'A' ? '#2e7d32' : '#1565c0'};">
            ✅ النشاط "${activityName}" موجود في القرار 104
        </div>
        <div class="info-card-content">
            <div class="info-row">
                <div class="info-label">📋 النشاط:</div>
                <div class="info-value"><strong>${itemData.activity}</strong></div>
            </div>
            <div class="info-row">
                <div class="info-label">📊 القطاع:</div>
                <div class="info-value">
                    <span style="background: ${sectorColor}20; color: ${sectorColor}; padding: 4px 12px; border-radius: 12px; font-weight: bold;">
                        ${sectorName}
                    </span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-label">🏢 القطاع الرئيسي:</div>
                <div class="info-value">${itemData.mainSector}</div>
            </div>
            <div class="info-row">
                <div class="info-label">📂 القطاع الفرعي:</div>
                <div class="info-value">${itemData.subSector}</div>
            </div>
        </div>
    </div>
    `;
    
    // عرض الحوافز مباشرة
    html += formatSectorIncentivesEnhanced(sector, itemData);
    
    // إضافة ملاحظات خاصة إذا كان القطاع أ
    if (sector === 'A') {
        html += `
        <div style="background: #fff3e0; padding: 14px; border-radius: 10px; border: 1px solid #ffe0b2; margin-top: 16px;">
            <div style="color: #e65100; font-weight: 600; margin-bottom: 8px;">
                <i class="fas fa-map-marker-alt"></i> 📍 المناطق المسموحة للقطاع أ
            </div>
            <div style="color: #bf360c; line-height: 1.6; font-size: 0.9em;">
                يجب ممارسة هذا النشاط في المناطق المحددة فقط .
                <br>
                <button onclick="sendMessage('ما هي المناطق المحددة للقطاع أ')" class="choice-btn" style="margin-top: 8px; font-size: 0.85em;">
                    🗺️ عرض المناطق المحددة بالتفصيل
                </button>
            </div>
        </div>
        `;
    }
    
    return html;
}

/**
 * تنسيق حوافز القطاع - نسخة محسّنة
 */
function formatSectorIncentivesEnhanced(sector, itemData) {
    const sectorName = sector === 'A' ? 'القطاع أ' : 'القطاع ب';
    const sectorColor = sector === 'A' ? '#4caf50' : '#2196f3';
    
    let incentives = '';
    
    if (sector === 'A') {
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
<!-- زر تحميل ملف الحوافز الجديد -->
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
/**
 * تنسيق رسالة عدم العثور على النشاط - النسخة الاحترافية الشاملة
 * تشمل: القوائم الكاملة، الأنشطة الرئيسية، وشروط/مواقع القطاعات
 */
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

// ==================== 🆕 دوال تنسيق القرار 104 المفقودة ====================

/**
 * دالة عرض المناطق الجغرافية للقطاع أ بالتفصيل
 * (تحل مشكلة ReferenceError: formatSectorARegionsDetailed is not defined)
 */
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


/**
 * دالة عرض المناطق الجغرافية للقطاع ب
 */
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

/**
 * دالة عرض حوافز القطاع (تربط مع الدالة المحسنة الموجودة سابقاً)
 */
function formatSectorIncentives(sector) {
    // نستخدم دالة وهمية للحصول على التنسيق، حيث أن formatSectorIncentivesEnhanced يتطلب itemData
    // لكننا هنا نريد عرض الحوافز العامة فقط
    return formatSectorIncentivesEnhanced(sector, { activity: 'عرض عام' });
}

/**
 * دالة عرض قائمة الأنشطة لقطاع معين
 */
function formatSectorActivities(sector) {
    const sectorName = sector === 'A' ? 'القطاع أ' : 'القطاع ب';
    const sectorColor = sector === 'A' ? '#4caf50' : '#2196f3';
    
    // محاولة جلب البيانات
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
// ==================== 🆕 نهاية دوال الأزرار الذكية ====================
// ==================== 🆕 دوال الأزرار الذكية للبحث - نهاية ====================

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

// ==================== 🆕 دوال عرض الشروط الخاصة والعامة للقطاع ب ====================

/**
 * دالة فحص ما إذا كان يجب عرض الشروط العامة للقطاع ب
 * @param {string} mainSector - اسم القطاع الرئيسي
 * @returns {boolean}
 */
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

/**
 * دالة تنسيق عرض الشروط الخاصة بنشاط النقل الجماعي (المدن الجديدة) في القطاع ب
 * @returns {string} HTML
 */
function formatTransportSpecialConditions() {
    // جلب البيانات من decision104.js (ستجلب الضوابط الـ 8 الجديدة)
    const conditions = window.decision104?.transportSpecialConditions;
    
    if (!conditions) {
        return ''; // إذا لم تكن البيانات متوفرة، لا نعرض شيئاً
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
    
    // إضافة الشروط الخاصة (الـ 8 ضوابط التي حددتها)
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

window.toggleExpandChat = function() {
    const container = document.getElementById('gptChatContainer');
    const expandBtn = document.getElementById('gptExpandBtn');
    const icon = expandBtn.querySelector('i');
    
    // تبديل فئة التوسيع
    container.classList.toggle('expanded');
    
    // تغيير الأيقونة بناءً على الحالة
    if (container.classList.contains('expanded')) {
        icon.classList.replace('fa-expand-alt', 'fa-compress-alt');
        expandBtn.title = "تصغير النافذة";
    } else {
        icon.classList.replace('fa-compress-alt', 'fa-expand-alt');
        expandBtn.title = "توسيع النافذة";
    }
    
    // تركيز تلقائي على حقل الإدخال بعد التوسيع
    setTimeout(() => {
        document.getElementById('gptInput').focus();
    }, 400);
};

// ==================== 🆕 دوال التحكم بالزر الذكي (مايك/إرسال) ====================

/**
 * التحقق من حالة حقل الإدخال وتحديث الزر
 */
window.checkInputState = function() {
    const input = document.getElementById('gptInput');
    const actionBtn = document.getElementById('gptActionBtn');
    const actionIcon = document.getElementById('actionIcon');
    
    if (!input || !actionBtn || !actionIcon) return;
    
    const hasText = input.value.trim().length > 0;
    
    if (hasText) {
        // تغيير إلى زر الإرسال
        actionBtn.title = "إرسال الرسالة";
        actionBtn.classList.remove('mic-mode');
        actionBtn.classList.add('send-mode');
        actionIcon.classList.replace('fa-microphone', 'fa-paper-plane');
    } else {
        // تغيير إلى زر المايك
        actionBtn.title = "التحدث بالصوت";
        actionBtn.classList.remove('send-mode');
        actionBtn.classList.add('mic-mode');
        actionIcon.classList.replace('fa-paper-plane', 'fa-microphone');
    }
};

/**
 * معالجة نقر الزر الذكي
 */
window.handleActionButtonClick = function() {
    const input = document.getElementById('gptInput');
    const hasText = input.value.trim().length > 0;
    
    if (hasText) {
        // إذا كان هناك نص → إرسال
        sendMessage();
    } else {
        // إذا كان فارغاً → تشغيل المايك
        if (window.GPT_VOICE && window.GPT_VOICE.toggleMicrophone) {
            window.GPT_VOICE.toggleMicrophone();
        }
    }
};

// دالة تبديل نطق الردود
// دالة تبديل نطق الردود
window.toggleSpeech = function() {
    // التأكد من وجود كائن الصوت
    if (!window.GPT_VOICE) return;

    window.GPT_VOICE.speechEnabled = !window.GPT_VOICE.speechEnabled;
    const speakerBtn = document.getElementById('gptSpeakerBtn');
    const voiceControls = document.getElementById('gptVoiceControls');
    
    if (window.GPT_VOICE.speechEnabled) {
        if (speakerBtn) {
            speakerBtn.classList.remove('muted');
            speakerBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            speakerBtn.title = "كتم الصوت";
        }
        // إظهار زر السماعة عند تفعيل الصوت
        if (voiceControls) {
            voiceControls.style.display = 'flex';
        }
        // نطق آخر رسالة موجودة إذا تم تفعيل الصوت
        const lastMsg = document.querySelector('.message-row.ai:last-child .message-bubble');
        if (lastMsg && window.speakText) {
            window.speakText(lastMsg.textContent);
            // إخفاء زر السماعة بعد انتهاء النطق
            if (window.speechSynthesis) {
                window.speechSynthesis.addEventListener('end', function hideSpeaker() {
                    if (voiceControls) {
                        voiceControls.style.display = 'none';
                    }
                    window.speechSynthesis.removeEventListener('end', hideSpeaker);
                });
            }
        }
    } else {
        if (speakerBtn) {
            speakerBtn.classList.add('muted');
            speakerBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            speakerBtn.title = "تشغيل الصوت";
        }
        // إخفاء زر السماعة عند كتم الصوت
        if (voiceControls) {
            voiceControls.style.display = 'none';
        }
        // إيقاف أي صوت جاري فوراً
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
};


// 1. قائمة كلمات الإغلاق
window.GPT_AGENT.closeKeywords = ['شكرا', 'شكراً', 'باي', 'مع السلامة', 'إغلاق', 'كفاية', 'خلاص', 'انتهيت', 'سلام'];

// 2. دالة فحص نية الإغلاق
window.checkForGPTCloseIntent = function(text) {
    const q = normalizeArabic(text);
    return window.GPT_AGENT.closeKeywords.some(k => q.includes(k));
};

// 3. دالة تنفيذ الإغلاق اللطيف
window.gptGracefulClose = function() {
    const msgs = ['تشرفنا بخدمتك، في أمان الله.', 'سعدت بمساعدتك، مع السلامة.', 'العفو، أنا في الخدمة دائماً.'];
    const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
    
    const typingId = showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator(typingId);
        typeWriterResponse(randomMsg, true); 
        
        setTimeout(() => {
            if (document.getElementById('gptChatContainer').style.display !== 'none') {
                toggleGPTChat(); 
            }
        }, 4000);
    }, 500);
};

// 4. الدالة المفقودة: دالة الإشعارات
// gpt_agent.js - تحديث دالة الإشعارات الجمالية
window.showGPTNotification = function(msg, type = 'success') {
    const container = document.getElementById('gptMessages');
    if (!container) return;

    const div = document.createElement('div');
    // تنسيق جمالي يشبه "الكبسولة" يظهر في منتصف الدردشة
    div.style.cssText = `
        align-self: center;
        background: ${type === 'success' ? '#e8f5e9' : '#fff3e0'};
        color: ${type === 'success' ? '#2e7d32' : '#e65100'};
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 0.8rem;
        margin: 10px 0;
        border: 1px solid ${type === 'success' ? '#a5d6a7' : '#ffcc80'};
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        animation: fadeIn 0.5s ease;
        text-align: center;
        width: fit-content;
        z-index: 10;
    `;
    div.innerHTML = `✨ ${msg}`;
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    
    // يختفي بعد 4 ثوانٍ بهدوء
    setTimeout(() => {
        div.style.transition = 'opacity 1s';
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 1000);
    }, 4000);
};

// ==========================================
// ربط الدوال بالنطاق العالمي (Global Scope)
// لضمان عمل أزرار الـ HTML بعد تحويل الملف لـ Module
// ==========================================

window.sendMessage = sendMessage;
window.processUserQuery = processUserQuery;
window.toggleGPTChat = toggleGPTChat;
window.resolveAmbiguity = resolveAmbiguity;
window.selectIndustrialArea = selectIndustrialArea;
window.clearMemoryWithConfirm = clearMemoryWithConfirm;
window.confirmClearMemory = confirmClearMemory;
window.cancelClearMemory = cancelClearMemory;
window.toggleSpeech = window.toggleSpeech || toggleSpeech;
window.toggleExpandChat = toggleExpandChat;
window.handleActionButtonClick = handleActionButtonClick;
window.autoResize = autoResize;
window.handleEnter = handleEnter;
window.AgentMemory = AgentMemory;
window.checkDecision104Full = window.checkDecision104Full;
window.formatSingleActivityInDecision104WithIncentives = formatSingleActivityInDecision104WithIncentives;
window.formatSectorIncentivesEnhanced = formatSectorIncentivesEnhanced;
window.formatActivityNotFoundInDecision104 = formatActivityNotFoundInDecision104;    
    

// ==================== 🆕 تصدير دوال الأزرار الذكية ====================
window.gptAgent = window.gptAgent || {};
window.gptAgent.showSmartSearchButtons = showSmartSearchButtons;
window.gptAgent.smartSearch = smartSearchFixed;
    

// تهيئة حالة الزر عند تحميل الصفحة
window.addEventListener('load', function() {
    setTimeout(checkInputState, 100);
});

console.log('✅ GPT Agent v9.0 - Core initialized!');

    console.log('✅ GPT Agent v9.0 - Ultimate Precision Edition initialized successfully!');
    console.log('🎯 Features: Advanced NLP • 100% Data Extraction • Decision 104 Integration • Smart Memory');
    console.log('🆕 Smart Action Button: ENABLED ✨');
    console.log('🆕 Mobile Optimized: ENABLED 📱');
    console.log('🆕 Fullscreen Expand: ENABLED 🖥️');
}















