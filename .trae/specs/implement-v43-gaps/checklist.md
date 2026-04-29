# Checklist

## Phase 1: 连接度系统
- [ ] INITIAL_TRUST_LEVEL 从50改为15
- [ ] usePlayerStore 新增 getConnectionLevel() / isColdResponse() / isHighConnection()
- [ ] 入梦采信率受连接度影响：基础15% + (连接度/100 × 55%)，封顶70%
- [ ] 认知转化解释窗口接受概率受连接度影响
- [ ] 龙场悟道触发条件检查连接度<30降级
- [ ] 连接度≥80时主角偶尔主动求助（"你觉得呢？"）
- [ ] 连接度<20时输入框可用但回应冷淡（不再完全禁用）
- [ ] 冷淡回应叙事模板实现

## Phase 2: 时段驱动差异化交互
- [ ] TimeOfDay 枚举定义（MORNING/DAYTIME/EVENING/SLEEP）
- [ ] useTimeStore 新增 getTimeOfDay() 计算属性
- [ ] 早晨输入仪式 MorningRitual 组件实现并集成
- [ ] 白天观察模式：输入框默认收起，可随时打开
- [ ] WorldEventModal 组件实现，事件触发时弹窗
- [ ] 晚上内心独白生成逻辑 + EveningMonologue 组件
- [ ] 入睡梦境碎片展示 + DreamFragment 组件
- [ ] CoreGameLoop 根据时段渲染不同UI

## Phase 3: 结局判定系统
- [ ] EndingType 枚举定义（ANNIHILATION/DOMESTICATION/TRANSCENDENCE/PREMATURE_DEATH）
- [ ] Habit 类型定义和 useHabitStore 实现
- [ ] 习惯形成和衰减逻辑集成到 gameLoop
- [ ] 群则数值汇总计算（getSocialRuleLevel）
- [ ] endingJudge.ts 四种结局判定逻辑实现
- [ ] EndingScene.tsx 四种结局叙事和视觉实现
- [ ] 早夭结局触发机制（意志力归零后2%/日概率）
- [ ] App.tsx 路由 phase='ending' 到 EndingScene

## Phase 4: 配角系统
- [ ] NPC 类型定义（NPCType/KeyNPCRole/NPC/NPCInteraction）
- [ ] useNPCStore 状态管理实现
- [ ] 4类关键配角数据定义，含 Skill 蒸馏和出场条件
- [ ] 功能配角模板定义
- [ ] NPCInteractionModal 组件实现
- [ ] NPC交互结果影响主角状态

## Phase 5: 世界事件系统
- [ ] 宏观事件数据（约10个）
- [ ] 微观事件数据（约15个）
- [ ] eventEngine.ts 事件触发引擎实现
- [ ] gameLoop 集成事件引擎
- [ ] 事件与回忆联动逻辑
- [ ] 事件与配角引入联动逻辑

## 整体验证
- [ ] TypeScript 编译无错误
- [ ] 游戏循环端到端可运行
- [ ] 各阶段UI流畅切换无卡顿
