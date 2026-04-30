import type { EnergyLevel, DefensePosture, SpeakerRole, ResponseLength } from '../../types/dialogue';

interface ResponseTemplate {
  text: string;
  innerVoice?: string;
  energyLevel?: EnergyLevel;
  defensePosture?: DefensePosture;
  speakerRole?: SpeakerRole;
  triggeredTag?: string;
  minLength?: ResponseLength;
}

const GENERAL_RESPONSES: ResponseTemplate[] = [
  { text: "……", innerVoice: "（不是不想说，是说不出来。）", energyLevel: 'depleted', defensePosture: 'closed' },
  { text: "嗯。", innerVoice: "（说了也没用。）", energyLevel: 'depleted', defensePosture: 'closed' },
  { text: "无所谓。", energyLevel: 'depleted', defensePosture: 'closed' },
  { text: "（不回应）", innerVoice: "（什么都无所谓了。）", energyLevel: 'depleted', defensePosture: 'closed' },
  { text: "……算了。", innerVoice: "（连解释的力气都没有。）", energyLevel: 'depleted', defensePosture: 'closed' },

  { text: "…放那儿吧。", innerVoice: "（别过来。）", energyLevel: 'depleted', defensePosture: 'guarded' },
  { text: "知道了。", innerVoice: "（其实没听进去。）", energyLevel: 'depleted', defensePosture: 'guarded' },
  { text: "不用管我。", innerVoice: "（不想欠任何人。）", energyLevel: 'depleted', defensePosture: 'guarded' },
  { text: "…你先走吧。", innerVoice: "（一个人待着就好。）", energyLevel: 'depleted', defensePosture: 'guarded' },

  { text: "…好。", innerVoice: "（其实心里不是这么想的。）", energyLevel: 'depleted', defensePosture: 'normal' },
  { text: "嗯…谢谢。", innerVoice: "（还是有点感激的。）", energyLevel: 'depleted', defensePosture: 'normal' },
  { text: "我没事…", innerVoice: "（其实不太好。）", energyLevel: 'depleted', defensePosture: 'normal' },
  { text: "…你说吧。", innerVoice: "（勉强在听。）", energyLevel: 'depleted', defensePosture: 'normal' },

  { text: "我…其实也想…", innerVoice: "（但说不出口。）", energyLevel: 'depleted', defensePosture: 'open' },
  { text: "我不知道…", innerVoice: "（什么都不知道了。）", energyLevel: 'depleted', defensePosture: 'open' },
  { text: "…好累。", innerVoice: "（终于承认了。）", energyLevel: 'depleted', defensePosture: 'open' },
  { text: "也许吧…", innerVoice: "（不确定自己还想要什么。）", energyLevel: 'depleted', defensePosture: 'open' },
  { text: "你能…别走吗…", innerVoice: "（不想一个人。）", energyLevel: 'depleted', defensePosture: 'open' },

  { text: "随便。", innerVoice: "（跟我没关系。）", energyLevel: 'low', defensePosture: 'closed' },
  { text: "跟我没关系。", energyLevel: 'low', defensePosture: 'closed' },
  { text: "不想说。", innerVoice: "（说了你也不懂。）", energyLevel: 'low', defensePosture: 'closed' },
  { text: "别问了。", energyLevel: 'low', defensePosture: 'closed' },

  { text: "…再说吧。", innerVoice: "（其实就是不想。）", energyLevel: 'low', defensePosture: 'guarded' },
  { text: "我考虑一下。", innerVoice: "（不会考虑的。）", energyLevel: 'low', defensePosture: 'guarded' },
  { text: "看情况。", innerVoice: "（永远不会有那种情况。）", energyLevel: 'low', defensePosture: 'guarded' },
  { text: "不一定。", innerVoice: "（大概率不会。）", energyLevel: 'low', defensePosture: 'guarded' },

  { text: "好吧。", innerVoice: "（勉强答应。）", energyLevel: 'low', defensePosture: 'normal' },
  { text: "我试试。", innerVoice: "（不抱什么希望。）", energyLevel: 'low', defensePosture: 'normal' },
  { text: "行吧…", innerVoice: "（算了，随它去吧。）", energyLevel: 'low', defensePosture: 'normal' },
  { text: "知道了，我会想想。", innerVoice: "（大概会忘。）", energyLevel: 'low', defensePosture: 'normal' },

  { text: "也许…可以试试。", innerVoice: "（其实有点想。）", energyLevel: 'low', defensePosture: 'open' },
  { text: "你说得…好像有点道理。", innerVoice: "（第一次觉得别人说得对。）", energyLevel: 'low', defensePosture: 'open' },
  { text: "我可能需要…一点时间。", innerVoice: "（在给自己找台阶。）", energyLevel: 'low', defensePosture: 'open' },
  { text: "…你能再说说吗？", innerVoice: "（想听，但不好意思直说。）", energyLevel: 'low', defensePosture: 'open' },

  { text: "不用管我。", innerVoice: "（我能自己解决，只是不想说。）", energyLevel: 'moderate', defensePosture: 'closed' },
  { text: "我自己知道。", innerVoice: "（不需要你来告诉我。）", energyLevel: 'moderate', defensePosture: 'closed' },
  { text: "跟你没关系。", energyLevel: 'moderate', defensePosture: 'closed' },
  { text: "别来烦我。", innerVoice: "（不是真的烦，是不想被看穿。）", energyLevel: 'moderate', defensePosture: 'closed' },

  { text: "我再想想。", innerVoice: "（不想现在做决定。）", energyLevel: 'moderate', defensePosture: 'guarded' },
  { text: "不一定是这样。", innerVoice: "（有自己的想法，但不想说。）", energyLevel: 'moderate', defensePosture: 'guarded' },
  { text: "让我自己判断。", innerVoice: "（不想被影响。）", energyLevel: 'moderate', defensePosture: 'guarded' },
  { text: "…没那么简单。", innerVoice: "（事情比你想的复杂。）", energyLevel: 'moderate', defensePosture: 'guarded' },

  { text: "我知道了，我会考虑的。", innerVoice: "（真的会考虑。）", energyLevel: 'moderate', defensePosture: 'normal' },
  { text: "你说得有道理。", innerVoice: "（虽然不太想承认。）", energyLevel: 'moderate', defensePosture: 'normal' },
  { text: "嗯，我明白你的意思。", energyLevel: 'moderate', defensePosture: 'normal' },
  { text: "这个观点…我以前没想过。", innerVoice: "（有点被触动。）", energyLevel: 'moderate', defensePosture: 'normal' },
  { text: "好吧，你说服我了。", innerVoice: "（虽然嘴上不情愿。）", energyLevel: 'moderate', defensePosture: 'normal' },

  { text: "其实我也这么想过…", innerVoice: "（终于有人跟我想的一样。）", energyLevel: 'moderate', defensePosture: 'open' },
  { text: "你说得对，我确实…", innerVoice: "（在承认自己的脆弱。）", energyLevel: 'moderate', defensePosture: 'open' },
  { text: "我一直觉得…不只是我这样吧？", innerVoice: "（想确认自己不是异类。）", energyLevel: 'moderate', defensePosture: 'open' },
  { text: "谢谢你愿意听我说。", innerVoice: "（很久没人这样了。）", energyLevel: 'moderate', defensePosture: 'open' },

  { text: "不需要。", innerVoice: "（我能行，不用你操心。）", energyLevel: 'sufficient', defensePosture: 'closed' },
  { text: "我自己能解决。", innerVoice: "（不需要任何人的帮助。）", energyLevel: 'sufficient', defensePosture: 'closed' },
  { text: "别多管闲事。", energyLevel: 'sufficient', defensePosture: 'closed' },
  { text: "我的事我自己处理。", innerVoice: "（不想欠人情。）", energyLevel: 'sufficient', defensePosture: 'closed' },

  { text: "让我自己想想。", innerVoice: "（不是拒绝，是需要空间。）", energyLevel: 'sufficient', defensePosture: 'guarded' },
  { text: "不一定按你说的来。", innerVoice: "（我有自己的方式。）", energyLevel: 'sufficient', defensePosture: 'guarded' },
  { text: "我有别的想法。", innerVoice: "（但还没完全想好。）", energyLevel: 'sufficient', defensePosture: 'guarded' },
  { text: "你的方法不一定适合我。", innerVoice: "（不想被安排。）", energyLevel: 'sufficient', defensePosture: 'guarded' },

  { text: "我明白了，我会认真考虑。", innerVoice: "（真的在听。）", energyLevel: 'sufficient', defensePosture: 'normal' },
  { text: "你说得对，我需要改变。", innerVoice: "（承认需要改变，但不容易。）", energyLevel: 'sufficient', defensePosture: 'normal' },
  { text: "嗯，这个建议不错。", energyLevel: 'sufficient', defensePosture: 'normal' },
  { text: "我想我可以试试看。", innerVoice: "（有信心了。）", energyLevel: 'sufficient', defensePosture: 'normal' },
  { text: "谢谢你，我会记住的。", innerVoice: "（真心感激。）", energyLevel: 'sufficient', defensePosture: 'normal' },

  { text: "我最近在想…", innerVoice: "（想分享，但又犹豫。）", energyLevel: 'sufficient', defensePosture: 'open' },
  { text: "其实我一直想跟你说…", innerVoice: "（终于鼓起勇气了。）", energyLevel: 'sufficient', defensePosture: 'open' },
  { text: "你知道吗，我有时候觉得…", innerVoice: "（在打开心门。）", energyLevel: 'sufficient', defensePosture: 'open' },
  { text: "我愿意试试，真的。", innerVoice: "（第一次主动想改变。）", energyLevel: 'sufficient', defensePosture: 'open' },
  { text: "你说的话，我都听进去了。", innerVoice: "（难得的坦诚。）", energyLevel: 'sufficient', defensePosture: 'open' },
];

