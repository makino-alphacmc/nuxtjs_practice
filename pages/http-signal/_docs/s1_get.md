# セクション 1: GET - 投稿一覧を取得

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。ユーザー情報、投稿、コメントなどのサンプルデータを提供しており、実際のバックエンドサーバーなしでフロントエンドの開発や学習が可能です。

## フォルダ構成

このセクションで使用するファイル構成は以下の通りです：

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── http-signal/
│       └── p1/
│           └── api.ts                # Post 型定義
├── composables/                      # Composables（必須）
│   └── http-signal/
│       └── p1/
│           └── useHttpPosts.ts        # $fetch を使った投稿取得ロジック
├── components/                       # コンポーネント（必須）
│   └── http-signal/
│       └── p1/
│           └── PostList.vue          # 投稿一覧表示コンポーネント
└── pages/
    └── http-signal/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_get.md            # このファイル
        │   ├── s2_post.md           # POST の詳細解説
        │   ├── s3_put.md            # PUT の詳細解説
        │   └── s4_delete.md         # DELETE の詳細解説
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/http-signal/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/http-signal/p1/PostList.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/http-signal/p1/useHttpPosts.ts` で composables を活用
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

まず、型定義を格納するファイルを作成します：

```typescript
// types/http-signal/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}
```

**なぜ型定義が必要か？**

- ❌ **`any` を使った場合**:

  ```typescript
  const posts = ref<any[]>([])
  posts.value[0].title // エラーが出ないが、実行時に undefined の可能性
  posts.value[0].titl // タイポしてもエラーが出ない
  ```

- ✅ **型定義を使った場合**:
  ```typescript
  const posts = ref<Post[]>([])
  posts.value[0].title // ✅ IDE が補完してくれる
  posts.value[0].titl // ❌ コンパイルエラー！タイポを検出
  ```

#### 1-2. 型定義の使用

```typescript
import type { Post } from '~/types/http-signal/p1/api'

// $fetch に型を指定
const data = await $fetch<Post[]>('https://jsonplaceholder.typicode.com/posts')
```

**型定義のメリット：**

- IDE が自動補完してくれる（`post.title` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる
- リファクタリングが安全にできる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useHttpPosts.ts の作成

```typescript
// composables/http-signal/p1/useHttpPosts.ts
import type { Post } from '~/types/http-signal/p1/api'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

