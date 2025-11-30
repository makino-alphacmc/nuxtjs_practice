# API連携（HTTP通信）の練習（http-signal/p1）

## 概要

このセクションでは、Nuxt 3 + Vue 3 における HTTP 通信の基本操作（CRUD）を学習します。REST API の標準的な操作である GET、POST、PUT、DELETE を実装することで、実務で必要な API 連携の基礎を身につけます。**実務で使う処理を重視**し、エラー/ローディング処理も必ず含めた最小構成で実装しています。

**使用 API**: [JSONPlaceholder](https://jsonplaceholder.typicode.com/) のみ（外部 REST API）

## 学習目標

1. **GET** - データの取得（投稿一覧の取得）
2. **POST** - データの作成（新規投稿の作成）
3. **PUT** - データの更新（投稿の更新）
4. **DELETE** - データの削除（投稿の削除）

## フォルダ構成

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── http-signal/
│       └── p1/
│           └── api.ts                # Post, CreatePostRequest, UpdatePostRequest の型定義
├── composables/                      # Composables（必須）
│   └── http-signal/
│       └── p1/
│           └── useHttpPosts.ts      # HTTP通信のロジック（GET/POST/PUT/DELETE）
├── components/                       # コンポーネント（必須）
│   └── http-signal/
│       └── p1/
│           ├── PostList.vue         # 投稿一覧表示コンポーネント（GET）
│           ├── PostCreateForm.vue    # 新規投稿作成フォーム（POST）
│           ├── PostEditForm.vue     # 投稿更新フォーム（PUT）
│           └── PostDeleteInfo.vue   # 削除説明コンポーネント（DELETE）
└── pages/
    └── http-signal/
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
- `composables/http-signal/p1/useHttpPosts.ts` - `fetchPosts()` メソッド
- `components/http-signal/p1/PostList.vue` - 投稿一覧表示 UI
- `types/http-signal/p1/api.ts` - Post 型定義

**特徴:**
- `$fetch` を使った手動での HTTP リクエスト
- ローディング状態・エラー状態を手動で管理
- 取得したデータをテーブルで表示

**詳細:** [s1_get.md](./s1_get.md) を参照

### セクション 2: POST - 新規投稿を作成

**目的:** HTTP POST リクエストを使ってデータを作成する方法を学習

**使用ファイル:**
- `composables/http-signal/p1/useHttpPosts.ts` - `createPost()` メソッド
- `components/http-signal/p1/PostCreateForm.vue` - 新規投稿作成フォーム
- `types/http-signal/p1/api.ts` - CreatePostRequest 型定義

**特徴:**
- フォーム入力からデータを作成
- POST リクエストでサーバーに送信
- 作成したデータを一覧に反映

**詳細:** [s2_post.md](./s2_post.md) を参照

### セクション 3: PUT - 投稿を更新

**目的:** HTTP PUT リクエストを使ってデータを更新する方法を学習

**使用ファイル:**
- `composables/http-signal/p1/useHttpPosts.ts` - `updatePost()` メソッド
- `components/http-signal/p1/PostEditForm.vue` - 投稿更新フォーム
- `types/http-signal/p1/api.ts` - UpdatePostRequest 型定義

**特徴:**
- 既存データを選択して編集
- PUT リクエストでサーバーに送信
- 更新したデータを一覧で反映

**詳細:** [s3_put.md](./s3_put.md) を参照

### セクション 4: DELETE - 投稿を削除

**目的:** HTTP DELETE リクエストを使ってデータを削除する方法を学習

**使用ファイル:**
- `composables/http-signal/p1/useHttpPosts.ts` - `deletePost()` メソッド
- `components/http-signal/p1/PostList.vue` - 削除ボタン
- `components/http-signal/p1/PostDeleteInfo.vue` - 削除説明

**特徴:**
- 削除確認ダイアログを表示
- DELETE リクエストでサーバーに送信
- 削除したデータを一覧から除外

**詳細:** [s4_delete.md](./s4_delete.md) を参照

## 実務で必須の 4 つの概念

すべてのサンプル・課題をこの4概念に基づいて構成します。実務でも学習でも最強の組み合わせです。

### 1. 型定義の明確化（types/）

**目的:**
- 実行時エラー防止
- IDE の補完向上
- データ構造をチームに明示

**実装:**
```typescript
// types/http-signal/p1/api.ts
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
<!-- components/http-signal/p1/PostList.vue -->
<template>
	<!-- 投稿一覧 UI（props で受け取る） -->
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
// composables/http-signal/p1/useHttpPosts.ts
export const useHttpPosts = () => {
	const posts = useState<Post[]>('http-posts', () => [])
	const loading = useState<boolean>('http-posts-loading', () => false)
	const error = useState<Error | null>('http-posts-error', () => null)
	
	// GET / POST / PUT / DELETE をまとめて提供
	const fetchPosts = async () => { /* ... */ }
	const createPost = async () => { /* ... */ }
	const updatePost = async () => { /* ... */ }
	const deletePost = async () => { /* ... */ }
	
	return { posts, loading, error, fetchPosts, createPost, updatePost, deletePost }
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
// pages/http-signal/p1/index.vue
// Composables
import { useHttpPosts } from '~/composables/http-signal/p1/useHttpPosts'

// Components
import PostList from '~/components/http-signal/p1/PostList.vue'

// Types
import type { Post } from '~/types/http-signal/p1/api'
```

**注意:**
- Nuxt 組込（$fetch 等）は auto-import OK
- components / composables は深い階層だと auto import NG

**メリット:**
- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

## 実装の流れ（統一パターン）

1. **型定義を作成**: `types/http-signal/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/http-signal/p1/useHttpPosts.ts` でロジックを分離
3. **コンポーネントを作成**: `components/http-signal/p1/` で UI を分割（props で受け取る）
4. **明示的なインポート**: 深い階層では自動インポートに頼らず明示的にインポート
5. **メインコンポーネントで統合**: `pages/http-signal/p1/index.vue` で全てを組み合わせる

## 使用技術

- **Nuxt 3** - Vue 3 ベースのフレームワーク
- **Vue 3 Composition API** - リアクティブな状態管理（`<script setup>` を使用）
- **TypeScript** - 型安全性の確保
- **Nuxt UI** - UI コンポーネントライブラリ
- **Tailwind CSS** - スタイリング
- **$fetch** - Nuxt 3 の HTTP クライアント（JSONPlaceholder との通信に使用）
- **JSONPlaceholder** - テスト用のフェイク REST API（外部 REST API のみ使用）

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

