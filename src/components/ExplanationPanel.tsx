import React from 'react';
import { Info, AlertTriangle, Lightbulb, Compass, SlidersHorizontal } from 'lucide-react';
import { PresetConfig, TransformState, TransitionState, CompanionState } from '../types';
import { getEasingValue } from '../utils/motionModel';

interface ExplanationPanelProps {
  currentPreset: PresetConfig;
  transform: TransformState;
  transition: TransitionState;
  companion: CompanionState;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  currentPreset,
  transform,
  transition,
  companion,
}) => {
  const easingVal = getEasingValue(transition);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
        <Compass className="w-4 h-4 text-indigo-400" />
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          選択中プリセットの解説：{currentPreset.name}
        </h3>
      </div>

      {/* 現在の調整値ブロック（プリセット値との違いを示す） */}
      <div className="bg-zinc-950/80 border border-indigo-500/20 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center space-x-1.5 text-indigo-400 text-xs font-semibold">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>現在の調整値パラメータ（スライダー等での変更が即時反映されます）</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-zinc-300">
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">Translate</span>
            X: {transform.translateX}px / Y: {transform.translateY}px
          </div>
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">Rotate / Scale</span>
            {transform.rotate}° / {transform.scale}x
          </div>
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">Duration / Delay</span>
            {transition.duration}s / {transition.delay}s
          </div>
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">Easing / Comp.Delay</span>
            <span className="truncate block" title={easingVal}>
              {transition.easing} (+{companion.delay}s)
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-xs text-zinc-300">
        <div className="flex items-start space-x-2.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-zinc-200 block mb-0.5">仕組みと特徴</span>
            <p className="text-zinc-400 leading-relaxed">{currentPreset.description}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-zinc-200 block mb-0.5">おすすめの使いどころ</span>
            <p className="text-zinc-400 leading-relaxed">{currentPreset.useCase}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2.5 bg-amber-950/20 p-3 rounded-xl border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-200 block mb-0.5">やりすぎの注意点</span>
            <p className="text-amber-300/80 leading-relaxed">{currentPreset.pitfall}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
