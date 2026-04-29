# Tasks

## Phase 1: 类型系统与数据基础

- [x] Task 1: 扩展NPC类型系统
  - [x] 修改 `src/types/npc.ts`：扩展NpcKey为 `'father' | 'mother' | 'sister' | 'niece' | 'colleague_male' | 'colleague_female' | 'old_friend'`
  - [x] 修改 `src/types/npc.ts`：NpcRole增加 `'FAMILY'` 统一角色，增加 `familyRole?: 'father' | 'mother' | 'sister' | 'niece'` 字段
  - [x] 修改 `src/types/npc.ts`：NpcEvent增加 `frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'rare' | 'trigger'` 字段

- [x] Task 2: 扩展事件类型系统
  - [x] 修改 `src/types/event.ts`：EventCondition增加 `year?: number` 和 `seasonInYear?: Season` 字段用于真实年份触发
  - [x] 修改 `src/types/event.ts`：WorldEvent增加 `source?: 'school' | 'work' | 'family' | 'social' | 'society' | 'inner'` 字段
  - [x] 修改 `src/types/event.ts`：WorldEvent增加 `taskType?: 'mandatory' | 'suggested' | 'spontaneous' | 'crisis'` 字段
  - [x] 修改 `src/types/event.ts`：WorldEvent增加 `transmissionChain?: string` 字段描述传导链条

- [x] Task 3: 创建任务类型系统
  - [x] 创建 `src/types/task.ts`：定义TaskType（'world' | 'personal'）、TaskSource、TaskUrgency、Task接口、TaskConflict接口
  - [x] Task接口包含：id, type, source, urgency, title, description, deadline?, effects, isCompleted, conflictWith?

- [x] Task 4: 扩展时间类型支持年份映射
  - [x] 修改 `src/types/time.ts`：增加 `currentYear: number` 字段（初始2025），增加 `getYear()` 函数根据age计算当前年份

## Phase 2: 家庭系统数据

- [x] Task 5: 重写初始NPC数据为家庭系统
  - [x] 重写 `src/data/npcs/initialNpcs.ts`：4名家庭成员替代原4个NPC
  - [x] 父亲（61岁，脑梗后，沉默固执，FAMILY/father）：introductionDay=1，含沉默观察/饭桌叹气/突然问话/脑梗复发事件
  - [x] 母亲（58岁，无业，焦虑外显，FAMILY/mother）：introductionDay=1，含催吃饭/催起床/问冷暖/无意比较/崩溃争吵事件
  - [x] 姐姐（35岁，北大医院主治医，FAMILY/sister）：introductionDay=1，含发招聘/谈心/和父母争吵/透露不快乐（高连接度）事件
  - [x] 可可（4岁，外甥女，FAMILY/niece）：introductionDay=30，含周末来玩/童言无忌事件

## Phase 3: 宏观事件时间线

- [x] Task 6: 创建2025-2035宏观事件数据
  - [x] 重写 `src/data/events/worldEvents.ts`：按4阶段设计宏观事件
  - [x] 第一阶段（2025-2026）：AI替代初级白领、考研人数突破500万、经济深度转型、考公人数新高
  - [x] 第二阶段（2027-2029）：AI进入中端岗位、人口负增长影响、中美科技脱钩、供应链重组
  - [x] 第三阶段（2030-2032）：AI+人协作主流、社保体系改革、台海局势节点、UBI试点讨论
  - [x] 第四阶段（2033-2035）：新生产力范式形成、价值观代际分化
  - [x] 每个事件含传导链条(transmissionChain)描述、选择项和实际StateEffect

- [x] Task 7: 修复世界事件效果
  - [x] 为所有宏观事件的选择项添加实际StateEffect（willpower/cognition/trust/organ变化）
  - [x] 确保选择结果真正影响游戏状态

## Phase 4: 双轨任务系统

- [x] Task 8: 创建任务Store
  - [x] 创建 `src/stores/useTaskStore.ts`
  - [x] 状态：worldTasks, personalTasks, activeConflicts, completedCount
  - [x] 方法：addWorldTask, addPersonalTask, completeTask, postponeTask, rejectTask, detectConflicts, generatePersonalPlan, getCompletionRate

- [x] Task 9: 实现主角个人计划生成逻辑
  - [x] 根据主角心印/群则状态自动生成短期/中期/长期/内在追问计划
  - [x] 初始状态（2025春）：短期空、中期"搞清楚要不要调剂"、长期空、内在追问"活着的意义是什么"
  - [x] 计划随游戏进程动态更新

