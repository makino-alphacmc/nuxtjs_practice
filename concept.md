============================================================
🎯 基本設定
============================================================
技術スタック:

- Nuxt 3 + Vue 3 + TypeScript
- UI: Nuxt UI（または shadcn-vue 相当）+ Tailwind CSS
- 外部 REST API: JSONPlaceholder（これだけ使用）
  https://jsonplaceholder.typicode.com/
- 実行環境: Cursor
- 作業フォルダ: nuxtjs_practice（Nuxt プロジェクト）

制約（重要）:

- server/api（自作 API）は使わない
- Prisma / DB を使わない
- 外部 API（JSONPlaceholder）だけで CRUD も練習する
- 全部フロントで完結する学習フローにする

============================================================
📌 Nuxt で使う基本機能（外部 API 学習に必要なものだけ）
============================================================

- <script setup>
- useFetch / useAsyncData（API 取得）
- useRoute / useRouter（ルーティング）
- useState（簡易グローバル状態）
- composables（共通処理）
- middleware（認証ガードなど）
- Tailwind CSS（UI 調整）
- Nuxt UI（Card / Button / Input / Textarea）

============================================================
🏗️ 実務で必須の 4 つの概念
============================================================

## 1. 型定義の明確化（`any` の使用を減らす）

**目的:**

- 実行時エラーを防ぐ
- IDE の補完機能を活用する
- チーム開発でデータ構造を明確にする

**実装内容:**

- `types/async-await/p1/api.ts` に型定義を作成
- `Post` インターフェースを定義
- `useFetch<Post[]>` のように型を指定して使用

**メリット:**

- ✅ タイポをコンパイル時に検出できる
- ✅ IDE が自動補完してくれる
- ✅ リファクタリングが安全にできる

---

## 2. コンポーネントの分割（再利用性・保守性向上）

**目的:**

- ファイルの肥大化を防ぐ
- UI コンポーネントの再利用性を向上させる
- 保守性を向上させる

**実装内容:**

- `components/async-await/p1/PostList.vue` に投稿一覧コンポーネントを作成
- 親コンポーネントから props でデータを受け取る
- 単一責任の原則に従って分割

**メリット:**

- ✅ 複数のページで同じ UI を使える
- ✅ 変更が一箇所で済む
- ✅ ファイルが小さくなり、理解しやすくなる
- ✅ コンポーネント単位でテストできる

---

## 3. ロジックの分離（Composables の活用）

**目的:**

- コードの重複を防ぐ
- ロジックのテストを容易にする
- 変更を一箇所に集約する

**実装内容:**

- `composables/async-await/p1/usePosts.ts` に composable を作成
- `useFetch` を使ったデータ取得ロジックを分離
- 関連する関数（`getPostById`、`getPostsByUserId` など）も含める

**メリット:**

- ✅ 複数のページで同じロジックを使える
- ✅ ロジックだけをテストできる
- ✅ 変更が一箇所で済む
- ✅ コンポーネントがシンプルになる

---

## 4. 明示的なインポート（トラブル回避）

**目的:**

- 自動インポートの不具合を避ける
- 依存関係を明確にする
- コードの可読性・保守性を向上させる

**実装内容:**

- Composables は深い階層（`composables/async-await/p1/`）では自動インポートが機能しないため、明示的にインポート
- Components も同様に、深い階層では明示的にインポート
- 型定義は常に明示的にインポート

**実装例:**

```typescript
// Composables を明示的にインポート
import { usePosts } from '~/composables/async-await/p1/usePosts'
import { useUser } from '~/composables/async-await/p1/useUser'

// Components を明示的にインポート
import PostList from '~/components/async-await/p1/PostList.vue'
import UserInfo from '~/components/async-await/p1/UserInfo.vue'

// 型定義を明示的にインポート
import type { Post, User } from '~/types/async-await/p1/api'
```

**メリット:**

- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全
- ✅ チーム開発で混乱を避けられる

**注意事項:**

- Nuxt 3 の組み込み関数（`useFetch`, `useRoute`, `useRouter`など）は自動インポートで問題なし
- `components/`の直下のコンポーネントは自動インポートが機能するが、深い階層では機能しないことがある
- `composables/`の直下の composables は自動インポートが機能するが、深い階層では機能しないことがある

============================================================
🎨 UI / CSS 方針（共通）
============================================================
Nuxt UI をベースに、Tailwind でレイアウトを作る。

よく使う Tailwind:
flex / grid / gap-4 / p-4
rounded-xl / shadow
w-full / max-w-2xl / mx-auto

ダークテーマ基準:

- 背景: bg-neutral-900
- カード: bg-neutral-950
- テキスト: text-neutral-100

assets/css/main.css:

- Tailwind の読み込み
- ダークテーマ用 CSS 変数:
  --background
  --foreground
  --primary
- 最低限の共通スタイルのみ

============================================================
📚 学習フェーズ（3 ステップ固定）
============================================================

---

## Phase 1：サンプルで理解（AI がコードを書く）

目的:
AI がフルコードを提供 → あなたは動かして理解する

