# セクション 5: エラーハンドリングを徹底解説

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。存在しない ID（例: /posts/99999）を指定することで 404 エラーを意図的に発生させ、エラーハンドリングの学習に最適です。

## エラーハンドリングとは、なぜ必要なのか？

### エラーハンドリングとは

API 呼び出しの **失敗パターンを整理し、ユーザーと開発者の双方に「何が起きたか」を伝える仕組み**です。HTTP ステータスやネットワーク例外を判別し、適切なメッセージと UI でリアクションを返します。

### なぜ必要なのか？

1. **異常時の UX を守る** – 失敗原因を明示すれば、ユーザーが再試行・問い合わせの判断をしやすい
2. **デバッグ効率を上げる** – ステータスやエラータイプをロギングすれば、開発者がすぐ原因を特定できる
3. **障害時の影響を局所化** – 期待しないレスポンスでも画面全体が壊れないようにできる
4. **実務で必須の要件** – 監視・アラート・サポート対応など、プロダクション運用に直結する

### 主な特徴

- **HTTP レイヤーとネットワーク例外を分けて扱う**
- **メッセージ設計をあらかじめ決めておく**（404/500/unknown など）
- **結果オブジェクトを 1 箇所にまとめる**ことで、テンプレート側がシンプルになる
- **UI の色やアイコンで状態変化を即座に伝える**

## 一般的な使用例

### 基本の流れ

```typescript
try {
	const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
	validateStatus(response) // ステータス判定
	const data = await response.json()
	showSuccess(data)
} catch (error) {
	showError(convertToMessage(error))
}
```

### よくある使用パターン

1. **404 と 500 の切り分け**
   ```typescript
   if (response.status === 404) showMessage('存在しない ID です')
   if (response.status >= 500) showMessage('サーバーが混雑しています')
   ```
2. **ネットワーク断検知**
   ```typescript
   if (error instanceof TypeError) showMessage('通信環境を確認してください')
   ```
3. **サポート用ログ付与**
   ```typescript
   console.error('API失敗', { status: response.status, url })
   ```

## 実装手順

### 1. Script 部分の実装

```typescript
// ============================================================
// セクション5: エラーハンドリングを徹底解説
// ============================================================
const errorHandlingLoading = ref(false) // テスト実行中かどうか
const errorHandlingResult = ref<any>(null) // 成功/失敗と詳細をまとめたオブジェクト

const fetchWithDetailedErrorHandling = async () => {
	errorHandlingResult.value = null // 前回結果をクリア
	errorHandlingLoading.value = true // ボタンのローディングを開始

	try {
		const response = await fetch(
			'https://jsonplaceholder.typicode.com/posts/99999'
		) // 404 を返すテスト API

		if (response.status === 404) {
			errorHandlingResult.value = {
				success: false,
				message: 'リソースが見つかりませんでした（404）',
				status: 404,
			}
			return // ここで終了し、テンプレートへ結果を渡す
		}

		if (response.status >= 500) {
			errorHandlingResult.value = {
				success: false,
				message: 'サーバーエラーが発生しました（500番台）',
				status: response.status,
			}
			return
		}

		if (!response.ok) {
			errorHandlingResult.value = {
				success: false,
				message: `HTTP エラー: ${response.status}`,
				status: response.status,
			}
			return
		}

		const data = await response.json() // 成功時のみ JSON を読み込む
		errorHandlingResult.value = {
			success: true,
			message: 'データの取得に成功しました',
			data,
		}
	} catch (error) {
		if (error instanceof TypeError && error.message.includes('fetch')) {
			errorHandlingResult.value = {
				success: false,
				message: 'ネットワークエラー: インターネット接続を確認してください',
				status: 'NETWORK_ERROR',
			}
		} else {
			errorHandlingResult.value = {
				success: false,
				message: error instanceof Error ? error.message : '不明なエラー',
				status: 'UNKNOWN_ERROR',
			}
		}
		console.error('詳細エラー情報:', error) // デバッグ用ログ
	} finally {
		errorHandlingLoading.value = false // UI を通常状態へ戻す
	}
}
```

**コードの説明：**

