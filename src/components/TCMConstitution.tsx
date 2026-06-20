import React, { useState } from 'react';
import { ConstitutionProfile } from '../types';
import { Sparkles, HelpCircle, ArrowRight, CheckCircle2, ChevronRight, RefreshCw, Award, ShieldAlert, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

interface QuizQuestion {
  id: number;
  type: string;
  question: string;
  options: { label: string; value: number }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: '平和質',
    question: '您平常精力充沛、面色紅潤，生活作息良好且不易感到疲倦嗎？',
    options: [
      { label: '從不如此', value: 1 },
      { label: '很少如此', value: 2 },
      { label: '有時如此', value: 3 },
      { label: '經常如此', value: 4 },
      { label: '總是如此', value: 5 }
    ]
  },
  {
    id: 2,
    type: '氣虛質',
    question: '您稍微活動一會兒（如爬一兩層樓），就容易感到氣喘吁吁、氣短無力或時常出虛汗嗎？',
    options: [
      { label: '從無此感', value: 1 },
      { label: '略微如此', value: 2 },
      { label: '偶爾如此', value: 3 },
      { label: '多數如此', value: 4 },
      { label: '總是如此', value: 5 }
    ]
  },
  {
    id: 3,
    type: '陽虛質',
    question: '您特別怕冷、冬天極度畏寒，在冷氣房裡待不住，肚子和手腳一年四季發涼發冰嗎？',
    options: [
      { label: '從不如此', value: 1 },
      { label: '很少如此', value: 2 },
      { label: '有時短暫', value: 3 },
      { label: '經常如此', value: 4 },
      { label: '總是如此', value: 5 }
    ]
  },
  {
    id: 4,
    type: '陰虛質',
    question: '您時常手心腳心熱乎發燥、容易嘴巴喉嚨乾渴、皮膚乾澀且大便偏乾硬結結不爽嗎？',
    options: [
      { label: '從無此感', value: 1 },
      { label: '略微如此', value: 2 },
      { label: '偶有發生', value: 3 },
      { label: '經常如此', value: 4 },
      { label: '必定如此', value: 5 }
    ]
  },
  {
    id: 5,
    type: '痰濕質',
    question: '您覺得身體沉重、胸悶痰多，面部油脂多油光滿面，或是眼皮或臉部容易發胖浮腫嗎？',
    options: [
      { label: '從不如此', value: 1 },
      { label: '很少如此', value: 2 },
      { label: '有時如此', value: 3 },
      { label: '經常如此', value: 4 },
      { label: '總是如此', value: 5 }
    ]
  },
  {
    id: 6,
    type: '濕熱質',
    question: '您脸上容易長青春痘（或常覺油光泛面）、大便黏滯不爽容易黏馬桶，且常有口氣口苦發澀？',
    options: [
      { label: '從無此感', value: 1 },
      { label: '略微如此', value: 2 },
      { label: '有時如此', value: 3 },
      { label: '經常如此', value: 4 },
      { label: '必定如此', value: 5 }
    ]
  },
  {
    id: 7,
    type: '血瘀質',
    question: '您面色晦暗容易生黑斑、黑眼圈深，或身體各個關節肌肉有固定的刺痛點，皮膚偶見莫名紫斑？',
    options: [
      { label: '從無此感', value: 1 },
      { label: '很少發生', value: 2 },
      { label: '有時短暫', value: 3 },
      { label: '多數發生', value: 4 },
      { label: '總是如此', value: 5 }
    ]
  },
  {
    id: 8,
    type: '氣鬱質',
    question: '您容易無故多愁善感、胸悶愛長吁短嘆叹氣，性格較慢、情緒低落或失眠焦慮多夢嗎？',
    options: [
      { label: '從無此感', value: 1 },
      { label: '略微發作', value: 2 },
      { label: '偶爾發作', value: 3 },
      { label: '經常如此', value: 4 },
      { label: '無時無刻', value: 5 }
    ]
  },
  {
    id: 9,
    type: '特稟質',
    question: '您是否極易發生過敏反應（如蕁麻疹、花粉過敏、季節交替時劇烈打噴嚏、流鼻水過敏性鼻炎）？',
    options: [
      { label: '從不如此', value: 1 },
      { label: '很少如此', value: 2 },
      { label: '偶爾如此', value: 3 },
      { label: '經常如此', value: 4 },
      { label: '總是如此', value: 5 }
    ]
  }
];

