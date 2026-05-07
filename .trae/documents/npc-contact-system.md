# NPC联系系统实现计划

> 基于 `最初讨论/5.2.txt` 技术规格文档
> 优先级：P0（NPC追踪数据库 + 联系人四级面板）

---

## 现状分析

### 已有基础设施
| 模块 | 状态 | 说明 |
|:---|:---|:---|
| `src/types/npc.ts` | ✅ 已有 | `Npc`, `NpcKey`, `NpcRole`, `NpcEvent` 等类型，但缺少联系追踪相关字段 |
| `src/stores/useNpcStore.ts` | ✅ 已有 | NPC事件触发、对话、亲密度调整，但无联系追踪/主动联系逻辑 |
| `src/data/npcs/initialNpcs.ts` | ✅ 已有 | 4个家庭成员初始数据，缺少旧识/故交/新识分类 |
| `src/components/game/NpcDialogModal.tsx` | ✅ 已有 | NPC对话弹窗，可复用 |
| `src/components/game/RecentInteractionsPanel.tsx` | ✅ 已有 | 近期交互面板，可复用 |
| `src/types/save.ts` | ❌ 缺失 | NPC数据未包含在存档中 |
| 联系人四级面板 | ❌ 缺失 | 需新建 |
| 主动联系流程 | ❌ 缺失 | 需新建 |
| NPC分类系统 | ❌ 缺失 | 现有`NpcRole`与5.2文档的分类不匹配 |

### 关键差异：现有 vs 5.2文档

| 维度 | 现有代码 | 5.2文档要求 |
|:---|:---|:---|
| NPC分类 | `NpcRole`: FAMILY/SOCIAL/WORK/INNER_CIRCLE/FUNCTIONAL | 家人/旧识/故交/新识（四级分类） |
| NPC标识 | `NpcKey`: 7个固定键 | 需支持动态新增NPC（如新月） |
| 联系追踪 | `InteractionRecord`仅记录事件ID+内容 | 需要`last_contact`(含日期/方式/发起方/摘要/关键词)、`contact_history`、`normal_frequency` |
| 好感度 | `currentCloseness` 0-100 | `affection` 0-100 + `affection_thresholds`(打开心扉/求助) |
| NPC状态 | 无 | `current_status`、`hidden_events` |
| 主动联系 | 无 | 玩家建议→主角接受/拒绝→方式商量→联系场景→后果 |
| 新月 | 仅在记忆/锚点中，非NPC | 需加入旧识分类，初期不可联系 |

---

## 实现步骤

### 步骤1：扩展NPC类型系统

**文件**: `src/types/npc.ts`

1.1 新增NPC联系分类枚举：
```typescript
export type NpcCategory = '家人' | '旧识' | '故交' | '新识';
```

1.2 新增联系类型枚举：
```typescript
export type ContactType = '电话' | '发消息' | '上门' | '写信';
export type ContactInitiator = '主角' | 'NPC' | '系统';
```

1.3 新增联系记录接口：
```typescript
export interface ContactRecord {
  gameDay: number;
  gameDate: string;
  type: ContactType;
  initiator: ContactInitiator;
  summary: string;
  keywords?: string[];
}

export interface NormalFrequency {
  type: string;
  intervalDays: string;
  description: string;
}

export interface AffectionThresholds {
  打开心扉?: number;
  求助?: number;
  [key: string]: number | undefined;
}
```

1.4 扩展`Npc`接口，新增字段：
- `category: NpcCategory` — 联系人分类
- `affection: number` — 好感度（0-100，替代`currentCloseness`）
- `lastContact: ContactRecord | null` — 上次联系
- `contactHistory: ContactRecord[]` — 联系历史
- `normalFrequency: NormalFrequency` — 正常联系频率
- `currentStatus: string` — 当前状态描述
- `hiddenEvents: string[]` — 隐藏事件
- `affectionThresholds: AffectionThresholds` — 好感度阈值
- `isContactable: boolean` — 是否可联系（新月初期为false）
- `contactUnlockCondition?: string` — 解锁联系的条件描述

1.5 保留`currentCloseness`字段做兼容过渡，内部映射到`affection`。

1.6 在`src/types/index.ts`中导出新类型。

---

### 步骤2：扩展NPC初始数据

**文件**: `src/data/npcs/initialNpcs.ts`

2.1 为现有4个家庭成员补充5.2文档要求的新字段：
- `category: '家人'`
- `affection`（使用现有`currentCloseness`值）
- `lastContact: null`（游戏开始时无联系记录）
- `contactHistory: []`
- `normalFrequency`（每个NPC不同：母亲约3-5天、父亲约14-21天、姐姐约14-21天、可可约14-30天）
- `currentStatus`（每个NPC不同）
- `hiddenEvents`（如姐姐的婚姻危机、职业倦怠）
- `affectionThresholds`（如姐姐：打开心扉80、求助90）
- `isContactable: true`

