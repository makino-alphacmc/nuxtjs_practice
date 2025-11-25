# セクション 3: PUT - 投稿を更新

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。ユーザー情報、投稿、コメントなどのサンプルデータを提供しており、実際のバックエンドサーバーなしでフロントエンドの開発や学習が可能です。

## フォルダ構成

このセクションで使用するファイル構成は以下の通りです：

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── http-signal/
│       └── p1/
│           └── api.ts                # UpdatePostRequest 型定義
├── composables/                      # Composables（必須）
│   └── http-signal/
│       └── p1/
│           └── useHttpPosts.ts        # updatePost() メソッド
├── components/                       # コンポーネント（必須）
│   └── http-signal/
│       └── p1/
│           └── PostEditForm.vue      # 投稿更新フォーム
└── pages/
    └── http-signal/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_get.md            # GET の詳細解説
        │   ├── s2_post.md           # POST の詳細解説
        │   ├── s3_put.md            # このファイル
        │   └── s4_delete.md         # DELETE の詳細解説
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/http-signal/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/http-signal/p1/PostEditForm.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/http-signal/p1/useHttpPosts.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## PUT とは、なぜ必要なのか？

### PUT とは

`PUT`は、HTTP メソッドの一つで、**既存のリソースを完全に置き換える**際に使用します。REST API の標準的な操作で、リクエストボディに全データを含めて送信します。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面でデータの更新が必要です：

1. **編集機能** - 投稿の編集、プロフィールの更新など
2. **設定変更** - アカウント設定、システム設定など
3. **状態変更** - ステータスの更新、フラグの変更など

これらを実装するために、PUT リクエストを使ったデータ更新の方法を理解する必要があります。

### 主な特徴

- **冪等性がある**: 同じリクエストを複数回実行しても結果が同じ
- **完全置換**: リソース全体を置き換える（部分更新ではない）
- **リクエストボディに全データを含める**: 更新する全フィールドを含める必要がある
- **副作用がある**: サーバーの状態を変更する

### PATCH との違い

- **PUT**: リソース全体を置き換える（全フィールドが必要）
- **PATCH**: リソースの一部のみを更新する（変更したいフィールドのみでOK）

## 一般的な使用例

### 基本的な使い方

