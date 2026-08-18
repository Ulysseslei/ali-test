// ============================================================
// ALI 1.0.1
// Ability Limit Index
// Official Scoring Model (Optimized & Fixed)
//
// 8 Domains
// 32 Core Abilities
// 64 Assessments
//
// L = Limit
// D = Development
// S = Stability
//
// Final Score: 1 ~ 199
// Standard Point: 100
// ============================================================


// ============================================================
// ① ALI 1.0.1 基本設定
// ============================================================

const ALI_CONFIG = {
    MIN_SCORE: 1,
    MAX_SCORE: 199,
    STANDARD_SCORE: 100,
    DOMAIN_COUNT: 8,
    ABILITIES_PER_DOMAIN: 4,
    QUESTIONS_PER_ABILITY: 2,
    STABILITY_BASE: 0.7,
    STABILITY_WEIGHT: 0.3,
    BREADTH_MAX_BONUS: 15,
    BREADTH_CENTER: 0.5,          // corrected from 1 → 0.5 (matches comment)
    BREADTH_MULTIPLIER: 30
};


// ============================================================
// ② 8 大領域 / 32 項核心能力
// ============================================================

const domains = [
    {
        id: "cognitive",
        name: "認知",
        description: "理解、分析、推理與處理資訊的能力。",
        items: [
            { id: "logic", name: "邏輯推理", description: "分析規則、關係與推理結構的能力。" },
            { id: "abstract", name: "抽象理解", description: "理解抽象概念、符號與非具體資訊的能力。" },
            { id: "information", name: "資訊分析", description: "整理、比較與分析資訊的能力。" },
            { id: "memory", name: "記憶能力", description: "接收、保存與提取資訊的能力。" }
        ]
    },
    {
        id: "mathematics",
        name: "數理",
        description: "理解數量、規律、數據與數學關係的能力。",
        items: [
            { id: "quantity", name: "數量理解", description: "理解數量、大小與數值關係的能力。" },
            { id: "sequence", name: "數列推演", description: "發現數列規律並進行推演的能力。" },
            { id: "mathlogic", name: "數學邏輯", description: "使用數學邏輯解決問題的能力。" },
            { id: "data", name: "數據判讀", description: "理解圖表、數據與數值資訊的能力。" }
        ]
    },
    {
        id: "spatial",
        name: "空間",
        description: "理解、操作與想像空間結構的能力。",
        items: [
            { id: "spatial-imagination", name: "空間想像", description: "在腦中建立與操作空間模型的能力。" },
            { id: "solid", name: "立體理解", description: "理解三維物體結構與空間關係的能力。" },
            { id: "rotation", name: "旋轉想像", description: "在腦中旋轉與重新定位物體的能力。" },
            { id: "transformation", name: "圖形轉換", description: "理解圖形變化、翻轉與轉換的能力。" }
        ]
    },
    {
        id: "practical",
        name: "實作",
        description: "將理解轉化為實際操作與問題處理的能力。",
        items: [
            { id: "operation", name: "操作理解", description: "理解工具、設備與物件操作方式的能力。" },
            { id: "coordination", name: "手眼協調", description: "協調視覺資訊與實際動作的能力。" },
            { id: "tool", name: "工具運用", description: "選擇與正確使用工具完成工作的能力。" },
            { id: "troubleshooting", name: "故障處理", description: "發現、分析與處理實際操作問題的能力。" }
        ]
    },
    {
        id: "creative",
        name: "創造",
        description: "產生新想法並建立不同解決方案的能力。",
        items: [
            { id: "divergent", name: "發散思考", description: "從單一問題產生多種可能方向的能力。" },
            { id: "idea", name: "創意生成", description: "產生新想法、新概念與新可能性的能力。" },
            { id: "alternative", name: "替代方案", description: "尋找不同於既有方式之解法的能力。" },
            { id: "design", name: "設計思維", description: "從需求出發建立完整解決方案的能力。" }
        ]
    },
    {
        id: "expression",
        name: "表達",
        description: "理解資訊並將想法清楚傳達給他人的能力。",
        items: [
            { id: "language", name: "語言理解", description: "理解語句、語意與語言資訊的能力。" },
            { id: "writing", name: "文字表達", description: "透過文字清楚傳達想法與資訊的能力。" },
            { id: "explanation", name: "概念說明", description: "將複雜概念整理並解釋清楚的能力。" },
            { id: "communication", name: "溝通能力", description: "與他人交換資訊、想法與意見的能力。" }
        ]
    },
    {
        id: "social",
        name: "社會",
        description: "理解他人、合作與處理社會互動的能力。",
        items: [
            { id: "situation", name: "情境理解", description: "理解不同社會情境與互動脈絡的能力。" },
            { id: "people", name: "他人理解", description: "理解他人想法、需求與行為的能力。" },
            { id: "cooperation", name: "合作能力", description: "與他人共同完成目標的能力。" },
            { id: "conflict", name: "衝突處理", description: "理解、協調與處理意見差異的能力。" }
        ]
    },
    {
        id: "adaptation",
        name: "應變",
        description: "面對變化、壓力與未知情況時調整與決策的能力。",
        items: [
            { id: "reaction", name: "反應速度", description: "面對新資訊或突發情況時快速反應的能力。" },
            { id: "judgement", name: "臨場判斷", description: "在有限資訊與時間下進行判斷的能力。" },
            { id: "strategy", name: "策略調整", description: "根據新資訊快速修改原有策略的能力。" },
            { id: "decision", name: "快速決策", description: "在有限時間內做出合理決定的能力。" }
        ]
    }
];


// ============================================================
// ③ 建立 32 項能力
// ============================================================

const assessmentItems = [];

domains.forEach((domain, domainIndex) => {
    domain.items.forEach((item, itemIndex) => {
        assessmentItems.push({
            ...item,
            domainId: domain.id,
            domainName: domain.name,
            domainIndex,
            itemIndex,
            globalIndex: domainIndex * ALI_CONFIG.ABILITIES_PER_DOMAIN + itemIndex
        });
    });
});


// ============================================================
// ④ ALI 1.0 正式測驗（64 題）
// 每題 5 選項：2 優解 / 2 不錯解 / 1 普通解
// ============================================================

