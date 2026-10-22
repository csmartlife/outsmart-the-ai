/**
 * GAME CONTENT — edit scenarios here.
 *
 * Every scenario, name and piece of evidence below is a FICTIONAL teaching example.
 * Keep IDs stable: scoring compares `correctVerdict` and `correctReasonId` against
 * the player's chosen IDs, so you can reword or reorder text freely.
 */
import type { InterestOption, Round } from './types';

export const rounds: Round[] = [
  {
    id: 'laptop-deal',
    title: { en: 'The laptop deal', zh: '手提電腦優惠' },
    skill: {
      en: 'Checking whether a recommendation meets every requirement',
      zh: '檢查個建議係咪符合晒每項要求',
    },
    recapSkill: { en: 'Checking constraints', zh: '檢查條件限制' },
    question: {
      en: 'I need a laptop with at least 16 GB of RAM. My total budget is HK$6,000, including delivery. Does this deal fit?',
      zh: '我想買部至少有 16 GB RAM 嘅手提電腦，連運費總預算係 HK$6,000。呢個優惠啱唔啱我？',
    },
    aiAnswer: {
      en: 'Good news: this deal fits! The NovaBook 14 comes with 16 GB of RAM, which meets your minimum. It is priced at HK$5,880, which is under your HK$6,000 budget. It meets both of your requirements, so you can go ahead and order it.',
      zh: '好消息，呢個優惠啱你！NovaBook 14 有 16 GB RAM，符合你嘅最低要求；售價 HK$5,880，仲低過你 HK$6,000 嘅預算。兩樣要求都達到，你可以放心落單。',
    },
    evidence: [
      {
        id: 'listing',
        tab: 'A',
        title: { en: 'Product listing', zh: '產品資料' },
        facts: [
          { en: 'Model: NovaBook 14', zh: '型號：NovaBook 14' },
          { en: 'RAM: 16 GB', zh: 'RAM：16 GB' },
          { en: 'Item price: HK$5,880', zh: '貨品價錢：HK$5,880' },
          { en: 'Delivery charged separately', zh: '運費另外計' },
        ],
      },
      {
        id: 'delivery',
        tab: 'B',
        title: { en: 'Delivery policy', zh: '送貨安排' },
        facts: [
          { en: 'Mandatory delivery charge for this order: HK$180', zh: '呢張單一定要俾運費：HK$180' },
          { en: 'Collection unavailable', zh: '唔可以自取' },
          { en: 'No additional discounts apply', zh: '冇其他折扣' },
        ],
      },
      {
        id: 'requirements',
        tab: 'C',
        title: { en: 'Your requirements', zh: '你嘅要求' },
        facts: [
          { en: 'Minimum RAM: 16 GB', zh: '最少 RAM：16 GB' },
          { en: 'Maximum total cost: HK$6,000', zh: '總共最多使：HK$6,000' },
          { en: 'Budget includes delivery', zh: '預算已經包埋運費' },
        ],
      },
    ],
    correctVerdict: 'contradicted',
    reasons: [
      {
        id: 'total-over-budget',
        text: {
          en: 'The total is HK$6,060, which exceeds the budget.',
          zh: '加埋運費總共 HK$6,060，超出咗預算。',
        },
      },
      {
        id: 'needs-more-ram',
        text: {
          en: 'A laptop needs more than 16 GB of RAM.',
          zh: '手提電腦要多過 16 GB RAM 先夠用。',
        },
      },
      {
        id: 'ai-always-wrong',
        text: {
          en: 'Any AI product recommendation must be wrong.',
          zh: 'AI 推介嘅產品一定係錯㗎啦。',
        },
      },
    ],
    correctReasonId: 'total-over-budget',
    explanation: {
      en: 'The RAM requirement is met, but the total cost is HK$5,880 + HK$180 = HK$6,060. The answer overlooked a required cost.',
      zh: 'RAM 係夠嘅，但總數係 HK$5,880 + HK$180 = HK$6,060。個答案漏咗一筆一定要俾嘅錢。',
    },
    takeaway: {
      en: 'Check the whole requirement, not just the headline number.',
      zh: '要睇晒成個要求，唔好淨係睇最搶眼嗰個數字。',
    },
    connection: {
      en: 'Information quality: completeness and accuracy are two of the quality dimensions from today’s workshop. Here, an incomplete answer led to a wrong decision.',
      zh: '資訊質素：「完整性」同「準確性」係今日工作坊講過嘅資訊質素指標。今次就係一個唔完整嘅答案，令人作錯決定。',
    },
    tip: {
      en: 'Tip: add up every required cost, including delivery, before comparing with the budget.',
      zh: '小貼士：先將所有一定要俾嘅錢（包括運費）加埋，再同預算比較。',
    },
  },
  {
    id: 'image-reuse',
    title: { en: 'Can I reuse this image?', zh: '呢幅圖用得唔用得？' },
    skill: {
      en: 'Recognising a supported answer and checking its conditions',
      zh: '認出有證據支持嘅答案，再檢查佢嘅條件',
    },
    recapSkill: { en: 'Checking source permissions', zh: '檢查來源嘅使用許可' },
    question: {
      en: 'I found this illustration through an image search. Can I use it in my school presentation if I follow its licence?',
      zh: '我喺圖片搜尋搵到呢幅插圖。如果我跟足佢嘅授權條款，可唔可以放喺學校簡報度用？',
    },
    aiAnswer: {
      en: 'Yes, you can. The creator, Alex Chan, shares “Harbour Lights” under a CC BY 4.0 licence, which allows reuse as long as you give credit. Add a credit with the title, author, source and licence, and it is fine to use in your school presentation.',
      zh: '可以！創作者 Alex Chan 用 CC BY 4.0 授權分享《Harbour Lights》，只要註明出處就可以用。你寫埋標題、作者、來源同授權，就可以放喺學校簡報度。',
    },
    evidence: [
      {
        id: 'creator-page',
        tab: 'A',
        title: { en: 'Original creator’s page', zh: '原創者嘅網頁' },
        facts: [
          { en: 'Illustration: Harbour Lights', zh: '插圖：《Harbour Lights》' },
          { en: 'Creator: Alex Chan, a fictional illustrator', zh: '創作者：Alex Chan（虛構嘅插畫師）' },
          {
            en: 'Licence: CC BY 4.0. You may reuse this work if you give appropriate credit.',
            zh: '授權：CC BY 4.0。只要註明出處，就可以重用呢件作品。',
          },
          {
            en: 'Requested credit: Title, Author, Source, Licence',
            zh: '要求嘅出處標示：標題、作者、來源、授權',
          },
          {
            en: 'The licence applies to the exact illustration shown.',
            zh: '授權適用於網頁上面展示嘅呢幅插圖。',
          },
        ],
      },
      {
        id: 'planned-use',
        tab: 'B',
        title: { en: 'Your planned use', zh: '你打算點用' },
        facts: [
          { en: 'A classroom presentation', zh: '一次課堂簡報' },
          { en: 'The illustration will appear unchanged', zh: '原圖照用，唔會改' },
          {
            en: 'Credit directly below it: “Harbour Lights” by Alex Chan, creator’s portfolio page, CC BY 4.0',
            zh: '插圖正下面嘅出處：“Harbour Lights” by Alex Chan, creator’s portfolio page, CC BY 4.0',
          },
        ],
      },
      {
        id: 'thumbnail',
        tab: 'C',
        title: { en: 'A search-results thumbnail', zh: '搜尋結果入面嘅縮圖' },
        facts: [
          { en: 'Shows the same illustration', zh: '係同一幅插圖' },
          { en: 'No usage-rights filter was applied to the search', zh: '搜尋嗰陣冇用「使用權」篩選' },
          { en: 'Contains no licence information', zh: '完全冇授權資料' },
          { en: 'Links back to the creator’s page', zh: '連返去創作者嘅網頁' },
        ],
      },
    ],
    correctVerdict: 'supported',
    reasons: [
      {
        id: 'search-images-free',
        text: {
          en: 'Every image in search results is free to use.',
          zh: '搜尋結果入面啲圖全部都可以免費用。',
        },
      },
      {
        id: 'permission-condition-met',
        text: {
          en: 'The creator’s CC BY 4.0 licence covers this use, and the planned credit includes the title, author, source and licence.',
          zh: '創作者嘅 CC BY 4.0 授權包括呢個用途，而你打算寫嘅出處已經有齊標題、作者、來源同授權。',
        },
      },
      {
        id: 'schoolwork-exempt',
        text: {
          en: 'Schoolwork never needs permission or credit.',
          zh: '做功課從來都唔使許可，亦唔使註明出處。',
        },
      },
    ],
    correctReasonId: 'permission-condition-met',
    explanation: {
      en: 'The answer is supported here because you checked the licence on the creator’s own page, and your planned credit meets its condition. Finding an image through search alone would not establish permission: “findable” is not “free to use”.',
      zh: '今次個答案有證據支持，因為你喺創作者自己嘅網頁睇過授權，而你打算寫嘅出處符合佢嘅條件。不過淨係喺搜尋結果搵到幅圖，唔代表你有權用：「搵得到」唔等於「免費用」。',
    },
    takeaway: {
      en: 'Trust should follow the evidence. A supported answer deserves acceptance.',
      zh: '信唔信，要跟證據行。有證據支持嘅答案，就值得接受。',
    },
    connection: {
      en: 'Information retrieval and Creative Commons: tracing the original source and checking usage rights before you reuse, as in today’s workshop.',
      zh: '資訊檢索同創用 CC：重用之前，先追查原始來源、睇清楚使用權，就好似今日工作坊講嘅咁。',
    },
    tip: {
      en: 'Tip: “findable” is not “free to use”. Check the licence on the original source (or filter image searches by usage rights), then credit Title, Author, Source and Licence. When the conditions are met, a supported answer can be accepted.',
      zh: '小貼士：「搵得到」唔等於「免費用」。先去原始來源睇授權（或者喺圖片搜尋用使用權篩選），再寫齊標題、作者、來源同授權。條件啱嘅話，有證據支持嘅答案係可以接受嘅。',
    },
    caution: {
      en: 'This is a simplified, fictional permission-checking exercise, not legal advice. Real permissions vary, so always read each source’s own terms.',
      zh: '呢個係簡化咗嘅虛構練習，唔係法律意見。現實入面每個來源嘅使用許可都唔同，記得睇清楚佢哋自己嘅條款。',
    },
  },
  {
    id: 'study-app',
    title: { en: 'The study app claim', zh: '溫書 App 嘅說法' },
    skill: {
      en: 'Distinguishing reported improvement from proof of cause',
      zh: '分清「話自己有進步」同「證明咗原因」',
    },
    recapSkill: { en: 'Interpreting data claims', zh: '解讀數據說法' },
    question: {
      en: 'Does this survey prove that the study app caused students’ grades to improve?',
      zh: '呢個調查可唔可以證明係個溫書 App 令學生成績進步？',
    },
    aiAnswer: {
      en: 'Yes. In the survey, 70% of students who used the app said their grades improved. That is a clear majority, so the app caused the improvement. It is an effective study tool.',
      zh: '可以！調查入面，用過呢個 App 嘅學生有七成話成績進步咗。咁明顯係大多數，所以係呢個 App 令成績進步，佢係一個有效嘅溫書工具。',
    },
    evidence: [
      {
        id: 'results',
        tab: 'A',
        title: { en: 'Survey results', zh: '調查結果' },
        facts: [
          { en: '20 students responded', zh: '20 個學生回應' },
          { en: 'All respondents used the app', zh: '回應嘅人全部都有用呢個 App' },
          { en: '14 reported that their grades improved', zh: '14 個話成績有進步' },
          { en: '6 reported that their grades did not improve', zh: '6 個話成績冇進步' },
        ],
      },
      {
        id: 'method',
        tab: 'B',
        title: { en: 'How the survey worked', zh: '個調查點樣做' },
        facts: [
          { en: 'Students volunteered to answer', zh: '學生自願答' },
          { en: 'Students reported their own results', zh: '成績係學生自己報' },
          { en: 'No independent grade records were checked', zh: '冇核對過獨立嘅成績紀錄' },
        ],
      },
      {
        id: 'not-measured',
        tab: 'C',
        title: { en: 'What the survey did not measure', zh: '個調查冇量度嘅嘢' },
        facts: [
          {
            en: 'No comparison group of students who did not use the app',
            zh: '冇「唔用 App 嘅學生」做對照組',
          },
          {
            en: 'No measurement of changes in study time or extra tutoring',
            zh: '冇量度溫書時間或者額外補習有冇變',
          },
          {
            en: 'No method to separate the app’s effect from other influences',
            zh: '冇辦法將 App 嘅影響同其他因素分開',
          },
        ],
      },
    ],
    correctVerdict: 'insufficient',
    reasons: [
      {
        id: 'seventy-proves-cause',
        text: {
          en: 'Seventy per cent is always enough to prove a cause.',
          zh: '有七成就一定夠證明因果關係。',
        },
      },
      {
        id: 'proves-no-effect',
        text: {
          en: 'The survey proves the app had no effect.',
          zh: '呢個調查證明個 App 完全冇用。',
        },
      },
      {
        id: 'cannot-isolate-cause',
        text: {
          en: 'The results describe reported improvement but cannot isolate what caused it.',
          zh: '結果只係講學生自己話有進步，但分唔到進步嘅真正原因。',
        },
      },
    ],
    correctReasonId: 'cannot-isolate-cause',
    explanation: {
      en: 'Fourteen out of twenty is 70%, so that calculation is correct. But the survey does not show what caused the improvement. The app might help, but this evidence does not establish that.',
      zh: '20 個人入面有 14 個，即係 70%，條數係啱嘅。但個調查冇顯示到點解會進步。個 App 可能有幫助，但呢啲證據唔夠證明。',
    },
    takeaway: {
      en: 'A correct number can still support an unjustified conclusion.',
      zh: '數字啱，結論都可以唔企得住腳。',
    },
    connection: {
      en: 'Data interpretation and data mining: asking what a dataset can and cannot tell us, and judging how reliable and objective it is.',
      zh: '數據解讀同數據探勘：諗吓一組數據講到啲咩、講唔到啲咩，再判斷佢可唔可靠、客唔客觀。',
    },
    tip: {
      en: 'Tip: ask whether the data shows a cause or only a pattern. Look for a comparison group and other influences.',
      zh: '小貼士：問吓自己，啲數據顯示嘅係原因，定只係一個現象？留意有冇對照組，同埋其他影響因素。',
    },
  },
];

