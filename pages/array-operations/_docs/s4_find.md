# セクション 4: find - 特定のデータを検索

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
│           └── useArrayOperations.ts # findPostById() メソッド
├── components/                       # コンポーネント（必須）
│   └── array-operations/
│       └── p1/
│           └── FindExample.vue       # find操作のコンポーネント
└── pages/
    └── array-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_map.md            # map の詳細解説
        │   ├── s2_filter.md         # filter の詳細解説
        │   ├── s3_reduce.md         # reduce の詳細解説
        │   ├── s4_find.md           # このファイル
        │   ├── s5_sort.md           # ソート の詳細解説
        │   ├── s6_pagination.md     # ページネーション の詳細解説
        │   └── s7_crud.md           # CRUD操作 の詳細解説
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/array-operations/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/array-operations/p1/FindExample.vue` で再利用性・保守性を向上（props で受け取る）
3. **ロジックの分離** - `composables/array-operations/p1/useArrayOperations.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## find とは、なぜ必要なのか？

### find とは

`find`は、配列の各要素に対して条件をチェックし、**条件に合致する最初の要素を返す**メソッドです。条件に合致する要素が見つからない場合は`undefined`を返します。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面で特定のデータの検索が必要です：

1. **詳細表示** - IDで特定の投稿を検索して詳細を表示
2. **存在確認** - 特定の条件に合致するデータが存在するか確認
3. **データの取得** - 条件に合致する最初の要素を取得

これらを実装するために、`find`を使ったデータの検索方法を理解する必要があります。

### 主な特徴

- **最初の要素のみ返す**: 条件に合致する最初の要素を返す（複数ある場合は最初の1つ）
- **undefined を返す可能性**: 条件に合致する要素がない場合は`undefined`を返す
- **元の配列を変更しない**: 新しい配列を生成せず、要素を返すだけ
- **早期終了**: 条件に合致する要素を見つけたら処理を終了

### filter との違い

- **find**: 条件に合致する**最初の要素**を返す（要素または undefined）
- **filter**: 条件に合致する**全ての要素**を返す（配列）

## 一般的な使用例

### 基本的な使い方

```typescript
// IDで特定の要素を検索
const post = posts.find((post) => post.id === 1)
// 結果: Post オブジェクトまたは undefined
```

### よくある使用パターン

1. **IDで検索**

   ```typescript
   const post = posts.find((post) => post.id === searchId)
   ```

2. **条件で検索**
   ```typescript
   const activeUser = users.find((user) => user.status === 'active')
   ```

3. **存在確認**
   ```typescript
   const exists = posts.find((post) => post.id === id) !== undefined
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

// find の戻り値は Post | undefined 型になる
const post: Post | undefined = posts.find((post: Post) => post.id === searchId)
```

**型定義のメリット：**

- IDE が自動補完してくれる（`post.title` など）
- `undefined`チェックを忘れないようにできる
- チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useArrayOperations.ts の作成

```typescript
// composables/array-operations/p1/useArrayOperations.ts
import type { Post } from '~/types/array-operations/p1/api'

export const useArrayOperations = () => {
	const posts = useState<Post[]>('array-operations-posts', () => [])

	// 4. find - 特定のデータを検索
	const findPostById = (id: number | null) => {
		if (id === null) {
			return null
		}
		return posts.value.find((post) => post.id === id) || null
	}

	return {
		posts: readonly(posts),
		findPostById,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `find`: 条件に合致する最初の要素を返す
- `id === null`: 検索IDがない場合は`null`を返す
- `|| null`: `undefined`の代わりに`null`を返す（UIでの扱いが簡単）

#### 2-2. コンポーネントでの使用

```typescript
// pages/array-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

const { findPostById } = useArrayOperations()

