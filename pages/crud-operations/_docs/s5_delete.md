# セクション 5: DELETE - 投稿を削除

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
│   └── crud-operations/
│       └── p1/
│           └── useCrudWithArrayOperations.ts # deletePost() メソッド
├── components/                       # コンポーネント（必須）
│   └── crud-operations/
│       └── p1/
│           └── PostListWithOperations.vue # 削除ボタンを含む一覧
└── pages/
    └── crud-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_get.md            # GET の詳細解説
        │   ├── s2_array-operations.md # 配列操作の詳細解説
        │   ├── s3_post.md           # POST の詳細解説
        │   ├── s4_put.md            # PUT の詳細解説
        │   └── s5_delete.md         # このファイル
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/http-signal/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/crud-operations/p1/PostListWithOperations.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/crud-operations/p1/useCrudWithArrayOperations.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## DELETE とは、なぜ必要なのか？

### DELETE とは

`DELETE`は、HTTP メソッドの一つで、**既存のリソースを削除する**際に使用します。REST API の標準的な操作で、通常リクエストボディは不要です。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面でデータの削除が必要です：

1. **削除機能** - 投稿の削除、ユーザーの削除など
2. **管理機能** - 管理者によるデータの削除
3. **クリーンアップ** - 不要になったデータの削除

これらを実装するために、DELETE リクエストを使ったデータ削除の方法を理解する必要があります。

### 主な特徴

- **冪等性がある**: 同じリクエストを複数回実行しても結果が同じ（既に削除されていれば 404 エラー）
- **リクエストボディは通常不要**: URL に ID を含めるだけで削除できる
- **副作用がある**: サーバーの状態を変更する
- **不可逆的な操作**: 削除したデータは通常復元できない

### 削除確認の重要性

削除は不可逆的な操作のため、**必ず確認ダイアログを表示**することを推奨します。

## 一般的な使用例

### 基本的な使い方

```typescript
// $fetch を使った基本的な DELETE リクエスト
await $fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
	method: 'DELETE',
})
```

### よくある使用パターン

1. **削除確認付きの削除**

   ```typescript
   const deletePost = async (id: number) => {
   	if (!confirm(`投稿ID ${id} を削除してもよろしいですか？`)) {
   		return
   	}
   	await $fetch(`https://api.example.com/posts/${id}`, {
   		method: 'DELETE',
   	})
   }
   ```

2. **エラーハンドリング付きの削除**
   ```typescript
   const deletePost = async (id: number) => {
   	try {
   		await $fetch(`https://api.example.com/posts/${id}`, {
   			method: 'DELETE',
   		})
   		return { success: true }
   	} catch (err) {
   		return { success: false, error: err }
   	}
   }
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
// types/http-signal/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}
```

DELETE リクエストでは、通常 ID のみが必要なため、特別な型定義は不要です。既存の `Post` 型の `id` を使用します。

#### 1-2. 型定義の使用

```typescript
import type { Post } from '~/types/http-signal/p1/api'

// 型を指定して DELETE リクエストを送信
const deletePost = async (id: number): Promise<void> => {
	await $fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
		method: 'DELETE',
	})
}
```

**型定義のメリット：**

- IDE が自動補完してくれる
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useCrudWithArrayOperations.ts の作成

```typescript
// composables/crud-operations/p1/useCrudWithArrayOperations.ts
import type { Post } from '~/types/http-signal/p1/api'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