export const useHttpPosts = () => {
	// 投稿一覧の状態管理
	const posts = useState<Post[]>('http-posts', () => [])
	const loading = useState<boolean>('http-posts-loading', () => false)
	const error = useState<Error | null>('http-posts-error', () => null)

	/**
	 * GET: 投稿一覧を取得
	 */
	const fetchPosts = async () => {
		loading.value = true
		error.value = null
		try {
			const data = await $fetch<Post[]>(BASE_URL)
			posts.value = data
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

- `useState`: Nuxt 3 の状態管理。ページをリロードしても状態が保持される
- `$fetch`: Nuxt 3 の HTTP クライアント。`fetch` API のラッパー
- `readonly`: 状態を読み取り専用にして、外部からの直接変更を防ぐ
- `try/catch/finally`: エラーハンドリングとローディング状態の管理

#### 2-2. コンポーネントでの使用

```typescript
// pages/http-signal/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useHttpPosts } from '~/composables/http-signal/p1/useHttpPosts'

// composable を使うことで、ロジックが再利用可能になる
const { posts, loading, error, fetchPosts } = useHttpPosts()

// 投稿一覧を取得する関数
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

#### 3-1. components/PostList.vue の作成

```vue
<!-- components/http-signal/p1/PostList.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-neutral-100">
					1. GET - 投稿一覧を取得
				</h2>
				<UButton
					:loading="loading"
					@click="$emit('fetch')"
					color="primary"
				>
					一覧を取得
				</UButton>
			</div>
		</template>
		<!-- ローディング、テーブル表示 -->
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Post } from '~/types/http-signal/p1/api'

export default defineComponent({
	name: 'PostList',
	props: {
		posts: {
			type: Array as () => Post[] | null,
			default: null,
		},
		loading: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['fetch', 'edit', 'delete'],
})
</script>
```

**コンポーネント分割のメリット：**

- ✅ **再利用性**: 複数のページで同じ UI を使える
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: ファイルが小さくなり、理解しやすくなる
- ✅ **テスト容易性**: コンポーネント単位でテストできる

#### 3-2. 親コンポーネントでの使用

```vue
<!-- pages/http-signal/p1/index.vue -->
<template>
	<div>
		<PostList
			:posts="posts"
			:loading="loading"
			@fetch="handleFetchPosts"
			@edit="selectPostForEdit"
			@delete="handleDeletePost"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useHttpPosts } from '~/composables/http-signal/p1/useHttpPosts'

// Components を明示的にインポート
import PostList from '~/components/http-signal/p1/PostList.vue'

// composable からデータを取得
const { posts, loading, error, fetchPosts } = useHttpPosts()
</script>
```

### 4. 明示的なインポート（トラブル回避）

Nuxt 3 では自動インポート機能がありますが、深い階層（`composables/http-signal/p1/` など）では機能しない場合があります。トラブルを避けるため、**必要なものは明示的にインポート**することを推奨します。

#### 4-1. 明示的なインポートの実装

```typescript
// pages/http-signal/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
// 注: composables/http-signal/p1/ のような深い階層では自動インポートが機能しないため、明示的にインポートします
import { useHttpPosts } from '~/composables/http-signal/p1/useHttpPosts'

// Components を明示的にインポート
import PostList from '~/components/http-signal/p1/PostList.vue'

// 型定義を明示的にインポート
import type { Post } from '~/types/http-signal/p1/api'

// composable からデータを取得
const { posts, loading, error, fetchPosts } = useHttpPosts()
</script>
```

**明示的なインポートのメリット：**

- ✅ **確実性**: 自動インポートが機能しない場合でも確実に動作する
- ✅ **可読性**: どこから来ているかが明確で、コードレビューがしやすい
- ✅ **保守性**: 依存関係が明確で、リファクタリングが安全
- ✅ **チーム開発**: チーム開発で混乱を避けられる

### 5. Template 部分の実装

#### 5-1. ヘッダー部分

```vue
<template #header>
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-neutral-100">
			1. GET - 投稿一覧を取得
		</h2>
		<UButton
			:loading="loading"
			@click="$emit('fetch')"
			color="primary"
		>
			一覧を取得
		</UButton>
	</div>
</template>
```

**コードの説明：**

- `$emit('fetch')`: 親コンポーネントに `fetch` イベントを発行
- `:loading="loading"`: ローディング中はボタンにスピナーを表示

#### 5-2. ローディング状態の表示

```vue
<!-- ローディング状態 -->
<div v-if="loading" class="text-center py-8 text-neutral-400">
	<div
		class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
	></div>
	<p class="mt-2">データを読み込み中...</p>
</div>
```

**コードの説明：**

- `v-if="loading"`: ローディング中の場合のみ表示
- `animate-spin`: Tailwind CSS のアニメーションクラスで、要素を回転させる
- ユーザーにデータ取得中であることを視覚的に伝える

#### 5-3. データテーブルの表示

```vue
<!-- データテーブル表示 -->
<div v-else-if="posts && posts.length > 0" class="overflow-x-auto">
	<table class="w-full border-collapse">
		<thead>
			<tr class="bg-neutral-800 border-b border-neutral-700">
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					ID
				</th>
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					タイトル
				</th>
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					本文（抜粋）
				</th>
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					ユーザーID
				</th>
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					操作
				</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="post in posts.slice(0, 10)"
				:key="post.id"
				class="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
			>
				<td class="px-4 py-3 text-sm text-neutral-300 font-mono">
					{{ post.id }}
				</td>
				<td class="px-4 py-3 text-sm text-neutral-200 font-medium">
					{{ post.title }}
				</td>
				<td class="px-4 py-3 text-sm text-neutral-400 max-w-md truncate">
					{{ post.body }}
				</td>
				<td class="px-4 py-3 text-sm text-neutral-300">
					{{ post.userId }}
				</td>
				<td class="px-4 py-3">
					<div class="flex gap-2">
						<UButton size="xs" color="blue" @click="$emit('edit', post)">
							編集
						</UButton>
						<UButton size="xs" color="red" @click="$emit('delete', post.id)">
							削除
						</UButton>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
	<div class="mt-4 text-sm text-neutral-400 text-center">
		表示中: 1-10件 / 全{{ posts?.length || 0 }}件
	</div>
</div>
```

**コードの説明：**

- `v-else-if="posts && posts.length > 0"`: データが存在し、ローディング中でない場合のみテーブルを表示
- `v-for="post in posts.slice(0, 10)"`: 取得した投稿データの最初の 10 件をループ処理
  - `slice(0, 10)`: 配列の最初の 10 要素を取得（ページネーションの簡易版）
- `:key="post.id"`: Vue の key 属性。各要素を一意に識別するために必要
- `$emit('edit', post)`: 編集ボタンクリック時に親コンポーネントに `edit` イベントを発行
- `$emit('delete', post.id)`: 削除ボタンクリック時に親コンポーネントに `delete` イベントを発行

## 実装の全体像

このセクションでは、実務で必須の 4 つの概念を実装しました：

### 1. 型定義の明確化

```typescript
// types/http-signal/p1/api.ts
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
// composables/http-signal/p1/useHttpPosts.ts
export const useHttpPosts = () => {
	const posts = useState<Post[]>('http-posts', () => [])
	const loading = useState<boolean>('http-posts-loading', () => false)
	
	const fetchPosts = async () => {
		// GET リクエストの実装
	}
	
	return { posts, loading, fetchPosts }
}
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/http-signal/p1/PostList.vue -->
<template>
	<UCard>
		<!-- 投稿一覧のUI -->
	</UCard>
</template>
```

**メリット：**

- ファイルが肥大化するのを防ぐ
- 再利用性が向上する
- 保守性が向上する

### 4. 明示的なインポート

```typescript
// pages/http-signal/p1/index.vue
import { useHttpPosts } from '~/composables/http-signal/p1/useHttpPosts'
import PostList from '~/components/http-signal/p1/PostList.vue'
import type { Post } from '~/types/http-signal/p1/api'
```

**メリット：**

- 自動インポートが機能しない場合でも確実に動作する
- 依存関係が明確で、リファクタリングが安全

## まとめ

GET リクエストを使うことで、以下のメリットが得られます：

1. **データの取得**: サーバーからデータを安全に取得できる
2. **状態管理**: `useState` で状態を管理し、複数のコンポーネントで共有できる
3. **エラーハンドリング**: `try/catch` でエラーを適切に処理できる
4. **再利用性**: Composables とコンポーネントの分割により、コードの再利用性が向上する

### 実装の流れ

1. **型定義を作成**: `types/http-signal/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/http-signal/p1/useHttpPosts.ts` でロジックを分離
3. **コンポーネントを作成**: `components/http-signal/p1/PostList.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/http-signal/p1/index.vue` で全てを組み合わせる

このセクションでは、GET リクエストの基本的な使い方と、実務で必須の 4 つの概念（型定義・Composables・コンポーネント分割・明示的なインポート）を学びました。次のセクションでは、POST リクエストを使った新規データの作成方法を学びます。

