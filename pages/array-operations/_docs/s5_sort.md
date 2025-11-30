# セクション 5: ソート - データの並び替え

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
│           └── useArrayOperations.ts # getSortedPosts() メソッド
├── components/                       # コンポーネント（必須）
│   └── array-operations/
│       └── p1/
│           └── SortExample.vue       # ソート操作のコンポーネント
└── pages/
    └── array-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_map.md            # map の詳細解説
        │   ├── s2_filter.md         # filter の詳細解説
        │   ├── s3_reduce.md         # reduce の詳細解説
        │   ├── s4_find.md           # find の詳細解説
        │   ├── s5_sort.md           # このファイル
        │   ├── s6_pagination.md     # ページネーション の詳細解説
        │   └── s7_crud.md           # CRUD操作 の詳細解説
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/array-operations/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/array-operations/p1/SortExample.vue` で再利用性・保守性を向上（props で受け取る）
3. **ロジックの分離** - `composables/array-operations/p1/useArrayOperations.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## ソートとは、なぜ必要なのか？

### ソートとは

`sort`は、配列の要素を**並び替える**メソッドです。比較関数を指定することで、昇順・降順、または任意の順序で並び替えることができます。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面でデータの並び替えが必要です：

1. **一覧表示の並び替え** - 日付順、価格順、名前順など
2. **ユーザーの好みに合わせた表示** - 人気順、新着順など
3. **データの整理** - アルファベット順、数値順など

これらを実装するために、`sort`を使ったデータの並び替え方法を理解する必要があります。

### 主な特徴

- **元の配列を変更する**: `sort`は元の配列を直接変更する（ミュータブル）
- **比較関数を指定**: 並び替えのルールを比較関数で指定
- **昇順・降順**: 比較関数の戻り値で昇順・降順を制御
- **注意**: 元の配列を変更したくない場合は、コピーを作成してからソート

### 注意事項

`sort`は元の配列を変更するため、元の配列を保持したい場合は、スプレッド演算子（`[...array]`）でコピーを作成してからソートします。

## 一般的な使用例

### 基本的な使い方

```typescript
// 数値の昇順ソート
const numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort((a, b) => a - b)
// 結果: [1, 1, 2, 3, 4, 5, 6, 9]（元の配列が変更される）
```

### よくある使用パターン

1. **ID順でソート**

   ```typescript
   const sorted = [...posts].sort((a, b) => a.id - b.id)
   ```

2. **文字列順でソート**
   ```typescript
   const sorted = [...posts].sort((a, b) => a.title.localeCompare(b.title))
   ```

3. **降順でソート**
   ```typescript
   const sorted = [...posts].sort((a, b) => b.id - a.id)
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

// sort の戻り値も Post[] 型になる
const sorted: Post[] = [...posts].sort((a: Post, b: Post) => a.id - b.id)
```

**型定義のメリット：**

