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
      zh: '檢查建議是否符合每一項要求',
    },
    recapSkill: { en: 'Checking constraints', zh: '檢查條件限制' },
    question: {
      en: 'I need a laptop with at least 16 GB of RAM. My total budget is HK$6,000, including delivery. Does this deal fit?',
      zh: '我需要一部至少有 16 GB RAM 的手提電腦。連運費在內，我的總預算是 HK$6,000。這個優惠合適嗎？',
    },
    aiAnswer: {
      en: 'Good news: this deal fits! The NovaBook 14 comes with 16 GB of RAM, which meets your minimum. It is priced at HK$5,880, which is under your HK$6,000 budget. It meets both of your requirements, so you can go ahead and order it.',
      zh: '好消息，這個優惠合適！NovaBook 14 配備 16 GB RAM，符合你的最低要求。售價 HK$5,880，低於你 HK$6,000 的預算。兩項要求都符合，你可以放心落單。',
    },
    evidence: [
      {
        id: 'listing',
        tab: 'A',
        title: { en: 'Product listing', zh: '產品資料' },
        facts: [
          { en: 'Model: NovaBook 14', zh: '型號：NovaBook 14' },
          { en: 'RAM: 16 GB', zh: 'RAM：16 GB' },
          { en: 'Item price: HK$5,880', zh: '貨品價格：HK$5,880' },
          { en: 'Delivery charged separately', zh: '運費另計' },
        ],
      },
      {
        id: 'delivery',
        tab: 'B',
        title: { en: 'Delivery policy', zh: '送貨政策' },
        facts: [
          { en: 'Mandatory delivery charge for this order: HK$180', zh: '此訂單必須支付運費：HK$180' },
          { en: 'Collection unavailable', zh: '不設自取' },
          { en: 'No additional discounts apply', zh: '不適用其他折扣' },
        ],
      },
      {
        id: 'requirements',
        tab: 'C',
        title: { en: 'Your requirements', zh: '你的要求' },
        facts: [
          { en: 'Minimum RAM: 16 GB', zh: '最少 RAM：16 GB' },
          { en: 'Maximum total cost: HK$6,000', zh: '總費用上限：HK$6,000' },
          { en: 'Budget includes delivery', zh: '預算已包括運費' },
        ],
      },
    ],
    correctVerdict: 'contradicted',
    reasons: [
      {
        id: 'total-over-budget',
        text: {
          en: 'The total is HK$6,060, which exceeds the budget.',
          zh: '總額是 HK$6,060，超出了預算。',
        },
      },
      {
        id: 'needs-more-ram',
        text: {
          en: 'A laptop needs more than 16 GB of RAM.',
          zh: '手提電腦需要多於 16 GB RAM。',
        },
      },
      {
        id: 'ai-always-wrong',
        text: {
          en: 'Any AI product recommendation must be wrong.',
          zh: '任何 AI 產品推介都一定是錯的。',
        },
      },
    ],
    correctReasonId: 'total-over-budget',
    explanation: {
      en: 'The RAM requirement is met, but the total cost is HK$5,880 + HK$180 = HK$6,060. The answer overlooked a required cost.',
      zh: 'RAM 的要求符合了，但總費用是 HK$5,880 + HK$180 = HK$6,060。這個答案忽略了一項必須支付的費用。',
    },
    takeaway: {
      en: 'Check the whole requirement, not just the headline number.',
      zh: '要檢查整個要求，不要只看最顯眼的數字。',
    },
    connection: {
      en: 'Information quality: completeness and accuracy are two of the quality dimensions from today’s workshop. Here, an incomplete answer led to a wrong decision.',
      zh: '資訊質素：「完整性」和「準確性」是今天工作坊介紹的資訊質素指標之一。這次，一個不完整的答案導致了錯誤的決定。',
    },
    tip: {
      en: 'Tip: add up every required cost, including delivery, before comparing with the budget.',
      zh: '小貼士：先把所有必須支付的費用（包括運費）加起來，再與預算比較。',
    },
  },
  {
    id: 'image-reuse',
    title: { en: 'Can I reuse this image?', zh: '這幅圖可以用嗎？' },
    skill: {
      en: 'Recognising a supported answer and checking its conditions',
      zh: '辨認有證據支持的答案，並檢查其條件',
    },
    recapSkill: { en: 'Checking source permissions', zh: '檢查來源的使用許可' },
    question: {
      en: 'I found this illustration through an image search. Can I use it in my school presentation if I follow its licence?',
      zh: '我在圖片搜尋中找到這幅插圖。如果我遵守它的授權條款，可以在學校簡報中使用嗎？',
    },
    aiAnswer: {
      en: 'Yes, you can. The creator, Alex Chan, shares “Harbour Lights” under a CC BY 4.0 licence, which allows reuse as long as you give credit. Add a credit with the title, author, source and licence, and it is fine to use in your school presentation.',
      zh: '可以。創作者 Alex Chan 以 CC BY 4.0 授權分享《Harbour Lights》，只要註明出處便可重用。加上包括標題、作者、來源和授權的出處標示，就可以在學校簡報中使用。',
    },
    evidence: [
      {
        id: 'creator-page',
        tab: 'A',
        title: { en: 'Original creator’s page', zh: '原創者的網頁' },
        facts: [
          { en: 'Illustration: Harbour Lights', zh: '插圖：《Harbour Lights》' },
          { en: 'Creator: Alex Chan, a fictional illustrator', zh: '創作者：Alex Chan（虛構的插畫師）' },
          {
            en: 'Licence: CC BY 4.0. You may reuse this work if you give appropriate credit.',
            zh: '授權：CC BY 4.0。只要適當註明出處，便可重用這件作品。',
          },
          {
            en: 'Requested credit: Title, Author, Source, Licence',
            zh: '要求的出處標示：標題、作者、來源、授權',
          },
          {
            en: 'The licence applies to the exact illustration shown.',
            zh: '授權適用於網頁上展示的這幅插圖本身。',
          },
        ],
      },
      {
        id: 'planned-use',
        tab: 'B',
        title: { en: 'Your planned use', zh: '你的使用計劃' },
        facts: [
          { en: 'A classroom presentation', zh: '一次課堂簡報' },
          { en: 'The illustration will appear unchanged', zh: '插圖會原樣使用，不作修改' },
          {
            en: 'Credit directly below it: “Harbour Lights” by Alex Chan, creator’s portfolio page, CC BY 4.0',
            zh: '插圖正下方的出處：“Harbour Lights” by Alex Chan, creator’s portfolio page, CC BY 4.0',
          },
        ],
      },
      {
        id: 'thumbnail',
        tab: 'C',
        title: { en: 'A search-results thumbnail', zh: '搜尋結果中的縮圖' },
        facts: [
          { en: 'Shows the same illustration', zh: '顯示同一幅插圖' },
          { en: 'No usage-rights filter was applied to the search', zh: '搜尋時沒有使用「使用權」篩選' },
          { en: 'Contains no licence information', zh: '沒有任何授權資訊' },
          { en: 'Links back to the creator’s page', zh: '連結回創作者的網頁' },
        ],
      },
    ],
    correctVerdict: 'supported',
    reasons: [
      {
        id: 'search-images-free',
        text: {
          en: 'Every image in search results is free to use.',
          zh: '搜尋結果中的所有圖片都可以免費使用。',
        },
      },
      {
        id: 'permission-condition-met',
        text: {
          en: 'The creator’s CC BY 4.0 licence covers this use, and the planned credit includes the title, author, source and licence.',
          zh: '創作者的 CC BY 4.0 授權涵蓋這個用途，而計劃中的出處標示包括了標題、作者、來源和授權。',
        },
      },
      {
        id: 'schoolwork-exempt',
        text: {
          en: 'Schoolwork never needs permission or credit.',
          zh: '做功課從來不需要許可，也不用註明出處。',
        },
      },
    ],
    correctReasonId: 'permission-condition-met',
    explanation: {
      en: 'The answer is supported here because you checked the licence on the creator’s own page, and your planned credit meets its condition. Finding an image through search alone would not establish permission: “findable” is not “free to use”.',
      zh: '這個答案在這裡有證據支持，因為你在創作者本身的網頁上查看了授權，而你計劃的出處標示符合它的條件。單靠在搜尋結果中找到圖片，並不能證明你已獲得許可：「找得到」不等於「免費用」。',
    },
    takeaway: {
      en: 'Trust should follow the evidence. A supported answer deserves acceptance.',
      zh: '信任應該跟隨證據。有證據支持的答案，值得接受。',
    },
    connection: {
      en: 'Information retrieval and Creative Commons: tracing the original source and checking usage rights before you reuse, as in today’s workshop.',
      zh: '資訊檢索與創用 CC：重用之前，先追查原始來源並檢查使用權，正如今天工作坊所介紹。',
    },
    tip: {
      en: 'Tip: “findable” is not “free to use”. Check the licence on the original source (or filter image searches by usage rights), then credit Title, Author, Source and Licence. When the conditions are met, a supported answer can be accepted.',
      zh: '小貼士：「找得到」不等於「免費用」。先在原始來源查看授權（或在圖片搜尋中按使用權篩選），再註明標題、作者、來源和授權。條件符合時，有證據支持的答案是可以接受的。',
    },
    caution: {
      en: 'This is a simplified, fictional permission-checking exercise, not legal advice. Real permissions vary, so always read each source’s own terms.',
      zh: '這是一個簡化的虛構練習，並非法律意見。現實中的使用許可各有不同，請細閱每個來源本身的條款。',
    },
  },
  {
    id: 'study-app',
    title: { en: 'The study app claim', zh: '溫習 App 的說法' },
    skill: {
      en: 'Distinguishing reported improvement from proof of cause',
      zh: '分辨「自述有進步」與「證明了原因」',
    },
    recapSkill: { en: 'Interpreting data claims', zh: '解讀數據說法' },
    question: {
      en: 'Does this survey prove that the study app caused students’ grades to improve?',
      zh: '這項調查能否證明是溫習 App 令學生的成績進步？',
    },
    aiAnswer: {
      en: 'Yes. In the survey, 70% of students who used the app said their grades improved. That is a clear majority, so the app caused the improvement. It is an effective study tool.',
      zh: '能。調查中，七成使用這個 App 的學生表示成績有進步。這是明顯的大多數，所以是這個 App 令成績進步，它是一個有效的溫習工具。',
    },
    evidence: [
      {
        id: 'results',
        tab: 'A',
        title: { en: 'Survey results', zh: '調查結果' },
        facts: [
          { en: '20 students responded', zh: '20 名學生回應' },
          { en: 'All respondents used the app', zh: '所有回應者都有使用這個 App' },
          { en: '14 reported that their grades improved', zh: '14 人表示成績有進步' },
          { en: '6 reported that their grades did not improve', zh: '6 人表示成績沒有進步' },
        ],
      },
      {
        id: 'method',
        tab: 'B',
        title: { en: 'How the survey worked', zh: '調查是怎樣進行的' },
        facts: [
          { en: 'Students volunteered to answer', zh: '學生自願作答' },
          { en: 'Students reported their own results', zh: '成績由學生自行報告' },
          { en: 'No independent grade records were checked', zh: '沒有核對獨立的成績紀錄' },
        ],
      },
      {
        id: 'not-measured',
        tab: 'C',
        title: { en: 'What the survey did not measure', zh: '調查沒有量度的事項' },
        facts: [
          {
            en: 'No comparison group of students who did not use the app',
            zh: '沒有「不使用 App 的學生」作為對照組',
          },
          {
            en: 'No measurement of changes in study time or extra tutoring',
            zh: '沒有量度溫習時間或額外補習的變化',
          },
          {
            en: 'No method to separate the app’s effect from other influences',
            zh: '沒有方法把 App 的影響與其他因素分開',
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
          zh: '七成一定足以證明因果關係。',
        },
      },
      {
        id: 'proves-no-effect',
        text: {
          en: 'The survey proves the app had no effect.',
          zh: '這項調查證明 App 完全沒有效果。',
        },
      },
      {
        id: 'cannot-isolate-cause',
        text: {
          en: 'The results describe reported improvement but cannot isolate what caused it.',
          zh: '結果描述了學生自述的進步，但無法分辨出進步的真正原因。',
        },
      },
    ],
    correctReasonId: 'cannot-isolate-cause',
    explanation: {
      en: 'Fourteen out of twenty is 70%, so that calculation is correct. But the survey does not show what caused the improvement. The app might help, but this evidence does not establish that.',
      zh: '20 人中有 14 人，即 70%，這個計算是正確的。但調查並沒有顯示進步的原因。這個 App 或許有幫助，但這些證據不足以證明這一點。',
    },
    takeaway: {
      en: 'A correct number can still support an unjustified conclusion.',
      zh: '數字正確，結論仍然可能站不住腳。',
    },
    connection: {
      en: 'Data interpretation and data mining: asking what a dataset can and cannot tell us, and judging how reliable and objective it is.',
      zh: '數據解讀與數據探勘：思考一組數據能告訴我們甚麼、不能告訴我們甚麼，並判斷它是否可靠和客觀。',
    },
    tip: {
      en: 'Tip: ask whether the data shows a cause or only a pattern. Look for a comparison group and other influences.',
      zh: '小貼士：問問自己，數據顯示的是原因，還是只是一個現象？留意有沒有對照組，以及其他影響因素。',
    },
  },
];

