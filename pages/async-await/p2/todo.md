# 非同期処理の学習計画（1 つずつ実装）

## 📚 学習の進め方

各セクションを順番に実装していきます。1 つ完了したら次のセクションに進みましょう。

**重要**：このガイドでは、コードの一行一行を詳しく解説します。初心者の方でも完全に理解できるように、なぜそのコードが必要なのか、何をしているのかを丁寧に説明します。

---

## 📄 ページ全体の構造（最初に実装）

### 🎯 学習目標

- Vue のテンプレート構造を理解する
- Tailwind CSS の基本的なクラス名を学ぶ
- Nuxt UI のコンポーネントの使い方を理解する

### 💻 完全な実装コード

```vue
<template>
	<!-- 
		ページ全体のコンテナ
		min-h-screen: 画面の最小高さを100%に設定
		bg-neutral-900: 背景色をダークグレーに設定
		p-8: パディング（内側の余白）を8（2rem）に設定
	-->
	<div class="min-h-screen bg-neutral-900 p-8">
		<!-- 
			コンテンツの最大幅を制限して中央寄せ
			max-w-4xl: 最大幅を4xl（56rem）に制限
			mx-auto: 左右のマージンを自動（中央寄せ）
		-->
		<div class="max-w-4xl mx-auto">
			<!-- 
				ページタイトル
				text-3xl: テキストサイズを3xlに設定
				font-bold: フォントを太字に設定
				text-neutral-100: テキスト色をライトグレーに設定
				mb-8: 下のマージンを8（2rem）に設定
			-->
			<h1 class="text-3xl font-bold text-neutral-100 mb-8">非同期処理の練習</h1>

			<!-- 
				ここに各セクションのカードを追加していきます
				セクション1、2、3、4、5のカードを順番に追加
			-->
		</div>
	</div>
</template>

<script setup lang="ts">
// ここに各セクションのスクリプトを追加していきます
</script>
```

### 📝 実装手順（チェックリスト）

1. ✅ `pages/async-await/p2/index.vue`ファイルを作成（既に存在する場合は開く）

2. ✅ `<template>`タグを追加

   ```vue
   <template></template>
   ```

3. ✅ ページ全体のコンテナを追加

   ```vue
   <div class="min-h-screen bg-neutral-900 p-8">
   ```

4. ✅ コンテンツの最大幅を制限するコンテナを追加

   ```vue
   <div class="max-w-4xl mx-auto">
   ```

5. ✅ ページタイトルを追加

   ```vue
   <h1 class="text-3xl font-bold text-neutral-100 mb-8">
     非同期処理の練習
   </h1>
   ```

6. ✅ `</div>`を 2 つ追加（コンテナを閉じる）

   ```vue
   </div>
   </div>
   ```

7. ✅ `</template>`タグを追加

   ```vue
   </template>
   ```

8. ✅ `<script setup lang="ts">`タグを追加

   ```vue
   <script setup lang="ts"></script>
   ```

### 🧪 確認ポイント

- [ ] ページが表示されるか？
- [ ] タイトルが中央に表示されるか？
- [ ] 背景色がダークグレーになっているか？

---

## ✅ セクション 1: useFetch を使った基本的な API 通信

### 🎯 学習目標

- Nuxt の`useFetch` composable の使い方を理解する
- ローディング状態、エラー状態、データの自動管理を学ぶ
- ページ読み込み時に自動で API を呼び出す方法を理解する

### 📖 なぜ重要なのか

`useFetch`は Nuxt が提供する最も便利な composable の 1 つです。

- **自動的にローディング状態を管理**：`pending`という ref が自動で`true`/`false`になる
- **自動的にエラーをキャッチ**：`error`という ref にエラー情報が入る
- **SSR 対応**：サーバーサイドでも動作する
- **重複リクエストの防止**：同じ URL へのリクエストは自動でまとめられる

### 💻 完全な実装コード（一行一行の解説付き）

#### `<script setup>`部分の実装

```typescript
// ============================================================
// セクション1: useFetch を使った基本的なAPI通信
// ============================================================

// 【重要】useFetch は Nuxt が提供する composable です
// composable とは、再利用可能なロジックをまとめた関数のことです
// useFetch を使うと、API 通信が自動的に実行され、状態管理も自動で行われます

const {
	// ↓ data: 取得したデータが入る ref（リアクティブな変数）
	//   別名を付ける場合は「data: 新しい名前」と書きます
	//   ここでは「data」を「posts」という名前に変更しています
	data: posts,

	// ↓ pending: ローディング中かどうかを表す ref（boolean型）
	//   API リクエスト中は true、完了すると false になります
	//   別名を付ける場合は「pending: 新しい名前」と書きます
	//   ここでは「pending」を「postsPending」という名前に変更しています
	pending: postsPending,

	// ↓ error: エラー情報が入る ref
	//   エラーが発生した場合のみ値が入り、正常時は null です
	//   別名を付ける場合は「error: 新しい名前」と書きます
	//   ここでは「error」を「postsError」という名前に変更しています
	error: postsError,

	// ↓ useFetch に API の URL を渡します
	//   この URL に GET リクエストが自動的に送信されます
	//   ページが読み込まれた瞬間に API が呼ばれます
} = useFetch('https://jsonplaceholder.typicode.com/posts')
```

**一行一行の詳細解説**：

1. **`const { ... } = useFetch(...)`**

   - `useFetch`はオブジェクトを返します
   - オブジェクトの分割代入（destructuring）を使って、必要な値を取り出しています
   - `const`は定数宣言で、再代入できません（Vue の ref は`.value`で値を変更します）

2. **`data: posts`**

   - `data`は`useFetch`が返すオブジェクトのプロパティ名です
   - `:`の後ろの`posts`は、この値を格納する変数名です
   - つまり、「`data`という名前の値を、`posts`という変数に格納する」という意味です
   - これにより、テンプレートでは`posts`という名前でデータにアクセスできます

3. **`pending: postsPending`**

   - `pending`は`useFetch`が返すオブジェクトのプロパティ名です
   - `postsPending`という変数に格納されます
   - この値は`ref<boolean>`型で、`true`または`false`が入ります

4. **`error: postsError`**

   - `error`は`useFetch`が返すオブジェクトのプロパティ名です
   - `postsError`という変数に格納されます
   - エラーが発生した場合のみ値が入り、正常時は`null`です

5. **`useFetch('https://jsonplaceholder.typicode.com/posts')`**
   - `useFetch`に API の URL を文字列で渡します
   - この URL に対して GET リクエストが自動的に送信されます
   - ページが読み込まれた瞬間に実行されます（手動で呼び出す必要はありません）

#### `<template>`部分の実装

```vue
<!-- セクション1: 基本的なAPI通信（useFetch） -->
<UCard class="mb-6 bg-neutral-950">
	<template #header>
		<h2 class="text-xl font-semibold text-neutral-100">
			1. 基本的なAPI通信（useFetch）
		</h2>
	</template>
	<div class="space-y-4">
		<!-- ============================================================ -->
		<!-- ローディング状態の表示 -->
		<!-- ============================================================ -->
		<!-- 
			v-if="postsPending" の意味：
			- v-if は条件付きレンダリングのディレクティブです
			- postsPending が true の時だけ、この div が表示されます
			- postsPending は ref なので、自動的にリアクティブに更新されます
			- API リクエスト中は true、完了すると false になるため、
			  ローディング中のみ「読み込み中...」が表示されます
		-->
		<div v-if="postsPending" class="text-neutral-400">読み込み中...</div>

		<!-- ============================================================ -->
		<!-- エラー状態の表示 -->
		<!-- ============================================================ -->
		<!-- 
			v-if="postsError" の意味：
			- postsError が null でない（エラーが発生した）時だけ表示されます
			- postsError はエラーオブジェクトで、message プロパティを持っています
			- {{ postsError.message }} でエラーメッセージを表示します
			- 二重波括弧 {{ }} は Vue のテンプレート構文で、JavaScript の式を評価します
		-->
		<div v-if="postsError" class="text-red-400">
			エラー: {{ postsError.message }}
		</div>

		<!-- ============================================================ -->
		<!-- データ表示部分 -->
		<!-- ============================================================ -->
		<!-- 
			v-if="posts && !postsPending" の意味：
			- posts が存在し（null でない）、かつ postsPending が false の時だけ表示
			- && は論理積（AND）演算子です
			- !postsPending は「postsPending が false」という意味です
			- つまり、「データが取得できて、ローディングが終わった時」に表示されます
		-->
		<div v-if="posts && !postsPending" class="space-y-2">
			<!-- 
				取得した投稿数を表示
				posts.length は配列の要素数を取得します
			-->
			<p class="text-neutral-300">取得した投稿数: {{ posts.length }}件</p>

			<!-- 
				スクロール可能なコンテナ
				max-h-40 は最大高さを 40（10rem）に制限
				overflow-y-auto は縦方向のスクロールを有効化
			-->
			<div class="max-h-40 overflow-y-auto">
				<!-- 
					v-for は配列をループして要素を表示するディレクティブです
					v-for="post in posts.slice(0, 3)" の意味：
					- posts 配列の最初の 3 件だけを取得（slice(0, 3)）
					- 各要素を post という変数名でループ
					- :key="post.id" は各要素を一意に識別するためのキー
					- key は Vue が効率的に DOM を更新するために必要です
				-->
				<div
					v-for="post in posts.slice(0, 3)"
					:key="post.id"
					class="p-3 bg-neutral-900 rounded-lg mb-2"
				>
					<!-- 
						post.title で投稿のタイトルを表示
						post はループ中の各投稿オブジェクトです
					-->
					<p class="text-neutral-200 font-medium">{{ post.title }}</p>
					<!-- 
						post.body で投稿の本文を表示
					-->
					<p class="text-neutral-400 text-sm">{{ post.body }}</p>
				</div>
			</div>
		</div>
	</div>
</UCard>
```

