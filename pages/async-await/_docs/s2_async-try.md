# セクション 2: 手動での非同期処理（async/await + try/catch）

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。ユーザー情報、投稿、コメントなどのサンプルデータを提供しており、実際のバックエンドサーバーなしでフロントエンドの開発や学習が可能です。

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
│           └── useUser.ts
├── components/                        # コンポーネント（必須）
│   └── async-await/
│       └── p1/
│           └── UserInfo.vue
└── pages/
    └── async-await/
        ├── _docs/                    # マニュアルファイル
        │   ├── s1_usefetch.md
        │   ├── s2_async-try.md       # このファイル
        │   ├── s3_promise.md
        │   ├── s4_await.md
        │   └── s5_error-handling.md
        └── p1/                       # 実装例
            └── index.vue             # メインコンポーネント
```

**実務で必須の 3 つの概念:**

1. **型定義の明確化** - `types/async-await/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/async-await/p1/UserInfo.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/async-await/p1/useUser.ts` で composables を活用

## 手動実装とは、なぜ必要なのか？

### 手動実装とは

`useFetch` のようなヘルパーを使わず、**自分で fetch・状態管理・エラーハンドリングを組み立てる実装**です。Nuxt / Vue の基本である Composition API を直接操作し、処理の開始から終了までをすべて自前で記述します。

### なぜ必要なのか？

1. **状態を完全に制御できる** – 取得結果やローディング表示を好きなタイミングで切り替えられる
2. **例外処理を細かく書ける** – エラーの種類に応じてメッセージやリトライ戦略を変えられる
3. **async/await を深く理解できる** – Promise をどの順序で await するかを体感しながら学べる
4. **複数 API の連携に強い** – 取得後の加工や別 API 呼び出しなど、自由なフローを構築できる

### 主な特徴

- **状態を ref で明示的に定義**: ローディング・データ・エラーを別々にリアクティブ管理
- **レスポンス検証を自分で実装**: HTTP ステータスやレスポンス構造を任意のルールでチェックできる
- **finally で後片付け**: 成功でも失敗でもローディング解除やログ出力などを確実に実行可能

## 一般的な使用例

### 基本の流れ

```typescript
const load = async () => {
	resetStates() // 前回分をクリア
	try {
		const raw = await fetch('https://jsonplaceholder.typicode.com/users/1')
		validate(raw)
		const result = await raw.json()
		store(result)
	} catch (err) {
		handle(err)
	} finally {
		stopLoading()
	}
}
```

- `resetStates()` で毎回クリーンな状態を作る
- `validate(raw)` で `response.ok` などをチェックし、問題があればここで例外化
- `handle(err)` ではログ・ユーザー向けメッセージ・リトライ準備をまとめて実施
- `finally` で UI を確実に通常状態へ戻す

### 応用パターン

1. **条件付きで取得**

   ```typescript
   if (shouldFetch.value) await fetchUserManually()
   ```

   条件を満たしたときだけ手動で呼び出す。

2. **複数 API を順番に実行**

   ```typescript
   await fetchUserManually()
   await fetchPostsManually()
   ```

   1 つ目の結果を 2 つ目の入力に利用するなど、手動ならではの制御が可能。

3. **リトライボタンを追加**
   ```typescript
   const retry = () => fetchUserManually()
   ```
   catch でボタンを表示し、ユーザー操作で同じフローを再実行。

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
export interface User {
	id: number
	name: string
	username: string
	email: string
	phone?: string
	website?: string
	address?: {
		street: string
		city: string
		zipcode: string
	}
	company?: {
		name: string
		catchPhrase?: string
	}
}
```

#### 1-2. 型定義の使用

```typescript
import type { User } from '~/types/async-await/p1/api'

// ❌ 悪い例：any を使う
const manualUser = ref<any>(null)

// ✅ 良い例：型を定義する
const manualUser = ref<User | null>(null)
```

**型定義のメリット：**

- IDE が自動補完してくれる（`user.value.name` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる
- リファクタリングが安全にできる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useUser.ts の作成