2.2 新增新月NPC数据：
```typescript
{
  id: 'xinyue',
  name: '新月',
  role: 'SOCIAL',
  category: '旧识',
  affection: 0,
  isContactable: false,
  contactUnlockCondition: '触发新月的回忆后解锁',
  // ...
}
```

2.3 新增`NpcKey`中已有但缺数据的3个NPC（`colleague_male`, `colleague_female`, `old_friend`），分配到对应分类。

---

### 步骤3：扩展useNpcStore — 联系追踪系统

**文件**: `src/stores/useNpcStore.ts`

3.1 新增状态字段：
- `contactRequest: ContactRequest | null` — 当前联系请求（玩家建议联系后生成）

3.2 新增接口：
```typescript
export interface ContactRequest {
  npcId: string;
  npcName: string;
  accepted: boolean;
  refusalReason?: string;
  contactType?: ContactType;
  phase: 'pending' | 'accepted' | 'refused' | 'negotiating' | 'in_progress' | 'completed';
}
```

3.3 新增方法：

**`recordContact(npcId, record: ContactRecord)`**
- 将联系记录添加到NPC的`contactHistory`
- 更新NPC的`lastContact`
- 触发`adjustAffection`（如适用）

**`adjustAffection(npcId, delta)`**
- 调整NPC好感度（0-100范围）
- 替代现有的`adjustCloseness`（保留兼容）

**`suggestContact(npcId)`**
- 玩家建议联系NPC
- 调用`calculateAcceptanceProbability(npcId)`计算接受概率
- 根据概率决定接受/拒绝
- 生成`ContactRequest`并设置到`contactRequest`
- 如果拒绝，根据连接度生成拒绝回应

**`calculateAcceptanceProbability(npcId)`**
- 基础概率50%
- 叠加因素：连接度≥倾听+30%、好感度≥70+25%、意志力≥50+20%、意志力≤15-40%、自我保护模式-60%、上次联系>21天+15%、微悟道连续中+20%
- 特殊NPC覆盖：父亲需连接度≥倾听且意志力≥40、可可永远接受、新月初期不可联系
- 返回10%-90%范围

**`negotiateContactType(npcId, playerSuggestion: string)`**
- 根据主角当前状态生成对联系方式的偏好
- 返回主角回应（同意/提出其他方式/犹豫）

**`completeContact(request, result)`**
- 联系完成，记录结果
- 根据后果类型调整好感度/连接度/意志力

**`getNpcsByCategory(category)`**
- 按分类获取NPC列表

**`getDaysSinceLastContact(npcId)`**
- 计算距上次联系的天数

3.4 修改现有方法：
- `dismissActiveDialog` — 在记录交互时同步更新`contactHistory`和`lastContact`
- `triggerEventAsDialog` — 同上
- `reset` — 重置新增的状态字段

---

### 步骤4：创建联系人四级面板UI

**新建文件**: `src/components/game/ContactPanel.tsx`

4.1 第一级：牵挂按钮
- 在CoreGameLoop右侧面板（世界面板）中，在RecentInteractionsPanel上方添加
- 显示为 `[♡ 牵挂]` 按钮
- 点击展开/收起联系人面板
- 使用`useState`管理面板展开状态

4.2 第二级：分类列表
- 显示4个分类：家人(N)、旧识(N)、故交(N)、新识(N)
- 每个分类显示NPC数量
- 点击分类展开第三级
- 新识分类在游戏中期前显示为灰色/锁定

4.3 第三级：NPC列表
- 显示该分类下所有已介绍的NPC
- 每个NPC显示：名称 · 距今天数 · 上次联系摘要
- 时间标记颜色规则：
  - 7天内：`text-white/50`（正常）
  - 7-14天：`text-yellow-300/60`（淡黄）
  - 14-21天：`text-orange-400/70`（橙色）
  - 21天以上：`text-red-400/80`（深红）
- 不可联系的NPC（如新月）显示为灰色+锁定图标

4.4 第四级：NPC详情
- 显示NPC名称、上次联系日期、距今天数、联系方式
- 显示上次联系摘要
- 显示联系历史（最近记录）
- `[建议主角联系她]` 按钮
- `[返回]` 按钮

4.5 面板导航使用`useState<'categories' | 'npc-list' | 'npc-detail'>`管理层级，配合动画过渡。

---

### 步骤5：创建联系流程UI

**新建文件**: `src/components/game/ContactFlowOverlay.tsx`

5.1 联系请求覆盖层：
- 当`contactRequest`不为null时显示
- 接受状态：显示输入框 + "你想怎么联系？"提示
- 拒绝状态：显示主角的拒绝回应 + 确认按钮
- 协商状态：显示主角对联系方式的偏好回应

