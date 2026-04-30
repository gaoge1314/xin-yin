# 更新日志

## [v4.8] - 2026-04-30

### 新增功能

#### 心印触发机制系统（基于 v4.6 设计文档）

核心设计原则：
- **缝隙原则**：玩家只能在主角惯性运转出现缝隙时介入，不创造缝隙，只响应缝隙
- **沉默是常态**：玩家大部分时间在观察，不回应不是失职，是等待对的时机
- **感知层过滤**：玩家接收的不是客观事件，而是心印对这些事件的感知——它们"意味着什么"

#### 输入框三种状态
- **休眠**：屏幕边缘一个小光点，不可输入，鼠标悬停显示主角当前状态简述
- **浮现**：光点闪烁或扩大为输入框，显示心印感知内容，可输入或关闭
- **紧急**：输入框强制弹出，画面边缘变暗，必须回应或选择"沉默陪伴"

#### 7种触发条件（T01-T07）
| 触发ID | 触发类型 | 状态 | 优先级 | 触发条件 |
|:---|:---|:---|:---|:---|
| T01 | 早晨醒来 | 浮现 | 高 | 每日必触发，睡眠结算完成后 |
| T02 | 意志力临界 | 紧急 | 最高 | 意志力≤15 或单次下降>40 |
| T03 | 面临选择节点 | 浮现/紧急 | 高 | 任务冲突/两难选择 |
| T04 | 回忆突现结束 | 紧急 | 最高 | 被动/主动回忆退去后 |
| T05 | 社交触发认知标签 | 浮现 | 中 | tagTriggerIntensity≥4 |
| T06 | 主角主动呼唤 | 浮现/紧急 | 中 | 连接度>40概率触发 |
| T07 | 夜晚睡前 | 浮现 | 低 | 连接度≥25，主角准备入睡 |

#### 心印感知内容生成
- 每种触发类型生成心印视角的感知文本
- 不是"发生了什么"，而是"这意味着什么"
- 示例：母亲催吃饭 → "她不是在催饭，是在催他别死。"

#### 沉默后果系统
- 关闭浮现输入框 → 连接度-1
- 连续7天关闭早晨触发 → 额外-5
- 紧急触发超时不回应 → 连接度-2（封闭防御姿态时减半）
- 长期全部沉默 → 连接度缓慢下降，最低5（心印不会完全消失）
- 回应 → 根据触发类型和内容质量调整连接度

#### 冷却机制
- 每种触发类型独立冷却时间
- 从浮现/紧急回到休眠后，同类触发条件在冷却期内不再触发
- 不同类触发条件不受冷却影响

### 文件变更

#### 新增文件
- `src/types/playerTrigger.ts` - 触发系统类型定义（7种触发类型、3种输入框状态、优先级、冷却等）
- `src/stores/useTriggerStore.ts` - 触发系统 Zustand Store（状态转换、冷却管理、沉默追踪）
- `src/systems/trigger/checkTriggers.ts` - 7种触发条件检测逻辑
- `src/systems/trigger/generatePerception.ts` - 心印感知内容生成器
- `src/components/debug/sections/TriggerSection.tsx` - 调试面板触发系统分区

#### 修改文件
- `src/components/game/TextInput.tsx` - 输入框三种状态渲染：休眠/浮现/紧急
- `src/components/game/CoreGameLoop.tsx` - 紧急状态暗角效果，输入框显示逻辑与触发状态绑定
- `src/components/game/MorningRitual.tsx` - 整合 T01 触发，显示心印感知内容，沉默惩罚
- `src/components/narrative/EveningMonologue.tsx` - 整合 T07 触发，自由输入+沉默陪伴
- `src/systems/gameLoop.ts` - 集成触发检测（每6小时检查），回忆结束后标记 pendingMemoryEnd，NPC事件后检查社交触发
- `src/systems/dialogue/calculateConstraints.ts` - 触发类型影响防御姿态计算
- `src/systems/dialogue/buildDialogueInput.ts` - 传递 triggerType 到对话约束系统
- `src/stores/usePlayerStore.ts` - 信任度下限保护（最低5）
- `src/types/dialogue.ts` - DialogueInput 新增 triggerType 字段
- `src/types/save.ts` - 存档新增 triggerState 字段
- `src/types/debug.ts` - 新增 trigger 调试分区
- `src/types/index.ts` - 新类型导出
- `src/components/debug/DebugPanel.tsx` - 集成 TriggerSection

