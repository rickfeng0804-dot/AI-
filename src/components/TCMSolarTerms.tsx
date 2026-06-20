import React, { useState, useEffect } from 'react';
import { MERIDIANS_DB } from '../data';
import { Meridian } from '../types';
import { Clock, Sun, Sparkles, Heart, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Help helper to calculate current Chinese Hour (12 double hours)
function getChineseHourInfo() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 23 || hour < 1) return { name: '子時', range: '23:00 - 01:00', meridianId: 'gall_bladder', desc: '膽經主令，利於骨髓造血、膽汁新陳代謝，宜熟睡。' };
  if (hour >= 1 && hour < 3) return { name: '丑時', range: '01:00 - 03:00', meridianId: 'liver', desc: '肝經主令，肝臟排毒與修復，全身血歸於肝，必須熟睡。' };
  if (hour >= 3 && hour < 5) return { name: '寅時', range: '03:00 - 05:00', meridianId: 'lung', desc: '肺經主令，將氣血分配到各臟腑，呼吸深長，宜深度睡眠。' };
  if (hour >= 5 && hour < 7) return { name: '卯時', range: '05:00 - 07:00', meridianId: 'large_intestine', desc: '大腸經主令，大腸蠕動活躍，宜起床飲溫水排便排毒。' };
  if (hour >= 7 && hour < 9) return { name: '辰時', range: '07:00 - 09:00', meridianId: 'stomach', desc: '胃經主令，胃腸消化力最強，必須吃一頓豐盛溫熱的早餐。' };
  if (hour >= 9 && hour < 11) return { name: '巳時', range: '09:00 - 11:00', meridianId: 'spleen', desc: '脾經主令，脾主運化氣血精微，精神最飽滿，此時工作和學習效率最高。' };
  if (hour >= 11 && hour < 13) return { name: '午時', range: '11:00 - 13:00', meridianId: 'heart', desc: '心經主令，心火旺盛，宜適度午休三十分鐘，養心氣。' };
  if (hour >= 13 && hour < 15) return { name: '未時', range: '13:00 - 15:00', meridianId: 'small_intestine', desc: '小腸經主令，分清別濁，吸收午餐精華。宜多喝水稀釋血液。' };
  if (hour >= 15 && hour < 17) return { name: '申時', range: '15:00 - 17:00', meridianId: 'bladder', desc: '膀胱經主令，膀胱排泄多餘水濕。適合工作、運動和飲茶。' };
  if (hour >= 17 && hour < 19) return { name: '酉時', range: '17:00 - 19:00', meridianId: 'kidney', desc: '腎經主令，腎臟藏精。適宜散步放鬆、吃晚餐，不宜劇烈勞損。' };
  if (hour >= 19 && hour < 21) return { name: '戌時', range: '19:00 - 21:00', meridianId: 'pericardium', desc: '心包經主令，保護心臟，利於擴張血管。適宜散步、聊天或靜坐。' };
  return { name: '亥時', range: '21:00 - 23:00', meridianId: 'triple_burner', desc: '三焦經主令，百脈修養通暢。此時人應徹底放鬆入睡。' };
}

