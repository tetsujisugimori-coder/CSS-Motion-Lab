import React, { useState, useEffect } from 'react';
import { MousePointer, Hand, Play, Info, Sparkles, ArrowRight, Layers, ShieldAlert } from 'lucide-react';
import { OperationMode, TransformState, TransitionState, CompanionState } from '../types';
import { getEasingValue } from '../utils/cssGenerator';

interface PreviewAreaProps {
  mode: OperationMode;
  onChangeMode: (mode: OperationMode) => void;
  transform: TransformState;
  transition: TransitionState;
  companion: CompanionState;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  mode,
  onChangeMode,
  transform,
  transition,
  companion,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Trigger auto preview animation
  useEffect(() => {
    if (mode === 'preview') {
      setIsPlayingPreview(true);
      const timer = setTimeout(() => {
        setIsPlayingPreview(false);
      }, (transition.duration + transition.delay + 0.3) * 1000);
      return () => clearTimeout(timer);
    } else {
      setIsPlayingPreview(false);
    }
  }, [mode, transition.duration, transition.delay, transform]);

  const handleMainClick = () => {
    if (mode === 'click') {
      setIsClicked(!isClicked);
    } else if (mode === 'preview' && !isPlayingPreview) {
      setIsPlayingPreview(true);
      setTimeout(() => setIsPlayingPreview(false), (transition.duration + transition.delay + 0.3) * 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMainClick();
    }
  };

  const easingVal = getEasingValue(transition.easing, transition.customBezier);
  const mainTransition = `transform ${transition.duration}s ${easingVal} ${transition.delay}s`;
  const compTransition = `transform ${transition.duration}s ${easingVal} ${transition.delay + companion.delay}s, opacity ${transition.duration}s ease`;

  const isActive = mode === 'hover' ? false : mode === 'click' ? isClicked : isPlayingPreview;

  // Compute transform styles
  const mainTransformStyle = isActive
    ? `translateX(${transform.translateX}px) translateY(${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scale}) skewX(${transform.skewX}deg)`
    : 'translateX(0px) translateY(0px) rotate(0deg) scale(1) skewX(0deg)';

  const compX = transform.translateX * companion.ratio * (companion.direction === 'reverse' ? -1 : 1);
  const compY = transform.translateY * companion.ratio * (companion.direction === 'reverse' ? -1 : 1);
  const compRot = transform.rotate * companion.ratio * 0.5 * (companion.direction === 'reverse' ? -1 : 1);
  const compScale = 1 + (transform.scale - 1) * companion.ratio * 0.5;

  const compTransformStyle = isActive
    ? `translateX(${compX}px) translateY(${compY}px) rotate(${compRot}deg) scale(${compScale})`
    : 'translateX(0px) translateY(0px) rotate(0deg) scale(1)';

  const compOpacityStyle = isActive ? Math.min(1, companion.opacity + 0.15) : companion.opacity;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-xl">
      {/* Top Bar: Mode switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            ライブプレビュー展示室
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">主役と追従カードの連動をリアルタイムで確認</p>
        </div>

        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => { onChangeMode('hover'); setIsClicked(false); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'hover' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>Hover</span>
          </button>
          <button
            onClick={() => { onChangeMode('click'); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'click' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Click</span>
          </button>
          <button
            onClick={() => { onChangeMode('preview'); setIsClicked(false); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'preview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="mb-6 bg-indigo-950/30 border border-indigo-500/20 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-indigo-200">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>
            {mode === 'hover' && '1. 主役カードにマウスを乗せる（Hover）　2. 左の値を変える　3. 下部からCSSをコピー'}
            {mode === 'click' && '1. 主役カードをクリックして変形を確認　2. もう一度クリックで元に戻る'}
            {mode === 'preview' && '1. 「再生」ボタンまたはカードをクリックして一度だけの動きを確認'}
          </span>
        </div>
        {mode === 'preview' && (
          <button
            onClick={handleMainClick}
            disabled={isPlayingPreview}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium shadow transition"
          >
            {isPlayingPreview ? '再生中...' : 'もう一度再生'}
          </button>
        )}
      </div>

      {/* Stage Area */}
      <div className="flex-1 min-h-[320px] bg-zinc-950/80 rounded-xl border border-zinc-800/80 p-8 flex items-center justify-center relative overflow-hidden">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10 w-full max-w-2xl">
          
          {/* Main Card */}
          <div className="flex flex-col items-center">
            <div className="mb-2 text-xs font-semibold text-indigo-400 tracking-wide flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              主役カード (Main)
            </div>
            <div
              role="button"
              tabIndex={0}
              aria-label="主役カード：インタラクティブ変形要素"
              onClick={handleMainClick}
              onKeyDown={handleKeyDown}
              style={{
                transform: mainTransformStyle,
                transition: mainTransition,
              }}
              className={`w-52 h-44 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-900/90 border border-zinc-700/80 p-5 flex flex-col justify-between shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 group select-none ${
                mode === 'hover' ? 'hover:border-indigo-500/80 hover:shadow-indigo-500/10' : ''
              } ${isActive && mode === 'click' ? 'border-indigo-500 shadow-indigo-500/20' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                  UI
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {mode.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                  Interactive Card
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                  ここにマウスホバーまたはクリックで変形が適用されます。
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Transform Lab</span>
                <span className="text-indigo-400 font-medium flex items-center gap-0.5">
                  触って試す <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Companion Card */}
          <div className="flex flex-col items-center">
            <div className="mb-2 text-xs font-semibold text-violet-400 tracking-wide flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-violet-500"></span>
              追従カード (Companion)
            </div>
            <div
              style={{
                transform: compTransformStyle,
                opacity: compOpacityStyle,
                transition: compTransition,
              }}
              className="w-52 h-44 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 p-5 flex flex-col justify-between shadow-xl select-none backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-xs">
                  SUB
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                  Follower
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-300">
                  Companion Card
                </h3>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                  主役の動きに比率と遅延をつけて追従する要素。
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-600">
                <span>Ratio: {companion.ratio * 100}%</span>
                <span>Delay: {companion.delay}s</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
