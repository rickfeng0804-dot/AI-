import { Herb, Formula, Meridian } from './types';

export const HERBS_DB: Herb[] = [
  {
    id: 'ginseng',
    name: '人參',
    pinyin: 'Rénshēn',
    properties: '甘、微苦，微溫。',
    channels: ['脾', '肺', '心'],
    effects: ['大補元氣', '補脾益肺', '生津止渴', '安神益智'],
    indications: '元氣虛脫、氣短喘促、脾虛食少、神疲乏力、津傷口渴、心悸失眠。',
    contraindications: '實熱證、濕熱證、正氣不虛者忌用。不宜與藜蘆、五靈脂、皂莢同用。服人參期間忌茶與蘿蔔。',
    description: '被譽為「百草之王」，是中藥中大補元氣的聖藥，常用於危重證候的搶救。'
  },
  {
    id: 'huangqi',
    name: '黃耆',
    pinyin: 'Huángqí',
    properties: '甘，溫。',
    channels: ['脾', '肺'],
    effects: ['補氣升陽', '固表止汗', '利水消腫', '托毒排膿', '斂瘡生肌'],
    indications: '脾胃氣虛、中氣下陷（胃下垂、脫肛）、肺虛喘咳、表虛自汗、氣虛水腫、慢性潰瘍久不收口。',
    contraindications: '表實邪盛、氣滯濕阻、陰虛陽亢、瘡癰初起者忌用。',
    description: '補氣之長，尤善補氣升陽與固表止汗，與人參偏於補臟腑之氣不同，黃耆偏於補肌表。'
  },
  {
    id: 'danggui',
    name: '當歸',
    pinyin: 'Dāngguī',
    properties: '甘、辛，溫。',
    channels: ['心', '肝', '脾'],
    effects: ['補血活血', '調經止痛', '潤腸通便'],
    indications: '血虛萎黃、眩暈心悸、月經不調、經閉痛經、虛寒腹痛、風濕痹痛、跌打損傷、腸燥便秘。',
    contraindications: '濕阻中焦、大便溏泄者慎用。',
    description: '中醫補血、活血的第一要藥。古人云：「頭止血，身活血，尾破血」，現今常全用以雙向調血。'
  },
  {
    id: 'chaihu',
    name: '柴胡',
    pinyin: 'Cháihú',
    properties: '苦、辛，微寒。',
    channels: ['肝', '膽', '肺'],
    effects: ['和解退熱', '疏肝解鬱', '升陽舉陷'],
    indications: '外感發熱、寒熱往來（瘧疾）、肝鬱氣滯（胸脅脹痛、月經不調）、中氣下陷之短氣、肛下垂。',
    contraindications: '真陰不足、真陽上亢及氣機上逆者（如吐血、高血壓者）忌用。',
    description: '和解少陽與疏肝解鬱的關鍵藥物，是逍遙散與小柴胡湯的核心。'
  },
  {
    id: 'jinyinhua',
    name: '金銀花',
    pinyin: 'Jīnyínhuā',
    properties: '甘，寒。',
    channels: ['肺', '心', '胃'],
    effects: ['清熱解毒', '疏散風熱'],
    indications: '癰腫疔瘡、喉痹、丹毒、熱毒血痢、風熱感冒、溫病初起。',
    contraindications: '脾胃虛寒及瘡瘍陰證（平塌、流清膿）者忌用。',
    description: '「祛火」首選，清熱解毒功效極佳，治一切內癰外疽，也是涼茶及感冒中成藥的常用成分。'
  },
  {
    id: 'fuling',
    name: '茯苓',
    pinyin: 'Fúlíng',
    properties: '甘、淡，平。',
    channels: ['心', '脾', '腎', '肺'],
    effects: ['利水滲濕', '健脾和胃', '寧心安神'],
    indications: '小便不利、水腫脹滿、痰飲咳嗽、脾虛泄瀉、驚悸失眠。',
    contraindications: '陰虛而無濕熱、虛寒滑精者慎用。',
    description: '藥性平和，利水而不傷正氣。既能滲濕，又能健脾，更能寧心，為「祛濕」必備中藥。'
  },
  {
    id: 'gancao',
    name: '甘草',
    pinyin: 'Gāncǎo',
    properties: '甘，平。',
    channels: ['心', '肺', '脾', '胃'],
    effects: ['補脾益氣', '清熱解毒', '祛痰止咳', '緩急止痛', '調和諸藥'],
    indications: '脾胃虛弱、倦怠乏力、心悸怔忡、咳嗽痰多、脘腹攣痛、四肢攣急疼痛、熱毒瘡瘍。',
    contraindications: '濕盛脹滿、浮腫者忌服。不宜與甘遂、大戟、海藻、芫花同用。',
    description: '「國老」之稱，最著名的和使藥。能引導各藥協同作戰，減少副作用，並能增強體力與緩解痙攣性疼痛。'
  },
  {
    id: 'gouqizi',
    name: '枸杞子',
    pinyin: 'Gǒuqǐzǐ',
    properties: '甘，平。',
    channels: ['肝', '腎'],
    effects: ['滋補肝腎', '益精明目'],
    indications: '虛勞精虧、腰膝酸痛、眩暈耳鳴、內熱消渴、血虛萎黃、目昏不明。',
    contraindications: '外邪實熱、脾虛有濕、大便溏泄者忌服。',
    description: '現代保溫杯界的網紅，是滋補肝腎陰血之聖品，性平力緩，可長期適量泡茶食用。'
  },
  {
    id: 'jiahua',
    name: '菊花',
    pinyin: 'Júhuā',
    properties: '甘、苦，微寒。',
    channels: ['肺', '肝'],
    effects: ['疏散風熱', '平息肝風', '清肝明目', '清熱解毒'],
    indications: '風熱感冒、發熱頭痛、目赤腫痛、眼目昏花、肝陽上亢之頭暈目眩、熱毒瘡瘍。',
    contraindications: '陽虛體質、脾胃虛寒體質或泄瀉者不宜多服。',
    description: '清涼明目的夏秋佳品，黃菊花偏於疏散風熱，白菊花偏於清肝明目，野菊花偏於熱毒癰瘡。'
  },
  {
    id: 'rougui',
    name: '肉桂',
    pinyin: 'Ròuguì',
    properties: '辛、甘，大熱。',
    channels: ['腎', '脾', '心', '肝'],
    effects: ['補火助陽', '引火歸元', '散寒止痛', '溫通經脈'],
    indications: '亡陽虛脫、命門火衰（畏寒肢冷）、陽痿宮冷、腰膝冷痛、腎虛作喘、虛陽上浮。',
    contraindications: '陰虛火旺、裡有實熱及孕婦忌服。不宜與赤石脂同用。',
    description: '溫裏藥的重劑，能溫補命門之火，將上浮的虛火引回下焦（引火歸元）。'
  }
];