AI がやること:

- 1 ファイル完結の Nuxt ページを作成
- npm run dev で即動く
- 1 行ずつ丁寧に説明
- 必ず JSONPlaceholder を使った例にする

サンプル候補:

1. 投稿一覧（GET /posts）
2. 投稿詳細（GET /posts/:id）
3. 新規投稿フォーム（POST）
4. 更新フォーム（PUT）
5. 削除ボタン（DELETE）
6. エラー表示 / ローディング表示
7. 検索 + filter
8. URL クエリでフィルタ

あなたは「Phase1 の ○○ サンプルやって」と指定するだけで OK。

---

## Phase 2：自力再現（ヒントだけで書く）

AI が出すもの:

- ファイル名
- 必要なフック名（useFetch など）
- 使う UI コンポーネント名
- Tailwind クラスのヒント
- 完成 UI の文章イメージ

AI が出さないもの:

- コード本体

あなたは完全に自力で書く → 詰まったところだけ質問する。

---

## Phase 3：応用・ランダム練習

題材を変えて同じパターンを反復する。

ラウンドロビン方式で練習:

- posts
- users
- comments
- todos

ランダム課題例:

- 一覧 → 詳細 → 作成 → 更新 → 削除 を連続で実装
- URL クエリで絞り込み
- useState でお気に入り機能
- middleware で「ログイン必須」風ガード
- デバウンス付き検索（タイピング時の負荷軽減）
- 日付ソート（createdAt 風の疑似日付で練習）

目標:
Nuxt + 外部 API を使った「実務パターン」を身体で覚える。

============================================================
📌 JSONPlaceholder とは
============================================================
JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。
https://jsonplaceholder.typicode.com/

特徴:

- 無料で利用可能（月間約 30 億リクエストを処理）
- 実際のバックエンドサーバー不要でフロントエンド開発が可能
- 標準的な REST API の動作を学習できる
- JSON Server + LowDB で構築されている
- すべての HTTP メソッド（GET / POST / PUT / PATCH / DELETE）をサポート

提供リソース:

- /posts（100 件の投稿データ）
- /comments（500 件のコメント）
- /albums（100 件のアルバム）
- /photos（5000 件の写真）
- /todos（200 件のタスク）
- /users（10 件のユーザー情報）

リソース間の関係:

- posts には複数の comments が紐づく
- albums には複数の photos が紐づく
- 例: GET /posts/1/comments で投稿 ID 1 のコメント一覧を取得可能

なぜ JSONPlaceholder を使うのか:

1. バックエンド開発の知識がなくてもフロントエンド学習に集中できる
2. 実際の API と同じ形式で CRUD 操作を練習できる
3. エラーハンドリングやローディング状態の実装を学べる
4. 複数の API を並列で呼び出す練習ができる
5. 無料で制限なく利用できる（学習用途に最適）

============================================================
📌 JSONPlaceholder API（固定で使用）
============================================================
ベース URL:
https://jsonplaceholder.typicode.com

一覧取得:
GET https://jsonplaceholder.typicode.com/posts
GET https://jsonplaceholder.typicode.com/users
GET https://jsonplaceholder.typicode.com/comments
（他も同様）

詳細取得:
GET https://jsonplaceholder.typicode.com/posts/:id
GET https://jsonplaceholder.typicode.com/users/:id
（例: /posts/1 で ID 1 の投稿を取得）

作成:
POST https://jsonplaceholder.typicode.com/posts
Body: { "title": "...", "body": "...", "userId": 1 }
※実際には保存されないが、レスポンスで ID が返る

更新:
PUT https://jsonplaceholder.typicode.com/posts/:id
Body: { "id": 1, "title": "...", "body": "...", "userId": 1 }
※実際には更新されないが、送信したデータがそのまま返る

部分更新:
PATCH https://jsonplaceholder.typicode.com/posts/:id
Body: { "title": "新しいタイトル" }
※指定したフィールドのみ更新（実際には保存されない）

削除:
DELETE https://jsonplaceholder.typicode.com/posts/:id
※実際には削除されないが、空のオブジェクト {} が返る

関連データ取得:
GET https://jsonplaceholder.typicode.com/posts/:id/comments
GET https://jsonplaceholder.typicode.com/comments?postId=1
（クエリパラメータでフィルタリング可能）

その他の題材:
/users（ユーザー情報）
/comments（コメント）
/todos（タスク）
/albums（アルバム）
/photos（写真）

注意事項:

- 実際のデータベースは存在しないため、POST / PUT / DELETE は
  実際にはデータを変更しない（レスポンスのみ返る）
- 学習目的では問題ないが、本番環境では使用しない
- すべてのリクエストは HTTP と HTTPS の両方で利用可能

============================================================
📌 メモの使い方
============================================================

1. Phase1 の題材を選んで「これ書いて」と AI に指示
2. もらったコードを見ながら動作確認
3. 次は「Phase2 の ○○ の課題出して」と切り替える
4. 自力で書く
5. # Phase3 で題材を変えて反復

# メモはここまで。自由にコピペ OK。
