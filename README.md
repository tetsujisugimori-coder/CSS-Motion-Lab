# CSS Motion Lab

「CSS Motion Lab」は、CSSの `transform` と `transition` の仕組みを実際にスライダーやパラメータを操作しながら視覚的に学べるインタラクティブな教材兼CSSジェネレーターです。

## 目的
初心者やコーダーが「数値を変えるとどう動くのか」「イージングや遅延でどう印象が変わるのか」をリアルタイムで体感し、生成された実用的なCSSコードをそのまま自分の制作物へ持ち帰れるように設計されています。

## 主な機能
1. **プレビューエリア（主役カード & 追従カード）**: 主役の動きに対してもう1つのカードがどう連動するかを視覚的に確認。
2. **操作モード切り替え**: Hover（マウスホバー）、Click（クリック）、Preview（自動1回再生）を切り替え可能。キーボード操作（Enter / Space）にも対応。
3. **主役カードの Transform 操作**: `translateX`、`translateY`、`rotate`、`scale`、`skewX` をリアルタイム調整。
4. **Transition 操作**: 継続時間、遅延時間、イージング（`ease`, `ease-out`, `linear`, `ease-in-out` 等）およびカスタム `cubic-bezier` の調整。
5. **追従カードの連動設定**: 追従遅延、移動量比率（25%〜100%）、透明度、同方向／逆方向の切り替え。
6. **プリセット機能**: 代表的な4つのパターン（Gentle Lift、Press Button、Slide In、Playful Spin）をワンクリックで切り替え。
7. **リアルタイム CSS 生成**: コピーボタン付きでそのまま使える整形済みCSSを表示。
8. **解説パネル**: 現在の設定の使いどころや「やりすぎの注意点」を解説。
9. **Transform 順序比較展示**: `rotate` と `translate` の適用順序による軌道の違いを左右比較で直感的に理解。

## ローカルで開く方法
このリポジトリをクローンまたはダウンロードし、ブラウザで `index.html` を開くだけで動作します（Viteなどの開発サーバーでも動作します）。

```bash
# 依存関係のインストールと開発サーバー起動
npm install
npm run dev
```

## GitHub Pages で公開する場合の手順
1. リポジトリを GitHub にプッシュする。
2. リポジトリの **Settings > Pages** を開く。
3. Build and deployment の Source を `Deploy from a branch` (main / root) に設定して保存する。
4. 数分後に発行される URL からアクセス可能になります。

## 学べるCSSプロパティ
- `transform: translate(), rotate(), scale(), skew()`
- `transition: property, duration, timing-function, delay`
- `cubic-bezier()` によるイージング曲線

## なぜ transform と transition を主題にしたか
複雑なアニメーションライブラリや `@keyframes` のキーフレームアニメーションは強力ですが、日々のUIデザインにおいて「ボタンやカードの自然な浮き上がり」「滑らかなホバー効果」「要素の心地よい連動」の9割は `transform` と `transition` の組み合わせで美しく実現できます。基礎となる単体要素の変形と連動の仕組みをマスターすることで、軽量かつパフォーマンスの高いUIアニメーションを作ることができます。
