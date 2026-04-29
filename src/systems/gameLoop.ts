import { useTimeStore } from '../stores/useTimeStore';
import { useWillpowerStore } from '../stores/useWillpowerStore';
import { useCognitionStore } from '../stores/useCognitionStore';
import { useOrganStore } from '../stores/useOrganStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useSceneStore } from '../stores/useSceneStore';
import { useGameStore } from '../stores/useGameStore';
import { useEnlightenmentStore } from '../stores/useEnlightenmentStore';
import { usePersonalityStore } from '../stores/usePersonalityStore';
import { useSocialRuleStore } from '../stores/useSocialRuleStore';
import { useAnchorStore } from '../stores/useAnchorStore';
import { useHabitStore } from '../stores/useHabitStore';
import { useNpcStore } from '../stores/useNpcStore';
import { useWorldEventStore } from '../stores/useWorldEventStore';
import { useTaskStore } from '../stores/useTaskStore';
import type { Action, Outcome, ActionRecord, PlayerInfluence } from '../types/action';
import type { CognitionId } from '../types/cognition';
import type { OrganHealth } from '../types/organs';
import type { Personality } from '../types/personality';
import { INITIAL_ACTIONS } from '../data/actions/initialActions';
import { ORGAN_CRITICAL_THRESHOLD } from '../types/organs';
import type { Season } from '../types/time';
import { INITIAL_EMOTION_TRIGGERS } from '../data/triggers/initialTriggers';
import { checkPrematureDeath } from './ending/endingJudge';

interface ActionHistoryEntry {
  actionId: string;
  timestamp: number;
  count: number;
}

class GameLoopManager {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private tickRate = 1000;
  private totalHours = 0;
  private actionHistory: ActionHistoryEntry[] = [];

