export type OperationMode = 'hover' | 'click' | 'preview';

export type PresetId = 'gentle-lift' | 'press-button' | 'slide-in' | 'playful-spin';

export interface TransformState {
  translateX: number; // px
  translateY: number; // px
  rotate: number;     // deg
  scale: number;      // factor
  skewX: number;      // deg
}

export interface TransitionState {
  duration: number;   // s
  delay: number;      // s
  easing: string;     // ease, ease-in, ease-out, ease-in-out, linear, custom
  customBezier: string; // e.g., "0.34, 1.56, 0.64, 1"
}

export interface CompanionState {
  delay: number;      // s
  ratio: number;      // 0.25, 0.5, 0.75, 1.0
  opacity: number;    // 0 to 1
  direction: 'same' | 'reverse'; // 同方向 or 逆方向
}

export interface PresetConfig {
  id: PresetId;
  name: string;
  subtitle: string;
  description: string;
  useCase: string;
  pitfall: string;
  transform: TransformState;
  transition: TransitionState;
  companion: CompanionState;
  mode: OperationMode;
}
