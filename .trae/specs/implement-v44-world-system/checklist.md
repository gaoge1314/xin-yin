# Checklist

## 类型系统
- [x] NpcKey扩展包含father/mother/sister/niece
- [x] NpcRole支持FAMILY角色和familyRole子字段
- [x] NpcEvent增加frequency字段
- [x] EventCondition增加year和seasonInYear字段
- [x] WorldEvent增加source、taskType、transmissionChain字段
- [x] Task类型系统完整定义（TaskType/TaskSource/TaskUrgency/Task/TaskConflict）
- [x] TimeState增加currentYear字段和getYear函数

## 家庭系统数据
- [x] 父亲NPC数据完整（4个事件：沉默观察/饭桌叹气/突然问话/脑梗复发）
- [x] 母亲NPC数据完整（5个事件：催吃饭/催起床/问冷暖/无意比较/崩溃争吵）
- [x] 姐姐NPC数据完整（4个事件：发招聘/谈心/和父母争吵/透露不快乐）
- [x] 可可NPC数据完整（2个事件：周末来玩/童言无忌）
- [x] 姐姐"透露不快乐"事件需连接度≥60触发

## 宏观事件时间线
- [x] 第一阶段（2025-2026）4个宏观事件完整
- [x] 第二阶段（2027-2029）4个宏观事件完整
- [x] 第三阶段（2030-2032）4个宏观事件完整
- [x] 第四阶段（2033-2035）2个宏观事件完整
- [x] 每个宏观事件含传导链条描述
- [x] 每个宏观事件选择项有实际StateEffect（非空数组）

## 双轨任务系统
- [x] useTaskStore创建，含worldTasks/personalPlans/activeConflicts状态
- [x] 世界任务可自动生成和推送
- [x] 主角个人计划按心印/群则状态自动生成
- [x] 任务冲突检测功能正常
- [x] 冲突时玩家可选择群则优先/心印优先/第三条路
- [x] TaskPanel组件双轨显示正常
- [x] 任务完成率统计显示

## 记忆脚本
- [x] 剧本24"姐姐的选择"已添加（情类）
- [x] 剧本25"父亲倒下那天"已添加（惧类）
- [x] 剧本26"可可出生"已添加（光类）

## 开场前因模式
- [x] GamePhase增加prologue-cause阶段
- [x] CauseModeScene组件创建，展示回忆片段
- [x] 终末显示"再试一次"选择
- [x] 玩家沉默/推一把时进入前因模式而非直接Game Over
- [x] UltimateChoice增加沉默超时检测

## 系统集成
- [x] gameLoop.ts按年份触发宏观事件
- [x] gameLoop.ts生成世界任务
- [x] gameLoop.ts检测任务冲突
- [x] gameLoop.ts更新个人计划
- [x] CoreGameLoop.tsx集成TaskPanel
- [x] useNpcStore适配新NpcKey和familyRole
- [x] useTimeStore支持currentYear和getYear

## 构建验证
- [x] npm run build无TypeScript错误
- [x] 游戏可正常启动运行
