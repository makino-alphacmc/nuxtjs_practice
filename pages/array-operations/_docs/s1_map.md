# セクション 1: map - データの変換・表示

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
│           └── useArrayOperations.ts # mappedPosts computed
├── components/                       # コンポーネント（必須）
│   └── array-operations/
│       └── p1/
│           └── MapExample.vue       # map操作のコンポーネント
└── pages/
    └── array-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # 全体構成の説明
        │   ├── s1_map.md            # このファイル
        │   ├── s2_filter.md         # filter の詳細解説
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
2. **コンポーネントの分割** - `components/array-operations/p1/MapExample.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/array-operations/p1/useArrayOperations.ts` で composables を活用
4. **明示的なインポート** - 深い階層では自動インポートに頼らず、明示的にインポート

## map とは、なぜ必要なのか？

### map とは

`map`は、配列の各要素に対して関数を実行し、**新しい配列を生成する**メソッドです。元の配列を変更せず、変換された新しい配列を返します。

### なぜ必要なのか？

Web アプリケーションでは、以下のような場面でデータの変換が必要です：

1. **表示形式の変更** - タイトルを大文字に変換、日付のフォーマットなど
2. **データの加工** - 価格に税額を追加、ユーザー名に敬称を付けるなど
3. **UI 用のデータ変換** - API のデータを UI 用の形式に変換

これらを実装するために、`map`を使ったデータ変換の方法を理解する必要があります。

### 主な特徴

- **元の配列を変更しない**: 新しい配列を生成する（イミュータブル）
- **各要素を変換**: 配列の各要素に対して関数を実行
- **新しい配列を返す**: 変換結果を新しい配列として返す
- **関数型プログラミング**: 副作用がない純粋関数として使用できる

## 一般的な使用例

### 基本的な使い方

```typescript
// 各要素を2倍にする
const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map((n) => n * 2)
// 結果: [2, 4, 6, 8, 10]
```

### よくある使用パターン

1. **文字列の変換**

   ```typescript
   const titles = posts.map((post) => post.title.toUpperCase())
   ```

2. **オブジェクトの変換**
   ```typescript
   const simplified = posts.map((post) => ({
   	id: post.id,
   	title: post.title,
   }))
   ```

3. **条件付き変換**
   ```typescript
   const formatted = posts.map((post) => ({
   	...post,
   	displayTitle: post.title.length > 20 
   		? post.title.substring(0, 20) + '...' 
   		: post.title,
   }))
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

**なぜ型定義が必要か？**

- ❌ **`any` を使った場合**:

  ```typescript
  const mappedPosts = posts.map((post: any) => ({
  	...post,
  	uppercaseTitle: post.titl.toUpperCase(), // タイポしてもエラーが出ない
  }))
  ```

- ✅ **型定義を使った場合**:
  ```typescript
  const mappedPosts = posts.map((post: Post) => ({
  	...post,
  	uppercaseTitle: post.title.toUpperCase(), // ✅ IDE が補完してくれる
  }))
  ```

#### 1-2. 型定義の使用

```typescript
import type { Post } from '~/types/array-operations/p1/api'

interface MappedPost extends Post {
	uppercaseTitle: string
}

const mappedPosts: MappedPost[] = posts.map((post) => ({
	...post,
	uppercaseTitle: post.title.toUpperCase(),
}))
```

**型定義のメリット：**

- IDE が自動補完してくれる（`post.title` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる
- リファクタリングが安全にできる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useArrayOperations.ts の作成

```typescript
// composables/array-operations/p1/useArrayOperations.ts
import type { Post } from '~/types/array-operations/p1/api'

