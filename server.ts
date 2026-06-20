import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
const geminiKey = process.env.GEMINI_API_KEY;

if (geminiKey && geminiKey !== "MY_GEMINI_API_KEY" && geminiKey.trim() !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Running in TCM Local Simulation mode.");
}

// 1. Structured Inquiry ("十問歌" 問診)
// It takes user message history and generates the next dynamic questions or final report.
app.post('/api/diagnose/inquiry', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: '無效或缺失對話歷史。' });
  }

  const systemInstructions = `
你是一位資深的中醫臨床診斷大師。你的職責是模擬經典中醫「十問歌」的邏輯，與使用者進行智能漸進式問診。
當使用者提供不適症狀時，你應一步步追問：
1. 熱惡寒（怕冷還是怕熱）、2. 汗出、3. 頭身、4. 二便（大小便形色）、5. 飲食胸腹、6. 聾啞睡眠等，每次追問只詢問 1 到 2 個要點，避免問過多令使用者感到負擔。
引導使用者選擇、描述。若已談話 4 輪以上或已收到充分資訊，你應該做出「辨證分型」並完成最終診斷。

回傳格式必須為 JSON，包含以下欄位：
1. "stage": 字串值，為 "dialog"（問診進行中）或 "report"（問診結束已生成診斷書）。
2. "nextMessage": 字串值，當 "stage" 為 "dialog" 時，填入你的暖心、專業追問或選擇引導；若為 "report" 則留空。
3. "report": 物件，只有當 "stage" 為 "report" 時才不為 null。必須符合以下結構：
{
  "symptomsSummary": "患者主訴與症狀總結",
  "syndromeIdentification": "中醫辨證分型 (如：氣陰兩虛證、肝鬱化火證、脾胃虛寒證...)",
  "explanation": "病機分析 (簡潔深入淺出地解釋為何不舒服)",
  "therapeuticPrinciple": "治則治法 (如：益氣養陰、清肝瀉火、溫中健脾...)",
  "recommendedFormula": {
    "name": "推薦方劑 (如：生脈散、逍遙散、理中丸...)",
    "composition": "方劑組成 (列出主要藥材與劑量)",
    "explanation": "方義解析 (簡述君臣佐使邏輯)"
  },
  "recommendedHerbs": ["單味藥材1", "單味藥材2", "單味藥材3"],
  "acupuncturePoints": [
    { "name": "穴位名稱 (如: 足三里)", "location": "位置簡述", "reason": "選用理由", "method": "揉按方法" }
  ],
  "dietaryAdvice": ["食療與藥膳建議1", "建議2"],
  "avoidDiet": ["忌口食物1", "忌口2"],
  "lifestyleAdvice": ["起居調攝建議1", "建議2"]
}

請務必只回傳結構清晰的 JSON。不要包含任何 markdown 標記包裝（如 \`\`\`json ）。
`;

  if (ai) {
    try {
      // Format messages into schema
      const chatParts = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Add system prompt as user context
      const contents = [
        { role: 'user', parts: [{ text: "這是我目前的症狀，請依照系統設定，追問我或得出最終診斷報告。我會跟你說我的情況。" }] },
        ...chatParts
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction: systemInstructions,
          responseMimeType: 'application/json',
          temperature: 0.6,
        }
      });

      const responseText = response.text ? response.text.trim() : '{}';
      const resultObj = JSON.parse(responseText);
      return res.json(resultObj);
    } catch (err: any) {
      console.error("Gemini inquiry generate failed:", err);
      return res.json(generateLocalSimulationInquiry(messages));
    }
  } else {
    // Return Local Simulation
    return res.json(generateLocalSimulationInquiry(messages));
  }
});

