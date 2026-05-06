# V5.1 心印回响系统重构 Checklist

## 类型定义
- [x] DustType 扩展为5种（我执/名/情/怨/惧）
- [x] Cognition 类型增加 isRelieved 字段
- [x] willpower.ts 增加 deepNumbness 状态和上限扣减/恢复规则类型
- [x] skill.ts 增加扫尘和迷走神经时刻技能类型
- [x] 新建 option.ts 定义 OptionSource 和 GameOption 类型
- [x] trust.ts 增加连接度对选项权重的影响映射

## 认知系统
- [x] 现有认知数据补充"怨"和"惧"尘类型映射
- [x] relieveCognition(id) 方法实现
- [x] 已释怀认知不再驱动灰尘选项生成
- [x] dustLabelMap.ts 补充新尘类型文本变体

## 意志力系统
- [x] deepNumbness 状态实现
- [x] consumeMaxByVagusNerve() 方法实现（扣减上限40%）
- [x] recoverMaxByHabit() 方法实现（7天好觉或3次微悟道恢复1点）
- [x] 深度麻木判定逻辑（上限<5进入，≥5脱离）
- [x] 移除 restoreMaxAfterEnlightenment() 方法

## 技能系统
- [x] 扫尘技能实现（每日1次冷却，无消耗，暂停游戏时间）
- [x] 迷走神经时刻技能实现（条件判定+上限扣减+强制中断）
- [x] SkillButtons.tsx 增加扫尘和迷走神经时刻按钮
- [x] 技能冷却显示逻辑更新

## 选项生成与标记
- [x] optionGenerator.ts 选项池生成逻辑（4-6个选项，含来源标记）
- [x] 选项池动态比例计算（根据游戏阶段和治愈度）
- [x] optionMarkers.ts 选项标记规则（常态+扫尘后高亮）
- [x] useOptionStore.ts 选项池状态管理

## 微悟道系统
- [x] 微悟道判定逻辑实现
- [x] 微悟道计数和累积效果管理
- [x] 连续3次微悟道→认知标签松动逻辑
- [x] 微悟道叙事文本生成

## 不干预模式
- [x] 主角自主选择逻辑（基于属性加权）
- [x] 连接度对自主选择心印概率的影响
- [x] 不干预→灰尘选择→迷走神经时刻触发窗口

## 悟道系统重构
- [x] 移除龙场悟道触发条件检查逻辑
- [x] EnlightenmentSweeping.tsx 重构为日常扫尘UI
- [x] 移除 EnlightenmentFalling.tsx 和 EnlightenmentAwakening.tsx
- [x] gameLoop.ts 移除悟道条件检查，增加微悟道检查

## 核心 UI 组件
- [x] OptionList.tsx 带标记的选项列表UI
- [x] DustListPanel.tsx 灰尘列表UI（扫尘时显示）
- [x] VagusNerveMoment.tsx 迷走神经时刻UI（暗角+心跳+强制输入）
- [x] DeepNumbnessOverlay.tsx 深度麻木状态覆盖层
- [x] MicroEnlightenmentNarrative.tsx 微悟道叙事反馈UI
- [x] CoreGameLoop.tsx 集成新组件和交互流程

## 连接度系统
- [x] 微悟道→连接度提升逻辑（+8~15）
- [x] 连接度层级→选项权重映射（陌路×0.3 → 共生×1.0）
- [x] 连接度层级提升时触发专属叙事

## 数据文件
- [x] initialCognitions.ts 补充新尘类型
- [x] dustLabelMap.ts 补充新尘类型文本变体
- [x] 移除或改造悟道专属独白

## 编译与构建
- [x] npx tsc -b 零错误
- [x] npx vite build 构建成功