export const useArrayOperations = () => {
	const posts = useState<Post[]>('array-operations-posts', () => [])

	// 1. map - データの変換・表示
	const mappedPosts = computed(() => {
		return posts.value.map((post) => ({
			...post,
			uppercaseTitle: post.title.toUpperCase(),
		}))
	})

	return {
		posts: readonly(posts),
		mappedPosts,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

**コードの説明：**

- `computed`: リアクティブな計算プロパティ。`posts.value`が変更されると自動的に再計算
- `map`: 各要素を変換して新しい配列を生成
- `...post`: スプレッド演算子で既存のプロパティをコピー
- `uppercaseTitle`: 新しく追加するプロパティ

#### 2-2. コンポーネントでの使用

```typescript
// pages/array-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// composable を使うことで、ロジックが再利用可能になる
const { mappedPosts } = useArrayOperations()
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/MapExample.vue の作成

```vue
<!-- components/array-operations/p1/MapExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				1. map - データの変換・表示
			</h2>
		</template>
		<div class="space-y-4">
			<p class="text-sm text-neutral-400">
				各投稿のタイトルを大文字に変換して表示
			</p>
			<div v-if="mappedPosts.length > 0" class="space-y-2">
				<div
					v-for="post in mappedPosts"
					:key="post.id"
					class="p-3 bg-neutral-900 rounded-lg"
				>
					<p class="text-sm text-neutral-300">
						<strong class="text-neutral-100">ID {{ post.id }}:</strong>
						{{ post.uppercaseTitle }}
					</p>
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
import type { Post } from '~/types/array-operations/p1/api'

interface MappedPost extends Post {
	uppercaseTitle: string
}

export default defineComponent({
	name: 'MapExample',
	props: {
		mappedPosts: {
			type: Array as () => MappedPost[],
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
- ✅ **テスト容易性**: コンポーネント単位でテストできる

#### 3-2. 親コンポーネントでの使用

```vue
<!-- pages/array-operations/p1/index.vue -->
<template>
	<div>
		<MapExample :mapped-posts="mappedPosts" />
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components を明示的にインポート
import MapExample from '~/components/array-operations/p1/MapExample.vue'

// composable からデータを取得
const { mappedPosts } = useArrayOperations()
</script>
```

### 4. 明示的なインポート（トラブル回避）

Nuxt 3 では自動インポート機能がありますが、深い階層（`composables/array-operations/p1/` など）では機能しない場合があります。トラブルを避けるため、**必要なものは明示的にインポート**することを推奨します。

#### 4-1. 明示的なインポートの実装

```typescript
// pages/array-operations/p1/index.vue
<script setup lang="ts">
// Composables を明示的にインポート
// 注: composables/array-operations/p1/ のような深い階層では自動インポートが機能しないため、明示的にインポートします
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components を明示的にインポート
import MapExample from '~/components/array-operations/p1/MapExample.vue'

// 型定義を明示的にインポート
import type { Post } from '~/types/array-operations/p1/api'
```

**明示的なインポートのメリット：**

- ✅ **確実性**: 自動インポートが機能しない場合でも確実に動作する
- ✅ **可読性**: どこから来ているかが明確で、コードレビューがしやすい
- ✅ **保守性**: 依存関係が明確で、リファクタリングが安全
- ✅ **チーム開発**: チーム開発で混乱を避けられる

### 5. Template 部分の実装

#### 5-1. データ表示

```vue
<div v-if="mappedPosts.length > 0" class="space-y-2">
	<div
		v-for="post in mappedPosts"
		:key="post.id"
		class="p-3 bg-neutral-900 rounded-lg"
	>
		<p class="text-sm text-neutral-300">
			<strong class="text-neutral-100">ID {{ post.id }}:</strong>
			{{ post.uppercaseTitle }}
		</p>
	</div>
</div>
```

**コードの説明：**

- `v-if="mappedPosts.length > 0"`: データが存在する場合のみ表示
- `v-for="post in mappedPosts"`: 変換された配列をループ処理
- `:key="post.id"`: Vue の key 属性。各要素を一意に識別するために必要
- `{{ post.uppercaseTitle }}`: 変換されたタイトル（大文字）を表示

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
const mappedPosts = computed(() => {
	return posts.value.map((post) => ({
		...post,
		uppercaseTitle: post.title.toUpperCase(),
	}))
})
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/array-operations/p1/MapExample.vue -->
<template>
	<UCard>
		<!-- map操作のUI -->
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
import MapExample from '~/components/array-operations/p1/MapExample.vue'
```

**メリット：**

- 自動インポートが機能しない場合でも確実に動作する
- 依存関係が明確で、リファクタリングが安全

## まとめ

`map`を使うことで、以下のメリットが得られます：

1. **データの変換**: 配列の各要素を変換して新しい配列を生成できる
2. **イミュータブル**: 元の配列を変更せず、安全にデータを操作できる
3. **再利用性**: Composables とコンポーネントの分割により、コードの再利用性が向上する
4. **可読性**: データ変換のロジックが明確になり、理解しやすくなる

### 実装の流れ

1. **型定義を作成**: `types/array-operations/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/array-operations/p1/useArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成**: `components/array-operations/p1/MapExample.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/array-operations/p1/index.vue` で全てを組み合わせる

このセクションでは、`map`の基本的な使い方と、実務で必須の 4 つの概念（型定義・Composables・コンポーネント分割・明示的なインポート）を学びました。次のセクションでは、`filter`を使ったデータの絞り込み方法を学びます。

