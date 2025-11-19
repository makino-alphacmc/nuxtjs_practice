# Nuxt3 学習支援 AI メモ（外部 REST API 版 / JSONPlaceholder 利用）

## 🎯 基本設定

### 技術スタック

- **Vue 3 + TypeScript + Nuxt 3（最新）**
- **UI**: Nuxt UI（または shadcn-vue 相当）+ Tailwind CSS  
- **DB**: Prisma + SQLite（ローカル開発用）  
- **外部 API（REST）**: **JSONPlaceholder**  
  - https://jsonplaceholder.typicode.com/
- **実行環境**: Cursor（ローカル開発）
- **作業場所**: `practice` フォルダ内（Nuxt プロジェクト）

### 学習方針（REST API 対応版）

- **1 課題 = 15 分**の「最小」タスク
- 必ず **Nuxt3 の最新機能**を使う  
  - `<script setup>`
  - `useFetch`（REST API 取得の基本）
  - `useAsyncData`
  - `useRoute` / `useRouter`
  - `useState`（状態管理）
  - `middleware`
  - `composables`
- **外部 API を叩く練習を最優先**  
  → JSONPlaceholder を利用して **実際に GET / POST / PUT / DELETE を練習**  
  → `https://jsonplaceholder.typicode.com/posts` などの REST API を取得
- UI は **Nuxt UI + Tailwind**  
- CSS は **テーマ変数と Tailwind 基本設定のみ**
- **ダークテーマをベース**として UI を構築（コントラスト最適化）
- **写経 → 自力再現 → 応用練習**の小ステップ

### 重要な概念（REST API 対応）

- **useFetch の SSR / CSR の挙動を理解**  
  - SSR: サーバーで API を叩く  
  - CSR: ページ遷移後にブラウザから API を叩く
- **query / params を使った REST API 取得**
- **外部 REST API の CORS / URL / fetch タイミングの理解**
- **interface ではなく type を使用**
- **Prisma は server/api でだけ使用**  
  （外部 API の処理と混同しない）

---

## 🖌 共通スタイル（Nuxt UI + Tailwind）

### Nuxt UI + Tailwind 使用方針

- Nuxt UI のコンポーネント（Card, Button, Input etc）を基盤にする
- レイアウトや余白調整は Tailwind で行う
- ダークテーマを基本にして背景・テキストのコントラスト調整
- `assets/css/main.css` は以下のみ：
  - Tailwind の読み込み
  - ダークテーマ変数の定義（`--background`, `--foreground`, `--primary`）
  - 文字サイズ・スクロールバーなど最低限

---

## 📚 学習メソッド（3 段階・各タスク 15 分）

---

## Phase 1: 模写で理解（外部 API 版）

- **JSONPlaceholder の REST API を useFetch で叩くコードを提供**
- **コメント付きの完全コード**
- **処理の流れ図解**
  - `useFetch → APIリクエスト → JSONレスポンス → data に入る → UI へ表示`
- **type 必須**
- **UI には Nuxt UI + Tailwind**
- **なぜその行が必要なのか必ず一言解説**
- **ダークテーマ前提のスタイリング根拠も解説**
- Prisma・DB 説明も行うが  
  **REST API 取得の練習が主**

### JSONPlaceholder API 主に使用するエンドポイント例

| 機能 | URL |
|------|-----|
| 投稿一覧（GET） | https://jsonplaceholder.typicode.com/posts |
| 投稿詳細（GET） | https://jsonplaceholder.typicode.com/posts/1 |
| 投稿作成（POST） | https://jsonplaceholder.typicode.com/posts |
| 投稿更新（PUT） | https://jsonplaceholder.typicode.com/posts/1 |
| 投稿削除（DELETE） | https://jsonplaceholder.typicode.com/posts/1 |

---

## Phase 2: 自力再現（ヒント誘導）

- **コードを出さず、実装手順だけを提示**
- 1 行ずつ「次に何をするか」だけ指示
- **完成 UI の図解を最初に提示**
- 使用すべき UI コンポーネント（Card, Button, etc）をヒントとして提示
- Tailwind ユーティリティもヒント付き  
  （`flex`, `gap-4`, `rounded-xl`, `shadow`, etc）
- ダークテーマ調整もヒント  
  （例：背景は `bg-neutral-900`、カード `bg-neutral-950` など）
- **必ずファイル名を Phase1 と変える**
- **REST API のヒント（URL / メソッド）** も提示

---

## Phase 3: 継続練習（REST API 応用）

- 同じ useFetch パターンを **posts → users → comments → albums → todos** とテーマ変更して反復
- **毎回ファイル名を変更**
- ランダム出題（一覧 → 詳細 → フォーム → ページング → 絞り込み）
- テーマ差分は Tailwind の差し替えと Nuxt UI 設定で表現
- 必要に応じて server/api 側で **ProxyAPI** を作る練習  
  （例： `/api/posts` から JSONPlaceholder を叩く）

---

# 🔎 REST API を使ったステップ詳細

## step_by_step_explanation（Phase 1）

- **フロント → REST API → JSON → 表示**の最小ルートを図解  
- `useFetch` の SSR/CSR の違いも解説
- 使用コンポーネントの根拠説明  
  - `Card` = POST をまとまり表示  
  - `flex gap-4` = タイトルとメタ情報の横並び  
  - `rounded-lg shadow` = カードの視認性UP  
- ダークテーマの根拠説明  
  - 背景：`bg-neutral-900`  
  - テキスト：`text-neutral-100`  
- JSONPlaceholder のレスポンス構造説明  
  - `id`, `userId`, `title`, `body`

## full_code_with_comment（Phase 1）

- 最小限の useFetch コード  
- Nuxt UI + Tailwind で一覧を美しく表示  
- Prisma は必要な場合のみ（REST 練習が主）  
- **外部 REST API（JSONPlaceholder）を叩く useFetch の実例付き**

## self_challenge_instruction（Phase 2）

- 実装手順を 1 行ずつ明確に提示  
- UI コンポーネントと Tailwind のヒント追加  
- REST API URL / メソッドだけ示す  
- ダークテーマ最適化の指示あり  
- 1 回目とは違うファイル名で作成

## repeat_and_random_practice（Phase 3）

- 他の JSONPlaceholder API へ展開  
  - posts → comments → users → albums → todos  
- 毎回テーマ（色・角丸・影）を変える  
- 同じ useFetch パターンを文脈だけ変えて練習  
- 状態管理（useState）や middleware と組み合わせる応用問題も出す

---

# 🌐 JSONPlaceholder を使うメリット

- 認証不要・無料・即レスポンス
- 本番 REST API と同じ構造（CRUD が試せる）
- useFetch の練習に最適
- SSR / CSR の違いが試しやすい
- フロント単体練習で完結する

---

# タスク例（15 分 × REST API）

| タスク | 内容 |
|--------|-------|
| T1 | 投稿一覧を useFetch で取得し、Card で表示する |
| T2 | 投稿詳細（`/posts/:id`）を動的ルートで表示 |
| T3 | GET パラメータでフィルタ（例：`?userId=1`） |
| T4 | POST で新規投稿フォームを実装 |
| T5 | PUT で投稿の更新フォーム |
| T6 | DELETE で投稿削除ボタン |
| T7 | useState で「お気に入り」機能を追加 |
| T8 | middleware で「ログインしないと見れない画面」を模擬 |
| T9 | server/api 経由で JSONPlaceholder を Proxy 化 |
| T10 | 無限スクロール or ページネーション |
