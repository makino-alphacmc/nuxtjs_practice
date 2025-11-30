# セクション 2: POST - 新規投稿を作成

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。ユーザー情報、投稿、コメントなどのサンプルデータを提供しており、実際のバックエンドサーバーなしでフロントエンドの開発や学習が可能です。

## フォルダ構成

このセクションで使用するファイル構成は以下の通りです：

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── http-signal/
│       └── p1/
│           └── api.ts                # CreatePostRequest 型定義
├── composables/                      # Composables（必須）
│   └── http-signal/
│       └── p1/
│           └── useHttpPosts.ts        # createPost() メソッド
├── components/                       # コンポーネント（必須）
│   └── http-signal/
│       └── p1/
│           └── PostCreateForm.vue    # 新規投稿作成フォーム
└── pages/
    └── http-signal/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_get.md            # GET の詳細解説
        │   ├── s2_post.md           # このファイル
        │   ├── s3_put.md            # PUT の詳細解説
        │   └── s4_delete.md         # DELETE の詳細解説
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

## 実務で必須の 4 つの概念

1. **型定義の明確化** – `CreatePostRequest` で各フィールドの型を定義
2. **コンポーネント分割** – 新規投稿作成フォーム UI を `PostCreateForm.vue` に切り出し、親はロジックに集中（props で受け取る）
3. **ロジックの分離** – `useHttpPosts()` に POST リクエストロジックを集約
4. **明示的なインポート** – 深い階層から `~/components/...`、`~/composables/...`、`~/types/...` を必ず記述

## POST とは、なぜ必要なのか？

### POST とは

`POST`は、HTTP メソッドの一つで、**サーバーに新しいリソースを作成する**際に使用します。REST API の標準的な操作で、リクエストボディにデータを含めて送信します。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面でデータの作成が必要です：

1. **新規登録** - ユーザー登録、投稿作成など
2. **フォーム送信** - お問い合わせフォーム、コメント投稿など
3. **ファイルアップロード** - 画像アップロード、ドキュメントアップロードなど

これらを実装するために、POST リクエストを使ったデータ作成の方法を理解する必要があります。

### 主な特徴

- **副作用がある**: サーバーの状態を変更する
- **リクエストボディにデータを含める**: JSON 形式でデータを送信
- **冪等性がない**: 同じリクエストを複数回実行すると、複数のリソースが作成される可能性がある
- **キャッシュできない**: 通常、POST リクエストはキャッシュされない

## 一般的な使用例

### 基本的な使い方

```typescript
// $fetch を使った基本的な POST リクエスト
const data = await $fetch<Post>('https://jsonplaceholder.typicode.com/posts', {
	method: 'POST',
	body: {
		title: '新しい投稿',
		body: '投稿の本文',
		userId: 1,
	},
})
```

### よくある使用パターン

1. **フォームデータの送信**

   ```typescript
   const createPost = async (postData: CreatePostRequest) => {
   	const data = await $fetch<Post>('https://api.example.com/posts', {
   		method: 'POST',
   		body: postData,
   	})
   	return data
   }
   ```

2. **バリデーション付きの送信**
   ```typescript
   const createPost = async (postData: CreatePostRequest) => {
   	if (!postData.title || !postData.body) {
   		throw new Error('タイトルと本文は必須です')
   	}
   	const data = await $fetch<Post>('https://api.example.com/posts', {
   		method: 'POST',
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

export interface CreatePostRequest {
	title: string
	body: string
	userId: number
}
```

**なぜ型定義が必要か？**

- ❌ **`any` を使った場合**:

  ```typescript
  const createPost = async (postData: any) => {
  	// タイポしてもエラーが出ない
  	await $fetch('https://api.example.com/posts', {
  		method: 'POST',
  		body: { titl: postData.titl }, // タイポ！
  	})
  }
  ```

