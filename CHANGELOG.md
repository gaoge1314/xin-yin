
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
