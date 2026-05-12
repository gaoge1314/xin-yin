import type { WorldEvent } from '../../types/event';

export const WORLD_EVENTS: WorldEvent[] = [
  {
    id: 'macro_ai_replace_junior',
    type: 'macro',
    category: 'economic',
    triggerCondition: { year: 2025, seasonInYear: 'summer', chance: 0.8 },
    content: 'AI开始替代初级白领岗位——翻译、客服、基础编程、设计。你学的那些，会不会白学了？',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'crisis',
    transmissionChain: 'AI替代初级白领 → 主角专业前景受威胁 → "学了这么多年，会不会白学了？"',
    choices: [
      {
        id: 'learn_ai_tool',
        text: '他说：也许该学学AI工具，看看能不能用上。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -5 },
              { target: 'cognition', key: 'learning_meaning', value: 3 },
            ],
            narrative: '他开始搜索AI相关的课程。屏幕上的光映在他脸上，他不确定这是出路还是另一种逃避。',
          },
        ],
      },
      {
        id: 'ignore_ai',
        text: '他说：管它呢，我连自己的事都顾不过来。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -3 },
              { target: 'cognition', key: 'failure', value: 2 },
            ],
            narrative: '他关掉了新闻。但那种被时代抛弃的焦虑，已经在心底扎了根。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_grad_exam_record',
    type: 'macro',
    category: 'social',
    triggerCondition: { year: 2025, seasonInYear: 'autumn', chance: 0.7 },
    content: '考研报名人数突破500万。你已经失败三次了，现在更卷了。要不要四战？',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'mandatory',
    transmissionChain: '考研人数创新高 → 竞争更激烈 → "要不要四战？"',
    choices: [
      {
        id: 'try_fourth',
        text: '他说：再试一次吧。也许这次不一样。',
        outcomes: [
          {
            probability: 0.4,
            effects: [
              { target: 'willpower', value: -10 },
              { target: 'cognition', key: 'effort', value: 3 },
            ],
            narrative: '他决定再考一次。但翻开书的那一刻，他发现自己已经不记得"为了什么"了。',
          },
          {
            probability: 0.6,
            effects: [
              { target: 'willpower', value: -15 },
              { target: 'cognition', key: 'failure', value: 5 },
            ],
            narrative: '他决定再考一次。但夜深人静时，他问自己：这到底是坚持，还是惯性？',
          },
        ],
      },
      {
        id: 'give_up_exam',
        text: '他说：不考了。够了。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: 5 },
              { target: 'cognition', key: 'self_worth', value: -3 },
            ],
            narrative: '他放下了考研的执念。空出来的手，却不知道该抓什么。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_economic_transition',
    type: 'macro',
    category: 'economic',
    triggerCondition: { year: 2026, seasonInYear: 'spring', chance: 0.7 },
    content: '中国经济深度转型，传统行业加速出清。家人可能失业或收入下降，你感受到"不能靠家里了"。',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'crisis',
    transmissionChain: '经济转型 → 家人收入下降 → "不能靠家里了"',
    choices: [
      {
        id: 'find_work_urgently',
        text: '他说：得赶紧找个工作了。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -8 },
              { target: 'cognition', key: 'learning_meaning', value: 2 },
            ],
            narrative: '他开始投简历。每一封都像是在说：我愿意做任何事。但"任何事"是什么？',
          },
        ],
      },
      {
        id: 'stay_still',
        text: '他说：……我连自己都照顾不了。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -12 },
              { target: 'cognition', key: 'meaninglessness', value: 3 },
            ],
            narrative: '他躺在床上，听着母亲在客厅叹气。他知道自己应该起来，但身体不听话。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_civil_service_surge',
    type: 'macro',
    category: 'social',
    triggerCondition: { year: 2026, seasonInYear: 'autumn', chance: 0.7 },
    content: '考公报名人数再创新高。群则声音加强："你必须稳定下来。"',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'suggested',
    transmissionChain: '考公热 → 社会压力增大 → "你必须稳定下来"',
    choices: [
      {
        id: 'consider_civil_service',
        text: '他说：也许考公是条路……',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -5 },
              { target: 'cognition', key: 'hypocrisy', value: 3 },
            ],
            narrative: '他开始看行测题。那些逻辑判断题让他想起考研的日子——又是一种"标准答案"。',
          },
        ],
      },
      {
        id: 'reject_stability',
        text: '他说：我不想为了稳定而活着。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: 3 },
              { target: 'cognition', key: 'self_worth', value: 2 },
            ],
            narrative: '他拒绝了那条路。但拒绝之后呢？他站在十字路口，所有方向都是雾。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_ai_mid_tier',
    type: 'macro',
    category: 'economic',
    triggerCondition: { year: 2027, seasonInYear: 'summer', chance: 0.8 },
    content: 'AI开始进入中端岗位——法律文书、医疗辅助、教育辅导。学历贬值加速。如果还没上岸，焦虑急剧上升。',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'crisis',
    transmissionChain: 'AI进入中端岗位 → 学历贬值 → 焦虑急剧上升',
    choices: [
      {
        id: 'adapt_ai',
        text: '他说：得学会和AI共事，不然真的没路了。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -8 },
              { target: 'cognition', key: 'learning', value: 3 },
            ],
            narrative: '他开始学习AI协作工具。屏幕上的代码和提示词让他头晕，但他知道这是必须的。',
          },
        ],
      },
      {
        id: 'drown_anxiety',
        text: '他说：来不及了。什么都来不及了。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -15 },
              { target: 'cognition', key: 'meaninglessness', value: 5 },
            ],
            narrative: '焦虑像潮水一样涌来。他蜷缩在椅子上，觉得整个世界都在加速，只有他在原地。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_population_decline',
    type: 'macro',
    category: 'social',
    triggerCondition: { year: 2028, seasonInYear: 'spring', chance: 0.7 },
    content: '中国人口连续负增长影响开始显现。养老金压力、延迟退休讨论。你开始想："我老了怎么办？"',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'suggested',
    transmissionChain: '人口负增长 → 养老金压力 → "我老了怎么办？"',
    choices: [
      {
        id: 'worry_future',
        text: '他说：连现在都过不好，还谈什么以后……',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -8 },
              { target: 'cognition', key: 'meaninglessness', value: 2 },
            ],
            narrative: '他想到父亲，想到姐姐，想到自己。这条链条上，每个人都在负重前行。',
          },
        ],
      },
      {
        id: 'focus_present',
        text: '他说：先把眼前的事做好吧。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: 3 },
              { target: 'cognition', key: 'effort', value: 2 },
            ],
            narrative: '他决定不想那么远。但"眼前的事"是什么？他也不太确定。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_us_china_decouple',
    type: 'macro',
    category: 'economic',
    triggerCondition: { year: 2028, seasonInYear: 'autumn', chance: 0.6 },
    content: '中美科技脱钩深化。某些行业萎缩，某些行业被倒逼崛起。你面临"选对赛道"的压力。',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'suggested',
    transmissionChain: '中美脱钩 → 行业格局变化 → "选对赛道"的压力',
    choices: [
      {
        id: 'follow_trend',
        text: '他说：也许该去国产替代的行业看看。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -5 },
              { target: 'cognition', key: 'learning', value: 2 },
            ],
            narrative: '他开始关注国产替代的行业动态。但每次看到"赛道"这个词，他都觉得像在赛跑——可他连起跑线都没找到。',
          },
        ],
      },
      {
        id: 'ignore_geopolitics',
        text: '他说：这些太大了，跟我有什么关系？',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -3 },
              { target: 'cognition', key: 'hypocrisy', value: 2 },
            ],
            narrative: '他关掉新闻。但楼下便利店的进口商品越来越少，价格越来越高。宏观的事，终究会传导到微观。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_supply_chain_restructure',
    type: 'macro',
    category: 'economic',
    triggerCondition: { year: 2029, seasonInYear: 'spring', chance: 0.6 },
    content: '全球供应链重组，中国经济新格局初现。就业市场出现结构性错配：有人找不到工作，有岗位招不到人。',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'crisis',
    transmissionChain: '供应链重组 → 就业错配 → 找不到工作/招不到人',
    choices: [
      {
        id: 'retrain',
        text: '他说：也许该学个新技能……',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -10 },
              { target: 'cognition', key: 'learning', value: 3 },
            ],
            narrative: '他开始搜索职业培训。每一则广告都在说"转型"，但他不确定自己转得动。',
          },
        ],
      },
      {
        id: 'wait_it_out',
        text: '他说：等一等吧，也许会好的。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -5 },
              { target: 'cognition', key: 'meaninglessness', value: 3 },
            ],
            narrative: '他选择等待。但等待的日子里，他越来越觉得自己像一个被搁置的包裹。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_ai_human_collab',
    type: 'macro',
    category: 'economic',
    triggerCondition: { year: 2030, seasonInYear: 'summer', chance: 0.7 },
    content: '"AI+人"协作模式成为职场主流。你过去的技能可能过时，也可能找到新的结合点。',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'suggested',
    transmissionChain: 'AI+人协作主流 → 技能过时或找到新结合点',
    choices: [
      {
        id: 'embrace_collab',
        text: '他说：也许我可以找到和AI协作的方式。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: 5 },
              { target: 'cognition', key: 'learning', value: 4 },
            ],
            narrative: '他开始尝试。AI生成初稿，他来修改和深化。第一次，他觉得自己不是在对抗时代，而是在和它对话。',
          },
        ],
      },
      {
        id: 'resist_collab',
        text: '他说：我不想变成机器的附庸。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -8 },
              { target: 'cognition', key: 'self_worth', value: -2 },
            ],
            narrative: '他拒绝了。但周围的人都在适应，他感到自己正在被边缘化。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_social_security_reform',
    type: 'macro',
    category: 'social',
    triggerCondition: { year: 2031, seasonInYear: 'spring', chance: 0.6 },
    content: '中国社会保障体系改革——个人养老金、延迟退休等政策出台。你开始认真计算自己的未来。',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'mandatory',
    transmissionChain: '社保改革 → 个人养老金/延迟退休 → 计算未来',
    choices: [
      {
        id: 'plan_ahead',
        text: '他说：得认真想想以后了。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -3 },
              { target: 'cognition', key: 'effort', value: 2 },
            ],
            narrative: '他开始算账。数字很残酷，但至少他在面对了。',
          },
        ],
      },
      {
        id: 'avoid_thinking',
        text: '他说：想这些有什么用，先活过今天再说。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -5 },
              { target: 'cognition', key: 'meaninglessness', value: 2 },
            ],
            narrative: '他回避了。但那些数字会在深夜自己冒出来，像未读消息一样闪烁。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_taiwan_strait',
    type: 'macro',
    category: 'social',
    triggerCondition: { year: 2032, seasonInYear: 'autumn', chance: 0.5 },
    content: '台海局势出现重大节点。社会气氛紧张，公安系统进入高度动员状态。',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'crisis',
    transmissionChain: '台海局势紧张 → 社会气氛紧张 → 公安系统动员',
    choices: [
      {
        id: 'feel_tension',
        text: '他说：空气都变重了……',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -10 },
              { target: 'cognition', key: 'meaninglessness', value: 3 },
            ],
            narrative: '他感受到了那种无形的压力。街上的人走得更急了，新闻里的措辞更强硬了。他不知道该做什么，只知道一切都在变。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_ubi_discussion',
    type: 'macro',
    category: 'social',
    triggerCondition: { year: 2032, seasonInYear: 'winter', chance: 0.5 },
    content: '新的社会契约讨论：UBI（全民基本收入）试点？如果不工作也能活，那你做什么？',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'suggested',
    transmissionChain: 'UBI试点讨论 → "不工作也能活，那我做什么？"',
    choices: [
      {
        id: 'question_purpose',
        text: '他说：如果不需要为了生存工作……那我到底想做什么？',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: 3 },
              { target: 'cognition', key: 'happiness', value: 3 },
            ],
            narrative: '这个问题让他停了下来。也许，这是他第一次不是在问"怎么活"，而是在问"为什么活"。',
          },
        ],
      },
      {
        id: 'dismiss_ubi',
        text: '他说：想太多了，先看看能不能活到那天吧。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -3 },
              { target: 'cognition', key: 'meaninglessness', value: 2 },
            ],
            narrative: '他笑了笑，把那个念头推开了。但它在某个角落里，像一颗种子。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_new_productivity',
    type: 'macro',
    category: 'economic',
    triggerCondition: { year: 2033, seasonInYear: 'spring', chance: 0.8 },
    content: '新生产力范式已基本形成。你周围有人已经转型成功，有人被彻底淘汰。',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'crisis',
    transmissionChain: '新生产力范式形成 → 有人成功有人淘汰 → 时代的分水岭',
    choices: [
      {
        id: 'see_both_sides',
        text: '他看着身边的人，有些已经站稳了，有些还在挣扎。他呢？',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -5 },
              { target: 'cognition', key: 'self_worth', value: 2 },
            ],
            narrative: '他站在分水岭上。左边是适应了新时代的人，右边是被抛下的人。他不确定自己在哪一边。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_value_divide',
    type: 'macro',
    category: 'social',
    triggerCondition: { year: 2034, seasonInYear: 'autumn', chance: 0.7 },
    content: '中国社会价值观出现代际分化。上一代的"稳定至上" vs 新一代的"意义优先"。',
    effects: [],
    isOneShot: true,
    source: 'society',
    taskType: 'suggested',
    transmissionChain: '价值观代际分化 → 稳定vs意义 → 你站在哪一边？',
    choices: [
      {
        id: 'choose_meaning',
        text: '他说：我不想再为了别人的标准活了。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: 5 },
              { target: 'cognition', key: 'self_worth', value: 4 },
            ],
            narrative: '他终于说出了那句话。不是为了反抗，而是为了自己。',
          },
        ],
      },
      {
        id: 'choose_stability',
        text: '他说：也许他们说得对，稳定才是最重要的。',
        outcomes: [
          {
            probability: 1,
            effects: [
              { target: 'willpower', value: -3 },
              { target: 'cognition', key: 'hypocrisy', value: 3 },
            ],
            narrative: '他选择了稳定。但心里有个声音在问：这是选择，还是妥协？',
          },
        ],
      },
    ],
  },
  {
    id: 'plot_broken_reflection',
    type: 'micro',
    category: 'personal',
    triggerCondition: { minDay: 120, season: ['autumn', 'winter'], chance: 0.4 },
    content: '你在梦中走进"万象街市"——那些被你抛弃的失败作品全都活了过来，它们以镜像的形态将你团团围住。其中一个开口了，声音像你自己的回声："你爱的究竟是我们的完美，还是你自己那个完美的影子？"',
    effects: [{ target: 'willpower', value: -5 }],
    source: 'inner',
    taskType: 'spontaneous',
    importance: 'critical',
    choices: [
      {
        id: 'break_mirror_anger',
        text: '愤怒地砸碎镜子——"你们懂什么！"',
        outcomes: [{ probability: 1, effects: [{ target: 'willpower', value: -10 }, { target: 'cognition', key: 'anger', value: 3 }], narrative: '镜子碎了，但每一片碎片里，都有他的眼睛在看着自己。' }],
      },
      {
        id: 'touch_fragments',
        text: '抚摸碎片——"你们……还疼吗？"',
        outcomes: [{ probability: 1, effects: [{ target: 'willpower', value: -5 }, { target: 'cognition', key: 'self_compassion', value: 3 }], narrative: '指尖被划破，但那一刻他第一次感受到——那些失败也是自己的一部分。' }],
      },
      {
        id: 'flee_mirror',
        text: '转身逃离——"这不是真的！"',
        outcomes: [{ probability: 1, effects: [{ target: 'willpower', value: -8 }, { target: 'cognition', key: 'self_deception', value: 2 }], narrative: '他逃了。但镜子里那个声音在脑海里回响，像没有关掉的收音机。' }],
      },
    ],
  },
  {
    id: 'plot_cut_attachment',
    type: 'micro',
    category: 'personal',
    triggerCondition: { minDay: 180, season: ['winter', 'spring'], chance: 0.35 },
    content: '妄镜深处的剧场。你站在舞台中央，聚光灯刺得睁不开眼。观众席上坐着所有人——母亲、姐姐、旧友——他们齐声呼唤："演下去！演好你的角色！"你发现脸上的面具已经摘不下来了。',
    effects: [{ target: 'willpower', value: -8 }, { target: 'herd', value: 3 }],
    source: 'inner',
    taskType: 'crisis',
    importance: 'critical',
    choices: [
      {
        id: 'keep_performing',
        text: '继续表演——"好，我演给你们看。"',
        outcomes: [{ probability: 1, effects: [{ target: 'willpower', value: -8 }, { target: 'cognition', key: 'mask_wearer', value: 3 }], narrative: '掌声雷动。但主角知道，掌声不是给他的——是给那个角色的。' }],
      },
      {
        id: 'smash_mask',
        text: '摔掉面具——"我不演了！"',
        outcomes: [{ probability: 1, effects: [{ target: 'willpower', value: -15 }, { target: 'cognition', key: 'break_mask', value: 5 }], narrative: '面具碎裂的声音盖过了掌声。观众席一片寂静——然后，有人在黑暗中鼓起掌来。' }],
      },
      {
        id: 'question_audience',
        text: '反问观众——"你们到底想要什么？"',
        outcomes: [{ probability: 1, effects: [{ target: 'willpower', value: -10 }, { target: 'cognition', key: 'question_norm', value: 3 }], narrative: '观众面面相觑。一个苍老的声音说："我们……只是想看到真实的你。"' }],
      },
    ],
  },
  {
    id: 'plot_bridge_souls',
    type: 'micro',
    category: 'personal',
    triggerCondition: { minDay: 300, season: ['spring', 'summer'], chance: 0.3 },
    content: '经历妄镜之旅后你回到现实。一个被裁员的中年人在路边抽烟，一个年轻人在社交媒体上写下"我不知道该做什么"。你知道那种感觉。你走过去的时候，心里有个声音说：你可以装作没看见。',
    effects: [{ target: 'willpower', value: -5 }],
    source: 'inner',
    taskType: 'spontaneous',
    importance: 'critical',
    choices: [
      {
        id: 'help_three',
        text: '帮助每一个你遇到的人',
        outcomes: [{ probability: 1, effects: [{ target: 'willpower', value: -20 }, { target: 'cognition', key: 'action_is_knowledge', value: 5 }], narrative: '每一次伸出援手，心口那个位置都会暂时黯淡——但随后比之前更亮。你明白了：良知不是存粮，是肌肉。越用越强。' }],
      },
      {
        id: 'help_one',
        text: '量力而行，帮一个就够了',
        outcomes: [{ probability: 1, effects: [{ target: 'willpower', value: -10 }, { target: 'cognition', key: 'moderate_action', value: 3 }], narrative: '你帮了一个人。不够完美，但你已经不是那个"要么不做、要做就要最好"的人了。这本身就是成长。' }],
      },
      {
        id: 'refuse_help',
        text: '"我自己都没站稳，怎么扶别人？"',
        outcomes: [{ probability: 1, effects: [{ target: 'willpower', value: -5 }, { target: 'cognition', key: 'inaction_decay', value: 2 }], narrative: '你走开了。但那天晚上，你梦见一面镜子——不是因为太久没用而蒙尘，而是因为太久没用而裂开。' }],
      },
    ],
  },
];
