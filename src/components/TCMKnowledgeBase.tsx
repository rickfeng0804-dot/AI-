import React, { useState } from 'react';
import { HERBS_DB, FORMULAS_DB, MERIDIANS_DB } from '../data';
import { Herb, Formula, Meridian, Acupoint } from '../types';
import { Search, Sparkles, BookOpen, AlertTriangle, RefreshCw, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TCMKnowledgeBase() {
  const [activeTab, setActiveTab] = useState<'herbs' | 'formulas' | 'meridians'>('herbs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(HERBS_DB[0]);

  // AI custom prompt search
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiResult(null);

    try {
      const response = await fetch('/api/knowledge/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery, type: activeTab })
      });
      const data = await response.json();
      if (data.result) {
        setAiResult(data.result);
      } else {
        setAiResult('抱歉，伺服器連線異常，未能取得 AI 詳細回答。');
      }
    } catch (err) {
      console.error(err);
      setAiResult('連線失敗，請檢查網際網路或稍後再試。');
    } finally {
      setAiLoading(false);
    }
  };

  // Filter items based on activeTab and searchTerm
  const getFilteredItems = () => {
    const term = searchTerm.toLowerCase().trim();
    if (activeTab === 'herbs') {
      return HERBS_DB.filter(
        h => h.name.includes(term) || h.pinyin.toLowerCase().includes(term) || h.effects.some(e => e.includes(term))
      );
    } else if (activeTab === 'formulas') {
      return FORMULAS_DB.filter(
        f => f.name.includes(term) || f.pinyin.toLowerCase().includes(term) || f.effects.some(e => e.includes(term))
      );
    } else {
      return MERIDIANS_DB.filter(
        m => m.name.includes(term) || m.english.toLowerCase().includes(term) || m.acupoints.some(a => a.name.includes(term))
      );
    }
  };

  const filteredItems = getFilteredItems();

  const handleTabChange = (tab: 'herbs' | 'formulas' | 'meridians') => {
    setActiveTab(tab);
    setSearchTerm('');
    // Automatically select the first item of the new list
    if (tab === 'herbs') setSelectedItem(HERBS_DB[0]);
    else if (tab === 'formulas') setSelectedItem(FORMULAS_DB[0]);
    else setSelectedItem(MERIDIANS_DB[0]);
  };

  return (
    <div className="space-y-8" id="tcm-knowledge-view">
      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80">
        <h2 className="text-2xl font-semibold text-stone-900 flex items-center gap-2 font-serif">
          <BookOpen className="w-6 h-6 text-emerald-700 font-sans" />
          中醫藥與經絡大百科
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          檢索常見中藥材的性味功效、解析歷代名方「君臣佐使」精妙配伍、探秘全身經絡俞穴調蓄。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column - item search and listing */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl">
            {(['herbs', 'formulas', 'meridians'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-white text-emerald-950 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab === 'herbs' && '中藥材'}
                {tab === 'formulas' && '經典方劑'}
                {tab === 'meridians' && '經絡穴位'}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder={`搜尋${activeTab === 'herbs' ? '中藥、功效' : activeTab === 'formulas' ? '方劑名稱、出處' : '經絡或穴位'}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 focus:bg-stone-50/20"
            />
          </div>

          <div className="bg-white border border-stone-100 rounded-2xl shadow-sm h-80 overflow-y-auto divide-y divide-stone-50 select-none">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => {
                const isSelected = selectedItem && selectedItem.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3.5 cursor-pointer flex justify-between items-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-50 to-stone-50/30 text-emerald-950 font-semibold border-l-4 border-emerald-600'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-serif">{item.name}</div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                        {item.pinyin || item.english}
                      </div>
                    </div>
                    {activeTab === 'herbs' && (
                      <span className="text-[10px] border border-stone-200/60 px-1.5 py-0.5 rounded-full text-stone-500 bg-stone-50">
                        {item.channels?.[0]}經
                      </span>
                    )}
                    {activeTab === 'formulas' && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
                        {item.source}
                      </span>
                    )}
                    {activeTab === 'meridians' && (
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-full font-mono">
                        {item.timeHour?.split(' ')?.[0]}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-stone-400 text-sm">沒有找到相關條目。</div>
            )}
          </div>
        </div>

        {/* Right column - details profile display */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-6"
              >
                {/* Header section of detailed card */}
                <div className="pb-4 border-b border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
                      {selectedItem.name}
                      <span className="text-xs font-mono font-normal text-stone-400 mt-1">
                        [{selectedItem.pinyin || selectedItem.english}]
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {activeTab === 'herbs' && '單味中藥材百科'}
                      {activeTab === 'formulas' && `歷代經典方劑紀錄 - ${selectedItem.source}`}
                      {activeTab === 'meridians' && `十二經絡循行運行與穴點`}
                    </p>
                  </div>
                </div>

                {/* Specific layouts based on class of activeTab */}
                {activeTab === 'herbs' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-stone-50 rounded-xl">
                        <span className="text-xs text-stone-400 block font-medium">藥理性味</span>
                        <span className="text-sm text-stone-800 font-serif mt-1 block">
                          {(selectedItem as Herb).properties}
                        </span>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-xl">
                        <span className="text-xs text-stone-400 block font-medium">歸經</span>
                        <span className="text-sm text-stone-800 font-serif mt-1 block">
                          {(selectedItem as Herb).channels?.map(c => `${c}經`).join('、')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-stone-400 block font-medium">功用效益</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {(selectedItem as Herb).effects?.map((eff, index) => (
                          <span
                            key={index}
                            className="bg-emerald-50 text-emerald-950 text-xs px-2.5 py-1 rounded-full font-medium"
                          >
                            {eff}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-stone-400 block font-medium">臨床主治</span>
                      <p className="text-sm text-stone-700 mt-1 leading-relaxed">
                        {(selectedItem as Herb).indications}
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 flex gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-xs text-amber-800 font-bold block">配伍與使用禁忌</span>
                        <p className="text-xs text-amber-950 mt-1 leading-relaxed">
                          {(selectedItem as Herb).contraindications}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-stone-400 block font-medium">醫典評述</span>
                      <p className="text-xs text-stone-500 italic mt-1 leading-relaxed">
                        {(selectedItem as Herb).description}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'formulas' && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs text-stone-400 block font-medium">主要功用</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(selectedItem as Formula).effects?.map((eff, idx) => (
                          <span
                            key={idx}
                            className="bg-emerald-50 text-emerald-900 border border-emerald-100/60 text-xs px-2.5 py-1 rounded-full font-serif font-semibold"
                          >
                            {eff}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-stone-400 block font-medium">主治精要</span>
                      <p className="text-sm text-stone-700 mt-1 leading-relaxed">
                        {(selectedItem as Formula).indications}
                      </p>
                    </div>

                    {/* Formula components 君臣佐使 visual list */}
                    <div>
                      <span className="text-xs text-stone-400 block font-medium">君臣佐使配伍組方</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {(selectedItem as Formula).components?.map((comp, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-stone-50 rounded-xl border border-stone-100/60 flex items-start gap-2.5"
                          >
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                                comp.role === '君'
                                  ? 'bg-rose-100 text-rose-800'
                                  : comp.role === '臣'
                                    ? 'bg-orange-100 text-orange-850'
                                    : comp.role === '佐'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-stone-200 text-stone-800'
                              }`}
                            >
                              {comp.role}藥
                            </span>
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-stone-800 font-serif">
                                {comp.herbName} ({comp.dosage})
                              </div>
                              <div className="text-[11px] text-stone-500 leading-relaxed">
                                {comp.purpose}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50/35 rounded-xl border border-emerald-100/50">
                      <span className="text-xs text-emerald-850 font-bold block">組方邏輯剖析</span>
                      <p className="text-xs text-emerald-950 mt-1.5 leading-relaxed font-serif">
                        {(selectedItem as Formula).logic}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'meridians' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-stone-50 rounded-xl">
                        <span className="text-xs text-stone-400 block font-medium">主令值守時辰</span>
                        <span className="text-sm text-stone-800 font-serif mt-1 block">
                          {(selectedItem as Meridian).timeHour}
                        </span>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-xl">
                        <span className="text-xs text-stone-400 block font-medium">經穴總體保養建議</span>
                        <span className="text-xs text-stone-600 mt-1 block font-medium">
                          {(selectedItem as Meridian).selfCareTip}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-stone-400 block font-medium">經脈走行通道與起點</span>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {(selectedItem as Meridian).meridianFlow}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-stone-400 block font-medium mb-2.5">
                        重要經穴定位與日常揉按指引
                      </span>
                      <div className="space-y-4">
                        {(selectedItem as Meridian).acupoints?.map((pt: Acupoint) => (
                          <div
                            key={pt.name}
                            className="p-4 bg-stone-50/50 rounded-2xl border border-stone-100 flex flex-col md:flex-row md:items-start gap-4"
                          >
                            <div className="md:w-1/3 space-y-1 shrink-0">
                              <h5 className="font-serif font-bold text-emerald-950 text-base">
                                {pt.name} ({pt.pinyin})
                              </h5>
                              <div className="text-[10px] text-gray-400 font-mono">
                                Anatomical Pinpoint
                              </div>
                              <p className="text-xs text-emerald-800 bg-emerald-50/30 p-2 rounded mt-2 font-medium">
                                <strong>尋取祕訣：</strong>
                                {pt.illustrationTip}
                              </p>
                            </div>
                            <div className="md:w-2/3 space-y-2">
                              <p className="text-xs text-gray-600">
                                <strong className="text-stone-800 font-serif">骨學定位：</strong>
                                {pt.location}
                              </p>
                              <p className="text-xs text-gray-650">
                                <strong className="text-stone-850 font-serif">主治功效：</strong>
                                {pt.indications.join('、')}
                              </p>
                              <p className="text-xs text-stone-800 bg-white/80 border border-stone-100 p-2 rounded leading-relaxed">
                                <strong className="text-emerald-800 font-serif block text-[11px] mb-1">
                                  日常保健點按：
                                </strong>
                                {pt.method}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Ask AI Search Grounding Card at bottom */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 to-stone-900 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                <h4 className="text-base font-bold font-serif">智能中醫 AI 百科大師櫃檯</h4>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed max-w-xl">
                離線庫只包含經典示例，若您對其他中藥材、奇經八脈或配伍成方有疑惑（例如：「山楂與陳皮泡茶功效」、「足三里的日常揉法」），請在下方提出！
              </p>
              <form onSubmit={handleAskAI} className="flex gap-2">
                <input
                  type="text"
                  placeholder="輸入任何中醫藥疑問，由 AI 中醫大師在線為您解析..."
                  value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white/10 rounded-xl text-sm text-white placeholder-stone-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/15"
                />
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  id="ask-ai-knowledge-btn"
                >
                  {aiLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      詢問
                    </>
                  )}
                </button>
              </form>

              {/* Display AI Knowledge Result */}
              {aiResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-stone-800/80 border border-stone-700 rounded-xl space-y-2 max-h-80 overflow-y-auto"
                >
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI 醫理解析結果：
                  </div>
                  <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-wrap font-serif">
                    {aiResult}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
