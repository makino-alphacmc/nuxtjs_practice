# セクション 1: useFetch を使った基本的な API 通信

## useFetch とは、なぜ必要なのか？

### useFetch とは

`useFetch`は、Nuxt 3 が提供する**composable 関数**の一つで、API からデータを取得する際に使用します。Vue 3 の Composition API と組み合わせて使用することで、非同期データの取得を簡単に実装できます。

### なぜ必要なのか？

通常、API からデータを取得する場合、以下のような処理を手動で実装する必要があります：

1. **ローディング状態の管理** - データ取得中かどうかを追跡
2. **エラー状態の管理** - エラーが発生した場合の処理
3. **データの状態管理** - 取得したデータを保持
4. **再取得機能** - 必要に応じてデータを再取得

これらを手動で実装すると、コードが複雑になり、同じような処理を何度も書くことになります。`useFetch`を使うことで、これらの処理を**自動的に管理**してくれるため、コードがシンプルになり、開発効率が向上します。

### 主な特徴

- **自動的なローディング状態管理**: `pending`プロパティで取得中かどうかを判定
- **自動的なエラー処理**: `error`プロパティでエラー情報を取得
- **リアクティブなデータ**: 取得したデータは自動的にリアクティブになる
- **SSR 対応**: サーバーサイドレンダリングでも動作
- **キャッシュ機能**: 同じリクエストは自動的にキャッシュされる

## 一般的な使用例

### 基本的な使い方

```typescript
const { data, pending, error } = useFetch('https://api.example.com/data')
```

### よくある使用パターン

1. **ページ読み込み時に自動取得**

   ```typescript
   // ページが表示されると自動的にデータを取得
   const { data: posts } = useFetch('/api/posts')
   ```

2. **条件付きで取得**

   ```typescript
   const { data: user } = useFetch('/api/user', {
   	query: { id: userId.value },
   })
   ```

3. **手動で再取得**
   ```typescript
   const { data, refresh } = useFetch('/api/data')
   // ボタンクリック時に再取得
   await refresh()
   ```

## 実装手順

### 1. Script 部分の実装

```typescript
// ============================================================
// セクション1: useFetch を使った基本的なAPI通信
// ============================================================
// useFetch は Nuxt の便利な composable で、自動的にローディング状態と
// エラー状態を管理してくれます。
const {
	data: posts, // 取得したデータを格納する変数（postsという名前で使用）
	pending: postsPending, // ローディング中かどうかを示すフラグ
	error: postsError, // エラー情報を格納する変数
} = useFetch('https://jsonplaceholder.typicode.com/posts') // APIのエンドポイントURL
```

**コードの説明：**

- `useFetch('https://jsonplaceholder.typicode.com/posts')`: JSONPlaceholder API から投稿データを取得
- `data: posts`: 取得したデータを`posts`という名前で使用できるようにエイリアスを設定
- `pending: postsPending`: データ取得中かどうかを示すフラグを`postsPending`という名前で使用
- `error: postsError`: エラーが発生した場合の情報を`postsError`に格納

### 2. Template 部分の実装

#### 2-1. ヘッダー部分

```vue
<template #header>
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-neutral-100">
			1. 投稿データ一覧（useFetch）
		</h2>
		<div v-if="posts && !postsPending" class="text-sm text-neutral-400">
			全{{ posts.length }}件
			<!-- データが取得できて、ローディング中でない場合に件数を表示 -->
		</div>
	</div>
</template>
```

**コードの説明：**

- `v-if="posts && !postsPending"`: データが存在し、かつローディング中でない場合のみ表示
- `posts.length`: 取得した投稿データの配列の長さ（件数）を表示

#### 2-2. ローディング状態の表示

```vue
<!-- ローディング状態 -->
<div v-if="postsPending" class="text-center py-8 text-neutral-400">
	<div
		class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
	></div>  <!-- スピナーアニメーション（回転する円） -->
	<p class="mt-2">データを読み込み中...</p>  <!-- ローディングメッセージ -->
</div>
```

**コードの説明：**

