# セクション 3: reduce - 集計

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
│           └── useArrayOperations.ts # getUserPostCounts computed
├── components/                       # コンポーネント（必須）
│   └── array-operations/
│       └── p1/
│           └── ReduceExample.vue    # reduce操作のコンポーネント
└── pages/
    └── array-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_map.md            # map の詳細解説
        │   ├── s2_filter.md         # filter の詳細解説
        │   ├── s3_reduce.md         # このファイル
        │   ├── s4_find.md           # find の詳細解説
        │   ├── s5_sort.md           # ソート の詳細解説
        │   ├── s6_pagination.md     # ページネーション の詳細解説
        │   └── s7_crud.md           # CRUD操作 の詳細解説
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

**実務で必須の 4 つの概念:**

1. **型定義の明確化** - `types/array-operations/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/array-operations/p1/ReduceExample.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/array-operations/p1/useArrayOperations.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## reduce とは、なぜ必要なのか？

### reduce とは

`reduce`は、配列の各要素に対して関数を実行し、**単一の値を生成する**メソッドです。配列を集計して、合計値、最大値、最小値、オブジェクトなどを生成する際に使用します。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面でデータの集計が必要です：

1. **統計情報** - ユーザーごとの投稿数、カテゴリごとの件数など
2. **合計・平均** - 価格の合計、評価の平均など
3. **データのグループ化** - 日付ごと、カテゴリごとにグループ化

これらを実装するために、`reduce`を使ったデータの集計方法を理解する必要があります。

### 主な特徴

- **単一の値を返す**: 配列を集計して1つの値（数値、オブジェクト、文字列など）を生成
- **アキュムレータ**: 前回の結果を保持しながら処理を進める
- **初期値の設定**: 初期値を指定して集計を開始できる
- **柔軟性**: 様々な集計処理に対応できる

## 一般的な使用例

### 基本的な使い方

```typescript
// 配列の合計を計算
const numbers = [1, 2, 3, 4, 5]
const sum = numbers.reduce((acc, n) => acc + n, 0)
// 結果: 15
```

### よくある使用パターン

1. **オブジェクトの生成**

   ```typescript
   const counts = posts.reduce((acc, post) => {
   	const userId = post.userId
   	acc[userId] = (acc[userId] || 0) + 1
   	return acc
   }, {} as Record<number, number>)
   ```

2. **合計値の計算**
   ```typescript
   const total = items.reduce((acc, item) => acc + item.price, 0)
   ```

3. **最大値・最小値の取得**
   ```typescript
   const max = numbers.reduce((acc, n) => (n > acc ? n : acc), numbers[0])
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

// reduce の戻り値の型を明示
const userPostCounts: Record<number, number> = posts.reduce((acc, post: Post) => {
	const userId = post.userId
	acc[userId] = (acc[userId] || 0) + 1
	return acc
}, {} as Record<number, number>)
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

	// 3. reduce - 集計
	const getUserPostCounts = computed(() => {
		return posts.value.reduce((acc, post) => {
			const userId = post.userId
			acc[userId] = (acc[userId] || 0) + 1
			return acc
		}, {} as Record<number, number>)
	})

	return {
		posts: readonly(posts),
		getUserPostCounts,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `reduce`: 配列を集計して単一の値を生成
- `acc`: アキュムレータ（累積値）。前回の結果を保持
- `{} as Record<number, number>`: 初期値として空のオブジェクトを指定
- `acc[userId] = (acc[userId] || 0) + 1`: ユーザーIDごとの投稿数をカウント

#### 2-2. コンポーネントでの使用

```typescript
// pages/array-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

const { getUserPostCounts } = useArrayOperations()

// computed プロパティなので、.value でアクセス
const userPostCounts = computed(() => getUserPostCounts.value)
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/ReduceExample.vue の作成

```vue
<!-- components/array-operations/p1/ReduceExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				3. reduce - 集計
			</h2>
		</template>
		<div class="space-y-4">
			<p class="text-sm text-neutral-400">
				ユーザーごとの投稿数を集計
			</p>
			<div v-if="hasData" class="space-y-2">
				<div
					v-for="(count, userId) in userPostCounts"
					:key="userId"
					class="p-3 bg-neutral-900 rounded-lg flex justify-between items-center"
				>
					<span class="text-sm text-neutral-300">
						ユーザーID {{ userId }}
					</span>
					<span class="text-sm font-semibold text-neutral-100">
						{{ count }}件
					</span>
				</div>
			</div>
			<div v-else class="text-sm text-neutral-500">
				データを取得してください
			</div>
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ReduceExample',
	props: {
		userPostCounts: {
			type: Object as () => Record<number, number>,
			required: true,
		},
		hasData: {
			type: Boolean,
			required: true,
		},
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
<!-- pages/array-operations/p1/index.vue -->
<template>
	<div>
		<ReduceExample
			:user-post-counts="userPostCounts"
			:has-data="posts.length > 0"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components を明示的にインポート
import ReduceExample from '~/components/array-operations/p1/ReduceExample.vue'
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
import ReduceExample from '~/components/array-operations/p1/ReduceExample.vue'
```

**明示的なインポートのメリット：**

- ✅ **確実性**: 自動インポートが機能しない場合でも確実に動作する
- ✅ **可読性**: どこから来ているかが明確で、コードレビューがしやすい
- ✅ **保守性**: 依存関係が明確で、リファクタリングが安全

### 5. Template 部分の実装

#### 5-1. 集計結果の表示

```vue
<div v-if="hasData" class="space-y-2">
	<div
		v-for="(count, userId) in userPostCounts"
		:key="userId"
		class="p-3 bg-neutral-900 rounded-lg flex justify-between items-center"
	>
		<span class="text-sm text-neutral-300">
			ユーザーID {{ userId }}
		</span>
		<span class="text-sm font-semibold text-neutral-100">
			{{ count }}件
		</span>
	</div>
</div>
```

**コードの説明：**

- `v-for="(count, userId) in userPostCounts"`: オブジェクトをループ処理
  - `count`: 値（投稿数）
  - `userId`: キー（ユーザーID）
- `flex justify-between`: 左右に配置
- `{{ count }}件`: 集計結果を表示

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
const getUserPostCounts = computed(() => {
	return posts.value.reduce((acc, post) => {
		const userId = post.userId
		acc[userId] = (acc[userId] || 0) + 1
		return acc
	}, {} as Record<number, number>)
})
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/array-operations/p1/ReduceExample.vue -->
<template>
	<UCard>
		<!-- reduce操作のUI -->
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
import ReduceExample from '~/components/array-operations/p1/ReduceExample.vue'
```

**メリット：**

- 自動インポートが機能しない場合でも確実に動作する
- 依存関係が明確で、リファクタリングが安全

## まとめ

`reduce`を使うことで、以下のメリットが得られます：

1. **データの集計**: 配列を集計して単一の値を生成できる
2. **統計情報**: ユーザーごとの投稿数、カテゴリごとの件数などを計算できる
3. **柔軟性**: 様々な集計処理に対応できる
4. **再利用性**: Composables とコンポーネントの分割により、コードの再利用性が向上する

### 実装の流れ

1. **型定義を作成**: `types/array-operations/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/array-operations/p1/useArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成**: `components/array-operations/p1/ReduceExample.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/array-operations/p1/index.vue` で全てを組み合わせる

このセクションでは、`reduce`の基本的な使い方と、実務で必須の 4 つの概念（型定義・Composables・コンポーネント分割・明示的なインポート）を学びました。次のセクションでは、`find`を使った特定のデータの検索方法を学びます。