### 📝 実装手順（チェックリスト）

#### `<script setup>`部分の実装

1. ✅ `<script setup>`内に`useFetch`を記述

   - `pages/async-await/p2/index.vue`の`<script setup>`部分を開く
   - セクション 1 のコメント部分を見つける
   - 上記のコードをコピー＆ペースト

#### `<template>`部分の実装

**注意**: ページ全体の構造は、上記の「📄 ページ全体の構造（最初に実装）」セクションで既に実装済みです。ここでは、セクション 1 のカード部分のみを追加します。

2. ✅ UCard コンポーネントでセクション 1 のカードを作成

   ```vue
   <UCard class="mb-6 bg-neutral-950">
     <template #header>
       <h2 class="text-xl font-semibold text-neutral-100">
         1. 基本的なAPI通信（useFetch）
       </h2>
     </template>
     <div class="space-y-4">
   ```

   - `UCard`: Nuxt UI のカードコンポーネント
   - `mb-6`: 下のマージンを 6（1.5rem）に設定
   - `bg-neutral-950`: カードの背景色をさらに濃いグレーに設定
   - `<template #header>`: カードのヘッダー部分を定義（スロット）
   - `<div class="space-y-4">`: カード内のコンテンツ用のコンテナ（縦方向の間隔を 4 に設定）

3. ✅ ローディング状態の表示を追加

   ```vue
   <div v-if="postsPending" class="text-neutral-400">読み込み中...</div>
   ```

   - `v-if="postsPending"`: postsPending が true の時だけ表示
   - `text-neutral-400`: テキスト色をライトグレーに設定

4. ✅ エラー状態の表示を追加

   ```vue
   <div v-if="postsError" class="text-red-400">
     エラー: {{ postsError.message }}
   </div>
   ```

   - `v-if="postsError"`: postsError が null でない時だけ表示
   - `{{ postsError.message }}`: エラーメッセージを表示（Vue のテンプレート構文）

5. ✅ データ表示部分を追加

   ```vue
   <div v-if="posts && !postsPending" class="space-y-2">
     <p class="text-neutral-300">取得した投稿数: {{ posts.length }}件</p>
   ```

   - `v-if="posts && !postsPending"`: posts が存在し、かつローディングが終わった時だけ表示
   - `space-y-2`: 子要素の縦方向の間隔を 2（0.5rem）に設定
   - `{{ posts.length }}`: 配列の要素数を表示

6. ✅ スクロール可能なコンテナを追加

   ```vue
   <div class="max-h-40 overflow-y-auto">
   ```

   - `max-h-40`: 最大高さを 40（10rem）に制限
   - `overflow-y-auto`: 縦方向のスクロールを有効化

7. ✅ v-for で投稿リストを表示

   ```vue
   <div
   	v-for="post in posts.slice(0, 3)"
   	:key="post.id"
   	class="p-3 bg-neutral-900 rounded-lg mb-2"
   >
     <p class="text-neutral-200 font-medium">{{ post.title }}</p>
     <p class="text-neutral-400 text-sm">{{ post.body }}</p>
   </div>
   ```

   - `v-for="post in posts.slice(0, 3)"`: posts 配列の最初の 3 件をループ
   - `:key="post.id"`: 各要素を一意に識別するキー（Vue の必須）
   - `p-3`: パディングを 3（0.75rem）に設定
   - `rounded-lg`: 角を丸くする
   - `mb-2`: 下のマージンを 2（0.5rem）に設定

8. ✅ 閉じタグを追加

   ```vue
     </div>
   </div>
   </UCard>
   ```

   - スクロール可能なコンテナを閉じる（`</div>`）
   - データ表示部分を閉じる（`</div>`）
   - UCard コンポーネントを閉じる（`</UCard>`）

### 🧪 確認ポイント

- [ ] ページを開いた瞬間に API が呼ばれるか？（ブラウザの開発者ツールの Network タブで確認）
- [ ] ローディング中に「読み込み中...」が表示されるか？
- [ ] データが表示されるか？
- [ ] ネットワークをオフにしてエラー表示がされるか？（Chrome の開発者ツールで Network を Offline に設定）

---

## ✅ セクション 2: 手動での非同期処理（async/await + try/catch）

### 🎯 学習目標

- `async/await`の基本的な使い方を理解する
- `try/catch/finally`を使ったエラーハンドリングを学ぶ
- 手動でローディング状態を管理する方法を理解する
- `fetch` API の基本的な使い方を学ぶ

### 📖 なぜ重要なのか

`useFetch`は便利ですが、以下の場合は手動で`fetch`を使う必要があります：

- **ボタンクリック時など、任意のタイミングで API を呼びたい**
- **POST/PUT/DELETE など、GET 以外のメソッドを使う**
- **より細かい制御が必要な場合**
- **カスタムヘッダーや認証トークンを送る必要がある場合**

### 💻 完全な実装コード（一行一行の解説付き）

#### `<script setup>`部分の実装

```typescript
// ============================================================
// セクション2: 手動での非同期処理（async/await + try/catch）
// ============================================================

// 【ステップ1】状態管理用の ref を定義
// ============================================================

// manualLoading: ローディング中かどうかを表す ref
// ref(false) で初期値を false に設定
// false = ローディング中ではない、true = ローディング中
const manualLoading = ref(false)

// manualUser: 取得したユーザーデータを保存する ref
// ref<any>(null) で初期値を null に設定
// <any> は TypeScript の型で、「どんな型でも OK」という意味
// null = データがまだ取得されていない状態
const manualUser = ref<any>(null)

// manualError: エラーメッセージを保存する ref
// ref<string | null>(null) で初期値を null に設定
// <string | null> は TypeScript の型で、「文字列または null」という意味
// null = エラーが発生していない状態
const manualError = ref<string | null>(null)

// 【ステップ2】非同期関数を定義
// ============================================================

// fetchUserManually: ユーザー情報を手動で取得する関数
// async キーワードを付けることで、この関数内で await が使えるようになります
// async 関数は必ず Promise を返します
const fetchUserManually = async () => {
	// 【ステップ3】状態をリセット
	// ============================================================

	// manualUser.value = null
	// - 前回取得したデータをクリアします
	// - .value は ref の値を取得・設定するために必要です
	// - ref を使う場合は、値を設定する時に .value を付けます
	manualUser.value = null

	// manualError.value = null
	// - 前回のエラーメッセージをクリアします
	manualError.value = null

	// manualLoading.value = true
	// - ローディングを開始します
	// - true にすることで、テンプレート側で「ローディング中」と表示できます
	manualLoading.value = true

	// 【ステップ4】try/catch/finally でエラーハンドリング
	// ============================================================

	// try ブロック: エラーが発生する可能性のあるコードを書きます
	try {
		// 【ステップ5】fetch API で API を呼び出す
		// ============================================================

		// fetch('https://jsonplaceholder.typicode.com/users/1')
		// - fetch はブラウザの標準 API です
		// - URL を渡すと、その URL に GET リクエストを送信します
		// - fetch は Promise を返します（非同期処理）

		// await キーワード
		// - await を付けると、Promise が完了するまで待ちます
		// - つまり、API のレスポンスが返ってくるまで、次の行に進みません
		// - await を使うには、関数に async キーワードが必要です

		// response: fetch の結果（Response オブジェクト）が入ります
		// Response オブジェクトには、ステータスコード、ヘッダー、ボディなどが含まれます
		const response = await fetch('https://jsonplaceholder.typicode.com/users/1')

		// 【ステップ6】HTTP エラーチェック
		// ============================================================

		// response.ok の意味：
		// - HTTP ステータスコードが 200-299 の範囲の場合、true になります
		// - 404（Not Found）や 500（Internal Server Error）の場合は false になります

		// !response.ok の意味：
		// - ! は否定演算子で、「response.ok が false の場合」という意味です
		// - つまり、「エラーが発生した場合」という意味です

		// if (!response.ok) { ... }
		// - エラーが発生した場合、このブロック内のコードが実行されます
		if (!response.ok) {
			// throw new Error(...)
			// - throw はエラーを投げる（throw）キーワードです
			// - new Error(...) で新しいエラーオブジェクトを作成します
			// - エラーを投げると、catch ブロックでキャッチできます
			// - テンプレートリテラル（バッククォート）を使って、ステータスコードを含めたメッセージを作成
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		// 【ステップ7】JSON をパース（解析）する
		// ============================================================

		// response.json()
		// - レスポンスボディを JSON としてパース（解析）します
		// - これも非同期処理なので、Promise を返します

		// await response.json()
		// - JSON のパースが完了するまで待ちます
		// - パースが完了すると、JavaScript のオブジェクト（配列やオブジェクト）が返ります

		// data: パースされたデータが入ります
		// 例: { id: 1, name: "Leanne Graham", email: "Sincere@april.biz", ... }
		const data = await response.json()

		// manualUser.value = data
		// - 取得したデータを manualUser に保存します
		// - .value を付けて ref の値を設定します
		// - これにより、テンプレート側でデータが表示されます
		manualUser.value = data

		// 【ステップ8】エラーをキャッチする
		// ============================================================
	} catch (error) {
		// catch ブロック: try ブロックでエラーが発生した場合、このブロックが実行されます

		// error instanceof Error の意味：
		// - instanceof は、オブジェクトが特定のクラスのインスタンスかどうかをチェックします
		// - Error は JavaScript の標準エラークラスです
		// - つまり、「error が Error オブジェクトかどうか」をチェックしています

		// error.message の意味：
		// - Error オブジェクトには message プロパティがあります
		// - エラーメッセージが入っています

		// 三項演算子（条件 ? 値1 : 値2）の意味：
		// - 条件が true なら値1、false なら値2 を返します
		// - ここでは、「error が Error オブジェクトなら error.message、そうでなければ '不明なエラー'」という意味

		// manualError.value = ...
		// - エラーメッセージを manualError に保存します
		// - これにより、テンプレート側でエラーが表示されます
		manualError.value = error instanceof Error ? error.message : '不明なエラー'

		// console.error('エラー:', error)
		// - コンソールにエラーを出力します（デバッグ用）
		// - 開発者ツールの Console タブで確認できます
		console.error('エラー:', error)
	} finally {
		// 【ステップ9】ローディングを終了する
		// ============================================================

		// finally ブロック: try ブロックが成功しても失敗しても、必ず実行されます

		// manualLoading.value = false
		// - ローディングを終了します
		// - 成功・失敗に関わらず、必ず実行されるため、ローディング状態が残りません
		manualLoading.value = false
	}
}
```

