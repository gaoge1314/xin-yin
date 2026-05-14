﻿﻿﻿﻿﻿﻿
## [v6.0] - 2026-05-14

### 三层Agent架构重构 —— "心君-谋臣-裁决官" 感性-理性-感性框架

基于 v6.0 设计文档，将游戏架构从预设选项/判定系统全面重构为三层独立 Agent 协作框架，实现真正的叙事驱动和 AI 自由生成。

#### 核心架构

| 层级 | Agent | 角色 | 职责 |
|:---|:---|:---|:---|
| 第一层（感性） | 心君 Agent | 潜意识代言人 | 识别发心时刻、建议愿望、感知当前状态 |
| 第二层（理性） | 谋臣 Agent | 理性规划者 | 转化愿望为执行计划、被灰尘曲解认知 |
| 第三层（感性） | 裁决官 Agent | 内在法官 | 判断结果是否匹配初心、评估遗产 |

#### 新增功能

##### 发心系统（心君 Agent）
- **发心时刻识别**：当灰尘积累或关键事件发生时，时间暂停，弹出愿望输入界面
- **建议愿望**：Agent 1 根据当前状态提供 3 个建议愿望选项
- **自由输入**：玩家可自由输入任何愿望
- **60秒倒计时**：发心时刻持续 60 秒，超时自动选择"接受惯性"
- **纯灰尘驱动**：发心触发完全由灰尘状态驱动
- **"我接受他按惯性走"选项**：接受当前惯性，让主角按既有轨迹行动

##### 灰尘扭曲机制（谋臣 Agent）
- **认知转码**：Agent 2 将玩家感性的愿望转码为理性的具体目标和执行计划
- **灰尘曲解**：在执行计划生成过程中，已有灰尘会扭曲认知，改变执行路径
- **激活规则**：当前仅激活最相关的 1 个灰尘（未来支持权重叠加调整难度）
- **叙事驱动**：AI 自由生成任意执行方案，呈现完整的叙事文本

##### 以行破知机制（扫尘 Agent）
- **行动破除认知**：灰尘（理性认知框架）只能通过具体行为证据消除
- **扫尘流程**：提供具体行动方案 → 标记对应灰尘为"可清除" → 执行清除
- **证据要求**：每次扫尘需要玩家提供具体的行为证据

##### 裁决系统（裁决官 Agent）
- **匹配度评分**：Agent 3 评估最终结果与原始初心的匹配程度（0-100）
- **内心独白**：揭示主角真实感受
- **扭曲检测**：判断计划是否被灰尘扭曲
- **遗产评估**：记录本次选择的微妙影响（双维度：物质世界 vs 精神世界）

##### 记忆衰减系统
- **艾宾浩斯遗忘曲线**：记忆强度 = 初始强度 × exp(-天数 / 半衰期)
- **衰减影响**：衰减后的记忆影响 Agent 决策权重
- **记忆摘要**：为 Agent 提供精简后的记忆上下文

##### 遗产追踪系统
- **双维度记录**：物质遗产（现实世界改变）vs 精神遗产（心灵世界改变）
- **结局判断**：根据遗产累积方向触发相应结局
- **微妙影响**：记录每次选择的长期影响

#### DeepSeek API 集成
- **自定义流式客户端**：基于 fetch 的 SSE 流式响应，实时更新 UI
- **三个独立 Agent**：每个 Agent 使用独立的系统提示词和 API 调用
- **提示词工程**：为每个 Agent 精心设计的角色设定和输出格式约束
- **错误处理**：完善的超时、重试和降级机制

#### UI 组件更新
- `DesireInput.tsx` - 发心输入界面，支持建议选择/自由输入/倒计时
- `JudgmentReveal.tsx` - 裁决结果展示，匹配度评分 + 内心独白
- `SweepingFlow.tsx` - 扫尘流程 UI，证据输入 + 灰尘清除
- `CoreGameLoop.tsx` - 重构为完整发心循环控制器

