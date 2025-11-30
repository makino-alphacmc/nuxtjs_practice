# セクション 1: v-model でフォームの状態を同期する

> **このセクションでは [ContactFormCard.vue](../../components/form-handling/p1/ContactFormCard.vue) を参照してください**  
> v-model を活用して `ContactForm` の各プロパティと UI を双方向に同期します。

## フォルダ構成

```
nuxtjs_practice/
├── types/form-handling/p1/form.ts
├── composables/form-handling/p1/useContactForm.ts
└── components/form-handling/p1/ContactFormCard.vue
```

## 実務で必須の 4 つの概念

1. **型定義の明確化** – `ContactForm` で各フィールドの型と選択肢を定義
2. **コンポーネント分割** – フォーム UI を `ContactFormCard.vue` に切り出し、親はロジックに集中（props で受け取る）
3. **ロジックの分離** – `useContactForm()` にフォーム状態と更新関数を集約
4. **明示的なインポート** – 深い階層から `~/components/...`、`~/composables/...`、`~/types/...` を必ず記述

## v-model の実装ポイント

```vue
<UInput
  :model-value="form.name"
  @update:model-value="(value) => emit('update-field', { field: 'name', value })"
  label="氏名"
  placeholder="山田 太郎"
  icon="i-heroicons-user"
/>
```

- `:model-value` と `@update:model-value` のセットで双方向データバインディング
- emit で親（ページ）に変更を通知 → composable の `updateField` を呼び出す
- すべてのフィールドを同じパターンに揃えることで UI の一貫性を確保

## 親側の受け取り

```ts
const handleFieldUpdate = ({ field, value }: { field: keyof ContactForm; value: ContactForm[keyof ContactForm] }) => {
  updateField(field, value)
}
```

- 型推論のために `keyof ContactForm` を使用
- 任意のフィールドを 1 つの関数で扱えるようにして DRY（重複回避）

## よくある落とし穴

- `v-model` と `@update:model-value` の書き忘れ → 片方だけだと UI と状態が同期しない
- Number 型を取り扱うときは `.number` 修飾子や `Number()` でキャスト
- `ref`/`reactive` で作ったオブジェクトを直接代入するとリアクティビティが壊れる → `Object.assign` を使って更新

## まとめ

1. **型定義を作成**: `ContactForm` の型を定義してから実装を始める
2. **v-model の実装**: `:model-value` と `@update:model-value` セットで統一
3. **ロジックの分離**: 親は `updateField()` でロジック集中、子は UI 専念（props で受け取る）
4. **明示的なインポート**: 深い階層では自動インポートに頼らず明示的にインポート

このセクションでは、`v-model`の基本的な使い方と、実務で必須の 4 つの概念（型定義・コンポーネント分割・ロジックの分離・明示的なインポート）を学びました。次のセクションでは、バリデーション（入力チェック）の実装方法を学びます。
