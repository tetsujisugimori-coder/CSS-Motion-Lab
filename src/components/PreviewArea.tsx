import React, { useState, useEffect, useRef } from 'react';
import { MousePointer, Hand, Play, Layers, ArrowRight, Info } from 'lucide-react';
import { OperationMode, TransformState, TransitionState, CompanionState } from '../types';
import { computeMotion, getEasingValue } from '../utils/motionModel';
import { useReducedMotion } from '../hooks/useReducedMotion';

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
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mode切り替え時にクリック状態やプレビュー状態をリセット
  useEffect(() => {
    setIsClicked(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (mode === 'preview' && !reducedMotion) {
      triggerPreviewCycle();
    } else {
      setIsPlayingPreview(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mode, reducedMotion]);

  // 設定変更時もプレビューの再生状態が競合しないように制御
  useEffect(() => {
    if (mode === 'preview' && !reducedMotion) {
      triggerPreviewCycle();
    }
  }, [transform, transition, companion]);

  const triggerPreviewCycle = () => {
    if (reducedMotion) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    setIsPlayingPreview(false);
    // 次のフレームで再トリガーして確実にアニメーションをリセット
    const t1 = setTimeout(() => {
      setIsPlayingPreview(true);
      const totalTimeMs =
        (transition.duration + Math.max(transition.delay, transition.delay + companion.delay) + 0.4) *
        1000;

      timerRef.current = setTimeout(() => {
        setIsPlayingPreview(false);
      }, totalTimeMs);
    }, 20);

    return () => clearTimeout(t1);
  };

  const handleMainClick = () => {
    if (mode === 'click') {
      setIsClicked((prev) => !prev);
    } else if (mode === 'preview' && !reducedMotion) {
      triggerPreviewCycle();
    }
  };

  const computed = computeMotion(transform, transition, companion);
  const easingVal = getEasingValue(transition);
  const effDuration = reducedMotion ? 0.01 : transition.duration;
  const mainTransition = `transform ${effDuration}s ${easingVal} ${transition.delay}s`;
  const compTransition = `transform ${effDuration}s ${easingVal} ${
    transition.delay + companion.delay
  }s, opacity ${effDuration}s ease`;

  // アクティブ判定
  const isActive =
    mode === 'hover' ? isHovered : mode === 'click' ? isClicked : isPlayingPreview;

  const mainTransformStyle = isActive
    ? `translateX(${transform.translateX}px) translateY(${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scale}) skewX(${transform.skewX}deg)`
    : 'translateX(0px) translateY(0px) rotate(0deg) scale(1) skewX(0deg)';

  const compTransformStyle = isActive
    ? `translateX(${computed.compX}px) translateY(${computed.compY}px) rotate(${computed.compRot}deg) scale(${computed.compScale})`
    : 'translateX(0px) translateY(0px) rotate(0deg) scale(1)';

  const compOpacityStyle = isActive ? Math.min(1, companion.opacity + 0.15) : companion.opacity;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-xl">
      {/* Top Bar: Mode switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            ライブプレビュー展示室
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">主役と追従カードの連動をリアルタイムで確認</p>
        </div>

        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => onChangeMode('hover')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'hover' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>Hover</span>
          </button>
          <button
            onClick={() => onChangeMode('click')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'click' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Click</span>
          </button>
          <button
            onClick={() => onChangeMode('preview')}
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
      <div className="mb-6 bg-indigo-950/30 border border-indigo-500/20 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-indigo-200">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0"></span>
          <span>
            {mode === 'hover' && '1. カードペア領域にマウスを乗せる（Hover）　2. 左の値を変える　3. 下部からCSSをコピー'}
            {mode === 'click' && '1. 主役カードをクリック（またはEnter/Space）して状態をトグル'}
            {mode === 'preview' && '1. 「もう一度再生」またはカードをクリックしてアニメーションを確認'}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {mode === 'hover' && (
            <span className="text-[11px] text-amber-300 flex items-center gap-1.5 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <Info className="w-3.5 h-3.5 shrink-0" /> Hoverモードはマウス操作向けです。ClickまたはPreviewを使ってください
            </span>
          )}
          {mode === 'preview' && !reducedMotion && (
            <button
              onClick={triggerPreviewCycle}
              disabled={isPlayingPreview}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium shadow transition"
            >
              {isPlayingPreview ? '再生中...' : 'もう一度再生'}
            </button>
          )}
        </div>
      </div>

      {/* Stage Area with .motion-pair */}
      <div className="flex-1 min-h-[340px] bg-zinc-950/80 rounded-xl border border-zinc-800/80 p-8 flex items-center justify-center relative overflow-hidden">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

        <div
          className="motion-pair flex flex-col md:flex-row items-center justify-center gap-8 relative z-10 w-full max-w-2xl cursor-pointer"
          onMouseEnter={() => {
            if (mode === 'hover') setIsHovered(true);
          }}
          onMouseLeave={() => {
            if (mode === 'hover') setIsHovered(false);
          }}
        >
          {/* Main Card */}
          <div className="flex flex-col items-center">
            <div className="mb-2 text-xs font-semibold text-indigo-400 tracking-wide flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              主役カード (Main)
            </div>
            <button
              type="button"
              onClick={handleMainClick}
              style={{
                transform: mainTransformStyle,
                transition: mainTransition,
              }}
              className={`main-card w-52 h-44 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-900/90 border border-zinc-700/80 p-5 flex flex-col justify-between shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left group select-none ${
                isActive && mode === 'click' ? 'border-indigo-500 shadow-indigo-500/20' : ''
              }`}
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
                <span className="text-sm font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors block">
                  Main Card
                </span>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                  ペア領域のホバーやクリックで変形します。
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Motion Lab</span>
                <span className="text-indigo-400 font-medium flex items-center gap-0.5">
                  操作可能 <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
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
              className="companion-card w-52 h-44 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 p-5 flex flex-col justify-between shadow-xl select-none backdrop-blur-sm"
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
                <span className="text-sm font-bold text-zinc-300 block">
                  Companion Card
                </span>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                  主役の動きに比率と遅延をつけて連動する要素。
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
