import type { WorldEvent } from '../../types/event';

export const MICRO_EVENT_POOL: WorldEvent[] = [
  {
    id: 'micro_old_exam_signup',
    type: 'micro',
    category: 'personal',
    triggerCondition: { chance: 0.3 },
    content: '考研报名季又到了。朋友圈里满是"冲冲冲"的转发，他却连打开报名网站的勇气都没有。',
    effects: [{ target: 'willpower', value: -3 }],
    macroPhase: 'old_order',
    importance: 'routine',
    source: 'school',
    choices: [
      {
        id: 'consider_again',
        text: '他说：要不……再试一次？',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -5 }, { target: 'cognition', key: 'effort', value: 2 }],
            narrative: '他犹豫了很久，最终没有点开那个页面。但那个念头像根刺一样扎在心里。',
          },
        ],
      },
      {
        id: 'skip_exam',
        text: '他说：算了，不折腾了。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 2 }, { target: 'cognition', key: 'self_worth', value: -2 }],
            narrative: '他关掉手机。放弃的感觉既轻松又沉重。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_old_civil_service',
    type: 'micro',
    category: 'social',
    triggerCondition: { chance: 0.3 },
    content: '考公培训班广告铺天盖地。"上岸"两个字像咒语一样，出现在每个焦虑的角落。',
    effects: [{ target: 'willpower', value: -2 }],
    macroPhase: 'old_order',
    importance: 'routine',
    source: 'society',
    choices: [
      {
        id: 'look_into_it',
        text: '他说：也许该了解一下……',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -3 }, { target: 'cognition', key: 'hypocrisy', value: 2 }],
            narrative: '他搜了一下行测题。那些逻辑判断让他想起考研的日子——又是"标准答案"的世界。',
          },
        ],
      },
      {
        id: 'ignore_ads',
        text: '他说：不想看这些。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -1 }],
            narrative: '他划走了广告，但"上岸"两个字还是在他脑子里转了一圈。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_old_parent_pressure',
    type: 'micro',
    category: 'family',
    triggerCondition: { chance: 0.4 },
    content: '母亲又打来电话，问工作找得怎么样了。他说"还在看"，电话那头沉默了三秒。',
    effects: [{ target: 'willpower', value: -4 }],
    macroPhase: 'old_order',
    importance: 'significant',
    source: 'family',
    choices: [
      {
        id: 'reassure_mom',
        text: '他说：妈，你别担心，我有计划的。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -2 }, { target: 'cognition', key: 'hypocrisy', value: 2 }],
            narrative: '他挂了电话。"有计划"——他对自己说了三遍，还是不信。',
          },
        ],
      },
      {
        id: 'be_honest',
        text: '他说：妈，我……还没找到。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -5 }, { target: 'cognition', key: 'self_worth', value: -2 }],
            narrative: '他听到了母亲压抑的叹息。那声叹息比任何指责都重。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_old_classmate_success',
    type: 'micro',
    category: 'social',
    triggerCondition: { chance: 0.25 },
    content: '大学同学在群里发了入职通知——某大厂，年薪三十万。群里一片"恭喜"，他默默退出了聊天界面。',
    effects: [{ target: 'willpower', value: -5 }],
    macroPhase: 'old_order',
    importance: 'significant',
    source: 'social',
    choices: [
      {
        id: 'congratulate',
        text: '他说：恭喜啊！',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -3 }, { target: 'cognition', key: 'self_worth', value: -3 }],
            narrative: '他打出了"恭喜"两个字。手指在屏幕上停了很久，又删掉了后面那句"真羡慕你"。',
          },
        ],
      },
      {
        id: 'mute_group',
        text: '他把群消息设为免打扰。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -2 }, { target: 'cognition', key: 'meaninglessness', value: 2 }],
            narrative: '他关掉了通知。但那个数字——三十万——像刻在了他脑子里。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_old_shrinking_recruitment',
    type: 'micro',
    category: 'economic',
    triggerCondition: { chance: 0.35 },
    content: '招聘网站上的岗位又少了一批。去年还能投的几个公司，今年连招聘页面都没了。',
    effects: [{ target: 'willpower', value: -3 }],
    macroPhase: 'old_order',
    importance: 'routine',
    source: 'work',
    choices: [
      {
        id: 'keep_applying',
        text: '他说：总会有机会的。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -2 }, { target: 'cognition', key: 'effort', value: 1 }],
            narrative: '他继续刷新页面。每刷一次，希望就少一点。',
          },
        ],
      },
      {
        id: 'give_up_today',
        text: '他说：今天不看了。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -4 }, { target: 'cognition', key: 'meaninglessness', value: 2 }],
            narrative: '他关掉了电脑。窗外的天灰蒙蒙的，和心情一样。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_old_rent_due',
    type: 'micro',
    category: 'personal',
    triggerCondition: { chance: 0.3 },
    content: '房东发来消息：下个月房租要涨两百。他看了看银行卡余额，沉默了很久。',
    effects: [{ target: 'willpower', value: -4 }],
    macroPhase: 'old_order',
    importance: 'routine',
    source: 'work',
    choices: [
      {
        id: 'negotiate_rent',
        text: '他说：能不能不涨？我住了这么久了……',
        outcomes: [
          {
            probability: 0.5,
            effects: [{ target: 'willpower', value: -2 }],
            narrative: '房东说考虑一下。他知道自己没有谈判的筹码。',
          },
          {
            probability: 0.5,
            effects: [{ target: 'willpower', value: -5 }],
            narrative: '房东说：不行就搬。他不知道搬到哪里去。',
          },
        ],
      },
      {
        id: 'accept_rent',
        text: '他说：好吧。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -3 }, { target: 'cognition', key: 'meaninglessness', value: 1 }],
            narrative: '他回复了"好的"。两百块，又是一个月的泡面钱。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_old_comparison_dinner',
    type: 'micro',
    category: 'family',
    triggerCondition: { chance: 0.25 },
    content: '家庭聚餐，亲戚问起工作。表哥在银行，堂姐在国企，他端着碗不敢抬头。',
    effects: [{ target: 'willpower', value: -5 }],
    macroPhase: 'old_order',
    importance: 'significant',
    source: 'family',
    choices: [
      {
        id: 'excuse_leave',
        text: '他说：我去趟洗手间。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -3 }, { target: 'cognition', key: 'self_worth', value: -2 }],
            narrative: '他躲在洗手间里，看着镜子里自己的脸，觉得好陌生。',
          },
        ],
      },
      {
        id: 'sit_through',
        text: '他一言不发地坐着。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -5 }, { target: 'cognition', key: 'hypocrisy', value: 2 }],
            narrative: '他听完了所有亲戚的"建议"。每一句都像是在说：你不够好。',
          },
        ],
      },
    ],
  },

  {
    id: 'micro_cracking_degree_devalue',
    type: 'micro',
    category: 'social',
    triggerCondition: { chance: 0.35 },
    content: '热搜：某985硕士送外卖。评论区两极分化——"学历无用"和"个人问题"。他不知道该站哪边。',
    effects: [{ target: 'willpower', value: -4 }],
    macroPhase: 'cracking',
    importance: 'significant',
    source: 'society',
    choices: [
      {
        id: 'agree_degree_useless',
        text: '他说：学历确实没什么用了。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -3 }, { target: 'cognition', key: 'meaninglessness', value: 3 }],
            narrative: '他放下了手机。如果学历没用，那他这些年到底在干什么？',
          },
        ],
      },
      {
        id: 'disagree',
        text: '他说：这只是个别现象。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -2 }, { target: 'cognition', key: 'effort', value: 1 }],
            narrative: '他试图说服自己。但"个别现象"越来越多了。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_cracking_father_retirement',
    type: 'micro',
    category: 'family',
    triggerCondition: { chance: 0.4 },
    content: '父亲打来电话：单位通知延迟退休，还要再干五年。电话那头的声音比以前苍老了很多。',
    effects: [{ target: 'willpower', value: -6 }],
    macroPhase: 'cracking',
    importance: 'critical',
    source: 'family',
    choices: [
      {
        id: 'comfort_father',
        text: '他说：爸，别太累了，我会想办法的。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -4 }, { target: 'cognition', key: 'effort', value: 3 }],
            narrative: '他挂了电话。"想办法"——他连自己的事都没想出办法。',
          },
        ],
      },
      {
        id: 'silent_guilt',
        text: '他什么也没说，只是"嗯"了一声。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -8 }, { target: 'cognition', key: 'self_worth', value: -3 }],
            narrative: '他听到父亲挂电话前的叹息。那声叹息里有疲惫，有无奈，还有对他没有说出口的期待。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_cracking_friend_career_change',
    type: 'micro',
    category: 'social',
    triggerCondition: { chance: 0.3 },
    content: '老朋友发消息说转行了，从金融转去做自媒体。"反正原来的路走不通了"，对方说。',
    effects: [{ target: 'willpower', value: -2 }],
    macroPhase: 'cracking',
    importance: 'routine',
    source: 'social',
    choices: [
      {
        id: 'ask_details',
        text: '他说：怎么样？还行吗？',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -1 }, { target: 'cognition', key: 'learning', value: 1 }],
            narrative: '朋友说还在摸索。他突然觉得，也许"走不通"的不只是朋友的那条路。',
          },
        ],
      },
      {
        id: 'just_like',
        text: '他点了个赞，没有回复。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -2 }],
            narrative: '他看着那个点赞图标，觉得自己和这个世界的连接越来越少了。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_cracking_ai_anxiety',
    type: 'micro',
    category: 'personal',
    triggerCondition: { chance: 0.4 },
    content: '深夜刷到一篇文章：你的工作有80%概率被AI替代。他躺在床上，盯着天花板，睡意全无。',
    effects: [{ target: 'willpower', value: -5 }],
    macroPhase: 'cracking',
    importance: 'significant',
    source: 'inner',
    choices: [
      {
        id: 'research_ai',
        text: '他说：也许该认真了解一下AI到底能做什么。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -3 }, { target: 'cognition', key: 'learning', value: 2 }],
            narrative: '他开始搜索。越看越焦虑，但至少他在看了。',
          },
        ],
      },
      {
        id: 'avoid_thinking',
        text: '他说：不想了，睡觉。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -6 }, { target: 'cognition', key: 'meaninglessness', value: 3 }],
            narrative: '他翻了个身。但那个数字——80%——在黑暗中格外清晰。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_cracking_side_hustle',
    type: 'micro',
    category: 'economic',
    triggerCondition: { chance: 0.3 },
    content: '同事在搞副业，说月入过万。他看了看自己的工资条，第一次认真想了想"副业"这件事。',
    effects: [{ target: 'willpower', value: -2 }],
    macroPhase: 'cracking',
    importance: 'routine',
    source: 'work',
    choices: [
      {
        id: 'try_side_hustle',
        text: '他说：也许可以试试……',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -3 }, { target: 'cognition', key: 'effort', value: 2 }],
            narrative: '他开始搜索副业项目。每一个都在说"轻松月入过万"，他不确定自己信不信。',
          },
        ],
      },
      {
        id: 'focus_main_job',
        text: '他说：先把主业做好吧。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -1 }],
            narrative: '他选择了专注。但"主业"本身，似乎也不太稳了。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_cracking_layoff_rumor',
    type: 'micro',
    category: 'economic',
    triggerCondition: { chance: 0.35 },
    content: '公司群里有人暗示要裁员。办公室的气氛突然变了，每个人都在假装正常工作。',
    effects: [{ target: 'willpower', value: -5 }],
    macroPhase: 'cracking',
    importance: 'significant',
    source: 'work',
    choices: [
      {
        id: 'update_resume',
        text: '他悄悄更新了简历。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -3 }, { target: 'cognition', key: 'effort', value: 2 }],
            narrative: '他打开简历，发现上次更新是一年前。一年了，他好像什么也没变。',
          },
        ],
      },
      {
        id: 'wait_and_see',
        text: '他说：也许只是谣言。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -4 }, { target: 'cognition', key: 'meaninglessness', value: 2 }],
            narrative: '他选择相信那是谣言。但手心出了汗。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_cracking_gig_economy',
    type: 'micro',
    category: 'economic',
    triggerCondition: { chance: 0.25 },
    content: '越来越多的同龄人开始做自由职业——接单、开网店、做直播。稳定工作不再是唯一选择，但也不是谁都能自由。',
    effects: [{ target: 'willpower', value: -2 }],
    macroPhase: 'cracking',
    importance: 'routine',
    source: 'society',
    choices: [
      {
        id: 'consider_freelance',
        text: '他说：也许自由职业更适合我？',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -2 }, { target: 'cognition', key: 'self_worth', value: 1 }],
            narrative: '他想了想。自由？他连规律作息都做不到。',
          },
        ],
      },
      {
        id: 'stick_to_stability',
        text: '他说：至少现在还有份工作。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -1 }, { target: 'cognition', key: 'hypocrisy', value: 1 }],
            narrative: '他选择了稳定。但"稳定"这个词，越来越像一种自我安慰。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_cracking_mental_health',
    type: 'micro',
    category: 'personal',
    triggerCondition: { chance: 0.3 },
    content: '他已经连续失眠一周了。白天像行尸走肉，夜晚像溺水的人。他第一次认真考虑要不要去看心理医生。',
    effects: [{ target: 'willpower', value: -6 }, { target: 'organ', key: 'heart', value: -5 }],
    macroPhase: 'cracking',
    importance: 'critical',
    source: 'inner',
    choices: [
      {
        id: 'see_doctor',
        text: '他说：也许该去看看……',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 3 }, { target: 'cognition', key: 'self_worth', value: 2 }],
            narrative: '他搜索了附近的医院。承认自己需要帮助，也许不是软弱。',
          },
        ],
      },
      {
        id: 'endure_alone',
        text: '他说：没事，扛一扛就过去了。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -8 }, { target: 'cognition', key: 'meaninglessness', value: 3 }],
            narrative: '他选择了忍耐。但那些失眠的夜晚，每一秒都在变长。',
          },
        ],
      },
    ],
  },

  {
    id: 'micro_disintegration_new_job_type',
    type: 'micro',
    category: 'economic',
    triggerCondition: { chance: 0.35 },
    content: '招聘网站上出现了从未见过的职位：AI训练师、人机协作设计师、数字疗愈师。旧世界没有这些词。',
    effects: [{ target: 'willpower', value: -1 }],
    macroPhase: 'disintegration',
    importance: 'significant',
    source: 'society',
    choices: [
      {
        id: 'explore_new_jobs',
        text: '他说：这些工作……我能做吗？',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 2 }, { target: 'cognition', key: 'learning', value: 3 }],
            narrative: '他点进去看了看。门槛没有想象中高，但一切都要从头学起。',
          },
        ],
      },
      {
        id: 'too_late_to_change',
        text: '他说：来不及了，我什么都不懂。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -5 }, { target: 'cognition', key: 'self_worth', value: -2 }],
            narrative: '他关掉了页面。但那些新职业的名字，像来自另一个世界的信号。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_disintegration_old_industry_death',
    type: 'micro',
    category: 'economic',
    triggerCondition: { chance: 0.4 },
    content: '他曾经实习过的那家公司倒闭了。老板在朋友圈发了一条"时代变了"，然后删掉了所有动态。',
    effects: [{ target: 'willpower', value: -4 }],
    macroPhase: 'disintegration',
    importance: 'significant',
    source: 'work',
    choices: [
      {
        id: 'reflect_on_change',
        text: '他说：连他们都不行了……',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -3 }, { target: 'cognition', key: 'meaninglessness', value: 3 }],
            narrative: '他想起在那里的日子。那时候他还觉得，只要努力就能留下。现在连"那里"都没了。',
          },
        ],
      },
      {
        id: 'move_on',
        text: '他说：跟我没关系。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -2 }],
            narrative: '他划走了那条消息。但心里有个声音说：也许下一个就是你。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_disintegration_survival_anxiety',
    type: 'micro',
    category: 'personal',
    triggerCondition: { chance: 0.45 },
    content: '凌晨三点，他突然醒来。不是噩梦，是一种说不清的恐惧——如果明天一切都没有了呢？',
    effects: [{ target: 'willpower', value: -6 }, { target: 'organ', key: 'heart', value: -3 }],
    macroPhase: 'disintegration',
    importance: 'critical',
    source: 'inner',
    choices: [
      {
        id: 'face_fear',
        text: '他坐起来，试着想清楚自己在怕什么。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -2 }, { target: 'cognition', key: 'self_worth', value: 2 }],
            narrative: '他想了很久。怕的不是没有钱，而是没有方向。没有方向的人，连恐惧都没有形状。',
          },
        ],
      },
      {
        id: 'distract',
        text: '他打开手机，试图用信息流淹没那个声音。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -7 }, { target: 'cognition', key: 'meaninglessness', value: 4 }],
            narrative: '屏幕的蓝光照着他的脸。他刷了一个小时，什么也没记住。那个声音还在。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_disintegration_existential_question',
    type: 'micro',
    category: 'personal',
    triggerCondition: { chance: 0.3 },
    content: '他突然问自己：我到底为什么活着？不是为了什么理想，也不是为了谁。就是——为什么？',
    effects: [{ target: 'willpower', value: -4 }],
    macroPhase: 'disintegration',
    importance: 'critical',
    source: 'inner',
    choices: [
      {
        id: 'search_meaning',
        text: '他说：也许该认真想想这个问题。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 2 }, { target: 'cognition', key: 'happiness', value: 2 }],
            narrative: '他第一次不是在逃避这个问题。也许答案不重要，重要的是他开始问了。',
          },
        ],
      },
      {
        id: 'dismiss_question',
        text: '他说：想这些有什么用。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -5 }, { target: 'cognition', key: 'meaninglessness', value: 4 }],
            narrative: '他把问题推开了。但它会在某个深夜再次出现，像一颗定时炸弹。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_disintegration_community_breakdown',
    type: 'micro',
    category: 'social',
    triggerCondition: { chance: 0.3 },
    content: '他发现自己已经很久没有和任何人深聊了。朋友越来越少，社交越来越浅。每个人都在忙自己的生存。',
    effects: [{ target: 'willpower', value: -3 }],
    macroPhase: 'disintegration',
    importance: 'routine',
    source: 'social',
    choices: [
      {
        id: 'reach_out',
        text: '他翻出通讯录，想找个人聊聊。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -1 }, { target: 'cognition', key: 'self_worth', value: 1 }],
            narrative: '他划了很久的通讯录，最终没有拨出去。不是没人可打，是不知道说什么。',
          },
        ],
      },
      {
        id: 'accept_isolation',
        text: '他说：算了，一个人也挺好的。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -4 }, { target: 'cognition', key: 'meaninglessness', value: 2 }],
            narrative: '"挺好的"——他在心里重复了三遍，还是不信。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_disintegration_skill_obsolete',
    type: 'micro',
    category: 'economic',
    triggerCondition: { chance: 0.35 },
    content: '他花了好几年学的技能，现在AI十秒就能完成。那种感觉就像——建了一座桥，河却干了。',
    effects: [{ target: 'willpower', value: -6 }],
    macroPhase: 'disintegration',
    importance: 'significant',
    source: 'work',
    choices: [
      {
        id: 'learn_new_skill',
        text: '他说：得学点新的了。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -3 }, { target: 'cognition', key: 'learning', value: 3 }],
            narrative: '他开始搜索新的学习方向。每一步都很难，但至少他在走。',
          },
        ],
      },
      {
        id: 'grieve_loss',
        text: '他说：那些年都白费了……',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -8 }, { target: 'cognition', key: 'meaninglessness', value: 4 }],
            narrative: '他坐在电脑前，看着那些曾经引以为豪的作品。它们还在，但已经没有意义了。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_disintegration_parent_illness',
    type: 'micro',
    category: 'family',
    triggerCondition: { chance: 0.35 },
    content: '母亲体检报告出来了，有几个指标不太好。她在电话里说"没事没事"，但他听出了声音里的颤抖。',
    effects: [{ target: 'willpower', value: -7 }],
    macroPhase: 'disintegration',
    importance: 'critical',
    source: 'family',
    choices: [
      {
        id: 'go_home',
        text: '他说：我回去看看你。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -4 }, { target: 'cognition', key: 'effort', value: 2 }],
            narrative: '他买了回家的票。在火车上，他看着窗外飞速后退的风景，觉得自己亏欠了太多。',
          },
        ],
      },
      {
        id: 'promise_later',
        text: '他说：等忙完这阵子就回去。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -8 }, { target: 'cognition', key: 'hypocrisy', value: 3 }],
            narrative: '他知道自己说"等忙完"的时候，其实是在逃避。但面对需要勇气，而他现在没有。',
          },
        ],
      },
    ],
  },

  {
    id: 'micro_new_collab_opportunity',
    type: 'micro',
    category: 'economic',
    triggerCondition: { chance: 0.35 },
    content: '一个不太熟的朋友发来消息：有个新项目，需要人。不是传统的那种，更像是——一种新的协作方式。',
    effects: [{ target: 'willpower', value: 2 }],
    macroPhase: 'new_world',
    importance: 'significant',
    source: 'social',
    choices: [
      {
        id: 'join_project',
        text: '他说：可以聊聊。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 3 }, { target: 'cognition', key: 'learning', value: 3 }],
            narrative: '他赴了约。对方说的很多东西他听不太懂，但有一种久违的感觉——也许还有新的可能。',
          },
        ],
      },
      {
        id: 'decline_cautiously',
        text: '他说：最近有点忙，下次吧。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -2 }],
            narrative: '他拒绝了。但那个"新的协作方式"在他脑子里转了很久。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_new_xinyin_job',
    type: 'micro',
    category: 'economic',
    triggerCondition: { chance: 0.3 },
    content: '招聘平台上出现了一个新职位：情感架构师。职责描述里有一句话——"帮助人们重建内心秩序"。',
    effects: [{ target: 'willpower', value: 3 }],
    macroPhase: 'new_world',
    importance: 'significant',
    source: 'society',
    choices: [
      {
        id: 'apply_position',
        text: '他说：这个……我好像能做。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 5 }, { target: 'cognition', key: 'self_worth', value: 4 }],
            narrative: '他看了很久那个职位描述。有些词他不懂，但那种感觉——他懂。他经历了那么多，也许正是为了这个。',
          },
        ],
      },
      {
        id: 'doubt_qualification',
        text: '他说：我哪有资格做这个……',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -2 }, { target: 'cognition', key: 'self_worth', value: -1 }],
            narrative: '他关掉了页面。但那句话——"重建内心秩序"——像一束光照进了他灰暗的房间。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_new_reconciliation_family',
    type: 'micro',
    category: 'family',
    triggerCondition: { chance: 0.35 },
    content: '母亲发来一条很长的微信。不是催工作，不是问收入。她说：孩子，妈只是想你了。',
    effects: [{ target: 'willpower', value: 4 }],
    macroPhase: 'new_world',
    importance: 'significant',
    source: 'family',
    choices: [
      {
        id: 'call_back',
        text: '他拨了回去。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 5 }, { target: 'cognition', key: 'happiness', value: 3 }],
            narrative: '电话接通的那一刻，他什么也没说，只是听着母亲的声音。有些东西，不需要语言。',
          },
        ],
      },
      {
        id: 'text_back',
        text: '他回了一条：妈，我也想你。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 3 }, { target: 'cognition', key: 'self_worth', value: 2 }],
            narrative: '他打了很久才发出那条消息。有些话，说出来比想象中难得多。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_new_meaning_work',
    type: 'micro',
    category: 'personal',
    triggerCondition: { chance: 0.3 },
    content: '他第一次在工作中感受到了某种意义。不是成就感，而是一种——"这件事值得做"的感觉。',
    effects: [{ target: 'willpower', value: 5 }],
    macroPhase: 'new_world',
    importance: 'significant',
    source: 'inner',
    choices: [
      {
        id: 'follow_meaning',
        text: '他说：也许这就是方向。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 5 }, { target: 'cognition', key: 'happiness', value: 4 }],
            narrative: '他站在那里，感受着那种久违的确定感。不是所有问题都解决了，但至少他知道自己在往哪里走。',
          },
        ],
      },
      {
        id: 'doubt_feeling',
        text: '他说：别高兴太早，也许只是错觉。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -1 }, { target: 'cognition', key: 'self_worth', value: -1 }],
            narrative: '他压下了那个感觉。但它没有消失，只是在等他准备好。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_new_community',
    type: 'micro',
    category: 'social',
    triggerCondition: { chance: 0.3 },
    content: '他加入了一个小众社群——一群也在寻找新出路的人。没有人谈"上岸"，大家谈的是"怎么活"。',
    effects: [{ target: 'willpower', value: 3 }],
    macroPhase: 'new_world',
    importance: 'routine',
    source: 'social',
    choices: [
      {
        id: 'engage_community',
        text: '他说：也许可以多聊聊。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 3 }, { target: 'cognition', key: 'happiness', value: 2 }],
            narrative: '他第一次在群里说了自己的想法。有人回复：我也是。那两个字，比任何建议都温暖。',
          },
        ],
      },
      {
        id: 'lurk_quietly',
        text: '他只是看着，没有说话。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 1 }],
            narrative: '他默默读着别人的故事。每一条都像是在说他自己。也许有一天，他也会开口。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_new_self_acceptance',
    type: 'micro',
    category: 'personal',
    triggerCondition: { chance: 0.25 },
    content: '他照镜子的时候，第一次没有厌恶自己。不是因为变好了，而是——他开始接受"这样也行"。',
    effects: [{ target: 'willpower', value: 5 }],
    macroPhase: 'new_world',
    importance: 'critical',
    source: 'inner',
    choices: [
      {
        id: 'accept_self',
        text: '他说：也许我不需要成为别人。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 6 }, { target: 'cognition', key: 'self_worth', value: 5 }],
            narrative: '他对着镜子站了很久。那个人不完美，但他是真实的。也许这就够了。',
          },
        ],
      },
      {
        id: 'still_doubt',
        text: '他说：但别人不会这么想。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -1 }, { target: 'cognition', key: 'hypocrisy', value: 1 }],
            narrative: '他还在犹豫。但那个念头——"这样也行"——已经种下了。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_new_help_others',
    type: 'micro',
    category: 'social',
    triggerCondition: { chance: 0.3 },
    content: '一个比他更迷茫的人向他求助。他突然发现，自己经历的那些痛苦，竟然能帮到别人。',
    effects: [{ target: 'willpower', value: 4 }],
    macroPhase: 'new_world',
    importance: 'significant',
    source: 'social',
    choices: [
      {
        id: 'share_experience',
        text: '他说：我也许帮不了太多，但我可以告诉你我经历了什么。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 5 }, { target: 'cognition', key: 'happiness', value: 4 }],
            narrative: '他讲了很久。对方听完说：谢谢你，我觉得没那么孤独了。他愣了一下——原来，痛苦也有价值。',
          },
        ],
      },
      {
        id: 'hesitate_help',
        text: '他说：我自己都没搞明白……',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: -1 }],
            narrative: '他犹豫了。但那个人的眼神让他想起了曾经的自己。也许下次，他会伸出手。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_new_future_glimpse',
    type: 'micro',
    category: 'personal',
    triggerCondition: { chance: 0.25 },
    content: '某个清晨，他走在路上，突然觉得——也许未来没那么可怕。不是因为有了答案，而是因为不怕问题了。',
    effects: [{ target: 'willpower', value: 6 }],
    macroPhase: 'new_world',
    importance: 'critical',
    source: 'inner',
    choices: [
      {
        id: 'embrace_uncertainty',
        text: '他说：我不知道未来会怎样，但我想去看看。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 8 }, { target: 'cognition', key: 'happiness', value: 5 }],
            narrative: '他深吸一口气。空气里有春天的味道。他不确定这是希望还是幻觉，但他选择相信前者。',
          },
        ],
      },
      {
        id: 'cautious_hope',
        text: '他说：别想太多，走一步看一步吧。',
        outcomes: [
          {
            probability: 1,
            effects: [{ target: 'willpower', value: 3 }, { target: 'cognition', key: 'self_worth', value: 2 }],
            narrative: '他压下了那个念头。但脚步比以前轻了一点。也许，这就是开始。',
          },
        ],
      },
    ],
  },
];