const formalQuestions = [

    // ========================= 認知 =========================
    {
        id: 1,
        ability: "information",
        question: "你正在找一個很久以前看過的網站，但只記得大概內容，你會？",
        options: [
            "直接搜尋當時可能使用的關鍵字",
            "試著回想網站名稱或相關詞，再逐步縮小範圍",
            "問朋友有沒有看過",
            "搜尋幾次找不到就先放棄",
            "從瀏覽器歷史紀錄、收藏等地方一起找"
        ]
    },
    {
        id: 2,
        ability: "information",
        question: "朋友傳給你一段很長的訊息，你覺得內容有點混亂，你會？",
        options: [
            "先看完，再自己整理重點",
            "直接詢問朋友最重要的事情是什麼",
            "挑自己覺得重要的部分先處理",
            "按照訊息出現的順序一件件看",
            "把內容分類後再判斷哪些需要處理"
        ]
    },
    {
        id: 3,
        ability: "memory",
        question: "你發現自己最近常常忘記一些小事情，你會？",
        options: [
            "開始使用提醒或筆記",
            "嘗試找出自己最容易忘記事情的情境",
            "告訴自己之後注意一點",
            "重要的事情才特別記錄",
            "調整自己的日常流程，減少需要記住的事情"
        ]
    },
    {
        id: 4,
        ability: "abstract",
        question: "你看到一個自己完全不了解的新名詞，你會？",
        options: [
            "直接搜尋定義",
            "先從上下文猜意思，再確認資料",
            "問比較了解的人",
            "暫時跳過，之後有需要再查",
            "找不同來源比較它的意思"
        ]
    },
    {
        id: 5,
        ability: "logic",
        question: "你發現兩個人對同一件事情的說法完全不同，你會？",
        options: [
            "先判斷誰講得比較像真的",
            "分別確認兩個人的資訊來源",
            "看哪一種說法比較符合自己原本的認知",
            "兩邊都先保留，不急著下結論",
            "找第三方資料確認"
        ]
    },
    {
        id: 6,
        ability: "abstract",
        question: "你第一次使用一個完全沒接觸過的軟體，你通常會？",
        options: [
            "先自己摸索功能",
            "先找基本操作說明",
            "看到什麼按什麼慢慢試",
            "先請熟悉的人教你",
            "先理解整個操作邏輯，再開始使用"
        ]
    },
    {
        id: 7,
        ability: "memory",
        question: "你需要記住一串比較長的資訊，你會？",
        options: [
            "重複念幾次",
            "把資訊分成幾個小部分",
            "直接看著它直到需要使用",
            "把它和自己熟悉的事情聯想起來",
            "寫下來或使用工具保存"
        ]
    },
    {
        id: 8,
        ability: "logic",
        question: "你發現一個規則在大多數情況下都成立，但有一個例外，你會？",
        options: [
            "直接忽略這個例外",
            "確認例外是不是因為條件不同",
            "重新檢查原本的規則",
            "找更多案例測試這個規則",
            "比較不同條件後重新建立規則"
        ]
    },

    // ========================= 數理 =========================
    {
        id: 9,
        ability: "quantity",
        question: "你去買東西，同一商品有不同容量與價格，你會？",
        options: [
            "直接買最便宜的",
            "比較每單位的價格",
            "選自己平常習慣買的規格",
            "看哪個包裝比較划算",
            "同時考慮價格、容量與自己實際需要"
        ]
    },
    {
        id: 10,
        ability: "data",
        question: "你發現每天花費的金額差異很大，你想知道原因，你會？",
        options: [
            "看最近幾天的紀錄",
            "把支出分成不同類別比較",
            "猜測是不是某幾天特別花錢",
            "先從最大的幾筆支出開始看",
            "比較不同日期、類別與金額之間的關係"
        ]
    },
    {
        id: 11,
        ability: "sequence",
        question: "你正在玩一個有固定規律的遊戲，前幾次出現的數字是 2、4、8、16，你會？",
        options: [
            "猜下一個可能是 32",
            "觀察每次數字之間的變化",
            "直接找朋友確認答案",
            "嘗試看看是不是還有其他可能規律",
            "根據目前資料先提出一個假設，再確認後面的結果"
        ]
    },
    {
        id: 12,
        ability: "quantity",
        question: "你有 1000 元，要安排一整天的活動，你會？",
        options: [
            "先決定最想做的事情",
            "先列出可能花錢的項目",
            "先估算每項大概需要多少",
            "花到剩下不多再停止",
            "預留一部分作為臨時支出"
        ]
    },
    {
        id: 13,
        ability: "data",
        question: "你看到一張統計圖，某個數字突然比其他數字高很多，你會？",
        options: [
            "直接認為那一天發生了特殊情況",
            "先確認資料的時間與分類方式",
            "看其他相關數據是否也有類似變化",
            "覺得最高的那個數字最值得注意",
            "先找出造成差異的可能原因"
        ]
    },
    {
        id: 14,
        ability: "mathlogic",
        question: "你和朋友一起分攤一筆費用，但每個人使用的東西不同，你會？",
        options: [
            "平均分",
            "根據每個人的實際使用量計算",
            "先討論大家都能接受的方式",
            "由其中一個人先算，再讓大家確認",
            "把共同費用與個人費用分開處理"
        ]
    },
    {
        id: 15,
        ability: "sequence",
        question: "你觀察到一組數字的變化沒有立即看出規律，你會？",
        options: [
            "先比較相鄰數字的差異",
            "嘗試比較乘除或其他變化",
            "直接猜下一個數字",
            "把數字重新整理後觀察",
            "同時檢查差值、倍數與位置關係"
        ]
    },
    {
        id: 16,
        ability: "mathlogic",
        question: "一個問題有好幾個計算步驟，你會？",
        options: [
            "直接開始計算",
            "先確認已知條件",
            "按照想到的順序計算",
            "先決定最後需要得到什麼",
            "把問題拆成幾個步驟再逐步計算"
        ]
    },

    // ========================= 空間 =========================
    {
        id: 17,
        ability: "spatial-imagination",
        question: "你買了一個比較大的物品，需要放進房間，你會？",
        options: [
            "直接試著搬進去",
            "先量房間與物品尺寸",
            "看看哪個位置看起來比較適合",
            "先想像搬進去後可能怎麼轉向",
            "同時考慮尺寸、入口與移動路線"
        ]
    },
    {
        id: 18,
        ability: "solid",
        question: "你看到一張家具組裝圖，但圖中零件方向很難看懂，你會？",
        options: [
            "先找出每個零件的形狀",
            "對照實際零件慢慢確認",
            "直接按照圖上的順序組裝",
            "從不同角度想像零件的位置",
            "先確認哪些零件彼此應該連接"
        ]
    },
    {
        id: 19,
        ability: "spatial-imagination",
        question: "你要去一個第一次去的地方，地圖上的路線很複雜，你會？",
        options: [
            "先記住幾個主要轉彎點",
            "直接開導航跟著走",
            "先理解整體方向",
            "把路線分成幾個區段",
            "同時記住地標與方向"
        ]
    },
    {
        id: 20,
        ability: "rotation",
        question: "你把一個物品旋轉 90 度後，想知道它的某個部位會在哪裡，你會？",
        options: [
            "在腦中想像旋轉後的位置",
            "實際拿東西轉一次",
            "看物品原本的方向",
            "把旋轉拆成幾個步驟思考",
            "從另一個角度重新確認"
        ]
    },
    {
        id: 21,
        ability: "transformation",
        question: "你要把幾個不同大小的東西放進一個箱子，你會？",
        options: [
            "先放最大的",
            "先估算每個東西佔用的空間",
            "直接開始嘗試排列",
            "先找出形狀比較規則的物品",
            "根據形狀與剩餘空間調整排列"
        ]
    },
    {
        id: 22,
        ability: "solid",
        question: "你看到一個陌生的立體結構，你想知道它從側面看會是什麼樣子，你會？",
        options: [
            "從不同方向觀察",
            "在腦中想像側視角",
            "畫出自己看到的形狀",
            "找一個類似的實體參考",
            "把立體結構拆成幾個簡單部分"
        ]
    },
    {
        id: 23,
        ability: "rotation",
        question: "你看到一個物體的圖片，想知道它轉向另一個方向後哪些部分會改變位置，你會？",
        options: [
            "直接在腦中旋轉它",
            "找出物體最明顯的特徵當作參考",
            "猜一個可能的位置",
            "把旋轉分成幾個階段思考",
            "同時追蹤多個特徵的位置變化"
        ]
    },
    {
        id: 24,
        ability: "transformation",
        question: "一個圖形經過翻轉與移動後變成另一個圖形，你想確認兩者的關係，你會？",
        options: [
            "比較兩個圖形的外形",
            "找出幾個固定特徵",
            "直接認為兩個圖形不同",
            "逐步確認翻轉與移動的方向",
            "從多個角度確認圖形是否能完全對應"
        ]
    },

    // ========================= 實作 =========================
    {
        id: 25,
        ability: "operation",
        question: "你第一次使用一項新工具，你會？",
        options: [
            "先看使用方式",
            "直接小心試用",
            "問別人怎麼使用",
            "先確認它適合做什麼",
            "先了解可能出現的問題再操作"
        ]
    },
    {
        id: 26,
        ability: "troubleshooting",
        question: "你正在組裝一個東西，但裝到一半發現零件對不上，你會？",
        options: [
            "拆回去確認哪一步出錯",
            "稍微調整看看能不能裝上",
            "重新看一次說明",
            "找出造成尺寸或方向不一致的原因",
            "暫停操作並確認零件是否拿錯"
        ]
    },
    {
        id: 27,
        ability: "tool",
        question: "你需要完成一個需要多個工具的工作，你會？",
        options: [
            "先把可能需要的工具都拿出來",
            "按照工作順序準備工具",
            "缺什麼再找什麼",
            "先確認每個工具的用途",
            "先規劃流程再決定工具"
        ]
    },
    {
        id: 28,
        ability: "troubleshooting",
        question: "你發現某個設備突然不能正常運作，你會？",
        options: [
            "先重新操作一次",
            "檢查最基本的設定",
            "直接詢問熟悉的人",
            "根據症狀逐步排查",
            "比較正常狀態與現在的差異"
        ]
    },
    {
        id: 29,
        ability: "coordination",
        question: "你需要自己完成一個不熟悉的 DIY 工作，你會？",
        options: [
            "找教學影片",
            "先理解大致流程",
            "一邊做一邊學",
            "準備可能需要的材料",
            "先確認容易出錯的地方"
        ]
    },
    {
        id: 30,
        ability: "tool",
        question: "你完成一項實作後，發現結果和預期有些不同，你會？",
        options: [
            "先看看差異在哪裡",
            "重新做一次",
            "接受結果，只要還能使用就好",
            "找出造成差異的原因",
            "調整方法後再測試"
        ]
    },
    {
        id: 31,
        ability: "operation",
        question: "你拿到一個從沒使用過的設備，而且需要完成一項簡單工作，你會？",
        options: [
            "先找出最基本的操作方式",
            "直接小心嘗試",
            "先把所有按鈕都試一次",
            "先確認操作流程與注意事項",
            "先了解設備用途，再按照正確流程操作"
        ]
    },
    {
        id: 32,
        ability: "coordination",
        question: "你第一次進行需要同時觀察與操作的工作，你會？",
        options: [
            "先慢慢做一次",
            "先確認動作與目標的位置",
            "直接提高速度練習",
            "把動作拆成幾個簡單步驟",
            "先建立穩定的操作節奏，再逐漸提高速度"
        ]
    },

    // ========================= 創造 =========================
    {
        id: 33,
        ability: "divergent",
        question: "老師要求你用一個普通物品想出不同用途，你會？",
        options: [
            "想它原本功能之外的用途",
            "從生活中找可能的應用",
            "先參考別人的想法",
            "嘗試把它和其他物品結合",
            "想一些比較少見的用途"
        ]
    },
    {
        id: 34,
        ability: "alternative",
        question: "你發現目前使用的方法很麻煩，你會？",
        options: [
            "嘗試找更簡單的方法",
            "調整其中幾個步驟",
            "繼續使用原本的方法",
            "思考能不能完全換一種方式",
            "比較幾種不同方法後選擇"
        ]
    },
    {
        id: 35,
        ability: "idea",
        question: "朋友請你想一個聚會活動，你會？",
        options: [
            "提出自己想到的活動",
            "先問大家喜歡什麼",
            "參考以前成功的活動",
            "嘗試設計一個新的玩法",
            "把幾種活動元素組合起來"
        ]
    },
    {
        id: 36,
        ability: "design",
        question: "你要設計一個讓人更容易記住東西的方法，你會？",
        options: [
            "使用圖像",
            "使用故事或聯想",
            "直接重複很多次",
            "把不同方法組合",
            "先分析自己為什麼會忘記，再設計方法"
        ]
    },
    {
        id: 37,
        ability: "alternative",
        question: "你發現一個現有產品有一個小缺點，你會？",
        options: [
            "想想能不能改掉這個缺點",
            "看看其他產品怎麼處理",
            "接受這個缺點",
            "思考是否能重新設計這項功能",
            "想一個完全不同的解決方向"
        ]
    },
    {
        id: 38,
        ability: "design",
        question: "你突然被要求解決一個沒有標準答案的問題，你會？",
        options: [
            "先提出一個可行的方法",
            "列出幾種可能方案",
            "參考類似問題的處理方式",
            "嘗試從不同角度重新定義問題",
            "先找出限制條件，再設計方案"
        ]
    },
    {
        id: 39,
        ability: "divergent",
        question: "你需要為一個問題提出新的解決方向，你會？",
        options: [
            "提出一個方法",
            "列出幾種不同可能性",
            "參考別人已經使用的方法",
            "故意從不同角度重新思考",
            "先大量產生可能方案，再篩選可行的方法"
        ]
    },
    {
        id: 40,
        ability: "idea",
        question: "你要設計一個以前沒有做過的小型活動，你會？",
        options: [
            "提出一個想法",
            "從其他活動找靈感",
            "直接使用以前成功的活動",
            "把不同活動元素重新組合",
            "從活動目的出發建立一個新的玩法"
        ]
    },

    // ========================= 表達 =========================
    {
        id: 41,
        ability: "explanation",
        question: "你要向一個完全不了解某件事情的人解釋它，你會？",
        options: [
            "從最基本的概念開始",
            "直接講重點",
            "用生活中的例子說明",
            "先確認對方知道多少",
            "根據對方的理解程度調整說法"
        ]
    },
    {
        id: 42,
        ability: "communication",
        question: "朋友誤會了你的意思，你會？",
        options: [
            "再解釋一次",
            "換一種說法",
            "告訴他你原本真正想表達什麼",
            "先問他理解成什麼",
            "找出是哪一部分造成誤會"
        ]
    },
    {
        id: 43,
        ability: "writing",
        question: "你需要把一件複雜的事情寫成簡短訊息，你會？",
        options: [
            "先整理最重要的資訊",
            "把細節全部刪掉",
            "用條列方式整理",
            "先確認讀者最需要知道什麼",
            "用簡單的例子輔助說明"
        ]
    },
    {
        id: 44,
        ability: "communication",
        question: "你和別人討論一件事情時，對方一直無法理解你的想法，你會？",
        options: [
            "再說一次",
            "換一個例子",
            "問對方哪裡不理解",
            "調整自己的表達方式",
            "從對方的角度重新說明"
        ]
    },
    {
        id: 45,
        ability: "language",
        question: "你看到一個你不同意的觀點，你會？",
        options: [
            "先理解對方為什麼這樣想",
            "直接提出自己的理由",
            "找資料支持自己的看法",
            "比較雙方的理由",
            "找出彼此可能同意的部分"
        ]
    },
    {
        id: 46,
        ability: "explanation",
        question: "你需要向多人說明一件事情，你會？",
        options: [
            "先整理內容順序",
            "把最重要的事情放前面",
            "準備一些例子",
            "預想大家可能會問什麼",
            "根據現場反應調整說明方式"
        ]
    },
    {
        id: 47,
        ability: "language",
        question: "你看到一段比較複雜的文字，第一次閱讀時不太理解，你會？",
        options: [
            "重新讀一次",
            "找出關鍵詞",
            "直接跳過不理解的部分",
            "根據前後文推測意思",
            "拆解句子與上下文後重新理解整體意思"
        ]
    },
    {
        id: 48,
        ability: "writing",
        question: "你需要寫一段文字向別人說明一件事情，你會？",
        options: [
            "直接把想到的內容寫下來",
            "先整理主要重點",
            "盡量加入所有細節",
            "依照事情發生的順序整理",
            "先確認讀者需要知道什麼，再安排內容"
        ]
    },

    // ========================= 社會 =========================
    {
        id: 49,
        ability: "cooperation",
        question: "你和朋友一起完成一件事情，但大家的想法不同，你會？",
        options: [
            "先聽每個人的想法",
            "提出一個折衷方案",
            "讓大家投票",
            "找出大家共同的目標",
            "依照不同人的優勢分配工作"
        ]
    },
    {
        id: 50,
        ability: "people",
        question: "你發現朋友今天的表現和平常不太一樣，你會？",
        options: [
            "直接問他怎麼了",
            "先觀察一下",
            "等他自己說",
            "根據他的情緒與行為推測原因",
            "找適當的時機關心他"
        ]
    },
    {
        id: 51,
        ability: "cooperation",
        question: "團隊中有人一直沒有完成自己的工作，你會？",
        options: [
            "直接提醒他",
            "問他是不是遇到問題",
            "自己先把事情做掉",
            "和他討論怎麼完成",
            "重新確認團隊分工是否合理"
        ]
    },
    {
        id: 52,
        ability: "conflict",
        question: "你和朋友對一件事情產生爭執，你會？",
        options: [
            "先讓自己冷靜",
            "說明自己的理由",
            "聽對方完整說完",
            "找出真正產生分歧的地方",
            "暫時停止爭論，之後再討論"
        ]
    },
    {
        id: 53,
        ability: "situation",
        question: "你加入一個完全陌生的團體，你會？",
        options: [
            "先觀察大家怎麼互動",
            "主動和其中幾個人聊天",
            "等別人主動找你",
            "找機會參與共同活動",
            "先了解這個團體的規則與習慣"
        ]
    },
    {
        id: 54,
        ability: "situation",
        question: "你發現自己的決定可能會影響其他人，你會？",
        options: [
            "先告訴相關的人",
            "先考慮可能造成的影響",
            "按照自己的原計畫進行",
            "和受影響的人討論",
            "視情況調整自己的方案"
        ]
    },
    {
        id: 55,
        ability: "people",
        question: "你和別人合作時，發現對方的反應和平常不同，你會？",
        options: [
            "直接詢問對方",
            "先觀察對方的行為",
            "認為對方只是今天狀態不好",
            "根據當下情況推測可能原因",
            "觀察情境、行為與溝通內容後再決定如何應對"
        ]
    },
    {
        id: 56,
        ability: "conflict",
        question: "兩個人對同一件事情有明顯不同的看法，你被要求協助處理，你會？",
        options: [
            "先讓雙方把自己的想法說完",
            "找出雙方真正不同的地方",
            "直接選一個比較合理的方案",
            "尋找雙方都可以接受的方案",
            "先釐清雙方的需求與限制，再協調解決方式"
        ]
    },

    // ========================= 應變 =========================
    {
        id: 57,
        ability: "reaction",
        question: "你準備出門時突然發現原本的交通方式無法使用，你會？",
        options: [
            "找替代交通方式",
            "重新確認有哪些可行選項",
            "改變出發時間",
            "直接取消行程",
            "根據時間與成本選擇替代方案"
        ]
    },
    {
        id: 58,
        ability: "judgement",
        question: "你正在做一件重要的事情，突然有人提供一個新的資訊，你會？",
        options: [
            "先確認資訊是否可靠",
            "看它會不會影響原本的計畫",
            "直接按照新資訊修改",
            "暫時記住，完成目前事情再處理",
            "比較原方案與新方案"
        ]
    },
    {
        id: 59,
        ability: "strategy",
        question: "你原本安排好的計畫突然被打亂，你會？",
        options: [
            "先確認哪些事情還能照原計畫",
            "重新安排優先順序",
            "先處理眼前最急的事情",
            "直接重新開始規劃",
            "根據新的條件調整原本計畫"
        ]
    },
    {
        id: 60,
        ability: "decision",
        question: "你正在處理一件事情，時間突然比預期少很多，你會？",
        options: [
            "加快速度完成",
            "先找出最重要的部分",
            "刪掉比較不重要的步驟",
            "重新評估能做到什麼程度",
            "根據剩餘時間重新安排工作"
        ]
    },
    {
        id: 61,
        ability: "reaction",
        question: "你第一次遇到一個完全沒看過的問題，你會？",
        options: [
            "先嘗試理解問題",
            "找以前遇過的類似情況",
            "直接嘗試一個方法",
            "列出幾個可能原因",
            "先判斷哪些資訊是自己缺少的"
        ]
    },
    {
        id: 62,
        ability: "judgement",
        question: "你正在做決定，但目前掌握的資訊並不完整，你會？",
        options: [
            "先取得更多資訊",
            "根據目前資訊做暫時判斷",
            "等資訊完整再決定",
            "比較不同選擇可能產生的結果",
            "判斷哪些未知因素真正重要"
        ]
    },
    {
        id: 63,
        ability: "decision",
        question: "事情突然發生變化，而且你只有很短時間可以處理，你會？",
        options: [
            "先處理最緊急的部分",
            "快速判斷目前有哪些選擇",
            "按照原本計畫繼續",
            "先做一個暫時決定，再視情況調整",
            "迅速確認限制條件後選擇可行方案"
        ]
    },
    {
        id: 64,
        ability: "strategy",
        question: "你看到一個平常使用的東西，你想讓它變得更有趣，你會？",
        options: [
            "增加一個新的功能",
            "思考它還能和什麼結合",
            "改變它的外觀",
            "嘗試完全不同的使用方式",
            "從使用者需求出發重新想像它的用途"
        ]
    }
];


