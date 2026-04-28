import type { EmotionTrigger } from '../../types/emotionTrigger';

export const INITIAL_EMOTION_TRIGGERS: EmotionTrigger[] = [
  {
    id: 'inspection_trigger',
    triggerKeywords: ['检查', '审查', '扣分', '督查', '考核'],
    emotionType: 'anger',
    emotionReaction: '极度愤怒+无力感',
    relatedMemory: '督导事件：我一个人干10个人的活，最后因为一个错字被罚',
    willpowerEffect: -8,
    organEffect: { organ: 'liver', change: -5 },
  },
  {
    id: 'comparison_trigger',
    triggerKeywords: ['对比', '比较', '别人', '不如', '差距'],
    emotionType: 'self_doubt',
    emotionReaction: '自我否定+沉默',
    relatedMemory: '小学纸条游戏：被逼撕掉最后一张纸',
    willpowerEffect: -6,
    organEffect: { organ: 'spleen', change: -3 },
  },
  {
    id: 'meaningless_work',
    triggerKeywords: ['无意义', '机械', '重复', '被迫', '无聊'],
    emotionType: 'numbness',
    emotionReaction: '麻木+自我嘲讽',
    relatedMemory: '考研刷题：把例题做10遍，像机器',
    willpowerEffect: -4,
    organEffect: { organ: 'heart', change: -2 },
  },
  {
    id: 'parent_expectation',
    triggerKeywords: ['期望', '父母', '失望', '背影', '愧疚'],
    emotionType: 'guilt',
    emotionReaction: '愧疚+愤怒',
    relatedMemory: '考研放榜后父亲转身去阳台的背影',
    willpowerEffect: -10,
    organEffect: { organ: 'stomach', change: -4 },
  },
  {
    id: 'unrequited_love',
    triggerKeywords: ['喜欢', '表达', '不敢', '暗恋', '自作多情'],
    emotionType: 'shame',
    emotionReaction: '自我欺骗+羞耻',
    relatedMemory: '对某女生的自作多情，最终发现只是自我感动',
    willpowerEffect: -5,
    organEffect: { organ: 'lungs', change: -2 },
  },
];
