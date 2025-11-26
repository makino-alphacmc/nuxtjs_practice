# セクション 3: POST - 新規投稿を作成

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。ユーザー情報、投稿、コメントなどのサンプルデータを提供しており、実際のバックエンドサーバーなしでフロントエンドの開発や学習が可能です。

## フォルダ構成

このセクションで使用するファイル構成は以下の通りです：

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── crud-operations/
│       └── p2/
│           └── api.ts                # CreatePostRequest 型定義
├── composables/                      # Composables（必須）
│   └── crud-operations/
│       └── p2/
│           └── useCrudWithArrayOperations.ts # createPost() メソッド
├── components/                       # コンポーネント（必須）
│   └── http-signal/
│       └── p2/
│           └── PostCreateForm.vue    # 新規投稿作成フォーム
└── pages/
    └── crud-operations/
        ├── _docs/                    # マニュアルファイル（p1用）
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_get.md            # GET の詳細解説
        │   ├── s2_array-operations.md # 配列操作の詳細解説
        │   ├── s3_post.md           # POST の詳細解説
        │   ├── s4_put.md            # PUT の詳細解説
        │   └── s5_delete.md         # DELETE の詳細解説
        └── p2/                       # 実装例
            ├── _docs/                # マニュアルファイル（p2用）
            │   ├── README.md         # 全体構成の説明
            │   ├── p2_s1_get.md     # GET の詳細解説
            │   ├── p2_s2_array-operations.md # 配列操作の詳細解説
            │   ├── p2_s3_post.md   # このファイル
            │   ├── p2_s4_put.md    # PUT の詳細解説
            │   └── p2_s5_delete.md # DELETE の詳細解説
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/crud-operations/p2/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/http-signal/p2/PostCreateForm.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/crud-operations/p2/useCrudWithArrayOperations.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## POST とは、なぜ必要なのか？

### POST とは

`POST`は、HTTP メソッドの一つで、**サーバーに新しいデータを作成する**際に使用します。REST API の標準的な操作で、サーバーの状態を変更する操作です。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面でデータの作成が必要です：

1. **新規登録** - ユーザー登録、投稿作成など
2. **データ追加** - リストへの項目追加、コメント投稿など
3. **フォーム送信** - お問い合わせフォーム、アンケートなど

これらを実装するために、POST リクエストを使ったデータ作成の方法を理解する必要があります。

### 主な特徴

- **副作用がある**: サーバーの状態を変更する
- **リクエストボディ**: データをリクエストボディに含めて送信
- **新しいリソースの作成**: サーバーに新しいデータを作成
- **ID の自動生成**: サーバーが新しい ID を生成して返す

## 一般的な使用例

### 基本的な使い方

```typescript
// $fetch を使った基本的な POST リクエスト
const newPost = await $fetch<Post>('https://jsonplaceholder.typicode.com/posts', {
	method: 'POST',
	body: {
		title: '新しい投稿',
		body: '本文',
		userId: 1,
	},
})
```

### よくある使用パターン

1. **フォームからデータを作成**

   ```typescript
   const createPost = async (postData: CreatePostRequest) => {
   	const data = await $fetch<Post>(BASE_URL, {
   		method: 'POST',
   		body: postData,
   	})
   	return data
   }
   ```

2. **作成したデータを一覧に追加**
   ```typescript
   const result = await createPost(postData)
   posts.value = [result, ...posts.value]
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
// types/crud-operations/p2/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}

export interface CreatePostRequest {
	title: string
	body: string
	userId: number
}
```

#### 1-2. 型定義の使用

```typescript
import type { CreatePostRequest, Post } from '~/types/crud-operations/p2/api'

// 型を指定して POST リクエストを送信
const createPost = async (postData: CreatePostRequest): Promise<Post> => {
	const data = await $fetch<Post>(BASE_URL, {
		method: 'POST',
		body: postData,
	})
	return data
}
```

**型定義のメリット：**

- IDE が自動補完してくれる（`postData.title` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useCrudWithArrayOperations.ts の作成

