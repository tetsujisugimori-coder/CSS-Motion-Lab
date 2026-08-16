import { TransformState, TransitionState, CompanionState, OperationMode } from '../types';

export interface CubicBezierValidation {
  isValid: boolean;
  error?: string;
  values: [number, number, number, number];
}

export function parseAndValidateCubicBezier(bezierStr: string): CubicBezierValidation {
  const parts = bezierStr.split(',').map((p) => Number(p.trim()));
  if (parts.length !== 4 || parts.some((p) => !Number.isFinite(p))) {
    return {
      isValid: false,
      error: 'カンマ区切りの4つの有限数値を入力してください（例: 0.16, 1, 0.3, 1）',
      values: [0.16, 1, 0.3, 1],
    };
  }

  const [x1, y1, x2, y2] = parts;
  if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) {
    return {
      isValid: false,
      error: 'X座標（第1・第3引数）は 0.0 から 1.0 の範囲内である必要があります',
      values: [x1, y1, x2, y2],
    };
  }

  return {
    isValid: true,
    values: [x1, y1, x2, y2],
  };
}

export function getEasingValue(transition: TransitionState): string {
  if (transition.easing === 'custom') {
    const val = parseAndValidateCubicBezier(transition.customBezier);
    if (val.isValid) {
      return `cubic-bezier(${val.values.join(', ')})`;
    }
    return 'ease'; // fallback
  }
  return transition.easing;
}

export interface ComputedMotion {
  compX: number;
  compY: number;
  compRot: number;
  compScale: number;
  compOpacity: number;
  easingVal: string;
}

export function computeMotion(
  transform: TransformState,
  transition: TransitionState,
  companion: CompanionState
): ComputedMotion {
  const easingVal = getEasingValue(transition);
  const compX = transform.translateX * companion.ratio * (companion.direction === 'reverse' ? -1 : 1);
  const compY = transform.translateY * companion.ratio * (companion.direction === 'reverse' ? -1 : 1);
  const compRot = transform.rotate * companion.ratio * 0.5 * (companion.direction === 'reverse' ? -1 : 1);
  const compScale = 1 + (transform.scale - 1) * companion.ratio * 0.5;

  return {
    compX,
    compY,
    compRot,
    compScale,
    compOpacity: companion.opacity,
    easingVal,
  };
}

export interface GeneratedCodePackage {
  html: string;
  css: string;
  js: string;
}

export function generateCodePackage(
  transform: TransformState,
  transition: TransitionState,
  companion: CompanionState,
  mode: OperationMode
): GeneratedCodePackage {
  const computed = computeMotion(transform, transition, companion);
  const mainTrans = `transform ${transition.duration}s ${computed.easingVal} ${transition.delay}s`;
  const compTrans = `transform ${transition.duration}s ${computed.easingVal} ${transition.delay + companion.delay}s, opacity ${transition.duration}s ease`;

  const html = `<div class="motion-pair">
  <button class="main-card" type="button">
    <span class="card-title">Main Card</span>
    <span class="card-desc">ホバーまたはクリックで連動します</span>
  </button>
  <div class="companion-card">
    <span class="card-title">Companion</span>
    <span class="card-desc">比率と遅延で追従する要素</span>
  </div>
</div>`;

  let cssSelectorMainActive = '';
  let cssSelectorCompActive = '';

  if (mode === 'hover') {
    cssSelectorMainActive = '.motion-pair:hover .main-card';
    cssSelectorCompActive = '.motion-pair:hover .companion-card';
  } else {
    cssSelectorMainActive = '.motion-pair.is-active .main-card';
    cssSelectorCompActive = '.motion-pair.is-active .companion-card';
  }

  const css = `/* 1. ベースレイアウト */
.motion-pair {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* 2. 主役カード（通常状態）
   - transform: 通常状態の見た目（原点）
   - transition: 到着点までの「時間・速度・待ち時間」の設計
     property (transform) / duration (${transition.duration}s) / timing-function (${computed.easingVal}) / delay (${transition.delay}s) */
.main-card {
  width: 210px;
  height: 170px;
  border-radius: 1rem;
  background: #18181b;
  border: 1px solid #27272a;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  text-align: left;
  color: #f4f4f5;
  transform: translate(0px, 0px) rotate(0deg) scale(1) skewX(0deg);
  transition: ${mainTrans};
  will-change: transform;
}

/* 3. 主役カード（アクティブ状態／変形の到着点）
   - transform: 「どこへ・どんな形へ変えるか」の到着点を指定 */
${cssSelectorMainActive} {
  transform: translateX(${transform.translateX}px) translateY(${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scale}) skewX(${transform.skewX}deg);
}

/* 4. 追従カード（通常状態） */
.companion-card {
  width: 210px;
  height: 170px;
  border-radius: 1rem;
  background: rgba(24, 24, 27, 0.7);
  border: 1px solid rgba(39, 39, 42, 0.8);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: ${companion.opacity};
  transform: translate(0px, 0px) rotate(0deg) scale(1);
  transition: ${compTrans};
  will-change: transform, opacity;
}

/* 5. 追従カード（アクティブ状態） */
${cssSelectorCompActive} {
  transform: translateX(${computed.compX.toFixed(1)}px) translateY(${computed.compY.toFixed(1)}px) rotate(${computed.compRot.toFixed(1)}deg) scale(${computed.compScale.toFixed(2)});
  opacity: ${Math.min(1, companion.opacity + 0.15)};
}

/* 6. アクセシビリティ：モーション軽減設定への配慮 */
@media (prefers-reduced-motion: reduce) {
  .main-card,
  .companion-card {
    transition-duration: 0.01s !important;
    transition-delay: 0s !important;
    animation-duration: 0.01s !important;
    animation-delay: 0s !important;
  }
}`;

  let js = '';
  if (mode === 'click') {
    js = `// Click モード: ユーザーのクリック（またはボタンの標準イベント）で状態クラスをトグル
const motionPair = document.querySelector('.motion-pair');
const mainCard = motionPair.querySelector('.main-card');

mainCard.addEventListener('click', () => {
  motionPair.classList.toggle('is-active');
});`;
  } else if (mode === 'preview') {
    const totalTimeMs = (transition.duration + Math.max(transition.delay, transition.delay + companion.delay) + 0.4) * 1000;
    js = `// Preview モード: 状態の変化を自動再生・再トリガーする仕組み
const motionPair = document.querySelector('.motion-pair');
const mainCard = motionPair.querySelector('.main-card');
let timerId = null;
let rafId = null;

function playPreview() {
  // 再生をやり直すときは、古いtimerと描画予約(requestAnimationFrame)を解除する
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  motionPair.classList.remove('is-active');
  
  // 次のフレームでクラスを再付与して確実にアニメーションを最初から再生
  rafId = requestAnimationFrame(() => {
    motionPair.classList.add('is-active');
    timerId = setTimeout(() => {
      motionPair.classList.remove('is-active');
      timerId = null;
    }, ${Math.round(totalTimeMs)});
  });
}

window.addEventListener('DOMContentLoaded', () => {
  playPreview();
});

mainCard.addEventListener('click', playPreview);`;
  } else {
    js = `// Hover モード: CSSの :hover 疑似クラスにより、マウスオーバーで自動的にトリガーされます。`;
  }

  return { html, css, js };
}
