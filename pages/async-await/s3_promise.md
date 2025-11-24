# セクション 3: Promise.all で複数データを並列取得

## Promise.all とは、なぜ必要なのか？

### Promise.all とは

複数の Promise（非同期処理）をまとめて管理し、**すべての処理が終わるまで待ってから次のステップへ進む**ためのユーティリティ関数です。配列で渡した Promise がすべて resolve されると結果が配列で返り、どれかひとつでも reject すると即座に例外として扱えます。

### なぜ必要なのか？

1. **待ち時間を最小化できる** – 複数 API を同時に投げれば「一番遅い API の時間」しか待たなくて済む
2. **コードをシンプルに保てる** – `try/catch` を 1 箇所にまとめ、成功時・失敗時の処理を一本化
3. **エラー検知がラク** – どれかが失敗した時点で一括で `catch` に飛ばせるため、画面側で統一メッセージを出しやすい
4. **ダッシュボードや一覧画面で必須** – 多種類の情報を同時に表示する UI でレスポンスを安定させられる

### 主な特徴

- **配列順に結果が返る**: `[post, user, comment]` のようにリクエスト順で受け取れる
- **一部失敗で全体を中断**: ひとつでも reject すれば全体が失敗扱いになる（再取得 UI などを実装しやすい）
- **ネストした Promise もまとめられる**: `fetch` 後の `.json()` など、さらなる非同期処理も並列化できる
- **実行時間を測りやすい**: `Date.now()` と組み合わせれば並列効果を UI で見せられる

## 一般的な使用例

### 基本的な使い方

```typescript
const [posts, users] = await Promise.all([
	fetchPosts(), // Promise を返す関数
	fetchUsers(),
])
```

### よくある使用パターン

1. **ダッシュボードの初期表示**
   ```typescript
   const [stats, notifications, profile] = await Promise.all([
   	getStats(),
   	getNotifications(),
   	getProfile(),
   ])
   ```
2. **個別画面での詳細情報取得**
   ```typescript
   const [post, comments] = await Promise.all([
   	fetchPostDetail(id),
   	fetchComments(id),
   ])
   ```
3. **スケルトン削減のための先読み**
   ```typescript
   const [current, next] = await Promise.all([
   	fetchCurrentStep(),
   	fetchNextStepPreview(),
   ])
   ```

## 実装手順

### 1. Script 部分の実装

```typescript
// ============================================================
// セクション3: Promise.all で複数データを並列取得
// ============================================================
const parallelLoading = ref(false) // 並列取得の進行状況
const parallelData = ref<any>(null) // 投稿・ユーザー・コメントをまとめて保持
const parallelError = ref<string | null>(null) // 失敗時のメッセージ

const fetchMultipleData = async () => {
	parallelData.value = null // 古い結果を破棄
	parallelError.value = null // 直前のエラーをクリア
	parallelLoading.value = true // ここからローディング開始

	const startTime = Date.now() // 所要時間を測定するための開始時刻

	try {
		const [postRes, userRes, commentRes] = await Promise.all([
			fetch('https://jsonplaceholder.typicode.com/posts/1'),
			fetch('https://jsonplaceholder.typicode.com/users/1'),
			fetch('https://jsonplaceholder.typicode.com/comments/1'),
		]) // 3 本のリクエストを並列で投げる

		if (!postRes.ok || !userRes.ok || !commentRes.ok) {
			throw new Error('一部のリクエストが失敗しました') // HTTP ステータスを自前チェック
		}

		const [post, user, comment] = await Promise.all([
			postRes.json(),
			userRes.json(),
			commentRes.json(),
		]) // レスポンスの JSON 変換も並列化

		const duration = Date.now() - startTime // 全体の処理時間を計測

		parallelData.value = { post, user, comment, duration } // UI で扱いやすい形にまとめる
	} catch (error) {
		parallelError.value =
			error instanceof Error ? error.message : '不明なエラー'
		console.error('並列処理エラー:', error) // ログで詳細を追えるようにする
	} finally {
		parallelLoading.value = false // 成功・失敗どちらでもローディング終了
	}
}
```

**コードの説明：**

