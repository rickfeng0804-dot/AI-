export interface Herb {
  id: string;
  name: string;
  pinyin: string;
  properties: string; // 性味
  channels: string[]; // 歸經
  effects: string[]; // 功效
  indications: string; // 主治
  contraindications: string; // 禁忌
  description: string;
}

export interface FormulaComponent {
  role: '君' | '臣' | '佐' | '使';
  herbName: string;
  dosage: string;
  purpose: string;
}

export interface Formula {
  id: string;
  name: string;
  pinyin: string;
  source: string; // 出處
  components: FormulaComponent[];
  effects: string[]; // 功用
  indications: string; // 主治
  logic: string; // 君臣佐使配伍邏輯
}

export interface Acupoint {
  name: string;
  pinyin: string;
  location: string; // 定位
  anatomy: string; // 局部解剖
  indications: string[]; // 主治
  method: string; // 操手法 (如：按壓、揉法)
  illustrationTip: string; // 穴位尋找指南
}

export interface Meridian {
  id: string;
  name: string;
  english: string;
  timeHour: string; // 子午流注對應時辰 (如: 寅時 03:00 - 05:00)
  meridianFlow: string; // 經絡走向
  selfCareTip: string; // 當令保養建議
  acupoints: Acupoint[];
}

export interface ConstitutionProfile {
  name: string;
  score: number;
  features: string;
  dietAdvice: string[];
  dietAvoids: string[];
  herbalTea: {
    name: string;
    ingredients: string;
    effect: string;
    method: string;
  };
  lifestyleAdvice: string[];
  acupoints: string[];
}

export interface InquiryMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DiagnosticResult {
  symptomsSummary: string; // 症狀摘要
  syndromeIdentification: string; // 中醫辨證 (如: 肝鬱氣滯、脾胃虛寒)
  explanation: string; // 病機分析 (為什麼會有這些症狀)
  therapeuticPrinciple: string; // 治則治法 (如: 疏肝解鬱、溫中健脾)
  recommendedFormula: {
    name: string;
    composition: string;
    explanation: string;
  };
  recommendedHerbs: string[]; // 推薦單味藥食同源材
  acupuncturePoints: {
    name: string;
    location: string;
    reason: string;
    method: string;
  }[];
  dietaryAdvice: string[]; // 食療建議
  avoidDiet: string[]; // 飲食忌口
  lifestyleAdvice: string[]; // 起居生活建議
}
