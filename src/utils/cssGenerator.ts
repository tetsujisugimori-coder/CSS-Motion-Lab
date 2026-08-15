import { TransformState, TransitionState, CompanionState, OperationMode } from '../types';

export function getEasingValue(easing: string, customBezier: string): string {
  if (easing === 'custom') {
    return `cubic-bezier(${customBezier})`;
  }
  return easing;
}

export function generateCSSCode(
  transform: TransformState,
  transition: TransitionState,
  companion: CompanionState,
  mode: OperationMode
): { mainNormal: string; mainActive: string; companionNormal: string; companionActive: string } {
  const easingVal = getEasingValue(transition.easing, transition.customBezier);
  const transitionStr = `transform ${transition.duration}s ${easingVal} ${transition.delay}s`;

  // Main Card normal
  const mainNormal = `.main-card {
  transform: translate(0px, 0px) rotate(0deg) scale(1) skewX(0deg);
  transition: ${transitionStr};
  will-change: transform;
}`;

  // Main Card active/hover depending on mode
  const activeSelector = mode === 'hover' ? '.main-card:hover' : '.main-card.is-active';
  const mainActive = `${activeSelector} {
  transform: translateX(${transform.translateX}px) translateY(${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scale}) skewX(${transform.skewX}deg);
}`;

  // Companion calculations
  const compX = transform.translateX * companion.ratio * (companion.direction === 'reverse' ? -1 : 1);
  const compY = transform.translateY * companion.ratio * (companion.direction === 'reverse' ? -1 : 1);
  const compRot = transform.rotate * companion.ratio * 0.5 * (companion.direction === 'reverse' ? -1 : 1);
  const compScale = 1 + (transform.scale - 1) * companion.ratio * 0.5;

  const compTransitionStr = `transform ${transition.duration}s ${easingVal} ${transition.delay + companion.delay}s, opacity ${transition.duration}s ease`;

  const companionNormal = `.companion-card {
  transform: translate(0px, 0px) rotate(0deg) scale(1);
  opacity: ${companion.opacity};
  transition: ${compTransitionStr};
  will-change: transform, opacity;
}`;

  const companionActiveSelector = mode === 'hover' ? '.main-card:hover ~ .companion-card' : '.main-card.is-active ~ .companion-card';
  const companionActive = `${companionActiveSelector} {
  transform: translateX(${compX.toFixed(1)}px) translateY(${compY.toFixed(1)}px) rotate(${compRot.toFixed(1)}deg) scale(${compScale.toFixed(2)});
  opacity: ${Math.min(1, companion.opacity + 0.15)};
}`;

  return {
    mainNormal,
    mainActive,
    companionNormal,
    companionActive,
  };
}
