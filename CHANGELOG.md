# 更新日志

## [v4.3] - 2026-04-29

### 新增功能

#### 连接度系统
- 连接度初始值从 50 调整为 15，更符合设计意图
- 入梦采信率公式：基础 15% + (连接度/100 × 55%)，封顶 70%
- 认知转化概率受连接度影响：基础 50% + (连接度/100 × 50%)
- 龙场悟道连接度前提：连接度 < 30 时降级为部分体验
- 高连接度(≥80)时 15% 概率触发主角主动求助
- 低连接度(<20)时主角冷淡回应玩家输入

#### 时段驱动差异化交互
- 新增 `TimeOfDay` 枚举：MORNING / DAYTIME / EVENING / SLEEP
- 早晨输入仪式组件 `MorningRitual`：每日开始时的回顾与引导
- 晚上内心独白组件 `EveningMonologue`：主角夜间独白与玩家回应选项
- 入睡梦境碎片组件 `DreamFragment`：展示当日入梦结果或随机梦境
- 世界事件弹窗组件 `WorldEventModal`：处理带选项的世界事件

#### 结局判定系统
- 四种结局类型：心印的湮灭 / 群则的驯化 / 心印的超越 / 早夭
- 习惯系统：追踪玩家行为模式，影响结局判定
- 早夭触发机制：意志力耗尽时每日 2% 概率触发
- 结局场景组件 `EndingScene`：展示结局叙事与八年回顾数据

#### 配角系统
- 4 个关键 NPC：母亲、老刘(同事)、小陈(同事)、阿明(老友)
- NPC 介绍触发：按天数和季节自动引入
- NPC 事件系统：每个 NPC 有独立事件链，影响信任度和意志力
- NPC 亲密度追踪

#### 世界事件系统
- 宏观事件：经济危机、社会比较、季节变化
- 微观事件：个人爱好、情感时刻、家庭压力、工作意义
- 事件触发条件：天数、季节、连接度、概率等
- 事件选项系统：玩家可选择主角的回应方式

### 文件变更

#### 新增文件
- `src/types/ending.ts` - 结局类型与判定逻辑
- `src/types/habit.ts` - 习惯类型定义
- `src/types/npc.ts` - NPC 类型定义
- `src/stores/useDayPhaseStore.ts` - 时段状态管理
- `src/stores/useHabitStore.ts` - 习惯系统 Store
- `src/stores/useNpcStore.ts` - NPC 系统 Store
- `src/stores/useWorldEventStore.ts` - 世界事件 Store
- `src/data/events/worldEvents.ts` - 世界事件数据
- `src/data/npcs/initialNpcs.ts` - NPC 初始数据
- `src/systems/ending/endingJudge.ts` - 结局判定逻辑
- `src/components/game/EndingScene.tsx` - 结局场景组件
- `src/components/game/MorningRitual.tsx` - 早晨仪式组件
- `src/components/game/WorldEventModal.tsx` - 世界事件弹窗
- `src/components/narrative/EveningMonologue.tsx` - 晚间独白组件
- `src/components/narrative/DreamFragment.tsx` - 梦境碎片组件

#### 修改文件
- `src/types/trust.ts` - 连接度常量调整
- `src/types/time.ts` - 新增 TimeOfDay 枚举
- `src/types/event.ts` - 扩展事件条件字段
- `src/stores/usePlayerStore.ts` - 连接度接口扩展
- `src/stores/useTimeStore.ts` - 时段判断方法
- `src/stores/useCognitionStore.ts` - 连接度影响认知转化
- `src/stores/useEnlightenmentStore.ts` - 连接度影响悟道
- `src/stores/useSocialRuleStore.ts` - 群则数值提取
- `src/systems/gameLoop.ts` - 集成所有新系统
- `src/systems/skills/skillManager.ts` - 连接度影响入梦采信率
- `src/components/game/TextInput.tsx` - 低连接度冷淡回应
- `src/components/game/CoreGameLoop.tsx` - 时段 UI 集成
- `src/components/narrative/NarrativeDisplay.tsx` - 特殊叙事样式
- `src/App.tsx` - 结局场景路由

---

## [v4.2] - 2026-04-28

### 新增功能
- 回忆选择界面：玩家可自主选择要召唤的回忆
- 跳过开场动画功能
- 主菜单新增"再试一次"按钮

---

## [v4.1] - 2026-04-27

### 新增功能
- 完成 23 个回忆剧本
- 扩展情绪触发器和锚点系统
- 调试模式面板
