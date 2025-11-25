# セクション 1: GET - 投稿一覧を取得

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。ユーザー情報、投稿、コメントなどのサンプルデータを提供しており、実際のバックエンドサーバーなしでフロントエンドの開発や学習が可能です。

## フォルダ構成

このセクションで使用するファイル構成は以下の通りです：

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── crud-operations/
│       └── p1/
│           └── api.ts                # Post 型定義
├── composables/                      # Composables（必須）
│   └── crud-operations/
│       └── p1/
│           └── useCrudWithArrayOperations.ts # $fetch を使った投稿取得ロジック
└── pages/
    └── crud-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_get.md            # このファイル
        │   ├── s2_array-operations.md # 配列操作の詳細解説
        │   ├── s3_post.md           # POST の詳細解説
        │   ├── s4_put.md            # PUT の詳細解説
        │   └── s5_delete.md         # DELETE の詳細解説
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/crud-operations/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/crud-operations/p1/PostListWithOperations.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/crud-operations/p1/useCrudWithArrayOperations.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## GET とは、なぜ必要なのか？

### GET とは

`GET`は、HTTP メソッドの一つで、**サーバーからデータを取得する**際に使用します。REST API の標準的な操作で、副作用がない（サーバーの状態を変更しない）安全な操作です。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面でデータの取得が必要です：

1. **一覧表示** - 投稿一覧、ユーザー一覧など
2. **詳細表示** - 特定の投稿の詳細、ユーザー情報など
3. **検索結果** - 検索条件に合致するデータの取得

これらを実装するために、GET リクエストを使ったデータ取得の方法を理解する必要があります。

### 主な特徴

- **副作用がない**: サーバーの状態を変更しない
- **キャッシュ可能**: 同じリクエストはキャッシュできる
- **安全な操作**: 何度実行しても結果が変わらない
- **URL にパラメータを含められる**: クエリパラメータで検索条件などを指定

## 一般的な使用例

### 基本的な使い方

```typescript
// $fetch を使った基本的な GET リクエスト
const data = await $fetch<Post[]>('https://jsonplaceholder.typicode.com/posts')
```

### よくある使用パターン

1. **一覧データの取得**

   ```typescript
   const posts = await $fetch<Post[]>('https://api.example.com/posts')
   ```

2. **特定のデータの取得**
   ```typescript
   const post = await $fetch<Post>(`https://api.example.com/posts/${id}`)
   ```

3. **クエリパラメータ付きの取得**
   ```typescript
   const posts = await $fetch<Post[]>('https://api.example.com/posts', {
   	query: { userId: 1, limit: 10 },
   })
   ```

## 実装手順

実務で必須の 4 つの概念を順番に実装していきます：

1. **型定義の明確化** - `any` の使用を減らす
2. **ロジックの分離** - composables の活用
3. **コンポーネントの分割** - 再利用性・保守性向上
4. **明示的なインポート** - トラブル回避のため

### 1. 型定義の作成（必須）

`any` を使わずに**型定義を明確に**することが重要です。これにより、IDE の補完機能が働き、実行時エラーを防ぐことができます。

#### 1-1. 型定義ファイルの作成

```typescript
// types/crud-operations/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}
```

#### 1-2. 型定義の使用

```typescript
import type { Post } from '~/types/crud-operations/p1/api'

// $fetch に型を指定することで、レスポンスの型が明確になる
const data = await $fetch<Post[]>('https://jsonplaceholder.typicode.com/posts')
```

**型定義のメリット：**

- IDE が自動補完してくれる（`post.title` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useCrudWithArrayOperations.ts の作成

```typescript
// composables/crud-operations/p1/useCrudWithArrayOperations.ts
import type { Post } from '~/types/crud-operations/p1/api'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