---

## [v4.7] - 2026-04-30

### 新增功能

#### 主角对话回应系统
- 主角白明泽现在会对外界做出自己的回应，不再完全被动
- 基于当前心理状态（意志力、心印/群则比、认知标签、连接度等）生成差异化、人格化的回应

#### 对话约束计算层
- `calculateDialogueConstraints()` 纯函数：6步约束计算
  1. 能量等级：意志力 → depleted/low/moderate/sufficient
  2. 防御姿态：10项条件累计加成 → open/normal/guarded/closed
  3. 回应长度：4×4矩阵查表 → minimal/short/normal/extended
  4. 服从意愿：群则/心印比 + 角色修正 → resistant/reluctant/neutral/willing
  5. 触发反应：认知标签 + 强度 → 行为描述文本
  6. 意志力消耗：指令型0.5-2.0倍率，非指令型0

#### 主角回应模板库
- 16种能量×防御组合通用回应（每种4-5条）
- 4种角色特定回应（母亲/父亲/姐姐/心印）
- 5种认知标签触发回应（自我价值/特殊性/无意义/学习/人际关系）
- 沉默/不回应模板（depleted+closed时使用）
- 每条回应配有内心独白（嘴上说的≠心里想的）

#### 对话记忆缓存
- 维护最近10轮对话摘要
- 追踪当前情绪状态（烦躁/麻木/略微放松/平静/低落/焦虑/防御/脆弱）
- 追踪对特定人的态度倾向（回避/抗拒/中立/信任/依赖）
- 未解决对话线程追踪

#### 群则值(herdLevel)追踪
- 新增 `herdLevel` 状态（初始值50）
- 每日基于社交规则强度和人格特质更新
- 影响服从意愿计算

#### UI集成
- NPC对话弹窗显示主角回应（斜体+暗色区分）
- 玩家输入后主角动态回应（替代固定冷模板）
- 叙事日志显示主角内心独白和封闭状态提示

### 文件变更

#### 新增文件
- `src/types/dialogue.ts` - 对话约束类型定义
- `src/systems/dialogue/calculateConstraints.ts` - 约束计算纯函数
- `src/systems/dialogue/generateResponse.ts` - 回应生成函数
- `src/systems/dialogue/dialogueMemoryCache.ts` - 对话记忆缓存
- `src/systems/dialogue/buildDialogueInput.ts` - DialogueInput工厂函数
- `src/data/dialogue/protagonistResponses.ts` - 主角回应模板库

#### 修改文件
- `src/stores/usePlayerStore.ts` - 新增 herdLevel 状态和 updateHerdLevel() 方法
- `src/stores/useNpcStore.ts` - NpcDialogEntry扩展主角回应字段，triggerEventAsDialog自动计算主角回应，dismissActiveDialog写入记忆缓存
- `src/components/game/NpcDialogModal.tsx` - 显示主角回应和内心独白
- `src/components/game/TextInput.tsx` - 固定冷回应替换为动态回应
- `src/systems/gameLoop.ts` - dailyEvent调用updateHerdLevel()

---

## [v4.6] - 2026-04-29

### 新增功能

#### 右侧面板重构：世界信息 + 最近交往
- 右侧面板从"技能"改为"世界"，默认展开
- 新增 `WorldInfoPanel` 组件：显示当前年份/季节/星期 + 待触发世界事件 + 历史世界事件
- 新增 `RecentInteractionsPanel` 组件：显示最近 10 条 NPC 交互记录（含 NPC 名、内容摘要、时间）
- 技能和任务面板保留在右侧面板下方

