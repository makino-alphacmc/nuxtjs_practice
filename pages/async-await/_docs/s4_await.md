# セクション 4: await を連続させた順次データ取得

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。投稿（posts）とユーザー（users）を順番に取得する順次処理の学習に最適です。

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
│           └── useSequentialData.ts
├── components/                        # コンポーネント（必須）
│   └── async-await/
│       └── p1/
│           └── SequentialSteps.vue
└── pages/
    └── async-await/
        ├── _docs/                    # マニュアルファイル
        │   ├── s1_usefetch.md
        │   ├── s2_async-try.md
        │   ├── s3_promise.md
        │   ├── s4_await.md           # このファイル
        │   └── s5_error-handling.md
        └── p1/                       # 実装例
            └── index.vue             # メインコンポーネント
```

**実務で必須の 3 つの概念:**

1. **型定義の明確化** - `types/async-await/p1/api.ts` で `any` の使用を減らす
2. **コンポーネントの分割** - `components/async-await/p1/SequentialSteps.vue` で再利用性・保守性を向上
3. **ロジックの分離** - `composables/async-await/p1/useSequentialData.ts` で composables を活用

## 順次実行とは、なぜ必要なのか？

### 順次実行とは

複数の非同期処理を **1 つずつ順番に実行し、先行処理の結果を次の処理に引き渡す**パターンです。`await` を連続で書くことで、「ステップ 1 が終わったらステップ 2」というフローを明示できます。

### なぜ必要なのか？

1. **依存関係の保証** – 後続 API が前の結果に依存する場合、順序を守らないと正しく動かない
2. **ロギング・計測が簡単** – 各ステップの開始／終了タイミングを記録しやすい
3. **デバッグしやすい** – どの await で止まったかが直感的に分かる
4. **UX に活かせる** – UI 上で「ステップ 1 → ステップ 2」と段階を演出できる

### 主な特徴

- `Promise.all` は使わず、`await` を縦に並べて手続き的な読みやすさを重視
- 途中でエラーが出るとその場で `catch` に飛ぶため、後続ステップは自動キャンセル
- `duration` など計測値を取得しておくと、並列版との比較が容易
- 依存性の強いフロー（例：投稿取得 → 投稿の作者を取得）で真価を発揮

## 一般的な使用例

### 基本の流れ

```typescript
const runSteps = async () => {
	const step1 = await fetchStep1()
	const step2 = await fetchStep2(step1.id)
	return combine(step1, step2)
}
```

### よくある使用パターン

1. **親データ → 子データ**
   ```typescript
   const post = await fetch('https://jsonplaceholder.typicode.com/posts/1')
   const comments = await fetch(
   	`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
   )
   ```
2. **認証 → プロフィール取得**
   ```typescript
   const session = await signIn()
   const profile = await fetchProfile(session.token)
   ```
3. **ユーザー選択後に続きの API を呼ぶ**
   ```typescript
   if (selectedUser.value) await fetchUserDetail(selectedUser.value)
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
	userId: number
}

export interface User {
	id: number
	name: string
	email: string
}

export interface SequentialData {
	post: Post
	user: User
	duration: number
}
```

#### 1-2. 型定義の使用

```typescript
import type { Post, User, SequentialData } from '~/types/async-await/p1/api'
```

**型定義のメリット：**

- IDE が自動補完してくれる（`data.value.post.title` など）
- タイポをコンパイル時に検出できる
- チーム開発でデータ構造が明確になる
- リファクタリングが安全にできる

### 2. ロジックの分離（Composables の活用）

ロジックを**composables**に分離することで、再利用性と保守性が向上します。

#### 2-1. composables/useSequentialData.ts の作成

```typescript
// composables/async-await/p1/useSequentialData.ts
import type { Post, User, SequentialData } from '~/types/async-await/p1/api'

export const useSequentialData = () => {
	const loading = ref(false)
	const data = ref<SequentialData | null>(null)
	const error = ref<string | null>(null)

	const fetchSequentially = async () => {
		data.value = null
		error.value = null
		loading.value = true

		const startTime = Date.now()

		try {
			const postRes = await fetch(
				'https://jsonplaceholder.typicode.com/posts/1'
			)
			if (!postRes.ok) throw new Error('投稿の取得に失敗しました')
			const post = (await postRes.json()) as Post

			const userRes = await fetch(
				'https://jsonplaceholder.typicode.com/users/1'
			)
			if (!userRes.ok) throw new Error('ユーザーの取得に失敗しました')
			const user = (await userRes.json()) as User

			const duration = Date.now() - startTime
			data.value = { post, user, duration }
		} catch (err) {
			error.value = err instanceof Error ? err.message : '不明なエラー'
			console.error('順次処理エラー:', err)
		} finally {
			loading.value = false
		}
	}

	return {
		loading,
		data,
		error,
		fetchSequentially,
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
	{(loading, data, error, fetchSequentially)} = useSequentialData()
</script>
```

### 3. コンポーネントの分割（再利用性・保守性向上）

大きなコンポーネントを**小さなコンポーネントに分割**することで、保守性と再利用性が向上します。

#### 3-1. components/SequentialSteps.vue の作成

````vue
<!-- components/async-await/p1/SequentialSteps.vue -->

**コンポーネント分割のメリット：** - ✅ **再利用性**: 複数のページで同じ UI
を使える - ✅ **保守性**: 変更が一箇所で済む - ✅ **可読性**:
ファイルが小さくなり、理解しやすくなる - ✅ **テスト容易性**:
コンポーネント単位でテストできる #### 3-2. 親コンポーネントでの使用 ```vue
<!-- pages/async-await/p1/index.vue -->
<template>
	<div>
		<SequentialSteps
			:data="data"
			:loading="loading"
			:error="error"
			@fetch="fetchSequentially"
		/>
	</div>
</template>

<script setup lang="ts">
// composable からデータを取得
const { loading, data, error, fetchSequentially } = useSequentialData()
</script>
````

### 4. Template 部分の実装

#### 4-1. ヘッダーと操作ボタン

<template>
	<div class="space-y-3">
		<StepItem
			:step="1"
			title="投稿データ取得"
			:data="data?.post?.title"
		/>
		<StepItem
			:step="2"
			title="ユーザーデータ取得"
			:data="data?.user?.name"
		/>
	</div>
</template>

<script setup lang="ts">
import type { SequentialData } from '~/types/async-await/p1/api'

interface Props {
	data: SequentialData | null
}

defineProps<Props>()
</script>

````

#### 4-1. ヘッダーと操作ボタン

```vue
<template #header>
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-neutral-100">
			4. データを順次取得（連続 await）
		</h2>
		<div
			v-if="sequentialData?.duration && !sequentialLoading"
			class="text-sm text-neutral-400"
		>
			処理時間: {{ sequentialData.duration }}ms
		</div>
	</div>
</template>

<UButton
	@click="fetchSequentially"
	:loading="sequentialLoading"
	color="primary"
	class="mt-4"
>
	<template v-if="!sequentialLoading">データを順次取得</template>
	<template v-else>順次取得中...</template>
</UButton>
````

**コードの説明：**

- ヘッダーで順次処理であることを明示し、取得後は所要時間を表示
- ボタンは他セクションと同じローディング挙動で統一感をキープ
- クリックのたびに `fetchSequentially` が最初から実行される

#### 4-2. ローディング状態

```vue
<div v-if="sequentialLoading" class="text-center py-8 text-neutral-400">
	<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"></div>
	<p class="mt-2">ステップを順番に進めています...</p>
</div>
```

**コードの説明：**

- 順次処理中のみスピナーを表示し、ステップが進行中であることを伝える
- 文言を「順番に進めています」とすることで処理の特性を視覚化

#### 4-3. エラー表示

```vue
<div
	v-if="sequentialError"
	class="p-4 bg-red-950/20 border border-red-800 rounded-lg mt-4"
>
	<p class="text-red-400 font-medium">エラーが発生しました</p>
	<p class="text-red-300 text-sm mt-1">{{ sequentialError }}</p>
	<UButton size="sm" color="red" class="mt-3" @click="fetchSequentially">再試行する</UButton>
</div>
```

**コードの説明：**

- 順次処理が途中で止まった場合のみ赤帯を表示
- catch で整形したメッセージを表示し、リトライボタンで同じフローをやり直せるようにする

#### 4-4. ステップフローの可視化

```vue
<div v-if="sequentialData && !sequentialLoading" class="space-y-3 mt-6">
	<div class="flex items-start gap-4">
		<div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
			1
		</div>
		<div class="flex-1 bg-neutral-900 rounded-lg border border-neutral-800 p-4">
			<p class="text-neutral-200 font-medium text-sm">投稿データ取得</p>
			<p class="text-neutral-400 text-sm">{{ sequentialData.post?.title }}</p>
		</div>
	</div>
	<div class="ml-4 my-2">
		<div class="w-0.5 h-6 bg-neutral-700"></div>
	</div>
	<div class="flex items-start gap-4">
		<div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
			2
		</div>
		<div class="flex-1 bg-neutral-900 rounded-lg border border-neutral-800 p-4">
			<p class="text-neutral-200 font-medium text-sm">ユーザーデータ取得</p>
			<p class="text-neutral-400 text-sm">{{ sequentialData.user?.name }}</p>
		</div>
	</div>
</div>
```

**コードの説明：**

- 並列処理との違いを視覚化するため、タイムライン風 UI でステップ順を明示
- 丸いナンバーと縦ラインで「ステップ 1 → 2」の流れを表現
- 各ボックスに取得したデータを表示し、順番に取得した成果が一目で分かる

## 実装の全体像

このセクションでは、実務で必須の 3 つの概念を実装しました：

### 1. 型定義の明確化

```typescript
// types/async-await/p1/api.ts
export interface SequentialData {
	post: Post
	user: User
	duration: number
}
```

**メリット：**

- `any` の使用を減らし、実行時エラーを防ぐ
- IDE の補完機能が働く
- チーム開発でデータ構造が明確になる

### 2. ロジックの分離（Composables）

```typescript
// composables/async-await/p1/useSequentialData.ts
export const useSequentialData = () => {
	const { loading, data, error, fetchSequentially } = ...
	return { loading, data, error, fetchSequentially }
}
```

**メリット：**

- コードの重複を防ぐ
- ロジックのテストが容易になる
- 変更が一箇所で済む

### 3. コンポーネントの分割

```vue
<!-- components/async-await/p1/SequentialSteps.vue -->
<template>
	<div class="space-y-3">
		<!-- ステップフローの可視化 -->
	</div>
</template>
```

**メリット：**

- ファイルが肥大化するのを防ぐ
- 再利用性が向上する
- 保守性が向上する

## まとめ

`await`を連続させることで、以下のメリットが得られます：

1. **依存関係の保証**: 後続 API が前の結果に依存する場合、順序を守らないと正しく動かない
2. **デバッグの容易さ**: どの await で止まったかが直感的に分かる
3. **UX の向上**: UI 上で「ステップ 1 → ステップ 2」と段階を演出できる
4. **保守性の向上**: 型定義と Composables を活用することで、依存関係のある複数 API も安全に管理できる

### 実装の流れ

1. **型定義を作成**: `types/async-await/p1/api.ts` で型を定義
2. **Composable を作成**: `composables/async-await/p1/useSequentialData.ts` でロジックを分離
3. **コンポーネントを作成**: `components/async-await/p1/SequentialSteps.vue` で UI を分割
4. **メインコンポーネントで統合**: `pages/async-await/p1/index.vue` で全てを組み合わせる

このセクションでは、`await`を連続させた順次処理の実装方法と、実務で必須の 3 つの概念（型定義・Composables・コンポーネント分割）を学びました。次のセクションでは、エラーハンドリングの詳細を学びます。
