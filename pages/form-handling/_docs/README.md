# 入力フォーム処理の練習（form-handling/p1）

## 概要

このセクションでは、Nuxt 3 + Vue 3 を使って入力フォームの基本パターンを練習します。v-model による状態管理、リアルタイムバリデーション、エラー表示、送信処理、リセット処理をひとつのフォームにまとめ、実務でよく使う構成を体験します。

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

### 1. 型定義の明確化（`types/form-handling/p1/form.ts`）

```ts
export interface ContactForm {
  name: string
  email: string
  topic: 'bug' | 'question' | 'request'
  message: string
  agree: boolean
}
```

- IDE の補完、型安全なバリデーション実装に不可欠
- 送信結果 (`SubmitResult`) やバリデーションエラー (`FormValidationError`) も型で管理

### 2. ロジックの分離（`useContactForm.ts`）

- `form`: reactive でフォームの状態を保持
- `errors`: フィールド毎のエラーを配列で管理
- `updateField`: 単一の関数でフィールド更新 + バリデーション
- `submitForm`: バリデーション → 疑似 API 呼び出し → 結果表示
- `resetForm`: 初期値に戻す

### 3. コンポーネントの分割

- `ContactFormCard.vue`: UI + 入力イベントだけを担当し、ロジックは持たない
- `SubmitResultCard.vue`: 送信結果とバリデーション状態の可視化に専念

### 4. 明示的なインポート

深い階層のコンポーネント / composable / 型は、自動インポートに頼らず `~/components/...` のように必ず記述してトラブルを防止します。

### 5. UI / UX

- 入力ごとのエラー表示でユーザー体験を高める
- チェックボックス + 同意文面をセットで表示
- 送信結果を JSON で表示し、実務のデバッグフローを再現

## 実装フロー

1. 型定義を作る（ContactForm / SubmitResult / FormValidationError）
2. Composable でフォームロジックを実装（状態、バリデーション、送信、リセット）
3. コンポーネントを分割（フォーム UI / 結果 UI）
4. ページで全てを組み合わせる
5. `_docs` にまとめてナレッジ化

## 参考

- [Nuxt 3 Docs](https://nuxt.com/docs)
- [Vue 3 Forms Guide](https://vuejs.org/guide/essentials/forms.html)
- [Nuxt UI Components](https://ui.nuxt.com/components/input)