// ============================================================
// ⑤ 64 題答案分數設定
// 分數範圍：1 ~ 5
// 1 = 較弱  2 = 偏弱  3 = 中等  4 = 良好  5 = 高度成熟
// ============================================================

const ANSWER_SCORES = {
    // 認知
    1:  [3, 4, 2, 1, 5],
    2:  [4, 2, 3, 2, 5],
    3:  [4, 5, 1, 2, 5],
    4:  [3, 4, 2, 2, 5],
    5:  [2, 4, 1, 3, 5],
    6:  [4, 3, 2, 2, 5],
    7:  [3, 4, 1, 3, 5],
    8:  [1, 4, 4, 4, 5],

    // 數理
    9:  [1, 4, 2, 3, 5],
    10: [3, 4, 2, 3, 5],
    11: [3, 4, 1, 4, 5],
    12: [3, 4, 4, 1, 5],
    13: [1, 4, 4, 2, 5],
    14: [2, 5, 3, 3, 5],
    15: [4, 4, 1, 3, 5],
    16: [2, 4, 2, 4, 5],

    // 空間
    17: [2, 4, 1, 4, 5],
    18: [4, 4, 2, 5, 5],
    19: [4, 2, 4, 4, 5],
    20: [4, 3, 2, 4, 5],
    21: [4, 4, 2, 3, 5],
    22: [4, 5, 3, 2, 5],
    23: [4, 4, 1, 4, 5],
    24: [3, 4, 1, 4, 5],

    // 實作
    25: [3, 4, 2, 4, 5],
    26: [4, 3, 4, 5, 5],
    27: [4, 4, 2, 3, 5],
    28: [3, 4, 2, 5, 5],
    29: [4, 4, 3, 3, 5],
    30: [4, 3, 1, 5, 5],
    31: [4, 4, 1, 4, 5],
    32: [3, 4, 1, 4, 5],

    // 創造
    33: [4, 4, 2, 5, 5],
    34: [4, 4, 1, 5, 5],
    35: [4, 3, 2, 5, 5],
    36: [4, 4, 2, 5, 5],
    37: [4, 3, 1, 5, 5],
    38: [4, 4, 3, 5, 5],
    39: [3, 4, 3, 5, 5],
    40: [4, 3, 2, 5, 5],

    // 表達
    41: [4, 3, 4, 5, 5],
    42: [3, 4, 4, 5, 5],
    43: [4, 2, 4, 5, 5],
    44: [3, 4, 5, 5, 5],
    45: [5, 3, 4, 5, 5],
    46: [4, 4, 4, 5, 5],
    47: [3, 4, 1, 4, 5],
    48: [3, 4, 2, 4, 5],

    // 社會
    49: [4, 4, 3, 5, 5],
    50: [4, 4, 2, 4, 5],
    51: [3, 4, 1, 5, 5],
    52: [4, 4, 5, 5, 4],
    53: [5, 4, 2, 4, 5],
    54: [4, 5, 2, 5, 5],
    55: [4, 4, 2, 4, 5],
    56: [4, 5, 2, 5, 5],

    // 應變
    57: [4, 4, 3, 1, 5],
    58: [5, 4, 2, 3, 5],
    59: [4, 5, 4, 3, 5],
    60: [3, 5, 4, 5, 5],
    61: [4, 4, 3, 4, 5],
    62: [5, 4, 3, 5, 5],
    63: [5, 4, 2, 4, 5],
    64: [4, 4, 3, 5, 5]
};