export const interests: InterestOption[] = [
  {
    id: 'trustworthy-info',
    label: { en: 'Finding trustworthy information', zh: '尋找可信的資訊' },
    heading: { en: 'Explore information retrieval and AI literacy', zh: '探索資訊檢索與 AI 素養' },
    copy: {
      en: 'You enjoyed checking claims and tracing evidence. Ask how students learn to find and evaluate information.',
      zh: '你享受查證說法、追查證據的過程。不妨問問同學們是怎樣學習搜尋和評估資訊的。',
    },
    starter: {
      en: 'How do BSIM students learn to evaluate AI answers?',
      zh: 'BSIM 學生是怎樣學習評估 AI 答案的？',
    },
  },
  {
    id: 'data',
    label: { en: 'Understanding what data really says', zh: '理解數據真正說了甚麼' },
    heading: { en: 'Explore data mining and interpretation', zh: '探索數據探勘與解讀' },
    copy: {
      en: 'You’re curious about the story behind the numbers. Ask what kinds of questions students investigate with data.',
      zh: '你對數字背後的故事感到好奇。不妨問問同學們會用數據研究甚麼問題。',
    },
    starter: {
      en: 'What kinds of data projects can BSIM students work on?',
      zh: 'BSIM 學生可以參與哪些類型的數據項目？',
    },
  },
  {
    id: 'digital-tools',
    label: { en: 'Designing useful digital tools', zh: '設計實用的數碼工具' },
    heading: {
      en: 'Explore web development and human–computer interaction',
      zh: '探索網頁開發與人機互動',
    },
    copy: {
      en: 'You’re interested in how digital experiences work. Ask how students learn to design tools around people’s needs.',
      zh: '你對數碼體驗如何運作感興趣。不妨問問同學們是怎樣學習按照用家需要設計工具的。',
    },
    starter: {
      en: 'How do BSIM students learn to design user-friendly tools?',
      zh: 'BSIM 學生是怎樣學習設計易用工具的？',
    },
  },
];
