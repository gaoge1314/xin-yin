import type { Npc } from '../../types/npc';

export const INITIAL_NPCS: Npc[] = [
  {
    id: 'mother',
    name: '母亲',
    role: 'FAMILY',
    introductionDay: 30,
    introductionSeason: 'spring',
    introductionContent: '她总是说"别人家的孩子"，却从来不问你在想什么。',
    currentCloseness: 20,
    isIntroduced: false,
    events: [
      {
        id: 'mother_call_1',
        triggerDay: 35,
        content: '母亲打来电话："你怎么又不回信息？是不是又在外面乱花钱？"',
        effect: { trustChange: -5, willpowerChange: -10 },
      },
      {
        id: 'mother_visit',
        triggerDay: 120,
        triggerSeason: 'autumn',
        content: '母亲突然来访。她看着他的住处，叹了口气："你就不能收拾收拾？"',
        effect: { trustChange: -8, willpowerChange: -15 },
      },
      {
        id: 'mother_warm',
        triggerDay: 200,
        content: '母亲沉默了很久，然后说："我知道...我不太会说话。但你还好吧？"',
        effect: { trustChange: 5 },
      },
    ],
  },
  {
    id: 'colleague_male',
    name: '老刘',
    role: 'WORK',
    introductionDay: 15,
    introductionSeason: 'spring',
    introductionContent: '工位旁边的同事，做事老练但话不多。偶尔会递一根烟过来。',
    currentCloseness: 15,
    isIntroduced: false,
    events: [
      {
        id: 'liu_smoke',
        triggerDay: 20,
        content: '老刘递来一根烟："新人，别太拼了，这地方吃人的。"',
        effect: { willpowerChange: 5 },
      },
      {
        id: 'liu_advice',
        triggerDay: 90,
        content: '老刘拍了拍他的肩："想开点，谁不是这样过来的？"',
        effect: { trustChange: 3 },
      },
      {
        id: 'liu_resign',
        triggerDay: 180,
        content: '老刘收拾了东西："我走了，你也别待太久。"',
        effect: { willpowerChange: -10, trustChange: -3 },
      },
    ],
  },
  {
    id: 'colleague_female',
    name: '小陈',
    role: 'SOCIAL',
    introductionDay: 45,
    introductionSeason: 'summer',
    introductionContent: '隔壁部门的同事，笑起来很爽朗，偶尔在食堂碰到。',
    currentCloseness: 10,
    isIntroduced: false,
    events: [
      {
        id: 'chen_chat',
        triggerDay: 50,
        content: '小陈在食堂偶遇他："你看起来好累，最近还好吗？"',
        effect: { trustChange: 3 },
      },
      {
        id: 'chen_invite',
        triggerDay: 100,
        content: '小陈邀请他参加部门聚餐："出来走走吧，总一个人待着不好。"',
        effect: { trustChange: 5, willpowerChange: -5 },
      },
    ],
  },
  {
    id: 'old_friend',
    name: '阿明',
    role: 'INNER_CIRCLE',
    introductionDay: 90,
    introductionSeason: 'summer',
    introductionContent: '大学时期的好友，毕业后各奔东西，但偶尔还会联系。',
    currentCloseness: 30,
    isIntroduced: false,
    events: [
      {
        id: 'ming_message',
        triggerDay: 95,
        content: '阿明发来消息："兄弟，好久没聊了，你怎么样？"',
        effect: { trustChange: 5 },
      },
      {
        id: 'ming_visit',
        triggerDay: 150,
        content: '阿明专程来看他："你看起来不太好...要不要聊聊？"',
        effect: { trustChange: 8, willpowerChange: 10 },
      },
      {
        id: 'ming_confront',
        triggerDay: 220,
        content: '阿明认真地说："你不能一直这样。你需要做出改变。"',
        effect: { trustChange: 5, cognitionUnlock: 'self_worth' },
      },
    ],
  },
];