export const FORMULAS_DB: Formula[] = [
  {
    id: 'guizhitang',
    name: '桂枝湯',
    pinyin: 'Guìzhī Tāng',
    source: '《傷寒論》',
    effects: ['解肌發表', '調和營衛'],
    indications: '外感風寒表虛證。頭痛發熱、汗出惡風、鼻鳴乾嘔、苔薄白、脈浮緩。',
    components: [
      { role: '君', herbName: '桂枝', dosage: '三兩', purpose: '辛溫助陽，發汗降逆，溫經通絡，抗禦風寒。' },
      { role: '臣', herbName: '白芍', dosage: '三兩', purpose: '酸苦微寒，斂陰佐陽，調和營衛，防桂枝發汗過汗傷陰。' },
      { role: '佐', herbName: '生薑', dosage: '三兩', purpose: '辛溫，助桂枝發表解肌，並能溫胃止嘔。' },
      { role: '佐', herbName: '大棗', dosage: '十二枚', purpose: '甘溫，益氣補中，滋脾生津，助芍藥和營。' },
      { role: '使', herbName: '炙甘草', dosage: '二兩', purpose: '甘平，健脾益氣，和中調藥，使外邪自去而內不傷。' }
    ],
    logic: '此方是「群方之冠」，也是調和營衛、雙向調節氣血體液機制的經典配伍。君藥桂枝剛直，臣藥芍藥柔潤，剛柔並濟，配以薑棗和胃、甘草諧調，完美體現中醫平衡藝術。'
  },
  {
    id: 'xiaoyaosan',
    name: '逍遙散',
    pinyin: 'Xiāoyáo Sǎn',
    source: '《太平惠民和劑局方》',
    effects: ['疏肝解鬱', '健脾養血'],
    indications: '肝鬱血虛脾弱證。兩脅作痛、頭痛目眩、口燥咽乾、神疲食少、月經不調、乳房脹痛、脈弦而虛。',
    components: [
      { role: '君', herbName: '柴胡', dosage: '三錢', purpose: '疏肝解鬱，使肝氣條達。' },
      { role: '臣', herbName: '當歸', dosage: '三錢', purpose: '養血和血，柔肝體（肝為剛臟，喜柔潤）。' },
      { role: '臣', herbName: '白芍', dosage: '三錢', purpose: '養血斂陰，柔肝止痛，與當歸共補肝血。' },
      { role: '佐', herbName: '白朮', dosage: '三錢', purpose: '健脾去濕，使土（脾）充則不受木（肝）克。' },
      { role: '佐', herbName: '茯苓', dosage: '三錢', purpose: '健脾滲濕，助白朮以和中。' },
      { role: '佐', herbName: '煨生薑', dosage: '少許', purpose: '和胃降逆，促辛散血運。' },
      { role: '佐', herbName: '薄荷', dosage: '少許', purpose: '辛涼散熱，助柴胡疏理肝經鬱熱，引藥歸經。' },
      { role: '使', herbName: '炙甘草', dosage: '調和諸藥，益氣健脾。', purpose: '調和諸藥，並健脾土之功。' }
    ],
    logic: '肝屬木，脾屬土，肝氣鬱結則易橫逆犯脾胃。此方一方面「疏肝」（柴胡、薄荷），一方面「養血柔肝」（當歸、白芍），並配合「健脾防傳」（白朮、茯苓、甘草），使肝木調達、脾土安泰，讓人「消遙自得」。'
  },
  {
    id: 'liuwei_dihuang',
    name: '六味地黃丸',
    pinyin: 'Liùwèi Dìhuáng Wán',
    source: '《小兒藥證直訣》',
    effects: ['滋補肝腎'],
    indications: '腎陰虛證。腰膝酸軟、頭暈目眩、耳鳴耳聾、盜汗遺精、消渴、骨蒸潮熱、手足心熱、牙齒動搖、舌紅少苔、脈細數。',
    components: [
      { role: '君', herbName: '熟地黃', dosage: '八錢', purpose: '大補腎血、滋腎陰、益精髓。' },
      { role: '臣', herbName: '山茱萸', dosage: '四錢', purpose: '酸溫滋補肝腎，澀精斂汗（補肝）。' },
      { role: '臣', herbName: '山藥', dosage: '四錢', purpose: '甘平健脾補肺，固腎益精（補脾）。' },
      { role: '佐', herbName: '澤瀉', dosage: '三錢', purpose: '利濕泄腎熱，防熟地黃之滋膩。' },
      { role: '佐', herbName: '牡丹皮', dosage: '三錢', purpose: '清瀉肝火，平山茱萸之溫性。' },
      { role: '佐', herbName: '茯苓', dosage: '三錢', purpose: '淡滲脾濕，助山藥之運化。' }
    ],
    logic: '此方堪稱「三補三瀉」的頂級教科書。熟地、山茱萸、山藥為「三補」，補腎肝脾；澤瀉、丹皮、茯苓為「三瀉」，瀉水清火祛濕。補大於瀉，瀉中求補，補而不膩。'
  },
  {
    id: 'sijunzitang',
    name: '四君子湯',
    pinyin: 'Sìjūnzǐ Tāng',
    source: '《太平惠民和劑局方》',
    effects: ['益氣健脾'],
    indications: '脾胃氣虛證。面色萎黃、語音低微、氣短乏力、食少便溏、舌淡苔白、脈虛弱。',
    components: [
      { role: '君', herbName: '人參', dosage: '三錢', purpose: '甘溫大補，健脾養胃，益氣生津。' },
      { role: '臣', herbName: '白朮', dosage: '三錢', purpose: '苦溫健脾燥濕，助君藥之運化健運。' },
      { role: '佐', herbName: '茯苓', dosage: '三錢', purpose: '淡滲利濕，健脾和胃，使濕去則脾自健。' },
      { role: '使', herbName: '炙甘草', dosage: '二錢', purpose: '甘溫和中，調和諸藥。' }
    ],
    logic: '脾虛則聚濕，此方四味皆溫和敦實，如同君子不偏不倚。人參補氣，白朮健脾，茯苓祛濕（阻斷濕邪損脾），甘草調和。全方補而不滯，溫而不燥，是所有中醫補氣健脾劑（如八珍湯、十全大補湯）的祖方。'
  }
];

