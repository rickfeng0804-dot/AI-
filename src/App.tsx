import React, { useState, useEffect } from 'react';
import TCMInquiry from './components/TCMInquiry';
import TCMConstitution from './components/TCMConstitution';
import TCMMultimodal from './components/TCMMultimodal';
import TCMSolarTerms from './components/TCMSolarTerms';
import TCMKnowledgeBase from './components/TCMKnowledgeBase';
import { BookOpen, Award, Camera, Heart, Clock, FileText, ChevronRight, Sun, Sparkles, Home, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AppTab = 'home' | 'inquiry' | 'constitution' | 'multimodal' | 'solar' | 'knowledge';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick helper to determine active Meridian time-slot
  const getQuickCurrentMeridian = () => {
    const hr = currentTime.getHours();
    if (hr >= 23 || hr < 1) return { name: '膽經 | 宜熟睡', link: 'solar' };
    if (hr >= 1 && hr < 3) return { name: '肝經 | 宜沉睡', link: 'solar' };
    if (hr >= 3 && hr < 5) return { name: '肺經 | 宜深眠', link: 'solar' };
    if (hr >= 5 && hr < 7) return { name: '大腸經 | 宜排便', link: 'solar' };
    if (hr >= 7 && hr < 9) return { name: '胃經 | 宜溫熱早餐', link: 'solar' };
    if (hr >= 9 && hr < 11) return { name: '脾經 | 宜高效工作', link: 'solar' };
    if (hr >= 11 && hr < 13) return { name: '心經 | 宜小憩半刻', link: 'solar' };
    if (hr >= 13 && hr < 15) return { name: '小腸經 | 宜多飲水', link: 'solar' };
    if (hr >= 15 && hr < 17) return { name: '膀胱經 | 宜活動代謝', link: 'solar' };
    if (hr >= 17 && hr < 19) return { name: '腎經 | 宜散步晚食', link: 'solar' };
    if (hr >= 19 && hr < 21) return { name: '心包經 | 宜放鬆靜坐', link: 'solar' };
    return { name: '三焦經 | 宜定神入睡', link: 'solar' };
  };

  const currentMeridian = getQuickCurrentMeridian();

  return (
    <div className="min-h-screen bg-natural-bg text-natural-body flex flex-col font-sans antialiased selection:bg-natural-primary/20 selection:text-natural-primary-dark">
      {/* Exquisite Traditional Header */}
      <header className="border-b border-natural-border bg-natural-card sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo area */}
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-natural-primary-dark to-natural-primary flex items-center justify-center text-white font-serif font-bold text-lg border border-natural-border/30 shadow-sm relative overflow-hidden shrink-0">
                問
                <div className="absolute inset-0 bg-white/5 pointer-events-none transform rotate-45 translate-y-1" />
              </div>
              <div>
                <h1 className="text-lg font-serif font-extrabold tracking-tight text-natural-dark flex items-center gap-1.5">
                  問中醫
                  <span className="text-[10px] bg-natural-warm/15 text-natural-warm border border-natural-warm/25 px-1.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider">
                    Intelligent TCM
                  </span>
                </h1>
                <p className="text-[10px] text-natural-muted font-sans tracking-wide">
                  智能中醫辨證與四時養生指南系統
                </p>
              </div>
            </div>

            {/* Quick Meridian Clock ticker */}
            <div className="hidden md:flex items-center gap-1.5 text-xs bg-natural-light-grey px-3 py-1.5 rounded-xl border border-natural-border text-natural-dark font-medium font-serif shrink-0">
              <Clock className="w-4 h-4 text-natural-primary animate-pulse font-sans" />
              子午流注：
              <span className="font-bold underline cursor-pointer hover:text-natural-primary" onClick={() => setActiveTab('solar')}>
                {currentMeridian.name}
              </span>
            </div>

            {/* Main navigation menu */}
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                  activeTab === 'home'
                    ? 'bg-natural-aside text-natural-dark font-bold'
                    : 'text-natural-muted hover:text-natural-dark hover:bg-natural-light-grey'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">主頁</span>
              </button>
              <button
                onClick={() => setActiveTab('inquiry')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                  activeTab === 'inquiry'
                    ? 'bg-natural-aside text-natural-dark font-bold'
                    : 'text-natural-muted hover:text-natural-dark hover:bg-natural-light-grey'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">智能問診</span>
              </button>
              <button
                onClick={() => setActiveTab('constitution')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                  activeTab === 'constitution'
                    ? 'bg-natural-aside text-natural-dark font-bold'
                    : 'text-natural-muted hover:text-natural-dark hover:bg-natural-light-grey'
                }`}
              >
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">體質自評</span>
              </button>
              <button
                onClick={() => setActiveTab('multimodal')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                  activeTab === 'multimodal'
                    ? 'bg-natural-aside text-natural-dark font-bold'
                    : 'text-natural-muted hover:text-natural-dark hover:bg-natural-light-grey'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">望聞分析</span>
              </button>
              <button
                onClick={() => setActiveTab('solar')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                  activeTab === 'solar'
                    ? 'bg-natural-aside text-natural-dark font-bold'
                    : 'text-natural-muted hover:text-natural-dark hover:bg-natural-light-grey'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">子午時辰</span>
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                  activeTab === 'knowledge'
                    ? 'bg-natural-aside text-natural-dark font-bold'
                    : 'text-natural-muted hover:text-natural-dark hover:bg-natural-light-grey'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">醫藥大百科</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10"
            >
              {/* Cover Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-natural-primary-dark via-natural-primary to-natural-aside p-8 md:p-12 text-white shadow-md border border-natural-border/30">
                <div className="absolute right-4 bottom-0 opacity-10 font-serif text-[180px] font-extrabold select-none pointer-events-none translate-y-12">
                  本草
                </div>
                <div className="max-w-2xl relative z-10 space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold leading-normal">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    中醫辨證大腦 AI Powered Model
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tight leading-tight text-white">
                    開拓中醫智慧，<br className="sm:hidden" />調理本元之氣
                  </h2>
                  <p className="text-sm text-natural-bg/90 leading-relaxed max-w-lg">
                    融合傳統中醫「望診望色、聞聲診虛、問諮詢辨、切循子午」精髓，借助大語言模型在線推理，為您分析氣血盛衰，量身訂製食療藥膳與穴位引導方針。
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('inquiry')}
                      className="px-5 py-2.5 bg-natural-warm hover:bg-natural-warm-dark active:bg-natural-warm font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer text-white"
                    >
                      開始十問歌辨證
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('solar')}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      看當前子午時令保養
                    </button>
                  </div>
                </div>
              </div>

              {/* Functional Grid Cards */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-natural-dark border-l-4 border-natural-primary pl-2.5">
                  健康核心診療模組 (Diagnostic Suite)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Module 1 */}
                  <div
                    onClick={() => setActiveTab('inquiry')}
                    className="bg-natural-card p-6 rounded-2xl border border-natural-border hover:border-natural-primary hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-natural-light-grey text-natural-primary-dark rounded-xl flex items-center justify-center shrink-0 border border-natural-border group-hover:bg-natural-aside/40 transition">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-serif font-extrabold text-natural-dark">
                        智能問診與十問辨證
                      </h4>
                      <p className="text-xs text-natural-muted leading-normal">
                        模擬古法「十問歌」，從寒熱多汗、頭痛腹悶到二便安神。AI 助理漸進式答辯，最終奉呈具有君臣佐使藥對邏輯、配合按揉穴位的高畫質調配單！
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-1 text-xs text-natural-primary-dark font-bold">
                      立即門診
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>

                  {/* Module 2 */}
                  <div
                    onClick={() => setActiveTab('constitution')}
                    className="bg-natural-card p-6 rounded-2xl border border-natural-border hover:border-natural-primary hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-natural-light-grey text-natural-warm rounded-xl flex items-center justify-center shrink-0 border border-natural-border group-hover:bg-natural-aside/40 transition">
                        <Award className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-serif font-extrabold text-natural-dark">
                        九大體質自評剖析
                      </h4>
                      <p className="text-xs text-natural-muted leading-normal">
                        測試您是否屬於氣虛冷體、陽虛寒怕、陰虛發躁、痰濕油膩或平和中庸體質。配合雷達圖視覺分佈，解構您客製化的藥茶與穴位。
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-1 text-xs text-natural-primary-dark font-bold">
                      開始自評
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>

                  {/* Module 3 */}
                  <div
                    onClick={() => setActiveTab('multimodal')}
                    className="bg-natural-card p-6 rounded-2xl border border-natural-border hover:border-natural-primary hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-natural-light-grey text-natural-primary rounded-xl flex items-center justify-center shrink-0 border border-natural-border group-hover:bg-natural-aside/40 transition">
                        <Camera className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-serif font-extrabold text-natural-dark">
                        望診＆聞診多模態分析
                      </h4>
                      <p className="text-xs text-natural-muted leading-normal">
                        上傳舌頭照片，利用 AI 多模態辨讀舌苔厚薄度、歪斜、齒痕病理；或者採樣音聲共鳴力度，判斷肺經氣力、宣降失司、護嗓化濕代茶。
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-1 text-xs text-natural-primary-dark font-bold">
                      開始採樣
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>

                  {/* Module 4 */}
                  <div
                    onClick={() => setActiveTab('solar')}
                    className="bg-natural-card p-6 rounded-2xl border border-natural-border hover:border-natural-primary hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-natural-light-grey text-natural-dark rounded-xl flex items-center justify-center shrink-0 border border-natural-border group-hover:bg-natural-aside/40 transition">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-serif font-extrabold text-natural-dark">
                        子午流注與時令養生
                      </h4>
                      <p className="text-xs text-natural-muted leading-normal">
                        依您所在本機時間，實施 24 小時十二時辰（如：午、未、寅、申時）經穴當值保養推薦。同時推送當季節氣的起居調護原則。
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-1 text-xs text-natural-primary-dark font-bold">
                      時令羅盤
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>

                  {/* Module 5 */}
                  <div
                    onClick={() => setActiveTab('knowledge')}
                    className="bg-natural-card p-6 rounded-2xl border border-natural-border hover:border-natural-primary hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-natural-light-grey text-natural-warm-dark rounded-xl flex items-center justify-center shrink-0 border border-natural-border group-hover:bg-natural-aside/40 transition">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-serif font-extrabold text-natural-dark">
                        中醫本草與經脈大百科
                      </h4>
                      <p className="text-xs text-natural-muted leading-normal">
                        離線搜尋常用中藥材寒溫性質、歸經、配伍禁忌，解構經典方劑（逍遙散、六味地黃丸等）組法，並提供在線 AI 自訂問答功能！
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-1 text-xs text-natural-primary-dark font-bold">
                      翻閱大典
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'inquiry' && <TCMInquiry />}
          {activeTab === 'constitution' && <TCMConstitution />}
          {activeTab === 'multimodal' && <TCMMultimodal />}
          {activeTab === 'solar' && <TCMSolarTerms />}
          {activeTab === 'knowledge' && <TCMKnowledgeBase />}
        </AnimatePresence>
      </main>

      {/* Exquisite Footer */}
      <footer className="bg-natural-dark text-natural-aside/75 py-8 border-t border-natural-border mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-natural-border/30 pb-4">
            <div className="text-natural-bg font-serif font-bold text-sm">
              問中醫 - 傳承華夏醫學大智慧
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-natural-primary" />
              <span>本系統為 AI 輔助養生調護，若您有緊急重症，請先尋求正規中西醫療機構。</span>
            </div>
          </div>
          <p className="text-center text-natural-muted">
            © 2026 問中醫 智能中醫辨證與養生系統. All rights reserved. Built with Antigravity inside AI Studio Build.
          </p>
        </div>
      </footer>
    </div>
  );
}
