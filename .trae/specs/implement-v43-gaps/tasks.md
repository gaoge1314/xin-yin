# Tasks

## Phase 1: 连接度系统（遗漏2）— 前置基础

- [ ] Task 1: 修正连接度初始值和扩展 Store 接口
  - [ ] SubTask 1.1: 将 `usePlayerStore.ts` 中 `INITIAL_TRUST_LEVEL` 从50改为15
  - [ ] SubTask 1.2: 在 `usePlayerStore.ts` 中新增 `getConnectionLevel()` 计算属性（当前trustLevel即连接度）
  - [ ] SubTask 1.3: 在 `usePlayerStore.ts` 中新增 `isColdResponse()` 判断（连接度<20且未完全封闭）
  - [ ] SubTask 1.4: 在 `usePlayerStore.ts` 中新增 `isHighConnection()` 判断（连接度≥80）
  - [ ] SubTask 1.5: 新增连接度变动原因追踪（trustChangeReason 字段）

- [ ] Task 2: 连接度影响入梦采信率
  - [ ] SubTask 2.1: 在 `skillManager.ts` 的 `useDreamSkill` 中，入梦采信率计算加入连接度因子：基础15% + (连接度/100 × 55%)，封顶70%
  - [ ] SubTask 2.2: 在入梦叙事中体现采信成功/失败的不同描述

- [ ] Task 3: 连接度影响认知转化
  - [ ] SubTask 3.1: 在 `useCognitionStore.ts` 的认知转化逻辑中，连接度影响解释窗口接受概率：基础概率 + (连接度/100 × 50%)
  - [ ] SubTask 3.2: 在认知转化叙事中体现连接度的影响

- [ ] Task 4: 连接度作为龙场悟道前提
  - [ ] SubTask 4.1: 在 `useEnlightenmentStore.ts` 的 `checkTriggerConditions()` 中，检查连接度<30时降级为部分扫尘体验
  - [ ] SubTask 4.2: 连接度≥30时允许完整扫尘体验

- [ ] Task 5: 高连接度正面效果 — 主角主动求助
  - [ ] SubTask 5.1: 在 `gameLoop.ts` 的主角自主决策中加入：连接度≥80时，有15%概率生成"主动求助"行为（"你觉得呢？"类叙事）
  - [ ] SubTask 5.2: 在 `NarrativeDisplay.tsx` 中以特殊样式区分主角主动求助的叙事

- [ ] Task 6: 低连接度冷淡回应机制
  - [ ] SubTask 6.1: 修改 `TextInput.tsx`：连接度<20且未完全封闭时，输入框可用但主角回应冷淡
  - [ ] SubTask 6.2: 实现冷淡回应的叙事生成（简短、机械、冷淡的文字模板）
  - [ ] SubTask 6.3: 移除"完全封闭=禁用输入框"的逻辑，改为"极低连接度=冷淡回应"

---

## Phase 2: 时段驱动差异化交互（遗漏1）

- [ ] Task 7: 定义时段枚举和时段判断逻辑
  - [ ] SubTask 7.1: 在 `types/time.ts` 中新增 `TimeOfDay` 枚举：MORNING(6-8), DAYTIME(8-20), EVENING(20-23), SLEEP(23-6)
  - [ ] SubTask 7.2: 在 `useTimeStore.ts` 中新增 `getTimeOfDay()` 计算属性
  - [ ] SubTask 7.3: 新增 `useDayPhaseStore` 管理当前日阶段状态（是否已做早晨仪式、是否已显示晚上独白等）

- [ ] Task 8: 早晨输入仪式
  - [ ] SubTask 8.1: 创建 `MorningRitual.tsx` 组件，在新一天早晨6:00自动弹出
  - [ ] SubTask 8.2: 仪式包含：昨日简短回顾 + 今日引导输入 + 确认后才能继续游戏
  - [ ] SubTask 8.3: 在 `CoreGameLoop.tsx` 中集成，当 `TimeOfDay=MORNING` 且 `!morningRitualDone` 时渲染仪式

- [ ] Task 9: 白天观察模式
  - [ ] SubTask 9.1: 修改 `CoreGameLoop.tsx`，白天时段突出叙事日志区域，输入框默认收起
  - [ ] SubTask 9.2: 添加"打开输入框"按钮，点击后展开输入框并暂停时间
  - [ ] SubTask 9.3: 白天叙事以更紧凑的格式呈现主角行为和状态变化