**一行一行の詳細解説（重要なポイント）**：

1. **`async`キーワード**

   - 関数の前に`async`を付けると、その関数内で`await`が使えるようになります
   - `async`関数は必ず`Promise`を返します
   - 例：`const fetchUserManually = async () => { ... }`

2. **`await`キーワード**

   - `await`を付けると、Promise が完了するまで待ちます
   - つまり、非同期処理が完了するまで、次の行に進みません
   - 例：`const response = await fetch(...)`

3. **`ref`の使い方**

   - `ref`は Vue 3 のリアクティブな変数です
   - 値を設定する時は`.value`を付けます：`manualLoading.value = true`
   - 値を取得する時も`.value`を付けます：`if (manualLoading.value) { ... }`
   - テンプレート内では`.value`を付けなくてもアクセスできます：`v-if="manualLoading"`

4. **`try/catch/finally`の構造**

   - `try`：エラーが発生する可能性のあるコードを書く
   - `catch`：エラーが発生した時に実行されるコード
   - `finally`：成功・失敗に関わらず必ず実行されるコード

5. **`fetch` API**

   - ブラウザの標準 API で、HTTP リクエストを送信できます
   - `fetch(url)`で GET リクエストを送信します
   - 戻り値は`Response`オブジェクトです

6. **`response.ok`**

   - HTTP ステータスコードが 200-299 の範囲の場合、`true`になります
   - 404 や 500 などのエラーは`false`になります

7. **`response.json()`**
   - レスポンスボディを JSON としてパースします
   - これも非同期処理なので`await`が必要です

#### `<template>`部分の実装

```vue
<!-- セクション2: 手動での非同期処理（async/await） -->
<UCard class="mb-6 bg-neutral-950">
	<template #header>
		<h2 class="text-xl font-semibold text-neutral-100">
			2. 手動での非同期処理（async/await + try/catch）
		</h2>
	</template>
	<div class="space-y-4">
		<!-- 
			@click="fetchUserManually" の意味：
			- @click はクリックイベントを監視するディレクティブです
			- ボタンがクリックされると、fetchUserManually 関数が実行されます

			:loading="manualLoading" の意味：
			- :loading は props を動的に設定するディレクティブです（v-bind:loading の省略形）
			- manualLoading が true の時、ボタンにローディング表示が表示されます
			- また、ボタンが無効化（disabled）されます
		-->
		<UButton
			@click="fetchUserManually"
			:loading="manualLoading"
			color="primary"
		>
			ユーザー情報を取得
		</UButton>

		<!-- 
			エラー表示
			v-if="manualError" で、エラーが発生した時だけ表示されます
		-->
		<div
			v-if="manualError"
			class="text-red-400 p-3 bg-red-950/20 rounded"
		>
			エラー: {{ manualError }}
		</div>

		<!-- 
			データ表示
			v-if="manualUser && !manualLoading" で、
			データが取得できて、ローディングが終わった時だけ表示されます
		-->
		<div
			v-if="manualUser && !manualLoading"
			class="p-4 bg-neutral-900 rounded-lg"
		>
			<!-- 
				manualUser.name など、オブジェクトのプロパティにアクセスできます
				オプショナルチェーン（?.）を使うと、null の時にエラーになりません
				例: manualUser?.name
			-->
			<p class="text-neutral-200 font-medium">{{ manualUser.name }}</p>
			<p class="text-neutral-400 text-sm">{{ manualUser.email }}</p>
			<p class="text-neutral-400 text-sm">{{ manualUser.phone }}</p>
		</div>
	</div>
</UCard>
```

**一行一行の詳細解説**：

1. **`<UCard>`コンポーネント**

   - Nuxt UI のカードコンポーネントを使用
   - `mb-6`: 下のマージンを設定（セクション間の間隔）
   - `bg-neutral-950`: カードの背景色を設定

2. **`<template #header>`スロット**

   - カードのヘッダー部分を定義
   - `#header`は`v-slot:header`の省略形
   - セクションのタイトルを表示

3. **`<UButton>`コンポーネント**

   - `@click="fetchUserManually"`: クリック時に`fetchUserManually`関数を実行
   - `:loading="manualLoading"`: ローディング状態を props として渡す
   - `color="primary"`: ボタンの色をプライマリーカラーに設定

4. **エラー表示部分**

   - `v-if="manualError"`: manualError が null でない時だけ表示
   - `bg-red-950/20`: 背景色を赤系の半透明に設定（`/20`は透明度 20%）
   - `rounded`: 角を丸くする

5. **データ表示部分**
   - `v-if="manualUser && !manualLoading"`: データが存在し、ローディングが終わった時だけ表示
   - `manualUser.name`: オブジェクトのプロパティにアクセス
   - `text-sm`: テキストサイズを小さく設定

### 📝 実装手順（チェックリスト）

#### `<script setup>`部分の実装

1. ✅ 状態管理用の`ref`を 3 つ定義

   - `manualLoading`
   - `manualUser`
   - `manualError`

2. ✅ `async`関数を定義

   - `fetchUserManually`関数の中身を実装

3. ✅ 関数の最初で状態をリセットし、ローディングを`true`に

   ```typescript
   manualUser.value = null
   manualError.value = null
   manualLoading.value = true
   ```

4. ✅ `try`ブロック内で`fetch`を実行

   ```typescript
   const response = await fetch('https://jsonplaceholder.typicode.com/users/1')
   ```

5. ✅ HTTP エラーチェック

   ```typescript
   if (!response.ok) {
   	throw new Error(`HTTP error! status: ${response.status}`)
   }
   ```

6. ✅ JSON をパースしてデータに代入

   ```typescript
   const data = await response.json()
   manualUser.value = data
   ```

7. ✅ `catch`ブロックでエラーをキャッチして表示

   ```typescript
   catch (error) {
     manualError.value = error instanceof Error ? error.message : '不明なエラー'
   }
   ```

8. ✅ `finally`ブロックでローディングを`false`に

   ```typescript
   finally {
     manualLoading.value = false
   }
   ```

#### `<template>`部分の実装

9. ✅ UCard コンポーネントでセクション 2 のカードを作成

   ```vue
   <UCard class="mb-6 bg-neutral-950">
     <template #header>
       <h2 class="text-xl font-semibold text-neutral-100">
         2. 手動での非同期処理（async/await + try/catch）
       </h2>
     </template>
     <div class="space-y-4">
   ```

10. ✅ UButton コンポーネントを追加

    ```vue
    <UButton
    	@click="fetchUserManually"
    	:loading="manualLoading"
    	color="primary"
    >
      ユーザー情報を取得
    </UButton>
    ```

    - `@click="fetchUserManually"`: クリックイベントハンドラーを設定
    - `:loading="manualLoading"`: ローディング状態を props として渡す

