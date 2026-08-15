import React, { useState } from 'react';
import { Copy, Check, Terminal, Code, FileCode } from 'lucide-react';
import { TransformState, TransitionState, CompanionState, OperationMode } from '../types';
import { generateCodePackage } from '../utils/motionModel';

interface CodePanelProps {
  transform: TransformState;
  transition: TransitionState;
  companion: CompanionState;
  mode: OperationMode;
}

export const CodePanel: React.FC<CodePanelProps> = ({ transform, transition, companion, mode }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'html' | 'css' | 'js'>('all');

  const pkg = generateCodePackage(transform, transition, companion, mode);

  const fullSnippet = `<!-- 1. HTML 構造 -->
${pkg.html}

<!-- 2. CSS スタイル -->
<style>
${pkg.css}
</style>

${
  pkg.js
    ? `<!-- 3. JavaScript インタラクション -->
<script>
${pkg.js}
</script>`
    : ''
}`;

  const handleCopy = () => {
    let contentToCopy = fullSnippet;
    if (activeTab === 'html') contentToCopy = pkg.html;
    if (activeTab === 'css') contentToCopy = pkg.css;
    if (activeTab === 'js') contentToCopy = pkg.js || '// このモードではJavaScriptは不要です';

    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-950/60 gap-3">
        <div>
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            生成されたCSS / HTML / JS コード
          </h3>
          <p className="text-[11px] text-zinc-400">このまま貼り付けて試せる実践的なコード例</p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-md transition ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              一括
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`px-2.5 py-1 rounded-md transition ${activeTab === 'html' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              HTML
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-2.5 py-1 rounded-md transition ${activeTab === 'css' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              CSS
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`px-2.5 py-1 rounded-md transition ${activeTab === 'js' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              JS
            </button>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
              copied
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>コピー完了</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>コードをコピー</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 bg-zinc-950 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[320px] leading-relaxed">
        <pre className="whitespace-pre">
          {activeTab === 'all' && fullSnippet}
          {activeTab === 'html' && pkg.html}
          {activeTab === 'css' && pkg.css}
          {activeTab === 'js' && (pkg.js || '// このモードではJavaScriptは不要です')}
        </pre>
      </div>
    </div>
  );
};