```typescript
// composables/crud-operations/p2/useCrudWithArrayOperations.ts
import type { Post, CreatePostRequest } from '~/types/http-signal/p2/api'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

export const useCrudWithArrayOperations = () => {
	const posts = useState<Post[]>('crud-operations-p2-posts', () => [])

	/**
	 * POST: 新規投稿を作成
	 */
	const createPost = async (postData: CreatePostRequest) => {
		loading.value = true
		error.value = null
		try {
			const data = await $fetch<Post>(BASE_URL, {
				method: 'POST',
				body: postData,
			})
			// 作成した投稿を一覧に追加（実際のAPIでは保存されないが、UI上で反映）
			posts.value = [data, ...posts.value]
			currentPage.value = 1 // 新規作成後は1ページ目に戻す
			return { success: true, data }
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error('投稿の作成に失敗しました')
			error.value = errorMessage
			return { success: false, error: errorMessage }
		} finally {
			loading.value = false
		}
	}

	return {
		posts: readonly(posts),
		createPost,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `method: 'POST'`: HTTP メソッドを POST に指定
- `body: postData`: リクエストボディにデータを含める
- `posts.value = [data, ...posts.value]`: 作成した投稿を一覧の先頭に追加
- `currentPage.value = 1`: 新規作成後は1ページ目に戻す（配列操作との統合）

#### 2-2. コンポーネントでの使用

```typescript
// pages/crud-operations/p2/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p2/useCrudWithArrayOperations'

const { createPost } = useCrudWithArrayOperations()

const handleCreatePost = async (postData: CreatePostRequest) => {
	const result = await createPost(postData)
	if (result.success) {
		alert('投稿を作成しました！')
	}
}
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/PostCreateForm.vue の作成

```vue
<!-- components/http-signal/p2/PostCreateForm.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				2. POST - 新規投稿を作成
			</h2>
		</template>
		<div class="space-y-4">
			<UInput
				v-model="formData.title"
				placeholder="タイトル"
				label="タイトル"
			/>
			<UTextarea
				v-model="formData.body"
				placeholder="本文"
				label="本文"
			/>
			<UInput
				v-model.number="formData.userId"
				type="number"
				placeholder="ユーザーID"
				label="ユーザーID"
			/>
			<UButton
				@click="handleSubmit"
				:loading="loading"
				color="green"
				:disabled="!formData.title || !formData.body"
			>
				投稿を作成
			</UButton>
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { CreatePostRequest } from '~/types/crud-operations/p2/api'

export default defineComponent({
	name: 'PostCreateForm',
	props: {
		loading: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['create'],
	setup(props, { emit }) {
		const formData = ref<CreatePostRequest>({
			title: '',
			body: '',
			userId: 1,
		})

		const handleSubmit = () => {
			if (!formData.value.title || !formData.value.body) {
				alert('タイトルと本文を入力してください')
				return
			}
			emit('create', formData.value)
			formData.value = {
				title: '',
				body: '',
				userId: 1,
			}
		}

		return {
			formData,
			handleSubmit,
		}
	},
})
</script>
```

**コンポーネント分割のメリット：**

- ✅ **再利用性**: 複数のページで同じ UI を使える
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: ファイルが小さくなり、理解しやすくなる

#### 3-2. 親コンポーネントでの使用

```vue
<!-- pages/crud-operations/p2/index.vue -->
<template>
	<div>
		<PostCreateForm
			:loading="loading"
			@create="handleCreatePost"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p2/useCrudWithArrayOperations'

// Components を明示的にインポート
import PostCreateForm from '~/components/http-signal/p2/PostCreateForm.vue'

// 型定義を明示的にインポート
import type { CreatePostRequest } from '~/types/crud-operations/p2/api'
</script>
```

### 4. 明示的なインポート（トラブル回避）

Nuxt 3 では自動インポート機能がありますが、深い階層（`composables/crud-operations/p2/` など）では機能しない場合があります。トラブルを避けるため、**必要なものは明示的にインポート**することを推奨します。

#### 4-1. 明示的なインポートの実装

