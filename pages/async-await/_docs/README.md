# 非同期処理の練習（async-await/p1）

## 概要

このセクションでは、Nuxt 3 + Vue 3 における非同期処理の基本を学習します。**実務で使う処理を重視**し、エラー/ローディング処理も必ず含めた最小構成で実装しています。

**使用 API**: [JSONPlaceholder](https://jsonplaceholder.typicode.com/) のみ（外部 REST API）

## 学習目標

1. **useFetch の基本** - Nuxt 3 の自動インポート機能を使った API 通信
2. **async/await の基本** - 手動での非同期処理実装（try/catch 付き）
3. **Promise.all** - 複数データの並列取得
4. **順次処理** - await を連続させた順次データ取得
5. **エラーハンドリング** - 実務で必須のエラー処理パターン

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

**目的:** Nuxt 3 の `useFetch` を使った自動的なデータ取得を学習（実務で最もよく使う方法）

**使用ファイル:**
- `composables/async-await/p1/usePosts.ts` - useFetch を使ったロジック
- `components/async-await/p1/PostList.vue` - 投稿一覧表示 UI
- `types/async-await/p1/api.ts` - Post 型定義

**特徴:**
- ページ読み込み時に自動的にデータを取得
- ローディング状態・エラー状態を自動管理（実務で必須）
- SSR 対応

**詳細:** [s1_usefetch.md](./s1_usefetch.md) を参照

### セクション 2: 手動での非同期処理（async/await + try/catch）

**目的:** `async/await` と `try/catch` を使った手動実装を学習（細かい制御が必要な場合）

**使用ファイル:**
- `composables/async-await/p1/useUser.ts` - async/await を使ったロジック
- `components/async-await/p1/UserInfo.vue` - ユーザー情報表示 UI
- `types/async-await/p1/api.ts` - User 型定義

**特徴:**
- ボタンクリックで手動的にデータを取得
- 状態を `ref` で明示的に管理
- エラーハンドリングを自分で実装（実務で必須）

**詳細:** [s2_async-try.md](./s2_async-try.md) を参照

### セクション 3: Promise.all で複数データを並列取得

**目的:** 複数の API を同時に呼び出す並列処理を学習

**特徴:**
- 待ち時間を最小化（一番遅い API の時間だけ待つ）
- エラー検知が容易（どれかが失敗したら一括で catch）

**詳細:** [s3_promise.md](./s3_promise.md) を参照

### セクション 4: await を連続させた順次データ取得

**目的:** 依存関係のある複数 API を順番に実行する順次処理を学習

**特徴:**
- 後続 API が前の結果に依存する場合に必須
- デバッグしやすい（どの await で止まったかが分かる）

**詳細:** [s4_await.md](./s4_await.md) を参照

### セクション 5: エラーハンドリングを徹底解説

**目的:** 実務で必須のエラー処理パターンを学習

**特徴:**
- HTTP ステータス（404/500 など）の切り分け
- ネットワーク例外の検知
- ユーザー向けメッセージの設計

**詳細:** [s5_error-handling.md](./s5_error-handling.md) を参照

## 実務で必須の 4 つの概念

すべてのサンプル・課題をこの4概念に基づいて構成します。実務でも学習でも最強の組み合わせです。

### 1. 型定義の明確化（types/）

**目的:**
- 実行時エラー防止
- IDE の補完向上
- データ構造をチームに明示

**実装:**
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
<!-- components/async-await/p1/PostList.vue -->
<template>
	<UCard>
		<!-- 投稿一覧のUI（props で受け取る） -->
	</UCard>
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
// composables/async-await/p1/usePosts.ts
export const usePosts = () => {
	const { data: posts, pending, error } = useFetch<Post[]>('https://...')
	return { posts, pending, error }
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
// pages/async-await/p1/index.vue
// Composables
import { usePosts } from '~/composables/async-await/p1/usePosts'

// Components
import PostList from '~/components/async-await/p1/PostList.vue'

// Types
import type { Post } from '~/types/async-await/p1/api'
```

**注意:**
- Nuxt 組込（useFetch 等）は auto-import OK
- components / composables は深い階層だと auto import NG

**メリット:**
- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

## 実装の流れ（統一パターン）

すべてのセクションで以下の流れで実装します：

1. **型定義を作成** - `types/async-await/p1/api.ts` で型を定義
2. **Composable を作成** - `composables/async-await/p1/` でロジックを分離
3. **コンポーネントを作成** - `components/async-await/p1/` で UI を分割
4. **明示的なインポート** - 深い階層では自動インポートに頼らず明示的にインポート
5. **メインコンポーネントで統合** - `pages/async-await/p1/index.vue` で全てを組み合わせる

## 使用技術

- **Nuxt 3** - Vue 3 ベースのフレームワーク
- **Vue 3 Composition API** - リアクティブな状態管理
- **TypeScript** - 型安全性の確保
- **Nuxt UI** - UI コンポーネントライブラリ（Card / Button / Input / Textarea）
- **Tailwind CSS** - スタイリング（ダークテーマ対応）
- **JSONPlaceholder** - 外部 REST API（学習用）

## 実務で必須のポイント

- ✅ **エラー/ローディング処理は必ず含める** - 実務では必須
- ✅ **型定義を明確に** - `any` を使わない
- ✅ **コンポーネントは props で受け取る** - 再利用性を重視
- ✅ **ロジックは composables に分離** - 保守性を向上
- ✅ **深い階層では明示的にインポート** - トラブル回避

## 次のステップ

基本を理解したら、以下の応用編に進むことができます：

- **Phase 2** - AI のサポート最小化で自分で実装
- **Phase 3** - 実務の反復練習（posts / users / comments / todos）

## 参考資料

- [Nuxt 3 公式ドキュメント](https://nuxt.com/)
- [Vue 3 公式ドキュメント](https://vuejs.org/)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)