11. ✅ エラー表示部分を追加

    ```vue
    <div v-if="manualError" class="text-red-400 p-3 bg-red-950/20 rounded">
      エラー: {{ manualError }}
    </div>
    ```

    - `v-if="manualError"`: エラーが存在する時だけ表示
    - `bg-red-950/20`: 赤系の半透明背景（透明度 20%）

12. ✅ データ表示部分を追加

    ```vue
    <div
    	v-if="manualUser && !manualLoading"
    	class="p-4 bg-neutral-900 rounded-lg"
    >
      <p class="text-neutral-200 font-medium">{{ manualUser.name }}</p>
      <p class="text-neutral-400 text-sm">{{ manualUser.email }}</p>
      <p class="text-neutral-400 text-sm">{{ manualUser.phone }}</p>
    </div>
    ```

    - `v-if="manualUser && !manualLoading"`: データが存在し、ローディングが終わった時だけ表示
    - `{{ manualUser.name }}`: オブジェクトのプロパティを表示

### 🧪 確認ポイント

- [ ] ボタンをクリックすると API が呼ばれるか？（Network タブで確認）
- [ ] ローディング中にボタンが無効化されるか？
- [ ] データが正しく表示されるか？
- [ ] エラーが発生したときにエラーメッセージが表示されるか？

---

## ✅ セクション 3: Promise.all（並列処理）

### 🎯 学習目標

- `Promise.all`の使い方を理解する
- 複数の API を同時に呼び出す方法を学ぶ
- 並列処理と順次処理の違いを理解する
- 処理時間の計測方法を学ぶ

### 📖 なぜ重要なのか

複数の API を呼び出す場合、2 つの方法があります：

1. **順次処理**：1 つずつ順番に実行（時間がかかる）
2. **並列処理**：同時に実行（速い）

例えば、3 つの API を順次処理すると：

- API1: 200ms
- API2: 200ms
- API3: 200ms
- **合計: 600ms**

並列処理すると：

- API1, API2, API3 を同時に実行: 200ms
- **合計: 200ms**

**3 倍速くなります！**

### 💻 完全な実装コード（一行一行の解説付き）

#### `<script setup>`部分の実装

```typescript
// ============================================================
// セクション3: Promise.all（並列処理）
// ============================================================

// 【ステップ1】状態管理用の ref を定義
// ============================================================

// parallelLoading: ローディング中かどうかを表す ref
const parallelLoading = ref(false)

// parallelData: 取得したデータを保存する ref
// 複数のデータ（post, user, comment）と処理時間（duration）を保存します
const parallelData = ref<any>(null)

// parallelError: エラーメッセージを保存する ref
const parallelError = ref<string | null>(null)

// 【ステップ2】非同期関数を定義
// ============================================================

const fetchMultipleData = async () => {
	// 【ステップ3】状態をリセット
	// ============================================================

	// 前回のデータをクリア
	parallelData.value = null
	// 前回のエラーをクリア
	parallelError.value = null
	// ローディングを開始
	parallelLoading.value = true

	// 【ステップ4】処理時間の計測を開始
	// ============================================================

	// Date.now() の意味：
	// - 現在時刻をミリ秒で返します
	// - 例: 1704067200000（2024年1月1日 0時0分0秒からの経過ミリ秒数）

	// startTime: 処理開始時刻を記録
	// 後で処理終了時刻と比較して、経過時間を計算します
	const startTime = Date.now()

	// 【ステップ5】try/catch/finally でエラーハンドリング
	// ============================================================

	try {
		// 【ステップ6】Promise.all で複数の API を並列実行
		// ============================================================

		// Promise.all([...]) の意味：
		// - 複数の Promise を配列で受け取ります
		// - すべての Promise が完了するまで待ちます
		// - すべての Promise が成功した場合、結果の配列を返します
		// - 1 つでもエラーが発生すると、全体がエラーになります

		// [postRes, userRes, commentRes] の意味：
		// - 配列の分割代入（destructuring）です
		// - Promise.all の結果（配列）を、3 つの変数に分割して代入します
		// - postRes には 1 つ目の fetch の結果が入ります
		// - userRes には 2 つ目の fetch の結果が入ります
		// - commentRes には 3 つ目の fetch の結果が入ります

		// 3 つの fetch を同時に実行：
		// - fetch('...posts/1') が実行される
		// - fetch('...users/1') が実行される
		// - fetch('...comments/1') が実行される
		// - これらは「同時に」実行されるため、並列処理になります
		// - すべてのレスポンスが返ってくるまで待ちます

		const [postRes, userRes, commentRes] = await Promise.all([
			fetch('https://jsonplaceholder.typicode.com/posts/1'),
			fetch('https://jsonplaceholder.typicode.com/users/1'),
			fetch('https://jsonplaceholder.typicode.com/comments/1'),
		])

		// 【ステップ7】すべてのレスポンスをチェック
		// ============================================================

		// !postRes.ok || !userRes.ok || !commentRes.ok の意味：
		// - || は論理和（OR）演算子です
		// - 「postRes.ok が false」または「userRes.ok が false」または「commentRes.ok が false」の場合
		// - つまり、「1 つでもエラーが発生した場合」という意味です

		// if (!postRes.ok || !userRes.ok || !commentRes.ok) { ... }
		// - 1 つでもエラーが発生した場合、このブロック内のコードが実行されます
		if (!postRes.ok || !userRes.ok || !commentRes.ok) {
			// エラーを投げる
			throw new Error('一部のリクエストが失敗しました')
		}

		// 【ステップ8】JSON のパースも並列実行
		// ============================================================

		// response.json() も非同期処理なので、これも並列実行できます
		// Promise.all で 3 つの json() を同時に実行します

		// [post, user, comment] の意味：
		// - 配列の分割代入です
		// - post には 1 つ目の JSON パース結果が入ります
		// - user には 2 つ目の JSON パース結果が入ります
		// - comment には 3 つ目の JSON パース結果が入ります

		const [post, user, comment] = await Promise.all([
			postRes.json(), // 1 つ目のレスポンスを JSON としてパース
			userRes.json(), // 2 つ目のレスポンスを JSON としてパース
			commentRes.json(), // 3 つ目のレスポンスを JSON としてパース
		])

		// 【ステップ9】処理時間を計算
		// ============================================================

		// Date.now() - startTime の意味：
		// - 現在時刻から開始時刻を引くことで、経過時間を計算します
		// - 単位はミリ秒です
		// - 例: 200（200 ミリ秒 = 0.2 秒）

		const duration = Date.now() - startTime

		// 【ステップ10】データと経過時間を保存
		// ============================================================

		// parallelData.value に、取得したデータと処理時間を保存します
		// オブジェクトのプロパティとして保存することで、テンプレート側でアクセスしやすくなります
		parallelData.value = {
			post, // post: post の省略形（ES6 のショートハンド）
			user, // user: user の省略形
			comment, // comment: comment の省略形
			duration, // duration: duration の省略形
		}

		// 上記は以下と同じ意味です：
		// parallelData.value = {
		//   post: post,
		//   user: user,
		//   comment: comment,
		//   duration: duration,
		// }
	} catch (error) {
		// 【ステップ11】エラーをキャッチ
		// ============================================================

		// エラーメッセージを保存
		parallelError.value =
			error instanceof Error ? error.message : '不明なエラー'
		// コンソールにエラーを出力（デバッグ用）
		console.error('並列処理エラー:', error)
	} finally {
		// 【ステップ12】ローディングを終了
		// ============================================================

		// 成功・失敗に関わらず、ローディングを終了します
		parallelLoading.value = false
	}
}
```

**一行一行の詳細解説（重要なポイント）**：

1. **`Promise.all([...])`**

   - 複数の Promise を配列で受け取ります
   - すべての Promise が完了するまで待ちます
   - すべての Promise が成功した場合、結果の配列を返します
   - 1 つでもエラーが発生すると、全体がエラーになります

2. **並列処理の仕組み**

   - `Promise.all`内の Promise は「同時に」実行されます
   - 例：3 つの API を並列実行すると、3 つ同時にリクエストが送信されます
   - すべてのレスポンスが返ってくるまで待ちます

3. **配列の分割代入**

   - `const [a, b, c] = [1, 2, 3]`のように、配列の要素を変数に分割して代入できます
   - `Promise.all`の結果（配列）を、複数の変数に分割して代入します

4. **処理時間の計測**
   - `Date.now()`で現在時刻をミリ秒で取得
   - 開始時刻を記録し、終了時刻との差を計算
   - 並列処理と順次処理の速度差を確認できます

#### `<template>`部分の実装