- `errorHandlingResult`: `success`/`message`/`status` を 1 つのオブジェクトにまとめ、テンプレート側の分岐を単純化
- `fetch('https://jsonplaceholder.typicode.com/posts/99999')`: JSONPlaceholder の存在しない ID（99999）を指定し、意図的に 404 エラーを発生させてエラーハンドリングのパターンを検証
- `status === 404`, `status >= 500`, `!ok`: 頻出ケースを段階的にチェックし、メッセージを出し分け
- `return` を挟んで早期リターンし、成功時の JSON 解析までたどり着かないようにする
- `TypeError` 判定でネットワークエラー特有のメッセージを表示（オフライン時など）
- `console.error` で詳細を残し、ユーザー表示とは別に開発者が調査しやすいようにする
- `finally` でローディングを必ず解除し、ボタンを再び押せるようにする

### 2. Template 部分の実装

#### 2-1. ヘッダーと操作ボタン

```vue
<template #header>
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-neutral-100">
			5. エラーハンドリングを徹底解説
		</h2>
		<div v-if="errorHandlingResult?.status" class="text-sm text-neutral-400">
			最新ステータス: {{ errorHandlingResult.status }}
		</div>
	</div>
</template>

<UButton
	@click="fetchWithDetailedErrorHandling"
	:loading="errorHandlingLoading"
	color="primary"
	class="mt-4"
>
	<template v-if="!errorHandlingLoading">エラーハンドリングをテスト</template>
	<template v-else>テスト実行中...</template>
</UButton>
```

**コードの説明：**

- ヘッダーで最新のステータスコード／エラータイプを確認できるようにし、何度もテストする際のメモになる
- ボタンのローディング表示は他セクションと統一し、操作感を揃える

#### 2-2. 成功／失敗の結果表示

```vue
<div v-if="errorHandlingResult" class="space-y-2 mt-4">
	<div
		v-if="errorHandlingResult.success"
		class="p-4 bg-green-950/20 rounded-lg border border-green-800"
	>
		<div class="flex items-center gap-2 mb-2">
			<span class="text-green-400 text-xl">✓</span>
			<p class="text-green-400 font-medium">処理成功</p>
		</div>
		<p class="text-neutral-300 text-sm mt-1">
			{{ errorHandlingResult.message }}
		</p>
	</div>
	<div
		v-else
		class="p-4 bg-red-950/20 rounded-lg border border-red-800"
	>
		<div class="flex items-center gap-2 mb-2">
			<span class="text-red-400 text-xl">✗</span>
			<p class="text-red-400 font-medium">エラー発生</p>
		</div>
		<p class="text-neutral-300 text-sm mt-1">
			{{ errorHandlingResult.message }}
		</p>
		<div class="mt-3 pt-3 border-t border-red-800">
			<table class="w-full text-xs">
				<tr>
					<td class="text-neutral-400 py-1">ステータスコード:</td>
					<td class="text-neutral-200 font-mono">
						{{ errorHandlingResult.status }}
					</td>
				</tr>
				<tr v-if="errorHandlingResult.status === 404">
					<td class="text-neutral-400 py-1">エラータイプ:</td>
					<td class="text-neutral-200">リソース未検出</td>
				</tr>
				<tr v-else-if="errorHandlingResult.status === 'NETWORK_ERROR'">
					<td class="text-neutral-400 py-1">エラータイプ:</td>
					<td class="text-neutral-200">通信エラー</td>
				</tr>
				<tr v-else-if="errorHandlingResult.status === 'UNKNOWN_ERROR'">
					<td class="text-neutral-400 py-1">エラータイプ:</td>
					<td class="text-neutral-200">想定外エラー</td>
				</tr>
			</table>
		</div>
	</div>
</div>
```

**コードの説明：**

- `errorHandlingResult.success` の真偽で成功カード／エラーカードを切り替え
- 失敗時はステータスを表形式で表示し、404/NETWORK_ERROR などをひと目で判別
- 追加の行を `v-else-if` で用意し、今後ステータスが増えても簡単に拡張可能

## まとめ

1. **エラーハンドリングはメッセージ設計と UI 表現をセットで考える**
2. **ステータスごとの早期リターンと catch フォールバック**でコードの見通しを良くできる
3. **結果オブジェクトを 1 箇所にまとめるとテンプレートがシンプル**になり、再利用もしやすい
4. ここまでで useFetch → 手動 async → Promise.all → 連続 await → 詳細エラー管理という非同期処理の主要パターンを網羅できたので、必要に応じてリトライやログ送信などの発展パターンにも挑戦してみよう
