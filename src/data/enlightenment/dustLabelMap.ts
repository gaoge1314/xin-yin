import { DUST_TEXTS } from './dustTexts';

export const DUST_LABEL_MAP: Record<string, string[]> = {
  self_worth: ['不够好', '别人会怎么看', '我不配', '我不值得', '永远不够', '再努力一点'],
  specialness: ['我凭什么走不同的路', '我不配特殊', '别异想天开', '安分守己', '别做梦了'],
  meaninglessness: ['没有意义', '所有事都是被迫的', '活着有什么用', '想太多', '矫情'],
  failure: ['我不能失败', '失败了就是废物', '不能犯错', '来不及了', '别让人失望'],
  effort: ['我从未真正努力', '所有的失败都是因为懒', '还不够努力', '假装努力', '自欺欺人'],
  learning: ['学了也没用', '学习是折磨', '知识改变不了什么', '白学了'],
  relationship: ['没人真正爱我', '我不配被爱', '别给别人添麻烦', '自己扛'],
  hypocrisy: ['我是在骗所有人', '假装没事', '别表现出来', '习惯就好'],
  happiness: ['快乐是危险的', '我不该有这种感觉', '别人比我更苦', '别矫情'],
};

export const FALLBACK_DUST_TEXTS: string[] = [...DUST_TEXTS];