#### 类型系统扩展
- `src/types/agent.ts` - Agent 输入/输出接口定义
- `src/types/memory.ts` - 记忆衰减类型
- `src/types/legacy.ts` - 遗产追踪类型

#### 清理旧系统（移除 22 个过时文件）
- 移除 `src/systems/alignment/` - 相合判定引擎（被 Agent 3 替代）
- 移除 `src/systems/options/` - 预设选项生成器（被 Agent 2 替代）
- 移除 `src/systems/autonomousChoice/` - 自主选择系统
- 移除 `src/stores/useAlignmentStore.ts` - 相合判定状态
- 移除 `src/stores/useOptionStore.ts` - 选项状态
- 移除 `src/components/game/OptionList.tsx` - 旧选项列表
- 移除 `src/components/game/UltimateChoice.tsx` - 终极选择
- 移除 `src/components/game/CauseModeScene.tsx` - 因果模式场景
- 移除启蒙（龙场悟道）相关组件

### 文件变更

#### 新增文件（10个）
- `src/types/agent.ts` - Agent 交互类型定义
- `src/types/memory.ts` - 记忆衰减类型
- `src/types/legacy.ts` - 遗产追踪类型
- `src/systems/agents/agentManager.ts` - Agent 编排器
- `src/systems/agents/agentOne.ts` - 心君 Agent 实现
- `src/systems/agents/agentTwo.ts` - 谋臣 Agent 实现
- `src/systems/agents/agentThree.ts` - 裁决官 Agent 实现
- `src/systems/agents/sweepingAgent.ts` - 扫尘 Agent
- `src/systems/agents/deepseekClient.ts` - DeepSeek API 流式客户端
- `src/systems/memory/memoryDecay.ts` - 记忆衰减算法
- `src/systems/legacy/legacyTracker.ts` - 遗产追踪
- `src/systems/dialogue/compatStubs.ts` - 兼容性存根
- `src/components/game/DesireInput.tsx` - 发心输入界面
- `src/components/game/JudgmentReveal.tsx` - 裁决展示界面
- `src/components/game/SweepingFlow.tsx` - 扫尘流程界面

#### 修改文件（12个）
- `src/components/game/CoreGameLoop.tsx` - 集成三层 Agent 循环
- `src/components/game/GameScreen.tsx` - 更新导入路径
- `src/components/game/MorningRitual.tsx` - 适配新架构
- `src/components/game/SceneController.tsx` - 更新场景路由
- `src/components/game/VagusNerveMoment.tsx` - 适配新架构
- `src/components/game/TextInput.tsx` - 适配发心输入
- `src/components/narrative/EveningMonologue.tsx` - 适配新架构
- `src/stores/useGameStore.ts` - 新增 dustCount/legacyEntries
- `src/stores/useCognitionStore.ts` - 新增 dustCounter/evidence
- `src/stores/useNpcStore.ts` - 适配新架构
- `src/stores/usePlayerStore.ts` - 适配新架构
- `src/systems/gameLoop.ts` - 集成发心检查
- `src/data/npcs/initialNpcs.ts` - 适配新架构
- `src/types/save.ts` - 扩展存档类型
- `src/index.css` - 新增扫尘动画样式

#### 删除文件（22个）
- `src/systems/alignment/alignmentJudge.ts`
- `src/systems/alignment/alignmentTypes.ts`
- `src/systems/alignment/buildAlignmentInput.ts`
- `src/systems/alignment/fallbackAlignment.ts`
- `src/systems/options/optionGenerator.ts`
- `src/systems/options/optionMarkers.ts`
- `src/systems/autonomousChoice/autonomousChoice.ts`
- `src/systems/dialogue/buildDialogueInput.ts`
- `src/systems/dialogue/calculateConstraints.ts`
- `src/systems/dialogue/dialogueMemoryCache.ts`
- `src/systems/dialogue/generateResponse.ts`
- `src/stores/useAlignmentStore.ts`
- `src/stores/useOptionStore.ts`
- `src/components/game/OptionList.tsx`
- `src/components/game/UltimateChoice.tsx`
- `src/components/game/CauseModeScene.tsx`
- `src/components/game/enlightenment/EnlightenmentAwakening.tsx`
- `src/components/game/enlightenment/EnlightenmentFalling.tsx`
- `src/components/game/enlightenment/EnlightenmentSweeping.tsx`
- `src/data/dialogue/protagonistResponses.ts`

