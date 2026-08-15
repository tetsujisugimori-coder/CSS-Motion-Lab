import React, { useState } from 'react';
import { Header } from './components/Header';
import { PreviewArea } from './components/PreviewArea';
import { ControlsPanel } from './components/ControlsPanel';
import { CodePanel } from './components/CodePanel';
import { ExplanationPanel } from './components/ExplanationPanel';
import { TransformOrderComparison } from './components/TransformOrderComparison';
import { PRESETS } from './data/presets';
import { PresetId, OperationMode, TransformState, TransitionState, CompanionState } from './types';

export default function App() {
  const [currentPresetId, setCurrentPresetId] = useState<PresetId>('gentle-lift');
  const currentPreset = PRESETS.find((p) => p.id === currentPresetId) || PRESETS[0];

  const [mode, setMode] = useState<OperationMode>(currentPreset.mode);
  const [transform, setTransform] = useState<TransformState>({ ...currentPreset.transform });
  const [transition, setTransition] = useState<TransitionState>({ ...currentPreset.transition });
  const [companion, setCompanion] = useState<CompanionState>({ ...currentPreset.companion });

  const handleSelectPreset = (id: PresetId) => {
    const p = PRESETS.find((item) => item.id === id);
    if (!p) return;
    setCurrentPresetId(id);
    setMode(p.mode);
    setTransform({ ...p.transform });
    setTransition({ ...p.transition });
    setCompanion({ ...p.companion });
  };

  const handleReset = () => {
    setMode(currentPreset.mode);
    setTransform({ ...currentPreset.transform });
    setTransition({ ...currentPreset.transition });
    setCompanion({ ...currentPreset.companion });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Preset Selector Bar for Mobile */}
        <div className="flex md:hidden flex-wrap items-center gap-2 bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium">プリセット:</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                currentPresetId === p.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-950'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* 3-Column / Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Controls (PC: 4 cols, Mobile: full) */}
          <div className="lg:col-span-5 space-y-6">
            <ControlsPanel
              transform={transform}
              onChangeTransform={setTransform}
              transition={transition}
              onChangeTransition={setTransition}
              companion={companion}
              onChangeCompanion={setCompanion}
            />
          </div>

          {/* Center/Right Column: Preview & Generated Code & Explanation (PC: 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <PreviewArea
              mode={mode}
              onChangeMode={setMode}
              transform={transform}
              transition={transition}
              companion={companion}
            />

            <CodePanel
              transform={transform}
              transition={transition}
              companion={companion}
              mode={mode}
            />

            <ExplanationPanel
              currentPreset={currentPreset}
              transform={transform}
              transition={transition}
              companion={companion}
            />

            <TransformOrderComparison />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 mt-12 bg-zinc-950 text-center text-xs text-zinc-500">
        <p>CSS Motion Lab — 動きの仕組みを、触って確かめるインタラクティブ教材</p>
      </footer>
    </div>
  );
}
