# セクション 1: useFetch を使った基本的な API 通信

## フォルダ構成

このセクションで使用するファイル構成は以下の通りです：

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── async-await/
│       └── p1/
│           └── api.ts                # Post 型定義
├── composables/                      # Composables（必須）
│   └── async-await/
│       └── p1/
│           └── usePosts.ts           # useFetch を使った投稿取得ロジック
├── components/                       # コンポーネント（必須）
│   └── async-await/
│       └── p1/
│           └── PostList.vue          # 投稿一覧表示コンポーネント
└── pages/
    └── async-await/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_usefetch.md       # このファイル
        │   └── s2_async-try.md       # async/await の詳細解説
        └── p1/                       # 実装例
            └── index.vue             # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/async-await/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/async-await/p1/PostList.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/async-await/p1/usePosts.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## useFetch とは、なぜ必要なのか？

### useFetch とは

`useFetch`は、Nuxt 3 が提供する**composable 関数**の一つで、API からデータを取得する際に使用します。Vue 3 の Composition API と組み合わせて使用することで、非同期データの取得を簡単に実装できます。

### なぜ必要なのか？

通常、API からデータを取得する場合、以下のような処理を手動で実装する必要があります：

1. **ローディング状態の管理** - データ取得中かどうかを追跡
2. **エラー状態の管理** - エラーが発生した場合の処理
3. **データの状態管理** - 取得したデータを保持
4. **再取得機能** - 必要に応じてデータを再取得

これらを手動で実装すると、コードが複雑になり、同じような処理を何度も書くことになります。`useFetch`を使うことで、これらの処理を**自動的に管理**してくれるため、コードがシンプルになり、開発効率が向上します。

### 主な特徴

- **自動的なローディング状態管理**: `pending`プロパティで取得中かどうかを判定
- **自動的なエラー処理**: `error`プロパティでエラー情報を取得
- **リアクティブなデータ**: 取得したデータは自動的にリアクティブになる
- **SSR 対応**: サーバーサイドレンダリングでも動作
- **キャッシュ機能**: 同じリクエストは自動的にキャッシュされる

## 一般的な使用例

### 基本的な使い方

```typescript
const { data, pending, error } = useFetch('https://api.example.com/data')
```

### よくある使用パターン

1. **ページ読み込み時に自動取得**

   ```typescript
   // ページが表示されると自動的にデータを取得
   const { data: posts } = useFetch('/api/posts')
   ```

2. **条件付きで取得**

   ```typescript
   const { data: user } = useFetch('/api/user', {
   	query: { id: userId.value },
   })
   ```

3. **手動で再取得**
   ```typescript
   const { data, refresh } = useFetch('/api/data')
   // ボタンクリック時に再取得
   await refresh()
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
	username: string
	email: string
	phone?: string
	website?: string
	address?: {
		street: string
		city: string
		zipcode: string
	}
	company?: {
		name: string
		catchPhrase?: string
	}
}
```

**なぜ型定義が必要か？**

- ❌ **`any` を使った場合**:

  ```typescript
  const posts = ref<any>(null)
  posts.value.title // エラーが出ないが、実行時に undefined の可能性
  posts.value.titl // タイポしてもエラーが出ない
  ```

- ✅ **型定義を使った場合**:
  ```typescript
  const posts = ref<Post[] | null>(null)
  posts.value[0].title // ✅ IDE が補完してくれる
  posts.value[0].titl // ❌ コンパイルエラー！タイポを検出
  ```

#### 1-2. 型定義の使用

```typescript
import type { Post } from '~/types/async-await/p1/api'

// useFetch に型を指定
const { data: posts } = useFetch<Post[]>(
	'https://jsonplaceholder.typicode.com/posts'
)
```

**型定義のメリット：**

- IDE が自動補完してくれる（`posts.value[0].title` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる
- リファクタリングが安全にできる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/usePosts.ts の作成