- IDE が自動補完してくれる（`a.id` など）
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

	// 5. ソート - データの並び替え
	const getSortedPosts = (
		sortBy: 'id' | 'title' | 'userId',
		sortOrder: 'asc' | 'desc'
	) => {
		const sorted = [...posts.value] // 元の配列を変更しないようにコピー
		sorted.sort((a, b) => {
			let aValue: string | number
			let bValue: string | number

			if (sortBy === 'id') {
				aValue = a.id
				bValue = b.id
			} else if (sortBy === 'title') {
				aValue = a.title
				bValue = b.title
			} else {
				aValue = a.userId
				bValue = b.userId
			}

			if (aValue < bValue) {
				return sortOrder === 'asc' ? -1 : 1
			}
			if (aValue > bValue) {
				return sortOrder === 'asc' ? 1 : -1
			}
			return 0
		})
		return sorted
	}

	return {
		posts: readonly(posts),
		getSortedPosts,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `[...posts.value]`: スプレッド演算子で配列をコピー（元の配列を変更しない）
- `sort`: 比較関数で並び替え
- `sortOrder === 'asc' ? -1 : 1`: 昇順の場合は`-1`、降順の場合は`1`を返す
- `return 0`: 値が等しい場合は順序を変更しない

#### 2-2. コンポーネントでの使用

```typescript
// pages/array-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

const { getSortedPosts } = useArrayOperations()

const sortBy = ref<'id' | 'title' | 'userId'>('id')
const sortOrder = ref<'asc' | 'desc'>('asc')
const sortedPosts = computed(() => {
	return getSortedPosts(sortBy.value, sortOrder.value)
})
</script>
```

### 2. コンポーネント分割（UI の単一責任）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/SortExample.vue の作成

```vue
<!-- components/array-operations/p1/SortExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				5. ソート - データの並び替え
			</h2>
		</template>
		<div class="space-y-4">
			<div class="flex gap-2">
				<UButton
					:color="sortBy === 'id' ? 'primary' : 'gray'"
					@click="$emit('update:sortBy', 'id')"
					variant="outline"
				>
					ID順
				</UButton>
				<UButton
					:color="sortBy === 'title' ? 'primary' : 'gray'"
					@click="$emit('update:sortBy', 'title')"
					variant="outline"
				>
					タイトル順
				</UButton>
				<UButton
					:color="sortBy === 'userId' ? 'primary' : 'gray'"
					@click="$emit('update:sortBy', 'userId')"
					variant="outline"
				>
					ユーザーID順
				</UButton>
				<UButton
					:color="sortOrder === 'asc' ? 'primary' : 'gray'"
					@click="$emit('toggleSortOrder')"
					variant="outline"
				>
					{{ sortOrder === 'asc' ? '昇順' : '降順' }}
				</UButton>
			</div>
			<!-- ソート結果の表示 -->
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Post } from '~/types/array-operations/p1/api'

export default defineComponent({
	name: 'SortExample',
	props: {
		sortBy: {
			type: String as () => 'id' | 'title' | 'userId',
			required: true,
		},
		sortOrder: {
			type: String as () => 'asc' | 'desc',
			required: true,
		},
		sortedPosts: {
			type: Array as () => Post[],
			required: true,
		},
	},
	emits: ['update:sortBy', 'toggleSortOrder'],
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
		<SortExample
			v-model:sort-by="sortBy"
			v-model:sort-order="sortOrder"
			:sorted-posts="sortedPosts"
			@toggle-sort-order="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components を明示的にインポート
import SortExample from '~/components/array-operations/p1/SortExample.vue'
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
import SortExample from '~/components/array-operations/p1/SortExample.vue'

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

#### 5-1. ソートボタン

```vue
<div class="flex gap-2">
	<UButton
		:color="sortBy === 'id' ? 'primary' : 'gray'"
		@click="$emit('update:sortBy', 'id')"
		variant="outline"
	>
		ID順
	</UButton>
	<UButton
		:color="sortBy === 'title' ? 'primary' : 'gray'"
		@click="$emit('update:sortBy', 'title')"
		variant="outline"
	>
		タイトル順
	</UButton>
	<UButton
		:color="sortOrder === 'asc' ? 'primary' : 'gray'"
		@click="$emit('toggleSortOrder')"
		variant="outline"
	>
		{{ sortOrder === 'asc' ? '昇順' : '降順' }}
	</UButton>
</div>
```

**コードの説明：**

- `:color`: 選択されている場合は`primary`、そうでない場合は`gray`
- `@click="$emit('update:sortBy', 'id')"`: ソート基準を変更するイベントを発行
- `@click="$emit('toggleSortOrder')"`: 昇順・降順を切り替えるイベントを発行

#### 5-2. ソート結果の表示

```vue
<div v-if="sortedPosts.length > 0" class="space-y-2">
	<div
		v-for="post in sortedPosts.slice(0, 10)"
		:key="post.id"
		class="p-3 bg-neutral-900 rounded-lg"
	>
		<p class="text-sm text-neutral-200">
			ID {{ post.id }} | ユーザーID {{ post.userId }} | {{ post.title }}
		</p>
	</div>
	<p v-if="sortedPosts.length > 10" class="text-xs text-neutral-500">
		他 {{ sortedPosts.length - 10 }}件...
	</p>
</div>
```

**コードの説明：**

- `sortedPosts.slice(0, 10)`: 最初の10件のみ表示
- `{{ post.id }}`: ソートされた順序でIDを表示

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
<!-- components/array-operations/p1/SortExample.vue -->
<template>
	<UCard>
		<!-- ソート操作のUI（props で受け取る） -->
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
const getSortedPosts = (sortBy: 'id' | 'title' | 'userId', sortOrder: 'asc' | 'desc') => {
	const sorted = [...posts.value] // コピーを作成
	sorted.sort((a, b) => {
		// 比較ロジック
	})
	return sorted
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
import SortExample from '~/components/array-operations/p1/SortExample.vue'

// Types
import type { Post } from '~/types/array-operations/p1/api'
```

**メリット：**

- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

## まとめ

ソートを使うことで、以下のメリットが得られます：

1. **データの並び替え**: 配列の要素を任意の順序で並び替えられる
2. **ユーザー体験の向上**: ユーザーが好みの順序でデータを表示できる
3. **柔軟性**: 複数の基準でソートできる
4. **再利用性**: Composables とコンポーネントの分割により、コードの再利用性が向上する

### 実装の流れ（統一パターン）

1. **型定義を作成**: `types/array-operations/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/array-operations/p1/useArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成**: `components/array-operations/p1/SortExample.vue` で UI を分割（props で受け取る）
4. **明示的なインポート**: 深い階層では自動インポートに頼らず明示的にインポート
5. **メインコンポーネントで統合**: `pages/array-operations/p1/index.vue` で全てを組み合わせる

### 重要なポイント

- **元の配列を変更しない**: `[...array]`でコピーを作成してからソート
- **比較関数**: 昇順・降順を制御する比較関数を正しく実装
- **型安全性**: 型定義を活用して、実行時エラーを防ぐ

このセクションでは、ソートの基本的な使い方と、実務で必須の 4 つの概念（型定義・コンポーネント分割・ロジックの分離・明示的なインポート）を学びました。次のセクションでは、ページネーションを使ったデータの分割表示方法を学びます。

