# セクション 2: 配列操作 - 検索・フィルタ・ソート・ページネーション

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
│           └── useCrudWithArrayOperations.ts # 配列操作のロジック
├── components/                       # コンポーネント（必須）
│   └── crud-operations/
│       └── p1/
│           └── PostListWithOperations.vue # 配列操作のUI
└── pages/
    └── crud-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_get.md            # GET の詳細解説
        │   ├── s2_array-operations.md # このファイル
        │   ├── s3_post.md           # POST の詳細解説
        │   ├── s4_put.md            # PUT の詳細解説
        │   └── s5_delete.md         # DELETE の詳細解説
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/http-signal/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/crud-operations/p1/PostListWithOperations.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/crud-operations/p1/useCrudWithArrayOperations.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## 配列操作とは、なぜ必要なのか？

### 配列操作とは

配列操作は、**取得したデータに対して検索・フィルタ・ソート・ページネーションなどの処理を適用する**機能です。大量のデータを効率的に表示・操作するために必要です。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面で配列操作が必要です：

1. **検索機能** - ユーザーがキーワードでデータを検索
2. **フィルタリング** - 条件に合致するデータのみを表示
3. **ソート** - データを任意の順序で並び替え
4. **ページネーション** - 大量のデータを分割して表示

これらを実装するために、配列操作の方法を理解する必要があります。

### 主な特徴

- **リアルタイム処理**: ユーザーの操作に即座に反応
- **組み合わせ可能**: 検索・フィルタ・ソートを組み合わせて使用
- **パフォーマンス**: 大量のデータを効率的に処理
- **ユーザー体験**: 必要なデータだけを表示することで、見やすくなる

## 実装する配列操作

### 1. 検索（Search）

タイトルでリアルタイム検索を行います。

```typescript
// 検索クエリでフィルタリング
if (searchQuery.value.trim()) {
	const query = searchQuery.value.toLowerCase()
	result = result.filter((post) => post.title.toLowerCase().includes(query))
}
```

### 2. フィルタ（Filter）

ユーザーIDでデータを絞り込みます。

```typescript
// ユーザーIDでフィルタリング
if (filterUserId.value !== null) {
	result = result.filter((post) => post.userId === filterUserId.value)
}
```

### 3. ソート（Sort）

ID、タイトル、ユーザーIDでソート（昇順・降順）します。

```typescript
// ソート処理
result.sort((a, b) => {
	let aValue: string | number
	let bValue: string | number

	if (sortBy.value === 'id') {
		aValue = a.id
		bValue = b.id
	} else if (sortBy.value === 'title') {
		aValue = a.title
		bValue = b.title
	} else {
		aValue = a.userId
		bValue = b.userId
	}

	if (aValue < bValue) {
		return sortOrder.value === 'asc' ? -1 : 1
	}
	if (aValue > bValue) {
		return sortOrder.value === 'asc' ? 1 : -1
	}
	return 0
})
```

### 4. ページネーション（Pagination）

大量のデータを分割して表示します。

```typescript
// ページネーション
const totalPages = computed(() => {
	return Math.ceil(filteredAndSortedPosts.value.length / itemsPerPage.value)
})

const paginatedPosts = computed(() => {
	const startIndex = (currentPage.value - 1) * itemsPerPage.value
	const endIndex = startIndex + itemsPerPage.value
	return filteredAndSortedPosts.value.slice(startIndex, endIndex)
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

```typescript
// types/http-signal/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}
```

#### 1-2. 型定義の使用

```typescript
import type { Post } from '~/types/http-signal/p1/api'

// 配列操作の戻り値も Post[] 型になる
const filtered: Post[] = posts.filter((post: Post) => post.userId === 1)
```

**型定義のメリット：**

- IDE が自動補完してくれる（`post.title` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useCrudWithArrayOperations.ts の作成

```typescript
// composables/crud-operations/p1/useCrudWithArrayOperations.ts
import type { Post } from '~/types/http-signal/p1/api'