### v6.0.1 热修复 - 2026-05-14

#### Bug 修复

##### DesireInput 组件崩溃修复
- **问题**：`TypeError: Cannot read properties of undefined (reading 'map')` 在 DesireInput.tsx:92
- **根因**：Agent 1（心君）API 返回的 JSON 不完整或请求失败时，`suggestedDesires` 字段为 `undefined`
- **修复**：在 `DesireInput.tsx` 渲染时添加空值合并 `(agentOneOutput.suggestedDesires || [])`
- **修复**：在 `agentManager.ts` 中新增 `validateAgentOneOutput()` 函数，对所有 Agent 1 输出字段进行空值校验，并提供默认降级心愿选项
- **修复**：`startDesireCycle()` 中 API 调用包裹 try-catch，失败时使用默认降级值

##### CoreGameLoop 初始化时序修复
- **问题**：游戏进入核心循环时立即触发发心时刻检查，导致 Agent 1 API 在游戏状态未完全就绪时被调用
- **修复**：新增 `hasInitialized` 状态，添加 3 秒延迟后才开始执行发心检查
- **修改文件**：`CoreGameLoop.tsx` — 在 `useEffect` 中设置 `setTimeout` 延迟初始化

#### 安全修复
- `.env` 文件添加到 `.gitignore`，防止 API 密钥被提交到仓库

#### 修改文件
- `src/components/game/CoreGameLoop.tsx` — 初始化延迟 + 空值守卫
- `src/components/game/DesireInput.tsx` — 空值合并修复
- `src/systems/agents/agentManager.ts` — 输出校验 + 异常降级

### v6.0.2 发心时刻时间停止 - 2026-05-14

#### 新增功能

##### 发心时刻时间暂停
- **发心循环全阶段暂停**：进入发心提示、执行、裁决、扫尘等阶段时游戏时间自动暂停
- **迷走神经时刻暂停**：强制输入场景弹出时时间暂停
- **倒计时锁定**：在 DesireInput 自由输入框中输入文字时，60 秒倒计时暂停，失焦后恢复
- 使用 `useTimeStore` 多原因引用计数机制，通过 `pause('desire-cycle')` / `pause('vagus-nerve')` 实现

#### 修改文件
- `src/components/game/CoreGameLoop.tsx` — 新增发心循环时间暂停 useEffect + 迷走神经时刻暂停 useEffect
- `src/components/game/DesireInput.tsx` — 新增 isCustomInputFocused 状态，textarea 聚焦时暂停倒计时

---

## [v5.4] - 2026-05-12

### CrewAI 多Agent内容创作整合

首次成功调用 DeepSeek V4 Flash 运行 CrewAI 完整团队（剧情策划师→角色对话设计师→事件策划师→品质审核师），并将 AI 生成内容全量对接进游戏代码。

#### 剧情体系
- 新增剧情类型系统 `PlotArc`/`PlotChapter`/`PlotEnding`
- 三章完整剧情大纲《心印：破妄镜》（看见我执→破除我执→回归本心）
- 3种结局：觉醒之终 / 平衡之路 / 重返牢笼
- 9个关键事件，每个含2-4个选项分支

#### NPC对话扩展（6个新事件）
- 母亲：记忆祠堂线球事件、释然对话事件（含心学金句）
- 姐姐：面具谈话事件、和解拥抱事件
- 老友：测试币和解事件（含创业失败心结）

#### 世界事件扩展（3个关键事件）
- plot_broken_reflection（破碎的倒影·镜像质问）
- plot_cut_attachment（斩断面具·演技剧场）
- plot_bridge_souls（渡人之桥·良知磨练）