// 2. Form/Quiz-based Detailed Constitution Profile
app.post('/api/diagnose/constitution', async (req, res) => {
  const { answers } = req.body; // Map of question index -> score [1-5]
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: '無效或缺失問卷答案。' });
  }

  // Generate prompts
  const serializedAnswers = Object.entries(answers)
    .map(([q, score]) => `問題 ${q} 得分 ${score} (1-5分)`).join('\n');

  const systemInstructions = `
你是中醫體質評估專家。九大體質包括：平和質、氣虛質、陽虛質、陰虛質、痰濕質、濕熱質、血瘀質、氣鬱質、特稟質。
請分析使用者的問卷回答狀況，並為他們分析得分最高的「主要體質分型」或「複合體質分型」，並回傳詳細解析 JSON 格式。
回傳格式必須符合以下：
{
  "name": "體質分型名稱 (如: 氣虛夾痰濕質)",
  "score": 85, // 綜合體質偏向百分比 (0-100)
  "features": "體質特徵綜合描述 (如: 容易疲倦、氣短話懶、體態手腳冰冷等)",
  "dietAdvice": ["合適飲食種類1", "合適飲食種類2"],
  "dietAvoids": ["避免飲食種類1", "避免飲食種類2"],
  "herbalTea": {
    "name": "推薦養生茶飲名稱",
    "ingredients": "泡茶所需的材料及其分量",
    "effect": "主要功效",
    "method": "沖泡與飲用方法"
  },
  "lifestyleAdvice": ["日常生活起居調養建議1", "調養建議2"],
  "acupoints": ["穴位1: 迎香氣喘...", "穴位2: 足三里健脾..."]
}
請精確回傳 JSON，不需包含 markdown 語法外包飾。
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `這是患者的體質問卷自評數據：\n${serializedAnswers}\n\n請根據這些分數，為其分析出主導的中醫體質，給予細緻的養生方針。`,
        config: {
          systemInstruction: systemInstructions,
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      });
      const responseText = response.text ? response.text.trim() : '{}';
      return res.json(JSON.parse(responseText));
    } catch (err) {
      console.error("Gemini constitution analysis failed:", err);
      return res.json(generateLocalConstitutionSimulation(answers));
    }
  } else {
    return res.json(generateLocalConstitutionSimulation(answers));
  }
});

// 3. Multi-modal Tongue Diagnosis (舌診)
app.post('/api/diagnose/tongue', async (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: '缺少舌像照片數據（imageBase64）。' });
  }

  // Remove data URI prefix if present
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const promptText = `
這是使用者的舌頭局部照片。作為專業的中醫大夫，請為對方的舌診圖像進行細緻的理學觀察：
1. 觀察「舌色」：是淡白、淡紅、紅、絳、還是暗紫？是否夾雜黑斑瘀點？
2. 觀察「舌苔」：是白苔還黃苔？是薄苔、厚苔、腐膩苔、還是部分剝落（地圖舌）？水分是否足夠（潤、燥）？
3. 觀察「舌體」：形狀是否胖大、瘦癟？舌邊是否有深刻齒痕、裂紋？是否有歪斜。
最後，給出中醫辨證病機，以及適合的食療調養與穴位。

回傳格式必須是 JSON 結構：
{
  "tongueColor": "舌色理學觀察結果 (如：舌質淡紅微發暗)",
  "tongueCoating": "舌苔理學觀察結果 (如：舌苔黃膩偏厚，微燥)",
  "tongueShape": "舌體形狀與特徵 (如：舌體胖大，邊有明顯齒痕)",
  "tcmPathology": "中醫病理臟腑提示 (如：脾胃濕熱內蘊，氣虛夾帶痰濕)",
  "dietTips": "日常飲食建議方針與食療配方",
  "acupointTips": "推薦調養的按摩穴位與刺激方向（2個，例如：陰陵泉、豐隆）"
}
請只回傳 JSON 物件。不要包含 markdown 的 括起來。
`;

  if (ai) {
    try {
      const imagePart = {
        inlineData: {
          mimeType: "image/png",
          data: base64Data,
        },
      };
      const textPart = {
        text: promptText,
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });
      const responseText = response.text ? response.text.trim() : '{}';
      return res.json(JSON.parse(responseText));
    } catch (err) {
      console.error("Gemini tongue analysis failed:", err);
      return res.json(generateLocalTongueSimulation());
    }
  } else {
    // Local fallback for tongue analysis
    return res.json(generateLocalTongueSimulation());
  }
});

// 4. Voice Auditive Diagnoses (聞診)
app.post('/api/diagnose/voice', async (req, res) => {
  const { audioBase64, symptomKey, customDesc } = req.body;
  
  // Custom desc or symptom mapping for voice
  let inputSource = customDesc || symptomKey || "中氣微寒、說話有氣無力";

  const promptText = `
