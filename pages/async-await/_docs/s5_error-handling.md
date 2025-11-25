# セクション 5: エラーハンドリングを徹底解説

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。存在しない ID（例: /posts/99999）を指定することで 404 エラーを意図的に発生させ、エラーハンドリングの学習に最適です。

## フォルダ構成

このセクションで使用するファイル構成は以下の通りです：

```
nuxtjs_practice/
├── types/                            # 型定義ファイル（必須）
│   └── async-await/
│       └── p1/
│           └── api.ts
├── composables/                      # Composables（必須）
│   └── async-await/
│       └── p1/
│           └── useErrorHandling.ts
├── components/                        # コンポーネント（必須）
│   └── async-await/
│       └── p1/
│           └── ErrorResultDisplay.vue
└── pages/
    └── async-await/
        ├── _docs/                    # マニュアルファイル
        │   ├── s1_usefetch.md
        │   ├── s2_async-try.md
        │   ├── s3_promise.md
        │   ├── s4_await.md
        │   └── s5_error-handling.md # このファイル
        └── p1/                       # 実装例
            └── index.vue             # メインコンポーネント
```

**実務で必須の 3 つの概念:**

1. **型定義の明確化** - `types/async-await/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/async-await/p1/ErrorResultDisplay.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/async-await/p1/useErrorHandling.ts` で composables を活用

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

実務で必須の 3 つの概念を順番に実装していきます：

1. **型定義の明確化** - `any` の使用を減らす
2. **ロジックの分離** - composables の活用
3. **コンポーネントの分割** - 再利用性・保守性向上

### 1. 型定義の作成（必須）

`any` を使わずに**型定義を明確に**することが重要です。これにより、IDE の補完機能が働き、実行時エラーを防ぐことができます。

#### 1-1. 型定義ファイルの作成

```typescript
// types/async-await/p1/api.ts
export interface Post {
	id: number
	title: string
	body: string
}

export type ErrorStatus = number | 'NETWORK_ERROR' | 'UNKNOWN_ERROR'

export interface ErrorHandlingResult {
	success: boolean
	message: string
	status: ErrorStatus
	data?: Post
}
```

#### 1-2. 型定義の使用

```typescript
import type { Post, ErrorHandlingResult } from '~/types/async-await/p1/api'
```

**型定義のメリット：**

- IDE が自動補完してくれる（`result.value.status` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる
- リファクタリングが安全にできる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useErrorHandling.ts の作成

```typescript
// composables/async-await/p1/useErrorHandling.ts
import type { Post, ErrorHandlingResult } from '~/types/async-await/p1/api'

export const useErrorHandling = () => {
	const loading = ref(false)
	const result = ref<ErrorHandlingResult | null>(null)

	const fetchWithDetailedErrorHandling = async (postId: number = 99999) => {
		result.value = null
		loading.value = true

		try {
			const response = await fetch(
				`https://jsonplaceholder.typicode.com/posts/${postId}`
			)

			if (response.status === 404) {
				result.value = {
					success: false,
					message: 'リソースが見つかりませんでした（404）',
					status: 404,
				}
				return
			}

			if (response.status >= 500) {
				result.value = {
					success: false,
					message: 'サーバーエラーが発生しました（500番台）',
					status: response.status,
				}
				return
			}

			if (!response.ok) {
				result.value = {
					success: false,
					message: `HTTP エラー: ${response.status}`,
					status: response.status,
				}
				return
			}

			const data = (await response.json()) as Post
			result.value = {
				success: true,
				message: 'データの取得に成功しました',
				data,
			}
		} catch (error) {
			if (error instanceof TypeError && error.message.includes('fetch')) {
				result.value = {
					success: false,
					message: 'ネットワークエラー: インターネット接続を確認してください',
					status: 'NETWORK_ERROR',
				}
			} else {
				result.value = {
					success: false,
					message: error instanceof Error ? error.message : '不明なエラー',
					status: 'UNKNOWN_ERROR',
				}
			}
			console.error('詳細エラー情報:', error)
		} finally {
			loading.value = false
		}
	}

	return {
		loading,
		result,
		fetchWithDetailedErrorHandling,
	}
}
```

**Composables のメリット：**

- ✅ **再利用性**: 複数のページで同じロジックを使える
- ✅ **テスト容易性**: ロジックだけをテストできる
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: コンポーネントがシンプルになる

#### 2-2. コンポーネントでの使用

```typescript
// pages/async-await/p1/index.vue
<script setup lang='ts'>
	// composable を使うことで、ロジックが再利用可能になる const{' '}
	{(loading, result, fetchWithDetailedErrorHandling)} = useErrorHandling()
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/ErrorResultDisplay.vue の作成

