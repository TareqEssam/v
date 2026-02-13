// js/agent_memory.js
(function() {
    window.AgentMemory = {
        storageKey: 'agent-memory',
        lastActivity: null,
        lastIndustrial: null,
        previousContext: null,
        lastQuery: null,
        pendingClarification: null,
        conversationContext: [],

        load: function() {
            try {
                const dataStr = localStorage.getItem(this.storageKey);
                if (dataStr) {
                    const data = JSON.parse(dataStr);
                    // دمج البيانات المسترجعة مع الكائن الحالي
                    Object.assign(this, data);
                    console.log("🧠 الذاكرة السياقية: تم استعادة الجلسة بنجاح.");
                }
            } catch (error) {
                console.warn('📝 بدء جلسة ذاكرة جديدة.');
            }
        },

        save: function() {
            try {
                const data = {
                    lastActivity: this.lastActivity,
                    lastIndustrial: this.lastIndustrial,
                    previousContext: this.previousContext,
                    lastQuery: this.lastQuery,
                    pendingClarification: this.pendingClarification,
                    conversationContext: this.conversationContext
                };
                localStorage.setItem(this.storageKey, JSON.stringify(data));
            } catch (error) {
                console.error('⚠️ فشل حفظ الذاكرة:', error);
            }
        },

        getContext: function() {
            if (this.pendingClarification) return { type: 'clarification', data: this.pendingClarification };
            if (this.lastIndustrial) return { type: 'industrial', data: this.lastIndustrial };
            if (this.lastActivity) return { type: 'activity', data: this.lastActivity };
            return null;
        },

        setActivity: function(data, query) {
            this.lastActivity = data;
            this.lastQuery = query;
            this.save();
        },

        setIndustrial: function(data, query) {
            this.lastIndustrial = data;
            this.lastQuery = query;
            this.save();
        },

        clear: function() {
            this.lastActivity = null;
            this.lastIndustrial = null;
            this.pendingClarification = null;
            this.save();
            console.log("🧹 تم مسح الذاكرة.");
        }
    };

    // تنفيذ التحميل فوراً عند قراءة الملف
    window.AgentMemory.load();
})();
