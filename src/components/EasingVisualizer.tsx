import React from 'react';
import { TransitionState } from '../types';
import { parseAndValidateCubicBezier } from '../utils/motionModel';

interface EasingVisualizerProps {
  transition: TransitionState;
}

export const EasingVisualizer: React.FC<EasingVisualizerProps> = ({ transition }) => {
  let p: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0]; // default ease
  if (transition.easing === 'ease') p = [0.25, 0.1, 0.25, 1.0];
  else if (transition.easing === 'ease-in') p = [0.42, 0, 1.0, 1.0];
  else if (transition.easing === 'ease-out') p = [0, 0, 0.58, 1.0];
  else if (transition.easing === 'ease-in-out') p = [0.42, 0, 0.58, 1.0];
  else if (transition.easing === 'linear') p = [0, 0, 1.0, 1.0];
  else if (transition.easing.startsWith('cubic-bezier')) {
    const match = transition.easing.match(/\(([^)]+)\)/);
    if (match) {
      const vals = match[1].split(',').map((v) => parseFloat(v.trim()));
      if (vals.length === 4 && vals.every((v) => !isNaN(v))) {
        p = [vals[0], vals[1], vals[2], vals[3]];
      }
    }
  } else if (transition.easing === 'custom') {
    const check = parseAndValidateCubicBezier(transition.customBezier);
    if (check.isValid) {
      p = check.values;
    }
  }

  // Easing descriptive explanation
  let desc = 'なめらかな加減速（標準的なイージング）';
  if (transition.easing === 'ease-in') desc = '徐々に加速して発進（重みのある起動）';
  else if (transition.easing === 'ease-out') desc = '到着時にゆっくり減速・停止（自然な着地）';
  else if (transition.easing === 'ease-in-out') desc = '始まりも終わりもなめらか（バランス重視）';
  else if (transition.easing === 'linear') desc = '一定速度で移動（機械的・等速運動）';
  else if (transition.easing.includes('0.16, 1') || transition.easing.includes('0.34, 1.56'))
    desc = 'エレガントなバウンス感・躍動感';
  else if (transition.easing === 'custom') desc = 'カスタムCubic-Bezier曲線による独自の挙動';

  // SVG coordinates mapping (0..1 time to 0..200 px, progress to 0..200 px inverted)
  // Support overshoot y values (e.g., -0.2 to 1.3)
  const [x1, y1, x2, y2] = p;

  // Cubic bezier path: M 0 200 C x1_px inv_y1_px, x2_px inv_y2_px, 200 0
  const width = 200;
  const height = 200;
  const cx1 = x1 * width;
  const cy1 = height - y1 * height;
  const cx2 = x2 * width;
  const cy2 = height - y2 * height;

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          イージング曲線ビジュアライザ
        </h4>
        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
          {transition.easing === 'custom' ? `cubic-bezier(${p.join(', ')})` : transition.easing}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* SVG Graph */}
        <div className="w-36 h-36 bg-zinc-900 rounded-xl border border-zinc-800 relative flex items-center justify-center p-2 shrink-0 shadow-inner">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
            {/* Grid lines */}
            <line x1="0" y1="0" x2="200" y2="0" stroke="#27272a" strokeWidth="1" />
            <line x1="0" y1="100" x2="200" y2="100" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="200" x2="200" y2="200" stroke="#27272a" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="200" stroke="#27272a" strokeWidth="1" />
            <line x1="200" y1="0" x2="200" y2="200" stroke="#27272a" strokeWidth="1" />

            {/* Linear reference diagonal */}
            <line x1="0" y1="200" x2="200" y2="0" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 4" />

            {/* Bezier curve path */}
            <path
              d={`M 0 200 C ${cx1} ${cy1}, ${cx2} ${cy2}, 200 0`}
              fill="none"
              stroke="#818cf8"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Control points handles */}
            <line x1="0" y1="200" x2={cx1} y2={cy1} stroke="#6366f1" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="200" y1="0" x2={cx2} y2={cy2} stroke="#6366f1" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx={cx1} cy={cy1} r="4" fill="#a5b4fc" />
            <circle cx={cx2} cy={cy2} r="4" fill="#a5b4fc" />
          </svg>
        </div>

        {/* Explanation text */}
        <div className="space-y-2 flex-1 text-xs">
          <div className="bg-zinc-900/90 p-3 rounded-lg border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block mb-0.5 font-mono">特性インプレッション</span>
            <p className="text-zinc-200 font-medium leading-relaxed">{desc}</p>
          </div>
          <div className="text-[11px] text-zinc-400 space-y-1 font-mono">
            <div>• 横軸: 時間の経過 (0% → 100%)</div>
            <div>• 縦軸: 変化の進行度 (0 → 到達)</div>
            {y1 < 0 || y2 > 1 ? (
              <div className="text-amber-400 text-[10px]">※ オーバーシュート（跳ね返り）を含む曲線です</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