#### 母亲三餐事件系统
- 新增 3 个定时三餐事件（7h 早餐 / 12h 午餐 / 18h 晚餐）
- 三餐只在主角和母亲同时在家时触发
- 累计 3 天后自动处理（直接写入日志，不再弹窗）
- 主角和母亲分开 3 天后取消自动处理，下次同时在家重新触发三餐弹窗
- 每日重置主角在家状态为 `true`

#### 姐姐周六来访
- 新增 `sister_discuss_future` 事件：第一个周六姐姐来找主角商量"以后怎么办"
- 游戏开始时间为周四（第 0 天=周四，第 2 天=周六）

#### 定时事件调度系统
- `NpcEvent` 新增 `triggerHour` 字段：指定触发小时（0-23）
- `NpcEvent` 新增 `triggerDayOfWeek` 字段：指定星期几触发
- 新增 `checkTimeSpecificEvents()` 方法：每小时检查定时事件，100% 触发（非概率）
- `checkHourlyNpcEvents()` 跳过有 `triggerHour` 的事件（避免重复触发）
- `checkEvents()` 支持 `triggerDayOfWeek` 检查

#### 时间系统扩展
- 新增 `DayOfWeek` 类型、`DAY_OF_WEEK_LABELS` 标签、`getDayOfWeek()` 函数
- 游戏第 0 天=周四，映射：0=周四, 1=周五, 2=周六, 3=周日, 4=周一, 5=周二, 6=周三

#### NPC 交互历史追踪
- 新增 `interactionHistory`：记录最近 30 条 NPC 交互（含 NPC ID、名称、内容、天数、小时）
- 新增 `InteractionRecord` 接口
- `dismissActiveDialog()` 关闭对话时自动记录交互历史
- 新增 `getRecentInteractions(count?)` 方法

#### 主角在家状态
- `usePlayerStore` 新增 `isAtHome` 状态（默认 `true`）和 `setAtHome()` 方法
- 每日重置为在家状态

### 文件变更

#### 新增文件
- `src/components/game/WorldInfoPanel.tsx` - 世界信息面板组件
- `src/components/game/RecentInteractionsPanel.tsx` - 最近交往面板组件

#### 修改文件
- `src/types/npc.ts` - NpcEvent 新增 triggerHour, triggerDayOfWeek 字段
- `src/types/time.ts` - 新增 DayOfWeek 类型、DAY_OF_WEEK_LABELS、getDayOfWeek()
- `src/data/npcs/initialNpcs.ts` - 母亲三餐事件 + 姐姐周六来访事件
- `src/stores/useNpcStore.ts` - checkTimeSpecificEvents, interactionHistory, updateMealTracking, InteractionRecord
- `src/stores/usePlayerStore.ts` - isAtHome 状态, setAtHome() 方法
- `src/systems/gameLoop.ts` - 每 tick 调用 checkTimeSpecificEvents, 每日调用 updateMealTracking
- `src/components/game/CoreGameLoop.tsx` - 右侧面板重构，集成 WorldInfoPanel + RecentInteractionsPanel

---

## [v4.5] - 2026-04-29

### 新增功能

#### 时间暂停系统
- 新增时间暂停/继续按钮，不限次数使用
- 暂停按钮显示 ⏸/▶ 图标，暂停时高亮显示
- 支持多原因叠加暂停机制，多个系统可以同时暂停时间

#### 智能暂停原因追踪
- `pauseReasons` 系统：追踪多个暂停来源
  - `morning-ritual` — 晨间仪式
  - `evening-monologue` — 晚间独白
  - `dream-fragment` — 梦境碎片
  - `world-event` — 世界事件选择
  - `npc-dialog` — NPC 对话
  - `input-focus` — 输入框聚焦
  - `manual` — 手动暂停
