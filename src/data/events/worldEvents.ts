import type { WorldEvent } from '../../types/event';

export const WORLD_EVENTS: WorldEvent[] = [
  {
    id: 'macro_economic_crisis',
    type: 'macro',
    category: 'economic',
    triggerCondition: { minDay: 60, maxDay: 200, chance: 0.3 },
    content: '公司宣布裁员计划，整个部门人心惶惶。',
    effects: [],
    isOneShot: true,
    choices: [
      {
        id: 'acept_overtime',
        text: '他说：那就加班吧，保住位置要紧。',
        outcomes: [
          {
            probability: 1,
            effects: [],
            narrative: '他开始加班，但眼中没有了光。群则又紧了一分。',
          },
        ],
      },
      {
        id: 'refuse_overtime',
        text: '他说：我不想再这样了。',
        outcomes: [
          { probability: 0.5, effects: [], narrative: '他拒绝了，虽然忐忑，但终于做了一次选择。' },
          { probability: 0.5, effects: [], narrative: '他拒绝了，但随之而来的焦虑让他彻夜难眠。' },
        ],
      },
    ],
  },
  {
    id: 'macro_social_comparison',
    type: 'macro',
    category: 'social',
    triggerCondition: { minDay: 30, maxDay: 150, chance: 0.4 },
    content: '朋友圈里，同龄人晒着房子、车子和孩子。',
    effects: [],
    isOneShot: true,
    choices: [
      {
        id: 'close_phone',
        text: '他说：不看了。',
        outcomes: [
          {
            probability: 1,
            effects: [],
            narrative: '他关掉手机，但那些比较的声音已经在心里扎了根。',
          },
        ],
      },
      {
        id: 'scroll_more',
        text: '他继续刷着，越看越觉得自己渺小。',
        outcomes: [
          {
            probability: 1,
            effects: [],
            narrative: '每一条动态都像一根刺，扎在他已经千疮百孔的心上。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_personal_hobby',
    type: 'micro',
    category: 'personal',
    triggerCondition: { minDay: 40, minConnectionLevel: 30, chance: 0.25 },
    content: '他偶然看到一幅画，被深深吸引了。他想学画画，但觉得"这把年纪了，太晚了吧？"',
    effects: [],
    isOneShot: true,
    choices: [
      {
        id: 'start_hobby',
        text: '他说：试一试吧，为什么不呢？',
        outcomes: [
          {
            probability: 1,
            effects: [],
            narrative: '他买了第一盒颜料。那天的夕阳照在他身上，像是多了一种颜色。',
          },
        ],
      },
      {
        id: 'give_up_hobby',
        text: '他说：算了吧，没用的。',
        outcomes: [
          {
            probability: 1,
            effects: [],
            narrative: '他放下了那个念头，但画面的余光久久不散。',
          },
        ],
      },
    ],
  },
  {
    id: 'micro_personal_moment',
    type: 'micro',
    category: 'personal',
    triggerCondition: { minDay: 80, minConnectionLevel: 50, chance: 0.2 },
    content: '深夜里，他突然很想哭。',
    effects: [],
    isOneShot: true,
    choices: [
      {
        id: 'let_it_out',
        text: '他说：也许...我可以允许自己哭一次。',
        outcomes: [
          {
            probability: 1,
            effects: [],
            narrative: '眼泪流下来的那一刻，他感到一种奇异的平静——原来，允许自己脆弱，是需要勇气的。',
          },
        ],
      },
      {
        id: 'suppress',
        text: '他说：哭有什么用？',
        outcomes: [
          {
            probability: 1,
            effects: [],
            narrative: '他咬着嘴唇，硬生生把眼泪咽了回去。那一夜格外漫长。',
          },
        ],
      },
    ],
  },
  {
    id: 'family_parent_expectation',
    type: 'micro',
    category: 'family',
    triggerCondition: { minDay: 45, maxDay: 300, chance: 0.35 },
    content: '母亲又打来电话："你看你表哥，都当上经理了。你呢？"',
    effects: [],
    isOneShot: true,
    choices: [
      {
        id: 'argue_back',
        text: '他说：妈，我不是他。',
        outcomes: [
          { probability: 0.6, effects: [], narrative: '电话那头沉默了很久。他说出了那句话——也许是第一次。' },
          { probability: 0.4, effects: [], narrative: '争吵。然后是更长的沉默。挂了电话，他感到空虚。' },
        ],
      },
      {
        id: 'stay_silent',
        text: '他说：嗯，我知道了。',
        outcomes: [
          {
            probability: 1,
            effects: [],
            narrative: '又是沉默。又是咽下去的话。又是那个"嗯"。',
          },
        ],
      },
    ],
  },
  {
    id: 'macro_season_change',
    type: 'macro',
    category: 'social',
    triggerCondition: { season: ['autumn'], minDay: 180, chance: 0.3 },
    content: '秋天的风变冷了，街上的人都匆匆走过，像是奔赴各自的冬天。',
    effects: [],
    choices: [],
  },
  {
    id: 'micro_work_meaning',
    type: 'micro',
    category: 'economic',
    triggerCondition: { minDay: 100, minConnectionLevel: 40, chance: 0.2 },
    content: '加班到深夜，他看着屏幕上的数据，突然想：这些数字有什么意义？',
    effects: [],
    isOneShot: true,
    choices: [
      {
        id: 'question_meaning',
        text: '他说：我为什么要做这些？',
        outcomes: [
          {
            probability: 1,
            effects: [],
            narrative: '这个问题在深夜里回响。也许，质疑本身就已经是答案的一部分。',
          },
        ],
      },
      {
        id: 'keep_working',
        text: '他说：别想了，做事吧。',
        outcomes: [
          {
            probability: 1,
            effects: [],
            narrative: '他低下头，继续输数字。但心底的声音没有停。',
          },
        ],
      },
    ],
  },
];