const searchId = ref<number | null>(null)
const foundPost = computed(() => {
	return findPostById(searchId.value)
})
</script>
```

### 3. コンポーネントの分割 - `components/array-operations/p1/[^`]*.vue` で再利用性・保守性を向上（props で受け取る）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/FindExample.vue の作成

```vue
<!-- components/array-operations/p1/FindExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				4. find - 特定のデータを検索
			</h2>
		</template>
		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<UInput
					:model-value="searchId"
					@update:model-value="$emit('update:searchId', $event)"
					type="number"
					placeholder="投稿ID"
					label="IDで検索"
					class="w-48"
				/>
				<UButton
					@click="$emit('clearSearch')"
					color="gray"
					variant="outline"
				>
					クリア
				</UButton>
			</div>
			<div v-if="foundPost" class="p-4 bg-neutral-900 rounded-lg">
				<p class="text-sm text-neutral-300 mb-2">
					<strong class="text-neutral-100">ID:</strong> {{ foundPost.id }}
				</p>
				<p class="text-sm text-neutral-300 mb-2">
					<strong class="text-neutral-100">タイトル:</strong> {{ foundPost.title }}
				</p>
				<p class="text-sm text-neutral-300">
					<strong class="text-neutral-100">ユーザーID:</strong> {{ foundPost.userId }}
				</p>
			</div>
			<div v-else-if="hasData && searchId" class="text-sm text-neutral-500">
				該当するデータがありません
			</div>
			<div v-else-if="!hasData" class="text-sm text-neutral-500">
				データを取得してください
			</div>
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Post } from '~/types/array-operations/p1/api'

export default defineComponent({
	name: 'FindExample',
	props: {
		searchId: {
			type: Number as () => number | null,
			default: null,
		},
		foundPost: {
			type: Object as () => Post | null,
			default: null,
		},
		hasData: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['update:searchId', 'clearSearch'],
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
		<FindExample
			v-model:search-id="searchId"
			:found-post="foundPost"
			:has-data="posts.length > 0"
			@clear-search="searchId = null"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components を明示的にインポート
import FindExample from '~/components/array-operations/p1/FindExample.vue'
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
import FindExample from '~/components/array-operations/p1/FindExample.vue'

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

#### 5-1. 検索入力

```vue
<div class="flex items-center gap-4">
	<UInput
		:model-value="searchId"
		@update:model-value="$emit('update:searchId', $event)"
		type="number"
		placeholder="投稿ID"
		label="IDで検索"
		class="w-48"
	/>
	<UButton
		@click="$emit('clearSearch')"
		color="gray"
		variant="outline"
	>
		クリア
	</UButton>
</div>
```

**コードの説明：**

- `type="number"`: 数値入力フィールド
- `@update:model-value`: 親子間の双方向バインディング
- `@click="$emit('clearSearch')"`: クリアボタンクリック時に親コンポーネントにイベントを発行

#### 5-2. 検索結果の表示

```vue
<div v-if="foundPost" class="p-4 bg-neutral-900 rounded-lg">
	<p class="text-sm text-neutral-300 mb-2">
		<strong class="text-neutral-100">ID:</strong> {{ foundPost.id }}
	</p>
	<p class="text-sm text-neutral-300 mb-2">
		<strong class="text-neutral-100">タイトル:</strong> {{ foundPost.title }}
	</p>
	<p class="text-sm text-neutral-300">
		<strong class="text-neutral-100">ユーザーID:</strong> {{ foundPost.userId }}
	</p>
</div>
```

**コードの説明：**

- `v-if="foundPost"`: 検索結果が存在する場合のみ表示
- `{{ foundPost.id }}`: 検索結果のIDを表示
- `v-else-if`: 検索結果がない場合のメッセージを表示

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
<!-- components/array-operations/p1/FindExample.vue -->
<template>
	<UCard>
		<!-- find操作のUI（props で受け取る） -->
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
const findPostById = (id: number | null) => {
	if (id === null) {
		return null
	}
	return posts.value.find((post) => post.id === id) || null
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
import FindExample from '~/components/array-operations/p1/FindExample.vue'

// Types
import type { Post } from '~/types/array-operations/p1/api'
```

**メリット：**

- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

## まとめ

`find`を使うことで、以下のメリットが得られます：

1. **特定のデータの検索**: 条件に合致する最初の要素を取得できる
2. **詳細表示**: IDで特定のデータを検索して詳細を表示できる
3. **存在確認**: 特定の条件に合致するデータが存在するか確認できる
4. **再利用性**: Composables とコンポーネントの分割により、コードの再利用性が向上する

### 実装の流れ（統一パターン）

1. **型定義を作成**: `types/array-operations/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/array-operations/p1/useArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成**: `components/array-operations/p1/FindExample.vue` で UI を分割（props で受け取る）
4. **明示的なインポート**: 深い階層では自動インポートに頼らず明示的にインポート
5. **メインコンポーネントで統合**: `pages/array-operations/p1/index.vue` で全てを組み合わせる

このセクションでは、`find`の基本的な使い方と、実務で必須の 4 つの概念（型定義・コンポーネント分割・ロジックの分離・明示的なインポート）を学びました。次のセクションでは、ソートを使ったデータの並び替え方法を学びます。