```typescript
// $fetch を使った基本的な PUT リクエスト
const data = await $fetch<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`, {
	method: 'PUT',
	body: {
		id: 1,
		title: '更新されたタイトル',
		body: '更新された本文',
		userId: 1,
	},
})
```

### よくある使用パターン

1. **既存データの編集**

   ```typescript
   const updatePost = async (id: number, postData: UpdatePostRequest) => {
   	const data = await $fetch<Post>(`https://api.example.com/posts/${id}`, {
   		method: 'PUT',
   		body: postData,
   	})
   	return data
   }
   ```

2. **バリデーション付きの更新**
   ```typescript
   const updatePost = async (postData: UpdatePostRequest) => {
   	if (!postData.title || !postData.body) {
   		throw new Error('タイトルと本文は必須です')
   	}
   	const data = await $fetch<Post>(`https://api.example.com/posts/${postData.id}`, {
   		method: 'PUT',
   		body: postData,
   	})
   	return data
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

export interface UpdatePostRequest {
	id: number
	title: string
	body: string
	userId: number
}
```

**なぜ型定義が必要か？**

- ❌ **`any` を使った場合**:

  ```typescript
  const updatePost = async (postData: any) => {
  	// タイポしてもエラーが出ない
  	await $fetch(`https://api.example.com/posts/${postData.i}`, { // タイポ！
  		method: 'PUT',
  		body: postData,
  	})
  }
  ```

- ✅ **型定義を使った場合**:
  ```typescript
  const updatePost = async (postData: UpdatePostRequest) => {
  	// ✅ IDE が補完してくれる
  	await $fetch(`https://api.example.com/posts/${postData.id}`, { // ✅ 正しい
  		method: 'PUT',
  		body: postData,
  	})
  }
  ```

#### 1-2. 型定義の使用

```typescript
import type { UpdatePostRequest, Post } from '~/types/http-signal/p1/api'

// $fetch に型を指定
const updatePost = async (postData: UpdatePostRequest) => {
	const data = await $fetch<Post>(`https://jsonplaceholder.typicode.com/posts/${postData.id}`, {
		method: 'PUT',
		body: postData,
	})
	return data
}
```

**型定義のメリット：**

- IDE が自動補完してくれる（`postData.id` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる
- リファクタリングが安全にできる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useHttpPosts.ts の作成

```typescript
// composables/http-signal/p1/useHttpPosts.ts
import type { Post, UpdatePostRequest } from '~/types/http-signal/p1/api'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

export const useHttpPosts = () => {
	const posts = useState<Post[]>('http-posts', () => [])
	const loading = useState<boolean>('http-posts-loading', () => false)
	const error = useState<Error | null>('http-posts-error', () => null)

	/**
	 * PUT: 投稿を更新（全フィールドを更新）
	 */
	const updatePost = async (postData: UpdatePostRequest) => {
		loading.value = true
		error.value = null
		try {
			const data = await $fetch<Post>(`${BASE_URL}/${postData.id}`, {
				method: 'PUT',
				body: postData,
			})
			// 更新した投稿を一覧で更新（実際のAPIでは保存されないが、UI上で反映）
			const index = posts.value.findIndex((p) => p.id === postData.id)
			if (index !== -1) {
				posts.value[index] = data
			}
			return { success: true, data }
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error('投稿の更新に失敗しました')
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
		updatePost,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `method: 'PUT'`: HTTP メソッドを PUT に指定
- `body: postData`: リクエストボディに送信するデータを指定（全フィールドを含む）
- `posts.value[index] = data`: 更新した投稿を一覧で更新（楽観的更新）
- `findIndex`: 配列内で該当する投稿のインデックスを検索

#### 2-2. コンポーネントでの使用

```typescript
// pages/http-signal/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useHttpPosts } from '~/composables/http-signal/p1/useHttpPosts'

// 型定義を明示的にインポート
import type { Post, UpdatePostRequest } from '~/types/http-signal/p1/api'

// composable を使うことで、ロジックが再利用可能になる
const { updatePost } = useHttpPosts()

// 編集中の投稿の状態
const editingPost = ref<UpdatePostRequest | null>(null)

// 投稿を編集するために選択
const selectPostForEdit = (post: Post) => {
	editingPost.value = {
		id: post.id,
		title: post.title,
		body: post.body,
		userId: post.userId,
	}
}

// 投稿を更新
const handleUpdatePost = async () => {
	if (!editingPost.value) return

	if (!editingPost.value.title || !editingPost.value.body) {
		alert('タイトルと本文を入力してください')
		return
	}

	const result = await updatePost(editingPost.value)
	if (result.success) {
		editingPost.value = null
		alert('投稿を更新しました！')
	}
}
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/PostEditForm.vue の作成

```vue
<!-- components/http-signal/p1/PostEditForm.vue -->
<template>
	<UCard class="bg-neutral-950" data-edit-section>
		<template #header>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-neutral-100">
					3. PUT - 投稿を更新
				</h2>
				<UButton
					v-if="editingPost"
					size="xs"
					color="gray"
					@click="handleCancel"
				>
					キャンセル
				</UButton>
			</div>
		</template>
		<div v-if="editingPost" class="space-y-4">
			<p class="text-sm text-neutral-400">
				編集中の投稿ID: {{ editingPost.id }}
			</p>
			<UInput
				v-model="editingPost.title"
				placeholder="タイトルを入力"
				label="タイトル"
				class="w-full"
			/>
			<UTextarea
				v-model="editingPost.body"
				placeholder="本文を入力"
				label="本文"
				:rows="4"
				class="w-full"
			/>
			<UInput
				v-model.number="editingPost.userId"
				type="number"
				placeholder="ユーザーID"
				label="ユーザーID"
				class="w-full"
			/>
			<UButton
				:loading="loading"
				@click="handleSubmit"
				color="blue"
				block
			>
				投稿を更新
			</UButton>
		</div>
		<div v-else class="text-center py-8 text-neutral-400">
			一覧から「編集」ボタンをクリックして投稿を選択してください。
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { UpdatePostRequest } from '~/types/http-signal/p1/api'

export default defineComponent({
	name: 'PostEditForm',
	props: {
		editingPost: {
			type: Object as () => UpdatePostRequest | null,
			default: null,
		},
		loading: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['update', 'cancel'],
	setup(props, { emit }) {
		const editingPost = ref<UpdatePostRequest | null>(props.editingPost)

		// props の変更を監視
		watch(
			() => props.editingPost,
			(newVal) => {
				editingPost.value = newVal
			}
		)

		const handleSubmit = () => {
			if (!editingPost.value) return

			if (!editingPost.value.title || !editingPost.value.body) {
				alert('タイトルと本文を入力してください')
				return
			}

			emit('update', editingPost.value)
		}

		const handleCancel = () => {
			emit('cancel')
		}

		return {
			editingPost,
			handleSubmit,
			handleCancel,
		}
	},
})
</script>
```

**コンポーネント分割のメリット：**

- ✅ **再利用性**: 複数のページで同じ UI を使える
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: ファイルが小さくなり、理解しやすくなる
- ✅ **テスト容易性**: コンポーネント単位でテストできる

**コードの説明：**

- `v-model="editingPost.title"`: 双方向バインディングで編集内容を管理
- `watch`: props の変更を監視し、ローカルの状態を更新
- `emit('update', editingPost.value)`: 親コンポーネントに `update` イベントを発行
- `emit('cancel')`: 編集をキャンセルするイベントを発行
- `data-edit-section`: スクロール先の目印として使用

#### 3-2. 親コンポーネントでの使用

```vue
<!-- pages/http-signal/p1/index.vue -->
<template>
	<div>
		<PostEditForm
			:editing-post="editingPost"
			:loading="loading"
			@update="handleUpdatePost"
			@cancel="cancelEdit"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useHttpPosts } from '~/composables/http-signal/p1/useHttpPosts'

// Components を明示的にインポート
import PostEditForm from '~/components/http-signal/p1/PostEditForm.vue'

// 型定義を明示的にインポート
import type { UpdatePostRequest } from '~/types/http-signal/p1/api'

// composable からデータを取得
const { loading, updatePost } = useHttpPosts()

const editingPost = ref<UpdatePostRequest | null>(null)

const handleUpdatePost = async () => {
	if (!editingPost.value) return
	const result = await updatePost(editingPost.value)
	if (result.success) {
		editingPost.value = null
		alert('投稿を更新しました！')
	}
}

const cancelEdit = () => {
	editingPost.value = null
}
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
import PostEditForm from '~/components/http-signal/p1/PostEditForm.vue'

// 型定義を明示的にインポート
import type { UpdatePostRequest } from '~/types/http-signal/p1/api'
```

**明示的なインポートのメリット：**

- ✅ **確実性**: 自動インポートが機能しない場合でも確実に動作する
- ✅ **可読性**: どこから来ているかが明確で、コードレビューがしやすい
- ✅ **保守性**: 依存関係が明確で、リファクタリングが安全
- ✅ **チーム開発**: チーム開発で混乱を避けられる

### 5. Template 部分の実装

#### 5-1. 編集フォーム

```vue
<div v-if="editingPost" class="space-y-4">
	<p class="text-sm text-neutral-400">
		編集中の投稿ID: {{ editingPost.id }}
	</p>
	<UInput
		v-model="editingPost.title"
		placeholder="タイトルを入力"
		label="タイトル"
		class="w-full"
	/>
	<UTextarea
		v-model="editingPost.body"
		placeholder="本文を入力"
		label="本文"
		:rows="4"
		class="w-full"
	/>
	<UButton
		:loading="loading"
		@click="handleSubmit"
		color="blue"
		block
	>
		投稿を更新
	</UButton>
</div>
```

**コードの説明：**

- `v-if="editingPost"`: 編集対象が選択されている場合のみフォームを表示
- `v-model="editingPost.title"`: 双方向バインディングで編集内容を管理
- `{{ editingPost.id }}`: 編集中の投稿IDを表示

#### 5-2. キャンセルボタン

```vue
<UButton
	v-if="editingPost"
	size="xs"
	color="gray"
	@click="handleCancel"
>
	キャンセル
</UButton>
```

**コードの説明：**

- `@click="handleCancel"`: 編集をキャンセルするイベントを発行
- 編集を中断したい場合に使用

## 実装の全体像

このセクションでは、実務で必須の 4 つの概念を実装しました：

### 1. 型定義の明確化

```typescript
// types/http-signal/p1/api.ts
export interface UpdatePostRequest {
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
const updatePost = async (postData: UpdatePostRequest) => {
	const data = await $fetch<Post>(`${BASE_URL}/${postData.id}`, {
		method: 'PUT',
		body: postData,
	})
	return { success: true, data }
}
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/http-signal/p1/PostEditForm.vue -->
<template>
	<UCard>
		<!-- 投稿更新フォームのUI -->
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
import PostEditForm from '~/components/http-signal/p1/PostEditForm.vue'
import type { UpdatePostRequest } from '~/types/http-signal/p1/api'
```

**メリット：**

- 自動インポートが機能しない場合でも確実に動作する
- 依存関係が明確で、リファクタリングが安全

## まとめ

PUT リクエストを使うことで、以下のメリットが得られます：

1. **データの更新**: 既存のリソースを完全に置き換えることができる
2. **編集機能**: ユーザーが既存データを編集できる
3. **冪等性**: 同じリクエストを複数回実行しても結果が同じ
4. **楽観的更新**: 更新したデータを即座に UI に反映できる

### 実装の流れ

1. **型定義を作成**: `types/http-signal/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/http-signal/p1/useHttpPosts.ts` でロジックを分離
3. **コンポーネントを作成**: `components/http-signal/p1/PostEditForm.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/http-signal/p1/index.vue` で全てを組み合わせる

このセクションでは、PUT リクエストの基本的な使い方と、実務で必須の 4 つの概念（型定義・Composables・コンポーネント分割・明示的なインポート）を学びました。次のセクションでは、DELETE リクエストを使ったデータの削除方法を学びます。