```vue
<!-- セクション3: Promise.all（並列処理） -->
<UCard class="mb-6 bg-neutral-950">
	<template #header>
		<h2 class="text-xl font-semibold text-neutral-100">
			3. Promise.all（並列処理）
		</h2>
	</template>
	<div class="space-y-4">
		<!-- 
			UButton: 並列処理を開始するボタン
			@click="fetchMultipleData" でクリック時に関数を実行
			:loading="parallelLoading" でローディング状態を表示
		-->
		<UButton
			@click="fetchMultipleData"
			:loading="parallelLoading"
			color="primary"
		>
			複数のデータを並列取得
		</UButton>

		<!-- 
			エラー表示
			v-if="parallelError" で、エラーが発生した時だけ表示
		-->
		<div
			v-if="parallelError"
			class="text-red-400 p-3 bg-red-950/20 rounded"
		>
			エラー: {{ parallelError }}
		</div>

		<!-- 
			データ表示
			v-if="parallelData && !parallelLoading" で、
			データが取得できて、ローディングが終わった時だけ表示
		-->
		<div v-if="parallelData && !parallelLoading" class="space-y-3">
			<!-- 
				投稿データの表示
				parallelData.post?.title で投稿のタイトルを表示
				? はオプショナルチェーンで、null の時にエラーになりません
			-->
			<div class="p-4 bg-neutral-900 rounded-lg">
				<p class="text-neutral-200 font-medium mb-2">投稿 #1</p>
				<p class="text-neutral-400 text-sm">
					{{ parallelData.post?.title }}
				</p>
			</div>

			<!-- 
				ユーザーデータの表示
				parallelData.user?.name でユーザー名を表示
			-->
			<div class="p-4 bg-neutral-900 rounded-lg">
				<p class="text-neutral-200 font-medium mb-2">ユーザー #1</p>
				<p class="text-neutral-400 text-sm">
					{{ parallelData.user?.name }}
				</p>
			</div>

			<!-- 
				コメントデータの表示
				parallelData.comment?.body でコメント本文を表示
			-->
			<div class="p-4 bg-neutral-900 rounded-lg">
				<p class="text-neutral-200 font-medium mb-2">コメント #1</p>
				<p class="text-neutral-400 text-sm">
					{{ parallelData.comment?.body }}
				</p>
			</div>

			<!-- 
				処理時間の表示
				parallelData.duration で経過時間（ミリ秒）を表示
			-->
			<p class="text-neutral-300 text-sm mt-2">
				取得時間: {{ parallelData.duration }}ms
			</p>
		</div>
	</div>
</UCard>
```

**一行一行の詳細解説**：

1. **`<UButton>`コンポーネント**

   - `@click="fetchMultipleData"`: クリック時に並列処理を開始
   - `:loading="parallelLoading"`: ローディング状態を表示

2. **エラー表示部分**

   - `v-if="parallelError"`: エラーが発生した時だけ表示
   - セクション 2 と同じ構造

3. **データ表示部分**

   - `v-if="parallelData && !parallelLoading"`: データが存在し、ローディングが終わった時だけ表示
   - `space-y-3`: 子要素の縦方向の間隔を 3（0.75rem）に設定

4. **オプショナルチェーン（`?.`）**

   - `parallelData.post?.title`: post が null の場合でもエラーにならない
   - `?.`は「オプショナルチェーン」と呼ばれる構文
   - null や undefined の場合は undefined を返す

5. **処理時間の表示**
   - `{{ parallelData.duration }}ms`: 経過時間をミリ秒で表示
   - 並列処理の速さを確認できる

### 📝 実装手順（チェックリスト）

#### `<script setup>`部分の実装

1. ✅ 状態管理用の`ref`を定義

   - `parallelLoading`
   - `parallelData`
   - `parallelError`

2. ✅ `async`関数を定義

   - `fetchMultipleData`関数の中身を実装

3. ✅ 開始時刻を記録

   ```typescript
   const startTime = Date.now()
   ```

4. ✅ `Promise.all`で 3 つの API を並列実行

   ```typescript
   const [postRes, userRes, commentRes] = await Promise.all([
   	fetch('https://jsonplaceholder.typicode.com/posts/1'),
   	fetch('https://jsonplaceholder.typicode.com/users/1'),
   	fetch('https://jsonplaceholder.typicode.com/comments/1'),
   ])
   ```

5. ✅ すべてのレスポンスをチェック

   ```typescript
   if (!postRes.ok || !userRes.ok || !commentRes.ok) {
   	throw new Error('一部のリクエストが失敗しました')
   }
   ```

6. ✅ `Promise.all`で JSON を並列パース

   ```typescript
   const [post, user, comment] = await Promise.all([
   	postRes.json(),
   	userRes.json(),
   	commentRes.json(),
   ])
   ```

7. ✅ 経過時間を計算

   ```typescript
   const duration = Date.now() - startTime
   ```

8. ✅ データと経過時間を保存

   ```typescript
   parallelData.value = {
   	post,
   	user,
   	comment,
   	duration,
   }
   ```

9. ✅ エラーハンドリング

   - `catch`ブロックでエラーをキャッチ
   - `finally`ブロックでローディングを終了

#### `<template>`部分の実装

10. ✅ UCard コンポーネントでセクション 3 のカードを作成

    ```vue
    <UCard class="mb-6 bg-neutral-950">
      <template #header>
        <h2 class="text-xl font-semibold text-neutral-100">
          3. Promise.all（並列処理）
        </h2>
      </template>
      <div class="space-y-4">
    ```

11. ✅ UButton コンポーネントを追加

    ```vue
    <UButton
    	@click="fetchMultipleData"
    	:loading="parallelLoading"
    	color="primary"
    >
      複数のデータを並列取得
    </UButton>
    ```

12. ✅ エラー表示部分を追加

    ```vue
    <div v-if="parallelError" class="text-red-400 p-3 bg-red-950/20 rounded">
      エラー: {{ parallelError }}
    </div>
    ```

13. ✅ データ表示部分を追加（投稿データ）

    ```vue
    <div v-if="parallelData && !parallelLoading" class="space-y-3">
      <div class="p-4 bg-neutral-900 rounded-lg">
        <p class="text-neutral-200 font-medium mb-2">投稿 #1</p>
        <p class="text-neutral-400 text-sm">
          {{ parallelData.post?.title }}
        </p>
      </div>
    ```

    - `parallelData.post?.title`: オプショナルチェーンで安全にアクセス

14. ✅ ユーザーデータの表示を追加

    ```vue
    <div class="p-4 bg-neutral-900 rounded-lg">
      <p class="text-neutral-200 font-medium mb-2">ユーザー #1</p>
      <p class="text-neutral-400 text-sm">
        {{ parallelData.user?.name }}
      </p>
    </div>
    ```

15. ✅ コメントデータの表示を追加

    ```vue
    <div class="p-4 bg-neutral-900 rounded-lg">
      <p class="text-neutral-200 font-medium mb-2">コメント #1</p>
      <p class="text-neutral-400 text-sm">
        {{ parallelData.comment?.body }}
      </p>
    </div>
    ```

16. ✅ 処理時間の表示を追加

    ```vue
    <p class="text-neutral-300 text-sm mt-2">
      取得時間: {{ parallelData.duration }}ms
    </p>
    ```

    - `mt-2`: 上のマージンを 2（0.5rem）に設定

### 🧪 確認ポイント

- [ ] 3 つの API が同時に呼ばれるか？（Network タブで確認。3 つのリクエストが同時に開始される）
- [ ] 処理時間が表示されるか？
- [ ] セクション 4（順次処理）と比較して速いか？

---

## ✅ セクション 4: 順次処理（await の連続）

### 🎯 学習目標

- `await`を連続で使う順次処理の方法を理解する
- 並列処理と順次処理の違いを体感する
- 前の処理の結果を使って次の処理をする方法を学ぶ

### 📖 なぜ重要なのか

並列処理が速いのは分かりましたが、以下の場合は順次処理が必要です：

1. **前の処理の結果を使って次の処理をする場合**

   ```typescript
   const user = await fetchUser(1) // ユーザー情報を取得
   const posts = await fetchPosts(user.id) // ユーザーのIDを使って投稿を取得
   ```

2. **API の呼び出し回数を制限したい場合**

   - 並列で 100 個の API を呼ぶとサーバーに負荷がかかる
   - 順次処理で 1 つずつ呼べば負荷を分散できる

3. **処理の順序が重要な場合**
   - データの作成 → 更新 → 削除の順番が重要

### 💻 完全な実装コード（一行一行の解説付き）

#### `<script setup>`部分の実装