export const useCrudWithArrayOperations = () => {
	// 投稿一覧の状態管理
	const posts = useState<Post[]>('crud-operations-p1-posts', () => [])
	const loading = useState<boolean>('crud-operations-p1-loading', () => false)
	const error = useState<Error | null>('crud-operations-p1-error', () => null)

	/**
	 * GET: 投稿一覧を取得
	 */
	const fetchPosts = async () => {
		loading.value = true
		error.value = null
		try {
			const data = await $fetch<Post[]>(BASE_URL)
			posts.value = data
			currentPage.value = 1 // データ取得後は1ページ目に戻す
			return { success: true, data }
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error('投稿の取得に失敗しました')
			error.value = errorMessage
			return { success: false, error: errorMessage }
		} finally {
			loading.value = false
		}
	}

	return {
		posts: readonly(posts),
		loading: readonly(loading),
		error: readonly(error),
		fetchPosts,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `useState`: Nuxt 3 の状態管理。SSR でも安全に使用できる
- `$fetch<Post[]>`: 型を指定して API からデータを取得
- `loading.value`: ローディング状態を管理
- `error.value`: エラー状態を管理
- `currentPage.value = 1`: データ取得後は1ページ目に戻す（配列操作との統合）

#### 2-2. コンポーネントでの使用

```typescript
// pages/crud-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p1/useCrudWithArrayOperations'

const { posts, loading, error, fetchPosts } = useCrudWithArrayOperations()

const handleFetchPosts = async () => {
	const result = await fetchPosts()
	if (result.success) {
		console.log('投稿一覧の取得に成功しました', result.data)
	}
}
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. データ取得ボタンの実装

```vue
<!-- pages/crud-operations/p1/index.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">データ取得</h2>
		</template>
		<div class="p-4">
			<UButton
				@click="handleFetchPosts"
				:loading="loading"
				color="primary"
			>
				投稿一覧を取得
			</UButton>
			<p class="text-sm text-neutral-400 mt-2">
				全 {{ posts.length }}件の投稿を取得できます
			</p>
		</div>
	</UCard>
</template>
```

**コンポーネント分割のメリット：**

- ✅ **再利用性**: 複数のページで同じ UI を使える
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: ファイルが小さくなり、理解しやすくなる

### 4. 明示的なインポート（トラブル回避）

Nuxt 3 では自動インポート機能がありますが、深い階層（`composables/crud-operations/p1/` など）では機能しない場合があります。トラブルを避けるため、**必要なものは明示的にインポート**することを推奨します。

#### 4-1. 明示的なインポートの実装

```typescript
// pages/crud-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
// 注: composables/crud-operations/p1/ のような深い階層では自動インポートが機能しないため、明示的にインポートします
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p1/useCrudWithArrayOperations'

// 型定義を明示的にインポート
import type { Post } from '~/types/crud-operations/p1/api'
```

**明示的なインポートのメリット：**

- ✅ **確実性**: 自動インポートが機能しない場合でも確実に動作する
- ✅ **可読性**: どこから来ているかが明確で、コードレビューがしやすい
- ✅ **保守性**: 依存関係が明確で、リファクタリングが安全

### 5. Template 部分の実装

#### 5-1. データ取得ボタン

```vue
<UCard class="bg-neutral-950">
	<template #header>
		<h2 class="text-xl font-semibold text-neutral-100">データ取得</h2>
	</template>
	<div class="p-4">
		<UButton
			@click="handleFetchPosts"
			:loading="loading"
			color="primary"
		>
			投稿一覧を取得
		</UButton>
		<p class="text-sm text-neutral-400 mt-2">
			全 {{ posts.length }}件の投稿を取得できます
		</p>
	</div>
</UCard>
```

**コードの説明：**

- `:loading="loading"`: ローディング中はボタンを無効化
- `@click="handleFetchPosts"`: クリック時にデータ取得関数を実行
- `{{ posts.length }}`: 取得した投稿数を表示

#### 5-2. エラー表示

```vue
<div
	v-if="error"
	class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
>
	<p class="text-red-400 font-medium">エラーが発生しました</p>
	<p class="text-red-300 text-sm mt-1">{{ error.message }}</p>
</div>
```

**コードの説明：**

- `v-if="error"`: エラーがある場合のみ表示
- `{{ error.message }}`: エラーメッセージを表示

## 実装の全体像

このセクションでは、実務で必須の 4 つの概念を実装しました：

### 1. 型定義の明確化

```typescript
// types/crud-operations/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}
```

**メリット：**

- `any` の使用を減らし、実行時エラーを防ぐ
- IDE の補完機能が働く
- チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables）

```typescript
// composables/crud-operations/p1/useCrudWithArrayOperations.ts
const fetchPosts = async () => {
	loading.value = true
	error.value = null
	try {
		const data = await $fetch<Post[]>(BASE_URL)
		posts.value = data
		currentPage.value = 1 // データ取得後は1ページ目に戻す
		return { success: true, data }
	} catch (err) {
		// エラーハンドリング
	} finally {
		loading.value = false
	}
}
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- pages/crud-operations/p1/index.vue -->
<template>
	<UCard>
		<!-- データ取得ボタン -->
	</UCard>
</template>
```

**メリット：**

- ファイルが肥大化するのを防ぐ
- 再利用性が向上する
- 保守性が向上する

### 4. 明示的なインポート

```typescript
// pages/crud-operations/p1/index.vue
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p1/useCrudWithArrayOperations'
```

**メリット：**

- 自動インポートが機能しない場合でも確実に動作する
- 依存関係が明確で、リファクタリングが安全

## まとめ

GET リクエストを使うことで、以下のメリットが得られます：

1. **データの取得**: サーバーからデータを安全に取得できる
2. **状態管理**: ローディング状態・エラー状態を適切に管理できる
3. **型安全性**: 型定義を活用して、実行時エラーを防ぐ
4. **再利用性**: Composables とコンポーネントの分割により、コードの再利用性が向上する
5. **配列操作との統合**: 取得したデータに対して検索・フィルタ・ソート・ページネーションを適用できる

### 実装の流れ

1. **型定義を作成**: `types/crud-operations/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/crud-operations/p1/useCrudWithArrayOperations.ts` でロジックを分離
3. **メインコンポーネントで統合**: `pages/crud-operations/p1/index.vue` で全てを組み合わせる

このセクションでは、GET リクエストの基本的な使い方と、実務で必須の 4 つの概念（型定義・Composables・コンポーネント分割・明示的なインポート）を学びました。次のセクションでは、取得したデータに対して配列操作（検索・フィルタ・ソート・ページネーション）を適用する方法を学びます。