#### 品质审核
- 4个Agent全员完成，综合评分9.5/10
- 5条改进建议全部落地

### 文件变更

#### 新增文件（3个）
- `src/types/plot.ts` - 剧情类型系统
- `src/data/plot/narrativePlot.ts` - 三章剧情大纲数据
- `更新日志-CrewAI整合.md` - 详细整合记录

#### 修改文件（5个）
- `src/data/npcs/initialNpcs.ts` - 3个NPC新增6个事件
- `src/data/events/worldEvents.ts` - 新增3个关键事件
- `src/data/memories/memoryScripts.ts` - 4个梦境扩展（dreamScript）
- `src/types/skill.ts` - DreamScene接口
- `CHANGELOG.md` - 版本记录

---

## [v5.3] - 2026-05-07

### 核心变更

取消夜晚和入睡阶段的全屏覆盖，让时间正常流逝，玩家可以继续其他操作。

| 变更 | 旧设计 | 新设计 |
|:---|:---|:---|
| 夜晚（20:00-22:59） | EveningMonologue全屏覆盖 + 时间暂停 | **取消覆盖**，时间正常流逝 |
| 入睡（23:00-05:59） | DreamFragment全屏覆盖 + 时间暂停 | **取消覆盖**，时间正常流逝 |
| T07夜晚睡前触发 | 触发后弹出感知文本和选择 | **永久禁用** |
| 夜晚操作限制 | 无法进行NPC联系/技能/输入等任何操作 | **完全解除**，可自由操作 |

### 文件变更

#### 修改文件
- `src/stores/useDayPhaseStore.ts` - 移除eveningMonologueShown/dreamFragmentShown状态和相关方法
- `src/components/game/CoreGameLoop.tsx` - 移除EveningMonologue/DreamFragment导入和阶段渲染逻辑
- `src/systems/trigger/checkTriggers.ts` - checkT07()永久返回false，清理未使用导入

---

## [v5.2] - 2026-05-07

### 核心变更

新增NPC联系系统，实现玩家建议联系→主角自主决定→方式商量→联系后果的完整流程。

| 变更 | 旧设计 | 新设计 |
|:---|:---|:---|
| NPC分类 | `NpcRole`: FAMILY/SOCIAL/WORK | **四级分类**: 家人/旧识/故交/新识 |
| 联系追踪 | `InteractionRecord`仅事件ID | **完整追踪**: lastContact/contactHistory/normalFrequency |
| 好感度 | `currentCloseness` | **重命名为** `affection` + `affectionThresholds` |
| 主动联系 | 无 | **新增** 玩家建议→主角接受/拒绝→方式商量 |
| 新月 | 仅在记忆/锚点中 | **新增为NPC**，初期不可联系 |

### 新增功能

#### NPC联系追踪系统
- 自动记录每次NPC互动的时间和摘要
- `lastContact`: 上次联系日期/方式/发起方/摘要/关键词
- `contactHistory`: 联系历史记录（最多50条）
- `normalFrequency`: 正常联系频率描述

#### 联系人四级面板
- 第一级：`[♡ 牵挂]` 按钮，常驻右侧面板
- 第二级：分类列表（家人/旧识/故交/新识）
- 第三级：NPC列表，时间颜色标记（7天内正常/7-14天淡黄/14-21天橙/21天+深红）
- 第四级：NPC详情，显示联系记录和"建议主角联系"按钮

#### 联系流程
- 玩家建议联系 → 主角接受概率计算 → 方式协商 → 联系场景 → 结果记录
- 接受概率：基础50% + 连接度/好感度/意志力/深度麻木/微悟等因素叠加（10%-90%）
- 联系类型：电话/发消息/上门/写信
- 联系后果：温暖/平淡/尴尬/冲突/触发隐藏事件/失望

#### 特殊NPC联系机制
- **父亲**: 需连接度≥倾听且意志力≥40才可能接受，拒绝概率极高
- **新月**: 初期不可联系，触发特定回忆后解锁，第一次联系消耗50%当前意志力
- **可可**: 永远接受联系，不受意志力/连接度影响，联系结果永远正向