```typescript
// ============================================================
// セクション4: 順次処理（await の連続）
// ============================================================

// 【ステップ1】状態管理用の ref を定義
// ============================================================

// sequentialLoading: ローディング中かどうかを表す ref
const sequentialLoading = ref(false)

// sequentialData: 取得したデータを保存する ref
const sequentialData = ref<any>(null)

// sequentialError: エラーメッセージを保存する ref
const sequentialError = ref<string | null>(null)

// 【ステップ2】非同期関数を定義
// ============================================================

const fetchSequentially = async () => {
	// 【ステップ3】状態をリセット
	// ============================================================

	sequentialData.value = null
	sequentialError.value = null
	sequentialLoading.value = true

	// 【ステップ4】処理時間の計測を開始
	// ============================================================

	const startTime = Date.now()

	// 【ステップ5】try/catch/finally でエラーハンドリング
	// ============================================================

	try {
		// 【ステップ6】1 つ目の API を実行して完了を待つ
		// ============================================================

		// await fetch('...posts/1')
		// - 1 つ目の API を実行します
		// - await を付けているので、この API が完了するまで、次の行に進みません
		// - つまり、「1 つ目が完了してから 2 つ目を実行する」という順次処理になります

		const postRes = await fetch('https://jsonplaceholder.typicode.com/posts/1')

		// 【ステップ7】1 つ目のレスポンスをチェック
		// ============================================================

		// if (!postRes.ok) throw new Error(...)
		// - エラーが発生した場合、エラーを投げます
		// - throw すると、catch ブロックに飛びます
		// - これにより、2 つ目の API は実行されません（処理が中断されます）

		if (!postRes.ok) throw new Error('投稿の取得に失敗しました')

		// 【ステップ8】1 つ目の JSON をパース
		// ============================================================

		// await postRes.json()
		// - 1 つ目のレスポンスを JSON としてパースします
		// - これも await を付けているので、パースが完了するまで待ちます
		// - パースが完了してから、次の行に進みます

		const post = await postRes.json()

		// 【ステップ9】2 つ目の API を実行（1 つ目が完了してから）
		// ============================================================

		// await fetch('...users/1')
		// - 2 つ目の API を実行します
		// - 1 つ目の API が完了してから実行されるため、順次処理になります
		// - もし 1 つ目でエラーが発生した場合、この行は実行されません（既に catch ブロックに飛んでいるため）

		const userRes = await fetch('https://jsonplaceholder.typicode.com/users/1')

		// 【ステップ10】2 つ目のレスポンスをチェック
		// ============================================================

		if (!userRes.ok) throw new Error('ユーザーの取得に失敗しました')

		// 【ステップ11】2 つ目の JSON をパース
		// ============================================================

		const user = await userRes.json()

		// 【ステップ12】処理時間を計算
		// ============================================================

		const duration = Date.now() - startTime

		// 【ステップ13】データと経過時間を保存
		// ============================================================

		sequentialData.value = {
			post,
			user,
			duration,
		}
	} catch (error) {
		// 【ステップ14】エラーをキャッチ
		// ============================================================

		sequentialError.value =
			error instanceof Error ? error.message : '不明なエラー'
		console.error('順次処理エラー:', error)
	} finally {
		// 【ステップ15】ローディングを終了
		// ============================================================

		sequentialLoading.value = false
	}
}
```

**一行一行の詳細解説（重要なポイント）**：

1. **順次処理の仕組み**

   - `await`を連続で使うと、前の処理が完了してから次の処理が実行されます
   - 例：`await fetch(...)` → `await fetch(...)` の順で実行すると、1 つ目が完了してから 2 つ目が実行されます

2. **並列処理との違い**

   - **並列処理**：`Promise.all([fetch(...), fetch(...)])` → 同時に実行
   - **順次処理**：`await fetch(...)` → `await fetch(...)` → 順番に実行

3. **処理時間の違い**

   - 並列処理：3 つの API が同時に実行されるため、最も遅い API の時間だけかかります
   - 順次処理：3 つの API を順番に実行するため、すべての API の時間の合計がかかります

4. **エラーハンドリング**
   - 各段階でエラーチェックを行います
   - エラーが発生した時点で処理を中断できます
   - どの処理で失敗したかが分かりやすいです

#### `<template>`部分の実装

```vue
<!-- セクション4: 順次処理（await の連続） -->
<UCard class="mb-6 bg-neutral-950">
	<template #header>
		<h2 class="text-xl font-semibold text-neutral-100">
			4. 順次処理（await の連続）
		</h2>
	</template>
	<div class="space-y-4">
		<!-- 
			UButton: 順次処理を開始するボタン
			@click="fetchSequentially" でクリック時に関数を実行
			:loading="sequentialLoading" でローディング状態を表示
		-->
		<UButton
			@click="fetchSequentially"
			:loading="sequentialLoading"
			color="primary"
		>
			データを順次取得
		</UButton>

		<!-- 
			エラー表示
			v-if="sequentialError" で、エラーが発生した時だけ表示
		-->
		<div
			v-if="sequentialError"
			class="text-red-400 p-3 bg-red-950/20 rounded"
		>
			エラー: {{ sequentialError }}
		</div>

		<!-- 
			データ表示
			v-if="sequentialData && !sequentialLoading" で、
			データが取得できて、ローディングが終わった時だけ表示
		-->
		<div v-if="sequentialData && !sequentialLoading" class="space-y-3">
			<!-- 
				ステップ1: 投稿データの表示
				順次処理であることを示すため、「ステップ1」というラベルを付けています
			-->
			<div class="p-4 bg-neutral-900 rounded-lg">
				<p class="text-neutral-200 font-medium mb-2">
					ステップ1: 投稿 #1
				</p>
				<p class="text-neutral-400 text-sm">
					{{ sequentialData.post?.title }}
				</p>
			</div>

			<!-- 
				ステップ2: ユーザーデータの表示
				順次処理であることを示すため、「ステップ2」というラベルを付けています
			-->
			<div class="p-4 bg-neutral-900 rounded-lg">
				<p class="text-neutral-200 font-medium mb-2">
					ステップ2: ユーザー #1
				</p>
				<p class="text-neutral-400 text-sm">
					{{ sequentialData.user?.name }}
				</p>
			</div>

			<!-- 
				処理時間の表示
				順次処理の合計時間を表示します
				並列処理と比較して、時間がかかることが分かります
			-->
			<p class="text-neutral-300 text-sm mt-2">
				合計時間: {{ sequentialData.duration }}ms
			</p>
		</div>
	</div>
</UCard>
```

**一行一行の詳細解説**：

1. **`<UButton>`コンポーネント**

   - `@click="fetchSequentially"`: クリック時に順次処理を開始
   - `:loading="sequentialLoading"`: ローディング状態を表示

2. **エラー表示部分**

   - セクション 2、3 と同じ構造

3. **データ表示部分**

   - `v-if="sequentialData && !sequentialLoading"`: データが存在し、ローディングが終わった時だけ表示
   - `space-y-3`: 子要素の縦方向の間隔を設定

4. **ステップラベルの表示**

   - 「ステップ 1」「ステップ 2」というラベルで、順次処理であることを明示
   - 並列処理との違いを視覚的に分かりやすくする

5. **処理時間の表示**
   - `{{ sequentialData.duration }}ms`: 順次処理の合計時間を表示
   - 並列処理と比較して、時間がかかることが確認できる

### 📝 実装手順（チェックリスト）

#### `<script setup>`部分の実装

1. ✅ 状態管理用の`ref`を定義

   - `sequentialLoading`
   - `sequentialData`
   - `sequentialError`

2. ✅ `async`関数を定義

   - `fetchSequentially`関数の中身を実装

3. ✅ 開始時刻を記録

   ```typescript
   const startTime = Date.now()
   ```

4. ✅ 1 つ目の API を`await`で実行

   ```typescript
   const postRes = await fetch('https://jsonplaceholder.typicode.com/posts/1')
   ```

5. ✅ エラーチェック

   ```typescript
   if (!postRes.ok) throw new Error('投稿の取得に失敗しました')
   ```

6. ✅ JSON をパース

   ```typescript
   const post = await postRes.json()
   ```

7. ✅ 2 つ目の API を`await`で実行（1 つ目が完了してから）

   ```typescript
   const userRes = await fetch('https://jsonplaceholder.typicode.com/users/1')
   ```

8. ✅ エラーチェック

   ```typescript
   if (!userRes.ok) throw new Error('ユーザーの取得に失敗しました')
   ```

9. ✅ JSON をパース

   ```typescript
   const user = await userRes.json()
   ```

10. ✅ 経過時間を計算

    ```typescript
    const duration = Date.now() - startTime
    ```

11. ✅ データを保存

    ```typescript
    sequentialData.value = {
    	post,
    	user,
    	duration,
    }
    ```

12. ✅ エラーハンドリング

    - `catch`ブロックでエラーをキャッチ
    - `finally`ブロックでローディングを終了

#### `<template>`部分の実装

13. ✅ UCard コンポーネントでセクション 4 のカードを作成

    ```vue
    <UCard class="mb-6 bg-neutral-950">
      <template #header>
        <h2 class="text-xl font-semibold text-neutral-100">
          4. 順次処理（await の連続）
        </h2>
      </template>
      <div class="space-y-4">
    ```

14. ✅ UButton コンポーネントを追加

    ```vue
    <UButton
    	@click="fetchSequentially"
    	:loading="sequentialLoading"
    	color="primary"
    >
      データを順次取得
    </UButton>
    ```

15. ✅ エラー表示部分を追加

    ```vue
    <div v-if="sequentialError" class="text-red-400 p-3 bg-red-950/20 rounded">
      エラー: {{ sequentialError }}
    </div>
    ```

16. ✅ データ表示部分を追加（ステップ 1: 投稿データ）

    ```vue
    <div v-if="sequentialData && !sequentialLoading" class="space-y-3">
      <div class="p-4 bg-neutral-900 rounded-lg">
        <p class="text-neutral-200 font-medium mb-2">
          ステップ1: 投稿 #1
        </p>
        <p class="text-neutral-400 text-sm">
          {{ sequentialData.post?.title }}
        </p>
      </div>
    ```

    - 「ステップ 1」というラベルで順次処理であることを明示