使用者提供了一端描述或一段自錄音頻（模擬聞診）。請分析他的聲音共鳴氣力、呼吸和咳嗽聲：
描述或輸入為: "${inputSource}"

請中醫「聞診」角度對其氣力強弱、臟腑氣機、寒熱虛實狀態進行深度分析。
回傳 JSON 格式：
{
  "voiceFeature": "聲音氣力特徵綜合分析 (如: 氣流不暢、音聲低微、咳聲重濁帶痰)",
  "tcmAnalysis": "臟腑氣機機理 (如: 肺脾氣虛，聲門失宣；或肝鬱化火，氣喘急促...)",
  "carePlan": "起居及發聲放鬆調攝計畫",
  "remedy": "有益的發聲護嗓或止咳補氣中醫小偏方配方"
}
請只回傳 JSON 物件。
`;

  if (ai) {
    try {
      let contents: any[] = [];
      if (audioBase64) {
        const cleanAudio = audioBase64.replace(/^data:audio\/\w+;base64,/, "");
        contents.push({
          inlineData: {
            mimeType: "audio/webm", // Common browser audio mime types
            data: cleanAudio
          }
        });
      }
      contents.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: { parts: contents },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      });
      const responseText = response.text ? response.text.trim() : '{}';
      return res.json(JSON.parse(responseText));
    } catch (err) {
      console.error("Gemini voice analysis failed:", err);
      return res.json(generateLocalVoiceSimulation(inputSource));
    }
  } else {
    return res.json(generateLocalVoiceSimulation(inputSource));
  }
});

// 5. Ask Knowledge (中醫大百科補充自定義 AI 卡片)
app.post('/api/knowledge/ask', async (req, res) => {
  const { query, type } = req.body; // type = herb | formula | meridian | general
  if (!query) {
    return res.status(400).json({ error: '請輸入您要探索的中醫藥或經絡知識。' });
  }

  const prompt = `
你是一位學識淵博的中醫學博士、醫經學者。
使用者想要查詢關於「${query}」的知識（分類: ${type || '綜合'}）。
請提供全面、符合中醫正統經典、嚴謹同時通俗易懂的專業解析。
寫法包含性味歸經、中醫病機原理、或者是穴位配伍機理、典籍出處記載、養生合適人群與特殊避忌。
排版應美觀整齊，採用繁體中文，適合在卡片頁面中精緻展示。
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          temperature: 0.6
        }
      });
      const responseText = response.text ? response.text : '目前無法取得 AI 詳細資訊，請檢查網際網路。';
      return res.json({ result: responseText });
    } catch (err) {
      console.error("Gemini knowledge ask failed:", err);
      return res.json({ result: `關於「${query}」：這是中醫常用的調理元素，主要有引氣歸元、健運中焦之妙用。日常可用溫水配合按摩或溫飲調理，若有不適請先諮詢合格中醫藥師。 (此為本地預設建議)` });
    }
  } else {
    return res.json({
      result: `【本地庫模擬】關於《${query}》：\n中醫特色調養指出，「${query}」在日常生活中十分常見。傳統上認為其能調和脾胃，益氣化濕。配以生活起居作息，保持心情抒暢，多做有氧微汗運動（例如八段錦之「調理脾胃單手托」），能極大改善體內氣血循環。若有發燒或不適，請先尋求正規醫學診斷。`
    });
  }
});


