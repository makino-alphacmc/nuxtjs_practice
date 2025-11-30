# セクション 7: CRUD操作 - データの追加・削除・更新

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。ユーザー情報、投稿、コメントなどのサンプルデータを提供しており、実際のバックエンドサーバーなしでフロントエンドの開発や学習が可能です。

## フォルダ構成

このセクションで使用するファイル構成は以下の通りです：

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── array-operations/
│       └── p1/
│           └── api.ts                # Post 型定義
├── composables/                      # Composables（必須）
│   └── array-operations/
│       └── p1/
│           └── useArrayOperations.ts # addPost(), updatePost(), deletePostById() メソッド
├── components/                       # コンポーネント（必須）
│   └── array-operations/
│       └── p1/
│           └── CrudExample.vue      # CRUD操作のコンポーネント
└── pages/
    └── array-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_map.md            # map の詳細解説
        │   ├── s2_filter.md         # filter の詳細解説
        │   ├── s3_reduce.md         # reduce の詳細解説
        │   ├── s4_find.md           # find の詳細解説
        │   ├── s5_sort.md           # ソート の詳細解説
        │   ├── s6_pagination.md     # ページネーション の詳細解説
        │   └── s7_crud.md           # このファイル
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/array-operations/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割 - `components/array-operations/p1/[^`]*.vue` で再利用性・保守性を向上（props で受け取る）
3. **ロジックの分離** - `composables/array-operations/p1/useArrayOperations.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## CRUD操作とは、なぜ必要なのか？

### CRUD操作とは

CRUDは、**Create（作成）・Read（読み取り）・Update（更新）・Delete（削除）**の頭文字を取った用語です。データベースや配列に対する基本的な操作を表します。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面でCRUD操作が必要です：

1. **Create（作成）** - 新規投稿の作成、ユーザー登録など
2. **Read（読み取り）** - データの一覧表示、詳細表示など
3. **Update（更新）** - 投稿の編集、プロフィールの更新など
4. **Delete（削除）** - 投稿の削除、アカウントの削除など

これらを実装するために、配列に対するCRUD操作の方法を理解する必要があります。

### 主な特徴

- **Create**: `push`メソッドで配列に要素を追加
- **Read**: 既に実装済み（データ取得、一覧表示）
- **Update**: `findIndex`で要素を検索し、直接更新
- **Delete**: `splice`または`filter`で要素を削除

## 一般的な使用例

### 基本的な使い方

```typescript
// Create: 要素を追加
posts.push(newPost)

// Update: 要素を更新
const index = posts.findIndex((p) => p.id === id)
if (index !== -1) {
	posts[index] = updatedPost
}

// Delete: 要素を削除
posts = posts.filter((p) => p.id !== id)
```

### よくある使用パターン

1. **Create（追加）**

   ```typescript
   const addPost = (post: Post) => {
   	posts.value.push(post)
   }
   ```

2. **Update（更新）**
   ```typescript
   const updatePost = (id: number, updatedData: Partial<Post>) => {
   	const index = posts.value.findIndex((p) => p.id === id)
   	if (index !== -1) {
   		posts.value[index] = { ...posts.value[index], ...updatedData }
   	}
   }
   ```

3. **Delete（削除）**
   ```typescript
   const deletePost = (id: number) => {
   	posts.value = posts.value.filter((p) => p.id !== id)
   }
   ```

## 実装手順

実務で必須の 4 つの概念を順番に実装していきます：

1. **型定義の明確化** - `any` の使用を減らす
2. **ロジックの分離** - composables の活用
3. **コンポーネントの分割 - `components/array-operations/p1/[^`]*.vue` で再利用性・保守性を向上（props で受け取る）
4. **明示的なインポート** - トラブル回避のため

### 1. 型定義の作成（必須）

`any` を使わずに**型定義を明確に**することが重要です。これにより、IDE の補完機能が働き、実行時エラーを防ぐことができます。

#### 1-1. 型定義ファイルの作成

```typescript
// types/array-operations/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}
```

#### 1-2. 型定義の使用

```typescript
import type { Post } from '~/types/array-operations/p1/api'

// Create
const newPost: Post = {
	id: 1,
	title: '新しい投稿',
	body: '本文',
	userId: 1,
}
posts.push(newPost)