const SPEAKER_RESPONSES: Record<SpeakerRole, ResponseTemplate[]> = {
  mother: [
    { text: "…我知道了，妈。", innerVoice: "（她也是担心，但这种方式让我更难受。）", speakerRole: 'mother' },
    { text: "别催了…", innerVoice: "（越催越不想动。）", speakerRole: 'mother' },
    { text: "我会注意的。", innerVoice: "（说给她听的，不是真心的。）", speakerRole: 'mother' },
    { text: "妈，你别担心了。", innerVoice: "（但我知道你不会不担心。）", speakerRole: 'mother' },
    { text: "…嗯，吃了。", innerVoice: "（其实没吃。）", speakerRole: 'mother' },
    { text: "你不用特意来看我。", innerVoice: "（内疚，觉得自己是负担。）", speakerRole: 'mother' },
    { text: "对不起…让你操心了。", innerVoice: "（最大的愧疚来源。）", speakerRole: 'mother' },
    { text: "我知道你是为我好…", innerVoice: "（但'为我好'让我喘不过气。）", speakerRole: 'mother' },
  ],
  father: [
    { text: "…嗯。", innerVoice: "（我们之间永远隔着一堵墙。）", speakerRole: 'father' },
    { text: "我知道了。", innerVoice: "（他从来不听我说什么。）", speakerRole: 'father' },
    { text: "行。", innerVoice: "（最简短的回应，最远的距离。）", speakerRole: 'father' },
    { text: "…你忙你的吧。", innerVoice: "（反正你也不在乎。）", speakerRole: 'father' },
    { text: "不用了。", innerVoice: "（拒绝他的好意，因为不知道怎么接受。）", speakerRole: 'father' },
    { text: "我没问题。", innerVoice: "（在他面前永远不能示弱。）", speakerRole: 'father' },
  ],
  sister: [
    { text: "姐，你别管我了。", innerVoice: "（我不想让你浪费时间在我身上。）", speakerRole: 'sister' },
    { text: "我知道你是为我好，但…", innerVoice: "（但你的好让我更有压力。）", speakerRole: 'sister' },
    { text: "我自己能行。", innerVoice: "（其实不行，但不想让你担心。）", speakerRole: 'sister' },
    { text: "…谢谢姐。", innerVoice: "（她是唯一让我觉得可以稍微放松的人。）", speakerRole: 'sister' },
    { text: "你不用总是照顾我。", innerVoice: "（内疚，觉得自己拖累了她。）", speakerRole: 'sister' },
    { text: "姐，我…", innerVoice: "（想说点什么，又咽回去了。）", speakerRole: 'sister' },
    { text: "你也有自己的生活，别老想着我。", innerVoice: "（心疼她，但说不出温柔的话。）", speakerRole: 'sister' },
  ],
  player: [
    { text: "……", innerVoice: "（有时候听得到，有时候不想管。）", speakerRole: 'player' },
    { text: "你说的…我听到了。", innerVoice: "（不确定是不是真的想听。）", speakerRole: 'player' },
    { text: "也许你是对的…", innerVoice: "（第一次觉得内心有个声音在回应。）", speakerRole: 'player' },
    { text: "…你还在吗？", innerVoice: "（害怕这个声音也会消失。）", speakerRole: 'player' },
    { text: "我不确定…但好像有点感觉了。", innerVoice: "（微弱的连接，但确实存在。）", speakerRole: 'player' },
    { text: "你到底是谁？", innerVoice: "（好奇，又害怕答案。）", speakerRole: 'player' },
    { text: "…再说说。", innerVoice: "（想听更多，虽然嘴上不说。）", speakerRole: 'player' },
    { text: "如果你说的是真的…那为什么这么难？", innerVoice: "（在质疑，也在渴望。）", speakerRole: 'player' },
  ],
};