// Static Helpers for Local TCM Simulation Mode
function generateLocalSimulationInquiry(messages: any[]) {
  // Simple heuristic based on word matching or turns
  const userMessages = messages.filter(m => m.role === 'user');
  const userText = userMessages.map(m => m.content).join(' ');
  const turnsCount = userMessages.length;

  if (turnsCount < 3) {
    // Keeps dialog alive with relevant TCM followup questions
    let nextMessage = "收到。中醫問診細緻入微，請問您平時：1. 怕冷還是怕熱較明顯？ 2. 爬樓梯或稍微活動一下，會不會很容易出虛汗？";
    if (userText.includes('痛') || userText.includes('酸')) {
      nextMessage = "了解痛感點了。請問這個痛是：1. 悶悶的脹痛，還是尖銳像針刺的刺痛？ 2. 按壓痛處時，是覺得舒服（喜按）還是更不舒服（拒按）？";
    } else if (userText.includes('累') || userText.includes('疲') || userText.includes('睏')) {
      nextMessage = "這是氣虛或濕重常見的表現。請問：1. 您早起是否覺得身體很沉重、像穿了濕衣服？ 2. 看看大便，容易黏馬桶或一天多次拉稀嗎？";
    } else if (userText.includes('失眠') || userText.includes('睡')) {
      nextMessage = "心神不寧導致入眠難。請問您：1. 是躺很久睡不著，還是睡了很容易驚醒、多夢？ 2. 是否常覺得口乾、甚至口苦，到了晚上手心腳心熱呼呼的？";
    }
    return {
      stage: "dialog",
      nextMessage,
      report: null
    };
  } else {
    // Deliver report
    let syndrome = "脾胃虛寒，氣血兩虛證";
    let principle = "溫中健脾，補氣養血";
    let formula = {
      name: "理中湯合八珍湯化裁",
      composition: "黨參（15g）、白朮（12g）、乾薑（9g）、當歸（10g）、白芍（12g）、茯苓（15g）、炙甘草（6g）",
      explanation: "黨參補中益氣為君；乾薑溫中散寒為臣；白朮橾濕燥脾、當歸生血養血為佐；甘草調和臟腑為使。"
    };
    let herbs = ["生薑", "紅棗", "大麥茶", "山藥"];
    let acupoints = [
      { name: "足三里", location: "外膝眼下3寸，脛骨旁一指幅", reason: "胃經要穴，調理脾胃氣血，培土生金", method: "每天點按揉動200下，至發熱" },
      { name: "神闕穴", location: "即肚臍正中", reason: "溫運脾陽，凝聚元氣", method: "適合用暖暖包溫敷或隔薑灸" }
    ];

    if (userText.includes('痛') || userText.includes('生氣') || userText.includes('鬱')) {
      syndrome = "肝鬱氣滯，血行不暢證";
      principle = "疏肝解鬱，活血行氣";
      formula = {
        name: "柴胡疏肝散化裁",
        composition: "柴胡（12g）、香附（10g）、川芎（9g）、陳皮（8g）、白芍（12g）、枳殼（9g）、甘草（6g）",
        explanation: "柴胡疏肝為君，香附行氣、川芎活血舒鬱為臣，陳皮枳殼理氣為佐，甘草調經為使。"
      };
      herbs = ["薄荷", "玫瑰花", "陳皮", "佛手柑"];
      acupoints = [
        { name: "太衝穴", location: "足背第1、2趾骨結合部前方凹陷處", reason: "肝經原穴，排毒降火、解鬱消氣", method: "用大拇指順骨縫往推，每次5分鐘" },
        { name: "行間穴", location: "足背第1、2趾間逢赤白肉際處", reason: "清肝瀉火，舒緩頭脹眼赤", method: "掐按有明顯酸脹痛為準" }
      ];
    } else if (userText.includes('熱') || userText.includes('乾') || userText.includes('火')) {
      syndrome = "陰虛內熱，肝膽火旺證";
      principle = "滋陰清熱，瀉火安神";
      formula = {
        name: "知柏地黃丸加減",
        composition: "知母（10g）、黃柏（9g）、熟地黃（24g）、山茱萸（12g）、牡丹皮（9g）、澤瀉（9g）",
        explanation: "熟地滋補腎陰為君，黃柏知母清下焦熱為臣，澤瀉、丹皮泄熱去油脂為佐。"
      };
      herbs = ["枸杞", "麥門冬", "玉竹", "白菊花"];
      acupoints = [
        { name: "三陰交", location: "內踝尖上3寸，脛骨後緣", reason: "肝脾腎三陰經交會點，滋陰清熱主力", method: "點揉3-5分鐘，略微酸脹為佳" },
        { name: "太谿穴", location: "內踝尖與跟腱之間的凹陷中", reason: "腎經原穴，滋陰補腎、引火歸元", method: "按揉穴位使其產生強烈酸感" }
      ];
    }

    return {
      stage: "report",
      nextMessage: "",
      report: {
        symptomsSummary: "患者感覺明顯不適、手腳體溫或消化存在偏頗，多與日常生活勞倦或飲食不調有關。",
        syndromeIdentification: syndrome,
        explanation: "體內水火氣血未能平衡，氣機受阻或中焦虛寒，導致清陽不升、濁陰不降，因而周身不適、神倦或痠疼。",
        therapeuticPrinciple: principle,
        recommendedFormula: formula,
        recommendedHerbs: herbs,
        acupuncturePoints: acupoints,
        dietaryAdvice: ["飲食宜清淡，定時定量", "晨起飲用暖胃穀物粥"],
        avoidDiet: ["忌冰冷生冷、過度辛辣油炸", "避免睡前暴飲暴食"],
        lifestyleAdvice: ["晚上11點膽經循行前入睡，養護膽氣肝血", "每天練習15分鐘腹式呼吸，平心靜氣"]
      }
    };
  }
}

