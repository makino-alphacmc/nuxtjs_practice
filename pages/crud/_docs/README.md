# API連携（HTTP通信）の練習（crud/p1）

## 概要

このセクションでは、Nuxt 3 + Vue 3 における HTTP 通信の基本操作（CRUD）を学習します。REST API の標準的な操作である GET、POST、PUT、DELETE を実装することで、実務で必要な API 連携の基礎を身につけます。

## 学習目標

1. **GET** - データの取得（投稿一覧の取得）
2. **POST** - データの作成（新規投稿の作成）
3. **PUT** - データの更新（投稿の更新）
4. **DELETE** - データの削除（投稿の削除）

## フォルダ構成

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── crud/
│       └── p1/
│           └── api.ts                # Post, CreatePostRequest, UpdatePostRequest の型定義
├── composables/                      # Composables（必須）
│   └── crud/
│       └── p1/
│           └── useHttpPosts.ts      # HTTP通信のロジック（GET/POST/PUT/DELETE）
├── components/                       # コンポーネント（必須）
│   └── crud/
│       └── p1/
│           ├── PostList.vue         # 投稿一覧表示コンポーネント（GET）
│           ├── PostCreateForm.vue    # 新規投稿作成フォーム（POST）
│           ├── PostEditForm.vue     # 投稿更新フォーム（PUT）
│           └── PostDeleteInfo.vue   # 削除説明コンポーネント（DELETE）
└── pages/
    └── crud/
        ├── _docs/                   # マニュアルファイル
        │   ├── README.md            # このファイル（全体構成）
        │   ├── s1_get.md            # GET の詳細解説
        │   ├── s2_post.md           # POST の詳細解説
        │   ├── s3_put.md            # PUT の詳細解説
        │   └── s4_delete.md         # DELETE の詳細解説
        └── p1/                      # 実装例
            └── index.vue            # メインコンポーネント
```

## 実装の全体像

### セクション 1: GET - 投稿一覧を取得

**目的:** HTTP GET リクエストを使ってデータを取得する方法を学習

**使用ファイル:**
- `composables/crud/p1/useHttpPosts.ts` - `fetchPosts()` メソッド
- `components/crud/p1/PostList.vue` - 投稿一覧表示 UI
- `types/crud/p1/api.ts` - Post 型定義

**特徴:**
- `$fetch` を使った手動での HTTP リクエスト
- ローディング状態・エラー状態を手動で管理
- 取得したデータをテーブルで表示

**詳細:** [s1_get.md](./s1_get.md) を参照

### セクション 2: POST - 新規投稿を作成

**目的:** HTTP POST リクエストを使ってデータを作成する方法を学習

**使用ファイル:**
- `composables/crud/p1/useHttpPosts.ts` - `createPost()` メソッド
- `components/crud/p1/PostCreateForm.vue` - 新規投稿作成フォーム
- `types/crud/p1/api.ts` - CreatePostRequest 型定義

**特徴:**
- フォーム入力からデータを作成
- POST リクエストでサーバーに送信
- 作成したデータを一覧に反映

**詳細:** [s2_post.md](./s2_post.md) を参照

### セクション 3: PUT - 投稿を更新

**目的:** HTTP PUT リクエストを使ってデータを更新する方法を学習

**使用ファイル:**
- `composables/crud/p1/useHttpPosts.ts` - `updatePost()` メソッド
- `components/crud/p1/PostEditForm.vue` - 投稿更新フォーム
- `types/crud/p1/api.ts` - UpdatePostRequest 型定義

**特徴:**
- 既存データを選択して編集
- PUT リクエストでサーバーに送信
- 更新したデータを一覧で反映

**詳細:** [s3_put.md](./s3_put.md) を参照

### セクション 4: DELETE - 投稿を削除

**目的:** HTTP DELETE リクエストを使ってデータを削除する方法を学習

**使用ファイル:**
- `composables/crud/p1/useHttpPosts.ts` - `deletePost()` メソッド
- `components/crud/p1/PostList.vue` - 削除ボタン
- `components/crud/p1/PostDeleteInfo.vue` - 削除説明

**特徴:**
- 削除確認ダイアログを表示
- DELETE リクエストでサーバーに送信
- 削除したデータを一覧から除外

**詳細:** [s4_delete.md](./s4_delete.md) を参照

## 実務で必須の 4 つの概念

### 1. 型定義の明確化

`any` を使わずに**型定義を明確に**することで、IDE の補完機能が働き、実行時エラーを防ぐことができます。

```typescript
// types/crud/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
	userId: number
}

export interface CreatePostRequest {
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
// composables/crud/p1/useHttpPosts.ts
export const useHttpPosts = () => {
	const posts = useState<Post[]>('http-posts', () => [])
	const loading = useState<boolean>('http-posts-loading', () => false)
	
	const fetchPosts = async () => {
		// GET リクエストの実装
	}
	
	return { posts, loading, fetchPosts }
}
```

**メリット:**
- ✅ コードの重複を防ぐ
- ✅ ロジックのテストが容易になる
- ✅ 変更が一箇所で済む

### 3. コンポーネントの分割

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

```vue
<!-- components/crud/p1/PostList.vue -->
<template>
	<UCard>
		<!-- 投稿一覧のUI -->
	</UCard>
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
// pages/crud/p1/index.vue
// Composables を明示的にインポート
import { useHttpPosts } from '~/composables/crud/p1/useHttpPosts'

// Components を明示的にインポート
import PostList from '~/components/crud/p1/PostList.vue'

// 型定義を明示的にインポート
import type { Post } from '~/types/crud/p1/api'
```

**メリット:**
- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

## 実装の流れ

1. **型定義を作成** - `types/crud/p1/api.ts` で型を定義
2. **Composable を作成** - `composables/crud/p1/useHttpPosts.ts` でロジックを分離
3. **コンポーネントを作成** - `components/crud/p1/` で UI を分割
4. **メインコンポーネントで統合** - `pages/crud/p1/index.vue` で全てを組み合わせる

## 使用技術

- **Nuxt 3** - Vue 3 ベースのフレームワーク
- **Vue 3 Composition API** - リアクティブな状態管理
- **TypeScript** - 型安全性の確保
- **Nuxt UI** - UI コンポーネントライブラリ
- **Tailwind CSS** - スタイリング
- **$fetch** - Nuxt 3 の HTTP クライアント
- **JSONPlaceholder** - テスト用のフェイク REST API

## HTTP メソッドの違い

| メソッド | 用途 | 特徴 |
|---------|------|------|
| **GET** | データの取得 | サーバーからデータを取得する。副作用がない |
| **POST** | データの作成 | 新しいリソースを作成する。リクエストボディにデータを含める |
| **PUT** | データの更新 | 既存のリソースを完全に置き換える。リクエストボディに全データを含める |
| **DELETE** | データの削除 | 既存のリソースを削除する。通常リクエストボディは不要 |

## 参考資料

- [Nuxt 3 公式ドキュメント](https://nuxt.com/)
- [Vue 3 公式ドキュメント](https://vuejs.org/)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [REST API の基礎](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods)