- 时间恢复机制：只有当所有暂停原因都解除后，时间才会继续流动

#### NPC 对话弹窗系统
- 新增 `NpcDialogModal` 组件：展示 NPC 名字、描述、对话内容
- 对话队列系统：支持多个 NPC 对话排队依次展示
- 时间自动暂停：NPC 对话弹出时自动暂停时间，玩家点击"继续"后恢复
- 对话效果处理：-dismiss 时应用对话效果 (信任度/意志力/认知/脏腑)

#### 增强 NPC 事件推送频率
- 新增每 6 小时一次的 NPC 事件检查 (`hourlyNpcCheck`)
- 白天时段 (7-21 时) 15% 概率触发随机 NPC 对话
- 避免重复：检查对话队列和叙事日志，防止同一事件重复弹出
- 所有 NPC 事件改为弹窗展示，不再静默添加到日志

### Bug 修复

#### 修复对话框弹出时时间不暂停
- **问题根因**：`CoreGameLoop` 中使用 `togglePause()` 切换暂停，但 `checkDayPhaseTransition()` 每秒调用一次，如果仪式未完成会反复返回 'MORNING'，导致 `togglePause()` 被多次调用，暂停状态被反复开关
- **修复方案**：
  - `useTimeStore` 新增 `pause(reason)` / `resume(reason)` 方法
  - `CoreGameLoop` 改用 `pause()` / `resume()` 替代 `togglePause()`
  - `MorningRitual` / `EveningMonologue` / `DreamFragment` 完成时调用 `resume()`
  - `WorldEventModal` 选择后自动恢复时间
  - `NpcDialogModal` 关闭时自动恢复时间

### 文件变更

#### 新增文件
- `src/components/game/NpcDialogModal.tsx` - NPC 对话弹窗组件

#### 修改文件
- `src/stores/useTimeStore.ts` - 新增 `pauseReasons` 状态、`pause()` / `resume()` 方法、原因追踪机制
- `src/components/game/CoreGameLoop.tsx` - 改用 `pause()` / `resume()`，集成 `NpcDialogModal`，添加 `activeNpcDialog` 监听
- `src/components/game/MorningRitual.tsx` - 完成时调用 `resume('morning-ritual')`
- `src/components/narrative/EveningMonologue.tsx` - 完成时调用 `resume('evening-monologue')`
- `src/components/narrative/DreamFragment.tsx` - 完成时调用 `resume('dream-fragment')`
- `src/components/game/PauseButton.tsx` - 新增暂停/继续按钮
- `src/stores/useNpcStore.ts` - 新增 `activeNpcDialog`、`pendingDialogs`、`triggerEventAsDialog()`、`dismissActiveDialog()`、`processNextDialog()`、`checkHourlyNpcEvents()`
- `src/systems/gameLoop.ts` - NPC 事件改用 `triggerEventAsDialog()`，新增 `hourlyNpcCheck()` 每 6 小时检查

---

## [v4.4] - 2026-04-29

### 新增功能

#### 家庭系统
- 4 名核心家庭成员 NPC：父亲 (61 岁脑梗后)、母亲 (58 岁无业)、姐姐 (35 岁北大医院主治医)、可可 (4 岁外甥女)
- 父亲事件：沉默观察 (每日)、饭桌叹气 (每周)、突然问话 (每月)、脑梗复发 (剧情触发)
- 母亲事件：催吃饭/催起床 (每日)、问冷暖/无意比较 (每周)、崩溃争吵 (状态触发)
- 姐姐事件：发招聘 (每周)、谈心 (双周)、和父母争吵 (每月)、透露不快乐 (连接度≥60 触发)
- 可可事件：周末来玩 (双周)、童言无忌 (每月)
- 家庭成员亲密度追踪与连接度门槛事件

