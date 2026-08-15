import React, { useState } from 'react';
import { Copy, Check, Code2, Terminal } from 'lucide-react';
import { TransformState, TransitionState, CompanionState, OperationMode } from '../types';
import { generateCSSCode } from '../utils/cssGenerator';

interface CodePanelProps {
  transform: TransformState;
  transition: TransitionState;
  companion: CompanionState;
  mode: OperationMode;
}

export const CodePanel: React.FC<CodePanelProps> = ({ transform, transition, companion, mode }) => {
  const [copied, setCopied] = useState(false);

  const css = generateCSSCode(transform, transition, companion, mode);

  const fullCode = `/* === 主役カード (Main Card) === */
${css.mainNormal}

${css.mainActive}

/* === 追従カード (Companion Card) === */
${css.companionNormal}

${css.companionActive}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-950/60">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          生成されたCSSコード
        </h3>
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            copied
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>コピーしました！</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>CSSをコピー</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 bg-zinc-950 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[300px] leading-relaxed">
        <pre className="whitespace-pre">{fullCode}</pre>
      </div>
    </div>
  );
};