17. ✅ ステップ 2: ユーザーデータの表示を追加

    ```vue
    <div class="p-4 bg-neutral-900 rounded-lg">
      <p class="text-neutral-200 font-medium mb-2">
        ステップ2: ユーザー #1
      </p>
      <p class="text-neutral-400 text-sm">
        {{ sequentialData.user?.name }}
      </p>
    </div>
    ```

18. ✅ 処理時間の表示を追加

    ```vue
    <p class="text-neutral-300 text-sm mt-2">
      合計時間: {{ sequentialData.duration }}ms
    </p>
    ```

    - 並列処理と比較して、時間がかかることが確認できる

### 🧪 確認ポイント

- [ ] API が順番に呼ばれるか？（Network タブで確認。1 つ目のリクエストが完了してから 2 つ目が開始される）
- [ ] セクション 3（並列処理）より時間がかかるか？
- [ ] 処理時間の差を確認できるか？

---

## ✅ セクション 5: エラーハンドリング（詳細版）

### 🎯 学習目標

- HTTP ステータスコードに応じた適切なエラー処理を学ぶ
- ネットワークエラーと HTTP エラーの違いを理解する
- ユーザーに分かりやすいエラーメッセージを表示する方法を学ぶ

### 📖 なぜ重要なのか

エラーには様々な種類があります：

1. **404 Not Found**：リソースが見つからない
2. **500 Internal Server Error**：サーバー側のエラー
3. **ネットワークエラー**：インターネット接続の問題
4. **タイムアウト**：リクエストが時間内に完了しない

それぞれに適切な対応が必要です。

### 💻 完全な実装コード（一行一行の解説付き）

#### `<script setup>`部分の実装

```typescript
// ============================================================
// セクション5: エラーハンドリング（詳細版）
// ============================================================

// 【ステップ1】状態管理用の ref を定義
// ============================================================

// errorHandlingLoading: ローディング中かどうかを表す ref
const errorHandlingLoading = ref(false)

// errorHandlingResult: エラーハンドリングの結果を保存する ref
// 成功・失敗の情報、メッセージ、ステータスコードなどを保存します
const errorHandlingResult = ref<any>(null)

// 【ステップ2】非同期関数を定義
// ============================================================

const fetchWithDetailedErrorHandling = async () => {
	// 【ステップ3】状態をリセット
	// ============================================================

	errorHandlingResult.value = null
	errorHandlingLoading.value = true

	// 【ステップ4】try/catch/finally でエラーハンドリング
	// ============================================================

	try {
		// 【ステップ5】fetch API で API を呼び出す
		// ============================================================

		// 存在しない ID（99999）を指定して、意図的に 404 エラーを発生させます
		// 実際のアプリケーションでは、存在しない ID を指定するのではなく、
		// ユーザーが入力した ID や、データベースから取得した ID を使います
		const response = await fetch(
			'https://jsonplaceholder.typicode.com/posts/99999'
		)

		// 【ステップ6】HTTP ステータスコードに応じた処理
		// ============================================================

		// response.status の意味：
		// - HTTP ステータスコードを取得します
		// - 例: 200（成功）、404（Not Found）、500（Internal Server Error）

		// === は厳密等価演算子で、値と型の両方が一致する場合に true になります

		// if (response.status === 404) { ... }
		// - ステータスコードが 404 の場合、このブロックが実行されます
		// - 404 は「リソースが見つからない」という意味です
		if (response.status === 404) {
			// errorHandlingResult.value にエラー情報を保存します
			errorHandlingResult.value = {
				success: false, // 失敗を表すフラグ
				message: 'リソースが見つかりませんでした（404）', // ユーザーに表示するメッセージ
				status: 404, // HTTP ステータスコード
			}
			// return で関数を終了します
			// これにより、以下のコードは実行されません
			return
		}

		// >= は「以上」を表す比較演算子です

		// if (response.status >= 500) { ... }
		// - ステータスコードが 500 以上（500, 501, 502, ...）の場合、このブロックが実行されます
		// - 500 番台は「サーバー側のエラー」という意味です
		if (response.status >= 500) {
			errorHandlingResult.value = {
				success: false,
				message: 'サーバーエラーが発生しました（500番台）',
				status: response.status, // 実際のステータスコードを保存
			}
			return
		}

		// response.ok の意味：
		// - HTTP ステータスコードが 200-299 の範囲の場合、true になります
		// - 404 や 500 などのエラーは false になります

		// !response.ok の意味：
		// - response.ok が false の場合、つまりエラーが発生した場合

		// if (!response.ok) { ... }
		// - 404 や 500 以外のエラー（例: 400 Bad Request, 401 Unauthorized）の場合、
		//   このブロックが実行されます
		if (!response.ok) {
			errorHandlingResult.value = {
				success: false,
				message: `HTTP エラー: ${response.status}`, // テンプレートリテラルでステータスコードを含める
				status: response.status,
			}
			return
		}

		// 【ステップ7】成功時の処理
		// ============================================================

		// ここまで来たということは、エラーがなかったということです
		// つまり、response.ok が true で、ステータスコードが 200-299 の範囲です

		// JSON をパース
		const data = await response.json()

		// 成功情報を保存
		errorHandlingResult.value = {
			success: true, // 成功を表すフラグ
			message: 'データの取得に成功しました',
			data, // 取得したデータも一緒に保存
		}
	} catch (error) {
		// 【ステップ8】ネットワークエラーなどの例外をキャッチ
		// ============================================================

		// catch ブロックは、以下の場合に実行されます：
		// 1. fetch が失敗した場合（ネットワークエラーなど）
		// 2. response.json() が失敗した場合（JSON のパースエラーなど）
		// 3. throw でエラーを投げた場合（ただし、このコードでは throw を使っていません）

		// error instanceof TypeError の意味：
		// - error が TypeError のインスタンスかどうかをチェックします
		// - ネットワークエラーの場合、TypeError が発生します

		// error.message.includes('fetch') の意味：
		// - error.message に 'fetch' という文字列が含まれているかチェックします
		// - ネットワークエラーの場合、メッセージに 'fetch' が含まれることが多いです

		// if (error instanceof TypeError && error.message.includes('fetch')) { ... }
		// - ネットワークエラーの場合、このブロックが実行されます
		if (error instanceof TypeError && error.message.includes('fetch')) {
			errorHandlingResult.value = {
				success: false,
				message: 'ネットワークエラー: インターネット接続を確認してください',
				status: 'NETWORK_ERROR', // ネットワークエラーを表す文字列
			}
		} else {
			// その他のエラーの場合、このブロックが実行されます
			errorHandlingResult.value = {
				success: false,
				message: error instanceof Error ? error.message : '不明なエラー',
				status: 'UNKNOWN_ERROR', // 不明なエラーを表す文字列
			}
		}
	} finally {
		// 【ステップ9】ローディングを終了
		// ============================================================

		// 成功・失敗に関わらず、ローディングを終了します
		errorHandlingLoading.value = false
	}
}
```

**一行一行の詳細解説（重要なポイント）**：

1. **HTTP ステータスコードの種類**

   - **200-299**：成功（`response.ok`が`true`）
   - **400-499**：クライアントエラー（例: 404 Not Found）
   - **500-599**：サーバーエラー（例: 500 Internal Server Error）

2. **エラーの種類と対応**

   - **404**：リソースが見つからない → ユーザーに「見つかりませんでした」と表示
   - **500 番台**：サーバーエラー → ユーザーに「サーバーエラーが発生しました」と表示
   - **ネットワークエラー**：接続の問題 → ユーザーに「インターネット接続を確認してください」と表示

3. **エラー結果の構造化**

   - `success`：成功/失敗を判別するフラグ
   - `message`：ユーザーに表示するメッセージ
   - `status`：エラーの種類（HTTP ステータスコードまたは文字列）

4. **`return`の使い方**
   - `return`で関数を終了します
   - エラーが発生した場合、それ以降のコードを実行しないようにします

#### `<template>`部分の実装

```vue
<!-- セクション5: エラーハンドリングの詳細 -->
<UCard class="mb-6 bg-neutral-950">
	<template #header>
		<h2 class="text-xl font-semibold text-neutral-100">
			5. エラーハンドリング（詳細版）
		</h2>
	</template>
	<div class="space-y-4">
		<!-- 
			UButton: エラーハンドリングをテストするボタン
			@click="fetchWithDetailedErrorHandling" でクリック時に関数を実行
			:loading="errorHandlingLoading" でローディング状態を表示
		-->
		<UButton
			@click="fetchWithDetailedErrorHandling"
			:loading="errorHandlingLoading"
			color="primary"
		>
			エラーハンドリングをテスト
		</UButton>

		<!-- 
			結果表示
			v-if="errorHandlingResult" で、結果が存在する時だけ表示
		-->
		<div v-if="errorHandlingResult" class="space-y-2">
			<!-- 
				成功時の表示
				v-if="errorHandlingResult.success" で、success が true の時だけ表示
				bg-green-950/20: 緑系の半透明背景（成功を表す）
				border border-green-800: 緑色のボーダー
			-->
			<div
				v-if="errorHandlingResult.success"
				class="p-4 bg-green-950/20 rounded-lg border border-green-800"
			>
				<p class="text-green-400 font-medium">✓ 成功</p>
				<p class="text-neutral-300 text-sm mt-1">
					{{ errorHandlingResult.message }}
				</p>
			</div>

			<!-- 
				エラー時の表示
				v-else で、success が false の時（エラー時）に表示
				bg-red-950/20: 赤系の半透明背景（エラーを表す）
				border border-red-800: 赤色のボーダー
			-->
			<div
				v-else
				class="p-4 bg-red-950/20 rounded-lg border border-red-800"
			>
				<p class="text-red-400 font-medium">✗ エラー</p>
				<p class="text-neutral-300 text-sm mt-1">
					{{ errorHandlingResult.message }}
				</p>
				<p class="text-neutral-400 text-xs mt-1">
					ステータス: {{ errorHandlingResult.status }}
				</p>
			</div>
		</div>
	</div>
</UCard>
```

