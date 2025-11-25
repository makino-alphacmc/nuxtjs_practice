# CRUD処理（実務アプリの核心）- API + 配列操作の実践版（crud-operations/p1）

## 概要

このセクションでは、Nuxt 3 + Vue 3 における CRUD 操作と配列操作を組み合わせた実践的な実装を学習します。API通信（GET/POST/PUT/DELETE）と配列操作（検索・フィルタ・ソート・ページネーション）を統合することで、実務でよく使われるパターンを身につけます。

## 学習目標

1. **GET** - データの取得（投稿一覧の取得）
2. **配列操作** - 検索・フィルタ・ソート・ページネーション
3. **POST** - データの作成（新規投稿の作成）
4. **PUT** - データの更新（投稿の更新）
5. **DELETE** - データの削除（投稿の削除）

## フォルダ構成

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── crud-operations/
│       └── p1/
│           └── api.ts                # Post, CreatePostRequest, UpdatePostRequest の型定義
├── composables/                      # Composables（必須）
│   └── crud-operations/
│       └── p1/
│           └── useCrudWithArrayOperations.ts # API通信 + 配列操作のロジック
├── components/                       # コンポーネント（必須）
│   └── crud-operations/
│       └── p1/
│           └── PostListWithOperations.vue # 検索・フィルタ・ソート・ページネーション付き投稿一覧
│   └── http-signal/
│       └── p1/
│           ├── PostCreateForm.vue    # 新規投稿作成フォーム（POST）
│           └── PostEditForm.vue      # 投稿更新フォーム（PUT）
└── pages/
    └── crud-operations/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # このファイル（全体構成）
        │   ├── s1_get.md            # GET の詳細解説
        │   ├── s2_array-operations.md # 配列操作の詳細解説
        │   ├── s3_post.md           # POST の詳細解説
        │   ├── s4_put.md            # PUT の詳細解説
        │   └── s5_delete.md         # DELETE の詳細解説
        └── p1/                       # 実装例
            └── index.vue            # メインコンポーネント
```

## 実装の全体像

### セクション 1: GET - 投稿一覧を取得

**目的:** HTTP GET リクエストを使ってデータを取得する方法を学習

**使用ファイル:**
- `composables/crud-operations/p1/useCrudWithArrayOperations.ts` - `fetchPosts()` メソッド
- `types/crud-operations/p1/api.ts` - Post 型定義

**特徴:**
- `$fetch` を使った手動での HTTP リクエスト
- ローディング状態・エラー状態を手動で管理
- 取得したデータを配列操作で処理

**詳細:** [s1_get.md](./s1_get.md) を参照

### セクション 2: 配列操作 - 検索・フィルタ・ソート・ページネーション

**目的:** 取得したデータに対して配列操作を適用する方法を学習

**使用ファイル:**
- `composables/crud-operations/p1/useCrudWithArrayOperations.ts` - 配列操作のロジック
- `components/crud-operations/p1/PostListWithOperations.vue` - 配列操作のUI

**特徴:**
- **検索**: タイトルでリアルタイム検索
- **フィルタ**: ユーザーIDで絞り込み
- **ソート**: ID、タイトル、ユーザーIDでソート（昇順・降順）
- **ページネーション**: 1ページあたりの件数を設定可能

**詳細:** [s2_array-operations.md](./s2_array-operations.md) を参照

### セクション 3: POST - 新規投稿を作成

**目的:** HTTP POST リクエストを使ってデータを作成する方法を学習

**使用ファイル:**
- `composables/crud-operations/p1/useCrudWithArrayOperations.ts` - `createPost()` メソッド
- `components/http-signal/p1/PostCreateForm.vue` - 新規投稿作成フォーム
- `types/crud-operations/p1/api.ts` - CreatePostRequest 型定義

**特徴:**
- フォーム入力からデータを作成
- POST リクエストでサーバーに送信
- 作成したデータを一覧に追加（配列操作で反映）

**詳細:** [s3_post.md](./s3_post.md) を参照

### セクション 4: PUT - 投稿を更新

**目的:** HTTP PUT リクエストを使ってデータを更新する方法を学習

**使用ファイル:**
- `composables/crud-operations/p1/useCrudWithArrayOperations.ts` - `updatePost()` メソッド
- `components/http-signal/p1/PostEditForm.vue` - 投稿更新フォーム
- `types/crud-operations/p1/api.ts` - UpdatePostRequest 型定義

**特徴:**
- 既存データを選択して編集
- PUT リクエストでサーバーに送信
- 更新したデータを一覧で反映（配列操作で更新）

**詳細:** [s4_put.md](./s4_put.md) を参照

### セクション 5: DELETE - 投稿を削除

**目的:** HTTP DELETE リクエストを使ってデータを削除する方法を学習

**使用ファイル:**
- `composables/crud-operations/p1/useCrudWithArrayOperations.ts` - `deletePost()` メソッド
- `components/crud-operations/p1/PostListWithOperations.vue` - 削除ボタン

**特徴:**
- 確認ダイアログで削除を確認
- DELETE リクエストでサーバーに送信
- 削除したデータを一覧から削除（配列操作で削除）
- ページネーションの自動調整

**詳細:** [s5_delete.md](./s5_delete.md) を参照

## 実務で必須の 4 つの概念

### 1. 型定義の明確化

`any` を使わずに**型定義を明確に**することで、IDE の補完機能が働き、実行時エラーを防ぐことができます。

```typescript
// types/crud-operations/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}
```

**メリット:**
- ✅ IDE が自動補完してくれる
- ✅ タイポをコンパイル時に検出できる
- ✅ チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

```typescript
// composables/crud-operations/p1/useCrudWithArrayOperations.ts
export const useCrudWithArrayOperations = () => {
	// API通信 + 配列操作のロジック
}
```

**メリット:**
- ✅ コードの重複を防ぐ
- ✅ ロジックのテストが容易になる
- ✅ 変更が一箇所で済む

### 3. コンポーネントの分割

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

```vue
<!-- components/crud-operations/p1/PostListWithOperations.vue -->
<template>
	<!-- 検索・フィルタ・ソート・ページネーション付き投稿一覧 -->
