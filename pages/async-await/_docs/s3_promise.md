# セクション 3: Promise.all で複数データを並列取得

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。投稿（posts）、ユーザー（users）、コメント（comments）などのサンプルデータを提供しており、複数の API を同時に呼び出す並列処理の学習に最適です。

## フォルダ構成

このセクションで使用するファイル構成は以下の通りです：

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── async-await/
│       └── p1/
│           └── api.ts
├── composables/                      # Composables（必須）
│   └── async-await/
│       └── p1/
│           └── useParallelData.ts
├── components/                        # コンポーネント（必須）
│   └── async-await/
│       └── p1/
│           └── ParallelDataCards.vue
└── pages/
    └── async-await/
        ├── _docs/                    # マニュアルファイル
        │   ├── s1_usefetch.md
        │   ├── s2_async-try.md
        │   ├── s3_promise.md         # このファイル
        │   ├── s4_await.md
        │   └── s5_error-handling.md
        └── p1/                       # 実装例
            └── index.vue             # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/async-await/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/async-await/p1/ParallelDataCards.vue` で再利用性・保守性を向上（props で受け取る）
3. **ロジックの分離** - `composables/async-await/p1/useParallelData.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## Promise.all とは、なぜ必要なのか？

### Promise.all とは

複数の Promise（非同期処理）をまとめて管理し、**すべての処理が終わるまで待ってから次のステップへ進む**ためのユーティリティ関数です。配列で渡した Promise がすべて resolve されると結果が配列で返り、どれかひとつでも reject すると即座に例外として扱えます。

### なぜ必要なのか？

1. **待ち時間を最小化できる** – 複数 API を同時に投げれば「一番遅い API の時間」しか待たなくて済む
2. **コードをシンプルに保てる** – `try/catch` を 1 箇所にまとめ、成功時・失敗時の処理を一本化
3. **エラー検知がラク** – どれかが失敗した時点で一括で `catch` に飛ばせるため、画面側で統一メッセージを出しやすい
4. **ダッシュボードや一覧画面で必須** – 多種類の情報を同時に表示する UI でレスポンスを安定させられる

### 主な特徴

- **配列順に結果が返る**: `[post, user, comment]` のようにリクエスト順で受け取れる
- **一部失敗で全体を中断**: ひとつでも reject すれば全体が失敗扱いになる（再取得 UI などを実装しやすい）
- **ネストした Promise もまとめられる**: `fetch` 後の `.json()` など、さらなる非同期処理も並列化できる
- **実行時間を測りやすい**: `Date.now()` と組み合わせれば並列効果を UI で見せられる

## 一般的な使用例

### 基本的な使い方

```typescript
const [posts, users] = await Promise.all([
	fetchPosts(), // Promise を返す関数
	fetchUsers(),
])
```

### よくある使用パターン

1. **ダッシュボードの初期表示**
   ```typescript
   const [stats, notifications, profile] = await Promise.all([
   	getStats(),
   	getNotifications(),
   	getProfile(),
   ])
   ```
2. **個別画面での詳細情報取得**
   ```typescript
   const [post, comments] = await Promise.all([
   	fetchPostDetail(id),
   	fetchComments(id),
   ])
   ```
3. **スケルトン削減のための先読み**
   ```typescript
   const [current, next] = await Promise.all([
   	fetchCurrentStep(),
   	fetchNextStepPreview(),
   ])
   ```

## 実装手順

実務で必須の 4 つの概念を順番に実装していきます：

1. **型定義の明確化** - `any` の使用を減らす
2. **ロジックの分離** - composables の活用
3. **コンポーネントの分割** - 再利用性・保守性向上（props で受け取る）
4. **明示的なインポート** - トラブル回避のため

### 1. 型定義の作成（必須）

`any` を使わずに**型定義を明確に**することが重要です。これにより、IDE の補完機能が働き、実行時エラーを防ぐことができます。

#### 1-1. 型定義ファイルの作成

```typescript
// types/async-await/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}

export interface User {
	id: number
	name: string
	email: string
	address?: {
		city: string
	}
}

export interface Comment {
	id: number
	name: string
	body: string
}

export interface ParallelData {
	post: Post
	user: User
	comment: Comment
	duration: number
}
```

#### 1-2. 型定義の使用

```typescript
import type { Post, User, Comment, ParallelData } from '~/types/async-await/p1/api'
```

**型定義のメリット：**

- IDE が自動補完してくれる（`data.value.post.title` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる
- リファクタリングが安全にできる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useParallelData.ts の作成

```typescript
// composables/async-await/p1/useParallelData.ts
import type { Post, User, Comment, ParallelData } from '~/types/async-await/p1/api'

