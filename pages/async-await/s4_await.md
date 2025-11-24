# セクション 4: await を連続させた順次データ取得

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
   const post = await fetchPost(id)
   const comments = await fetchComments(post.id)
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

### 1. Script 部分の実装

```typescript
// ============================================================
// セクション4: await を連続させた順次データ取得
// ============================================================
const sequentialLoading = ref(false) // 順次処理のローディング状態
const sequentialData = ref<any>(null) // 投稿とユーザーの結果をまとめる
const sequentialError = ref<string | null>(null) // 表示用のエラーメッセージ

const fetchSequentially = async () => {
	sequentialData.value = null // 以前の結果をクリア
	sequentialError.value = null // 前回のエラーをクリア
	sequentialLoading.value = true // 処理開始を UI に通知

	const startTime = Date.now() // 並列処理との差を測るため開始時間を記録

	try {
		const postRes = await fetch('https://jsonplaceholder.typicode.com/posts/1') // ステップ1: 投稿取得
		if (!postRes.ok) throw new Error('投稿の取得に失敗しました') // HTTP ステータスを毎回チェック
		const post = await postRes.json() // 投稿データを JSON 化

		const userRes = await fetch('https://jsonplaceholder.typicode.com/users/1') // ステップ2: ユーザー取得
		if (!userRes.ok) throw new Error('ユーザーの取得に失敗しました')
		const user = await userRes.json() // ユーザーデータを JSON 化

		const duration = Date.now() - startTime // 全体の処理時間を算出
		sequentialData.value = { post, user, duration } // 画面表示しやすい構造にまとめる
	} catch (error) {
		sequentialError.value =
			error instanceof Error ? error.message : '不明なエラー'
		console.error('順次処理エラー:', error) // 失敗箇所のヒントをログに残す
	} finally {
		sequentialLoading.value = false // 成功・失敗どちらでもローディング終了
	}
}
```

**コードの説明：**

- `sequentialLoading / sequentialData / sequentialError`: 順次処理専用の状態を切り分け、UI と同期
- `await fetch(...)` を 2 回に分けて記述し、処理の依存関係を明示
- それぞれのレスポンスで `.ok` を確認し、失敗時は即例外化して後続ステップを止める
- `duration` を保存することで、セクション 3 の並列取得との速度差を比較できる
- `catch` ではユーザー向け文言とログ出力を分け、UX とデバッグの両立を図る
- `finally` で UI を必ず元に戻し、ダブルクリックなどの誤操作を防ぐ

### 2. Template 部分の実装

#### 2-1. ヘッダーと操作ボタン

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
```

**コードの説明：**

- ヘッダーで順次処理であることを明示し、取得後は所要時間を表示
- ボタンは他セクションと同じローディング挙動で統一感をキープ
- クリックのたびに `fetchSequentially` が最初から実行される

#### 2-2. ローディング状態

```vue
<div v-if="sequentialLoading" class="text-center py-8 text-neutral-400">
	<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"></div>
	<p class="mt-2">ステップを順番に進めています...</p>
</div>
```

**コードの説明：**

- 順次処理中のみスピナーを表示し、ステップが進行中であることを伝える
- 文言を「順番に進めています」とすることで処理の特性を視覚化

#### 2-3. エラー表示

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

#### 2-4. ステップフローの可視化

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

## まとめ

1. **依存関係のある API では順次実行が不可欠**で、`await` を連ねるだけで実現できる
2. **エラーが出たら即座に後続ステップを止める**ため、無駄なリクエストを防げる
3. **並列処理との比較用に所要時間を計測**すると、ケースによって手法を選べるようになる
4. 次章のエラーハンドリング強化（セクション 5）で、順次処理の失敗時の情報整理方法を学ぶとさらに応用範囲が広がる