```typescript
// composables/async-await/p1/usePosts.ts
import type { Post } from '~/types/async-await/p1/api'

export const usePosts = () => {
	const {
		data: posts,
		pending: postsPending,
		error: postsError,
		refresh: refreshPosts,
	} = useFetch<Post[]>('https://jsonplaceholder.typicode.com/posts')

	// 投稿を ID で検索する関数
	const getPostById = (id: number) => {
		return posts.value?.find((post) => post.id === id)
	}

	// 投稿をユーザー ID でフィルタする関数
	const getPostsByUserId = (userId: number) => {
		return posts.value?.filter((post) => post.userId === userId) || []
	}

	return {
		posts,
		postsPending,
		postsError,
		refreshPosts,
		getPostById,
		getPostsByUserId,
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
import { usePosts } from '~/composables/async-await/p1/usePosts'

// composable を使うことで、ロジックが再利用可能になる
const { posts, postsPending, postsError } = usePosts()
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

**分割の基準：**

- **単一責任の原則**: 1 つのコンポーネント = 1 つの役割
- **再利用性**: 2 箇所以上で使う → コンポーネント化
- **ファイルサイズ**: 200-300 行を超えたら分割を検討

#### 3-1. components/PostList.vue の作成

```vue
<!-- components/async-await/p1/PostList.vue -->
<template>
	<UCard>
		<template #header>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-neutral-100">投稿データ一覧</h2>
				<div v-if="posts && !postsPending" class="text-sm text-neutral-400">
					全{{ posts.length }}件
				</div>
			</div>
		</template>
		<!-- ローディング、エラー、テーブル表示 -->
	</UCard>
</template>

<script setup lang="ts">
import type { Post } from '~/types/async-await/p1/api'

interface Props {
	posts: Post[] | null
	postsPending: boolean
	postsError: Error | null
}

defineProps<Props>()
</script>
```

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
		<PostList
			:posts="posts"
			:posts-pending="postsPending"
			:posts-error="postsError"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { usePosts } from '~/composables/async-await/p1/usePosts'

// Components を明示的にインポート
import PostList from '~/components/async-await/p1/PostList.vue'

// composable からデータを取得
const { posts, postsPending, postsError } = usePosts()
</script>
```

### 4. 明示的なインポート（トラブル回避）

Nuxt 3 では自動インポート機能がありますが、深い階層（`composables/async-await/p1/` など）では機能しない場合があります。トラブルを避けるため、**必要なものは明示的にインポート**することを推奨します。

#### 4-1. 明示的なインポートの実装

```typescript
// pages/async-await/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
// 注: composables/async-await/p1/ のような深い階層では自動インポートが機能しないため、明示的にインポートします
import { usePosts } from '~/composables/async-await/p1/usePosts'

// Components を明示的にインポート
import PostList from '~/components/async-await/p1/PostList.vue'

// 型定義を明示的にインポート
import type { Post } from '~/types/async-await/p1/api'

// composable からデータを取得
const { posts, postsPending, postsError } = usePosts()
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
			1. 投稿データ一覧（useFetch）
		</h2>
		<div v-if="posts && !postsPending" class="text-sm text-neutral-400">
			全{{ posts.length }}件
			<!-- データが取得できて、ローディング中でない場合に件数を表示 -->
		</div>
	</div>
</template>
```

**コードの説明：**

- `v-if="posts && !postsPending"`: データが存在し、かつローディング中でない場合のみ表示
- `posts.length`: 取得した投稿データの配列の長さ（件数）を表示

#### 5-2. ローディング状態の表示

```vue
<!-- ローディング状態 -->
<div v-if="postsPending" class="text-center py-8 text-neutral-400">
	<div
		class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
	></div>  <!-- スピナーアニメーション（回転する円） -->
	<p class="mt-2">データを読み込み中...</p>  <!-- ローディングメッセージ -->
</div>
```

**コードの説明：**

- `v-if="postsPending"`: ローディング中の場合のみ表示
- `animate-spin`: Tailwind CSS のアニメーションクラスで、要素を回転させる
- ユーザーにデータ取得中であることを視覚的に伝える

#### 5-3. エラー状態の表示

```vue
<!-- エラー状態 -->
<div v-if="postsError" <!-- エラーが発生した場合のみ表示 -->
	class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
>
	<p class="text-red-400 font-medium">エラーが発生しました</p>  <!-- エラーメッセージのタイトル -->
	<p class="text-red-300 text-sm mt-1">{{ postsError.message }}</p>  <!-- エラーの詳細メッセージ -->
</div>
```

**コードの説明：**