function generateLocalConstitutionSimulation(answers: any) {
  // Simple heuristic tallies to assign a constitution profile
  let sum = 0;
  Object.values(answers).forEach((v: any) => sum += Number(v));
  
  // Decide constitution based on answer patterns
  let name = "氣虛夾濕熱質";
  let features = "平時稍微動一下就喘、多虛汗，面部泛油、偶爾長暗瘡，大便黏膩不爽，整個人容易犯重嗜睡。";
  let dietAdvice = ["生薑", "薏苡仁", "茯苓", "山藥", "黑豆"];
  let dietAvoids = ["冰鎮寒涼冷飲", "肥甘厚味之火鍋、油炸肉類", "生冷刺身"];
  let tea = {
    name: "健脾雙花去濕茶",
    ingredients: "白扁豆（10g）、茯苓（6g）、陳皮（3g）、菊花（5-6朵）",
    effect: "健脾化濕，清熱明目",
    method: "加入500ml沸水，悶泡15分鐘後，趁熱當茶頻頻溫飲，可反覆沖泡。"
  };
  let lifestyleAdvice = ["飯後適當散步半小時（消食導滯）", "晚上盡量11點前上床入睡，避免傷津化火"];
  let acupoints = ["足三里穴 (重在培土補氣)", "豐隆穴 (祛除體內頑痰重濕)"];

  const average = sum / 9;
  if (average < 2.2) {
    name = "平和質 (健康的體質類型)";
    features = "精力充沛，面色紅潤，食慾與睡眠極佳，性格溫和，對自然環境適應能力較強。";
    dietAdvice = ["五穀雜糧", "四季新鮮時蔬", "適量魚肉清淡烹調"];
    dietAvoids = ["偏食單一品類食物", "長期吃過於辛辣、過於生冷或醃製深加工食品"];
    tea = {
      name: "四季溫和調補茶",
      ingredients: "紅棗（2枚）、枸杞（10粒）、黃耆（3g）",
      effect: "和緩補氣，明目潤燥",
      method: "熱水沖泡5至10分鐘即可飲用，平補氣血、四季皆宜。"
    };
    lifestyleAdvice = ["保持每週3次規律運動", "生活起居保持定時起臥，防風避寒"];
    acupoints = ["足三里 (日常強壯穴)", "涌泉穴 (睡前揉按引火歸元)"];
  } else if (average > 3.8) {
    name = "陽虛寒大質 (畏寒型)";
    features = "特別怕冷，一年四季手腳冰涼，吃生冷容易肚子痛、拉肚子。面色慘白，性格安靜沈默。";
    dietAdvice = ["羊肉", "生薑", "乾薑", "肉桂", "花椒", "韭菜"];
    dietAvoids = ["雪糕、冰品、冰鎮果汁", "西瓜、大白菜、螃蟹等寒性野味物"];
    tea = {
      name: "桂枝乾薑暖胃泡飲",
      ingredients: "乾薑（3g）、肉桂（2g）、紅棗（3枚，去核）",
      effect: "溫中散寒，回陽通脈",
      method: "沸水沖泡半小時，早上或中午後溫熱飲用。能有效溫暖手腳、暖宮調經。"
    };
    lifestyleAdvice = ["每日晚上熱水泡腳20分鐘，水溫40度為宜", "日常多曬太陽，尤其是曬後背脊督脈以激發陽氣"];
    acupoints = ["關元穴 (溫固任脈元氣)", "命門穴 (溫腎陽通督脈)"];
  }

  return {
    name,
    score: Math.min(Math.round(average * 20), 100),
    features,
    dietAdvice,
    dietAvoids,
    herbalTea: tea,
    lifestyleAdvice,
    acupoints
  };
}

