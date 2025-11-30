# セクション 5: フォームリセット

> **このセクションでは [useContactForm.ts](../../composables/form-handling/p1/useContactForm.ts) を参照してください**  
> 送信後やキャンセル時にフォームを初期状態へ戻し、再入力できるようにします。

## フォルダ構成

```
nuxtjs_practice/
├── composables/form-handling/p1/useContactForm.ts
└── components/form-handling/p1/ContactFormCard.vue
```

## 実務で必須の 4 つの概念

1. **型定義の明確化** – `initialFormState()` で `ContactForm` の初期値を一元管理
2. **コンポーネント分割** – ボタンのクリックイベントは UI、処理本体は composable（props で受け取る）
3. **ロジックの分離** – `resetForm()` を composable に用意し、UI から呼び出すだけにする
4. **明示的なインポート** – ページ・コンポーネントで `resetForm` を明示的に取り込む

## 実装内容

```ts
const initialFormState = (): ContactForm => ({
  name: '',
  email: '',
  topic: 'question',
  message: '',
  agree: false,
})

const resetForm = () => {
  Object.assign(form, initialFormState())
  errors.value = []
  submitResult.value = null
}
```

- `Object.assign` で reactive オブジェクトを壊さずに初期値を再代入
- エラーと送信結果も同時にリセットして状態のズレを防止

## UI 側の呼び出し

```vue
<UButton
  type="button"
  color="gray"
  variant="ghost"
  icon="i-heroicons-arrow-path"
  :disabled="loading"
  @click="emit('reset')"
>
  入力をクリア
</UButton>
```

- `loading` 中は押せないようにする
- 親（ページ）は `resetForm()` を受け取って実行

## まとめ

- **型定義の明確化**: 初期値を 1 箇所に定義しておくと、フォーム項目が増えてもリセット処理がシンプル
- **ロジックの分離**: エラーや結果もセットでクリアし、画面の整合性を保つ（composable に集約）
- **コンポーネント分割**: UI は「ボタンを押した」というイベントだけ通知し、処理詳細は composable に任せる（props で受け取る）

このセクションでは、フォームリセットの基本的な使い方と、実務で必須の 4 つの概念（型定義・コンポーネント分割・ロジックの分離・明示的なインポート）を学びました。これで入力フォーム処理の基本を全て学習できました。