// ============================================================
// ⑥ 工具函式
// ============================================================

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function average(values) {
    if (!values.length) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}


// ============================================================
// ⑦ 選項分數 → L / D / S 轉換
// 設計原則：
// - 分數越高，Limit、Development、Stability 同步提升
// - 中高分時 Stability 稍微領先（反映成熟度）
// - 低分時 Stability 較低（反映不穩定）
// ============================================================

function convertOptionScoreToLDS(score) {
    const s = clamp(Number(score), 1, 5);

    // 對應表（可依需求微調）
    const table = {
        1: { L: 20, D: 15, S: 25 },
        2: { L: 40, D: 35, S: 45 },
        3: { L: 60, D: 55, S: 60 },
        4: { L: 80, D: 80, S: 85 },
        5: { L: 100, D: 100, S: 100 }
    };

    return table[s];
}


// ============================================================
// ⑧ 取得單題答案分數
// ============================================================

function getAnswerScore(questionId, answerIndex) {
    const scores = ANSWER_SCORES[questionId];
    if (!scores) {
        console.warn(`ALI：找不到第 ${questionId} 題的答案分數設定`);
        return 1;
    }
    if (answerIndex < 0 || answerIndex >= scores.length) {
        console.warn(`ALI：第 ${questionId} 題的答案索引錯誤`);
        return 1;
    }
    return scores[answerIndex];
}