// Simple logic to get current Solar Term based on current date
function getSolarTerm() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  // Simple approximations of 24 solar terms dates
  if (m === 1) return d < 20 ? { name: '小寒', info: '冷氣積久而為寒。此時宜溫陽補腎，適量食用羊肉與薑，注意防寒保暖。' } : { name: '大寒', info: '寒氣之逆極。此時冬盡春來，應早平息靜氣，適合泡腳、驅體寒、早睡晚起。' };
  if (m === 2) return d < 19 ? { name: '立春', info: '春季開始。陽氣初生，宜舒暢氣機能，多吃生薑、韭菜，避免暴怒以防傷肝木之氣。' } : { name: '雨水', info: '冰雪融化，降雨漸多。重在調理脾胃、祛濕，多食山藥、蓮子等。' };
  if (m === 3) return d < 20 ? { name: '驚蟄', info: '春雷始鳴，驚醒蟄伏蟲。天氣轉暖，宜適度春季戶外散步、舒展筋骨、多吃水梨養肺。' } : { name: '春分', info: '晝夜均而平分。人體陰陽應保持平衡，飲食不宜大寒大熱，宜心平氣和。' };
  if (m === 4) return d < 20 ? { name: '清明', info: '萬物清潔明淨。宜踏青舒懷，常食清肝明目的枸杞、菊花，補氣防濕。' } : { name: '穀雨', info: '雨水滋潤五穀。濕氣漸重，脾胃保健至關重要，適合食用芡實、紅豆袪除濕邪。' };
  if (m === 5) return d < 21 ? { name: '立夏', info: '夏季開始。陽氣漸旺，心氣漸盛，宜食偏清淡，多食苦味（如苦瓜）清心火。' } : { name: '小滿', info: '麥類作物籽粒開始飽滿。天氣漸熱燥，應預防皮膚瘡毒、濕疹，不食生冷肥膩。' };
  if (m === 6) return d < 21 ? { name: '芒種', info: '螳螂生、鵙始鳴，香草繁。氣溫濕熱，宜健脾祛濕、防中暑、保持衣物乾爽。' } : { name: '夏至', info: '白晝最長。陽氣盛極，陰氣初生。宜早起晚睡，中午稍事休息，飲食「冬吃蘿蔔夏吃薑」，補足胃陽。' };
  if (m === 7) return d < 23 ? { name: '小暑', info: '溫風至。天氣炎熱，脾胃易虛，食宜溫熱、不宜重油鹽及生冷瓜果，保護心火元氣。' } : { name: '大暑', info: '一年中最炎熱之季。濕熱交蒸，宜靜心消暑，常食綠豆、冬瓜以清暑化濕，防暴曬傷津氣。' };
  if (m === 8) return d < 23 ? { name: '立秋', info: '秋季開始，暑去涼來。宜早睡早起以斂肺氣。避免食用過多冰品，防暗傷脾陽。' } : { name: '處暑', info: '暑氣至此而止，天氣漸燥。宜滋陰潤燥，多吃百合、梨子、蜂蜜，防「秋燥」傷肺。' };
  if (m === 9) return d < 23 ? { name: '白露', info: '氣溫走低，露凝而白。注意「白露不露身」，防止關節受寒，適當溫補。' } : { name: '秋分', info: '晝夜平分，秋燥當令。防肺燥為主要方向，多運動舒緩神經。' };
  if (m === 10) return d < 23 ? { name: '寒露', info: '露氣寒冷，將凝結也。宜溫水泡腳以暖足少陰腎經，飲食溫潤滋補。' } : { name: '霜降', info: '天氣漸冷，开始有霜。氣血下行，重在補冬，適合吃栗子、紅棗，固護關節。' };
  if (m === 11) return d < 22 ? { name: '立冬', info: '冬季開始。萬物避寒，養生重「藏」，早睡晚起，不宜過度發汗，注意頭腳保暖。' } : { name: '小雪', info: '降雪漸起。寒邪偏重，宜保暖、多食黑色益腎食物（如黑芝麻、黑豆）。' };
  return d < 22 ? { name: '大雪', info: '降雪偏多，天寒地凍。養生重在保護陽氣，補腎強骨，常食薑、蘿蔔調中。' } : { name: '冬至', info: '白晝最短，夜最長，陰極之至，一陽初生。此時為「冬至一陽生」，極適合溫補，宜吃餃子湯圓或人參雞。' };
}