export const interests: InterestOption[] = [
  {
    id: 'trustworthy-info',
    label: { en: 'Finding trustworthy information', zh: '搵可信嘅資訊' },
    heading: { en: 'Explore information retrieval and AI literacy', zh: '探索資訊檢索同 AI 素養' },
    copy: {
      en: 'You enjoyed checking claims and tracing evidence. Ask how students learn to find and evaluate information.',
      zh: '你鍾意查證說法、追查證據。不如問吓啲師兄師姐，佢哋點樣學搜尋同評估資訊？',
    },
    starter: {
      en: 'How do BSIM students learn to evaluate AI answers?',
      zh: 'BSIM 學生點樣學評估 AI 嘅答案？',
    },
  },
  {
    id: 'data',
    label: { en: 'Understanding what data really says', zh: '睇清數據真正講緊啲咩' },
    heading: { en: 'Explore data mining and interpretation', zh: '探索數據探勘同解讀' },
    copy: {
      en: 'You’re curious about the story behind the numbers. Ask what kinds of questions students investigate with data.',
      zh: '你對數字背後嘅故仔好好奇。不如問吓啲師兄師姐，佢哋會用數據研究啲咩問題？',
    },
    starter: {
      en: 'What kinds of data projects can BSIM students work on?',
      zh: 'BSIM 學生可以做邊啲數據項目？',
    },
  },
  {
    id: 'digital-tools',
    label: { en: 'Designing useful digital tools', zh: '設計實用嘅數碼工具' },
    heading: {
      en: 'Explore web development and human–computer interaction',
      zh: '探索網頁開發同人機互動',
    },
    copy: {
      en: 'You’re interested in how digital experiences work. Ask how students learn to design tools around people’s needs.',
      zh: '你對數碼體驗點樣運作好有興趣。不如問吓啲師兄師姐，佢哋點樣學按用家需要去設計工具？',
    },
    starter: {
      en: 'How do BSIM students learn to design user-friendly tools?',
      zh: 'BSIM 學生點樣學設計易用嘅工具？',
    },
  },
];
