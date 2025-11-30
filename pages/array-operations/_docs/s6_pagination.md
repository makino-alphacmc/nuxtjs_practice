# セクション 6: ページネーション - データの分割表示

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
│           └── useArrayOperations.ts # getPaginatedPosts() メソッド
├── components/                       # コンポーネント（必須）
│   └── array-operations/
│       └── p1/
│           └── PaginationExample.vue # ページネーションのコンポーネント
└── pages/
    └── array-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_map.md            # map の詳細解説
        │   ├── s2_filter.md         # filter の詳細解説
        │   ├── s3_reduce.md         # reduce の詳細解説
        │   ├── s4_find.md           # find の詳細解説
        │   ├── s5_sort.md           # ソート の詳細解説
        │   ├── s6_pagination.md    # このファイル
        │   └── s7_crud.md           # CRUD操作 の詳細解説
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/array-operations/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割 - `components/array-operations/p1/[^`]*.vue` で再利用性・保守性を向上（props で受け取る）
3. **ロジックの分離** - `composables/array-operations/p1/useArrayOperations.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## ページネーションとは、なぜ必要なのか？

### ページネーションとは

ページネーションは、**大量のデータを分割して表示する**機能です。1ページあたりの件数を設定し、前へ・次へボタンでページを移動することで、大量のデータを効率的に表示できます。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面でページネーションが必要です：

1. **大量データの表示** - 1000件以上のデータを一度に表示するとパフォーマンスが低下
2. **ユーザー体験の向上** - 必要なデータだけを表示することで、見やすくなる
3. **パフォーマンスの最適化** - DOM要素を減らすことで、レンダリング速度が向上

これらを実装するために、ページネーションを使ったデータの分割表示方法を理解する必要があります。

### 主な特徴

- **データの分割**: `slice`メソッドで配列を分割
- **ページ数の計算**: 総件数と1ページあたりの件数から総ページ数を計算
- **現在ページの管理**: 現在表示しているページ番号を状態で管理
- **前へ・次へボタン**: ページ移動のためのUI

## 一般的な使用例

### 基本的な使い方

```typescript
// 配列を分割
const itemsPerPage = 10
const currentPage = 1
const startIndex = (currentPage - 1) * itemsPerPage
const endIndex = startIndex + itemsPerPage
const paginated = items.slice(startIndex, endIndex)
```

### よくある使用パターン

1. **基本的なページネーション**

   ```typescript
   const getPaginated = (items: Post[], page: number, perPage: number) => {
   	const start = (page - 1) * perPage
   	return items.slice(start, start + perPage)
   }
   ```

2. **総ページ数の計算**
   ```typescript
   const totalPages = Math.ceil(items.length / itemsPerPage)
   ```

3. **ページ番号の範囲チェック**
   ```typescript
   const isValidPage = (page: number) => {
   	return page >= 1 && page <= totalPages
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

// slice の戻り値も Post[] 型になる
const paginated: Post[] = posts.slice(startIndex, endIndex)
```

**型定義のメリット：**

