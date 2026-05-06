# Tasks

- [x] Task 1: 重构类型定义 — 扩展认知/意志力/技能/选项类型
  - [x] SubTask 1.1: 扩展 `DustType` 从3种到5种（增加"怨"和"惧"），在 `cognition.ts` 中修改
  - [x] SubTask 1.2: 在 `Cognition` 类型中增加 `isRelieved` 字段
  - [x] SubTask 1.3: 在 `willpower.ts` 中增加 `deepNumbness` 状态标记和上限扣减/恢复规则类型
  - [x] SubTask 1.4: 在 `skill.ts` 中增加扫尘技能和迷走神经时刻技能的类型定义
  - [x] SubTask 1.5: 新建 `option.ts` 类型文件，定义 `OptionSource`（心印/群则/灰尘/理性）和 `GameOption` 类型
  - [x] SubTask 1.6: 在 `trust.ts` 中增加连接度对选项权重的影响映射类型

- [x] Task 2: 重构认知 Store — 扩展尘类型和释怀机制
  - [x] SubTask 2.1: 更新 `useCognitionStore.ts`，初始化数据中为现有认知补充"怨"和"惧"尘类型映射
  - [x] SubTask 2.2: 增加 `relieveCognition(id)` 方法，标记认知为已释怀
  - [x] SubTask 2.3: 修改认知转化逻辑，已释怀的认知不再驱动灰尘选项生成
  - [x] SubTask 2.4: 更新 `dustLabelMap.ts`，为新增尘类型补充文本变体

- [x] Task 3: 重构意志力 Store — 增加上限扣减与深度麻木
  - [x] SubTask 3.1: 在 `useWillpowerStore.ts` 中增加 `deepNumbness` 状态
  - [x] SubTask 3.2: 增加 `consumeMaxByVagusNerve()` 方法，扣减当前上限40%
  - [x] SubTask 3.3: 增加 `recoverMaxByHabit()` 方法，连续7天好觉或3次微悟道恢复1点上限
  - [x] SubTask 3.4: 增加深层麻木状态判定逻辑（上限<5时进入，≥5时脱离）
  - [x] SubTask 3.5: 移除 `restoreMaxAfterEnlightenment()` 方法（悟道直接恢复）

- [x] Task 4: 重构技能系统 — 新增扫尘和迷走神经时刻
  - [x] SubTask 4.1: 在 `skillManager.ts` 中增加扫尘技能实现（每日1次冷却，无消耗，暂停游戏时间）
  - [x] SubTask 4.2: 在 `skillManager.ts` 中增加迷走神经时刻技能实现（条件判定+上限扣减+强制中断）
  - [x] SubTask 4.3: 更新 `SkillButtons.tsx`，增加扫尘和迷走神经时刻按钮
  - [x] SubTask 4.4: 更新技能冷却显示逻辑

- [x] Task 5: 新建选项生成与标记系统
  - [x] SubTask 5.1: 新建 `src/systems/options/optionGenerator.ts`，实现选项池生成逻辑（4-6个选项，含来源标记）
  - [x] SubTask 5.2: 实现选项池动态比例计算（根据游戏阶段、治愈度、心印/群则、连接度）
  - [x] SubTask 5.3: 新建 `src/systems/options/optionMarkers.ts`，实现选项标记规则（常态+扫尘后高亮）
  - [x] SubTask 5.4: 新建 `src/stores/useOptionStore.ts`，管理当前事件选项池状态

- [x] Task 6: 新建微悟道系统
  - [x] SubTask 6.1: 新建 `src/systems/microEnlightenment/microEnlightenmentJudge.ts`，实现微悟道判定逻辑
  - [x] SubTask 6.2: 新建 `src/stores/useMicroEnlightenmentStore.ts`，管理微悟道计数和累积效果
  - [x] SubTask 6.3: 实现连续3次微悟道→认知标签松动逻辑
  - [x] SubTask 6.4: 实现微悟道叙事文本生成

