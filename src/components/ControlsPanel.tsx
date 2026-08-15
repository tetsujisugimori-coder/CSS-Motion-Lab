import React, { useState } from 'react';
import { Sliders, Move, Clock, Users, AlertCircle } from 'lucide-react';
import { TransformState, TransitionState, CompanionState } from '../types';
import { parseAndValidateCubicBezier } from '../utils/motionModel';

interface ControlsPanelProps {
  transform: TransformState;
  onChangeTransform: (newTransform: TransformState) => void;
  transition: TransitionState;
  onChangeTransition: (newTransition: TransitionState) => void;
  companion: CompanionState;
  onChangeCompanion: (newCompanion: CompanionState) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  transform,
  onChangeTransform,
  transition,
  onChangeTransition,
  companion,
  onChangeCompanion,
}) => {
  const [activeTab, setActiveTab] = useState<'transform' | 'transition' | 'companion'>('transform');

  const handleTransformChange = (key: keyof TransformState, val: number) => {
    onChangeTransform({ ...transform, [key]: val });
  };

  const handleTransitionChange = (key: keyof TransitionState, val: any) => {
    onChangeTransition({ ...transition, [key]: val });
  };

  const handleCompanionChange = (key: keyof CompanionState, val: any) => {
    onChangeCompanion({ ...companion, [key]: val });
  };

  const bezierCheck = parseAndValidateCubicBezier(transition.customBezier);

  const easingDescriptions: Record<string, string> = {
    'ease': '自然に加減速（標準）',
    'ease-in': '徐々に加速して発進',
    'ease-out': '到着時にゆっくり減速・停止',
    'ease-in-out': '始まりも終わりもなめらか',
    'linear': '一定速度で機械的な動き',
    'cubic-bezier(0.16, 1, 0.3, 1)': 'エレガントで洗練されたバウンス感',
    'cubic-bezier(0.34, 1.56, 0.64, 1)': '弾力のあるポップな跳ね返り',
    'custom': 'カスタムCubic-Bezier曲線',
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
      {/* Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/60">
        <button
          onClick={() => setActiveTab('transform')}
          className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors border-b-2 ${
            activeTab === 'transform'
              ? 'border-indigo-500 text-indigo-400 bg-zinc-900/50'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Move className="w-4 h-4" />
          <span>Transform</span>
        </button>
        <button
          onClick={() => setActiveTab('transition')}
          className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors border-b-2 ${
            activeTab === 'transition'
              ? 'border-indigo-500 text-indigo-400 bg-zinc-900/50'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Transition</span>
        </button>
        <button
          onClick={() => setActiveTab('companion')}
          className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors border-b-2 ${
            activeTab === 'companion'
              ? 'border-indigo-500 text-indigo-400 bg-zinc-900/50'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>追従カード</span>
        </button>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[550px]">
        {/* TRANSFORM TAB */}
        {activeTab === 'transform' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                主役カードの変形パラメータ
              </h3>
              <span className="text-[10px] text-zinc-500">translate / rotate / scale</span>
            </div>

            {/* X Move */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium flex items-center gap-1">
                  X移動 (translateX)
                  <span className="text-[10px] text-zinc-500">横方向</span>
                </span>
                <span className="font-mono text-indigo-400 font-semibold">{transform.translateX}px</span>
              </div>
              <input
                type="range"
                min={-120}
                max={120}
                step={2}
                value={transform.translateX}
                onChange={(e) => handleTransformChange('translateX', Number(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Y Move */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium flex items-center gap-1">
                  Y移動 (translateY)
                  <span className="text-[10px] text-zinc-500">負の値で上へ</span>
                </span>
                <span className="font-mono text-indigo-400 font-semibold">{transform.translateY}px</span>
              </div>
              <input
                type="range"
                min={-120}
                max={120}
                step={2}
                value={transform.translateY}
                onChange={(e) => handleTransformChange('translateY', Number(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rotate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium flex items-center gap-1">
                  回転 (rotate)
                  <span className="text-[10px] text-zinc-500">角度deg</span>
                </span>
                <span className="font-mono text-indigo-400 font-semibold">{transform.rotate}°</span>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={transform.rotate}
                onChange={(e) => handleTransformChange('rotate', Number(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Scale */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium flex items-center gap-1">
                  拡大縮小 (scale)
                  <span className="text-[10px] text-zinc-500">倍率</span>
                </span>
                <span className="font-mono text-indigo-400 font-semibold">{transform.scale}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.8}
                step={0.02}
                value={transform.scale}
                onChange={(e) => handleTransformChange('scale', Number(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* SkewX */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium flex items-center gap-1">
                  傾き (skewX)
                  <span className="text-[10px] text-zinc-500">遠近感</span>
                </span>
                <span className="font-mono text-indigo-400 font-semibold">{transform.skewX}°</span>
              </div>
              <input
                type="range"
                min={-30}
                max={30}
                step={1}
                value={transform.skewX}
                onChange={(e) => handleTransformChange('skewX', Number(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TRANSITION TAB */}
        {activeTab === 'transition' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                トランジション（時間と速度）
              </h3>
              <span className="text-[10px] text-zinc-500">duration / easing / delay</span>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">継続時間 (duration)</span>
                <span className="font-mono text-indigo-400 font-semibold">{transition.duration}s</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={1.5}
                step={0.05}
                value={transition.duration}
                onChange={(e) => handleTransitionChange('duration', Number(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Delay */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">遅延時間 (delay)</span>
                <span className="font-mono text-indigo-400 font-semibold">{transition.delay}s</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.5}
                step={0.05}
                value={transition.delay}
                onChange={(e) => handleTransitionChange('delay', Number(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Easing */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">イージング曲線</span>
                <span className="text-[10px] text-indigo-400 font-medium">
                  {easingDescriptions[transition.easing] || 'カスタム'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'ease', label: 'ease (標準)' },
                  { id: 'ease-out', label: 'ease-out (減速)' },
                  { id: 'ease-in', label: 'ease-in (加速)' },
                  { id: 'ease-in-out', label: 'ease-in-out (滑らか)' },
                  { id: 'linear', label: 'linear (一定)' },
                  { id: 'cubic-bezier(0.16, 1, 0.3, 1)', label: 'Smooth Out' },
                  { id: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Bouncy' },
                  { id: 'custom', label: 'Custom Bezier' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTransitionChange('easing', item.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all border ${
                      transition.easing === item.id || (item.id === 'custom' && transition.easing === 'custom')
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Cubic Bezier Input */}
            {transition.easing === 'custom' && (
              <div className="space-y-2 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800">
                <label className="text-xs text-zinc-300 font-medium block">
                  カスタム Cubic-Bezier (4つの数値: x1, y1, x2, y2)
                </label>
                <input
                  type="text"
                  value={transition.customBezier}
                  onChange={(e) => handleTransitionChange('customBezier', e.target.value)}
                  placeholder="0.16, 1, 0.3, 1"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
                {!bezierCheck.isValid && (
                  <p className="text-[11px] text-amber-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {bezierCheck.error}
                  </p>
                )}
                {bezierCheck.isValid && (
                  <p className="text-[11px] text-emerald-400 font-mono">
                    適用中: cubic-bezier({bezierCheck.values.join(', ')})
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* COMPANION TAB */}
        {activeTab === 'companion' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                追従カードの連動設定
              </h3>
              <span className="text-[10px] text-zinc-500">ratio / delay / direction</span>
            </div>

            {/* Ratio */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">移動量比率 (ratio)</span>
                <span className="font-mono text-indigo-400 font-semibold">{companion.ratio * 100}%</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0.25, 0.5, 0.75, 1.0].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleCompanionChange('ratio', r)}
                    className={`py-2 rounded-xl text-xs font-medium transition-all border ${
                      companion.ratio === r
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {r * 100}%
                  </button>
                ))}
              </div>
            </div>

            {/* Companion Delay */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">追従の遅延 (delay)</span>
                <span className="font-mono text-indigo-400 font-semibold">{companion.delay}s</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.3}
                step={0.02}
                value={companion.delay}
                onChange={(e) => handleCompanionChange('delay', Number(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">通常時の透明度 (opacity)</span>
                <span className="font-mono text-indigo-400 font-semibold">{companion.opacity}</span>
              </div>
              <input
                type="range"
                min={0.3}
                max={1.0}
                step={0.05}
                value={companion.opacity}
                onChange={(e) => handleCompanionChange('opacity', Number(e.target.value))}
                className="w-full accent-indigo-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Direction */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">動きの方向</span>
                <span className="text-[10px] text-zinc-500">主役に対する挙動</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCompanionChange('direction', 'same')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border ${
                    companion.direction === 'same'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                  }`}
                >
                  同方向へ移動
                </button>
                <button
                  onClick={() => handleCompanionChange('direction', 'reverse')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border ${
                    companion.direction === 'reverse'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                  }`}
                >
                  逆方向へ対置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
