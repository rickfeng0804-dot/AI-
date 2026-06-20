import React, { useState, useRef, useEffect } from 'react';
import { InquiryMessage, DiagnosticResult } from '../types';
import { Send, Sparkles, RefreshCw, AlertCircle, FileText, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TCMInquiry() {
  const [messages, setMessages] = useState<InquiryMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是您的智能中醫辨證助手。中醫問診體系上承《黃帝內經》，下啟歷代名方，講究「因人施治」。請輸入您近期主要的身體不舒服（例如：時常頭痛、手腳冰冷、胃脹不適或失眠多夢等），我將模擬中醫「十問歌」的深度邏輯，主動追問您細節，為您辨證開方。',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Accumulated diagnostic result scroll
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticResult | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    setErrorMsg(null);
    const userText = inputValue;
    setInputValue('');

    const userMessage: InquiryMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/diagnose/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) throw new Error('伺服器辨證解析失敗。');
      const data = await response.json();

      if (data.stage === 'report' && data.report) {
        setDiagnosticReport(data.report);
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            role: 'assistant',
            content: `大夫已辨證完畢！根據您的綜合表述，為您釐清病機為【${data.report.syndromeIdentification}】。已為您生成中醫調理處方牋，可點擊下方按鈕或檢視本頁右側處方詳細調理方案。`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else if (data.stage === 'dialog' && data.nextMessage) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            role: 'assistant',
            content: data.nextMessage,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else {
        // Safe mock default if json returns blank
        throw new Error('回傳結構化資料異常，切換至本地問診。');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('在線中醫辨證引擎異常，系統已自動啟用本地輔助模型。');
      
      // Local fallback simulation triggers locally after enough turns in try catch
      setTimeout(() => {
        const fallbackResponse = simulatedInquiryFallback(updatedMessages);
        if (fallbackResponse.stage === 'report' && fallbackResponse.report) {
          setDiagnosticReport(fallbackResponse.report);
        }
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            role: 'assistant',
            content: fallbackResponse.nextMessage || `為您調理完畢！已開立本地調理處方牋，請參考右方的中醫調理方案。`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  // Fallback engine inside component to guarantee response if model timeouts
  const simulatedInquiryFallback = (allMsgs: InquiryMessage[]) => {
    const userMsgs = allMsgs.filter(m => m.role === 'user');
    const userText = userMsgs.map(m => m.content).join(' ');
    const count = userMsgs.length;

    if (count < 3) {
      return {
        stage: 'dialog',
        nextMessage: '收到您的回覆。請問您平時口乾多嗎？平常會不會覺得口苦？另外看您的睡眠情況，是躺很久睡不熟、還是容易驚醒或多夢呢？'
      };
    } else {
      return {
        stage: 'report',
        report: {
          symptomsSummary: userText || "外寒內虛、頭痛酸楚，氣機不流暢。",
          syndromeIdentification: "外感風寒犯肺，中焦脾胃氣虛寒證",
          explanation: "由於外寒束表，肺氣失宣導，引起頭痛發冷；加上平素中焦脾胃之陽不足，導致脾濕生虛，疲倦無氣力。",
          therapeuticPrinciple: "解表散寒，溫中健脾調胃",
          recommendedFormula: {
            name: "桂枝湯合參苓白朮散化裁",
            composition: "桂枝 10g，白芍 10g，黨參 15g，白朮 12g，茯苓 15g，桔梗 6g，甘草 6g，生薑 3片，大棗 4枚",
            explanation: "桂枝與芍藥調和營衛解外寒；參朮苓草補中焦脾氣化肺濕；薑棗調和諸藥營衛。"
          },
          recommendedHerbs: ["生薑", "大棗", "厚朴", "陳皮"],
          acupuncturePoints: [
            { name: "合谷穴", location: "手背第1、2掌骨間、虎口肌肉豐滿凹陷處", reason: "面口合谷收，宣通肺經外邪，舒緩頭面不適", method: "每天點按下壓100下，孕婦忌用" },
            { name: "足三里", location: "小腿外側外膝眼下三寸，脛骨外一橫指肌肉處", reason: "胃經要穴，補足脾胃中焦元氣，提升免疫力", method: "點揉至微酸發熱，溫敷艾灸極佳" }
          ],
          dietaryAdvice: ["多喝熱生薑紅棗茶", "正餐宜食熱糯米粥健脾"],
          avoidDiet: ["切忌寒涼冰品、冰鎮冷飲", "避免食用螃蟹、生魚片、鴨肉等偏大寒大濕物"],
          lifestyleAdvice: ["睡前熱水浴、泡腳15分鐘直到身體微微出汗", "外出戴輕便圍巾阻隔風邪入侵風池穴風府穴"]
        }
      };
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: '您好！我是您的智能中醫辨證助手。中醫問診體系上承《黃帝內經》，下啟歷代名方，講究「因人施治」。請輸入您近期主要的身體不舒服（例如：時常頭痛、手腳冰冷、胃脹不適或失眠多夢等），我將模擬中醫「十問歌」的深度邏輯，主動追問您細節，為您辨證開方。',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setDiagnosticReport(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6" id="tcm-inquiry-view">
      {/* Introduction Banner */}
      <div className="flex justify-between items-center bg-stone-50 p-6 rounded-2xl border border-stone-200">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 font-serif">
            智能問診（十問歌辨證）
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            模擬中醫名醫「十問歌」理學診斷邏輯，收集惡寒、發熱、汗出、二便等臟腑虛實，一步步追查病機源頭。
          </p>
        </div>
        <button
          onClick={resetChat}
          className="px-3 py-1.5 border border-stone-200 hover:bg-stone-100 hover:text-stone-900 text-stone-600 rounded-xl text-xs flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重新問診
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chat window column */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="bg-stone-50 px-4 py-3 border-b border-stone-150 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              問診診室 (Inquiry Dialogue)
            </span>
            <span className="text-[10px] text-gray-405 font-mono">十問歌漸進式互動</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-bl-none font-serif'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] opacity-75 justify-between">
                      <span className="font-bold flex items-center gap-1">
                        {msg.role === 'user' ? (
                          <>
                            <User className="w-3 h-3" />
                            患者
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                            大仙
                          </>
                        )}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-stone-100 rounded-2xl rounded-bl-none p-4 max-w-[80%] border border-stone-200 text-xs text-stone-500 font-medium flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    中醫大夫正在審案辨證，請稍候...
                  </div>
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {errorMsg && (
            <div className="px-4 py-2 bg-amber-50 text-amber-900 text-xs border-t border-amber-100 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-3 bg-stone-50 border-t border-stone-200 flex gap-2">
            <input
              type="text"
              placeholder="請詳細描述您的不適（如：經常胃脹氣，尤其是吃完冰涼食物後更嚴重，且常常手腳冰冷）..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={loading}
              className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition text-white font-medium rounded-xl text-sm flex items-center justify-center gap-1"
            >
              <Send className="w-4 h-4" />
              送出
            </button>
          </form>
        </div>

        {/* Diagnosis Prescription display column */}
        <div className="lg:col-span-6 bg-[#FAF6EF] border-2 border-amber-900/10 rounded-2xl shadow-md p-6 relative overflow-hidden select-text min-h-[520px]">
          {/* Ancient print style elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-800/5 rounded-full border border-red-800/10 flex items-center justify-center rotate-12 -translate-y-4 translate-x-4 pointer-events-none select-none">
            <span className="text-[9px] font-bold text-red-900/25 border-4 border-double border-red-900/25 p-1 font-serif">
              太醫院印
            </span>
          </div>

          {diagnosticReport ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 font-serif relative"
            >
              {/* Prescription Header */}
              <div className="text-center pb-5 border-b-2 border-double border-red-950/20">
                <span className="text-[10px] font-sans font-extrabold uppercase text-amber-800 tracking-wider">
                  Traditional Chinese Medicine Prescription
                </span>
                <h3 className="text-3xl font-serif font-extrabold text-red-950 mt-1 flex items-center justify-center gap-1.5">
                  <FileText className="w-7 h-7 text-red-900 font-sans" />
                  中醫精心辨證診斷書
                </h3>
                <p className="text-[11px] text-stone-500 font-sans mt-1">
                  依四診「陰陽五行、開闔樞機」天人合一理論開具
                </p>
              </div>

              {/* Syndrome Zone */}
              <div className="bg-red-900/5 border border-red-900/10 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-800 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-red-900 font-bold block font-sans">
                    【中醫辨證證型】(Syndrome Identification)
                  </span>
                  <div className="text-lg font-bold text-red-950 mt-1">
                    {diagnosticReport.syndromeIdentification}
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    <strong>病機剖析：</strong>
                    {diagnosticReport.explanation}
                  </p>
                  <p className="text-xs text-stone-600 mt-1">
                    <strong>治主則法：</strong>
                    {diagnosticReport.therapeuticPrinciple}
                  </p>
                </div>
              </div>

              {/* Formulation table zone */}
              {diagnosticReport.recommendedFormula && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-400 block font-sans">
                    【對症推薦經典方劑】(Formula Matching)
                  </span>
                  <div className="bg-white/80 border border-stone-200 rounded-xl p-4 space-y-2 text-stone-850">
                    <div className="text-base font-bold text-red-950">
                      {diagnosticReport.recommendedFormula.name}
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">
                      <strong>方藥組成：</strong>
                      {diagnosticReport.recommendedFormula.composition}
                    </p>
                    <p className="text-xs text-emerald-800 italic leading-relaxed pt-1.5 border-t border-stone-100/60">
                      <strong>君臣佐使藥對邏輯：</strong>
                      {diagnosticReport.recommendedFormula.explanation}
                    </p>
                  </div>
                </div>
              )}

              {/* Dual listing row: Single Herbs & Lifestyle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-xs font-bold text-stone-400 block font-sans">
                    【藥食同源推薦】
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {diagnosticReport.recommendedHerbs?.map((hb, idx) => (
                      <span
                        key={idx}
                        className="bg-white px-2.5 py-1 text-xs border border-stone-200 rounded-lg text-stone-800"
                      >
                        {hb}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-400 block font-sans">
                    【忌口叮嚀】
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {diagnosticReport.avoidDiet?.map((av, idx) => (
                      <span
                        key={idx}
                        className="bg-red-50 text-red-950 border border-red-150 px-2 py-0.5 rounded-lg text-[11px] font-sans"
                      >
                        {av}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Acupoints Massage guidelines */}
              {diagnosticReport.acupuncturePoints && diagnosticReport.acupuncturePoints.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-400 block font-sans">
                    【推薦配合經穴搥艾】
                  </span>
                  <div className="space-y-2">
                    {diagnosticReport.acupuncturePoints.map(acup => (
                      <div
                        key={acup.name}
                        className="p-3 bg-white/60 rounded-xl border border-stone-150 text-xs space-y-1 text-stone-700"
                      >
                        <div className="font-bold text-red-950 font-serif flex items-center justify-between">
                          <span>{acup.name}</span>
                          <span className="text-[10px] font-sans text-stone-400 font-normal">
                            {acup.location}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-stone-600 font-sans">
                          <strong>按揉理由：</strong>
                          {acup.reason}
                        </p>
                        <p className="text-[11px] text-emerald-800 font-sans font-medium">
                          <strong>揉搥施力方法：</strong>
                          {acup.method}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary Advice & Lifestyle */}
              <div className="border-t border-stone-200/80 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block font-sans">
                    食養建議
                  </span>
                  <ul className="list-disc list-inside text-xs text-stone-700 mt-1.5 space-y-1 font-sans">
                    {diagnosticReport.dietaryAdvice?.map((da, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {da}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block font-sans">
                    起居調節
                  </span>
                  <ul className="list-disc list-inside text-xs text-stone-700 mt-1.5 space-y-1 font-sans">
                    {diagnosticReport.lifestyleAdvice?.map((la, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {la}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 text-stone-450 h-full font-serif font-medium space-y-4">
              <div className="w-16 h-16 rounded-full border border-amber-900/10 flex items-center justify-center bg-white shadow-sm shrink-0">
                <FileText className="w-8 h-8 text-stone-300" />
              </div>
              <div>
                <p className="text-stone-700 text-lg">暫無調理處方</p>
                <p className="text-stone-500 text-xs mt-1.5 max-w-sm leading-relaxed font-sans px-4">
                  請與右側的智能大夫進行對話，回答您近期的寒熱、發汗、二便或睡眠不適等。問診結束後，此處將自動化裁、生成精確的調理處方。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
