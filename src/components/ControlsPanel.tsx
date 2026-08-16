import React, { useState } from 'react';
import { Sliders, Move, Clock, Users, AlertCircle, HelpCircle, ArrowRightLeft, ArrowDown } from 'lucide-react';
import { TransformState, TransitionState, CompanionState } from '../types';
import { parseAndValidateCubicBezier } from '../utils/motionModel';
import { TransitionTimeline } from './TransitionTimeline';
import { TransitionMeasurer } from './TransitionMeasurer';
import { EasingVisualizer } from './EasingVisualizer';
import { useReducedMotion } from '../hooks/useReducedMotion';

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
  const reducedMotion = useReducedMotion();

  const handleTransformChange = (key: keyof TransformState, val: number) => {
    onChangeTransform({ ...transform, [key]: val });
  };

  const handleTransitionChange = (key: keyof TransitionState, val: string | number) => {
    onChangeTransition({ ...transition, [key]: val });
  };

  const handleCompanionChange = <K extends keyof CompanionState>(key: K, val: CompanionState[K]) => {
    onChangeCompanion({ ...companion, [key]: val });
  };

  const scrollToOrderSection = () => {
    const el = document.getElementById('transform-order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      <div className="flex border-b border-zinc-800 bg-zinc-950/65">
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

      <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[620px]">
        {/* TRANSFORM TAB */}
        {activeTab === 'transform' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-indigo-400" />
                Transformは何を表現する仕組みか
              </h3>
              <span className="text-[10px] text-zinc-500">どこへ・どんな形へ変えるか（到着点）</span>
            </div>

            {/* 1. Transformとは何か 導入展示 */}
            <div className="bg-gradient-to-br from-indigo-950/50 to-zinc-950 border border-indigo-500/30 rounded-2xl p-4 space-y-3 text-xs text-indigo-100">
              <div className="flex items-center space-x-2 font-bold text-indigo-300 text-sm">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Transformの本質：変形と「到着点」の設計</span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                <strong className="text-white">Transform</strong> は、要素の見た目の「位置（translate）・角度（rotate）・大きさ（scale）・傾き（skew）」を変える仕組みです。
                周囲のHTMLレイアウトを押しのけず（他の要素の配置を崩さず）、その要素の見た目だけを高速かつ軽快に変形させます。
              </p>

              {/* Flow diagram */}
              <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 font-mono text-[10px] text-zinc-300 flex flex-wrap items-center justify-center gap-2">
                <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-700 text-zinc-200">通常状態</span>
                <span className="text-indigo-400">↓ transform</span>
                <span className="px-2 py-1 bg-indigo-950 rounded border border-indigo-500/40 text-indigo-200">位置・角度・大きさ・傾きが変化</span>
                <span className="text-indigo-400">↓ transitionを加える</span>
                <span className="px-2.5 py-1 bg-indigo-600/30 rounded border border-indigo-500 text-indigo-200 font-bold">時間をかけて自然に変化</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300 pt-1">
                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                  <strong className="text-white block mb-0.5">🎯 動きそのものではない（到着点）</strong>
                  Transformは「どんな形・位置に変わるか」という到着点を決めるだけで、時間は持ちません。
                </div>
                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                  <strong className="text-white block mb-0.5">✨ Transitionとの組み合わせ</strong>
                  Transitionを組み合わせることで、カードの浮き上がりやボタンの押し込みなど、UIの心地よい反応が生まれます。
                </div>
              </div>
            </div>

            {/* 2. 現在のTransform設定要約 */}
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="font-medium">現在の変形パラメータ要約:</span>
                <span className="text-[10px] text-indigo-400 font-mono">アクティブ時の到着点</span>
              </div>
              <div className="bg-zinc-900/90 px-3 py-2 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-200 flex flex-wrap gap-x-3 gap-y-1">
                <span><strong className="text-indigo-400">X:</strong> {transform.translateX}px</span>
                <span className="text-zinc-600">｜</span>
                <span><strong className="text-indigo-400">Y:</strong> {transform.translateY}px</span>
                <span className="text-zinc-600">｜</span>
                <span><strong className="text-indigo-400">回転:</strong> {transform.rotate}°</span>
                <span className="text-zinc-600">｜</span>
                <span><strong className="text-indigo-400">拡大:</strong> {transform.scale}</span>
                <span className="text-zinc-600">｜</span>
                <span><strong className="text-indigo-400">傾き:</strong> {transform.skewX}°</span>
              </div>
            </div>

            {/* 3. 各Transform操作の調整スライダー */}
            <div className="space-y-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>変形パラメータの操作</span>
                <span className="text-[10px] text-zinc-500 lowercase">translateX / translateY / rotate / scale / skewX</span>
              </h4>

              {/* X Move */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium flex items-center gap-1">
                    X移動 (translateX)
                    <span className="text-[10px] text-zinc-500">横方向のずれ</span>
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
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  横方向に見た目をずらします（正の値で右、負の値で左）。タブインジケータ移動や横スライドインに活用します。
                </p>
              </div>

              {/* Y Move */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium flex items-center gap-1">
                    Y移動 (translateY)
                    <span className="text-[10px] text-zinc-500">縦方向のずれ（負で上）</span>
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
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  縦方向に見た目をずらします（負の値で上、正の値で下）。カードの浮き上がり（-4px〜-8px）やボタン押し込み（+2px）に頻出です。
                </p>
              </div>

              {/* Rotate */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium flex items-center gap-1">
                    回転 (rotate)
                    <span className="text-[10px] text-zinc-500">中心基準の角度</span>
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
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  要素の中心を基準に回転させます（正の値で時計回り、負の値で反時計回り）。アコーディオン矢印の反転（180°）やローディング演出に使います。
                </p>
              </div>

              {/* Scale */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium flex items-center gap-1">
                    拡大縮小 (scale)
                    <span className="text-[10px] text-zinc-500">大きさの倍率（1が等倍）</span>
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
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  基準サイズを 1 とし拡大・縮小します（1より大きいと拡大、小さいと縮小）。ホバー時の注目喚起（1.02〜1.05）やダイアログ出現に使います。
                </p>
              </div>

              {/* SkewX */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium flex items-center gap-1">
                    傾き (skewX)
                    <span className="text-[10px] text-zinc-500">水平方向の傾斜角度</span>
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
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  横方向に傾けて勢いや遠近感を作ります。多用すると可読性を損なうため、スピード感のあるバッジ等に控えめにアクセントとして使います。
                </p>
              </div>
            </div>

            {/* 4. Transform順序に関する案内 & 比較展示へのリンク */}
            <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-zinc-200 text-[11px]">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
                  <span>関数の記述順序で結果が変わる点に注意</span>
                </div>
                <button
                  onClick={scrollToOrderSection}
                  className="inline-flex items-center space-x-1 text-[10px] font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-950/70 border border-indigo-500/30 px-2 py-1 rounded-lg transition"
                >
                  <span>順序比較展示へ</span>
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                <code>transform</code> は複数の関数を連結できます。例えば <code>translate → rotate</code> と <code>rotate → translate</code> では、同じ数値でも座標軸の回転順序が異なり、全く異なる軌道を描きます。画面下部の比較展示で実際の軌道の違いを確認できます。
              </p>
            </div>
          </div>
        )}

        {/* TRANSITION TAB */}
        {activeTab === 'transition' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Transitionは何を表現する仕組みか
              </h3>
              <span className="text-[10px] text-zinc-500">仕組みと時間の設計</span>
            </div>

            {/* 1. Transitionとは何か 導入展示 */}
            <div className="bg-gradient-to-br from-indigo-950/50 to-zinc-950 border border-indigo-500/30 rounded-2xl p-4 space-y-3 text-xs text-indigo-100">
              <div className="flex items-center space-x-2 font-bold text-indigo-300 text-sm">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Transitionの本質：変化の「時間と速度」の設計図</span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                <strong className="text-white">Transform</strong> が「どこへ・どんな形へ変わるか（到着点）」を決めるのに対し、
                <strong className="text-white">Transition</strong> は「通常状態から到着点まで、どのくらい待ち、どのくらいの時間をかけ、どんな速度変化で移るか」を決める仕組みです。
              </p>

              {/* Flow diagram */}
              <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 font-mono text-[10px] text-zinc-300 flex flex-wrap items-center justify-center gap-2">
                <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-700 text-zinc-200">通常状態</span>
                <span className="text-indigo-400">↓ きっかけ (Hover/Click/JS)</span>
                <span className="px-2 py-1 bg-zinc-900 rounded border border-zinc-700 text-zinc-200">状態変化</span>
                <span className="text-indigo-400">↓ transition</span>
                <span className="px-2.5 py-1 bg-indigo-600/30 rounded border border-indigo-500 text-indigo-200 font-bold">待機 → 変化中 → 到着</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300 pt-1">
                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                  <strong className="text-white block mb-0.5">💡 きっかけの必要性</strong>
                  Transition単体では勝手に動きません。Hover、Click、JSのclass付与など「状態を変えるきっかけ」が必ず必要です。
                </div>
                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                  <strong className="text-white block mb-0.5">⚡ @keyframesとの違い</strong>
                  ボタンの反応やカードの浮き上がりなど1回きりの変化にはTransitionが最適。複雑なループや連続アニメーションには @keyframes を使います。
                </div>
              </div>
            </div>

            {/* 2. 現在の設定要約 */}
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">現在の設定値概要:</span>
              <span className="font-mono text-indigo-300 font-semibold">
                duration: {transition.duration}s | delay: {transition.delay}s | easing: {transition.easing}
              </span>
            </div>

            {/* 3. モーション・タイムライン */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                3. モーション・タイムライン
              </h4>
              <TransitionTimeline transition={transition} companion={companion} />
            </div>

            {/* 4. Duration / Delay / Easing の操作 */}
            <div className="space-y-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                4. 時間パラメータと速度の調整
              </h4>

              {/* Duration */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium flex items-center gap-1">
                    変化にかかる時間 (duration)
                    <span className="text-[10px] text-zinc-500">秒数</span>
                  </span>
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
                <p className="text-[10px] text-zinc-400">※ 変化時間を長くすると、ゆったりした印象になります。</p>
              </div>

              {/* Delay */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                    動き始めるまでの待ち時間 (delay)
                    <span className="text-[10px] text-zinc-500">秒数</span>
                  </span>
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
                <p className="text-[10px] text-zinc-400">※ 待ち時間を長くすると、反応が遅く感じられます。</p>
              </div>
            </div>

            {/* Easing Selection */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">イージング曲線 (easing)</span>
                <span className="text-[10px] text-indigo-400 font-medium">
                  {easingDescriptions[transition.easing] || 'カスタム'}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">※ Easingを変えると、同じ時間でも軽さ・重さ・勢いが変わります。</p>
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

            {/* 5. Easing 曲線ビジュアライザ */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                5. イージング曲線ビジュアライザ
              </h4>
              <EasingVisualizer transition={transition} />
            </div>

            {/* 6. 動きの測定器 */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                6. 動きの測定器
              </h4>
              <TransitionMeasurer
                transition={transition}
                companion={companion}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* 7. 生成されるCSSへの案内 */}
            <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <strong className="text-zinc-200 block">7. 実際に生成されるCSSの読み方</strong>
              <p>
                下部のコードパネルでは、ここで調整した <code>transition: property duration timing-function delay;</code> がそのままCSSプロパティとして出力されます。
              </p>
            </div>
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