#### 2025-2035 宏观事件时间线
- 第一阶段存量博弈期 (2025-2026)：AI 替代初级白领、考研人数突破 500 万、经济深度转型、考公人数新高
- 第二阶段结构调整期 (2027-2029)：AI 进入中端岗位、人口负增长影响、中美科技脱钩、供应链重组
- 第三阶段新常态形成期 (2030-2032)：AI+人协作主流、社保体系改革、台海局势节点、UBI 试点讨论
- 第四阶段终局期 (2033-2035)：新生产力范式形成、价值观代际分化
- 每个事件含传导链条描述，选择结果实际影响游戏状态 (意志力/认知/五脏)

#### 双轨任务系统
- 世界任务轨道：外部推送的任务，可完成/推迟/拒绝
- 主角个人计划轨道：短期/中期/长期/内在追问，根据心印等级动态生成
- 任务冲突检测：世界任务与个人计划冲突时标记，玩家可选择群则优先/心印优先/第三条路
- 完成率统计影响结局走向

#### 开场"前因"回忆模式
- 玩家选择放手时进入前因模式，展示 9 条核心记忆片段
- 终末显示"心印从未消失。你愿意再试一次吗？"
- 选择"再试一次"回到开场天台场景

#### 时间年份映射
- 游戏时间映射到真实年份：2025 年春=游戏开始
- 宏观事件按年份 + 季节触发

### 新增记忆脚本
- 剧本 24"姐姐的选择"：姐姐考大学时被迫选理科的往事
- 剧本 25"父亲倒下那天"：父亲脑梗那天赶赴医院的场景
- 剧本 26"可可出生"：2021 年去医院看姐姐和新生可可的场景

### 文件变更

#### 新增文件
- `src/types/task.ts` - 双轨任务类型定义
- `src/stores/useTaskStore.ts` - 任务系统 Store
- `src/components/game/TaskPanel.tsx` - 双轨任务面板 UI
- `src/components/game/CauseModeScene.tsx` - 前因回忆模式场景

#### 修改文件
- `src/types/npc.ts` - NpcKey 扩展、FamilyRole、NpcEventFrequency、organChange 支持
- `src/types/event.ts` - year/seasonInYear/source/taskType/transmissionChain 字段
- `src/types/time.ts` - currentYear 字段、START_YEAR 常量、getYear 函数
- `src/types/save.ts` - GamePhase 增加 prologue-cause 阶段
- `src/data/npcs/initialNpcs.ts` - 完全重写为 4 名家庭成员
- `src/data/events/worldEvents.ts` - 14 个宏观事件覆盖 2025-2034 年
- `src/data/memories/memoryScripts.ts` - 新增 3 条家庭向记忆
- `src/stores/useNpcStore.ts` - getFamilyMembers/getFamilyEventByFrequency/checkConnectionGatedEvents
- `src/stores/useTimeStore.ts` - currentYear 同步更新
- `src/stores/useWorldEventStore.ts` - 年份条件检测、StateEffect 实际应用
- `src/stores/useGameStore.ts` - currentYear 初始值
- `src/systems/gameLoop.ts` - 任务系统集成、家庭事件频率检查、年份触发
- `src/components/game/SceneController.tsx` - 前因模式流程
- `src/components/game/CoreGameLoop.tsx` - TaskPanel 集成
- `src/App.tsx` - prologue-cause 路由
- `src/types/index.ts` - 新类型导出

---

## [v4.3] - 2026-04-29

### 新增功能

#### 连接度系统
- 连接度初始值从 50 调整为 15，更符合设计意图
- 入梦采信率公式：基础 15% + (连接度/100 × 55%)，封顶 70%
- 认知转化概率受连接度影响：基础 50% + (连接度/100 × 50%)
- 龙场悟道连接度前提：连接度 < 30 时降级为部分体验
- 高连接度 (≥80) 时 15% 概率触发主角主动求助
- 低连接度 (<20) 时主角冷淡回应玩家输入

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
- 4 个关键 NPC：母亲、老刘 (同事)、小陈 (同事)、阿明 (老友)
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
