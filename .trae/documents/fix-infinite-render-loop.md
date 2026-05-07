# 修复游戏无法运行 - React 19 无限重渲染循环

## 问题诊断

游戏启动后进入核心循环时崩溃，错误信息：
```
Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
The result of getSnapshot should be cached to avoid an infinite loop
```

**根因**：React 19 + Zustand 5 的 `useSyncExternalStore` 要求 selector 返回稳定引用。当 selector 返回新对象/调用方法时，`Object.is` 比较永远失败，触发无限重渲染。

## 修复步骤

### 第1步：修复 CoreGameLoop.tsx 中的3个致命问题（阻塞级）

**1a. 修复 selector 返回新对象（第101-110行）**
- 改前：`usePlayerStore((s) => ({ tier, color, description, level }))` — 每次返回新对象
- 改后：拆分为 `trustLevel` 原始值选择 + `useMemo` 计算 tierInfo

**1b. 修复 selector 内调用方法（第94行）**
- 改前：`useTimeStore((s) => s.getTimeOfDay())` — 方法调用不稳定
- 改后：选择 `hour` 原始值 + 用纯函数 `getTimeOfDay(hour)` 计算

**1c. 修复 getState() 在渲染路径中使用（第95-97行）**
- 改前：`useWorldEventStore((s) => s.activeEventId) ? useWorldEventStore.getState().getActiveEvent() : null`
- 改后：选择 `activeEventId`，用 `useMemo` 计算活跃事件

### 第2步：修复 DustListPanel.tsx 无 selector 订阅（高风险）

- 改前：`const { exitSweepDust, selectDustCognition } = useEnlightenmentStore()`
- 改后：拆分为独立属性选择器

### 第3步：修复 EnlightenmentSweeping.tsx 无 selector 订阅（高风险）

- 改前：`useEnlightenmentStore()` 和 `useCognitionStore()`
- 改后：拆分为独立属性选择器

### 第4步：修复 WorldInfoPanel.tsx 中 getState() 使用（中风险）

- 改前：渲染路径中使用 `useWorldEventStore.getState().isConditionMet(event)`
- 改后：选择 `isConditionMet` 方法引用

### 第5步：修复 WorldInfoPanel.tsx 无 selector 订阅（中风险）

- 改前：`useTimeStore()` 无 selector
- 改后：拆分为独立属性选择器

### 第6步：修复 OrganStatusPanel.tsx 无 selector 订阅（中风险）

- 改前：`useOrganStore()` 无 selector
- 改后：拆分为独立属性选择器

### 第7步：修复 Debug 面板中的无 selector 订阅（低风险）

- WillpowerSection、TimeSection、PlayerSection、PersonalitySection、OrganSection、CognitionSection、AnchorSection、SocialRuleSection
- 这些在 Debug 面板中，影响较小，但仍然需要修复

### 第8步：验证游戏可正常运行

- 启动开发服务器
- 测试主菜单 → 序章 → 核心循环流程
- 确认无无限循环错误