**一行一行の詳細解説**：

1. **`<UButton>`コンポーネント**

   - `@click="fetchWithDetailedErrorHandling"`: クリック時にエラーハンドリングをテスト
   - `:loading="errorHandlingLoading"`: ローディング状態を表示

2. **結果表示部分**

   - `v-if="errorHandlingResult"`: 結果が存在する時だけ表示
   - `space-y-2`: 子要素の縦方向の間隔を設定

3. **成功時の表示**

   - `v-if="errorHandlingResult.success"`: success が true の時だけ表示
   - `bg-green-950/20`: 緑系の半透明背景（成功を表す）
   - `border border-green-800`: 緑色のボーダー
   - `text-green-400`: 緑色のテキスト

4. **エラー時の表示**

   - `v-else`: success が false の時（エラー時）に表示
   - `bg-red-950/20`: 赤系の半透明背景（エラーを表す）
   - `border border-red-800`: 赤色のボーダー
   - `text-red-400`: 赤色のテキスト

5. **ステータスコードの表示**

   - `{{ errorHandlingResult.status }}`: HTTP ステータスコードまたはエラー種別を表示
   - `text-xs`: テキストサイズをさらに小さく設定

6. **`v-if`と`v-else`の使い方**
   - `v-if`と`v-else`は条件分岐のディレクティブ
   - `v-if`が false の場合、`v-else`が表示される
   - 成功時とエラー時で異なるスタイルを適用できる

### 📝 実装手順（チェックリスト）

#### `<script setup>`部分の実装

1. ✅ 状態管理用の`ref`を定義

   - `errorHandlingLoading`
   - `errorHandlingResult`

2. ✅ `async`関数を定義

   - `fetchWithDetailedErrorHandling`関数の中身を実装

3. ✅ `try`ブロック内で`fetch`を実行

   ```typescript
   const response = await fetch(
   	'https://jsonplaceholder.typicode.com/posts/99999'
   )
   ```

4. ✅ 404 エラーのチェックと処理

   ```typescript
   if (response.status === 404) {
   	errorHandlingResult.value = {
   		success: false,
   		message: 'リソースが見つかりませんでした（404）',
   		status: 404,
   	}
   	return
   }
   ```

5. ✅ 500 番台エラーのチェックと処理

   ```typescript
   if (response.status >= 500) {
   	errorHandlingResult.value = {
   		success: false,
   		message: 'サーバーエラーが発生しました（500番台）',
   		status: response.status,
   	}
   	return
   }
   ```

6. ✅ その他の HTTP エラーのチェックと処理

   ```typescript
   if (!response.ok) {
   	errorHandlingResult.value = {
   		success: false,
   		message: `HTTP エラー: ${response.status}`,
   		status: response.status,
   	}
   	return
   }
   ```

7. ✅ 成功時の処理（JSON パースと結果保存）

   ```typescript
   const data = await response.json()
   errorHandlingResult.value = {
   	success: true,
   	message: 'データの取得に成功しました',
   	data,
   }
   ```

8. ✅ `catch`ブロックでネットワークエラーを検出

   ```typescript
   if (error instanceof TypeError && error.message.includes('fetch')) {
   	errorHandlingResult.value = {
   		success: false,
   		message: 'ネットワークエラー: インターネット接続を確認してください',
   		status: 'NETWORK_ERROR',
   	}
   }
   ```

9. ✅ その他のエラーを処理

   ```typescript
   else {
     errorHandlingResult.value = {
       success: false,
       message: error instanceof Error ? error.message : '不明なエラー',
       status: 'UNKNOWN_ERROR',
     }
   }
   ```

10. ✅ `finally`ブロックでローディングを終了

    ```typescript
    finally {
      errorHandlingLoading.value = false
    }
    ```

#### `<template>`部分の実装

11. ✅ UCard コンポーネントでセクション 5 のカードを作成

    ```vue
    <UCard class="mb-6 bg-neutral-950">
      <template #header>
        <h2 class="text-xl font-semibold text-neutral-100">
          5. エラーハンドリング（詳細版）
        </h2>
      </template>
      <div class="space-y-4">
    ```

12. ✅ UButton コンポーネントを追加

    ```vue
    <UButton
    	@click="fetchWithDetailedErrorHandling"
    	:loading="errorHandlingLoading"
    	color="primary"
    >
      エラーハンドリングをテスト
    </UButton>
    ```

13. ✅ 結果表示部分を追加

    ```vue
    <div v-if="errorHandlingResult" class="space-y-2">
    ```

14. ✅ 成功時の表示を追加

    ```vue
    <div
    	v-if="errorHandlingResult.success"
    	class="p-4 bg-green-950/20 rounded-lg border border-green-800"
    >
      <p class="text-green-400 font-medium">✓ 成功</p>
      <p class="text-neutral-300 text-sm mt-1">
        {{ errorHandlingResult.message }}
      </p>
    </div>
    ```

    - `bg-green-950/20`: 緑系の半透明背景（成功を表す）
    - `border border-green-800`: 緑色のボーダー

15. ✅ エラー時の表示を追加

    ```vue
    <div v-else class="p-4 bg-red-950/20 rounded-lg border border-red-800">
      <p class="text-red-400 font-medium">✗ エラー</p>
      <p class="text-neutral-300 text-sm mt-1">
        {{ errorHandlingResult.message }}
      </p>
      <p class="text-neutral-400 text-xs mt-1">
        ステータス: {{ errorHandlingResult.status }}
      </p>
    </div>
    ```

    - `v-else`: success が false の時（エラー時）に表示
    - `bg-red-950/20`: 赤系の半透明背景（エラーを表す）
    - `border border-red-800`: 赤色のボーダー
    - ステータスコードも表示

### 🧪 確認ポイント

- [ ] 404 エラーが適切に表示されるか？
- [ ] ネットワークをオフにしてネットワークエラーが表示されるか？（Chrome の開発者ツールで Network を Offline に設定）
- [ ] 成功時のメッセージが表示されるか？（存在する ID を指定して確認）
- [ ] エラーの種類に応じて適切なメッセージが表示されるか？

---

## 🎓 まとめ

### 学んだこと

1. **useFetch**：Nuxt の便利な composable、自動でローディング・エラー管理
2. **async/await**：非同期処理を同期的に書ける構文
3. **try/catch/finally**：エラーハンドリングの基本構造
4. **Promise.all**：複数の非同期処理を並列実行
5. **順次処理**：前の処理が完了してから次の処理を実行
6. **エラーハンドリング**：HTTP ステータスコードやネットワークエラーの適切な処理

### 重要な概念のまとめ

#### 1. 非同期処理とは

- 時間がかかる処理（API 呼び出しなど）を、他の処理をブロックせずに実行すること
- JavaScript はシングルスレッドなので、非同期処理を使わないと UI がフリーズします

#### 2. Promise とは

- 非同期処理の結果を表すオブジェクト
- `fetch`や`response.json()`は Promise を返します

#### 3. async/await とは

- Promise を扱いやすくする構文
- `async`関数内で`await`を使うと、Promise が完了するまで待てます

#### 4. ref とは

- Vue 3 のリアクティブな変数
- `.value`で値を取得・設定します
- テンプレート内では`.value`を付けなくてもアクセスできます

#### 5. 並列処理と順次処理

- **並列処理**：`Promise.all([...])`で複数の処理を同時に実行
- **順次処理**：`await`を連続で使って、順番に実行

### 次のステップ

各セクションを 1 つずつ実装して、動作を確認しながら進めましょう！
質問があればいつでも聞いてください。

### よくある質問（FAQ）

**Q: `ref`と`reactive`の違いは？**
A: `ref`はプリミティブ値（文字列、数値、真偽値）やオブジェクトを扱えます。`reactive`はオブジェクト専用です。通常は`ref`を使うことが多いです。

**Q: `await`を付けないとどうなる？**
A: Promise オブジェクトが返ってきます。データを取得するには、`.then()`を使うか、`await`を付ける必要があります。

**Q: `Promise.all`で 1 つでもエラーが発生すると？**
A: 全体がエラーになり、`catch`ブロックでキャッチされます。

**Q: 並列処理と順次処理、どちらを使うべき？**
A: 前の処理の結果を使う場合は順次処理、独立した処理の場合は並列処理を使います。