- IDE が自動補完してくれる
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

	// 6. ページネーション - データの分割表示
	const getPaginatedPosts = (currentPage: number, itemsPerPage: number) => {
		const startIndex = (currentPage - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		return posts.value.slice(startIndex, endIndex)
	}

	const getTotalPages = (itemsPerPage: number) => {
		return Math.ceil(posts.value.length / itemsPerPage)
	}

	return {
		posts: readonly(posts),
		getPaginatedPosts,
		getTotalPages,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `slice(startIndex, endIndex)`: 配列の指定範囲を抽出（元の配列を変更しない）
- `(currentPage - 1) * itemsPerPage`: 開始インデックスを計算
- `Math.ceil(posts.value.length / itemsPerPage)`: 総ページ数を計算（切り上げ）

#### 2-2. コンポーネントでの使用

```typescript
// pages/array-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

const { getPaginatedPosts, getTotalPages } = useArrayOperations()

const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => {
	return getTotalPages(itemsPerPage.value)
})

const paginatedPosts = computed(() => {
	return getPaginatedPosts(currentPage.value, itemsPerPage.value)
})
</script>
```

### 3. コンポーネントの分割 - `components/array-operations/p1/[^`]*.vue` で再利用性・保守性を向上（props で受け取る）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/PaginationExample.vue の作成

```vue
<!-- components/array-operations/p1/PaginationExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				6. ページネーション - データの分割表示
			</h2>
		</template>
		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<UInput
					:model-value="itemsPerPage"
					@update:model-value="$emit('update:itemsPerPage', $event)"
					type="number"
					placeholder="1ページあたりの件数"
					label="1ページあたりの件数"
					class="w-48"
					:min="1"
					:max="100"
				/>
			</div>
			<div v-if="paginatedPosts.length > 0" class="space-y-4">
				<div class="flex items-center justify-between">
					<p class="text-sm text-neutral-400">
						ページ {{ currentPage }} / {{ totalPages }}
						（全 {{ totalItems }}件中 {{ startIndex + 1 }}-{{ endIndex }}件を表示）
					</p>
					<div class="flex gap-2">
						<UButton
							@click="$emit('prevPage')"
							:disabled="currentPage === 1"
							color="gray"
							variant="outline"
						>
							前へ
						</UButton>
						<UButton
							@click="$emit('nextPage')"
							:disabled="currentPage === totalPages"
							color="gray"
							variant="outline"
						>
							次へ
						</UButton>
					</div>
				</div>
				<!-- ページネーション結果の表示 -->
			</div>
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Post } from '~/types/array-operations/p1/api'

export default defineComponent({
	name: 'PaginationExample',
	props: {
		currentPage: {
			type: Number,
			required: true,
		},
		itemsPerPage: {
			type: Number,
			required: true,
		},
		totalPages: {
			type: Number,
			required: true,
		},
		totalItems: {
			type: Number,
			required: true,
		},
		startIndex: {
			type: Number,
			required: true,
		},
		endIndex: {
			type: Number,
			required: true,
		},
		paginatedPosts: {
			type: Array as () => Post[],
			required: true,
		},
	},
	emits: ['update:itemsPerPage', 'prevPage', 'nextPage'],
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
		<PaginationExample
			v-model:items-per-page="itemsPerPage"
			:current-page="currentPage"
			:total-pages="totalPages"
			:total-items="posts.length"
			:start-index="startIndex"
			:end-index="endIndex"
			:paginated-posts="paginatedPosts"
			@prev-page="currentPage = Math.max(1, currentPage - 1)"
			@next-page="currentPage = Math.min(totalPages, currentPage + 1)"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components を明示的にインポート
import PaginationExample from '~/components/array-operations/p1/PaginationExample.vue'
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
import PaginationExample from '~/components/array-operations/p1/PaginationExample.vue'

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

#### 5-1. ページ情報の表示

```vue
<div class="flex items-center justify-between">
	<p class="text-sm text-neutral-400">
		ページ {{ currentPage }} / {{ totalPages }}
		（全 {{ totalItems }}件中 {{ startIndex + 1 }}-{{ endIndex }}件を表示）
	</p>
	<div class="flex gap-2">
		<UButton
			@click="$emit('prevPage')"
			:disabled="currentPage === 1"
			color="gray"
			variant="outline"
		>
			前へ
		</UButton>
		<UButton
			@click="$emit('nextPage')"
			:disabled="currentPage === totalPages"
			color="gray"
			variant="outline"
		>
			次へ
		</UButton>
	</div>
</div>
```

**コードの説明：**

- `:disabled="currentPage === 1"`: 最初のページでは「前へ」ボタンを無効化
- `:disabled="currentPage === totalPages"`: 最後のページでは「次へ」ボタンを無効化
- `{{ startIndex + 1 }}`: 表示開始位置（1ベースで表示）

#### 5-2. ページネーション結果の表示

```vue
<div class="space-y-2">
	<div
		v-for="post in paginatedPosts"
		:key="post.id"
		class="p-3 bg-neutral-900 rounded-lg"
	>
		<p class="text-sm text-neutral-200">
			ID {{ post.id }}: {{ post.title }}
		</p>
	</div>
</div>
```

**コードの説明：**

- `paginatedPosts`: 現在のページに表示するデータのみを含む配列
- `v-for`: ページネーションされたデータをループ処理

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
<!-- components/array-operations/p1/PaginationExample.vue -->
<template>
	<UCard>
		<!-- ページネーションのUI（props で受け取る） -->
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
const getPaginatedPosts = (currentPage: number, itemsPerPage: number) => {
	const startIndex = (currentPage - 1) * itemsPerPage
	return posts.value.slice(startIndex, startIndex + itemsPerPage)
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
import PaginationExample from '~/components/array-operations/p1/PaginationExample.vue'

// Types
import type { Post } from '~/types/array-operations/p1/api'
```

**メリット：**

- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

## まとめ

ページネーションを使うことで、以下のメリットが得られます：

1. **大量データの表示**: 大量のデータを効率的に表示できる
2. **パフォーマンスの向上**: DOM要素を減らすことで、レンダリング速度が向上
3. **ユーザー体験の向上**: 必要なデータだけを表示することで、見やすくなる
4. **再利用性**: Composables とコンポーネントの分割 - `components/array-operations/p1/[^`]*.vue` で再利用性・保守性を向上（props で受け取る）

### 実装の流れ（統一パターン）

1. **型定義を作成**: `types/array-operations/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/array-operations/p1/useArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成**: `components/array-operations/p1/PaginationExample.vue` で UI を分割（props で受け取る）
4. **明示的なインポート**: 深い階層では自動インポートに頼らず明示的にインポート
5. **メインコンポーネントで統合**: `pages/array-operations/p1/index.vue` で全てを組み合わせる

### 重要なポイント

- **slice メソッド**: 配列を分割する際は`slice`を使用（元の配列を変更しない）
- **ページ数の計算**: `Math.ceil`で切り上げて総ページ数を計算
- **範囲チェック**: 現在のページが有効な範囲内かチェック

このセクションでは、ページネーションの基本的な使い方と、実務で必須の 4 つの概念（型定義・コンポーネント分割・ロジックの分離・明示的なインポート）を学びました。次のセクションでは、CRUD操作を使ったデータの追加・削除・更新方法を学びます。

