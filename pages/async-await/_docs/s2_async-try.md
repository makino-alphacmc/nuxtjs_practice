# セクション 2: 手動での非同期処理（async/await + try/catch）

> **このセクションでは [JSONPlaceholder](https://jsonplaceholder.typicode.com/) を使用します**  
> JSONPlaceholder は、テストやプロトタイプ用の無料のフェイク REST API です。ユーザー情報、投稿、コメントなどのサンプルデータを提供しており、実際のバックエンドサーバーなしでフロントエンドの開発や学習が可能です。

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

### 1. Script 部分の実装

```typescript
// ============================================================
// セクション2: 手動での非同期処理（async/await + try/catch）
// ============================================================
const manualLoading = ref(false) // API 呼び出し中かどうか
const manualUser = ref<any>(null) // 取得したユーザー情報を保持
const manualError = ref<string | null>(null) // 表示用のエラーメッセージ

const fetchUserManually = async () => {
	manualUser.value = null // 以前の結果をクリア
	manualError.value = null // 前回のエラーをクリア
	manualLoading.value = true // ここからローディング開始

	try {
		const response = await fetch('https://jsonplaceholder.typicode.com/users/1') // API 呼び出し
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`) // ステータスが 200 系でなければ例外
		}
		const data = await response.json() // レスポンスボディを JSON 化
		manualUser.value = data // 画面で使うために格納
	} catch (error) {
		manualError.value = error instanceof Error ? error.message : '不明なエラー' // 表示用に文字列化
		console.error('エラー:', error) // デバッグログ
	} finally {
		manualLoading.value = false // 成功・失敗どちらでもローディング終了
	}
}
```

**コードの説明：**

- `manualLoading / manualUser / manualError`: 3 つの `ref` で UI 表示に必要な状態を切り分け
- `manualUser.value = null`: 新しい取得を始める前に前回結果を必ずリセット
- `manualLoading.value = true`: API 呼び出しが始まったタイミングでローディングをオン
- `await fetch('https://jsonplaceholder.typicode.com/users/1')`: JSONPlaceholder のユーザー API を呼び出し。ID 1 のユーザー情報を取得します
- `if (!response.ok) { throw ... }`: HTTP 400/500 系を手動で検出し、catch に処理を委ねる
- `await response.json()`: ボディを JSON へパース。await しないと Promise が残ってしまう
- `catch (error) { ... }`: エラーの型をチェックしつつユーザー表示用の文字列をセット
- `finally { manualLoading.value = false }`: どんな結果でも UI を通常状態へ戻す安全弁

### 2. Template 部分の実装

#### 2-1. ヘッダーと操作ボタン

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

#### 2-2. ローディング状態の表示

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

#### 2-3. エラー状態の表示

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

#### 2-4. 結果テーブルの表示

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

## まとめ

1. **状態リセット → API 実行 → 例外処理 → 後片付け** を 1 つの関数に集約することで見通しが良くなる
2. `ref` で分けたローディング／データ／エラーをテンプレートで素直に参照し UI を切り替える
3. エラーメッセージの整形やリトライ導線など、ヘルパーでは隠蔽される細部まで自作できる
4. この手動フローを理解すると、次の Promise 並列・直列処理（セクション 3 / 4）もスムーズに応用できる
