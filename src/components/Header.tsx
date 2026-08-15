import React from 'react';
import { Sparkles, RotateCcw, BookOpen, Layers } from 'lucide-react';
import { PresetId } from '../types';
import { PRESETS } from '../data/presets';

interface HeaderProps {
  currentPresetId: PresetId;
  onSelectPreset: (id: PresetId) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPresetId, onSelectPreset, onReset }) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight">CSS Motion Lab</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Interactive Playground
              </span>
            </div>
            <p className="text-xs text-zinc-400">動きの仕組みを、触って確かめる。</p>
          </div>
        </div>

        {/* Preset quick pills for desktop */}
        <div className="hidden md:flex items-center space-x-2 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <span className="text-xs text-zinc-400 px-2 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            プリセット:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentPresetId === p.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            title="設定をリセット"
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">リセット</span>
          </button>
        </div>
      </div>
    </header>
  );
};