function generateLocalTongueSimulation() {
  return {
    tongueColor: "舌質偏淡發暗，舌底靜脈曲張明顯（提示有氣虛血瘀之兆）",
    tongueCoating: "舌苔薄白，前半部稍多，根部黃厚而膩（說明中焦脾胃運化不開，下焦帶有濕熱）",
    tongueShape: "舌體稍微胖大，邊緣可見明顯牙齒壓迫的齒痕（提示體內水濕泛濫，脾虛無法運化）",
    tcmPathology: "中醫病機表現為【脾虛夾濕、血行有滯】。脾胃運化功能減弱，水濕阻滯體內，進而影響氣血流暢。",
    dietTips: "建議多吃溫健脾胃、利濕去濁食物，如紅豆、茯苓、芡實、山藥。避免冰淇淋、喝冰水或吃過甜的蛋糕糖果（甘甜生濕）。",
    acupointTips: "1. 揉按【足三里穴】每天3分鐘：幫助健脾養氣以化濕。\n2. 點壓【三陰交穴】每天50-100下：雙向調理肝脾腎，改善經血與血液循環。"
  };
}

function generateLocalVoiceSimulation(desc: string) {
  let voiceFeature = "聲音低沈無力、語速緩慢，吐字氣短。";
  let tcmAnalysis = "中醫診斷為【肺脾氣虛，宗氣不充】。肺主氣司呼吸，脾為生氣之源，聲音細弱說明元氣虛弱、上氣不接下氣。";
  let carePlan = "說話速度宜放緩，說完一段話再呼吸。每日練習腹式呼吸或太極拳的緩慢吐氣。";
  let remedy = "人參片3片、麥冬5g、五味子3g（生脈散結構）開水悶泡當茶喝。可以補氣養陰、收斂肺氣，增強講話音聲底氣。";

  if (desc.includes('乾咳') || desc.includes('喘')) {
    voiceFeature = "發聲帶有急促喘急，喉乾頻頻乾乾微咳，無痰或少痰。";
    tcmAnalysis = "中醫聞診提示【肺陰虧虛，虛火灼金】。肺失滋潤、肺氣上逆。";
    carePlan = "避免長期待在冷氣房。外出宜戴口罩防塵。使用溫鹽水漱口滋潤聲帶。";
    remedy = "百合10g、沙參5g、雪梨乾2片、冰糖適量，燉水當下午茶點心，能養陰潤肺、清音止咳。";
  } else if (desc.includes('痰') || desc.includes('重')) {
    voiceFeature = "聲音重濁，喉間呼嚕有痰聲，發聲頻繁需要清嗓。";
    tcmAnalysis = "中醫聞診提示【脾失運化，濕聚成痰】。痰濁阻滯氣道，使肺氣上逆。";
    carePlan = "主動控制咳痰。多做深呼吸提氣。晚飯後不要馬上躺下，防止胃氣反流刺激咽頭。";
    remedy = "陳皮1瓣（老陳皮最好）、羅漢果四分之一個，熱水煮10分鐘。能極好降氣化痰、理氣清嗓。";
  }

  return {
    voiceFeature,
    tcmAnalysis,
    carePlan,
    remedy
  };
}


// Vite development integration
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server listening on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