export const MERIDIANS_DB: Meridian[] = [
  {
    id: 'lung',
    name: '手太陰肺經',
    english: 'Lung Meridian',
    timeHour: '寅時 (03:00 - 05:00)',
    meridianFlow: '起於中焦（胃部），下絡大腸，回繞胃口，穿過膈肌歸入肺，再從腋下沿上肢內側前緣下行，止於大拇指橈側端。',
    selfCareTip: '此時為人體氣血由靜轉動的深度調養期，肺臟進行排毒淨化，健康者應處於深度睡眠。若此時常易醒，多預示肺氣不足或情緒抑鬱（悲傷），可揉按迎香、尺澤、太淵穴調和。',
    acupoints: [
      {
        name: '列缺穴',
        pinyin: 'Lièquē',
        location: '橈骨莖突上方，腕橫紋上1.5寸。兩手虎口相交，食指尖所指的骨骼凹陷處。',
        anatomy: '橈骨莖突，橈側腕長伸肌腱與拇長展肌腱之間。',
        indications: ['頭痛', '項強（脖子僵硬）', '咳嗽', '氣喘', '咽喉腫痛', '口眼歪斜'],
        method: '食指尖掐按或做順時針揉壓，力量適中，每次3-5分鐘。',
        illustrationTip: '以一手虎口自然交叉，另一手食指尖輕落其橈骨橈側邊緣的微小縫隙凹陷中即是。'
      },
      {
        name: '尺澤穴',
        pinyin: 'Chǐzé',
        location: '肘橫紋中，肱二頭肌腱橈側凹陷處。',
        anatomy: '肱橈肌與肱肌之間，有橈側返動、靜脈。',
        indications: ['咳嗽', '氣喘', '咳血', '潮熱', '咽喉腫痛', '肘臂攣痛'],
        method: '屈肘，以拇指關節揉按、掐揉或直接在大屈肘縫隙處撥動。',
        illustrationTip: '微屈肘，摸到肘部正中那條粗大硬韌的肌腱，其外側（拇指那一側）肘橫紋上的深大凹陷就是。'
      }
    ]
  },
  {
    id: 'large_intestine',
    name: '手陽明大腸經',
    english: 'Large Intestine Meridian',
    timeHour: '卯時 (05:00 - 07:00)',
    meridianFlow: '起於食指末端，沿手背橈側上行入肘，至肩，入缺盆，絡肺，下膈，歸入大腸。支脈從缺盆上頸，經面頰入下齒，左右交會於人中，止於對側鼻翼旁。',
    selfCareTip: '此時大腸經旺，宜「起床一杯溫開水」刺激腸道蠕動，此時最利於排毒與順暢排便，能預防毒素累積，清大腸火、保持肌膚光透。',
    acupoints: [
      {
        name: '合谷穴',
        pinyin: 'Hégǔ',
        location: '手背第1、2掌骨間，第二掌骨橈側中點處。俗稱「虎口」。',
        anatomy: '第一、二掌骨之間，第一骨間背側肌。',
        indications: ['頭痛', '目赤腫痛', '齒痛（牙痛要穴）', '咽喉腫痛', '感冒發熱', '腹痛便秘'],
        method: '以另一手大拇指與食指相對，捏住合谷，朝著食指掌骨方向按壓揉動。孕婦禁按。',
        illustrationTip: '將一手拇指第一關節橫紋放在另一手的虎口邊緣，拇指下落處即是，按壓有極強的酸脹感。'
      },
      {
        name: '迎香穴',
        pinyin: 'Yíngxiāng',
        location: '在面部，鼻翼外緣中點旁，當鼻唇溝中。',
        anatomy: '提上唇肌、面動靜脈分支。',
        indications: ['鼻塞', '鼻竇炎', '過敏性鼻炎', '口眼歪斜', '面部瘙癢'],
        method: '用雙手食指指腹，對稱按揉鼻翼兩側，使局部發熱，能快速通鼻塞。',
        illustrationTip: '鼻翼最外側圓弧中點，向外側平拉遇到法令紋（鼻唇溝）凹陷即是。'
      }
    ]
  },
  {
    id: 'stomach',
    name: '足陽明胃經',
    english: 'Stomach Meridian',
    timeHour: '辰時 (07:00 - 09:00)',
    meridianFlow: '起於鼻翼兩側，上行交會於鼻根，向下循面部下行，沿喉嚨下膈，入胃絡脾。外行支脈沿胸、腹、下肢前外側下行，止於足第二趾外側端。',
    selfCareTip: '此時胃經最旺，為「最適合消化」黃金期。必須吃營養豐富的熱早餐！不吃早餐或食冰冷，會使胃氣受損、中焦冰冷，引起脾虛水腫。',
    acupoints: [
      {
        name: '足三里穴',
        pinyin: 'Zúsānlǐ',
        location: '小腿前外側，外膝眼（獨鼻）下3寸，距脛骨前緣一橫指（中指）。',
        anatomy: '脛骨前肌與趾長伸肌之間。',
        indications: ['胃痛', '嘔吐', '腹脹腹瀉', '消化不良', '失眠心悸', '強壯保健要穴'],
        method: '用大拇指指腹重按、揉壓，局部按至微紅酸脹發熱為宜。',
        illustrationTip: '用手掌心蓋住膝蓋骨（髕骨），食指落在小腿脛骨外側，無名指尖處，有明顯肌肉凹陷。'
      },
      {
        name: '天樞穴',
        pinyin: 'Tiānshū',
        location: '腹部，肚臍旁開2寸。',
        anatomy: '腹直肌及其鞘，有腹壁下動靜脈。',
        indications: ['腹脹腹痛', '便秘', '腹瀉', '消化不良', '痛經'],
        method: '平躺，雙手食指、中指按在肚臍兩側對應位置，順時針揉動放鬆。',
        illustrationTip: '肚臍正中點平移外側約三橫指（2.5寸寬度）的肌肉豐滿處。'
      }
    ]
  },
  {
    id: 'spleen',
    name: '足太陰脾經',
    english: 'Spleen Meridian',
    timeHour: '巳時 (09:00 - 11:00)',
    meridianFlow: '起於足大趾內側端，沿足內側緣、內踝、小腿內側骨後緣上行，經腹、胸，止於大包穴。內行支脈從腹入脾、絡胃，連繫舌本（舌根）。',
    selfCareTip: '脾為後天之本、氣血生化之源。此時脾經運化最旺，將早餐精微轉化為全身能量，不宜劇烈運動，宜溫飲祛濕茶，提高專注力與工作效率。',
    acupoints: [
      {
        name: '三陰交穴',
        pinyin: 'Sānyīnjiāo',
        location: '小腿內側，足內踝尖上3寸，脛骨內側緣後方凹陷中。',
        anatomy: '脛骨後肌後緣，有大隱靜脈。',
        indications: ['婦科疾患（痛經、月經不調、更年期）', '脾胃虛弱', '失眠', '小便不利', '遺精遺尿'],
        method: '以拇指順骨骼邊緣按揉。本穴為肝、脾、腎三條陰經交會點，女性保養神穴。孕婦忌按。',
        illustrationTip: '在足內踝最高點，垂直向上量四橫指（約3寸），在脛骨後側骨頭邊緣凹陷。'
      },
      {
        name: '陰陵泉穴',
        pinyin: 'Yīnlíngquán',
        location: '小腿內側，脛骨內側髁下方凹陷處。',
        anatomy: '脛骨後肌與趾長屈肌之間，有大隱靜脈。',
        indications: ['水腫', '小便不利', '泄瀉', '腹脹', '膝關節痛', '白帶異常'],
        method: '用拇指指腹由下往上推按至骨頭轉角處，有極強刺酸感，為體內「排濕」樞紐。',
        illustrationTip: '沿小腿內側骨頭內側緣，由下往上滑摸，直到手被一個大骨頭關節擋住進不去的臨界凹陷處即是。'
      }
    ]
  },
  {
    id: 'heart',
    name: '手少陰心經',
    english: 'Heart Meridian',
    timeHour: '午時 (11:00 - 13:00)',
    meridianFlow: '起於心中，出屬心系，下膈絡小腸。支脈從心系上行夾咽，連眼球。直行者由心系出肺下至腋窩，沿上肢內側後緣下至掌後銳骨，止於小指橈側端。',
    selfCareTip: '午時乾坤交替，宜「小憩半小時」以養心神。忌暴怒、劇烈運動，有助於平抑心火、保證下半精神飽滿，降低心血管風險。',
    acupoints: [
      {
        name: '神門穴',
        pinyin: 'Shénmén',
        location: '腕部，腕掌側橫紋尺側端，尺側腕屈肌腱的橈側凹陷處。',
        anatomy: '尺側腕屈肌腱橈側緣，尺動靜脈通過。',
        indications: ['失眠（安神第一穴）', '健忘', '心悸', '心痛', '驚悸失眠'],
        method: '用大拇指尖掐按或揉動，按壓時感到酸脹，睡前按壓能有助於快速平定思緒入眠。',
        illustrationTip: '手掌朝上，小指往下平移，在手腕橫紋的邊緣骨頭側，有一條大筋（肌腱）的内側凹陷中。'
      }
    ]
  },
  {
    id: 'liver',
    name: '足厥陰肝經',
    english: 'Liver Meridian',
    timeHour: '丑時 (01:00 - 03:00)',
    meridianFlow: '起於足大趾外側端，上行內踝，循小腿內側，過大腿內側中線，繞陰器入小腹，夾胃絡膽歸肝，上貫膈，沿喉嚨、眼系、出額，交會於百會頂。',
    selfCareTip: '肝藏血、主疏泄、主解毒。此時是肝臟修復、過濾血液的最佳時段。大前提是此時人必須「處於熟睡」。若熬夜，血液無法歸肝，會導致肝火旺旺、目赤腫痛、易怒急躁。',
    acupoints: [
      {
        name: '太衝穴',
        pinyin: 'Tàichōng',
        location: '足背，第一、二蹠骨結合部前方凹陷處。',
        anatomy: '骨間背側肌，有足背靜脈網。',
        indications: ['頭痛頭暈', '高血壓', '急躁易怒（疏肝第一要穴）', '月經不調', '乳房脹痛', '目赤腫痛'],
        method: '用拇指指腹從腳趾指縫往腳踝方向推揉，若有疼點則著重垂直揉按，揉至不痛為佳。',
        illustrationTip: '在腳大趾與腳二趾縫隙，沿腳背骨向上推，推到兩塊骨頭交會卡住的凹陷處。'
      }
    ]
  }
];