- [ ] Task 10: 特殊事件弹窗提示
  - [ ] SubTask 10.1: 创建 `WorldEventModal.tsx` 组件，展示世界事件标题+描述+选择
  - [ ] SubTask 10.2: 事件触发时自动弹出，暂停游戏时间
  - [ ] SubTask 10.3: 提供"旁观"按钮（让主角自主选择）和玩家自定义选择

- [ ] Task 11: 晚上内心独白
  - [ ] SubTask 11.1: 在 `gameLoop.ts` 中，每天晚上21:00-23:00生成主角内心独白
  - [ ] SubTask 11.2: 基于 `usePlayerStore` 的心理档案和当日事件动态生成独白内容
  - [ ] SubTask 11.3: 创建 `EveningMonologue.tsx` 组件展示独白+回应选项
  - [ ] SubTask 11.4: 玩家回应影响连接度，不回应无惩罚

- [ ] Task 12: 入睡梦境碎片
  - [ ] SubTask 12.1: 修改 `gameLoop.ts` 的 `dailyEvent()` 睡眠结算，增加梦境碎片展示
  - [ ] SubTask 12.2: 创建 `DreamFragment.tsx` 组件展示梦境碎片（若有入梦信息）
  - [ ] SubTask 12.3: 在 `CoreGameLoop.tsx` 中集成入睡阶段的UI

---

## Phase 3: 结局判定系统（遗漏4）

- [ ] Task 13: 定义结局类型和判定数据结构
  - [ ] SubTask 13.1: 在 `types/` 中新增 `ending.ts`，定义 `EndingType` 枚举（ANNIHILATION/DOMESTICATION/TRANSCENDENCE/PREMATURE_DEATH）
  - [ ] SubTask 13.2: 定义 `EndingCriteria` 接口和 `EndingResult` 接口

- [ ] Task 14: 习惯系统（结局判定需要"正面习惯"维度）
  - [ ] SubTask 14.1: 在 `types/` 中新增 `habit.ts`，定义 `Habit` 接口（id, name, type: positive/negative, strength: 0-100, relatedActions）
  - [ ] SubTask 14.2: 创建 `useHabitStore.ts`，追踪习惯的形成和衰减
  - [ ] SubTask 14.3: 在 `gameLoop.ts` 的主角自主决策后更新习惯强度（重复行为+强度，不同行为-强度）

- [ ] Task 15: 群则数值提取
  - [ ] SubTask 15.1: 在 `useSocialRuleStore.ts` 中新增 `getSocialRuleLevel()` 计算属性，将所有社会规则的 intensity 加权汇总为 0-100 的"群则数值"

- [ ] Task 16: 结局判定逻辑
  - [ ] SubTask 16.1: 创建 `src/systems/ending/endingJudge.ts`，实现四种结局的判定函数
  - [ ] SubTask 16.2: 心印的湮灭：心印<30 群则>70 意志力上限<30 关键痛苦回忆无一治愈 连接度<20
  - [ ] SubTask 16.3: 群则的驯化：心印40-60 群则40-60 至少3个痛苦回忆治愈 连接度中等以上
  - [ ] SubTask 16.4: 心印的超越：心印>70 至少5个痛苦回忆治愈 龙场悟道完成 连接度>70 至少2个正面习惯
  - [ ] SubTask 16.5: 早夭：意志力归零后发生不可逆极端事件
  - [ ] SubTask 16.6: 判定优先级：早夭 > 湮灭 > 超越 > 驯化（默认）

- [ ] Task 17: 结局场景组件
  - [ ] SubTask 17.1: 创建 `EndingScene.tsx`，根据 EndingType 渲染不同的结局叙事和视觉
  - [ ] SubTask 17.2: 心印湮灭结局：暗色调，主角"成功但空心"的叙事
  - [ ] SubTask 17.3: 群则驯化结局：暖色调，温暖现实主义的叙事
  - [ ] SubTask 17.4: 心印超越结局：明亮色调，内心自足的叙事
  - [ ] SubTask 17.5: 早夭结局：黑屏+"有些伤口，需要比八年更长的时间。"
  - [ ] SubTask 17.6: 结尾展示8年数据回顾（心印/群则/连接度曲线、关键事件时间线等）
  - [ ] SubTask 17.7: 在 `App.tsx` 中将 phase='ending' 路由到 `EndingScene`

- [ ] Task 18: 早夭结局触发机制
  - [ ] SubTask 18.1: 在 `gameLoop.ts` 中，意志力归零后极低概率（2%/日）触发不可逆事件
  - [ ] SubTask 18.2: 不可逆事件直接触发早夭结局

