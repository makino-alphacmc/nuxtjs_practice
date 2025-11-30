# セクション 2: バリデーション（入力チェック）

> **このセクションでは [useContactForm.ts](../../composables/form-handling/p1/useContactForm.ts) を参照してください**  
> ルールを定義し、入力のたびに判定することでリアルタイムバリデーションを実現します。

## フォルダ構成

```
nuxtjs_practice/
├── types/form-handling/p1/form.ts
├── composables/form-handling/p1/useContactForm.ts
└── components/form-handling/p1/ContactFormCard.vue
```

## 実務で必須の 4 つの概念

1. **型定義の明確化** – `FormValidationError` で `field` と `message` を型安全に管理
2. **コンポーネント分割** – エラー表示はフォーム UI が担当、判定ロジックは触らない（props で受け取る）
3. **ロジックの分離** – バリデーションを composable にまとめ、UI から切り離す
4. **明示的なインポート** – composable / 型をすべて `~/composables/...` から明示的に import

## 実装ステップ

1. **ルールを定義**
   ```ts
   const EMAIL_REGEX = /^[\w.!#$%&'*+/=?`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/
   ```

2. **フィールド単位で判定**
   ```ts
   const validateField = (field: keyof ContactForm, value: ContactForm[keyof ContactForm]) => {
     if (field === 'name' && String(value).trim().length < 2) {
       return '氏名は2文字以上で入力してください'
     }
     // ...他のフィールドも同様
     return null
   }
   ```

3. **フォーム全体を判定**
   ```ts
   const validateForm = () => {
     const fields = Object.keys(form) as Array<keyof ContactForm>
     errors.value = []
     fields.forEach((field) => {
       const message = validateField(field, form[field])
       if (message) {
         errors.value.push({ field, message })
       }
     })
     return errors.value.length === 0
   }
   ```

4. **入力のたびにチェック**
   ```ts
   const updateField = (field: keyof ContactForm, value: ContactForm[keyof ContactForm]) => {
     form[field] = value as never
     const fieldError = validateField(field, value)
     setFieldError(field, fieldError)
   }
   ```

## ベストプラクティス

- エラーを配列で管理し、同じフィールドのメッセージは 1 つに統一する
- ルールをファイル上部にまとめておき、変更しやすくする
- 画面遷移や再送信に備えて `errors.value = []` でクリア処理を忘れない

## まとめ

- **ロジックの分離**: バリデーションは UI ではなく composable に集約する
- **バリデーション実装**: フィールド単体とフォーム全体の両方でチェック
- **型定義の明確化**: エラーは `FormValidationError` 型で一括管理
- **コンポーネント分割**: UI は props でエラーを受け取り、表示のみを担当

このセクションでは、バリデーション（入力チェック）の基本的な使い方と、実務で必須の 4 つの概念（型定義・コンポーネント分割・ロジックの分離・明示的なインポート）を学びました。次のセクションでは、エラー表示でフィードバックする方法を学びます。