- ✅ **型定義を使った場合**:
  ```typescript
  const createPost = async (postData: CreatePostRequest) => {
  	// ✅ IDE が補完してくれる
  	await $fetch('https://api.example.com/posts', {
  		method: 'POST',
  		body: { title: postData.title }, // ✅ 正しい
  	})
  }
  ```

#### 1-2. 型定義の使用

```typescript
import type { CreatePostRequest, Post } from '~/types/http-signal/p1/api'

// $fetch に型を指定
const createPost = async (postData: CreatePostRequest) => {
	const data = await $fetch<Post>('https://jsonplaceholder.typicode.com/posts', {
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
- リファクタリングが安全にできる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useHttpPosts.ts の作成

```typescript
// composables/http-signal/p1/useHttpPosts.ts
import type { Post, CreatePostRequest } from '~/types/http-signal/p1/api'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

export const useHttpPosts = () => {
	const posts = useState<Post[]>('http-posts', () => [])
	const loading = useState<boolean>('http-posts-loading', () => false)
	const error = useState<Error | null>('http-posts-error', () => null)

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
		loading: readonly(loading),
		error: readonly(error),
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
- `body: postData`: リクエストボディに送信するデータを指定
- `posts.value = [data, ...posts.value]`: 作成した投稿を一覧の先頭に追加（楽観的更新）

#### 2-2. コンポーネントでの使用

```typescript
// pages/http-signal/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useHttpPosts } from '~/composables/http-signal/p1/useHttpPosts'

// 型定義を明示的にインポート
import type { CreatePostRequest } from '~/types/http-signal/p1/api'

// composable を使うことで、ロジックが再利用可能になる
const { loading, createPost } = useHttpPosts()

// 新規投稿を作成する関数
const handleCreatePost = async (postData: CreatePostRequest) => {
	const result = await createPost(postData)
	if (result.success) {
		console.log('投稿の作成に成功しました', result.data)
		alert('投稿を作成しました！')
	}
}
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/PostCreateForm.vue の作成

```vue
<!-- components/http-signal/p1/PostCreateForm.vue -->
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
				placeholder="タイトルを入力"
				label="タイトル"
				class="w-full"
			/>
			<UTextarea
				v-model="formData.body"
				placeholder="本文を入力"
				label="本文"
				:rows="4"
				class="w-full"
			/>
			<UInput
				v-model.number="formData.userId"
				type="number"
				placeholder="ユーザーID（1-10）"
				label="ユーザーID"
				class="w-full"
			/>
			<UButton
				:loading="loading"
				@click="handleSubmit"
				color="green"
				block
			>
				投稿を作成
			</UButton>
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { CreatePostRequest } from '~/types/http-signal/p1/api'

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
			// フォームをリセット
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
- ✅ **テスト容易性**: コンポーネント単位でテストできる

**コードの説明：**

- `v-model="formData.title"`: 双方向バインディングでフォームの値を管理
- `v-model.number="formData.userId"`: 数値型に自動変換
- `emit('create', formData.value)`: 親コンポーネントに `create` イベントを発行
- フォーム送信後、フォームをリセットして次の入力に備える

#### 3-2. 親コンポーネントでの使用

```vue
<!-- pages/http-signal/p1/index.vue -->
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
import { useHttpPosts } from '~/composables/http-signal/p1/useHttpPosts'

// Components を明示的にインポート
import PostCreateForm from '~/components/http-signal/p1/PostCreateForm.vue'

// 型定義を明示的にインポート
import type { CreatePostRequest } from '~/types/http-signal/p1/api'

// composable からデータを取得
const { loading, createPost } = useHttpPosts()

const handleCreatePost = async (postData: CreatePostRequest) => {
	const result = await createPost(postData)
	if (result.success) {
		alert('投稿を作成しました！')
	}
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
import PostCreateForm from '~/components/http-signal/p1/PostCreateForm.vue'

// 型定義を明示的にインポート
import type { CreatePostRequest } from '~/types/http-signal/p1/api'
```

**明示的なインポートのメリット：**

- ✅ **確実性**: 自動インポートが機能しない場合でも確実に動作する
- ✅ **可読性**: どこから来ているかが明確で、コードレビューがしやすい
- ✅ **保守性**: 依存関係が明確で、リファクタリングが安全
- ✅ **チーム開発**: チーム開発で混乱を避けられる

### 5. Template 部分の実装

#### 5-1. フォーム入力フィールド

```vue
<UInput
	v-model="formData.title"
	placeholder="タイトルを入力"
	label="タイトル"
	class="w-full"
/>
<UTextarea
	v-model="formData.body"
	placeholder="本文を入力"
	label="本文"
	:rows="4"
	class="w-full"
/>
<UInput
	v-model.number="formData.userId"
	type="number"
	placeholder="ユーザーID（1-10）"
	label="ユーザーID"
	class="w-full"
/>
```

**コードの説明：**

- `v-model`: 双方向バインディングでフォームの値をリアクティブに管理
- `v-model.number`: 数値型に自動変換（`userId` は数値型のため）
- `placeholder`: 入力例を表示
- `label`: フィールドのラベルを表示

#### 5-2. 送信ボタン

```vue
<UButton
	:loading="loading"
	@click="handleSubmit"
	color="green"
	block
>
	投稿を作成
</UButton>
```

**コードの説明：**

- `:loading="loading"`: ローディング中はボタンにスピナーを表示
- `@click="handleSubmit"`: ボタンクリック時にフォーム送信処理を実行
- `color="green"`: ボタンの色を緑に設定（作成操作を表す）
- `block`: ボタンを全幅に表示

## 実装の全体像

このセクションでは、実務で必須の 4 つの概念を実装しました：

### 1. 型定義の明確化

```typescript
// types/http-signal/p1/api.ts
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
// composables/http-signal/p1/useHttpPosts.ts
const createPost = async (postData: CreatePostRequest) => {
	const data = await $fetch<Post>(BASE_URL, {
		method: 'POST',
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
<!-- components/http-signal/p1/PostCreateForm.vue -->
<template>
	<UCard>
		<!-- 新規投稿作成フォームのUI -->
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
import PostCreateForm from '~/components/http-signal/p1/PostCreateForm.vue'
import type { CreatePostRequest } from '~/types/http-signal/p1/api'
```

**メリット：**

- 自動インポートが機能しない場合でも確実に動作する
- 依存関係が明確で、リファクタリングが安全

## まとめ

POST リクエストを使うことで、以下のメリットが得られます：

1. **データの作成**: サーバーに新しいリソースを作成できる
2. **フォーム送信**: ユーザー入力からデータを作成して送信できる
3. **バリデーション**: 送信前にデータの妥当性をチェックできる
4. **楽観的更新**: 作成したデータを即座に UI に反映できる

### 実装の流れ

1. **型定義を作成**: `types/http-signal/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/http-signal/p1/useHttpPosts.ts` でロジックを分離
3. **コンポーネントを作成**: `components/http-signal/p1/PostCreateForm.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/http-signal/p1/index.vue` で全てを組み合わせる

## まとめ

- **型定義の明確化**: `CreatePostRequest` の型を定義してから実装を始める
- **ロジックの分離**: POST リクエストは composable に集約し、UI はボタン操作のみ（エラー/ローディング処理を必ず含める）
- **コンポーネント分割**: composable に処理を閉じ込めることでページやコンポーネントはシンプルになる（props で受け取る）
- **実務対応**: 実務/API 置き換えも容易（エラー/ローディング処理を必ず含める）

このセクションでは、POST リクエストの基本的な使い方と、実務で必須の 4 つの概念（型定義・コンポーネント分割・ロジックの分離・明示的なインポート）を学びました。次のセクションでは、PUT リクエストを使ったデータの更新方法を学びます。