```typescript
// composables/async-await/p1/useUser.ts
import type { User } from '~/types/async-await/p1/api'

export const useUser = (userId: number = 1) => {
	const loading = ref(false)
	const user = ref<User | null>(null)
	const error = ref<string | null>(null)

	const fetchUser = async () => {
		user.value = null
		error.value = null
		loading.value = true

		try {
			const response = await fetch(
				`https://jsonplaceholder.typicode.com/users/${userId}`
			)
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			const data = (await response.json()) as User
			user.value = data
		} catch (err) {
			error.value = err instanceof Error ? err.message : '不明なエラー'
			console.error('エラー:', err)
		} finally {
			loading.value = false
		}
	}

	return {
		loading,
		user,
		error,
		fetchUser,
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
<script setup lang="ts">
	// composable を使うことで、ロジックが再利用可能になる
	const { loading, user, error, fetchUser } = useUser(1)
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/UserInfo.vue の作成

```vue
<!-- components/async-await/p1/UserInfo.vue -->

**コンポーネント分割のメリット：**

- ✅ **再利用性**: 複数のページで同じ UI を使える
- ✅ **保守性**: 変更が一箇所で済む
- ✅ **可読性**: ファイルが小さくなり、理解しやすくなる
- ✅ **テスト容易性**: コンポーネント単位でテストできる

#### 3-2. 親コンポーネントでの使用

```vue
<!-- pages/async-await/p1/index.vue -->
<template>
	<div>
		<UserInfo
			:user="user"
			:loading="loading"
			:error="error"
			@fetch="fetchUser"
		/>
	</div>
</template>

<script setup lang="ts">
	// composable からデータを取得
	const { loading, user, error, fetchUser } = useUser(1)
</script>
```

### 4. Template 部分の実装

#### 4-1. ヘッダーと操作ボタン
<template>
	<UCard>
		<template #header>
			<h2>ユーザー情報</h2>
		</template>
		<div v-if="user && !loading">
			<table class="w-full">
				<!-- ユーザー情報テーブル -->
			</table>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { User } from '~/types/async-await/p1/api'

interface Props {
	user: User | null
	loading: boolean
	error: string | null
}

defineProps<Props>()
</script>
```

#### 4-1. ヘッダーと操作ボタン

```vue
<template #header>
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-neutral-100">
			2. ユーザー情報を手動取得（async/await）
		</h2>
		<UButton
			@click="fetchUserManually"
			:loading="manualLoading"
			color="primary"
		>
			<template v-if="!manualLoading">ユーザー情報を取得</template>
			<template v-else>取得中...</template>
		</UButton>
	</div>
</template>
```

**コードの説明：**

- `UButton` の `@click` で `fetchUserManually` を直接呼び出し、手動トリガーを実現
- `:loading="manualLoading"` で API 実行中は自動でスピナー表示に切り替え
- `v-if / v-else` でボタンテキストも「取得」「取得中…」へ同期

#### 4-2. ローディング状態の表示

```vue
<div v-if="manualLoading" class="text-center py-8 text-neutral-400">
	<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"></div>
	<p class="mt-2">ユーザー情報を読み込み中...</p>
</div>
```

**コードの説明：**

- `v-if="manualLoading"` で API 呼び出し中のみ表示
- `animate-spin` を持つ円を描画し、視覚的に処理中であることを伝える
- テキストも「読み込み中」と明示してユーザーに待機を促す

#### 4-3. エラー状態の表示

```vue
<div
	v-if="manualError"
	class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
>
	<p class="text-red-400 font-medium">エラーが発生しました</p>
	<p class="text-red-300 text-sm mt-1">{{ manualError }}</p>
	<UButton size="sm" color="red" class="mt-3" @click="fetchUserManually">再試行する</UButton>
</div>
```

**コードの説明：**

- `manualError` に文字列がセットされた瞬間だけ赤帯を表示
- `{{ manualError }}` で catch 内で整形した詳細メッセージをそのまま提示
- リトライボタンから同じ `fetchUserManually` を呼び、ユーザー自身が再実行できる

#### 4-4. 結果テーブルの表示

```vue
<div v-if="manualUser && !manualLoading" class="overflow-x-auto">
	<table class="w-full border-collapse bg-neutral-900 rounded-lg">
		<thead>
			<tr class="bg-neutral-800 border-b border-neutral-700">
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">項目</th>
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">値</th>
			</tr>
		</thead>
		<tbody>
			<tr class="border-b border-neutral-800">
				<td class="px-4 py-3 text-sm text-neutral-400 font-medium">名前</td>
				<td class="px-4 py-3 text-sm text-neutral-200">{{ manualUser.name }}</td>
			</tr>
			<tr class="border-b border-neutral-800">
				<td class="px-4 py-3 text-sm text-neutral-400 font-medium">メール</td>
				<td class="px-4 py-3 text-sm text-neutral-200">{{ manualUser.email }}</td>
			</tr>
			<tr class="border-b border-neutral-800">
				<td class="px-4 py-3 text-sm text-neutral-400 font-medium">住所</td>
				<td class="px-4 py-3 text-sm text-neutral-200">
					{{ manualUser.address?.city }} / {{ manualUser.address?.street }}
				</td>
			</tr>
			<tr>
				<td class="px-4 py-3 text-sm text-neutral-400 font-medium">会社</td>
				<td class="px-4 py-3 text-sm text-neutral-200">{{ manualUser.company?.name }}</td>
			</tr>
		</tbody>
	</table>
	<p class="mt-4 text-sm text-neutral-400 text-center">
		JSONPlaceholder のユーザー ID: {{ manualUser.id }}
	</p>
</div>
```

**コードの説明：**

- `manualUser && !manualLoading` で「データが揃っていてローディング中でない」状態に限定
- テーブルの左列を「項目」、右列を「値」とし、見たい情報を順番に表示
- `manualUser.address?.city` のようにオプショナルチェーンでネストした値を安全に参照
- 末尾の `<p>` で ID など補足情報も表示し、取得結果をフル活用

## 実装の全体像

このセクションでは、実務で必須の 3 つの概念を実装しました：

### 1. 型定義の明確化

```typescript
// types/async-await/p1/api.ts
export interface User {
	id: number
	name: string
	username: string
	email: string
}
```

**メリット：**

- `any` の使用を減らし、実行時エラーを防ぐ
- IDE の補完機能が働く
- チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables）

```typescript
// composables/async-await/p1/useUser.ts
export const useUser = () => {
	const { loading, user, error, fetchUser } = ...
	return { loading, user, error, fetchUser }
}
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/async-await/p1/UserInfo.vue -->
<template>
	<UCard>
		<!-- ユーザー情報のUI -->
	</UCard>
</template>
```

**メリット：**

- ファイルが肥大化するのを防ぐ
- 再利用性が向上する
- 保守性が向上する

## まとめ

`async/await`と`try/catch`を使うことで、以下のメリットが得られます：

1. **コードがシンプル**: 状態リセット → API 実行 → 例外処理 → 後片付けを 1 つの関数に集約
2. **制御が細かい**: エラーメッセージの整形やリトライ導線など、細部まで自作できる
3. **保守性の向上**: 型定義と Composables を活用することで、実務レベルのコード品質を実現
4. **理解が深まる**: この手動フローを理解すると、次の Promise 並列・直列処理（セクション 3 / 4）もスムーズに応用できる

### 実装の流れ

1. **型定義を作成**: `types/async-await/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/async-await/p1/useUser.ts` でロジックを分離
3. **コンポーネントを作成**: `components/async-await/p1/UserInfo.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/async-await/p1/index.vue` で全てを組み合わせる

このセクションでは、手動での非同期処理の実装方法と、実務で必須の 3 つの概念（型定義・Composables・コンポーネント分割）を学びました。次のセクションでは、複数の API を並列で取得する方法を学びます。