// ============================================================
// ⑨ 計算原始總分（備用）
// ============================================================

function calculateRawScore(answers) {
    let totalScore = 0;
    let answeredCount = 0;

    answers.forEach((answer, index) => {
        if (answer === null || answer === undefined) return;
        const questionId = index + 1;
        totalScore += getAnswerScore(questionId, answer);
        answeredCount++;
    });

    return { totalScore, answeredCount };
}


// ============================================================
// ⑩ 使用者答案與題目執行時資料
// ============================================================

const answers = formalQuestions.map(() => null);
const questionRuntimeOptions = {};


// ============================================================
// ⑪ 建立正式測驗題目（打散選項）
// ============================================================

function prepareQuestionRuntime() {
    formalQuestions.forEach(question => {
        const scores = ANSWER_SCORES[question.id];

        if (!scores || scores.length !== 5) {
            console.error(`ALI：第 ${question.id} 題分數設定異常`);
            return;
        }

        const runtimeOptions = question.options.map((text, index) => ({
            text,
            originalIndex: index,
            score: scores[index]
        }));

        questionRuntimeOptions[question.id] = shuffleArray(runtimeOptions);
    });
}


// ============================================================
// ⑫ 使用者資料與當前領域
// ============================================================

let userData = {
    name: "",
    age: "",
    code: ""
};

