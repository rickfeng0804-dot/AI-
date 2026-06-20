import React, { useState, useRef, useEffect } from 'react';
import { Camera, Eye, HelpCircle, RefreshCw, Upload, Sparkles, Volume2, Mic, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TongueOutput {
  tongueColor: string;
  tongueCoating: string;
  tongueShape: string;
  tcmPathology: string;
  dietTips: string;
  acupointTips: string;
}

interface VoiceOutput {
  voiceFeature: string;
  tcmAnalysis: string;
  carePlan: string;
  remedy: string;
}

export default function TCMMultimodal() {
  const [activeSubTab, setActiveSubTab] = useState<'tongue' | 'voice'>('tongue');

  // Tongue Scan states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [tongueResult, setTongueResult] = useState<TongueOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Scan states
  const [voiceSymptomKey, setVoiceSymptomKey] = useState('肺氣虛弱，聲音細微');
  const [customVocalDesc, setCustomVocalDesc] = useState('');
  const [recording, setRecording] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [voiceScanning, setVoiceScanning] = useState(false);
  const [voiceResult, setVoiceResult] = useState<VoiceOutput | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 1. Tongue Photo Upload & Scan
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setTongueResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startTongueScan = async () => {
    if (!selectedImage) return;
    setScanning(true);
    setTongueResult(null);

    try {
      const response = await fetch('/api/diagnose/tongue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: selectedImage })
      });
      if (!response.ok) throw new Error('舌診分析失敗。');
      const data = await response.json();
      setTongueResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setTongueResult({
        tongueColor: "舌質偏淡發暗，氣血流通微緩（本地模擬觀察）",
        tongueCoating: "舌苔薄白，舌面水分較少發乾（提示津液略有耗損）",
        tongueShape: "舌體稍微胖大，邊緣可見輕微的壓迫齒痕（提示脾氣虛濕滯）",
        tcmPathology: "中醫辨證病機為【脾虛水濕氾濫、氣血不運】。脾虛則津液不布，凝而生濕。",
        dietTips: "日常調理宜吃利水去濕、溫化中焦的茯苓、扁豆、糙米粥。忌肥甘黏膩甜點與生冷海產。",
        acupointTips: "推薦點壓【足三里穴】及【三陰交穴】每日3分鐘，培元補氣，淡化體內濕阻。"
      });
    } finally {
      setScanning(false);
    }
  };

  // 2. Microphone Audio Capture (聞診)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlobUrl(URL.createObjectURL(audioBlob));

        // Read blob as Base64 to send to backend
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
      setVoiceResult(null);
    } catch (err) {
      console.error("無法開啟麥克風：", err);
      alert("無法啟動音聲錄製，您可以改為在下方手動選擇肺呼吸與說話特徵。");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      // stop stream tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const startVoiceScan = async () => {
    setVoiceScanning(true);
    setVoiceResult(null);

    const payload = {
      audioBase64: audioBase64,
      symptomKey: voiceSymptomKey,
      customDesc: customVocalDesc
    };

    try {
      const response = await fetch('/api/diagnose/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('聞診分析出錯。');
      const data = await response.json();
      setVoiceResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setVoiceResult({
        voiceFeature: `說話中氣有微弱喘急，發聲帶有沙啞濁音：${customVocalDesc || voiceSymptomKey}（本地模擬分析）`,
        tcmAnalysis: "臟腑中焦生發之氣受阻，肺氣不宣。氣管失潤，氣機鬱阻於中脘胸腹，導致時常嘆氣、容易乾咳。",
        carePlan: "飲食避免黏膩大辛之肉物；常喝溫熱開水，少抽菸，每晚呼吸放鬆5分鐘。",
        remedy: "可用老熟陳皮、菊花及沙參各5克泡水。能良好清肺利咽，宣肺化濁。"
      });
    } finally {
      setVoiceScanning(false);
    }
  };

  const resetTongueScan = () => {
    setSelectedImage(null);
    setTongueResult(null);
  };

  const resetVoiceScan = () => {
    setAudioBlobUrl(null);
    setAudioBase64(null);
    setVoiceResult(null);
    setCustomVocalDesc('');
  };

  return (
    <div className="space-y-8" id="tcm-multimodal-view">
      {/* Intro section */}
      <div className="flex gap-4 p-6 bg-stone-50 rounded-2xl border border-stone-200 justify-between items-center">
        <div>
          <h2 className="text-xl font-serif font-semibold text-stone-900">
            多模態智能辨識（望診 & 聞診）
          </h2>
          <p className="text-xs text-stone-605 mt-1">
            結合中醫「舌診望照」與「聲音聞診調養」，使用影像感知提取舌苔、齒痕、舌色病機，分析音聲共鳴力度。
          </p>
        </div>
        <div className="flex bg-white/80 p-1 border border-stone-150 rounded-xl shrink-0">
          <button
            onClick={() => setActiveSubTab('tongue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'tongue'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-905'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            望：AI 舌診鏡頭
          </button>
          <button
            onClick={() => setActiveSubTab('voice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'voice'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-905'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            聞：聽覺氣息辨證
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'tongue' ? (
          /* ==================================
             TONGUE DIAGNOSIS VIEW (望診)
             ================================== */
          <motion.div
            key="tongue-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left box - photo uploader and scanning simulation */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center">
              <span className="text-xs font-bold text-stone-400 mb-4 tracking-wider uppercase">
                舌相圖像採樣框 (Tongue Camera Input)
              </span>

              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-72 border-2 border-dashed border-stone-200 hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer p-6 space-y-3 bg-stone-50/50 hover:bg-stone-50 transition select-none"
                >
                  <div className="w-12 h-12 bg-white rounded-full border border-stone-150 flex items-center justify-center text-stone-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-stone-700">上傳您的舌頭照</p>
                    <p className="text-xs text-stone-400 mt-1 max-w-xs leading-normal">
                      請在光線明亮均勻處，自然伸出舌頭上傳。請避免剛吃完含有染色色素的食物（如咖啡、咖哩）。
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  {/* The Interactive Scanning Viewport */}
                  <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-stone-250 bg-stone-900 group">
                    <img
                      src={selectedImage}
                      alt="舌相照"
                      className="w-full h-full object-contain"
                    />

                    {/* Laser overlay during scan */}
                    {scanning && (
                      <>
                        <div className="absolute inset-x-0 bg-emerald-500/20 h-0.5 shadow-[0_0_15px_#22c55e] animate-[bounce_2.5s_infinite] z-20" />
                        <div className="absolute inset-0 border-4 border-emerald-500/35 flex items-center justify-center z-15 pointer-events-none">
                          <div className="border border-double border-emerald-500 p-2 text-[10px] font-mono text-emerald-400 font-extrabold bg-black/50 tracking-widest uppercase">
                            [+] Scanning Tongue Surface...
                          </div>
                        </div>
                      </>
                    )}

                    {!scanning && !tongueResult && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-white text-stone-800 text-xs font-bold rounded-xl shadow border border-stone-100 flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          重選照片
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={resetTongueScan}
                      className="flex-1 py-2.5 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-605 transition"
                    >
                      清空照片
                    </button>
                    <button
                      onClick={startTongueScan}
                      disabled={scanning}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1"
                    >
                      {scanning ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          舌苔色彩解構中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          智能中醫舌鏡掃描
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Right box - detailed tongue diagnostic report */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm min-h-[300px] flex flex-col">
              {tongueResult ? (
                <div className="space-y-4 flex-1">
                  <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                    <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-emerald-600" />
                      經絡舌鏡病理辨證牋
                    </h3>
                    <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded text-emerald-800 font-bold">
                      望診特徵提取
                    </span>
                  </div>

                  <div className="space-y-3 font-serif">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-stone-700">
                      <div className="p-3 bg-stone-50 rounded-xl">
                        <strong>舌色特徵：</strong>
                        <p className="mt-1 text-stone-850 font-sans">{tongueResult.tongueColor}</p>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-xl">
                        <strong>舌苔特徵：</strong>
                        <p className="mt-1 text-stone-850 font-sans">{tongueResult.tongueCoating}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700">
                      <strong>舌體與特徵定位（如齒痕/裂紋）：</strong>
                      <p className="mt-1 text-stone-850 font-sans">{tongueResult.tongueShape}</p>
                    </div>

                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-stone-700">
                      <strong className="text-emerald-950 block">【中藥辨證病理解構】</strong>
                      <p className="mt-1.5 text-emerald-900 font-sans leading-relaxed">
                        {tongueResult.tcmPathology}
                      </p>
                    </div>

                    <div className="space-y-1 bg-[#FAF6EF] p-4 rounded-xl border border-amber-900/10 text-xs text-stone-700">
                      <strong className="text-red-950 block">【推薦食養方案方針】</strong>
                      <p className="mt-1 text-stone-800 font-sans font-medium">{tongueResult.dietTips}</p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-750">
                      <strong>推薦配合按摩經絡學位：</strong>
                      <p className="mt-1 text-emerald-800 font-sans font-medium">{tongueResult.acupointTips}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-stone-400 space-y-3 font-serif">
                  <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center shadow-inner text-stone-300">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-700">等待舌相上傳</h4>
                    <p className="text-xs text-stone-500 max-w-sm mt-1 leading-relaxed font-sans px-4">
                      上傳舌相照後，AI 將運用專業視覺經氣辨識機制分析舌色、薄厚厚膩苔、齒痕，並推送調脾祛濕配穴指南。
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* ==================================
             VOICE DIAGNOSIS VIEW (聞診)
             ================================== */
          <motion.div
            key="voice-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left box - recorder, select list */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <span className="text-xs font-bold text-stone-400 block tracking-wider uppercase text-center">
                音聲聲情採樣與情志描述 (Vocal Signal Capture)
              </span>

              {/* Dynamic waveform recorder */}
              <div className="p-5 bg-stone-900 rounded-2xl flex flex-col items-center space-y-4 relative overflow-hidden">
                <div className="text-center text-xs text-stone-400 font-mono">
                  {recording ? "[+] Recording Mic Signal..." : "Aural Waveform Simulator"}
                </div>

                {/* Simulated Waveform lines */}
                <div className="h-16 flex items-center gap-1 px-4">
                  {[...Array(24)].map((_, i) => {
                    // Random scale during recording
                    const height = recording ? `${Math.random() * 90 + 10}%` : '15%';
                    return (
                      <div
                        key={i}
                        className="w-1.5 rounded-full bg-emerald-500 transition-all duration-150"
                        style={{ height, minHeight: '4px' }}
                      />
                    );
                  })}
                </div>

                {/* Recording button */}
                <div className="flex flex-col items-center gap-2">
                  {!recording ? (
                    <button
                      onClick={startRecording}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-750 text-white rounded-full text-xs font-semibold shadow transition flex items-center gap-1.5"
                    >
                      <Mic className="w-4 h-4" />
                      啟動錄音 (約5秒)
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold shadow animate-pulse flex items-center gap-1.5"
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                      停止並裁減音律
                    </button>
                  )}

                  {audioBlobUrl && (
                    <div className="pt-2 text-center text-xs space-y-1.5">
                      <audio src={audioBlobUrl} controls className="h-8 max-w-[220px]" />
                      <div className="text-[10px] text-emerald-400 font-mono">
                        音軌擷取完畢！可配合下方選項辨證
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample descriptors selects for fallback */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-500 block">
                  氣息與咳嗽痰聲特點 (Select standard vocal symptom profile)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[
                    "肺氣虛弱，聲音細微",
                    "乾咳不止，氣短喘促",
                    "中氣重濁，有痰鳴聲"
                  ].map(sympt => (
                    <button
                      key={sympt}
                      onClick={() => {
                        setVoiceSymptomKey(sympt);
                        setVoiceResult(null);
                      }}
                      className={`p-2.5 text-xs text-center border rounded-xl font-medium transition ${
                        voiceSymptomKey === sympt
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-500 shadow-sm'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {sympt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 block">
                  手動補充詳細咳嗽/喘促或痰音特徵（可與錄音相輔）
                </label>
                <textarea
                  rows={2}
                  placeholder="例如：講話聲音偏小容易喉嚨乾，經常嘆氣，或者吹到冷风後容易乾乾咳，呼吸不夠深長..."
                  value={customVocalDesc}
                  onChange={e => {
                    setCustomVocalDesc(e.target.value);
                    setVoiceResult(null);
                  }}
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={resetVoiceScan}
                  className="flex-1 py-2 border border-stone-200 hover:bg-stone-50 text-xs font-semibold rounded-xl text-stone-605 transition"
                >
                  清空錄音
                </button>
                <button
                  type="button"
                  onClick={startVoiceScan}
                  disabled={voiceScanning}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1"
                >
                  {voiceScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      音頻特徵解構中...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      聞診氣息學分析
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right box - detailed voice diagnostic report */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm min-h-[300px] flex flex-col">
              {voiceResult ? (
                <div className="space-y-4 flex-1">
                  <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                    <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-emerald-600" />
                      大字聞診音律氣象單
                    </h3>
                    <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded text-emerald-800 font-bold">
                      聞診氣息特徵
                    </span>
                  </div>

                  <div className="space-y-3 font-serif">
                    <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700">
                      <strong>大夫聞音理學觀察：</strong>
                      <p className="mt-1 text-stone-850 font-sans leading-relaxed">
                        {voiceResult.voiceFeature}
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-stone-750">
                      <strong>【臟腑氣機機理解析】</strong>
                      <p className="mt-1.5 text-emerald-900 font-sans leading-relaxed">
                        {voiceResult.tcmAnalysis}
                      </p>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700">
                      <strong>發聲呼吸調養起居調攝：</strong>
                      <p className="mt-1 text-stone-850 font-sans leading-relaxed">
                        {voiceResult.carePlan}
                      </p>
                    </div>

                    <div className="bg-[#FAF6EF] p-4 rounded-xl border border-amber-900/10 text-xs text-stone-700">
                      <strong className="text-red-950 block">【護嗓補氣中醫療效代茶方】</strong>
                      <p className="mt-1.5 text-stone-800 font-sans leading-relaxed">
                        {voiceResult.remedy}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-stone-400 space-y-3 font-serif">
                  <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center shadow-inner text-stone-300">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-700">等待聞診採樣過塞</h4>
                    <p className="text-xs text-stone-500 max-w-sm mt-1 leading-relaxed font-sans px-4">
                      請錄製您說話的嗓音、或呼吸咳嗽聲（或選擇上方典型氣息描述特點），AI 聞診大師將為您推算宗氣強弱與理喉開音代茶包。
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