  start() {
    if (this.intervalId) return;
    this.totalHours = useTimeStore.getState().totalDays * 24 + useTimeStore.getState().hour;

    this.intervalId = setInterval(() => {
      this.tick();
    }, this.tickRate);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick() {
    const timeState = useTimeStore.getState();
    const sceneState = useSceneStore.getState();

    if (sceneState.phase !== 'core-loop') return;
    if (timeState.isPaused) return;

    const prevSeason = timeState.season;
    timeState.advanceTime();
    this.totalHours++;

    const newState = useTimeStore.getState();

    if (newState.season !== prevSeason) {
      this.onSeasonChange(prevSeason, newState.season);
    }

    if (this.totalHours % 24 === 0) {
      this.dailyEvent();
    }

    if (this.totalHours % 168 === 0) {
      this.weeklyUpdate();
    }

    if (this.totalHours % 72 === 0) {
      this.dailyDecision();
    }

    if (this.totalHours % 720 === 0) {
      this.tickSkillCooldowns();
    }

    if (this.totalHours % 2160 === 0) {
      this.autoSave();
    }

    if (newState.age > 35) {
      this.triggerEnding();
    }
  }

  private onSeasonChange(_from: Season, to: Season) {
    const seasonNames: Record<Season, string> = {
      spring: '春', summer: '夏', autumn: '秋', winter: '冬',
    };

    useSceneStore.getState().addNarrativeLog(
      `—— ${seasonNames[to]}天来了 ——`
    );

    if (to === 'winter') {
      useWillpowerStore.getState().consume(5);
      useSceneStore.getState().addNarrativeLog(
        '冬天的寒意渗透进来，一切变得更难了。'
      );
    }

    if (to === 'spring') {
      useWillpowerStore.getState().recover(10);
      useSceneStore.getState().addNarrativeLog(
        '春天的气息带来一丝希望。'
      );
    }

    this.triggerSeasonalMemory(to);
  }

  private triggerSeasonalMemory(season: Season) {
    const memories = useGameStore.getState().memories;
    const seasonMemories = memories.filter((m) => m.season === season);

    if (seasonMemories.length > 0) {
      const weighted = seasonMemories.map((m) => ({
        memory: m,
        weight: m.isCore ? 2 : 1,
      }));
      const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
      let random = Math.random() * totalWeight;
      let selected = weighted[0].memory;
      for (const { memory, weight } of weighted) {
        random -= weight;
        if (random <= 0) {
          selected = memory;
          break;
        }
      }

      const categoryLabels: Record<string, string> = {
        name: '名', emotion: '情', resentment: '怨',
        fear: '惧', obsession: '我执', beauty: '光', special: '悟',
      };
      const label = categoryLabels[selected.category] || '';
      useSceneStore.getState().addNarrativeLog(
        `【${label}】${selected.title}`
      );
      useSceneStore.getState().addNarrativeLog(selected.content);
      useSceneStore.getState().addNarrativeLog(
        `——"${selected.innerVoice}"`
      );
    }
  }

  private dailyEvent() {
    if (checkPrematureDeath()) {
      useSceneStore.getState().setPhase('ending');
      this.stop();
      return;
    }

    useNpcStore.getState().checkIntroductions();
    const npcEvents = useNpcStore.getState().checkEvents();
    npcEvents.forEach((event) => {
      useNpcStore.getState().triggerEvent(event);
    });

    const worldEvents = useWorldEventStore.getState().checkEvents();
    if (worldEvents.length > 0) {
      const event = worldEvents[0];
      useSceneStore.getState().addNarrativeLog(event.content);
      if (event.choices && event.choices.length > 0) {
        useWorldEventStore.setState({ activeEventId: event.id });
      } else {
        useWorldEventStore.getState().observeEvent(event.id);
      }
    }

    useTaskStore.getState().generatePersonalPlan();

    const dailyFamilyEvents = useNpcStore.getState().getFamilyEventByFrequency('daily');
    dailyFamilyEvents.forEach((event) => {
      useNpcStore.getState().triggerEvent(event);
    });

    this.checkFamilyEvents();

    const enlightenmentState = useEnlightenmentStore.getState();
    if (
      !enlightenmentState.hasTriggeredEnlightenment &&
      enlightenmentState.checkTriggerConditions()
    ) {
      useEnlightenmentStore.getState().startEnlightenment();
      this.stop();
      useSceneStore.getState().setPhase('enlightenment-falling');
      useSceneStore.getState().addNarrativeLog('那天夜里，他突然无法入睡。');
      return;
    }

    const willpowerState = useWillpowerStore.getState();
    const organState = useOrganStore.getState();
    const gameState = useGameStore.getState();

    const isOverworked = willpowerState.current < 30;
    const isUnwell = (['heart', 'liver', 'spleen', 'lungs', 'stomach'] as const).some(
      (organ) => organState[organ] < 30
    );
    const usedDreamSkill = gameState.dreamCooldown > 0;
    const hasUnhealedPainful = gameState.memories.some(
      (m) => m.type === 'painful' && !m.isHealed
    );
    const hasNightmare = hasUnhealedPainful && Math.random() < 0.2;

    const isGoodSleep = !isOverworked && !isUnwell && !usedDreamSkill && !hasNightmare;

    if (isGoodSleep) {
      useWillpowerStore.getState().recordGoodSleep();
      useSceneStore.getState().addNarrativeLog('你睡得很好，身体和心灵都得到了安宁。');
    } else {
      useWillpowerStore.getState().recordBadSleep();
      useSceneStore.getState().addNarrativeLog('你睡得很不安稳，辗转反侧。');
    }

    usePlayerStore.getState().naturalTrustRecovery();
  }

  private dailyDecision() {
    const willpowerState = useWillpowerStore.getState();
    const organState = useOrganStore.getState();
    const playerState = usePlayerStore.getState();
    const cognitionState = useCognitionStore.getState();
    const personalityState = usePersonalityStore.getState();
    const socialRuleState = useSocialRuleStore.getState();

    const availableActions = this.filterAvailableActions(
      INITIAL_ACTIONS,
      organState
    );

    if (availableActions.length === 0) return;

    const selectedAction = this.selectAction(
      availableActions,
      willpowerState,
      cognitionState.cognitions,
      playerState.getRecentInfluences(),
      organState,
      personalityState,
      socialRuleState.getActiveRules()
    );

    if (!selectedAction) return;

    const playerInfluences = playerState.getRecentInfluences();
    const wasPlayerInfluenced = this.checkPlayerInfluence(selectedAction, playerInfluences);

    if (wasPlayerInfluenced) {
      const influenceCost = this.calculateInfluenceCost(
        selectedAction,
        playerInfluences,
        personalityState
      );
      const canAfford = useWillpowerStore.getState().consume(influenceCost);
      if (!canAfford) {
        useSceneStore.getState().addNarrativeLog(
          '你想让他改变主意，但他的意志已经耗尽了。'
        );
        return;
      }
      useSceneStore.getState().addNarrativeLog(
        `你花费了${influenceCost}点意志力，让他做出了不同的选择。`
      );
    }

    const outcome = this.resolveOutcome(selectedAction);
    this.applyOutcome(selectedAction, outcome, wasPlayerInfluenced);

    const record: ActionRecord = {
      actionId: selectedAction.id,
      timestamp: Date.now(),
      outcome,
      playerInfluenced: wasPlayerInfluenced,
    };

    useGameStore.setState((state) => ({
      actionHistory: [...state.actionHistory, record],
    }));

    this.recordActionHistory(selectedAction.id);

    if (wasPlayerInfluenced && outcome.type === 'positive') {
      this.applyPositiveFeedback(selectedAction);
    }

    if (wasPlayerInfluenced) {
      const totalConflict = Object.values(selectedAction.cognitionConflict).reduce(
        (sum, v) => sum + v,
        0
      );

      const usedEarnest = playerInfluences.some(
        (i) => i.intensity === 'earnest'
      );
      const usedResonance = playerInfluences.some(
        (i) => i.intensity === 'resonance'
      );

      if (usedResonance) {
        usePlayerStore.getState().markEmpathetic();
      } else if (usedEarnest && totalConflict > 0.5) {
        usePlayerStore.getState().markUtilitarian();
      } else if (outcome.type === 'positive') {
        usePlayerStore.getState().markEmpathetic();
      }
    }

    const narrative = this.generateNarrative(selectedAction, outcome);
    useSceneStore.getState().addNarrativeLog(narrative);

    useHabitStore.getState().recordAction(selectedAction.id, selectedAction.category);

    const conflicts = useTaskStore.getState().detectConflicts();
    if (conflicts.length > 0) {
      useSceneStore.getState().addNarrativeLog('世界任务与内心计划产生了冲突……');
    }

    this.checkEmotionTriggers(selectedAction, outcome);
    this.checkAnchorTriggers(selectedAction, outcome);
    this.checkHighConnectionSeekHelp();
  }

  private checkHighConnectionSeekHelp() {
    const playerState = usePlayerStore.getState();
    if (!playerState.isHighConnection()) return;
    if (Math.random() >= 0.15) return;

    const SEEK_HELP_PHRASES = [
      '你觉得呢？',
      '你怎么看？',
      '我心里有些乱...你能帮我理清吗？',
      '如果是你，你会怎么做？',
      '我好像需要一个方向...',
      '我好像听到你在说什么...也许你是对的。',
    ];
    const phrase = SEEK_HELP_PHRASES[Math.floor(Math.random() * SEEK_HELP_PHRASES.length)];
    useSceneStore.getState().addNarrativeLog(
      `「他主动向你求助」——${phrase}`
    );
    playerState.adjustTrust(3, 'seek_help');
  }

  private filterAvailableActions(
    actions: Action[],
    organState: OrganHealth
  ): Action[] {
    let filtered = actions.filter((action) => {
      if (action.requirements) {
        for (const req of action.requirements) {
          if (req.type === 'willpower' && req.minValue !== undefined) {
            const willpower = useWillpowerStore.getState().current;
            if (willpower < req.minValue) return false;
          }
          if (req.type === 'organ' && req.targetId && req.minValue !== undefined) {
            const organKey = req.targetId as keyof OrganHealth;
            if (organState[organKey] < req.minValue) return false;
          }
        }
      }
      return true;
    });

    if (organState.lungs < ORGAN_CRITICAL_THRESHOLD) {
      filtered = filtered.filter((_, i) => i < Math.ceil(filtered.length * 0.7));
    }

    return filtered;
  }

  private selectAction(
    actions: Action[],
    willpowerState: ReturnType<typeof useWillpowerStore.getState>,
    cognitions: ReturnType<typeof useCognitionStore.getState>['cognitions'],
    playerInfluences: PlayerInfluence[],
    organState: OrganHealth,
    personality: Personality,
    activeSocialRules: ReturnType<typeof useSocialRuleStore.getState>['getActiveRules'] extends () => infer R ? R : never
  ): Action | null {
    const playerState = usePlayerStore.getState();
    const hasEnlightenment = playerState.hasEnlightenment;
    const xinYinLevel = playerState.xinYinLevel;

    const weighted = actions.map((action) => {
      let weight = action.baseProbability;

      weight = this.applyPersonalityModifiers(weight, action, personality, willpowerState);

      const totalConflict = Object.values(action.cognitionConflict).reduce(
        (sum, v) => sum + v,
        0
      );

      if (totalConflict > 0 && willpowerState.current < 30) {
        const sensitivityModifier = 1 - personality.cognitionActionSensitivity * 0.5;
        weight *= sensitivityModifier;
      }

      if (action.category === 'work' && totalConflict > 0) {
        const meaningModifier = 1 - personality.meaningObsession * 0.3;
        weight *= meaningModifier;
      }

      weight = this.applyRetreatInertia(weight, action);

      weight = this.applySocialRuleModifiers(weight, action, activeSocialRules);

      for (const [cogId, conflict] of Object.entries(action.cognitionConflict)) {
        const cognition = cognitions.find((c) => c.id === cogId);
        if (cognition && !cognition.isTransformed) {
          weight *= 1 + conflict * 0.05;
        } else if (cognition && cognition.isTransformed) {
          weight *= Math.max(0.3, 1 - conflict * 0.1);
        }
      }

      if (action.category === 'social' && organState.stomach < ORGAN_CRITICAL_THRESHOLD) {
        weight *= 0.5;
      }

      if (action.category === 'escape') {
        weight *= 1 + (1 - willpowerState.current / willpowerState.max) * 0.5;
      }

      if (hasEnlightenment) {
        const positiveOutcome = action.outcomes.some((o) => o.type === 'positive');
        if (positiveOutcome) {
          weight *= (1 + xinYinLevel / 200);
        }
        if (totalConflict > 0.5) {
          weight *= 0.5;
        }
      }

      for (const influence of playerInfluences) {
        const similarity = this.calculateSimilarity(influence.text, action);
        let influenceWeight = influence.weight;
        if (usePlayerStore.getState().isInfluenceReduced()) {
          influenceWeight *= 0.2;
        }
        weight *= 1 + similarity * influenceWeight;
      }

      return { action, weight: Math.max(weight, 0.01) };
    });

    const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * totalWeight;

    for (const { action, weight } of weighted) {
      random -= weight;
      if (random <= 0) return action;
    }

    return weighted[0]?.action ?? null;
  }

  private applyPersonalityModifiers(
    weight: number,
    action: Action,
    personality: Personality,
    willpowerState: ReturnType<typeof useWillpowerStore.getState>
  ): number {
    let modifiedWeight = weight;

    if (action.category === 'escape') {
      modifiedWeight *= 1 + personality.retreatInertia * 0.3;
    }

    if (action.category === 'self' || action.category === 'social') {
      const totalConflict = Object.values(action.cognitionConflict).reduce(
        (sum, v) => sum + v,
        0
      );
      if (totalConflict > 0) {
        modifiedWeight *= 1 - personality.xinYinAwakenDifficulty * 0.2;
      }
    }

    if (willpowerState.current < 50 && action.category !== 'escape' && action.category !== 'daily') {
      modifiedWeight *= 1 - personality.meaningObsession * 0.2;
    }

    return modifiedWeight;
  }

  private applyRetreatInertia(weight: number, action: Action): number {
    const historyEntry = this.actionHistory.find((h) => h.actionId === action.id);
    if (!historyEntry) return weight;

    const recentCount = historyEntry.count;
    if (recentCount > 3) {
      return weight * (1 + recentCount * 0.05);
    }

    return weight;
  }

  private applySocialRuleModifiers(
    weight: number,
    action: Action,
    activeSocialRules: ReturnType<typeof useSocialRuleStore.getState>['getActiveRules'] extends () => infer R ? R : never
  ): number {
    if (activeSocialRules.length === 0) return weight;

    const oppressiveRule = activeSocialRules.find((r) => r.id === 'oppressive_world');
    if (oppressiveRule && action.category === 'work') {
      weight *= 1 + oppressiveRule.intensity * 0.2;
    }

    const utilitarianRule = activeSocialRules.find((r) => r.id === 'utilitarian_relationship');
    if (utilitarianRule && action.category === 'social') {
      weight *= 1 - utilitarianRule.intensity * 0.3;
    }

    return weight;
  }

  private calculateSimilarity(text: string, action: Action): number {
    const textLower = text.toLowerCase();
    const actionKeywords: Record<string, string[]> = {
      browse_phone: ['手机', '刷', '躺', '休息', '放松'],
      play_games: ['游戏', '玩', '打游戏', '娱乐', '放松'],
      walk_alone: ['走路', '散步', '一个人', '出去', '走走'],
      numb_work: ['工作', '麻木', '机械', '完成任务'],
      study_metaphysics: ['命理', '玄学', '研究', '探索', '宇宙'],
      write_inner_monologue: ['写', '记录', '独白', '思考', '表达'],
      study: ['学习', '努力', '进步', '提升', '技能'],
      socialize: ['社交', '朋友', '聊天', '出门', '见面'],
      exercise: ['运动', '锻炼', '跑步', '健身', '身体'],
      work_overtime: ['加班', '工作', '努力', '赚钱', '拼搏'],
      sleep_early: ['睡觉', '休息', '早睡', '身体', '健康'],
      eat_properly: ['吃饭', '饮食', '健康', '照顾', '好好'],
      reflect: ['思考', '反思', '想想', '为什么', '意义'],
    };

    const keywords = actionKeywords[action.id] || [];
    let matchCount = 0;
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) matchCount++;
    }
    return keywords.length > 0 ? matchCount / keywords.length : 0;
  }

  private calculateInfluenceCost(
    action: Action,
    _influences: PlayerInfluence[],
    personality: Personality
  ): number {
    const totalConflict = Object.values(action.cognitionConflict).reduce(
      (sum, v) => sum + v,
      0
    );

    let baseCost = 5;
    if (totalConflict > 0) {
      baseCost += totalConflict * 2;
    }

    const resistance = personality.retreatInertia * 0.5;
    const finalCost = Math.ceil(baseCost * (1 + resistance));

    return Math.min(finalCost, 30);
  }

  private checkPlayerInfluence(
    action: Action,
    influences: PlayerInfluence[]
  ): boolean {
    return influences.some(
      (i) => this.calculateSimilarity(i.text, action) > 0.2
    );
  }

  private resolveOutcome(action: Action): Outcome {
    const roll = Math.random();
    let cumulative = 0;

    for (const outcome of action.outcomes) {
      cumulative += outcome.probability;
      if (roll <= cumulative) return outcome;
    }

    return action.outcomes[action.outcomes.length - 1];
  }

  private applyOutcome(action: Action, outcome: Outcome, wasPlayerInfluenced: boolean) {
    for (const effect of outcome.effects) {
      switch (effect.target) {
        case 'willpower': {
          if (effect.value < 0) {
            useWillpowerStore.getState().consume(Math.abs(effect.value));
          } else {
            useWillpowerStore.getState().recover(effect.value);
          }
          break;
        }
        case 'organ': {
          if (effect.key) {
            useOrganStore.getState().updateOrgan({
              organ: effect.key as keyof OrganHealth,
              change: effect.value,
              reason: action.name,
            });
          }
          break;
        }
        case 'cognition': {
          if (effect.key) {
            const cogId = effect.key as CognitionId;
            if (effect.value > 0) {
              useCognitionStore.getState().recordPositiveFeedback(cogId, action.id);
            } else {
              useCognitionStore.getState().recordNegativeFeedback(cogId);
            }
          }
          break;
        }
      }
    }

    const totalConflict = Object.values(action.cognitionConflict).reduce(
      (sum, v) => sum + v,
      0
    );
    if (totalConflict > 0 && outcome.type === 'negative' && wasPlayerInfluenced) {
      const recentInfluences = usePlayerStore.getState().getRecentInfluences();
      const earnestInfluence = recentInfluences.find(
        (i) => i.intensity === 'earnest'
      );
      if (earnestInfluence) {
        const earnestCost = Math.ceil(
          useWillpowerStore.getState().current * 0.3
        );
        useWillpowerStore.getState().consume(earnestCost);
        useSceneStore.getState().addNarrativeLog(
          '你的恳切呼唤与现实的冲突反噬了你的意志...'
        );
      }
    }
  }

  private applyPositiveFeedback(action: Action) {
    usePersonalityStore.getState().decreaseRetreatInertia(0.02);

    const totalConflict = Object.values(action.cognitionConflict).reduce(
      (sum, v) => sum + v,
      0
    );
    if (totalConflict > 5) {
      usePersonalityStore.getState().decreaseCognitionActionSensitivity(0.01);
    }

    if (action.category === 'self' || action.category === 'social') {
      usePersonalityStore.getState().decreaseMeaningObsession(0.01);
    }
  }

  private recordActionHistory(actionId: string) {
    const existing = this.actionHistory.find((h) => h.actionId === actionId);
    if (existing) {
      existing.count++;
      existing.timestamp = Date.now();
    } else {
      this.actionHistory.push({
        actionId,
        timestamp: Date.now(),
        count: 1,
      });
    }

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.actionHistory = this.actionHistory.filter((h) => h.timestamp > oneDayAgo);
  }

  private checkEmotionTriggers(action: Action, outcome: Outcome) {
    const triggers = INITIAL_EMOTION_TRIGGERS;
    const actionKeywords: Record<string, string[]> = {
      work_overtime: ['加班', '工作', '考核', '加班费', '国家大义'],
      numb_work: ['无意义', '机械', '重复', '麻木', '机器'],
      reflect: ['思考', '反思', '为什么', '意义', '活着'],
      browse_phone: ['无聊', '逃避', '放松'],
      play_games: ['游戏', '冷漠', '戾气', '负能量'],
      walk_alone: ['走路', '独处', '安静', '放松'],
      study: ['学习', '数学', '解题', '挫折', '松懈'],
      socialize: ['喜欢', '表达', '不敢', '暗恋'],
      exercise: ['运动', '锻炼', '身体'],
      study_metaphysics: ['命理', '玄学', '宇宙', '规律'],
      write_inner_monologue: ['写', '记录', '独白', '检讨'],
    };

    const keywords = actionKeywords[action.id] || [];
    for (const trigger of triggers) {
      const matchedKeywords = trigger.triggerKeywords.filter((k) =>
        keywords.includes(k) || outcome.feedback.includes(k)
      );

      if (matchedKeywords.length > 0) {
        useSceneStore.getState().addNarrativeLog(
          `（${trigger.emotionReaction}）`
        );

        if (trigger.willpowerEffect) {
          useWillpowerStore.getState().consume(Math.abs(trigger.willpowerEffect));
        }

        if (trigger.organEffect) {
          useOrganStore.getState().updateOrgan({
            organ: trigger.organEffect.organ,
            change: trigger.organEffect.change,
            reason: trigger.relatedMemory,
          });
        }

        break;
      }
    }
  }

  private checkAnchorTriggers(action: Action, outcome: Outcome) {
    const anchorStore = useAnchorStore.getState();

    const anchor = anchorStore.checkTrigger(outcome.feedback, 'memory');
    if (anchor) {
      anchorStore.activateAnchor(anchor.id);

      if (anchor.effect.willpowerRecovery) {
        useWillpowerStore.getState().recover(anchor.effect.willpowerRecovery);
      }

      if (anchor.effect.cognitionProgress) {
        useCognitionStore.getState().recordPositiveFeedback(
          anchor.effect.cognitionProgress as CognitionId,
          action.id
        );
      }

      if (anchor.effect.narrative) {
        useSceneStore.getState().addNarrativeLog(anchor.effect.narrative);
      }
    }
  }

  private checkFamilyEvents() {
    const totalDays = useTimeStore.getState().totalDays;
    const frequencies: string[] = ['daily'];

    if (totalDays % 7 === 0) {
      frequencies.push('weekly');
    }
    if (totalDays % 14 === 0) {
      frequencies.push('biweekly');
    }
    if (totalDays % 30 === 0) {
      frequencies.push('monthly');
    }

    for (const freq of frequencies) {
      const events = useNpcStore.getState().getFamilyEventByFrequency(freq as import('../types/npc').NpcEventFrequency);
      events.forEach((event) => {
        useNpcStore.getState().triggerEvent(event);
      });
    }

    const connectionGatedEvents = useNpcStore.getState().checkConnectionGatedEvents();
    connectionGatedEvents.forEach((event) => {
      useNpcStore.getState().triggerEvent(event);
    });
  }

  private weeklyUpdate() {
    useWillpowerStore.getState().updateDepression();
    const organState = useOrganStore.getState();
    useWillpowerStore.getState().recover(3, organState as any);
    useHabitStore.getState().decayHabits();

    useTaskStore.getState().generatePersonalPlan();

    const weeklyFamilyEvents = useNpcStore.getState().getFamilyEventByFrequency('weekly');
    weeklyFamilyEvents.forEach((event) => {
      useNpcStore.getState().triggerEvent(event);
    });

    const biweeklyFamilyEvents = useNpcStore.getState().getFamilyEventByFrequency('biweekly');
    biweeklyFamilyEvents.forEach((event) => {
      useNpcStore.getState().triggerEvent(event);
    });
  }

  private tickSkillCooldowns() {
    const state = useGameStore.getState();
    if (state.recallCooldown > 0) {
      useGameStore.setState({ recallCooldown: state.recallCooldown - 1 });
    }
    if (state.dreamCooldown > 0) {
      useGameStore.setState({ dreamCooldown: state.dreamCooldown - 1 });
    }
  }

  private autoSave() {
    useGameStore.getState().saveGame();
  }

  private triggerEnding() {
    useSceneStore.getState().setPhase('ending');
    this.stop();
  }

  private generateNarrative(_action: Action, outcome: Outcome): string {
    return outcome.feedback;
  }
}

export const gameLoop = new GameLoopManager();