let currentDomain = 0;


// ============================================================
// ⑬ DOM 元素
// ============================================================

const homePage         = document.getElementById("home-page");
const profilePage      = document.getElementById("profile-page");
const testPage         = document.getElementById("test-page");
const resultPage       = document.getElementById("result-page");
const startButton      = document.getElementById("start-button");
const viewResultButton = document.getElementById("view-result-button");
const beginTestButton  = document.getElementById("begin-test");
const previousButton   = document.getElementById("previous-button");
const nextButton       = document.getElementById("next-button");


// ============================================================
// ⑭ 頁面切換
// ============================================================

function showPage(page) {
    document.querySelectorAll(".page").forEach(el => el.classList.remove("active"));
    page.classList.add("active");
    window.scrollTo(0, 0);
}


// ============================================================
// ⑮ 首頁 → 個人資料
// ============================================================

if (startButton) {
    startButton.addEventListener("click", () => {
        showPage(profilePage);
    });
}


// ============================================================
// ⑯ 查看上次結果
// ============================================================

if (viewResultButton) {
    viewResultButton.addEventListener("click", () => {
        const saved = localStorage.getItem("ALI_LAST_RESULT");
        if (!saved) {
            alert("目前沒有儲存的測驗結果。");
            return;
        }
        const data = JSON.parse(saved);
        userData = data.userData;
        showResult(data.result);
    });
}


// ============================================================
// ⑰ 個人資料 → 測驗
// ============================================================

if (beginTestButton) {
    beginTestButton.addEventListener("click", () => {
        const nameInput = document.getElementById("name");
        const ageInput  = document.getElementById("age");
        const codeInput = document.getElementById("code");

        userData.name = nameInput ? nameInput.value.trim() : "";
        userData.age  = ageInput  ? ageInput.value : "";
        userData.code = codeInput ? codeInput.value.trim() : "";

        if (!userData.name) {
            alert("請輸入測驗者名稱");
            if (nameInput) nameInput.focus();
            return;
        }

        if (!userData.age) {
            alert("請選擇年齡區間");
            if (ageInput) ageInput.focus();
            return;
        }

        currentDomain = 0;
        answers.fill(null);
        prepareQuestionRuntime();
        showPage(testPage);
        loadDomain();
    });
}


// ============================================================
// ⑱ 取得各領域題目
// ============================================================

function getQuestionsForDomain(domainIndex) {
    const domain = domains[domainIndex];
    return formalQuestions.filter(question => {
        const ability = assessmentItems.find(item => item.id === question.ability);
        return ability && ability.domainId === domain.id;
    });
}


// ============================================================
// ⑲ 載入正式題目
// ============================================================