```typescript
// pages/crud-operations/p2/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p2/useCrudWithArrayOperations'

// Components を明示的にインポート
import PostCreateForm from '~/components/http-signal/p2/PostCreateForm.vue'

// 型定義を明示的にインポート
import type { CreatePostRequest } from '~/types/crud-operations/p2/api'
```

**明示的なインポートのメリット：**

- ✅ **確実性**: 自動インポートが機能しない場合でも確実に動作する
- ✅ **可読性**: どこから来ているかが明確で、コードレビューがしやすい
- ✅ **保守性**: 依存関係が明確で、リファクタリングが安全

### 5. Template 部分の実装

#### 5-1. フォーム入力

```vue
<UInput
	v-model="formData.title"
	placeholder="タイトル"
	label="タイトル"
/>
<UTextarea
	v-model="formData.body"
	placeholder="本文"
	label="本文"
/>
<UInput
	v-model.number="formData.userId"
	type="number"
	placeholder="ユーザーID"
	label="ユーザーID"
/>
```

**コードの説明：**

- `v-model`: 双方向バインディングでフォームデータを管理
- `v-model.number`: 数値型に自動変換
- `:disabled`: 必須項目が入力されていない場合はボタンを無効化

#### 5-2. 送信ボタン

```vue
<UButton
	@click="handleSubmit"
	:loading="loading"
	color="green"
	:disabled="!formData.title || !formData.body"
>
	投稿を作成
</UButton>
```

**コードの説明：**

- `:loading`: ローディング中はボタンを無効化
- `color="green"`: 作成操作を表す緑色
- `:disabled`: 必須項目が入力されていない場合はボタンを無効化

## 実装の全体像

このセクションでは、実務で必須の 4 つの概念を実装しました：

### 1. 型定義の明確化

```typescript
// types/crud-operations/p2/api.ts
export interface CreatePostRequest {
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
// composables/crud-operations/p2/useCrudWithArrayOperations.ts
const createPost = async (postData: CreatePostRequest) => {
	const data = await $fetch<Post>(BASE_URL, {
		method: 'POST',
		body: postData,
	})
	posts.value = [data, ...posts.value]
	currentPage.value = 1 // 配列操作との統合
	return { success: true, data }
}
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/http-signal/p2/PostCreateForm.vue -->
<template>
	<UCard>
		<!-- 新規投稿作成フォーム -->
	</UCard>
</template>
```

**メリット：**

- ファイルが肥大化するのを防ぐ
- 再利用性が向上する
- 保守性が向上する

### 4. 明示的なインポート

```typescript
// pages/crud-operations/p2/index.vue
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p2/useCrudWithArrayOperations'
import PostCreateForm from '~/components/http-signal/p2/PostCreateForm.vue'
```

**メリット：**

- 自動インポートが機能しない場合でも確実に動作する
- 依存関係が明確で、リファクタリングが安全

## 配列操作との統合

このセクションでは、POST リクエストと配列操作を統合しています：

1. **データ作成**: POST リクエストで新しいデータを作成
2. **一覧への追加**: 作成したデータを一覧の先頭に追加
3. **ページネーションのリセット**: 新規作成後は1ページ目に戻す

これにより、ユーザーは作成したデータをすぐに確認できます。

## まとめ

POST リクエストを使うことで、以下のメリットが得られます：

1. **データの作成**: サーバーに新しいデータを作成できる
2. **フォーム送信**: ユーザー入力からデータを作成できる
3. **配列操作との統合**: 作成したデータを一覧に自動的に反映できる
4. **再利用性**: Composables とコンポーネントの分割により、コードの再利用性が向上する

### 実装の流れ

1. **型定義を作成**: `types/crud-operations/p2/api.ts` で型を定義
2. **Composable を作成**: `composables/crud-operations/p2/useCrudWithArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成**: `components/http-signal/p2/PostCreateForm.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/crud-operations/p2/index.vue` で全てを組み合わせる

このセクションでは、POST リクエストの基本的な使い方と、実務で必須の 4 つの概念（型定義・Composables・コンポーネント分割・明示的なインポート）を学びました。次のセクションでは、PUT リクエストを使った投稿の更新方法を学びます。

