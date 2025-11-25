# 非同期処理の練習（async-await/p1）

## 概要

このセクションでは、Nuxt 3 + Vue 3 における非同期処理の基本を学習します。初学者でも理解しやすいよう、最小構成で実装しています。

## 学習目標

1. **useFetch の基本** - Nuxt 3 の自動インポート機能を使った API 通信
2. **async/await の基本** - 手動での非同期処理実装（try/catch 付き）

## フォルダ構成

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── async-await/
│       └── p1/
│           └── api.ts                # Post, User の型定義
├── composables/                      # Composables（必須）
│   └── async-await/
│       └── p1/
│           ├── usePosts.ts           # useFetch を使った投稿取得
│           └── useUser.ts            # async/await を使ったユーザー取得
├── components/                       # コンポーネント（必須）
│   └── async-await/
│       └── p1/
│           ├── PostList.vue          # 投稿一覧表示コンポーネント
│           └── UserInfo.vue          # ユーザー情報表示コンポーネント
└── pages/
    └── async-await/
        ├── _docs/                    # マニュアルファイル
        │   ├── README.md             # このファイル（全体構成）
        │   ├── s1_usefetch.md        # useFetch の詳細解説
        │   └── s2_async-try.md       # async/await の詳細解説
        └── p1/                       # 実装例
            └── index.vue             # メインコンポーネント
```

## 実装の全体像

### セクション 1: useFetch を使った基本的な API 通信

**目的:** Nuxt 3 の `useFetch` を使った自動的なデータ取得を学習

**使用ファイル:**
- `composables/async-await/p1/usePosts.ts` - useFetch を使ったロジック
- `components/async-await/p1/PostList.vue` - 投稿一覧表示 UI
- `types/async-await/p1/api.ts` - Post 型定義

**特徴:**
- ページ読み込み時に自動的にデータを取得
- ローディング状態・エラー状態を自動管理
- SSR 対応

**詳細:** [s1_usefetch.md](./s1_usefetch.md) を参照

### セクション 2: 手動での非同期処理（async/await + try/catch）

**目的:** `async/await` と `try/catch` を使った手動実装を学習

**使用ファイル:**
- `composables/async-await/p1/useUser.ts` - async/await を使ったロジック
- `components/async-await/p1/UserInfo.vue` - ユーザー情報表示 UI
- `types/async-await/p1/api.ts` - User 型定義

**特徴:**
- ボタンクリックで手動的にデータを取得
- 状態を `ref` で明示的に管理
- エラーハンドリングを自分で実装

**詳細:** [s2_async-try.md](./s2_async-try.md) を参照

## 実務で必須の 4 つの概念

### 1. 型定義の明確化

`any` を使わずに**型定義を明確に**することで、IDE の補完機能が働き、実行時エラーを防ぐことができます。

```typescript
// types/async-await/p1/api.ts
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
// composables/async-await/p1/usePosts.ts
export const usePosts = () => {
	const { data: posts, pending, error } = useFetch<Post[]>('https://...')
	return { posts, pending, error }
}
```

**メリット:**
- ✅ コードの重複を防ぐ
- ✅ ロジックのテストが容易になる
- ✅ 変更が一箇所で済む

### 3. コンポーネントの分割

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

```vue
<!-- components/async-await/p1/PostList.vue -->
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
// pages/async-await/p1/index.vue
// Composables を明示的にインポート
import { usePosts } from '~/composables/async-await/p1/usePosts'
import { useUser } from '~/composables/async-await/p1/useUser'

// Components を明示的にインポート
import PostList from '~/components/async-await/p1/PostList.vue'
import UserInfo from '~/components/async-await/p1/UserInfo.vue'
```

**メリット:**
- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

## 実装の流れ

1. **型定義を作成** - `types/async-await/p1/api.ts` で型を定義
2. **Composable を作成** - `composables/async-await/p1/` でロジックを分離
3. **コンポーネントを作成** - `components/async-await/p1/` で UI を分割
4. **メインコンポーネントで統合** - `pages/async-await/p1/index.vue` で全てを組み合わせる

## 使用技術

- **Nuxt 3** - Vue 3 ベースのフレームワーク
- **Vue 3 Composition API** - リアクティブな状態管理
- **TypeScript** - 型安全性の確保
- **Nuxt UI** - UI コンポーネントライブラリ
- **Tailwind CSS** - スタイリング
- **JSONPlaceholder** - テスト用のフェイク REST API

## 次のステップ

基本を理解したら、以下の応用編に進むことができます：

- **p2** - Promise.all を使った並列データ取得
- **p2** - Sequential await を使った順次データ取得
- **p2** - 詳細なエラーハンドリング

## 参考資料

- [Nuxt 3 公式ドキュメント](https://nuxt.com/)
- [Vue 3 公式ドキュメント](https://vuejs.org/)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)