- `v-if="postsPending"`: ローディング中の場合のみ表示
- `animate-spin`: Tailwind CSS のアニメーションクラスで、要素を回転させる
- ユーザーにデータ取得中であることを視覚的に伝える

#### 2-3. エラー状態の表示

```vue
<!-- エラー状態 -->
<div v-if="postsError" <!-- エラーが発生した場合のみ表示 -->
	class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
>
	<p class="text-red-400 font-medium">エラーが発生しました</p>  <!-- エラーメッセージのタイトル -->
	<p class="text-red-300 text-sm mt-1">{{ postsError.message }}</p>  <!-- エラーの詳細メッセージ -->
</div>
```

**コードの説明：**

- `v-if="postsError"`: エラーが発生した場合のみ表示
- `postsError.message`: エラーオブジェクトの`message`プロパティを表示
- 赤色の背景とボーダーでエラーであることを視覚的に強調

#### 2-4. データテーブルの表示

```vue
<!-- データテーブル表示 -->
<div v-if="posts && !postsPending" class="overflow-x-auto">  <!-- データが存在し、ローディング中でない場合のみ表示 -->
	<table class="w-full border-collapse">
		<thead>
			<tr class="bg-neutral-800 border-b border-neutral-700">
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					ID  <!-- テーブルのヘッダー：ID列 -->
				</th>
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					タイトル  <!-- テーブルのヘッダー：タイトル列 -->
				</th>
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					本文（抜粋）  <!-- テーブルのヘッダー：本文列 -->
				</th>
				<th class="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
					ユーザーID  <!-- テーブルのヘッダー：ユーザーID列 -->
				</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="post in posts.slice(0, 10)"  <!-- 取得した投稿データの最初の10件をループ処理 -->
				:key="post.id"  <!-- Vueのkey属性：各要素を一意に識別するため -->
				class="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"  <!-- ホバー時の背景色変更 -->
			>
				<td class="px-4 py-3 text-sm text-neutral-300 font-mono">
					{{ post.id }}  <!-- 投稿IDを表示 -->
				</td>
				<td class="px-4 py-3 text-sm text-neutral-200 font-medium">
					{{ post.title }}  <!-- 投稿タイトルを表示 -->
				</td>
				<td class="px-4 py-3 text-sm text-neutral-400 max-w-md truncate">
					{{ post.body }}  <!-- 投稿本文を表示（長い場合は切り詰め） -->
				</td>
				<td class="px-4 py-3 text-sm text-neutral-300">
					{{ post.userId }}  <!-- ユーザーIDを表示 -->
				</td>
			</tr>
		</tbody>
	</table>
	<div class="mt-4 text-sm text-neutral-400 text-center">
		表示中: 1-10件 / 全{{ posts.length }}件  <!-- 表示件数と総件数を表示 -->
	</div>
</div>
```

**コードの説明：**

- `v-if="posts && !postsPending"`: データが存在し、ローディング中でない場合のみテーブルを表示
- `v-for="post in posts.slice(0, 10)"`: 取得した投稿データの最初の 10 件をループ処理
  - `slice(0, 10)`: 配列の最初の 10 要素を取得（ページネーションの簡易版）
- `:key="post.id"`: Vue の key 属性。各要素を一意に識別するために必要
- `{{ post.id }}`: 各投稿の ID を表示
- `{{ post.title }}`: 各投稿のタイトルを表示
- `{{ post.body }}`: 各投稿の本文を表示
- `{{ post.userId }}`: 各投稿のユーザー ID を表示
- `truncate`: Tailwind CSS のクラスで、長いテキストを省略記号（...）で表示

## まとめ

`useFetch`を使うことで、以下のメリットが得られます：

1. **コードがシンプル**: ローディング状態やエラー処理を自動的に管理
2. **開発効率の向上**: 同じような処理を何度も書く必要がない
3. **保守性の向上**: Nuxt が推奨する方法なので、将来的な変更にも対応しやすい
4. **SSR 対応**: サーバーサイドレンダリングでも自動的に動作

このセクションでは、`useFetch`の基本的な使い方を学びました。次のセクションでは、より細かい制御が必要な場合の手動実装方法を学びます。