- [x] Task 7: 新建不干预模式
  - [x] SubTask 7.1: 新建 `src/systems/autonomousChoice/autonomousChoice.ts`，实现主角自主选择逻辑（基于属性加权）
  - [x] SubTask 7.2: 实现连接度对自主选择心印概率的影响
  - [x] SubTask 7.3: 实现不干预→灰尘选择→迷走神经时刻触发窗口

- [x] Task 8: 重构悟道系统 — 移除龙场悟道，适配微悟道
  - [x] SubTask 8.1: 移除 `useEnlightenmentStore.ts` 中的悟道触发条件检查逻辑
  - [x] SubTask 8.2: 重构 `EnlightenmentSweeping.tsx` 为日常扫尘UI组件
  - [x] SubTask 8.3: 移除 `EnlightenmentFalling.tsx` 和 `EnlightenmentAwakening.tsx`（或保留为历史参考）
  - [x] SubTask 8.4: 更新 `gameLoop.ts`，移除悟道条件检查，增加微悟道检查

- [x] Task 9: 重构核心游戏循环 UI — 集成选项标记、不干预、微悟道
  - [x] SubTask 9.1: 新建 `src/components/game/OptionList.tsx`，实现带标记的选项列表UI
  - [x] SubTask 9.2: 新建 `src/components/game/DustListPanel.tsx`，实现灰尘列表UI（扫尘时显示）
  - [x] SubTask 9.3: 新建 `src/components/game/VagusNerveMoment.tsx`，实现迷走神经时刻UI（暗角+心跳+强制输入）
  - [x] SubTask 9.4: 新建 `src/components/game/DeepNumbnessOverlay.tsx`，实现深度麻木状态UI覆盖层
  - [x] SubTask 9.5: 新建 `src/components/game/MicroEnlightenmentNarrative.tsx`，实现微悟道叙事反馈UI
  - [x] SubTask 9.6: 更新 `CoreGameLoop.tsx`，集成新组件和交互流程

- [x] Task 10: 更新连接度系统 — 选项权重影响和微悟道反向提升
  - [x] SubTask 10.1: 在 `usePlayerStore.ts` 中增加微悟道→连接度提升逻辑（+8~15）
  - [x] SubTask 10.2: 实现连接度层级→选项权重映射（陌路×0.3 → 共生×1.0）
  - [x] SubTask 10.3: 连接度层级提升时触发专属叙事

- [x] Task 11: 更新数据文件 — 适配新系统
  - [x] SubTask 11.1: 更新 `initialCognitions.ts`，为现有认知补充"怨"和"惧"尘类型
  - [x] SubTask 11.2: 更新 `dustLabelMap.ts`，补充新尘类型的文本变体
  - [x] SubTask 11.3: 移除或改造 `innerMonologues.ts` 中的悟道专属独白

- [x] Task 12: TypeScript 编译验证和构建测试
  - [x] SubTask 12.1: 运行 `npx tsc -b` 确保零错误
  - [x] SubTask 12.2: 运行 `npx vite build` 确保构建成功

# Task Dependencies

- [Task 1] 是所有后续任务的基础，必须最先完成
- [Task 2] 依赖 [Task 1] 的类型定义
- [Task 3] 依赖 [Task 1] 的类型定义
- [Task 4] 依赖 [Task 1] 和 [Task 3]
- [Task 5] 依赖 [Task 1] 和 [Task 2]
- [Task 6] 依赖 [Task 1] 和 [Task 10]
- [Task 7] 依赖 [Task 5] 和 [Task 10]
- [Task 8] 依赖 [Task 4] 和 [Task 6]
- [Task 9] 依赖 [Task 4, 5, 6, 7, 8]
- [Task 10] 依赖 [Task 1]
- [Task 11] 依赖 [Task 1, 2]
- [Task 12] 依赖所有任务完成

可并行的任务组：
- [Task 2, Task 3, Task 10, Task 11] 可在 Task 1 完成后并行
- [Task 5, Task 6, Task 7] 可在各自依赖完成后并行
