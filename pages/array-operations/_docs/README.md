# 配列操作の練習（array-operations/p1）

## 概要

このセクションでは、Nuxt 3 + Vue 3 における配列操作の基本を学習します。JavaScript の配列メソッド（`map`、`filter`、`reduce`、`find`）や、ソート、ページネーション、CRUD操作を実装することで、実務で必要なデータ操作の基礎を身につけます。**実務で使う処理を重視**し、エラー/ローディング処理も必ず含めた最小構成で実装しています。

**使用 API**: [JSONPlaceholder](https://jsonplaceholder.typicode.com/) のみ（外部 REST API）

## 学習目標

1. **map** - データの変換・表示
2. **filter** - データの絞り込み
3. **reduce** - 集計
4. **find** - 特定のデータを検索
5. **ソート** - データの並び替え
6. **ページネーション** - データの分割表示
7. **CRUD操作** - データの追加・削除・更新

## フォルダ構成

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── array-operations/
│       └── p1/
│           └── api.ts                # Post 型定義
├── composables/                      # Composables（必須）
│   └── array-operations/
│       └── p1/
│           └── useArrayOperations.ts # 配列操作のロジック
├── components/                       # コンポーネント（必須）
│   └── array-operations/
│       └── p1/
│           ├── DataFetch.vue         # データ取得コンポーネント
│           ├── MapExample.vue        # map操作のコンポーネント
│           ├── FilterExample.vue     # filter操作のコンポーネント
│           ├── ReduceExample.vue    # reduce操作のコンポーネント
│           ├── FindExample.vue       # find操作のコンポーネント
│           ├── SortExample.vue       # ソート操作のコンポーネント
│           ├── PaginationExample.vue # ページネーションのコンポーネント
│           └── CrudExample.vue      # CRUD操作のコンポーネント
└── pages/
    └── array-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md            # このファイル（全体構成）
        │   ├── s1_map.md            # map の詳細解説
        │   ├── s2_filter.md         # filter の詳細解説
        │   ├── s3_reduce.md         # reduce の詳細解説
        │   ├── s4_find.md           # find の詳細解説
        │   ├── s5_sort.md           # ソート の詳細解説
        │   ├── s6_pagination.md     # ページネーション の詳細解説
        │   └── s7_crud.md           # CRUD操作 の詳細解説
        └── p1/                      # 実装例
            └── index.vue            # メインコンポーネント
```

## 実装の全体像

### セクション 1: map - データの変換・表示

**目的:** 配列の各要素を変換して新しい配列を作成する方法を学習

**使用ファイル:**
- `composables/array-operations/p1/useArrayOperations.ts` - `mappedPosts` computed
- `components/array-operations/p1/MapExample.vue` - map操作のUI
- `types/array-operations/p1/api.ts` - Post 型定義

**特徴:**
- 各投稿のタイトルを大文字に変換
- 元の配列を変更せず、新しい配列を生成
- データの表示形式を変更する際に使用

**詳細:** [s1_map.md](./s1_map.md) を参照

### セクション 2: filter - データの絞り込み

**目的:** 条件に合致する要素だけを抽出する方法を学習

**使用ファイル:**
- `composables/array-operations/p1/useArrayOperations.ts` - `getFilteredPosts()` メソッド
- `components/array-operations/p1/FilterExample.vue` - filter操作のUI

**特徴:**
- ユーザーIDでフィルタリング
- 条件に合致する要素のみを抽出
- 検索や絞り込み機能で使用

**詳細:** [s2_filter.md](./s2_filter.md) を参照

### セクション 3: reduce - 集計

**目的:** 配列の要素を集計して単一の値を生成する方法を学習

**使用ファイル:**
- `composables/array-operations/p1/useArrayOperations.ts` - `getUserPostCounts` computed
- `components/array-operations/p1/ReduceExample.vue` - reduce操作のUI

**特徴:**
- ユーザーごとの投稿数を集計
- 配列からオブジェクトを生成
- 統計や集計機能で使用

**詳細:** [s3_reduce.md](./s3_reduce.md) を参照

### セクション 4: find - 特定のデータを検索

**目的:** 条件に合致する最初の要素を検索する方法を学習

**使用ファイル:**
- `composables/array-operations/p1/useArrayOperations.ts` - `findPostById()` メソッド
- `components/array-operations/p1/FindExample.vue` - find操作のUI

**特徴:**
- IDで投稿を検索
- 条件に合致する最初の要素を返す
- 詳細表示や検索機能で使用

**詳細:** [s4_find.md](./s4_find.md) を参照

### セクション 5: ソート - データの並び替え

**目的:** 配列の要素を並び替える方法を学習

**使用ファイル:**
- `composables/array-operations/p1/useArrayOperations.ts` - `getSortedPosts()` メソッド
- `components/array-operations/p1/SortExample.vue` - ソート操作のUI

**特徴:**
- ID、タイトル、ユーザーIDでソート
- 昇順・降順の切り替え
- 一覧表示の並び替え機能で使用

**詳細:** [s5_sort.md](./s5_sort.md) を参照

### セクション 6: ページネーション - データの分割表示

**目的:** 大量のデータを分割して表示する方法を学習

**使用ファイル:**
- `composables/array-operations/p1/useArrayOperations.ts` - `getPaginatedPosts()` メソッド
- `components/array-operations/p1/PaginationExample.vue` - ページネーションのUI

**特徴:**
- 1ページあたりの件数を設定可能
- 前へ・次へボタンでページ移動
- 大量データの表示で使用

**詳細:** [s6_pagination.md](./s6_pagination.md) を参照

### セクション 7: CRUD操作 - データの追加・削除・更新

**目的:** 配列に対する追加・削除・更新操作を学習

**使用ファイル:**
- `composables/array-operations/p1/useArrayOperations.ts` - `addPost()`, `updatePost()`, `deletePostById()` メソッド
- `components/array-operations/p1/CrudExample.vue` - CRUD操作のUI

**特徴:**
- 新規投稿の追加
- 既存投稿の更新
- 投稿の削除
- 実務アプリの核心機能

**詳細:** [s7_crud.md](./s7_crud.md) を参照

## 実務で必須の 4 つの概念

すべてのサンプル・課題をこの4概念に基づいて構成します。実務でも学習でも最強の組み合わせです。

### 1. 型定義の明確化（types/）

**目的:**
- 実行時エラー防止
- IDE の補完向上
- データ構造をチームに明示

**実装:**
```typescript
// types/array-operations/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}
```

**メリット:**
- ✅ タイポや不整合を即検知
- ✅ 自動補完が強くなる
- ✅ 安全にリファクタ可能

### 2. コンポーネント分割（UI の単一責任）

**目的:**
- 再利用性
- 保守性
- UI の統一感

**実装:**
```vue
<!-- components/array-operations/p1/MapExample.vue -->
<template>
	<!-- map操作のUI（props で受け取る） -->
</template>
```

**メリット:**
- ✅ 複数ページで再利用可能
- ✅ 修正箇所が最小
- ✅ 理解しやすい

### 3. ロジックの分離（composables/）

**目的:**
- 重複排除
- ロジック単体でテスト可能
- コンポーネントの肥大化防止

**実装:**
```typescript
// composables/array-operations/p1/useArrayOperations.ts
export const useArrayOperations = () => {
	const mappedPosts = computed(() => {
		return posts.value.map((post) => ({
			...post,
			uppercaseTitle: post.title.toUpperCase(),
		}))
	})
	return { mappedPosts }
}
```

**メリット:**
- ✅ どのページでも同じロジックを使える
- ✅ 保守性が圧倒的に上がる
- ✅ UI がシンプルに保てる

### 4. 明示的なインポート（依存明確化）

**目的:**
- 自動インポート不発バグの防止
- 読みやすさ向上
- 依存関係の透明化

**実装例:**
```typescript
// pages/array-operations/p1/index.vue
// Composables
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components
import MapExample from '~/components/array-operations/p1/MapExample.vue'

// Types
import type { Post } from '~/types/array-operations/p1/api'
```

**注意:**
- Nuxt 組込（$fetch 等）は auto-import OK
- components / composables は深い階層だと auto import NG

**メリット:**
- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

## 実装の流れ（統一パターン）

1. **型定義を作成** - `types/array-operations/p1/api.ts` で型を定義
2. **Composable を作成** - `composables/array-operations/p1/useArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成** - `components/array-operations/p1/` で UI を分割（props で受け取る）
4. **明示的なインポート** - 深い階層では自動インポートに頼らず明示的にインポート
5. **メインコンポーネントで統合** - `pages/array-operations/p1/index.vue` で全てを組み合わせる

## 使用技術

- **Nuxt 3** - Vue 3 ベースのフレームワーク
- **Vue 3 Composition API** - リアクティブな状態管理
- **TypeScript** - 型安全性の確保
- **Nuxt UI** - UI コンポーネントライブラリ
- **Tailwind CSS** - スタイリング
- **$fetch** - Nuxt 3 の HTTP クライアント
- **JSONPlaceholder** - テスト用のフェイク REST API

## 配列メソッドの比較

| メソッド | 用途 | 戻り値 | 元の配列を変更 |
|---------|------|--------|---------------|
| **map** | 各要素を変換 | 新しい配列 | しない |
| **filter** | 条件に合致する要素を抽出 | 新しい配列 | しない |
| **reduce** | 配列を集計 | 単一の値 | しない |
| **find** | 条件に合致する最初の要素を検索 | 要素または undefined | しない |
| **sort** | 要素を並び替え | 同じ配列への参照 | する |

## 参考資料

- [Nuxt 3 公式ドキュメント](https://nuxt.com/)
- [Vue 3 公式ドキュメント](https://vuejs.org/)
- [MDN - Array メソッド](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)