- `v-if="postsError"`: エラーが発生した場合のみ表示
- `postsError.message`: エラーオブジェクトの`message`プロパティを表示
- 赤色の背景とボーダーでエラーであることを視覚的に強調

#### 5-4. データテーブルの表示

```vue
<!-- データテーブル表示 -->
<div v-if="posts && !postsPending" class="overflow-x-auto">  <!-- データが存在し、ローディング中でない場合のみ表示 -->
	<table class="w-full border-collapse">
		<thead>
			<tr class="bg-neutral-800 border-b border-neutral-700">
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					ID  <!-- テーブルのヘッダー：ID列 -->
				</th>
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					タイトル  <!-- テーブルのヘッダー：タイトル列 -->
				</th>
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					本文（抜粋）  <!-- テーブルのヘッダー：本文列 -->
				</th>
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					ユーザーID  <!-- テーブルのヘッダー：ユーザーID列 -->
				</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="post in posts.slice(0, 10)"  <!-- 取得した投稿データの最初の10件をループ処理 -->
				:key="post.id"  <!-- Vueのkey属性：各要素を一意に識別するため -->
				class="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"  <!-- ホバー時の背景色変更 -->
			>
				<td class="px-4 py-3 text-sm text-neutral-300 font-mono">
					{{ post.id }}  <!-- 投稿IDを表示 -->
				</td>
				<td class="px-4 py-3 text-sm text-neutral-200 font-medium">
					{{ post.title }}  <!-- 投稿タイトルを表示 -->
				</td>
				<td class="px-4 py-3 text-sm text-neutral-400 max-w-md truncate">
					{{ post.body }}  <!-- 投稿本文を表示（長い場合は切り詰め） -->
				</td>
				<td class="px-4 py-3 text-sm text-neutral-300">
					{{ post.userId }}  <!-- ユーザーIDを表示 -->
				</td>
			</tr>
		</tbody>
	</table>
	<div class="mt-4 text-sm text-neutral-400 text-center">
		表示中: 1-10件 / 全{{ posts.length }}件  <!-- 表示件数と総件数を表示 -->
	</div>
</div>
```

**コードの説明：**

- `v-if="posts && !postsPending"`: データが存在し、ローディング中でない場合のみテーブルを表示
- `v-for="post in posts.slice(0, 10)"`: 取得した投稿データの最初の 10 件をループ処理
  - `slice(0, 10)`: 配列の最初の 10 要素を取得（ページネーションの簡易版）
- `:key="post.id"`: Vue の key 属性。各要素を一意に識別するために必要
- `{{ post.id }}`: 各投稿の ID を表示
- `{{ post.title }}`: 各投稿のタイトルを表示
- `{{ post.body }}`: 各投稿の本文を表示
- `{{ post.userId }}`: 各投稿のユーザー ID を表示
- `truncate`: Tailwind CSS のクラスで、長いテキストを省略記号（...）で表示

## 実装の全体像

このセクションでは、実務で必須の 4 つの概念を実装しました：

### 1. 型定義の明確化

```typescript
// types/async-await/p1/api.ts
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
// composables/async-await/p1/usePosts.ts
export const usePosts = () => {
	const { data: posts, pending, error } = useFetch<Post[]>('https://...')
	return { posts, pending, error }
}
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/async-await/p1/PostList.vue -->
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

## まとめ

`useFetch`を使うことで、以下のメリットが得られます：

1. **コードがシンプル**: ローディング状態やエラー処理を自動的に管理
2. **開発効率の向上**: 同じような処理を何度も書く必要がない
3. **保守性の向上**: Nuxt が推奨する方法なので、将来的な変更にも対応しやすい
4. **SSR 対応**: サーバーサイドレンダリングでも自動的に動作

### 実装の流れ

1. **型定義を作成**: `types/async-await/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/async-await/p1/usePosts.ts` でロジックを分離
3. **コンポーネントを作成**: `components/async-await/p1/PostList.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/async-await/p1/index.vue` で全てを組み合わせる

このセクションでは、`useFetch`の基本的な使い方と、実務で必須の 4 つの概念（型定義・Composables・コンポーネント分割・明示的なインポート）を学びました。次のセクションでは、より細かい制御が必要な場合の手動実装方法を学びます。
