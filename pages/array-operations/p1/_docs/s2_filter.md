# セクション 2: filter - データの絞り込み

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
│           └── useArrayOperations.ts # getFilteredPosts() メソッド
├── components/                       # コンポーネント（必須）
│   └── array-operations/
│       └── p1/
│           └── FilterExample.vue     # filter操作のコンポーネント
└── pages/
    └── array-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_map.md            # map の詳細解説
        │   ├── s2_filter.md         # このファイル
        │   ├── s3_reduce.md         # reduce の詳細解説
        │   ├── s4_find.md           # find の詳細解説
        │   ├── s5_sort.md           # ソート の詳細解説
        │   ├── s6_pagination.md     # ページネーション の詳細解説
        │   └── s7_crud.md           # CRUD操作 の詳細解説
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/array-operations/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/array-operations/p1/FilterExample.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/array-operations/p1/useArrayOperations.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## filter とは、なぜ必要なのか？

### filter とは

`filter`は、配列の各要素に対して条件をチェックし、**条件に合致する要素だけを抽出**して新しい配列を生成するメソッドです。元の配列を変更せず、条件に合致する要素のみを含む新しい配列を返します。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面でデータの絞り込みが必要です：

1. **検索機能** - キーワードで検索、条件でフィルタリング
2. **カテゴリ別表示** - カテゴリで絞り込み、タグでフィルタリング
3. **ステータス別表示** - 完了/未完了、公開/非公開などでフィルタリング

これらを実装するために、`filter`を使ったデータの絞り込み方法を理解する必要があります。

### 主な特徴

- **元の配列を変更しない**: 新しい配列を生成する（イミュータブル）
- **条件に合致する要素のみ抽出**: 条件関数が`true`を返す要素のみを含む
- **新しい配列を返す**: フィルタリング結果を新しい配列として返す
- **関数型プログラミング**: 副作用がない純粋関数として使用できる

## 一般的な使用例

### 基本的な使い方

```typescript
// 偶数のみを抽出
const numbers = [1, 2, 3, 4, 5, 6]
const evens = numbers.filter((n) => n % 2 === 0)
// 結果: [2, 4, 6]
```

### よくある使用パターン

1. **条件でフィルタリング**

   ```typescript
   const filtered = posts.filter((post) => post.userId === 1)
   ```

2. **複数条件でフィルタリング**
   ```typescript
   const filtered = posts.filter((post) => {
   	return post.userId === 1 && post.title.length > 10
   })
   ```

3. **検索機能**
   ```typescript
   const filtered = posts.filter((post) => 
   	post.title.toLowerCase().includes(searchTerm.toLowerCase())
   )
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

// filter の戻り値も Post[] 型になる
const filtered: Post[] = posts.filter((post: Post) => post.userId === 1)
```

**型定義のメリット：**

- IDE が自動補完してくれる（`post.userId` など）
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

	// 2. filter - データの絞り込み
	const getFilteredPosts = (userId: number | null) => {
		if (userId === null) {
			return posts.value
		}
		return posts.value.filter((post) => post.userId === userId)
	}

	return {
		posts: readonly(posts),
		getFilteredPosts,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `filter`: 条件に合致する要素のみを抽出
- `userId === null`: フィルタ条件がない場合は全件を返す
- `post.userId === userId`: ユーザーIDが一致する投稿のみを抽出

#### 2-2. コンポーネントでの使用

```typescript
// pages/array-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

const { getFilteredPosts } = useArrayOperations()

const filterUserId = ref<number | null>(null)
const filteredPosts = computed(() => {
	return getFilteredPosts(filterUserId.value)
})
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/FilterExample.vue の作成

```vue
<!-- components/array-operations/p1/FilterExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				2. filter - データの絞り込み
			</h2>
		</template>
		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<UInput
					:model-value="filterUserId"
					@update:model-value="$emit('update:filterUserId', $event)"
					type="number"
					placeholder="ユーザーID（1-10）"
					label="ユーザーIDでフィルタ"
					class="w-48"
				/>
				<UButton
					@click="$emit('clearFilter')"
					color="gray"
					variant="outline"
				>
					クリア
				</UButton>
			</div>
			<!-- フィルタ結果の表示 -->
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Post } from '~/types/array-operations/p1/api'