export const useCrudWithArrayOperations = () => {
	const posts = useState<Post[]>('crud-operations-p1-posts', () => [])

	/**
	 * DELETE: 投稿を削除
	 */
	const deletePost = async (id: number) => {
		loading.value = true
		error.value = null
		try {
			await $fetch(`${BASE_URL}/${id}`, {
				method: 'DELETE',
			})
			// 削除した投稿を一覧から削除（実際のAPIでは削除されないが、UI上で反映）
			posts.value = posts.value.filter((p) => p.id !== id)
			// 削除後に現在のページが空になったら前のページに移動（配列操作との統合）
			if (filteredAndSortedPosts.value.length === 0 && currentPage.value > 1) {
				currentPage.value = currentPage.value - 1
			}
			return { success: true }
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error('投稿の削除に失敗しました')
			error.value = errorMessage
			return { success: false, error: errorMessage }
		} finally {
			loading.value = false
		}
	}

	return {
		posts: readonly(posts),
		deletePost,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `method: 'DELETE'`: HTTP メソッドを DELETE に指定
- `filter((p) => p.id !== id)`: 削除した投稿を一覧から除外（配列操作）
- `currentPage.value - 1`: 削除後に現在のページが空になったら前のページに移動（ページネーションとの統合）

#### 2-2. コンポーネントでの使用

```typescript
// pages/crud-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p1/useCrudWithArrayOperations'

const { deletePost } = useCrudWithArrayOperations()

const handleDeletePost = async (id: number) => {
	if (!confirm(`投稿ID ${id} を削除してもよろしいですか？`)) {
		return
	}

	const result = await deletePost(id)
	if (result.success) {
		alert('投稿を削除しました！')
	}
}
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/PostListWithOperations.vue の削除ボタン

```vue
<!-- components/crud-operations/p1/PostListWithOperations.vue -->
<template>
	<div
		v-for="post in paginatedPosts"
		:key="post.id"
		class="p-4 bg-neutral-900 rounded-lg"
	>
		<div class="flex items-start justify-between">
			<!-- 投稿の表示 -->
			<div class="flex gap-2 ml-4">
				<UButton
					@click="$emit('edit', post)"
					color="blue"
					variant="outline"
					size="sm"
				>
					編集
				</UButton>
				<UButton
					@click="$emit('delete', post.id)"
					color="red"
					variant="outline"
					size="sm"
				>
					削除
				</UButton>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Post } from '~/types/http-signal/p1/api'

export default defineComponent({
	name: 'PostListWithOperations',
	props: {
		paginatedPosts: {
			type: Array as () => Post[],
			required: true,
		},
	},
	emits: ['edit', 'delete'],
})
</script>
```

**コンポーネント分割のメリット：**

- ✅ **再利用性**: 複数のページで同じ UI を使える
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: ファイルが小さくなり、理解しやすくなる

#### 3-2. 親コンポーネントでの使用

```vue
<!-- pages/crud-operations/p1/index.vue -->
<template>
	<div>
		<PostListWithOperations
			:paginated-posts="paginatedPosts"
			@delete="handleDeletePost"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p1/useCrudWithArrayOperations'

// Components を明示的にインポート
import PostListWithOperations from '~/components/crud-operations/p1/PostListWithOperations.vue'
</script>
```

### 4. 明示的なインポート（トラブル回避）

Nuxt 3 では自動インポート機能がありますが、深い階層（`composables/crud-operations/p1/` など）では機能しない場合があります。トラブルを避けるため、**必要なものは明示的にインポート**することを推奨します。

#### 4-1. 明示的なインポートの実装

```typescript
// pages/crud-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p1/useCrudWithArrayOperations'

// Components を明示的にインポート
import PostListWithOperations from '~/components/crud-operations/p1/PostListWithOperations.vue'

// 型定義を明示的にインポート
import type { Post } from '~/types/http-signal/p1/api'
```

**明示的なインポートのメリット：**

- ✅ **確実性**: 自動インポートが機能しない場合でも確実に動作する
- ✅ **可読性**: どこから来ているかが明確で、コードレビューがしやすい
- ✅ **保守性**: 依存関係が明確で、リファクタリングが安全

### 5. Template 部分の実装

#### 5-1. 削除ボタン

```vue
<UButton
	@click="$emit('delete', post.id)"
	color="red"
	variant="outline"
	size="sm"
>
	削除
</UButton>
```

**コードの説明：**

- `color="red"`: 削除操作を表す赤色
- `@click="$emit('delete', post.id)"`: 削除ボタンクリック時に親コンポーネントにイベントを発行

#### 5-2. 削除確認

```typescript
const handleDeletePost = async (id: number) => {
	if (!confirm(`投稿ID ${id} を削除してもよろしいですか？`)) {
		return
	}

	const result = await deletePost(id)
	if (result.success) {
		alert('投稿を削除しました！')
	}
}
```

**コードの説明：**

- `confirm`: 削除確認ダイアログを表示
- `filter((p) => p.id !== id)`: 削除した投稿を一覧から除外

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
// composables/crud-operations/p1/useCrudWithArrayOperations.ts
const deletePost = async (id: number) => {
	await $fetch(`${BASE_URL}/${id}`, {
		method: 'DELETE',
	})
	// 削除した投稿を一覧から削除（配列操作との統合）
	posts.value = posts.value.filter((p) => p.id !== id)
	// ページネーションの自動調整
	if (filteredAndSortedPosts.value.length === 0 && currentPage.value > 1) {
		currentPage.value = currentPage.value - 1
	}
	return { success: true }
}
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/crud-operations/p1/PostListWithOperations.vue -->
<template>
	<UButton
		@click="$emit('delete', post.id)"
		color="red"
	>
		削除
	</UButton>
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
import PostListWithOperations from '~/components/crud-operations/p1/PostListWithOperations.vue'
```

**メリット：**

- 自動インポートが機能しない場合でも確実に動作する
- 依存関係が明確で、リファクタリングが安全

## 配列操作との統合

このセクションでは、DELETE リクエストと配列操作を統合しています：

1. **データ削除**: DELETE リクエストで既存のデータを削除
2. **一覧からの削除**: 削除したデータを一覧から除外（`filter`で除外）
3. **ページネーションの自動調整**: 削除後に現在のページが空になったら前のページに移動

これにより、ユーザーは削除したデータがすぐに一覧から消えることを確認できます。

## まとめ

DELETE リクエストを使うことで、以下のメリットが得られます：

1. **データの削除**: サーバーから既存のデータを削除できる
2. **削除確認**: 確認ダイアログで誤削除を防ぐ
3. **配列操作との統合**: 削除したデータを一覧から自動的に除外できる
4. **ページネーションの自動調整**: 削除後にページが空になったら自動的に前のページに移動
5. **再利用性**: Composables とコンポーネントの分割により、コードの再利用性が向上する

### 実装の流れ

1. **型定義を作成**: `types/http-signal/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/crud-operations/p1/useCrudWithArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成**: `components/crud-operations/p1/PostListWithOperations.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/crud-operations/p1/index.vue` で全てを組み合わせる

### 重要なポイント

- **削除確認**: 必ず確認ダイアログを表示して誤削除を防ぐ
- **配列操作**: `filter`で削除したデータを一覧から除外
- **ページネーション**: 削除後にページが空になったら自動的に前のページに移動

このセクションでは、DELETE リクエストの基本的な使い方と、実務で必須の 4 つの概念（型定義・Composables・コンポーネント分割・明示的なインポート）を学びました。これで CRUD 操作と配列操作を統合した実践的な実装を全て学習できました。

