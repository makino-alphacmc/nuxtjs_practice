# セクション 3: エラー表示でフィードバック

> **このセクションでは [ContactFormCard.vue](../../components/form-handling/p1/ContactFormCard.vue) と [SubmitResultCard.vue](../../components/form-handling/p1/SubmitResultCard.vue) を参照してください**  
> バリデーション結果をユーザーに即時表示し、UX を向上させます。

## フォルダ構成

```
nuxtjs_practice/
├── composables/form-handling/p1/useContactForm.ts
├── components/form-handling/p1/ContactFormCard.vue
└── components/form-handling/p1/SubmitResultCard.vue
```

## 実務で必須の 4 つの概念

1. **型定義の明確化** – `FormValidationError[]` を props で受け取り、型安全に iterate
2. **コンポーネント分割** – 入力フォームと結果表示を分け、役割を明確化
3. **ロジックの分離** – composable 側で `errors` を管理し、UI は表示のみ
4. **明示的なインポート** – 深い階層のコンポーネントを必ず `~/components/...` で import

## 具体的な表示例

```vue
<p v-if="fieldError('email')" class="mt-1 text-sm text-red-400">
  {{ fieldError('email') }}
</p>
```

- `fieldError` は composable から渡されたエラー配列を検索するユーティリティ
- フィールドごとのメッセージなので UI が読みやすい

### 一覧表示（結果カード）

```vue
<ul class="text-sm list-disc list-inside">
  <li v-if="errors.length === 0" class="text-emerald-400">エラーはありません 🎉</li>
  <li v-for="error in errors" :key="error.field" class="text-red-300">
    {{ fieldLabels[error.field] }}: {{ error.message }}
  </li>
</ul>
```

- まとめて確認できる「デバッグパネル」的な役割
- 実務で QA / 開発者が確認しやすい

## スタイルのコツ

- テキストは `text-sm` と `text-red-400` などの Tailwind で統一
- フィールド直下にスペースを確保し、レイアウト崩れを防止
- エラーゼロ時にはポジティブなメッセージを表示して UX 向上

## まとめ

- フィールド単位の表示と、全体一覧表示の両方を実装
- エラー情報は props で渡し、UI では表示だけに専念
- Tailwind で色と余白を統一し、視認性を高める