// Update
const index = posts.findIndex((p: Post) => p.id === id)
if (index !== -1) {
	posts[index].title = '更新されたタイトル'
}

// Delete
posts = posts.filter((p: Post) => p.id !== id)
```

**型定義のメリット：**

- IDE が自動補完してくれる（`post.title` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useArrayOperations.ts の作成

```typescript
// composables/array-operations/p1/useArrayOperations.ts
import type { Post } from '~/types/array-operations/p1/api'

export const useArrayOperations = () => {
	const posts = useState<Post[]>('array-operations-posts', () => [])

	// 7. データの追加・削除・更新
	const addPost = (title: string, userId: number) => {
		if (!title || !userId) {
			return false
		}
		const maxId = posts.value.length > 0 
			? Math.max(...posts.value.map((p) => p.id)) 
			: 0
		const newId = maxId + 1
		posts.value.push({
			id: newId,
			title,
			body: '',
			userId,
		})
		return true
	}

	const updatePost = (id: number, title: string) => {
		if (!id || !title) {
			return false
		}
		const index = posts.value.findIndex((p) => p.id === id)
		if (index !== -1) {
			posts.value[index].title = title
			return true
		}
		return false
	}

	const deletePostById = (id: number) => {
		if (!id) {
			return false
		}
		const index = posts.value.findIndex((p) => p.id === id)
		if (index !== -1) {
			posts.value.splice(index, 1)
			return true
		}
		return false
	}

	return {
		posts: readonly(posts),
		addPost,
		updatePost,
		deletePostById,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `push`: 配列の末尾に要素を追加
- `findIndex`: 条件に合致する要素のインデックスを検索
- `splice(index, 1)`: 指定したインデックスの要素を1つ削除
- `Math.max(...posts.value.map((p) => p.id))`: 最大のIDを取得

#### 2-2. コンポーネントでの使用

```typescript
// pages/array-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

const { addPost, updatePost, deletePostById } = useArrayOperations()

const handleAddPost = () => {
	const success = addPost(newPostTitle.value, newPostUserId.value)
	if (success) {
		alert('投稿を追加しました！')
	}
}
</script>
```

### 3. コンポーネントの分割 - `components/array-operations/p1/[^`]*.vue` で再利用性・保守性を向上（props で受け取る）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/CrudExample.vue の作成

```vue
<!-- components/array-operations/p1/CrudExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				7. データの追加・削除・更新
			</h2>
		</template>
		<div class="space-y-4">
			<!-- 追加 -->
			<div class="p-4 bg-neutral-900 rounded-lg">
				<h3 class="text-sm font-semibold text-neutral-100 mb-3">追加</h3>
				<div class="space-y-3">
					<UInput
						:model-value="newPostTitle"
						@update:model-value="$emit('update:newPostTitle', $event)"
						placeholder="タイトル"
						label="タイトル"
					/>
					<UInput
						:model-value="newPostUserId"
						@update:model-value="$emit('update:newPostUserId', $event)"
						type="number"
						placeholder="ユーザーID"
						label="ユーザーID"
					/>
					<UButton
						@click="$emit('add')"
						color="green"
						:disabled="!newPostTitle || !newPostUserId"
					>
						投稿を追加
					</UButton>
				</div>
			</div>

			<!-- 更新 -->
			<div class="p-4 bg-neutral-900 rounded-lg">
				<h3 class="text-sm font-semibold text-neutral-100 mb-3">更新</h3>
				<div class="space-y-3">
					<UInput
						:model-value="updatePostId"
						@update:model-value="$emit('update:updatePostId', $event)"
						type="number"
						placeholder="更新する投稿ID"
						label="投稿ID"
					/>
					<UInput
						:model-value="updatePostTitle"
						@update:model-value="$emit('update:updatePostTitle', $event)"
						placeholder="新しいタイトル"
						label="新しいタイトル"
					/>
					<UButton
						@click="$emit('update')"
						color="blue"
						:disabled="!updatePostId || !updatePostTitle"
					>
						投稿を更新
					</UButton>
				</div>
			</div>

			<!-- 削除 -->
			<div class="p-4 bg-neutral-900 rounded-lg">
				<h3 class="text-sm font-semibold text-neutral-100 mb-3">削除</h3>
				<div class="space-y-3">
					<UInput
						:model-value="deletePostId"
						@update:model-value="$emit('update:deletePostId', $event)"
						type="number"
						placeholder="削除する投稿ID"
						label="投稿ID"
					/>
					<UButton
						@click="$emit('delete')"
						color="red"
						:disabled="!deletePostId"
					>
						投稿を削除
					</UButton>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'CrudExample',
	props: {
		newPostTitle: {
			type: String,
			default: '',
		},
		newPostUserId: {
			type: Number as () => number | null,
			default: null,
		},
		updatePostId: {
			type: Number as () => number | null,
			default: null,
		},
		updatePostTitle: {
			type: String,
			default: '',
		},
		deletePostId: {
			type: Number as () => number | null,
			default: null,
		},
	},
	emits: [
		'update:newPostTitle',
		'update:newPostUserId',
		'update:updatePostId',
		'update:updatePostTitle',
		'update:deletePostId',
		'add',
		'update',
		'delete',
	],
})
</script>
```

**コンポーネント分割のメリット：**

- ✅ **再利用性**: 複数のページで同じ UI を使える
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: ファイルが小さくなり、理解しやすくなる

#### 3-2. 親コンポーネントでの使用

```vue
<!-- pages/array-operations/p1/index.vue -->
<template>
	<div>
		<CrudExample
			v-model:new-post-title="newPostTitle"
			v-model:new-post-user-id="newPostUserId"
			v-model:update-post-id="updatePostId"
			v-model:update-post-title="updatePostTitle"
			v-model:delete-post-id="deletePostId"
			@add="handleAddPost"
			@update="handleUpdatePost"
			@delete="handleDeletePost"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components を明示的にインポート
import CrudExample from '~/components/array-operations/p1/CrudExample.vue'
</script>
```

### 4. 明示的なインポート（依存明確化）

**目的:**
- 自動インポート不発バグの防止
- 読みやすさ向上
- 依存関係の透明化

Nuxt 3 では自動インポート機能がありますが、深い階層（`composables/array-operations/p1/` など）では機能しない場合があります。トラブルを避けるため、**必要なものは明示的にインポート**することを推奨します。

#### 4-1. 明示的なインポートの実装

```typescript
// pages/array-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components を明示的にインポート
import CrudExample from '~/components/array-operations/p1/CrudExample.vue'

// 型定義を明示的にインポート
import type { Post } from '~/types/array-operations/p1/api'
```

**注意:**
- Nuxt 組込（$fetch 等）は auto-import OK
- components / composables は深い階層だと auto import NG

**明示的なインポートのメリット：**

- ✅ **確実性**: 自動インポートが機能しない場合でも確実に動作する
- ✅ **可読性**: どこから来ているかが明確で、コードレビューがしやすい
- ✅ **保守性**: 依存関係が明確で、リファクタリングが安全

### 5. Template 部分の実装

#### 5-1. Create（追加）フォーム

```vue
<div class="p-4 bg-neutral-900 rounded-lg">
	<h3 class="text-sm font-semibold text-neutral-100 mb-3">追加</h3>
	<div class="space-y-3">
		<UInput
			:model-value="newPostTitle"
			@update:model-value="$emit('update:newPostTitle', $event)"
			placeholder="タイトル"
			label="タイトル"
		/>
		<UInput
			:model-value="newPostUserId"
			@update:model-value="$emit('update:newPostUserId', $event)"
			type="number"
			placeholder="ユーザーID"
			label="ユーザーID"
		/>
		<UButton
			@click="$emit('add')"
			color="green"
			:disabled="!newPostTitle || !newPostUserId"
		>
			投稿を追加
		</UButton>
	</div>
</div>
```

**コードの説明：**

- `:disabled`: 必須項目が入力されていない場合はボタンを無効化
- `color="green"`: 作成操作を表す緑色
- `@click="$emit('add')"`: 追加ボタンクリック時に親コンポーネントにイベントを発行

#### 5-2. Update（更新）フォーム

```vue
<div class="p-4 bg-neutral-900 rounded-lg">
	<h3 class="text-sm font-semibold text-neutral-100 mb-3">更新</h3>
	<div class="space-y-3">
		<UInput
			:model-value="updatePostId"
			@update:model-value="$emit('update:updatePostId', $event)"
			type="number"
			placeholder="更新する投稿ID"
			label="投稿ID"
		/>
		<UInput
			:model-value="updatePostTitle"
			@update:model-value="$emit('update:updatePostTitle', $event)"
			placeholder="新しいタイトル"
			label="新しいタイトル"
		/>
		<UButton
			@click="$emit('update')"
			color="blue"
			:disabled="!updatePostId || !updatePostTitle"
		>
			投稿を更新
		</UButton>
	</div>
</div>
```

**コードの説明：**

- `color="blue"`: 更新操作を表す青色
- `findIndex`: 更新対象の要素を検索

#### 5-3. Delete（削除）フォーム

```vue
<div class="p-4 bg-neutral-900 rounded-lg">
	<h3 class="text-sm font-semibold text-neutral-100 mb-3">削除</h3>
	<div class="space-y-3">
		<UInput
			:model-value="deletePostId"
			@update:model-value="$emit('update:deletePostId', $event)"
			type="number"
			placeholder="削除する投稿ID"
			label="投稿ID"
		/>
		<UButton
			@click="$emit('delete')"
			color="red"
			:disabled="!deletePostId"
		>
			投稿を削除
		</UButton>
	</div>
</div>
```

**コードの説明：**

- `color="red"`: 削除操作を表す赤色
- `splice`: 配列から要素を削除

## 実装の全体像

このセクションでは、実務で必須の 4 つの概念を実装しました：

### 1. 型定義の明確化（types/）

```typescript
// types/array-operations/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}
```

**メリット：**

- ✅ タイポや不整合を即検知
- ✅ 自動補完が強くなる
- ✅ 安全にリファクタ可能

### 2. コンポーネント分割（UI の単一責任）

```vue
<!-- components/array-operations/p1/CrudExample.vue -->
<template>
	<UCard>
		<!-- CRUD操作のUI（props で受け取る） -->
	</UCard>
</template>
```

**メリット：**

- ✅ 複数ページで再利用可能
- ✅ 修正箇所が最小
- ✅ 理解しやすい

### 3. ロジックの分離（composables/）

```typescript
// composables/array-operations/p1/useArrayOperations.ts
const addPost = (title: string, userId: number) => {
	const maxId = posts.value.length > 0 
		? Math.max(...posts.value.map((p) => p.id)) 
		: 0
	posts.value.push({
		id: maxId + 1,
		title,
		body: '',
		userId,
	})
	return true
}
```

**メリット：**

- ✅ どのページでも同じロジックを使える
- ✅ 保守性が圧倒的に上がる
- ✅ UI がシンプルに保てる

### 4. 明示的なインポート（依存明確化）

```typescript
// Composables
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components
import CrudExample from '~/components/array-operations/p1/CrudExample.vue'

// Types
import type { Post } from '~/types/array-operations/p1/api'
```

**メリット：**

- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

## まとめ

CRUD操作を使うことで、以下のメリットが得られます：

1. **データの管理**: 配列に対する基本的な操作（追加・更新・削除）を実装できる
2. **実務アプリの核心**: 実務で最もよく使う操作パターンを学習できる
3. **配列操作の実践**: これまで学んだ配列操作（map、filter、findなど）を組み合わせて使用
4. **再利用性**: Composables とコンポーネントの分割 - `components/array-operations/p1/[^`]*.vue` で再利用性・保守性を向上（props で受け取る）

### 実装の流れ（統一パターン）

1. **型定義を作成**: `types/array-operations/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/array-operations/p1/useArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成**: `components/array-operations/p1/CrudExample.vue` で UI を分割（props で受け取る）
4. **明示的なインポート**: 深い階層では自動インポートに頼らず明示的にインポート
5. **メインコンポーネントで統合**: `pages/array-operations/p1/index.vue` で全てを組み合わせる

### 重要なポイント

- **Create**: `push`で配列に要素を追加
- **Update**: `findIndex`で要素を検索し、直接更新
- **Delete**: `splice`または`filter`で要素を削除
- **IDの管理**: 新規追加時は最大ID+1を生成

このセクションでは、CRUD操作の基本的な使い方と、実務で必須の 4 つの概念（型定義・コンポーネント分割・ロジックの分離・明示的なインポート）を学びました。これで配列操作の基本を全て学習できました。