export const useCrudWithArrayOperations = () => {
	const posts = useState<Post[]>('crud-operations-p1-posts', () => [])

	// 配列操作の状態管理
	const searchQuery = ref<string>('')
	const filterUserId = ref<number | null>(null)
	const sortBy = ref<'id' | 'title' | 'userId'>('id')
	const sortOrder = ref<'asc' | 'desc'>('asc')
	const currentPage = ref(1)
	const itemsPerPage = ref(10)

	/**
	 * 検索・フィルタ・ソートを適用した投稿一覧
	 */
	const filteredAndSortedPosts = computed(() => {
		let result = [...posts.value]

		// 1. 検索（タイトルで検索）
		if (searchQuery.value.trim()) {
			const query = searchQuery.value.toLowerCase()
			result = result.filter((post) => post.title.toLowerCase().includes(query))
		}

		// 2. フィルタ（ユーザーIDでフィルタ）
		if (filterUserId.value !== null) {
			result = result.filter((post) => post.userId === filterUserId.value)
		}

		// 3. ソート
		result.sort((a, b) => {
			let aValue: string | number
			let bValue: string | number

			if (sortBy.value === 'id') {
				aValue = a.id
				bValue = b.id
			} else if (sortBy.value === 'title') {
				aValue = a.title
				bValue = b.title
			} else {
				aValue = a.userId
				bValue = b.userId
			}

			if (aValue < bValue) {
				return sortOrder.value === 'asc' ? -1 : 1
			}
			if (aValue > bValue) {
				return sortOrder.value === 'asc' ? 1 : -1
			}
			return 0
		})

		return result
	})

	/**
	 * ページネーション
	 */
	const totalPages = computed(() => {
		return Math.ceil(filteredAndSortedPosts.value.length / itemsPerPage.value)
	})

	const paginatedPosts = computed(() => {
		const startIndex = (currentPage.value - 1) * itemsPerPage.value
		const endIndex = startIndex + itemsPerPage.value
		return filteredAndSortedPosts.value.slice(startIndex, endIndex)
	})

	// 検索・フィルタが変更されたら、1ページ目に戻す
	watch([searchQuery, filterUserId], () => {
		currentPage.value = 1
	})

	return {
		searchQuery,
		filterUserId,
		sortBy,
		sortOrder,
		currentPage,
		itemsPerPage,
		filteredAndSortedPosts,
		totalPages,
		paginatedPosts,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `computed`: リアクティブな計算プロパティ。依存する値が変更されると自動的に再計算
- `filter`: 条件に合致する要素のみを抽出
- `sort`: 配列を並び替え
- `slice`: 配列を分割（ページネーション）
- `watch`: 値の変更を監視して、ページを1ページ目に戻す

#### 2-2. コンポーネントでの使用

```typescript
// pages/crud-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p1/useCrudWithArrayOperations'

const {
	searchQuery,
	filterUserId,
	sortBy,
	sortOrder,
	currentPage,
	itemsPerPage,
	filteredAndSortedPosts,
	totalPages,
	paginatedPosts,
} = useCrudWithArrayOperations()
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/PostListWithOperations.vue の作成

```vue
<!-- components/crud-operations/p1/PostListWithOperations.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				投稿一覧（検索・フィルタ・ソート・ページネーション付き）
			</h2>
		</template>
		<div class="space-y-4">
			<!-- 検索・フィルタ・ソート -->
			<div class="space-y-4 p-4 bg-neutral-900 rounded-lg">
				<!-- 検索 -->
				<div class="flex items-center gap-4">
					<UInput
						:model-value="searchQuery"
						@update:model-value="$emit('update:searchQuery', $event)"
						placeholder="タイトルで検索..."
						label="検索"
						class="flex-1"
					/>
				</div>

				<!-- フィルタ -->
				<div class="flex items-center gap-4">
					<UInput
						:model-value="filterUserId"
						@update:model-value="$emit('update:filterUserId', $event)"
						type="number"
						placeholder="ユーザーID（1-10）"
						label="ユーザーIDでフィルタ"
						class="w-48"
					/>
				</div>

				<!-- ソート -->
				<div class="flex items-center gap-2 flex-wrap">
					<UButton
						:color="sortBy === 'id' ? 'primary' : 'gray'"
						@click="$emit('update:sortBy', 'id')"
						variant="outline"
						size="sm"
					>
						ID順
					</UButton>
					<!-- その他のソートボタン -->
				</div>
			</div>

			<!-- 投稿一覧 -->
			<div v-if="paginatedPosts.length > 0" class="space-y-2">
				<div
					v-for="post in paginatedPosts"
					:key="post.id"
					class="p-4 bg-neutral-900 rounded-lg"
				>
					<!-- 投稿の表示 -->
				</div>
			</div>

			<!-- ページネーション -->
			<div class="flex items-center justify-between pt-4 border-t border-neutral-800">
				<!-- ページネーションUI -->
			</div>
		</div>
	</UCard>
</template>
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
			:posts="posts"
			:paginated-posts="paginatedPosts"
			:search-query="searchQuery"
			:filter-user-id="filterUserId"
			:sort-by="sortBy"
			:sort-order="sortOrder"
			:current-page="currentPage"
			:total-pages="totalPages"
			:items-per-page="itemsPerPage"
			@update:searchQuery="searchQuery = $event"
			@update:filterUserId="filterUserId = $event ? Number($event) : null"
			@update:sortBy="sortBy = $event"
			@toggleSortOrder="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
		/>
	</div>
</template>
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
const filteredAndSortedPosts = computed(() => {
	let result = [...posts.value]
	// 検索・フィルタ・ソート処理
	return result
})
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/crud-operations/p1/PostListWithOperations.vue -->
<template>
	<UCard>
		<!-- 配列操作のUI -->
	</UCard>
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

## まとめ

配列操作を使うことで、以下のメリットが得られます：

1. **検索機能**: ユーザーがキーワードでデータを検索できる
2. **フィルタリング**: 条件に合致するデータのみを表示できる
3. **ソート**: データを任意の順序で並び替えられる
4. **ページネーション**: 大量のデータを効率的に表示できる
5. **再利用性**: Composables とコンポーネントの分割により、コードの再利用性が向上する

### 実装の流れ

1. **型定義を作成**: `types/http-signal/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/crud-operations/p1/useCrudWithArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成**: `components/crud-operations/p1/PostListWithOperations.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/crud-operations/p1/index.vue` で全てを組み合わせる

このセクションでは、配列操作の基本的な使い方と、実務で必須の 4 つの概念（型定義・Composables・コンポーネント分割・明示的なインポート）を学びました。次のセクションでは、POST リクエストを使った新規投稿の作成方法を学びます。