function loadDomain() {
    const domain = domains[currentDomain];

    const title = document.getElementById("domain-title");
    if (title) title.textContent = domain.name;

    const number = document.getElementById("domain-number");
    if (number) number.textContent = `${String(currentDomain + 1).padStart(2, "0")} / 08`;

    const description = document.getElementById("domain-description");
    if (description) {
        description.textContent = domain.description + " 請選擇最符合你平常做法的選項。";
    }

    const container = document.getElementById("assessment-container");
    if (!container) return;

    container.innerHTML = "";

    const domainQuestions = getQuestionsForDomain(currentDomain);

    domainQuestions.forEach(question => {
        const card = document.createElement("div");
        card.className = "assessment-card";

        const runtimeOptions = questionRuntimeOptions[question.id];

        card.innerHTML = `
            <div class="assessment-header">
                <div>
                    <span class="assessment-number">${String(question.id).padStart(2, "0")}</span>
                    <h3>${question.question}</h3>
                </div>
            </div>
            <div class="formal-options">
                ${runtimeOptions.map((option, displayIndex) => `
                    <label class="formal-option">
                        <input
                            type="radio"
                            name="question-${question.id}"
                            value="${displayIndex}"
                            ${answers[question.id - 1] === displayIndex ? "checked" : ""}
                        >
                        <span>${option.text}</span>
                    </label>
                `).join("")}
            </div>
        `;

        container.appendChild(card);

        const radios = card.querySelectorAll(`input[name="question-${question.id}"]`);
        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                answers[question.id - 1] = Number(radio.value);
            });
        });
    });

    updateProgress();
    updateNavigation();
}


// ============================================================
// ⑳ 進度條
// ============================================================

function updateProgress() {
    const progressBar = document.getElementById("progress-bar");
    if (!progressBar) return;
    const progress = ((currentDomain + 1) / ALI_CONFIG.DOMAIN_COUNT) * 100;
    progressBar.style.width = `${progress}%`;
}


// ============================================================
// ㉑ 導航按鈕
// ============================================================

function updateNavigation() {
    if (previousButton) {
        previousButton.disabled = currentDomain === 0;
    }
    if (nextButton) {
        nextButton.textContent =
            currentDomain === ALI_CONFIG.DOMAIN_COUNT - 1
                ? "完成 ALI 評估"
                : "下一領域 →";
    }
}


// ============================================================
// ㉒ 上一領域
// ============================================================

if (previousButton) {
    previousButton.addEventListener("click", () => {
        if (currentDomain > 0) {
            currentDomain--;
            loadDomain();
        }
    });
}


// ============================================================
// ㉓ 下一領域 / 完成
// ============================================================

if (nextButton) {
    nextButton.addEventListener("click", () => {
        if (currentDomain < ALI_CONFIG.DOMAIN_COUNT - 1) {
            currentDomain++;
            loadDomain();
            return;
        }
        finishAssessment();
    });
}


// ============================================================
// ㉔ Stability Modifier
// ============================================================

function calculateStabilityModifier(S) {
    return ALI_CONFIG.STABILITY_BASE + ALI_CONFIG.STABILITY_WEIGHT * (S / 100);
}


// ============================================================
// ㉕ Base Ability = (L + D) / 2
// ============================================================

function calculateBaseAbility(L, D) {
    return (L + D) / 2;
}


// ============================================================
// ㉖ Adjusted Ability
// ============================================================

function calculateAdjustedAbility(L, D, S) {
    const baseAbility = calculateBaseAbility(L, D);
    const stabilityModifier = calculateStabilityModifier(S);
    return baseAbility * stabilityModifier;
}


// ============================================================
// ㉗ 單項能力分數（1 ~ 199）
// 公式：AdjustedAbility × 1.99
// ============================================================

function calculateAbilityScore(answer) {
    const L = clamp(Number(answer.L), 0, 100);
    const D = clamp(Number(answer.D), 0, 100);
    const S = clamp(Number(answer.S), 0, 100);

    const adjustedAbility = calculateAdjustedAbility(L, D, S);

    return clamp(
        adjustedAbility * 1.99,
        ALI_CONFIG.MIN_SCORE,
        ALI_CONFIG.MAX_SCORE
    );
}


// ============================================================
// ㉘ 64 題 → 32 項能力分數
// ============================================================

function calculateAllAbilityScores() {
    const abilityData = {};

    assessmentItems.forEach(ability => {
        abilityData[ability.id] = {
            scores: [],
            L: [],
            D: [],
            S: []
        };
    });

    formalQuestions.forEach((question, questionIndex) => {
        const selected = answers[questionIndex];
        if (selected === null || selected === undefined) return;

        const runtimeOptions = questionRuntimeOptions[question.id];
        if (!runtimeOptions) return;

        const selectedOption = runtimeOptions[selected];
        if (!selectedOption) return;

        const optionScore = selectedOption.score;
        const ability = abilityData[question.ability];
        if (!ability) return;

        ability.scores.push(optionScore);
    });

    assessmentItems.forEach(ability => {
        const data = abilityData[ability.id];
        if (!data.scores.length) return;

        data.scores.forEach(score => {
            const profile = convertOptionScoreToLDS(score);
            data.L.push(profile.L);
            data.D.push(profile.D);
            data.S.push(profile.S);
        });
    });

    return assessmentItems.map(ability => {
        const data = abilityData[ability.id];
        if (!data || !data.scores.length) return 0;

        const L = average(data.L);
        const D = average(data.D);
        const S = average(data.S);

        return calculateAbilityScore({ L, D, S });
    });
}


// ============================================================
// ㉙ 32 項能力 → 8 大領域
// ============================================================

function calculateDomainScores(abilityScores) {
    const result = [];

    domains.forEach((domain, domainIndex) => {
        const start = domainIndex * ALI_CONFIG.ABILITIES_PER_DOMAIN;
        const end   = start + ALI_CONFIG.ABILITIES_PER_DOMAIN;
        const scores = abilityScores.slice(start, end);
        const total  = scores.reduce((sum, score) => sum + score, 0);

        result.push({
            id: domain.id,
            name: domain.name,
            scores: scores,
            score: total / ALI_CONFIG.ABILITIES_PER_DOMAIN
        });
    });

    return result;
}


// ============================================================
// ㉚ Base Score（8 大領域平均）
// ============================================================

function calculateBaseScore(domainScores) {
    const total = domainScores.reduce((sum, domain) => sum + domain.score, 0);
    return total / ALI_CONFIG.DOMAIN_COUNT;
}


// ============================================================
// ㉛ Breadth Index
// ============================================================

function calculateBreadthIndex(domainScores) {
    const ratios = domainScores.map(domain =>
        Math.min(domain.score / ALI_CONFIG.STANDARD_SCORE, 1)
    );
    const total = ratios.reduce((sum, ratio) => sum + ratio, 0);
    return total / ALI_CONFIG.DOMAIN_COUNT;
}


// ============================================================
// ㉜ Breadth Bonus（±15）
// ============================================================