</template>
```

**メリット:**
- ✅ ファイルが肥大化するのを防ぐ
- ✅ 再利用性が向上する
- ✅ 保守性が向上する

### 4. 明示的なインポート（トラブル回避）

**目的:**
- 自動インポートの不具合を避ける
- 依存関係を明確にする
- コードの可読性・保守性を向上させる

**実装内容:**
- Composables は深い階層では明示的にインポート
- Components も同様に、深い階層では明示的にインポート
- 型定義は常に明示的にインポート

```typescript
// pages/crud-operations/p1/index.vue
// Composables を明示的にインポート
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p1/useCrudWithArrayOperations'

// Components を明示的にインポート
import PostListWithOperations from '~/components/crud-operations/p1/PostListWithOperations.vue'
```

**メリット:**
- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

## API通信と配列操作の統合

このセクションでは、API通信と配列操作を統合することで、実務でよく使われるパターンを実装しています：

1. **データ取得**: APIからデータを取得
2. **配列操作**: 取得したデータに対して検索・フィルタ・ソート・ページネーションを適用
3. **CRUD操作**: 作成・更新・削除時に配列操作の結果も自動的に更新

## 実装の流れ

1. **型定義を作成** - `types/crud-operations/p1/api.ts` で型を定義
2. **Composable を作成** - `composables/crud-operations/p1/useCrudWithArrayOperations.ts` でロジックを分離
3. **コンポーネントを作成** - `components/crud-operations/p1/PostListWithOperations.vue` で UI を分割
4. **メインコンポーネントで統合** - `pages/crud-operations/p1/index.vue` で全てを組み合わせる

## 使用技術

- **Nuxt 3** - Vue 3 ベースのフレームワーク
- **Vue 3 Composition API** - リアクティブな状態管理
- **TypeScript** - 型安全性の確保
- **Nuxt UI** - UI コンポーネントライブラリ
- **Tailwind CSS** - スタイリング
- **$fetch** - Nuxt 3 の HTTP クライアント
- **JSONPlaceholder** - テスト用のフェイク REST API

## 参考資料

- [Nuxt 3 公式ドキュメント](https://nuxt.com/)
- [Vue 3 公式ドキュメント](https://vuejs.org/)
- [MDN - Array メソッド](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)

