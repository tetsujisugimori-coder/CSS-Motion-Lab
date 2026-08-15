import React from 'react';
import { Info, AlertTriangle, Lightbulb, Compass } from 'lucide-react';
import { PresetConfig } from '../types';

interface ExplanationPanelProps {
  currentPreset: PresetConfig;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ currentPreset }) => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
        <Compass className="w-4 h-4 text-indigo-400" />
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          モーション解説：{currentPreset.name}
        </h3>
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