const TAG_TRIGGERED_RESPONSES: Record<string, ResponseTemplate[]> = {
  self_worth: [
    { text: "…别提这个了。", innerVoice: "（如果我不成功，我就不配活着。但我不想承认。）", triggeredTag: 'self_worth' },
    { text: "成功什么的…跟我没关系。", innerVoice: "（其实很在意，但不敢想。）", triggeredTag: 'self_worth' },
    { text: "我不配谈什么价值。", innerVoice: "（觉得自己一文不值。）", triggeredTag: 'self_worth' },
    { text: "那些都是别人的事。", innerVoice: "（把自己排除在'有价值的人'之外。）", triggeredTag: 'self_worth' },
    { text: "…够了。", innerVoice: "（这个话题太痛了。）", triggeredTag: 'self_worth' },
  ],
  specialness: [
    { text: "我没事。", innerVoice: "（心里并非真的这样想。）", triggeredTag: 'specialness' },
    { text: "随便，都行。", innerVoice: "（其实不是都行。）", triggeredTag: 'specialness' },
    { text: "我没什么特别的。", innerVoice: "（但内心深处渴望被看见。）", triggeredTag: 'specialness' },
    { text: "大家都一样。", innerVoice: "（不，每个人都不一样。但我不敢承认自己的不同。）", triggeredTag: 'specialness' },
  ],
  meaninglessness: [
    { text: "有什么区别吗…", innerVoice: "（所有事都是被迫的。）", triggeredTag: 'meaninglessness' },
    { text: "都一样。", innerVoice: "（看不到任何意义。）", triggeredTag: 'meaninglessness' },
    { text: "做了又怎样…", innerVoice: "（结果不会有区别。）", triggeredTag: 'meaninglessness' },
    { text: "反正最后都一样。", innerVoice: "（虚无感。）", triggeredTag: 'meaninglessness' },
    { text: "没什么好说的。", innerVoice: "（连解释的欲望都没有了。）", triggeredTag: 'meaninglessness' },
  ],
  learning: [
    { text: "别跟我提学习。", innerVoice: "（学习从来不是为了我。）", triggeredTag: 'learning' },
    { text: "学那些有什么用…", innerVoice: "（学了也只是满足别人的期待。）", triggeredTag: 'learning' },
    { text: "…不想说这个。", innerVoice: "（学习=被控制。）", triggeredTag: 'learning' },
    { text: "你不懂。", innerVoice: "（学习对我来说不是成长，是枷锁。）", triggeredTag: 'learning' },
  ],
  relationship: [
    { text: "你为什么对我好？", innerVoice: "（怕别人对我好是有条件的。）", triggeredTag: 'relationship' },
    { text: "…不用了，我自己能行。", innerVoice: "（不接受好意，因为怕还不起。）", triggeredTag: 'relationship' },
    { text: "你想要什么？", innerVoice: "（所有善意背后都有目的。）", triggeredTag: 'relationship' },
    { text: "别对我太好了。", innerVoice: "（我不值得，而且你会离开的。）", triggeredTag: 'relationship' },
    { text: "…我不信。", innerVoice: "（嘴上说不信，心里在渴望。）", triggeredTag: 'relationship' },
  ],
};

const SILENCE_RESPONSES: ResponseTemplate[] = [
  { text: "……", energyLevel: 'depleted', defensePosture: 'closed' },
  { text: "（沉默）", energyLevel: 'depleted', defensePosture: 'closed' },
  { text: "（没有回应）", energyLevel: 'depleted', defensePosture: 'closed' },
  { text: "（他转过了身）", energyLevel: 'depleted', defensePosture: 'closed' },
  { text: "（他闭上了眼）", energyLevel: 'depleted', defensePosture: 'closed' },
];

export function getResponseTemplates(): ResponseTemplate[] {
  return [
    ...GENERAL_RESPONSES,
    ...Object.values(SPEAKER_RESPONSES).flat(),
    ...Object.values(TAG_TRIGGERED_RESPONSES).flat(),
    ...SILENCE_RESPONSES,
  ];
}

export { ResponseTemplate, GENERAL_RESPONSES, SPEAKER_RESPONSES, TAG_TRIGGERED_RESPONSES, SILENCE_RESPONSES };