#### 存档系统扩展
- NPC数据完整序列化/反序列化
- 联系历史、好感度、介绍状态持久化

### 文件变更

#### 新增文件（2个）
- `src/components/game/ContactPanel.tsx` - 联系人四级面板UI
- `src/components/game/ContactFlowOverlay.tsx` - 联系流程覆盖层

#### 修改文件
- `src/types/npc.ts` - 新增NpcCategory/ContactType/ContactRecord等类型，扩展Npc接口
- `src/types/index.ts` - 导出新类型
- `src/data/npcs/initialNpcs.ts` - 4个家庭成员补充联系字段，新增新月/老友/同事小陈/同事小林
- `src/stores/useNpcStore.ts` - 新增suggestContact/recordContact/calculateAcceptanceProbability/negotiateContactType/completeContact等方法
- `src/components/game/CoreGameLoop.tsx` - 集成ContactPanel和ContactFlowOverlay
- `src/stores/useGameStore.ts` - 存档/读档支持NPC数据
- `src/components/game/NpcDialogModal.tsx` - 添加新月角色标签
- `src/systems/dialogue/buildDialogueInput.ts` - 添加新月speaker映射
- `src/components/game/RecentInteractionsPanel.tsx` - 添加新月/老友样式

---

## [v5.1] - 2026-05-06

### 核心变更

基于心学公开课启示，取消龙场悟道作为一次性重大事件，拆解为日常化的"微悟道"循环。

| 变更 | 旧设计 | 新设计 |
|:---|:---|:---|
| 龙场悟道 | 一次性重大事件，三阶段动画 | **取消**，拆解为日常微悟道循环 |
| 扫尘 | 悟道专属阶段 | **升级为常驻技能**，每日1次 |
| 迷走神经时刻 | 无 | **新增**，消耗意志力上限40%强制阻断 |
| 选项系统 | 预设选项 | **新增四类标记**（心印/群则/灰尘/理性）+ 动态比例 |
| 不干预模式 | 无 | **新增**，主角自主选择触发微悟道 |
| 微悟道 | 无 | **新增**，连续3次→认知标签松动 |
| 深度麻木 | 无 | **新增**，意志力上限<5时触发 |
| 尘类型 | 3种（我执/名/情） | **扩展为5种**（+怨/惧） |

### 新增功能

#### 扫尘常驻技能
- 每日可使用1次，无消耗
- 使用期间游戏时间暂停
- 显示当前所有灰尘列表（已触发但未治愈的认知标签）
- 未释怀灰尘（◈）可点击进入回忆，已释怀灰尘（◇）仅展示

#### 灰尘选项标记系统
- 心印驱动选项：淡金色微弱光晕
- 群则驱动选项：淡灰色边框
- 灰尘驱动选项：淡暗红色边缘 + 文字微弱抖动感
- 理性判断选项：无标记，标准样式
- 使用扫尘后灰尘选项高亮显示

#### 选项池动态比例
- Part 1（2025-2026）：灰尘40-50%，心印15-20%，群则25-30%，理性10-15%
- Part 2（2027-2030）：灰尘25-40%，心印20-30%，群则20-25%，理性15-20%
- Part 3（2031-2035）：灰尘10-25%，心印30-40%，群则15-20%，理性20-25%
- 高治愈度终局：灰尘<15%，心印>40%

#### 不干预模式
- 玩家选择"不干预"时主角基于当前属性自主选择
- 主角选择心印方向 → 触发微悟道
- 主角选择灰尘选项 → 显示迷走神经时刻触发窗口

#### 微悟道系统
- 主角自主选择心印方向且与玩家认同一致时触发
- 连接度 +8~15（根据事件重要性浮动）
- 连续3次微悟道 → 认知标签松动
- 终局条件：所有认知治愈 + 心印≥80 → 触发结局三