````vue
<!-- components/async-await/p1/ErrorResultDisplay.vue -->

**コンポーネント分割のメリット：** - ✅ **再利用性**: 複数のページで同じ UI
を使える - ✅ **保守性**: 変更が一箇所で済む - ✅ **可読性**:
ファイルが小さくなり、理解しやすくなる - ✅ **テスト容易性**:
コンポーネント単位でテストできる #### 3-2. 親コンポーネントでの使用 ```vue
<!-- pages/async-await/p1/index.vue -->
<template>
	<div>
		<ErrorResultDisplay
			:result="result"
			:loading="loading"
			@fetch="fetchWithDetailedErrorHandling"
		/>
	</div>
</template>

<script setup lang="ts">
// composable からデータを取得
const { loading, result, fetchWithDetailedErrorHandling } = useErrorHandling()
</script>
````

### 4. Template 部分の実装

#### 4-1. ヘッダーと操作ボタン

<template>
	<div v-if="result" class="space-y-2">
		<SuccessCard v-if="result.success" :message="result.message" />
		<ErrorCard v-else :result="result" />
	</div>
</template>

<script setup lang="ts">
import type { ErrorHandlingResult } from '~/types/async-await/p1/api'

interface Props {
	result: ErrorHandlingResult | null
}

defineProps<Props>()
</script>

````

#### 4-1. ヘッダーと操作ボタン

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
````

**コードの説明：**

- ヘッダーで最新のステータスコード／エラータイプを確認できるようにし、何度もテストする際のメモになる
- ボタンのローディング表示は他セクションと統一し、操作感を揃える

#### 4-2. 成功／失敗の結果表示

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

## 実装の全体像

このセクションでは、実務で必須の 3 つの概念を実装しました：

### 1. 型定義の明確化

```typescript
// types/async-await/p1/api.ts
export interface ErrorHandlingResult {
	success: boolean
	message: string
	status: ErrorStatus
	data?: Post
}
```

**メリット：**

- `any` の使用を減らし、実行時エラーを防ぐ
- IDE の補完機能が働く
- チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables）

```typescript
// composables/async-await/p1/useErrorHandling.ts
export const useErrorHandling = () => {
	const { loading, result, fetchWithDetailedErrorHandling } = ...
	return { loading, result, fetchWithDetailedErrorHandling }
}
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/async-await/p1/ErrorResultDisplay.vue -->
<template>
	<div v-if="result" class="space-y-2">
		<!-- 成功／失敗の結果表示 -->
	</div>
</template>
```

**メリット：**

- ファイルが肥大化するのを防ぐ
- 再利用性が向上する
- 保守性が向上する

### 実務でのエラーハンドリングの重要性

エラーハンドリングは実務で**最も重要な要素の一つ**です：

- **ユーザー体験**: 適切なエラーメッセージでユーザーの混乱を防ぐ
- **デバッグ効率**: 詳細なログで問題の特定が容易になる
- **監視・アラート**: エラータイプに応じた適切な対応が可能
- **保守性**: 統一されたエラー処理でコードの見通しが良くなる

## まとめ

エラーハンドリングを徹底することで、以下のメリットが得られます：

1. **UX の向上**: 適切なエラーメッセージでユーザーの混乱を防ぐ
2. **デバッグ効率**: ステータスごとの早期リターンと catch フォールバックでコードの見通しを良くできる
3. **保守性の向上**: 結果オブジェクトを 1 箇所にまとめるとテンプレートがシンプルになり、再利用もしやすい
4. **安全性の向上**: 型定義と Composables を活用することで、エラーハンドリングも安全に管理できる

### 実装の流れ

1. **型定義を作成**: `types/async-await/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/async-await/p1/useErrorHandling.ts` でロジックを分離
3. **コンポーネントを作成**: `components/async-await/p1/ErrorResultDisplay.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/async-await/p1/index.vue` で全てを組み合わせる

このセクションでは、エラーハンドリングの詳細な実装方法と、実務で必須の 3 つの概念（型定義・Composables・コンポーネント分割）を学びました。ここまでで useFetch → 手動 async → Promise.all → 連続 await → 詳細エラー管理という非同期処理の主要パターンを網羅できたので、必要に応じてリトライやログ送信などの発展パターンにも挑戦してみましょう。