5.2 联系场景（微型场景）：
- 电话场景：拨号等待→NPC回应→3-5轮对话→结束
- 发消息场景：消息界面→主角打字→等待回复
- 上门场景：场景加载→面对面对话

5.3 P0阶段实现策略：
- 联系场景使用现有的对话系统（`NpcDialogModal`模式）
- 电话/消息/上门的差异通过文案和UI细节体现
- 完整的微型场景（拨号音效、消息气泡等）留到P2

---

### 步骤6：集成到CoreGameLoop

**文件**: `src/components/game/CoreGameLoop.tsx`

6.1 在右侧面板中添加ContactPanel：
```tsx
<CollapsiblePanel title="世界" side="right" defaultOpen={true}>
  <div className="flex flex-col gap-4">
    <ContactPanel />          {/* 新增 */}
    <WorldInfoPanel />
    <div className="border-t border-white/5 pt-3">
      <RecentInteractionsPanel />
    </div>
    {/* ... */}
  </div>
</CollapsiblePanel>
```

6.2 添加ContactFlowOverlay渲染：
- 当`contactRequest`存在时暂停时间
- 在`renderPhaseOverlay`中添加联系流程覆盖层

6.3 在`useNpcStore`的`dismissActiveDialog`中自动更新联系记录。

---

### 步骤7：联系追踪自动更新

**文件**: `src/stores/useNpcStore.ts` + `src/systems/gameLoop.ts`

7.1 在以下时机自动调用`recordContact`：
- NPC事件触发后（`triggerEventAsDialog`中已有交互记录，扩展为完整联系记录）
- 主角主动联系完成后（`completeContact`中）
- NPC主动联系后（`triggerEventAsDialog`中检测initiator）

7.2 在gameLoop的每日检查中：
- 检查NPC主动联系（基于`normalFrequency`和随机概率）
- 如果超过正常频率间隔，NPC可能主动联系主角

---

### 步骤8：扩展存档系统

**文件**: `src/types/save.ts` + `src/stores/useGameStore.ts`

8.1 在`SaveData.state`中添加：
```typescript
npcs: Npc[];
contactRequest: ContactRequest | null;
```

8.2 在`saveGame()`中序列化NPC数据。

8.3 在`loadGame()`中恢复NPC数据到`useNpcStore`。

---

### 步骤9：特殊NPC联系机制

**文件**: `src/stores/useNpcStore.ts` — `suggestContact`方法中

9.1 父亲特殊规则：
- 需要连接度≥"倾听"（40+）且意志力≥40才可能接受
- 联系内容通常极短
- 拒绝概率极高

9.2 新月特殊规则：
- `isContactable: false`，初期不可联系
- 触发特定回忆后设置`isContactable: true`
- 第一次联系消耗50%当前意志力

9.3 可可特殊规则：
- 永远接受联系建议
- 不受意志力/连接度影响
- 联系结果永远正向

---

### 步骤10：验证与测试

10.1 TypeScript编译检查：`npx tsc --noEmit`
10.2 启动开发服务器验证UI渲染
10.3 测试四级面板导航流程
10.4 测试联系建议→接受/拒绝流程
10.5 测试特殊NPC（父亲/新月/可可）规则
10.6 测试存档/读档NPC数据持久化

---

## 文件变更清单

| 操作 | 文件路径 | 说明 |
|:---|:---|:---|
| 修改 | `src/types/npc.ts` | 新增NpcCategory/ContactType等类型，扩展Npc接口 |
| 修改 | `src/types/index.ts` | 导出新类型 |
| 修改 | `src/data/npcs/initialNpcs.ts` | 补充新字段，新增新月等NPC |
| 修改 | `src/stores/useNpcStore.ts` | 新增联系追踪/主动联系方法 |
| 修改 | `src/components/game/CoreGameLoop.tsx` | 集成ContactPanel和ContactFlowOverlay |
| 修改 | `src/types/save.ts` | NPC数据纳入存档 |
| 修改 | `src/stores/useGameStore.ts` | 存档/读档支持NPC数据 |
| 修改 | `src/systems/gameLoop.ts` | NPC主动联系检查 |
| 新建 | `src/components/game/ContactPanel.tsx` | 联系人四级面板 |
| 新建 | `src/components/game/ContactFlowOverlay.tsx` | 联系流程覆盖层 |

---

## P0范围说明

根据5.2文档开发优先级，本次实现P0：
- ✅ NPC追踪数据库（数据结构+自动更新+UI框架）
- ✅ 联系人四级面板（分类/NPC列表/详情/建议联系按钮）
- ✅ 基础联系流程（建议→接受/拒绝→方式商量→联系场景简化版）

P2留待后续：
- ⏳ NPC联系后果多样性（温暖/尴尬/冲突/隐藏事件的全分支）
- ⏳ 完整微型场景（拨号音效、消息气泡、场景加载）
- ⏳ NPC主动联系（基于频率的随机触发）