#### 迷走神经时刻
- 触发条件：危险选择 + 灰尘驱动 + 意志力≤20
- 消耗当前意志力上限的40%
- 强制中断危险行为，强制打开输入框
- 意志力上限<5时进入深度麻木状态

#### 深度麻木状态
- 情感解离，所有选项标记消失
- 连接度暂时无效化
- 主角选择变为纯随机消极应对
- 持续至上限恢复至5以上

#### 连接度影响选项权重
- 陌路（0-19）：玩家推荐选项权重×0.3
- 疏远（20-39）：权重×0.5
- 倾听（40-59）：权重×0.7
- 信任（60-79）：权重×0.9
- 共生（80-100）：权重×1.0

#### 意志力上限新规则
- 迷走神经时刻扣减上限40%
- 连续7天好觉恢复上限1点
- 3次微悟道恢复上限1点
- 移除悟道后直接恢复至100的机制

### 文件变更

#### 新增文件（10个）
- `src/types/option.ts` - 选项类型定义（OptionSource、GameOption、OptionPool）
- `src/systems/options/optionGenerator.ts` - 选项池生成逻辑
- `src/systems/options/optionMarkers.ts` - 选项标记样式规则
- `src/stores/useOptionStore.ts` - 选项状态管理
- `src/systems/microEnlightenment/microEnlightenmentJudge.ts` - 微悟道判定逻辑
- `src/stores/useMicroEnlightenmentStore.ts` - 微悟道状态管理
- `src/systems/autonomousChoice/autonomousChoice.ts` - 不干预模式主角自主选择
- `src/components/game/OptionList.tsx` - 带标记的选项列表UI
- `src/components/game/DustListPanel.tsx` - 灰尘列表UI
- `src/components/game/VagusNerveMoment.tsx` - 迷走神经时刻UI
- `src/components/game/DeepNumbnessOverlay.tsx` - 深度麻木覆盖层
- `src/components/game/MicroEnlightenmentNarrative.tsx` - 微悟道叙事UI

#### 修改文件
- `src/types/cognition.ts` - DustType扩展为5种，增加isRelieved字段
- `src/types/willpower.ts` - 增加deepNumbness、上限扣减/恢复常量
- `src/types/skill.ts` - 增加SweepDustSkill、VagusNerveSkill类型
- `src/types/trust.ts` - 增加CONNECTION_TIER_WEIGHTS、CONNECTION_TIER_XINYIN_PROBABILITY
- `src/stores/useCognitionStore.ts` - 增加relieveCognition、getUnrelievedCognitions方法
- `src/stores/useWillpowerStore.ts` - 增加consumeMaxByVagusNerve、recoverMaxByHabit、deepNumbness
- `src/stores/usePlayerStore.ts` - 增加triggerMicroEnlightenment、getConnectionWeight、sweepDustSkill、vagusNerveSkill
- `src/systems/skills/skillManager.ts` - 增加executeSweepDust、executeVagusNerve
- `src/components/game/SkillButtons.tsx` - 增加扫尘和迷走神经按钮
- `src/stores/useEnlightenmentStore.ts` - 简化为扫尘状态管理
- `src/components/game/enlightenment/EnlightenmentSweeping.tsx` - 重构为日常扫尘UI
- `src/components/game/enlightenment/EnlightenmentFalling.tsx` - 简化为占位组件
- `src/components/game/enlightenment/EnlightenmentAwakening.tsx` - 简化为占位组件
- `src/systems/gameLoop.ts` - 移除龙场悟道触发检查
- `src/components/game/CoreGameLoop.tsx` - 集成新UI组件
- `src/data/cognitions/initialCognitions.ts` - 增加isRelieved、更新dustType
- `src/data/enlightenment/dustLabelMap.ts` - 增加"怨"和"惧"文本变体
- `src/data/enlightenment/innerMonologues.ts` - 移除ENLIGHTENMENT_MONOLOGUE

---

## [v5.0] - 2026-05-06

### 新增功能

