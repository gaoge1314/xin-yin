import type { SocialRule } from '../../types/socialRule';

export const INITIAL_SOCIAL_RULES: SocialRule[] = [
  {
    id: 'oppressive_world',
    name: '压迫性世界',
    coreBelief: '这个世界是压迫性的，规则不是为人服务的，是用来管人的',
    derivedCommands: [
      '想要活下去，就必须遵守他们的规则',
      '反抗没用，只能找到缝隙生存',
      '要么变成狗，要么被狗咬',
    ],
    sourceEvents: ['警校经历', '高考考研经历', '实习站岗经历'],
    intensity: 0.85,
    isActive: true,
  },
  {
    id: 'utilitarian_relationship',
    name: '功利关系',
    coreBelief: '人都是功利的，真心会被利用',
    derivedCommands: [
      '不要轻易相信别人',
      '保持距离是保护自己',
      '真心话没人听，也没人信',
    ],
    sourceEvents: ['人际关系经历', '被背叛的经历'],
    intensity: 0.7,
    isActive: true,
  },
  {
    id: 'mask_survival',
    name: '面具生存',
    coreBelief: '大家迫不及待戴上面具，变成别人想要的样子',
    derivedCommands: [
      '不要表现真实的自己',
      '顺从比真诚更安全',
      '说什么都不如做什么',
    ],
    sourceEvents: ['学校经历', '工作经历'],
    intensity: 0.6,
    isActive: true,
  },
];
