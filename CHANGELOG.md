# 更新日志

## [v4.4] - 2026-04-29

### 新增功能

#### 家庭系统
- 4名核心家庭成员NPC：父亲(61岁脑梗后)、母亲(58岁无业)、姐姐(35岁北大医院主治医)、可可(4岁外甥女)
- 父亲事件：沉默观察(每日)、饭桌叹气(每周)、突然问话(每月)、脑梗复发(剧情触发)
- 母亲事件：催吃饭/催起床(每日)、问冷暖/无意比较(每周)、崩溃争吵(状态触发)
- 姐姐事件：发招聘(每周)、谈心(双周)、和父母争吵(每月)、透露不快乐(连接度≥60触发)
- 可可事件：周末来玩(双周)、童言无忌(每月)
- 家庭成员亲密度追踪与连接度门槛事件

#### 2025-2035宏观事件时间线
- 第一阶段存量博弈期(2025-2026)：AI替代初级白领、考研人数突破500万、经济深度转型、考公人数新高
- 第二阶段结构调整期(2027-2029)：AI进入中端岗位、人口负增长影响、中美科技脱钩、供应链重组
- 第三阶段新常态形成期(2030-2032)：AI+人协作主流、社保体系改革、台海局势节点、UBI试点讨论
- 第四阶段终局期(2033-2035)：新生产力范式形成、价值观代际分化
- 每个事件含传导链条描述，选择结果实际影响游戏状态(意志力/认知/五脏)

#### 双轨任务系统
- 世界任务轨道：外部推送的任务，可完成/推迟/拒绝
- 主角个人计划轨道：短期/中期/长期/内在追问，根据心印等级动态生成
- 任务冲突检测：世界任务与个人计划冲突时标记，玩家可选择群则优先/心印优先/第三条路
- 完成率统计影响结局走向

#### 开场"前因"回忆模式
- 玩家选择放手时进入前因模式，展示9条核心记忆片段
- 终末显示"心印从未消失。你愿意再试一次吗？"
- 选择"再试一次"回到开场天台场景

#### 时间年份映射
- 游戏时间映射到真实年份：2025年春=游戏开始
- 宏观事件按年份+季节触发

### 新增记忆脚本
- 剧本24"姐姐的选择"：姐姐考大学时被迫选理科的往事
- 剧本25"父亲倒下那天"：父亲脑梗那天赶赴医院的场景
- 剧本26"可可出生"：2021年去医院看姐姐和新生可可的场景

### 文件变更

#### 新增文件
- `src/types/task.ts` - 双轨任务类型定义
- `src/stores/useTaskStore.ts` - 任务系统Store
- `src/components/game/TaskPanel.tsx` - 双轨任务面板UI
- `src/components/game/CauseModeScene.tsx` - 前因回忆模式场景

#### 修改文件
- `src/types/npc.ts` - NpcKey扩展、FamilyRole、NpcEventFrequency、organChange支持
- `src/types/event.ts` - year/seasonInYear/source/taskType/transmissionChain字段
- `src/types/time.ts` - currentYear字段、START_YEAR常量、getYear函数
- `src/types/save.ts` - GamePhase增加prologue-cause阶段
- `src/data/npcs/initialNpcs.ts` - 完全重写为4名家庭成员
- `src/data/events/worldEvents.ts` - 14个宏观事件覆盖2025-2034年
- `src/data/memories/memoryScripts.ts` - 新增3条家庭向记忆
- `src/stores/useNpcStore.ts` - getFamilyMembers/getFamilyEventByFrequency/checkConnectionGatedEvents
- `src/stores/useTimeStore.ts` - currentYear同步更新
- `src/stores/useWorldEventStore.ts` - 年份条件检测、StateEffect实际应用
- `src/stores/useGameStore.ts` - currentYear初始值
- `src/systems/gameLoop.ts` - 任务系统集成、家庭事件频率检查、年份触发
- `src/components/game/SceneController.tsx` - 前因模式流程
- `src/components/game/CoreGameLoop.tsx` - TaskPanel集成
- `src/App.tsx` - prologue-cause路由
- `src/types/index.ts` - 新类型导出

---

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