export default function TCMSolarTerms() {
  const [time, setTime] = useState(new Date());
  const [chineseHour, setChineseHour] = useState(getChineseHourInfo());
  const [solarTerm, setSolarTerm] = useState(getSolarTerm());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      setChineseHour(getChineseHourInfo());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Find active meridian object in DB for meridian details or default details
  const activeMeridian = MERIDIANS_DB.find(
    m => m.id === chineseHour.meridianId || m.name.includes(chineseHour.name)
  ) || MERIDIANS_DB[0];

  // 12 Chinese Hours static layout array for the circular clock visual
  const clockHours = [
    { name: '子', id: 'gall_bladder', label: '膽', hour: '23-1' },
    { name: '丑', id: 'liver', label: '肝', hour: '1-3' },
    { name: '寅', id: 'lung', label: '肺', hour: '3-5' },
    { name: '卯', id: 'large_intestine', label: '大腸', hour: '5-7' },
    { name: '辰', id: 'stomach', label: '胃', hour: '7-9' },
    { name: '巳', id: 'spleen', label: '脾', hour: '9-11' },
    { name: '午', id: 'heart', label: '心', hour: '11-13' },
    { name: '未', id: 'small_intestine', label: '小腸', hour: '13-15' },
    { name: '申', id: 'bladder', label: '膀胱', hour: '15-17' },
    { name: '酉', id: 'kidney', label: '腎', hour: '17-19' },
    { name: '戌', id: 'pericardium', label: '心包', hour: '19-21' },
    { name: '亥', id: 'triple_burner', label: '三焦', hour: '21-23' }
  ];

  return (
    <div className="space-y-8" id="tcm-solar-terms-view">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
        <div>
          <h2 className="text-2xl font-semibold text-emerald-950 flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-600" />
            子午流注與時令養生
          </h2>
          <p className="text-sm text-emerald-800 mt-1">
            中醫主張「天人相應」，人體十二臟腑之氣如潮汐般在不同時辰循行經絡。
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100/80 flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
          <div className="text-right">
            <div className="text-xs text-gray-500">當前本機時間</div>
            <div className="text-sm font-mono font-bold text-gray-800">
              {time.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side - The circular Meridian Clock */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full inline-block">
              子午流注鐘 (Zi Wu Liu Zhu Clock)
            </span>
            <p className="text-xs text-gray-400 mt-2">高亮部分為當前時辰主令經絡</p>
          </div>

          <div className="relative w-72 h-72 rounded-full border-4 border-emerald-900/10 flex items-center justify-center bg-stone-50/50">
            {/* Hour labels positioned circularly */}
            {clockHours.map((item, idx) => {
              const angle = (idx * 30 - 90) * (Math.PI / 185); // offsets and stretches beautifully
              const x = 110 * Math.cos(angle);
              const y = 110 * Math.sin(angle);
              const isActive = chineseHour.name.includes(item.name);

              return (
                <div
                  key={item.name}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    position: 'absolute'
                  }}
                  className={`flex flex-col items-center justify-center w-11 h-11 rounded-full text-center transition-all duration-500 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold scale-110 shadow-md shadow-emerald-600/30 ring-4 ring-emerald-100'
                      : 'hover:bg-emerald-50 hover:text-emerald-900 text-gray-600'
                  }`}
                >
                  <span className="text-sm">{item.name}</span>
                  <span className="text-[9px] opacity-80 leading-none">{item.label}</span>
                </div>
              );
            })}

            {/* Central Dial indicator */}
            <div className="w-24 h-24 rounded-full bg-white border border-gray-100 shadow flex flex-col items-center justify-center text-center z-10 scale-95">
              <span className="text-xl font-bold text-emerald-800 font-serif">{chineseHour.name}</span>
              <span className="text-[10px] text-gray-500 font-mono mt-0.5">{chineseHour.range}</span>
            </div>
            {/* Subtle pulsing line indicating active direction */}
            <div className="absolute inset-0 border-2 border-emerald-600/20 rounded-full animate-ping pointer-events-none scale-95" />
          </div>

          <div className="mt-8 text-center bg-stone-50 p-4 rounded-xl w-full border border-gray-100">
            <div className="text-xs text-gray-400">當前經氣值守</div>
            <div className="text-lg font-bold text-emerald-900 mt-0.5 font-serif">
              {activeMeridian.name} ( {chineseHour.name} )
            </div>
            <div className="text-xs text-emerald-800 mt-2 font-medium px-4 leading-relaxed">
              {chineseHour.desc}
            </div>
          </div>
        </div>

        {/* Right Side - Solar Term Card and Meridian self-care advice */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active solar terms card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 shadow-sm relative overflow-hidden"
          >
            <div className="absolute right-3 -bottom-3 text-amber-100 opacity-60">
              <Sun className="w-32 h-32 stroke-1" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-semibold tracking-wider text-amber-800 uppercase">
                  當前歲時節氣 (Current Solar Term)
                </span>
              </div>
              <h3 className="text-2xl font-bold text-amber-950 font-serif flex items-center gap-2">
                {solarTerm.name}
                <span className="text-xs font-normal px-2 py-0.5 bg-amber-200/50 text-amber-900 rounded">
                  中醫四時調神
                </span>
              </h3>
              <p className="text-sm text-amber-900 mt-3 leading-relaxed max-w-xl">
                {solarTerm.info}
              </p>
              <div className="mt-4 flex items-center gap-2 py-2 text-xs text-amber-950 font-medium">
                <Sparkles className="w-4 h-4 text-amber-500" />
                四時順養原則：春生、夏長、秋收、冬藏。
              </div>
            </div>
          </motion.div>

          {/* Active hourly Meridian Self-care guideline */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
              <Heart className="w-5 h-5 text-rose-500" />
              <h4 className="text-base font-bold text-gray-800">
                本時辰經氣走向與保養建議
              </h4>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-gray-400 block font-medium">經絡走向與起點</span>
                <span className="text-sm text-gray-700 mt-1 block leading-relaxed">
                  {activeMeridian.meridianFlow}
                </span>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-xl space-y-1">
                <span className="text-xs text-emerald-800 font-bold block">時辰經絡養生指南</span>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {activeMeridian.selfCareTip}
                </p>
              </div>

              {activeMeridian.acupoints && activeMeridian.acupoints.length > 0 && (
                <div>
                  <span className="text-xs text-gray-400 block font-medium mb-2">
                    建議在此時辰隨手揉按的經穴 (Acupoints for this hour)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeMeridian.acupoints.map((pt, index) => (
                      <div
                        key={pt.name}
                        className="p-3.5 rounded-xl border border-stone-100 hover:border-emerald-100 hover:bg-stone-50/50 transition duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-emerald-900 font-serif">
                            {pt.name} ({pt.pinyin})
                          </span>
                          <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">
                            主治及調養
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">
                          <strong>定位：</strong>
                          {pt.location}
                        </p>
                        <p className="text-xs text-stone-600 mt-1">
                          <strong>治症：</strong>
                          {pt.indications.slice(0, 3).join('、')}
                        </p>
                        <p className="text-xs text-emerald-800 mt-1 font-medium bg-emerald-50/30 p-1.5 rounded">
                          <strong>操手法：</strong>
                          {pt.method}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
