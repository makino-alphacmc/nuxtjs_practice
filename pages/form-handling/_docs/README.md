# 入力フォーム処理の練習（form-handling/p1）

## 概要

このセクションでは、Nuxt 3 + Vue 3 を使って入力フォームの基本パターンを練習します。v-model による状態管理、リアルタイムバリデーション、エラー表示、送信処理、リセット処理をひとつのフォームにまとめ、実務でよく使う構成を体験します。**実務で使う処理を重視**し、エラー/ローディング処理も必ず含めた最小構成で実装しています。

**使用 API**: [JSONPlaceholder](https://jsonplaceholder.typicode.com/) のみ（外部 REST API、送信処理で使用）

## 学習目標

1. **v-model** でフォームの状態と UI を同期させる
2. **バリデーション** ルールを設計し、即時に実行する
3. **エラー表示** を視覚的に分かりやすく提示する
4. **サブミット処理** を非同期で実行し、結果を UI に反映する
5. **フォームリセット** で初期状態に戻せるようにする

## フォルダ構成

```
nuxtjs_practice/
├── types/
│   └── form-handling/
│       └── p1/
│           └── form.ts                  # ContactForm / SubmitResult などの型定義
├── composables/
│   └── form-handling/
│       └── p1/
│           └── useContactForm.ts        # v-model + バリデーション + 送信処理のロジック
├── components/
│   └── form-handling/
│       └── p1/
│           ├── ContactFormCard.vue      # 入力フォーム UI
│           └── SubmitResultCard.vue     # 送信結果 / デバッグ表示
└── pages/
    └── form-handling/
        ├── _docs/
        │   └── README.md                # このファイル
        └── p1/
            └── index.vue               # 実装例
```

## 実装のポイント

### セクション一覧

1. [v-model でフォームの状態を同期する](./s1_v-model.md)
2. [バリデーション（入力チェック）](./s2_validation.md)
3. [エラー表示でフィードバック](./s3_error-display.md)
4. [サブミット処理（送信）](./s4_submit.md)
5. [フォームリセット](./s5_reset.md)

## 実務で必須の 4 つの概念

すべてのサンプル・課題をこの4概念に基づいて構成します。実務でも学習でも最強の組み合わせです。

### 1. 型定義の明確化（types/）

**目的:**
- 実行時エラー防止
- IDE の補完向上
- データ構造をチームに明示

**実装:**
```typescript
// types/form-handling/p1/form.ts
export interface ContactForm {
	name: string
	email: string
	topic: 'bug' | 'question' | 'request'
	message: string
	agree: boolean
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
<!-- components/form-handling/p1/ContactFormCard.vue -->
<template>
	<!-- 入力フォーム UI（props で受け取る） -->
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
// composables/form-handling/p1/useContactForm.ts
export const useContactForm = () => {
	// form: reactive でフォームの状態を保持
	// errors: フィールド毎のエラーを配列で管理
	// updateField: 単一の関数でフィールド更新 + バリデーション
	// submitForm: バリデーション → API 呼び出し → 結果表示
	// resetForm: 初期値に戻す
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
// pages/form-handling/p1/index.vue
// Composables
import { useContactForm } from '~/composables/form-handling/p1/useContactForm'

// Components
import ContactFormCard from '~/components/form-handling/p1/ContactFormCard.vue'

// Types
import type { ContactForm } from '~/types/form-handling/p1/form'
```

**注意:**
- Nuxt 組込（$fetch 等）は auto-import OK
- components / composables は深い階層だと auto import NG

**メリット:**
- ✅ 自動インポートが機能しない場合でも確実に動作する
- ✅ どこから来ているかが明確で、コードレビューがしやすい
- ✅ 依存関係が明確で、リファクタリングが安全

### 5. UI / UX

- 入力ごとのエラー表示でユーザー体験を高める
- チェックボックス + 同意文面をセットで表示
- 送信結果を JSON で表示し、実務のデバッグフローを再現

## 実装の流れ（統一パターン）

1. **型定義を作成**: `types/form-handling/p1/form.ts` で型を定義
2. **Composable を作成**: `composables/form-handling/p1/useContactForm.ts` でロジックを分離
3. **コンポーネントを作成**: `components/form-handling/p1/` で UI を分割（props で受け取る）
4. **明示的なインポート**: 深い階層では自動インポートに頼らず明示的にインポート
5. **メインコンポーネントで統合**: `pages/form-handling/p1/index.vue` で全てを組み合わせる

## 参考

- [Nuxt 3 Docs](https://nuxt.com/docs)
- [Vue 3 Forms Guide](https://vuejs.org/guide/essentials/forms.html)
- [Nuxt UI Components](https://ui.nuxt.com/components/input)
