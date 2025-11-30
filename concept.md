📝 Nuxt3 + JSONPlaceholder 学習メモ（最新版・統合版）

============================================================

🎯 基本設定（変わらず）

技術スタック:
	•	Nuxt 3 + Vue 3 + TypeScript
	•	UI: Nuxt UI（または shadcn-vue 相当）+ Tailwind CSS
	•	外部 REST API: JSONPlaceholder のみ
https://jsonplaceholder.typicode.com/
	•	実行環境: Cursor
	•	作業フォルダ: nuxtjs_practice

制約（重要）:
	•	server/api（自作 API）は使わない
	•	Prisma / DB を使わない
	•	外部 API（JSONPlaceholder）だけで CRUD する
	•	すべてフロント側だけで完結する学習フロー

============================================================

📌 Nuxt で使う基本機能（外部 API に必要な範囲だけ）
	•	<script setup>
	•	useFetch / useAsyncData（API 取得）
	•	useRoute / useRouter（ルーティング）
	•	useState（簡易グローバル）
	•	composables（共通ロジック）
	•	middleware
	•	Tailwind CSS
	•	Nuxt UI（Card / Button / Input / Textarea）

※ 不要な機能・パターンは敢えて使わない（学習効率↑）

============================================================

🏗️ 実務で必須の 4 つの概念（＋学習しやすい最小構成で統一）

実務でも学習でも最強の組み合わせ。
すべてのサンプル・課題をこの4概念に基づいて構成する。

⸻

1. 型定義の明確化（types/）

目的
	•	実行時エラー防止
	•	IDE の補完向上
	•	データ構造をチームに明示

実装
	•	types/async-await/.../api.ts
	•	Post, User, Comment などの型
	•	useFetch<Post[]> のように必ず型指定

メリット
	•	タイポや不整合を即検知
	•	自動補完が強くなる
	•	安全にリファクタ可能

⸻

2. コンポーネント分割（UI の単一責任）

目的
	•	再利用性
	•	保守性
	•	UI の統一感

実装
	•	components/.../PostList.vue
	•	必ず「props で受け取る」
	•	“一覧表示だけ”など単一責務ルールを徹底

メリット
	•	複数ページで再利用可能
	•	修正箇所が最小
	•	理解しやすい

⸻

3. ロジックの分離（composables/）

目的
	•	重複排除
	•	ロジック単体でテスト可能
	•	コンポーネントの肥大化防止

実装
	•	composables/.../usePosts.ts
	•	GET / POST / PUT / DELETE をまとめて提供
	•	API URL・fetch ロジックをここに集約

メリット
	•	どのページでも同じロジックを使える
	•	保守性が圧倒的に上がる
	•	UI がシンプルに保てる

⸻

4. 明示的なインポート（依存明確化）

目的
	•	自動インポート不発バグの防止
	•	読みやすさ向上
	•	依存関係の透明化

実装例:

// Composables
import { usePosts } from '~/composables/async-await/p1/usePosts'

// Components
import PostList from '~/components/async-await/p1/PostList.vue'

// Types
import type { Post } from '~/types/async-await/p1/api'

注意
	•	Nuxt 組込（useFetch 等）は auto-import OK
	•	components / composables は深い階層だと auto import NG

============================================================

🎨 UI / CSS 方針（共通）

Nuxt UI を基礎に、Tailwind で軽く整える。

よく使う Tailwind:
flex / grid / gap-4 / p-4 / rounded-xl / shadow / w-full / max-w-2xl / mx-auto

ダークテーマ:
	•	背景: bg-neutral-900
	•	カード: bg-neutral-950
	•	テキスト: text-neutral-100

assets/css/main.css
	•	Tailwind 読み込み
	•	ダークテーマ変数
	•	最小限の共通スタイルのみ

============================================================

📚 学習フェーズ（実務 × 学習効率の最適化）

あなたの意図通り、「実務で使う流れそのまま」 に学習を合わせた。

⸻

Phase 1：AI がフルコードを作成（最小構成・実務仕様）

目的:
	•	動く実装を見て理解する
	•	1ファイル完結
	•	JSONPlaceholder を完全活用
	•	実務で使うエラー / ローディングも必ず入れる

サンプル例:
	1.	投稿一覧（GET /posts）
	2.	投稿詳細（GET /posts/:id）
	3.	作成（POST）
	4.	更新（PUT）
	5.	削除（DELETE）
	6.	検索・フィルタ
	7.	クエリパラメータで絞り込み

⸻

Phase 2：AI のサポート最小化 → あなたが書く

AI が出すもの:
	•	ファイル構成
	•	使う composable 名
	•	UI ヒント
	•	Tailwind 例

AI が出さないもの:
	•	コード本体（100% 自分で書く）

⸻

Phase 3：実務の反復練習（posts / users / comments / todos）
	•	一覧 → 詳細 → 作成 → 更新 → 削除
	•	useState でお気に入り
	•	middleware でログイン必須風
	•	デバウンス付き検索
	•	createdAt 風ダミー日付でソート練習

目的:
Nuxt x 外部 API の黄金パターンを身体に染み込ませる。

============================================================

📌 JSONPlaceholder（学習用 API）

ベース URL:
https://jsonplaceholder.typicode.com

使用リソース:
	•	/posts
	•	/users
	•	/comments
	•	/todos

（実務 API と同じ REST の動きで学習できる）

注意:
	•	実際の DB はないため変更は保存されない（レスポンスのみ返る）
	•	学習には問題なし

============================================================

📌 メモの使い方（統一）
	1.	「Phase1 の ○○ 作って」と命令
	2.	コードを動かして理解
	3.	「Phase2 の ○○ の課題出して」へ
	4.	自力で実装
	5.	Phase3 で応用反復

============================================================