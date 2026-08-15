# CSS Motion Lab

「CSS Motion Lab」は、CSSの `transform` と `transition` の仕組みを、実際にスライダーやパラメータを操作しながら視覚的に学べるインタラクティブな教材兼CSSジェネレーターです。

## 目的
初心者やコーダーが「数値を変えるとどう動くのか」「イージングや遅延でどう印象が変わるのか」をリアルタイムで体感し、生成された実用的なCSSコードをそのまま自分の制作物へ持ち帰れるように設計されています。

## 主な機能
1. **プレビューエリア（主役カード & 追従カード）**: 主役の動きに対してもう1つのカードがどう連動するか（比率・遅延・透明度・同方向/逆方向）を視覚的に確認。
2. **操作モード切り替え**: 
   - **Hover**: ペア領域（`.motion-pair`）へのホバーで動作（HTML + CSSのみで完結）。
   - **Click**: 主役カードのクリックやキーボード（Enter / Space）で ON/OFF をトグル（最小限のJavaScript併用）。
   - **Preview**: モード選択時やボタン・カード操作による1回再生（自動再生・再生まわり）。
3. **主役カードの Transform 操作**: `translateX`、`translateY`、`rotate`、`scale`、`skewX` をリアルタイム調整。
4. **Transition & Custom Cubic-Bezier**: 継続時間、遅延時間、各種イージングに加え、カスタム `cubic-bezier(x1, y1, x2, y2)` の入力とリアルタイムバリデーションに対応。
5. **プリセット機能**: 代表的な4つのパターン（Gentle Lift、Press Button、Slide In、Playful Spin）をワンクリックで切り替え。
6. **リアルタイム CSS / HTML / JS 生成**: 各モードに応じた実装コードをタブごとに確認し、コピーボタンで手軽に持ち帰り可能。
7. **解説パネル & 順序比較展示**: 選択中プリセットの解説と現在の調整値の即時表示に加え、`rotate` と `translate` の適用順序による軌道の違いを比較。

## ローカル開発環境のセットアップと実行

本アプリはVite製アプリケーションです。以下の手順でローカル起動・ビルド・リントを実行します。

```bash
# 1. 依存関係のインストール
npm install

# 2. 開発サーバーの起動 (http://localhost:3000)
npm run dev

# 3. 型チェック (Lint) の実行
npm run lint

# 4. プロダクションビルド
npm run build
```

## GitHub Pages への公開手順

1. リポジトリを GitHub にプッシュする。
2. リポジトリの **Settings > Pages** を開く。
3. **Build and deployment** の **Source** を **`GitHub Actions`** に設定する。
4. 設定後、自動で `.github/workflows/deploy-pages.yml` が実行され、数分で `https://<username>.github.io/CSS-Motion-Lab/` から公開されます。

## モードごとの生成コードの仕組み

- **Hover モード**: JavaScriptは不要です。`.motion-pair:hover .main-card` および `.motion-pair:hover .companion-card` のCSSセレクタで完結します。
- **Click モード**: クリックまたはキーボード操作で親要素に `.is-active` クラスを付け外しする数行のJavaScriptが必要です。
- **Preview モード**: 画面読み込み時や再生ボタンのクリックで一時的に `.is-active` を付与し、アニメーション時間経過後に自動で外すスクリプトが含まれます。

## 学べるCSSプロパティ
- `transform: translate(), rotate(), scale(), skew()`
- `transition: property, duration, timing-function, delay`
- `cubic-bezier()` によるイージング曲線

## 制約事項
- 今回は `@keyframes` によるフレームアニメーションや複雑なタイムライン制御、3D transformではなく、実務で最も頻繁に使用される `transform` と `transition` による「1要素の変形」と「2要素の自然な連動」に特化しています。