- `parallelLoading / parallelData / parallelError`: 並列処理専用の状態を分離して UI 連携を明確化
- `Promise.all([...fetch()])`: リクエストを同時送信し、配列でレスポンスを受け取る
- `if (!response.ok) throw ...`: Fetch は HTTP 400/500 でも reject しないため、ここで例外化して catch に流す
- `Promise.all([...res.json()])`: JSON 変換も並列化することで無駄な待ち時間をなくす
- `duration`: 実際の効果が目に見えるよう、かかった時間をミリ秒で計測・保存
- `catch`: 例外オブジェクトをユーザー向け文字列に変換し、同時に console へ詳細ログ
- `finally`: UI を必ず通常状態へ戻すための安全弁

### 2. Template 部分の実装

#### 2-1. ヘッダーと操作ボタン

```vue
<template #header>
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-neutral-100">
			3. 複数データを並列取得（Promise.all）
		</h2>
		<div
			v-if="parallelData?.duration && !parallelLoading"
			class="text-sm text-neutral-400"
		>
			処理時間: {{ parallelData.duration }}ms
		</div>
	</div>
</template>

<UButton
	@click="fetchMultipleData"
	:loading="parallelLoading"
	color="primary"
	class="mt-4"
>
	<template v-if="!parallelLoading">複数データを並列取得</template>
	<template v-else>並列取得中...</template>
</UButton>
```

**コードの説明：**

- `parallelData?.duration` を表示し、並列化の効果をリアルタイムで確認
- `UButton` はセクション 1・2 と同じローディング挙動で統一感を維持
- ボタンを押すと毎回 `fetchMultipleData` が最初から実行される

#### 2-2. ローディング状態

```vue
<div v-if="parallelLoading" class="text-center py-8 text-neutral-400">
	<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"></div>
	<p class="mt-2">複数のデータを読み込み中...</p>
</div>
```

**コードの説明：**

- 並列処理中のみスピナーを表示し、ユーザーに処理中であることを伝える
- 文言を「複数のデータ」と明示して、ボタンアクションと対応づけている

#### 2-3. エラー表示

```vue
<div
	v-if="parallelError"
	class="p-4 bg-red-950/20 border border-red-800 rounded-lg mt-4"
>
	<p class="text-red-400 font-medium">エラーが発生しました</p>
	<p class="text-red-300 text-sm mt-1">{{ parallelError }}</p>
	<UButton size="sm" color="red" class="mt-3" @click="fetchMultipleData">再試行する</UButton>
</div>
```

**コードの説明：**

- `parallelError` がセットされた場合のみ表示
- catch で整形したメッセージをそのまま提示し、原因をユーザーに共有
- 小さめのリトライボタンで再実行を促す

#### 2-4. 並列取得結果のカード表示

```vue
<div v-if="parallelData && !parallelLoading" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
	<div class="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
		<h3 class="text-sm font-semibold text-neutral-300">投稿データ</h3>
		<p class="text-neutral-200 font-medium text-sm mb-2">
			{{ parallelData.post?.title }}
		</p>
		<p class="text-neutral-400 text-xs line-clamp-3">
			{{ parallelData.post?.body }}
		</p>
	</div>
	<div class="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
		<h3 class="text-sm font-semibold text-neutral-300">ユーザー情報</h3>
		<p class="text-neutral-200 text-sm font-medium">
			{{ parallelData.user?.name }}
		</p>
		<p class="text-neutral-400 text-xs">
			{{ parallelData.user?.email }} / {{ parallelData.user?.address?.city }}
		</p>
	</div>
	<div class="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
		<h3 class="text-sm font-semibold text-neutral-300">コメント</h3>
		<p class="text-neutral-200 text-sm font-medium">
			{{ parallelData.comment?.name }}
		</p>
		<p class="text-neutral-400 text-xs line-clamp-2">
			{{ parallelData.comment?.body }}
		</p>
	</div>
</div>
```

**コードの説明：**

- `parallelData && !parallelLoading` で結果がそろっている状態に限定
- 各カードが `post / user / comment` を 1 対 1 で表示し、「同時に取得した」感覚を演出
- `line-clamp` や `font-medium` で読みやすさと情報量のバランスを調整

## まとめ

1. **Promise.all は「同時に投げてまとめて待つ」ための基本テクニック**で、体感速度が大きく向上する
2. **レスポンスごとに `.ok` を確認し、問題があれば自前で `throw`** することで統一的なエラーハンドリングが可能
3. **所要時間やカード表示など、UI で効果を見せる仕掛け**を入れると学習・デバッグがしやすい
4. このパターンを押さえておけば、API が増えても横展開しやすく、次章の順次処理との違いも明確に理解できる
