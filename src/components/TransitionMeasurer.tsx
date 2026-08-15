import React, { useState, useEffect } from 'react';
import { Play, Activity } from 'lucide-react';
import { TransitionState, CompanionState } from '../types';
import { getEasingValue } from '../utils/motionModel';

interface TransitionMeasurerProps {
  transition: TransitionState;
  companion: CompanionState;
  reducedMotion: boolean;
}

export const TransitionMeasurer: React.FC<TransitionMeasurerProps> = ({
  transition,
  companion,
  reducedMotion,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mainState, setMainState] = useState<'idle' | 'moving' | 'done'>('idle');
  const [compState, setCompState] = useState<'idle' | 'moving' | 'done'>('idle');

  const triggerPlay = () => {
    if (reducedMotion) return;
    setIsPlaying(true);
    setMainState('idle');
    setCompState('idle');

    const mainDelayMs = transition.delay * 1000;
    const durationMs = transition.duration * 1000;
    const compDelayMs = (transition.delay + companion.delay) * 1000;
    const maxTotalMs = Math.max(mainDelayMs + durationMs, compDelayMs + durationMs) + 150;

    const t1 = setTimeout(() => {
      setMainState('moving');
    }, Math.max(10, mainDelayMs));

    const t2 = setTimeout(() => {
      setMainState('done');
    }, mainDelayMs + durationMs);

    const t3 = setTimeout(() => {
      setCompState('moving');
    }, Math.max(10, compDelayMs));

    const t4 = setTimeout(() => {
      setCompState('done');
    }, compDelayMs + durationMs);

    const tEnd = setTimeout(() => {
      setIsPlaying(false);
    }, maxTotalMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
    };
  };

  useEffect(() => {
    if (!reducedMotion) {
      const cleanup = triggerPlay();
      return cleanup;
    } else {
      setMainState('done');
      setCompState('done');
    }
  }, [transition.duration, transition.delay, transition.easing, transition.customBezier, companion.delay]);

  const easingStr = getEasingValue(transition);
  const effDuration = reducedMotion ? 0.01 : transition.duration;
  
  const mainStyle = {
    transition: `transform ${effDuration}s ${easingStr}`,
    transform: mainState === 'moving' || mainState === 'done' ? 'translateX(260px)' : 'translateX(0px)',
  };

  const compTotalDelay = transition.delay + companion.delay;
  const compStyle = {
    transition: `transform ${effDuration}s ${easingStr}`,
    transform: compState === 'moving' || compState === 'done' ? 'translateX(260px)' : 'translateX(0px)',
  };

  return (
    <div className="bg-zinc-950/85 border border-indigo-500/20 rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            動きの測定器（独立トランジションデモ）
          </h4>
        </div>
        <button
          onClick={triggerPlay}
          disabled={isPlaying || reducedMotion}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow transition"
        >
          {isPlaying ? (
            <>測定中...</>
          ) : (
            <>
              <Play className="w-3 h-3" /> 再測定
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-zinc-400">
        カードの複雑な変形を除外し、設定された「時間・遅延・イージング」の挙動だけに集中して比較するための測定レーンです。
      </p>

      {/* Track Area */}
      <div className="space-y-4 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 relative overflow-hidden">
        {/* Main marker track */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-zinc-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              主役 (Delay: {transition.delay}s)
            </span>
            <span className="text-indigo-400 text-[10px]">
              {mainState === 'idle' && (isPlaying ? '待機中...' : '待機 / 停止中')}
              {mainState === 'moving' && '移動中...'}
              {mainState === 'done' && '完了'}
            </span>
          </div>
          <div className="h-8 bg-zinc-950 rounded-lg border border-zinc-800 relative flex items-center px-2">
            <div className="absolute inset-x-4 border-b border-dashed border-zinc-800"></div>
            <div
              style={mainStyle}
              className="w-6 h-6 rounded-md bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-md flex items-center justify-center text-[10px] font-bold text-white z-10"
            >
              M
            </div>
          </div>
        </div>

        {/* Companion marker track */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-zinc-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
              追従 (Delay: {compTotalDelay.toFixed(2)}s)
            </span>
            <span className="text-violet-400 text-[10px]">
              {compState === 'idle' && (isPlaying ? '待機中...' : '待機 / 停止中')}
              {compState === 'moving' && '移動中...'}
              {compState === 'done' && '完了'}
            </span>
          </div>
          <div className="h-8 bg-zinc-950 rounded-lg border border-zinc-800 relative flex items-center px-2">
            <div className="absolute inset-x-4 border-b border-dashed border-zinc-800"></div>
            <div
              style={compStyle}
              className="w-6 h-6 rounded-md bg-gradient-to-r from-violet-500 to-purple-600 shadow-md flex items-center justify-center text-[10px] font-bold text-white z-10"
            >
              C
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