#### U01 属性系统术语统一 + 连接度层级可视化
- 连接度层级系统：5个层级（陌路/疏远/倾听/信任/共生），对应阈值 0-19/20-39/40-59/60-79/80-100
- 每个层级有独特颜色和描述
- UI 属性面板顺序调整为：[心印] [群则] [意志力] [连接度]

#### U02 心印相合判定引擎（核心新模块）
- AI 实时分析玩家输入与主角"知"的契合度
- 4种判定等级：high/partial/conflict，对应费用倍率 0/1/1.3/2
- 异步判定 + 3秒超时机制
- 超时降级为关键词匹配
- 连续3次超时暂停相合判定

#### U03 微观事件宏观联动深化
- 4个宏观阶段：旧秩序余晖/碎裂序幕/大解体/新世界分娩
- 年份映射：2025-2026/2027-2029/2030-2032/2033-2035
- 30个微观事件池，按阶段分类
- 属性权重选择机制

#### U04 记忆回溯双版本机制
- 未解决版本 vs 已解决版本
- 触发优先级逻辑：当季未触发 > 任意季未触发 > 当季已触发 > 已解决（温习微光）
- 25个记忆剧本全部更新

#### U05 序章30秒倒计时锁定
- 天台场景重构：8段独白 + 系统提示 + 倒计时 + 文字输入
- 最后10秒文字变红，最后3秒心跳声（Web Audio API）
- 关键词分类：26个坚持关键词 / 11个放弃关键词
- 单选锁定机制

#### U06 悟道尘埃动态生成
- 从认知标签动态生成尘埃文本
- 9个认知标签映射尘埃变体
- 回退机制保证至少5条尘埃

#### U07 UI 属性面板更新
- 连接度显示：数值 + 层级名称（带颜色）+ 进度条
- 0.3秒淡入动画
- 悬停显示层级描述

### Bug 修复
- 修复 TextInput.tsx 未使用的 CONNECTION_TIER_COLORS 导入
- 修复 buildAlignmentInput.ts 未使用的 timeStore 变量
- 修复 alignmentJudge.ts 和 fallbackAlignment.ts 类型比较错误

### 文件变更

#### 新增文件
- `src/types/trust.ts` - ConnectionTier 类型、阈值、颜色、描述
- `src/systems/alignment/alignmentTypes.ts` - 相合判定类型定义
- `src/systems/alignment/buildAlignmentInput.ts` - 判定输入构建器
- `src/systems/alignment/alignmentJudge.ts` - AI 判定逻辑
- `src/systems/alignment/fallbackAlignment.ts` - 降级关键词匹配
- `src/stores/useAlignmentStore.ts` - 相合判定状态管理
- `src/data/events/microEventPool.ts` - 30个微观事件池
- `src/systems/memory/memoryTrigger.ts` - 记忆触发优先级
- `src/systems/memory/getMemoryContent.ts` - 记忆版本选择
- `src/data/enlightenment/dustLabelMap.ts` - 认知标签到尘埃映射

#### 修改文件
- `src/stores/usePlayerStore.ts` - getConnectionTierInfo() 方法
- `src/types/event.ts` - MacroPhase、MicroEventImportance 类型
- `src/stores/useWorldEventStore.ts` - generateMicroEvents() 方法
- `src/systems/gameLoop.ts` - 集成微观事件生成
- `src/types/skill.ts` - Memory 扩展 resolution_state、unresolved_version、resolved_version
- `src/data/memories/memoryScripts.ts` - 25个记忆双版本更新
- `src/components/game/RooftopScene.tsx` - 30秒倒计时重构
- `src/components/game/SceneController.tsx` - 天台场景路由
- `src/stores/useEnlightenmentStore.ts` - 动态尘埃生成
- `src/components/game/enlightenment/EnlightenmentSweeping.tsx` - 尘埃样式区分
- `src/components/game/CoreGameLoop.tsx` - UI 属性面板更新
- `src/components/game/TextInput.tsx` - 相合判定集成
- `src/systems/dialogue/calculateConstraints.ts` - alignmentMultiplier 参数

---