function calculateBreadthBonus(breadthIndex) {
    const bonus = ALI_CONFIG.BREADTH_MULTIPLIER * (breadthIndex - ALI_CONFIG.BREADTH_CENTER);
    return clamp(bonus, -ALI_CONFIG.BREADTH_MAX_BONUS, ALI_CONFIG.BREADTH_MAX_BONUS);
}


// ============================================================
// ㉝ Final ALI
// ============================================================

function calculateFinalALI(baseScore, breadthBonus) {
    return clamp(baseScore + breadthBonus, ALI_CONFIG.MIN_SCORE, ALI_CONFIG.MAX_SCORE);
}


// ============================================================
// ㉞ 完整 ALI 計算
// ============================================================

function calculateALI() {
    const abilityScores = calculateAllAbilityScores();
    const domainScores  = calculateDomainScores(abilityScores);
    const baseScore     = calculateBaseScore(domainScores);
    const breadthIndex  = calculateBreadthIndex(domainScores);
    const breadthBonus  = calculateBreadthBonus(breadthIndex);
    const finalALI      = calculateFinalALI(baseScore, breadthBonus);

    return {
        abilityScores,
        domainScores,
        baseScore,
        breadthIndex,
        breadthBonus,
        finalALI
    };
}


// ============================================================
// ㉟ ALI Level
// ============================================================

function getALILevel(score) {
    if (score < 50)  return { name: "LOW",             description: "目前能力結構低於 ALI 基準範圍" };
    if (score < 80)  return { name: "BELOW STANDARD",  description: "目前能力結構明顯低於基準" };
    if (score < 100) return { name: "NEAR STANDARD",   description: "目前能力結構接近 ALI 基準" };
    if (score < 120) return { name: "STANDARD",        description: "整體能力結構位於 ALI 標準範圍" };
    if (score < 140) return { name: "HIGH",            description: "整體能力結構高於 ALI 基準" };
    if (score < 160) return { name: "EXCEPTIONAL",     description: "整體能力結構達到卓越範圍" };
    if (score < 180) return { name: "EXTREME",         description: "整體能力結構處於極高範圍" };
    return { name: "LIMIT", description: "整體能力結構接近 ALI 系統上限" };
}


// ============================================================
// ㊱ 顯示結果
// ============================================================

function showResult(result) {
    showPage(resultPage);

    const resultName = document.getElementById("result-name");
    if (resultName) resultName.textContent = userData.name;

    const resultAge = document.getElementById("result-age");
    if (resultAge) resultAge.textContent = userData.age;

    const resultCode = document.getElementById("result-code");
    if (resultCode) resultCode.textContent = userData.code || "未填寫";

    const scoreElement = document.getElementById("ali-score");
    if (scoreElement) scoreElement.textContent = result.finalALI.toFixed(1);

    const level = getALILevel(result.finalALI);

    const levelElement = document.getElementById("ali-level");
    if (levelElement) levelElement.textContent = level.name;

    const descriptionElement = document.getElementById("result-description");
    if (descriptionElement) descriptionElement.textContent = level.description;

    const sortedDomains = [...result.domainScores].sort((a, b) => b.score - a.score);

    const highestDomain = document.getElementById("highest-domain");
    if (highestDomain) {
        highestDomain.textContent = `${sortedDomains[0].name} (${sortedDomains[0].score.toFixed(1)})`;
    }

    const lowestDomain = document.getElementById("lowest-domain");
    if (lowestDomain) {
        lowestDomain.textContent = `${sortedDomains[sortedDomains.length - 1].name} (${sortedDomains[sortedDomains.length - 1].score.toFixed(1)})`;
    }

    const baseElement = document.getElementById("base-score");
    if (baseElement) baseElement.textContent = result.baseScore.toFixed(2);

    const breadthIndexElement = document.getElementById("breadth-index");
    if (breadthIndexElement) breadthIndexElement.textContent = result.breadthIndex.toFixed(3);

    const breadthBonusElement = document.getElementById("breadth-bonus");
    if (breadthBonusElement) {
        const sign = result.breadthBonus >= 0 ? "+" : "";
        breadthBonusElement.textContent = `${sign}${result.breadthBonus.toFixed(2)}`;
    }

    // 8 大領域結果
    const domainList = document.getElementById("domain-results-list");
    if (domainList) {
        domainList.innerHTML = "";
        result.domainScores.forEach(domain => {
            const row = document.createElement("div");
            row.className = "domain-result-row";
            const percentage = Math.min(domain.score / ALI_CONFIG.MAX_SCORE * 100, 100);

            row.innerHTML = `
                <div class="domain-result-name">
                    <span>${domain.name}</span>
                    <strong>${domain.score.toFixed(1)}</strong>
                </div>
                <div class="domain-result-bar">
                    <div class="domain-result-fill" style="width:${percentage}%"></div>
                </div>
            `;
            domainList.appendChild(row);
        });
    }

    // 32 項核心能力
    const abilityList = document.getElementById("ability-results-list");
    if (abilityList) {
        abilityList.innerHTML = "";
        result.abilityScores.forEach((score, index) => {
            const ability = assessmentItems[index];
            const row = document.createElement("div");
            row.className = "ability-result-row";
            row.innerHTML = `
                <div>
                    <span>${ability.domainName}</span>
                    <strong>${ability.name}</strong>
                </div>
                <strong>${score.toFixed(1)}</strong>
            `;
            abilityList.appendChild(row);
        });
    }
}


// ============================================================
// ㊲ 完成 ALI 評估
// ============================================================

function finishAssessment() {
    const unanswered = answers.filter(a => a === null).length;

    if (unanswered > 0) {
        alert(`還有 ${unanswered} 題尚未作答，請完成所有題目。`);
        return;
    }

    const result = calculateALI();

    // 儲存結果
    const savedData = {
        userData: userData,
        result: result,
        date: new Date().toLocaleString()
    };
    localStorage.setItem("ALI_LAST_RESULT", JSON.stringify(savedData));

    // 除錯輸出
    console.log("================================");
    console.log("ALI 1.0.1 OFFICIAL MODEL");
    console.log("================================");
    console.log("32 項能力分數：", result.abilityScores);
    console.log("8 大領域：", result.domainScores);
    console.log("Base Score：", result.baseScore);
    console.log("Breadth Index：", result.breadthIndex);
    console.log("Breadth Bonus：", result.breadthBonus);
    console.log("FINAL ALI：", result.finalALI);

    showResult(result);
}