export const useParallelData = () => {
	const loading = ref(false)
	const data = ref<ParallelData | null>(null)
	const error = ref<string | null>(null)

	const fetchMultipleData = async () => {
		data.value = null
		error.value = null
		loading.value = true

		const startTime = Date.now()

		try {
			const [postRes, userRes, commentRes] = await Promise.all([
				fetch('https://jsonplaceholder.typicode.com/posts/1'),
				fetch('https://jsonplaceholder.typicode.com/users/1'),
				fetch('https://jsonplaceholder.typicode.com/comments/1'),
			])

			if (!postRes.ok || !userRes.ok || !commentRes.ok) {
				throw new Error('一部のリクエストが失敗しました')
			}

			const [post, user, comment] = await Promise.all([
				postRes.json() as Promise<Post>,
				userRes.json() as Promise<User>,
				commentRes.json() as Promise<Comment>,
			])

			const duration = Date.now() - startTime
			data.value = { post, user, comment, duration }
		} catch (err) {
			error.value = err instanceof Error ? err.message : '不明なエラー'
			console.error('並列処理エラー:', err)
		} finally {
			loading.value = false
		}
	}

	return {
		loading,
		data,
		error,
		fetchMultipleData,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

#### 2-2. コンポーネントでの使用

```typescript
// pages/async-await/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useParallelData } from '~/composables/async-await/p1/useParallelData'

// composable を使うことで、ロジックが再利用可能になる
const { loading, data, error, fetchMultipleData } = useParallelData()
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/ParallelDataCards.vue の作成

```vue
<!-- components/async-await/p1/ParallelDataCards.vue -->

**コンポーネント分割のメリット：**

- ✅ **再利用性**: 複数のページで同じ UI を使える
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: ファイルが小さくなり、理解しやすくなる
- ✅ **テスト容易性**: コンポーネント単位でテストできる

#### 3-2. 親コンポーネントでの使用

```vue
<!-- pages/async-await/p1/index.vue -->
<template>
	<div>
		<ParallelDataCards
			:data="data"
			:loading="loading"
			:error="error"
			@fetch="fetchMultipleData"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useParallelData } from '~/composables/async-await/p1/useParallelData'

// Components を明示的にインポート
import ParallelDataCards from '~/components/async-await/p1/ParallelDataCards.vue'

// composable からデータを取得
const { loading, data, error, fetchMultipleData } = useParallelData()
</script>
```

### 4. 明示的なインポート（依存明確化）

**目的:**
- 自動インポート不発バグの防止
- 読みやすさ向上
- 依存関係の透明化

Nuxt 3 では自動インポート機能がありますが、深い階層（`composables/async-await/p1/` など）では機能しない場合があります。トラブルを避けるため、**必要なものは明示的にインポート**することを推奨します。

```typescript
// pages/async-await/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useParallelData } from '~/composables/async-await/p1/useParallelData'

// Components を明示的にインポート
import ParallelDataCards from '~/components/async-await/p1/ParallelDataCards.vue'

// 型定義を明示的にインポート
import type { ParallelData } from '~/types/async-await/p1/api'
</script>
```

**注意:**
- Nuxt 組込（useFetch 等）は auto-import OK
- components / composables は深い階層だと auto import NG

**明示的なインポートのメリット：**

- ✅ **確実性**: 自動インポートが機能しない場合でも確実に動作する
- ✅ **可読性**: どこから来ているかが明確で、コードレビューがしやすい
- ✅ **保守性**: 依存関係が明確で、リファクタリングが安全

### 4. Template 部分の実装

#### 4-1. ヘッダーと操作ボタン
<template>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<DataCard title="投稿データ" :data="data?.post" />
		<DataCard title="ユーザー情報" :data="data?.user" />
		<DataCard title="コメント" :data="data?.comment" />
	</div>
</template>

<script setup lang="ts">
import type { ParallelData } from '~/types/async-await/p1/api'

interface Props {
	data: ParallelData | null
}

defineProps<Props>()
</script>
```

#### 4-1. ヘッダーと操作ボタン

```vue
<template #header>
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-neutral-100">
			3. 複数データを並列取得（Promise.all）
		</h2>
		<div
			v-if="parallelData?.duration && !parallelLoading"
			class="text-sm text-neutral-400"
		>
			処理時間: {{ parallelData.duration }}ms
		</div>
	</div>
</template>

<UButton
	@click="fetchMultipleData"
	:loading="parallelLoading"
	color="primary"
	class="mt-4"
>
	<template v-if="!parallelLoading">複数データを並列取得</template>
	<template v-else>並列取得中...</template>
</UButton>
```

**コードの説明：**

- `parallelData?.duration` を表示し、並列化の効果をリアルタイムで確認
- `UButton` はセクション 1・2 と同じローディング挙動で統一感を維持
- ボタンを押すと毎回 `fetchMultipleData` が最初から実行される

#### 4-2. ローディング状態

```vue
<div v-if="parallelLoading" class="text-center py-8 text-neutral-400">
	<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"></div>
	<p class="mt-2">複数のデータを読み込み中...</p>
</div>
```

**コードの説明：**

- 並列処理中のみスピナーを表示し、ユーザーに処理中であることを伝える
- 文言を「複数のデータ」と明示して、ボタンアクションと対応づけている

#### 4-3. エラー表示

```vue
<div
	v-if="parallelError"
	class="p-4 bg-red-950/20 border border-red-800 rounded-lg mt-4"
>
	<p class="text-red-400 font-medium">エラーが発生しました</p>
	<p class="text-red-300 text-sm mt-1">{{ parallelError }}</p>
	<UButton size="sm" color="red" class="mt-3" @click="fetchMultipleData">再試行する</UButton>
</div>
```

**コードの説明：**

- `parallelError` がセットされた場合のみ表示
- catch で整形したメッセージをそのまま提示し、原因をユーザーに共有
- 小さめのリトライボタンで再実行を促す

#### 4-4. 並列取得結果のカード表示

```vue
<div v-if="parallelData && !parallelLoading" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
	<div class="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
		<h3 class="text-sm font-semibold text-neutral-300">投稿データ</h3>
		<p class="text-neutral-200 font-medium text-sm mb-2">
			{{ parallelData.post?.title }}
		</p>
		<p class="text-neutral-400 text-xs line-clamp-3">
			{{ parallelData.post?.body }}
		</p>
	</div>
	<div class="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
		<h3 class="text-sm font-semibold text-neutral-300">ユーザー情報</h3>
		<p class="text-neutral-200 text-sm font-medium">
			{{ parallelData.user?.name }}
		</p>
		<p class="text-neutral-400 text-xs">
			{{ parallelData.user?.email }} / {{ parallelData.user?.address?.city }}
		</p>
	</div>
	<div class="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
		<h3 class="text-sm font-semibold text-neutral-300">コメント</h3>
		<p class="text-neutral-200 text-sm font-medium">
			{{ parallelData.comment?.name }}
		</p>
		<p class="text-neutral-400 text-xs line-clamp-2">
			{{ parallelData.comment?.body }}
		</p>
	</div>
</div>
```

**コードの説明：**

- `parallelData && !parallelLoading` で結果がそろっている状態に限定
- 各カードが `post / user / comment` を 1 対 1 で表示し、「同時に取得した」感覚を演出
- `line-clamp` や `font-medium` で読みやすさと情報量のバランスを調整

## 実装の全体像

このセクションでは、実務で必須の 4 つの概念を実装しました：

### 1. 型定義の明確化（types/）

```typescript
// types/async-await/p1/api.ts
export interface ParallelData {
	post: Post
	user: User
	comment: Comment
	duration: number
}
```

**メリット：**

- ✅ タイポや不整合を即検知
- ✅ 自動補完が強くなる
- ✅ 安全にリファクタ可能

### 2. コンポーネント分割（UI の単一責任）

```vue
<!-- components/async-await/p1/ParallelDataCards.vue -->
<template>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<!-- 並列取得結果のカード表示（props で受け取る） -->
	</div>
</template>
```

**メリット：**

- ✅ 複数ページで再利用可能
- ✅ 修正箇所が最小
- ✅ 理解しやすい

### 3. ロジックの分離（composables/）

```typescript
// composables/async-await/p1/useParallelData.ts
export const useParallelData = () => {
	const { loading, data, error, fetchMultipleData } = ...
	return { loading, data, error, fetchMultipleData }
}
```

**メリット：**

- ✅ どのページでも同じロジックを使える
- ✅ 保守性が圧倒的に上がる
- ✅ UI がシンプルに保てる

### 4. 明示的なインポート（依存明確化）

```typescript
// Composables
import { useParallelData } from '~/composables/async-await/p1/useParallelData'

// Components
import ParallelDataCards from '~/components/async-await/p1/ParallelDataCards.vue'

// Types
import type { ParallelData } from '~/types/async-await/p1/api'
```

**メリット：**

- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

## まとめ

`Promise.all`を使うことで、以下のメリットが得られます：

1. **体感速度の向上**: 複数の API を同時に実行し、「一番遅い API の時間」しか待たない
2. **コードの簡潔化**: `try/catch` を 1 箇所にまとめ、成功時・失敗時の処理を一本化
3. **エラー検知の容易さ**: どれかが失敗した時点で一括で `catch` に飛ばせる
4. **保守性の向上**: 型定義と Composables を活用することで、複数の API を扱うコードも安全に管理できる

### 実装の流れ（統一パターン）

1. **型定義を作成**: `types/async-await/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/async-await/p1/useParallelData.ts` でロジックを分離
3. **コンポーネントを作成**: `components/async-await/p1/ParallelDataCards.vue` で UI を分割（props で受け取る）
4. **明示的なインポート**: 深い階層では自動インポートに頼らず明示的にインポート
5. **メインコンポーネントで統合**: `pages/async-await/p1/index.vue` で全てを組み合わせる

このセクションでは、`Promise.all`を使った並列処理の実装方法と、実務で必須の 4 つの概念（型定義・コンポーネント分割・ロジックの分離・明示的なインポート）を学びました。次のセクションでは、順次処理（await の連続）を学びます。