---

## Phase 4: 配角系统（遗漏3）

- [ ] Task 19: NPC 类型定义
  - [ ] SubTask 19.1: 在 `types/` 中新增 `npc.ts`，定义 `NPCType`（KEY/FUNCTIONAL）、`NPC` 接口（id, name, type, role, personality, skillDistillation?, appearanceConditions）
  - [ ] SubTask 19.2: 定义 `KeyNPCRole` 枚举：CYNIC（玩世不恭者）/RIGHTEOUS（正直劝导者）/WOUNDED（创伤共鸣者）/NEEDY（需要帮助的人）
  - [ ] SubTask 19.3: 定义 `NPCInteraction` 接口（npcId, type, content, impact）

- [ ] Task 20: NPC Store
  - [ ] SubTask 20.1: 创建 `useNPCStore.ts`，管理已出现的NPC列表、NPC与主角关系
  - [ ] SubTask 20.2: 实现 `introduceNPC()` — 根据世界事件条件引入新配角
  - [ ] SubTask 20.3: 实现 `interactNPC()` — 处理主角与NPC的交互结果

- [ ] Task 21: 关键配角数据
  - [ ] SubTask 21.1: 创建 `src/data/npcs/keyNPCs.ts`，定义4类关键配角：玩世不恭者、正直劝导者、创伤共鸣者、需要帮助的人
  - [ ] SubTask 21.2: 每个关键配角包含：基本信息、Skill蒸馏（行为模式）、出场条件、交互对话模板
  - [ ] SubTask 21.3: 创建 `src/data/npcs/functionalNPCs.ts`，定义功能配角模板（同事、家人、旧友、陌生人）

- [ ] Task 22: NPC 出场与交互 UI
  - [ ] SubTask 22.1: 创建 `NPCInteractionModal.tsx`，展示NPC对话和交互选择
  - [ ] SubTask 22.2: NPC交互结果影响主角状态（认知、连接度、回忆触发）
  - [ ] SubTask 22.3: 在叙事日志中以不同样式标注NPC相关事件

---

## Phase 5: 世界事件系统（遗漏5）

- [ ] Task 23: 世界事件数据
  - [ ] SubTask 23.1: 创建 `src/data/events/macroEvents.ts`，定义宏观事件（经济变动、政策调整、社会趋势等，约10个）
  - [ ] SubTask 23.2: 创建 `src/data/events/microEvents.ts`，定义微观事件（个人境遇、家庭变故、偶遇等，约15个）
  - [ ] SubTask 23.3: 每个事件包含：触发条件、选择项、结果、与回忆/配角的联动标记

- [ ] Task 24: 事件触发引擎
  - [ ] SubTask 24.1: 创建 `src/systems/world/eventEngine.ts`，实现事件检查和触发逻辑
  - [ ] SubTask 24.2: 在 `gameLoop.ts` 的 tick 中集成事件引擎，每游戏日检查可触发事件
  - [ ] SubTask 24.3: 事件触发后加入事件队列，按优先级展示

- [ ] Task 25: 事件与回忆联动
  - [ ] SubTask 25.1: 在事件结果处理中，检查是否有回忆与此事件主题匹配
  - [ ] SubTask 25.2: 匹配时有概率触发回忆突现

- [ ] Task 26: 事件与配角引入联动
  - [ ] SubTask 26.1: 在事件的触发条件或结果中，检查是否满足关键配角出场条件
  - [ ] SubTask 26.2: 满足时自动调用 `useNPCStore.introduceNPC()`

- [ ] Task 27: 集成验证
  - [ ] SubTask 27.1: 全部功能在 CoreGameLoop 中正确集成，各阶段UI流畅切换
  - [ ] SubTask 27.2: TypeScript 编译无错误
  - [ ] SubTask 27.3: 游戏循环端到端可运行

---

# Task Dependencies
- [Task 2-6] depend on [Task 1] (连接度Store基础)
- [Task 8-12] depend on [Task 7] (时段枚举)
- [Task 16] depends on [Task 1] (连接度), [Task 14] (习惯), [Task 15] (群则数值)
- [Task 17] depends on [Task 16] (判定逻辑)
- [Task 18] depends on [Task 16] (结局判定)
- [Task 22] depends on [Task 19, 20, 21] (NPC类型+Store+数据)
- [Task 25, 26] depend on [Task 23, 24] (事件数据+引擎) and [Task 19-21] (NPC系统)
- [Task 27] depends on all previous tasks
