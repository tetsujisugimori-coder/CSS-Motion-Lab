import React, { useState } from 'react';
import { ArrowRightLeft, Play, RotateCcw, HelpCircle } from 'lucide-react';

export const TransformOrderComparison: React.FC = () => {
  const [isTriggered, setIsTriggered] = useState(false);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Transform 順序の比較展示
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsTriggered(!isTriggered)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition shadow-sm"
          >
            <Play className="w-3 h-3" />
            <span>{isTriggered ? '元に戻す' : '比較アニメーション再生'}</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed">
        同じ数値（回転 45°、平行移動 60px）であっても、記述する<strong>順序</strong>によって座標軸ごと回転するか、先に移動してから回転するかが変わり、軌道が大きく異なります。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Pattern A: Rotate then Translate */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-between min-h-[220px] relative overflow-hidden">
          <div className="absolute top-3 left-3 text-[10px] font-mono text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-500/30">
            rotate(45deg) translateX(60px)
          </div>

          <div className="flex-1 flex items-center justify-center w-full my-6">
            <div
              style={{
                transform: isTriggered ? 'rotate(45deg) translateX(60px)' : 'rotate(0deg) translateX(0px)',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg flex items-center justify-center text-white text-xs font-bold select-none"
            >
              Rotate 1st
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 text-center">
            <strong>回転してから移動</strong>：斜め方向へ飛び出すような軌道になります。
          </p>
        </div>

        {/* Pattern B: Translate then Rotate */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-between min-h-[220px] relative overflow-hidden">
          <div className="absolute top-3 left-3 text-[10px] font-mono text-violet-400 bg-violet-950/50 px-2 py-0.5 rounded border border-violet-500/30">
            translateX(60px) rotate(45deg)
          </div>

          <div className="flex-1 flex items-center justify-center w-full my-6">
            <div
              style={{
                transform: isTriggered ? 'translateX(60px) rotate(45deg)' : 'translateX(0px) rotate(0deg)',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg flex items-center justify-center text-white text-xs font-bold select-none"
            >
              Translate 1st
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 text-center">
            <strong>移動してから回転</strong>：その場で平行移動した後に自己回転します。
          </p>
        </div>
      </div>
    </div>
  );
};