- [x] Task 10: 实现任务冲突检测
  - [x] 当世界任务与主角个人计划时间冲突时标记
  - [x] 玩家可选择：群则优先/心印优先/第三条路
  - [x] 记录偏向影响结局走向

- [x] Task 11: 创建任务面板UI
  - [x] 创建 `src/components/game/TaskPanel.tsx`
  - [x] 双轨显示：左侧世界任务、右侧主角个人计划
  - [x] 冲突标记和玩家介入选项
  - [x] 完成率统计显示

## Phase 5: 记忆脚本扩展

- [x] Task 12: 新增3条家庭向记忆脚本
  - [x] 修改 `src/data/memories/memoryScripts.ts`：新增剧本24"姐姐的选择"（情类，触发：与姐姐互动后）
  - [x] 新增剧本25"父亲倒下那天"（惧类，触发：父亲脑梗相关事件）
  - [x] 新增剧本26"可可出生"（光类，触发：可可来访后）

## Phase 6: 开场"前因"回忆模式

- [x] Task 13: 实现前因回忆模式
  - [x] 修改 `src/types/save.ts`：GamePhase增加 `'prologue-cause'` 阶段
  - [x] 创建 `src/components/game/CauseModeScene.tsx`：展示主角一生的回忆片段（从记忆脚本中选取关键片段）
  - [x] 终末显示"心印从未消失。你愿意再试一次吗？"选择
  - [x] 选择"再试一次"后回到 `prologue-rooftop`

- [x] Task 14: 修改开场流程支持前因模式
  - [x] 修改 `src/components/game/SceneController.tsx`：玩家沉默/推一把时进入 `prologue-cause` 而非直接 `prologue-gameover`
  - [x] 修改 `src/components/game/UltimateChoice.tsx`：添加沉默超时检测和负面输入检测

## Phase 7: 系统集成

- [x] Task 15: 更新游戏循环集成任务系统
  - [x] 修改 `src/systems/gameLoop.ts`：dailyEvent中生成世界任务
  - [x] 修改 `src/systems/gameLoop.ts`：dailyDecision中检测任务冲突
  - [x] 修改 `src/systems/gameLoop.ts`：weeklyUpdate中更新个人计划
  - [x] 修改 `src/systems/gameLoop.ts`：宏观事件按年份触发

- [x] Task 16: 更新核心游戏循环UI
  - [x] 修改 `src/components/game/CoreGameLoop.tsx`：集成TaskPanel组件
  - [x] 修改 `src/components/game/CoreGameLoop.tsx`：家庭NPC事件在叙事区显示

- [x] Task 17: 更新NPC Store适配家庭系统
  - [x] 修改 `src/stores/useNpcStore.ts`：适配新NpcKey和familyRole
  - [x] 增加家庭成员特有方法：getFamilyMembers, getFamilyEventByFrequency

- [x] Task 18: 更新时间Store支持年份映射
  - [x] 修改 `src/stores/useTimeStore.ts`：增加currentYear状态和getYear方法
  - [x] 修改时间推进逻辑：age变化时同步更新currentYear

## Phase 8: 构建验证

- [x] Task 19: 构建验证与修复
  - [x] 运行 `npm run build` 确保无TypeScript错误
  - [x] 修复所有编译错误
  - [x] 验证游戏可正常启动

# Task Dependencies
- Task 1 → Task 5 (NPC类型扩展后才能写家庭数据)
- Task 2 → Task 6, Task 7 (事件类型扩展后才能写宏观事件)
- Task 3 → Task 8 (任务类型定义后才能写Store)
- Task 4 → Task 15 (时间年份映射后游戏循环才能按年份触发)
- Task 5 → Task 17 (家庭数据写好后更新Store)
- Task 8 → Task 9, Task 10 (Store创建后实现具体逻辑)
- Task 8 → Task 11 (Store创建后写UI)
- Task 13 → Task 14 (前因场景创建后修改流程)
- Task 1-18 → Task 19 (所有实现完成后构建验证)

# Parallelizable Work
- Task 1 + Task 2 + Task 3 + Task 4 (类型系统可并行扩展)
- Task 5 + Task 6 (数据层可并行编写，依赖各自类型)
- Task 12 (记忆脚本独立于其他任务)
- Task 13 (前因模式相对独立)