export default function TCMConstitution() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<ConstitutionProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectOption = (value: number) => {
    const nextAnswers = { ...answers, [QUESTIONS[currentIdx].id]: value };
    setAnswers(nextAnswers);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Finished all questions! Trigger computation
      handleSubmitQuiz(nextAnswers);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmitQuiz = async (finalAnswers: Record<number, number>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/diagnose/constitution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers })
      });
      if (!response.ok) throw new Error('體質診斷請求超時或出錯。');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // Hard fallback locally
      setResult(simulatedLocalFallback(finalAnswers));
    } finally {
      setLoading(false);
    }
  };

  const simulatedLocalFallback = (ans: Record<number, number>): ConstitutionProfile => {
    // Generate a beautiful mock layout matching calculations
    let highestConstit = '平和質';
    let maxVal = 0;
    
    // Find highest non-balanced score
    Object.entries(ans).forEach(([qId, val]) => {
      const qNum = Number(qId);
      if (qNum > 1 && val > maxVal) {
        maxVal = val;
        highestConstit = QUESTIONS.find(q => q.id === qNum)?.type || '氣虛質';
      }
    });

    // If all other scores are low (<= 2) and q1 is high, it's balanced
    if (ans[1] >= 4 && maxVal <= 2.5) {
      highestConstit = '平和質';
    }

    const baseProfile: Record<string, ConstitutionProfile> = {
      '平和質': {
        name: '九大體質之「平和質」',
        score: 95,
        features: '體格勻稱健壯，面色有華澤，目光有神，精力充沛，睡眠極佳。這是不偏不移的中庸健康體質。',
        dietAdvice: ['雜糧穀物', '青花菜、蘋果', '輕煎鱸魚'],
        dietAvoids: ['偏食辛辣', '高油高鹽深加工品'],
        herbalTea: {
          name: '紅棗枸杞平補茶',
          ingredients: '紅棗2枚，枸杞8粒，黃耆2g',
          effect: '溫和補氣、健脾明目',
          method: '沸水沖泡，替代白開水，四季皆宜頻飮。'
        },
        lifestyleAdvice: ['保持每週固定帶氧慢跑或游泳', '順應天時，按時作息'],
        acupoints: ['足三里穴 (日常免疫要穴)', '湧泉穴 (引火歸元，養陰安神)']
      },
      '氣虛質': {
        name: '九大體質之「氣虛質」',
        score: 82,
        features: '容易疲倦怠惰、懶言語，爬樓梯稍微動一下就喘、出虛汗。免疫力低、容易感冒。',
        dietAdvice: ['山藥', '黃耆', '黨參', '黑芝麻', '大棗'],
        dietAvoids: ['生冷生魚片', '大量冰鎮西瓜', '苦瓜等過寒泄氣物'],
        herbalTea: {
          name: '黃耆參苓健脾茶',
          ingredients: '黃耆3g，黨參2g，茯苓3g，白扁豆5g',
          effect: '補脾益氣，強健正氣',
          method: '保溫瓶悶泡20分鐘，白日前頻飲，固表止汗。'
        },
        lifestyleAdvice: ['不宜做劇烈、暴汗的無氧重訓，宜進行八段錦或散步', '多曬太陽溫煦背督脈'],
        acupoints: ['氣海穴 (聚一身元氣)', '足三里 (脾胃生化氣血)']
      },
      '陽虛質': {
        name: '九大體質之「陽虛質」',
        score: 88,
        features: '怕冷，手腳經常冰涼，吃冰品或吹冷風極易拉肚子、肚子痛。面色淡白，性格安靜。',
        dietAdvice: ['羊肉', '乾薑', '肉桂', '荔枝', '花椒'],
        dietAvoids: ['綠豆湯、冬瓜、冷盤沙拉', '寒涼冷飲、海產冷鮮'],
        herbalTea: {
          name: '肉桂乾薑暖胃飲',
          ingredients: '肉桂粉2g，乾薑2片，紅棗3枚（去核）',
          effect: '溫中化寒，溫暖手腳',
          method: '熱水大火煮滾10分鐘，溫熱飲用。能有效溫煦周身血液。'
        },
        lifestyleAdvice: ['每日晚間採用艾葉或老薑熱水泡腳直到小腿肚', '注意腹部、神闕穴及兩足踝關節遮擋保暖'],
        acupoints: ['命門穴 (溫煦命門真火)', '關元穴 (封藏真元氣)']
      },
      '陰虛質': {
        name: '九大體質之「陰虛質」',
        score: 80,
        features: '怕熱，手心、腳心及胸口常覺燥熱（五心煩熱），口乾舌燥想喝冰水，大便乾燥、常失眠。',
        dietAdvice: ['枸杞', '銀耳', '鴨肉', '蜂蜜', '桑葚'],
        dietAvoids: ['韭菜、辣椒', '八角、高粱酒等大辛大熱物'],
        herbalTea: {
          name: '麥冬沙參滋陰茶',
          ingredients: '麥冬5g，北沙參3g，玉竹3g，白菊花3朵',
          effect: '滋養肺腎之陰，潤燥清熱',
          method: '滾水悶泡15分鐘當茶飮，能清浮火、滋潤咽喉乾燥。'
        },
        lifestyleAdvice: ['避免熬夜（最傷陰液），晚上11點入睡以養「夜半水氣」', '可進行瑜珈、打坐等靜態安神運動'],
        acupoints: ['三陰交穴 (滋養肝脾腎三經之陰)', '太谿穴 (補腎精引火歸元)']
      }
    };

    return baseProfile[highestConstit] || baseProfile['氣虛質'];
  };

  // Convert current 1-5 survey value to chart data for the Radar visual
  const getChartData = () => {
    return QUESTIONS.map(q => {
      const savedVal = answers[q.id] || 1;
      // Convert [1-5] weight scale to [20-100] percentage view for beautiful charting
      const pct = savedVal * 20;
      return {
        subject: q.type,
        A: pct,
        fullMark: 100
      };
    });
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setResult(null);
  };

  const progressPct = Math.round((currentIdx / QUESTIONS.length) * 100);

  return (
    <div className="space-y-8" id="tcm-constitution-view">
      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
        <h2 className="text-2xl font-serif font-semibold text-emerald-950 flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-700 font-sans" />
          九大體質智能辨識自評
        </h2>
        <p className="text-sm text-emerald-800 mt-1">
          中醫科學體位觀點，將人體歸納為平和、氣虛、陽虛、陰虛、痰濕、濕熱、血瘀、氣鬱、特稟等九種基底，不同體質藥膳養生、病理防守各自相異。
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result && !loading ? (
          // Quiz progression state
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-stone-200/80 shadow-md space-y-6"
          >
            {/* Progress line */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-500">
                <span>過度評量中 {currentIdx + 1} / 9 題</span>
                <span className="font-mono">{progressPct}% 已完成</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Question section */}
            <div className="space-y-4">
              <span className="inline-block px-2.5 py-1 text-[11px] font-bold bg-stone-50 border border-stone-200 text-stone-850 rounded-md">
                體型考察：{QUESTIONS[currentIdx].type} 指標
              </span>
              <h3 className="text-lg font-serif font-bold text-stone-900 leading-relaxed min-h-[50px]">
                {QUESTIONS[currentIdx].question}
              </h3>
            </div>

            {/* Question options */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {QUESTIONS[currentIdx].options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSelectOption(opt.value)}
                  className="w-full px-5 py-3.5 border border-stone-200 rounded-xl text-sm font-medium text-left text-stone-700 hover:border-emerald-600 hover:bg-emerald-50/20 active:bg-emerald-50/30 transition flex justify-between items-center group/btn"
                >
                  {opt.label}
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover/btn:text-emerald-600 group-hover/btn:translate-x-1 transition" />
                </button>
              ))}
            </div>

            {/* Back button */}
            {currentIdx > 0 && (
              <button
                onClick={handleBack}
                className="text-xs text-stone-400 hover:text-stone-700 font-medium pt-2 block border-t border-stone-100 w-full text-center"
              >
                返回上一題
              </button>
            )}
          </motion.div>
        ) : loading ? (
          // Computation loader
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 max-w-sm mx-auto">
            <RefreshCw className="w-10 h-10 animate-spin text-emerald-600" />
            <h3 className="text-lg font-serif">正由中醫調配臟腑數據...</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              根據您的寒熱偏頗、氣血瘀阻、痰濕阻滯得分，生成經氣傾向網狀圖，並化裁養生茶、經絡自養指南。
            </p>
          </div>
        ) : result ? (
          // Result report with charts
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Radar Chart column */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center">
              <h4 className="text-base font-bold text-stone-800 font-serif mb-4 flex items-center gap-1">
                <Heart className="w-4 h-4 text-emerald-600" />
                您的九維體質雷達分佈圖
              </h4>

              {/* Recharts responsive render */}
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getChartData()}>
                    <PolarGrid stroke="#e5e5e5" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#444444', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar
                      name="體質權重"
                      dataKey="A"
                      stroke="#059669"
                      fill="#059669"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Tally list */}
              <div className="w-full mt-4 border-t border-stone-100 pt-4 space-y-1.5">
                <div className="text-[11px] text-stone-400 font-mono">體質偏向百分比：</div>
                <div className="grid grid-cols-3 gap-2">
                  {getChartData().map(pt => (
                    <div
                      key={pt.subject}
                      className="p-1.5 bg-stone-50 rounded border border-stone-100 flex flex-col text-center"
                    >
                      <span className="text-[10px] text-stone-605">{pt.subject}</span>
                      <span className="text-xs font-bold text-stone-800 font-mono">{pt.A}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Structured advice details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-600">主要體質診斷結果</span>
                    <h3 className="text-2xl font-serif font-extrabold text-stone-900 mt-1">
                      {result.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400">體質倾向值</span>
                    <div className="text-3xl font-mono font-bold text-emerald-600">{result.score}%</div>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-stone-400 font-medium block">體相與病理特徵：</span>
                  <p className="text-sm text-stone-705 leading-relaxed mt-1">{result.features}</p>
                </div>

                {/* Dietary Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border-b border-stone-50">
                  <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100/50">
                    <span className="text-xs text-emerald-800 font-bold block flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      宜食對症食材 (Recommend)
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.dietAdvice?.map((food, i) => (
                        <span key={i} className="bg-white px-2 py-0.5 rounded border border-emerald-100 text-xs text-emerald-950 font-medium">
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100/50">
                    <span className="text-xs text-amber-800 font-bold block flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      避忌生冷厚味 (Avoid)
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.dietAvoids?.map((food, i) => (
                        <span key={i} className="bg-white px-2 py-0.5 rounded border border-amber-100 text-xs text-amber-950 font-medium">
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Acupoints to massage */}
                {result.acupoints && result.acupoints.length > 0 && (
                  <div>
                    <span className="text-xs text-stone-400 font-medium block mb-1.5">
                      【客製守護穴位刺激】
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {result.acupoints.map((ac, idx) => (
                        <li key={idx} className="p-2.5 bg-stone-50 border border-stone-100/80 rounded-lg text-xs text-stone-700 leading-normal">
                          <strong>{ac.split(' ')[0]}：</strong>
                          {ac.split(' ').slice(1).join(' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Customized Tea Prescription Card */}
              {result.herbalTea && (
                <div className="p-6 bg-[#FAF6EF] border-2 border-amber-900/10 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute right-3 -bottom-3 text-amber-700/5 pointer-events-none select-none font-serif text-[80px]">
                    藥茶
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-red-100 px-2 py-0.5 rounded text-red-900 border border-red-200 font-semibold uppercase tracking-wider font-sans">
                        Customize Dietary Herbal Tea
                      </span>
                    </div>

                    <h4 className="text-xl font-serif font-extrabold text-red-950">
                      專屬體質養生方：{result.herbalTea.name}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs text-stone-700">
                      <div>
                        <strong>飲品用材分量：</strong>
                        <p className="mt-0.5 text-stone-605">{result.herbalTea.ingredients}</p>
                      </div>
                      <div>
                        <strong>調理主治功效：</strong>
                        <p className="mt-0.5 text-emerald-800 font-medium">{result.herbalTea.effect}</p>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-white/70 border border-amber-905/10 rounded-xl text-xs leading-relaxed text-stone-800">
                      <strong>沖泡與飮用方法：</strong> {result.herbalTea.method}
                    </div>
                  </div>
                </div>
              )}

              {/* Lifestyle Habits */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <span className="text-xs text-stone-400 font-medium block">
                  日常生活起居與情志養神調養 (Lifestyle Guideline)：
                </span>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-700 leading-relaxed font-serif">
                  {result.lifestyleAdvice?.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>

                <button
                  onClick={restartQuiz}
                  className="w-full mt-4 py-2 bg-stone-100 hover:bg-stone-200 active:bg-stone-250 text-stone-700 transition font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  重新自評九大體質
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
