import { useState } from 'react';
import { useTaskStore } from '../../stores/useTaskStore';
import type { TaskUrgency, PersonalPlanTerm } from '../../types/task';

const URGENCY_STYLES: Record<TaskUrgency, string> = {
  mandatory: 'bg-red-900/50 text-red-400',
  suggested: 'bg-yellow-900/50 text-yellow-400',
  spontaneous: 'bg-green-900/50 text-green-400',
  crisis: 'bg-purple-900/50 text-purple-400',
};

const URGENCY_LABELS: Record<TaskUrgency, string> = {
  mandatory: '必须',
  suggested: '建议',
  spontaneous: '自发',
  crisis: '危机',
};

const SOURCE_LABELS: Record<string, string> = {
  school: '学校',
  work: '工作',
  family: '家庭',
  social: '社交',
  society: '社会',
  inner: '内心',
};

const PLAN_TERM_LABELS: Record<PersonalPlanTerm, string> = {
  short: '短期',
  medium: '中期',
  long: '长期',
  eternal: '内在追问',
};

const PLAN_TERM_ORDER: PersonalPlanTerm[] = ['short', 'medium', 'long', 'eternal'];

export const TaskPanel: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const worldTasks = useTaskStore((s) => s.worldTasks);
  const personalPlans = useTaskStore((s) => s.personalPlans);
  const activeConflicts = useTaskStore((s) => s.activeConflicts);
  const completeTask = useTaskStore((s) => s.completeTask);
  const postponeTask = useTaskStore((s) => s.postponeTask);
  const rejectTask = useTaskStore((s) => s.rejectTask);
  const resolveConflict = useTaskStore((s) => s.resolveConflict);
  const getWorldCompletionRate = useTaskStore((s) => s.getWorldCompletionRate);
  const getPersonalCompletionRate = useTaskStore((s) => s.getPersonalCompletionRate);

  const activeTasks = worldTasks.filter((t) => !t.isCompleted);
  const completedTasks = worldTasks.filter((t) => t.isCompleted);
  const worldRate = getWorldCompletionRate();
  const personalRate = getPersonalCompletionRate();

  const unresolvedConflicts = activeConflicts.filter((c) => !c.resolution);

  return (
    <div className="bg-[#0a0a0f] border border-white/[0.06] rounded-lg overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs tracking-wider">双轨任务</span>
          <span className="text-white/20 text-[10px]">
            外{Math.round(worldRate * 100)}% / 内{Math.round(personalRate * 100)}%
          </span>
        </div>
        <span className="text-white/30 text-xs">{collapsed ? '▸' : '▾'}</span>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 max-h-80 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-white/40 text-[10px] tracking-wider mb-1.5 border-b border-white/[0.06] pb-1">
                世界任务
              </div>
              <div className="space-y-1.5">
                {activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className="px-2 py-1.5 rounded border border-white/[0.06] bg-white/[0.01]"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span
                        className={`text-[9px] px-1 py-0.5 rounded ${URGENCY_STYLES[task.urgency]}`}
                      >
                        {URGENCY_LABELS[task.urgency]}
                      </span>
                      <span className="text-white/20 text-[9px]">
                        {SOURCE_LABELS[task.source] || task.source}
                      </span>
                    </div>
                    <p className="text-white/50 text-[11px] leading-tight mb-1.5">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => completeTask(task.id)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-green-900/30 text-green-400/70 hover:bg-green-900/50 transition-colors"
                      >
                        ✓ 完成
                      </button>
                      <button
                        onClick={() => postponeTask(task.id)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400/70 hover:bg-yellow-900/50 transition-colors"
                      >
                        ⏳ 推迟
                      </button>
                      <button
                        onClick={() => rejectTask(task.id)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400/70 hover:bg-red-900/50 transition-colors"
                      >
                        ✗ 拒绝
                      </button>
                    </div>
                  </div>
                ))}
                {completedTasks.length > 0 && (
                  <div className="border-t border-white/[0.04] pt-1.5 mt-1.5">
                    {completedTasks.map((task) => (
                      <p
                        key={task.id}
                        className="text-white/20 text-[10px] line-through truncate"
                      >
                        {task.title}
                      </p>
                    ))}
                  </div>
                )}
                {activeTasks.length === 0 && completedTasks.length === 0 && (
                  <p className="text-white/15 text-[10px] text-center py-2">暂无任务</p>
                )}
              </div>
            </div>

            <div>
              <div className="text-white/40 text-[10px] tracking-wider mb-1.5 border-b border-white/[0.06] pb-1">
                个人计划
              </div>
              <div className="space-y-1.5">
                {PLAN_TERM_ORDER.map((term) => {
                  const plan = personalPlans.find((p) => p.term === term);
                  return (
                    <div
                      key={term}
                      className="px-2 py-1.5 rounded border border-white/[0.06] bg-white/[0.01]"
                    >
                      <span className="text-white/30 text-[9px] tracking-wider">
                        {PLAN_TERM_LABELS[term]}
                      </span>
                      <p className="text-white/50 text-[11px] mt-0.5 leading-tight">
                        {plan?.content || '……'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {unresolvedConflicts.length > 0 && (
            <div className="mt-3 border-t border-white/[0.06] pt-2">
              <div className="text-white/40 text-[10px] tracking-wider mb-1.5">
                冲突
              </div>
              <div className="space-y-1.5">
                {unresolvedConflicts.map((conflict, idx) => {
                  const task = worldTasks.find((t) => t.id === conflict.worldTaskId);
                  return (
                    <div
                      key={`${conflict.worldTaskId}-${conflict.personalPlanTerm}-${idx}`}
                      className="px-2 py-1.5 rounded border border-purple-900/30 bg-purple-900/[0.05]"
                    >
                      <p className="text-white/40 text-[10px] mb-1">
                        <span className="text-purple-400/60">{task?.title || '任务'}</span>
                        {' ↔ '}
                        <span className="text-purple-400/60">
                          {PLAN_TERM_LABELS[conflict.personalPlanTerm]}：{conflict.personalPlanContent}
                        </span>
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => resolveConflict(conflict, 'social_first')}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400/70 hover:bg-yellow-900/50 transition-colors"
                        >
                          群则优先
                        </button>
                        <button
                          onClick={() => resolveConflict(conflict, 'xinyin_first')}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-400/70 hover:bg-blue-900/50 transition-colors"
                        >
                          心印优先
                        </button>
                        <button
                          onClick={() => resolveConflict(conflict, 'third_way')}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-400/70 hover:bg-purple-900/50 transition-colors"
                        >
                          第三条路
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