export default defineComponent({
	name: 'FilterExample',
	props: {
		filterUserId: {
			type: Number as () => number | null,
			default: null,
		},
		filteredPosts: {
			type: Array as () => Post[],
			required: true,
		},
		hasData: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['update:filterUserId', 'clearFilter'],
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
		<FilterExample
			v-model:filter-user-id="filterUserId"
			:filtered-posts="filteredPosts"
			:has-data="posts.length > 0"
			@clear-filter="filterUserId = null"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components を明示的にインポート
import FilterExample from '~/components/array-operations/p1/FilterExample.vue'
</script>
```

### 4. 明示的なインポート（トラブル回避）

Nuxt 3 では自動インポート機能がありますが、深い階層（`composables/array-operations/p1/` など）では機能しない場合があります。トラブルを避けるため、**必要なものは明示的にインポート**することを推奨します。

#### 4-1. 明示的なインポートの実装

```typescript
// pages/array-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components を明示的にインポート
import FilterExample from '~/components/array-operations/p1/FilterExample.vue'

// 型定義を明示的にインポート
import type { Post } from '~/types/array-operations/p1/api'
```

**明示的なインポートのメリット：**

- ✅ **確実性**: 自動インポートが機能しない場合でも確実に動作する
- ✅ **可読性**: どこから来ているかが明確で、コードレビューがしやすい
- ✅ **保守性**: 依存関係が明確で、リファクタリングが安全

### 5. Template 部分の実装

#### 5-1. フィルタ入力

```vue
<div class="flex items-center gap-4">
	<UInput
		:model-value="filterUserId"
		@update:model-value="$emit('update:filterUserId', $event)"
		type="number"
		placeholder="ユーザーID（1-10）"
		label="ユーザーIDでフィルタ"
		class="w-48"
	/>
	<UButton
		@click="$emit('clearFilter')"
		color="gray"
		variant="outline"
	>
		クリア
	</UButton>
</div>
```

**コードの説明：**

- `v-model`の代わりに`:model-value`と`@update:model-value`を使用（親子間の双方向バインディング）
- `type="number"`: 数値入力フィールド
- `@click="$emit('clearFilter')"`: クリアボタンクリック時に親コンポーネントにイベントを発行

#### 5-2. フィルタ結果の表示

```vue
<div v-if="filteredPosts.length > 0" class="space-y-2">
	<p class="text-sm text-neutral-400">
		フィルタ結果: {{ filteredPosts.length }}件
	</p>
	<div
		v-for="post in filteredPosts.slice(0, 5)"
		:key="post.id"
		class="p-3 bg-neutral-900 rounded-lg"
	>
		<p class="text-sm text-neutral-200">
			ID {{ post.id }}: {{ post.title }}
		</p>
	</div>
	<p v-if="filteredPosts.length > 5" class="text-xs text-neutral-500">
		他 {{ filteredPosts.length - 5 }}件...
	</p>
</div>
```

**コードの説明：**

- `v-if="filteredPosts.length > 0"`: フィルタ結果が存在する場合のみ表示
- `filteredPosts.slice(0, 5)`: 最初の5件のみ表示（表示件数を制限）
- `{{ filteredPosts.length }}`: フィルタ結果の件数を表示

## 実装の全体像

このセクションでは、実務で必須の 4 つの概念を実装しました：

### 1. 型定義の明確化

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

- `any` の使用を減らし、実行時エラーを防ぐ
- IDE の補完機能が働く
- チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables）

```typescript
// composables/array-operations/p1/useArrayOperations.ts
const getFilteredPosts = (userId: number | null) => {
	if (userId === null) {
		return posts.value
	}
	return posts.value.filter((post) => post.userId === userId)
}
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/array-operations/p1/FilterExample.vue -->
<template>
	<UCard>
		<!-- filter操作のUI -->
	</UCard>
</template>
```

**メリット：**

- ファイルが肥大化するのを防ぐ
- 再利用性が向上する
- 保守性が向上する

### 4. 明示的なインポート

```typescript
// pages/array-operations/p1/index.vue
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'
import FilterExample from '~/components/array-operations/p1/FilterExample.vue'
```

**メリット：**

- 自動インポートが機能しない場合でも確実に動作する
- 依存関係が明確で、リファクタリングが安全

## まとめ

`filter`を使うことで、以下のメリットが得られます：

1. **データの絞り込み**: 条件に合致する要素のみを抽出できる
2. **イミュータブル**: 元の配列を変更せず、安全にデータを操作できる
3. **検索・フィルタ機能**: ユーザーが条件を指定してデータを絞り込める
4. **再利用性**: Composables とコンポーネントの分割により、コードの再利用性が向上する

### 実装の流れ

1. **型定義を作成**: `types/array-operations/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/array-operations/p1/useArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成**: `components/array-operations/p1/FilterExample.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/array-operations/p1/index.vue` で全てを組み合わせる

このセクションでは、`filter`の基本的な使い方と、実務で必須の 4 つの概念（型定義・Composables・コンポーネント分割・明示的なインポート）を学びました。次のセクションでは、`reduce`を使ったデータの集計方法を学びます。

