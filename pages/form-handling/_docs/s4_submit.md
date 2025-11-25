# セクション 4: サブミット処理（送信）

> **このセクションでは [useContactForm.ts](../../composables/form-handling/p1/useContactForm.ts) を参照してください**  
> 非同期送信、ローディング状態、成功時の結果反映までを一連のフローとして実装します。

## フォルダ構成

```
nuxtjs_practice/
├── composables/form-handling/p1/useContactForm.ts
├── components/form-handling/p1/ContactFormCard.vue
└── components/form-handling/p1/SubmitResultCard.vue
```

## 実務で必須の 4 つの概念

1. **型定義の明確化** – `SubmitResult` を定義し、成功時のデータを型安全に扱う
2. **ロジックの分離** – サブミット処理は composable に集約し、UI はボタン操作のみ
3. **コンポーネント分割** – 結果表示は `SubmitResultCard` に任せ、メインフォームをシンプルに
4. **明示的なインポート** – composable・コンポーネントをすべて `~/` からインポート

## 実装の流れ

1. **バリデーション通過を確認**
   ```ts
   if (!validateForm()) {
     return { success: false, error: new Error('入力内容を確認してください') }
   }
   ```

2. **ローディング状態を ON**
   ```ts
   isSubmitting.value = true
   submitResult.value = null
   ```

3. **疑似 API 呼び出し**（実務では `await $fetch` 等に置き換える）
   ```ts
   await new Promise((resolve) => setTimeout(resolve, 1000))
   ```

4. **結果を保持 & UI に反映**
   ```ts
   const result: SubmitResult = {
     success: true,
     timestamp: new Date().toISOString(),
     payload: { ...form },
   }
   submitResult.value = result
   ```

5. **例外処理 & finally ブロック**
   - `try / catch / finally` で成功・失敗どちらでもローディング解除
   - catch では `error instanceof Error` 判定でメッセージを統一

## UI との連携

- ボタンには `:loading="isSubmitting"` を付与して重複送信を防ぐ
- 成功時は結果カードに JSON を表示し、デバッグに活用

## まとめ

- サブミットは「バリデーション → ローディング → 非同期処理 → 結果反映 → ローディング解除」の順
- composable に処理を閉じ込めることでページやコンポーネントはシンプルになる
- 実務/API 置き換えも容易
