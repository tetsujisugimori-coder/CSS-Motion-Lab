import React from 'react';
import { TransitionState, CompanionState } from '../types';

interface TransitionTimelineProps {
  transition: TransitionState;
  companion: CompanionState;
}

export const TransitionTimeline: React.FC<TransitionTimelineProps> = ({ transition, companion }) => {
  // Max time representation on timeline (scale up to max 2.5s or calculated)
  const maxTime = Math.max(2.0, transition.delay + companion.delay + transition.duration + 0.5);

  const mainDelayPct = (transition.delay / maxTime) * 100;
  const mainDurationPct = (transition.duration / maxTime) * 100;

  const compStart = transition.delay + companion.delay;
  const compDelayPct = (compStart / maxTime) * 100;
  const compDurationPct = (transition.duration / maxTime) * 100;

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          モーション・タイムライン（時間の流れと遅延）
        </h4>
        <span className="text-[10px] font-mono text-indigo-400">Total Scale: {maxTime.toFixed(1)}s max</span>
      </div>

      <div className="space-y-3 pt-1">
        {/* Main Lane */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              主役カード (Main)
            </span>
            <span className="text-zinc-400 font-mono text-[10px]">
              待機 {transition.delay}s → 移動 {transition.duration}s
            </span>
          </div>
          <div className="h-6 bg-zinc-900 rounded-lg border border-zinc-800 relative overflow-hidden flex">
            {/* Delay segment */}
            <div
              style={{ width: `${Math.min(100, mainDelayPct)}%` }}
              className="h-full bg-zinc-800/50 border-r border-zinc-700/50 flex items-center justify-center text-[9px] text-zinc-500 font-mono"
              title={`Delay: ${transition.delay}s`}
            >
              {transition.delay > 0.05 && `${transition.delay}s`}
            </div>
            {/* Active transition segment */}
            <div
              style={{ width: `${Math.min(100 - mainDelayPct, mainDurationPct)}%` }}
              className="h-full bg-gradient-to-r from-indigo-600/60 to-violet-600/60 border-r border-indigo-400/40 flex items-center justify-center text-[9px] text-white font-medium shadow-sm"
              title={`Duration: ${transition.duration}s`}
            >
              動中 {transition.duration}s
            </div>
          </div>
        </div>

        {/* Companion Lane */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-violet-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-500"></span>
              追従カード (Companion)
            </span>
            <span className="text-zinc-400 font-mono text-[10px]">
              待機 {compStart.toFixed(2)}s → 移動 {transition.duration}s
            </span>
          </div>
          <div className="h-6 bg-zinc-900 rounded-lg border border-zinc-800 relative overflow-hidden flex">
            {/* Delay segment */}
            <div
              style={{ width: `${Math.min(100, compDelayPct)}%` }}
              className="h-full bg-zinc-800/50 border-r border-zinc-700/50 flex items-center justify-center text-[9px] text-zinc-500 font-mono"
              title={`Total Delay: ${compStart.toFixed(2)}s`}
            >
              {compStart > 0.05 && `${compStart.toFixed(2)}s`}
            </div>
            {/* Active transition segment */}
            <div
              style={{ width: `${Math.min(100 - compDelayPct, compDurationPct)}%` }}
              className="h-full bg-gradient-to-r from-violet-600/60 to-purple-600/60 border-r border-violet-400/40 flex items-center justify-center text-[9px] text-white font-medium shadow-sm"
              title={`Duration: ${transition.duration}s`}
            >
              追従 {transition.duration}s
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/60">
        <span>0.0s (開始)</span>
        <span>時間の経過 →</span>
        <span>{maxTime.toFixed(1)}s</span>
      </div>
    </div>
  );
};
