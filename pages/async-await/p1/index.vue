<template>
	<div class="min-h-screen bg-neutral-900 p-8">
		<div class="max-w-7xl mx-auto">
			<h1 class="text-3xl font-bold text-neutral-100 mb-8">
				非同期処理の練習 - 業務システム風UI
			</h1>

			<!-- セクション1: 基本的なAPI通信（useFetch） -->
			<UCard class="mb-6 bg-neutral-950">
				<template #header>
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-semibold text-neutral-100">
							1. 投稿データ一覧（useFetch）
						</h2>
						<div v-if="posts && !postsPending" class="text-sm text-neutral-400">
							全{{ posts.length }}件
						</div>
					</div>
				</template>
				<div class="space-y-4">
					<!-- ローディング状態 -->
					<div v-if="postsPending" class="text-center py-8 text-neutral-400">
						<div
							class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
						></div>
						<p class="mt-2">データを読み込み中...</p>
					</div>

					<!-- エラー状態 -->
					<div
						v-if="postsError"
						class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
					>
						<p class="text-red-400 font-medium">エラーが発生しました</p>
						<p class="text-red-300 text-sm mt-1">{{ postsError.message }}</p>
					</div>

					<!-- データテーブル表示 -->
					<div v-if="posts && !postsPending" class="overflow-x-auto">
						<table class="w-full border-collapse">
							<thead>
								<tr class="bg-neutral-800 border-b border-neutral-700">
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										ID
									</th>
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										タイトル
									</th>
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										本文（抜粋）
									</th>
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										ユーザーID
									</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="post in posts.slice(0, 10)"
									:key="post.id"
									class="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
								>
									<td class="px-4 py-3 text-sm text-neutral-300 font-mono">
										{{ post.id }}
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200 font-medium">
										{{ post.title }}
									</td>
									<td
										class="px-4 py-3 text-sm text-neutral-400 max-w-md truncate"
									>
										{{ post.body }}
									</td>
									<td class="px-4 py-3 text-sm text-neutral-300">
										{{ post.userId }}
									</td>
								</tr>
							</tbody>
						</table>
						<div class="mt-4 text-sm text-neutral-400 text-center">
							表示中: 1-10件 / 全{{ posts.length }}件
						</div>
					</div>
				</div>
			</UCard>

			<!-- セクション2: 手動での非同期処理（async/await） -->
			<UCard class="mb-6 bg-neutral-950">
				<template #header>
					<h2 class="text-xl font-semibold text-neutral-100">
						2. ユーザー情報管理（async/await + try/catch）
					</h2>
				</template>
				<div class="space-y-4">
					<div class="flex gap-2">
						<UButton
							@click="fetchUserManually"
							:loading="manualLoading"
							color="primary"
						>
							<template v-if="!manualLoading">ユーザー情報を取得</template>
							<template v-else>取得中...</template>
						</UButton>
						<UButton
							v-if="manualUser"
							@click="manualUser = null"
							color="gray"
							variant="outline"
						>
							クリア
						</UButton>
					</div>

					<div
						v-if="manualError"
						class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
					>
						<p class="text-red-400 font-medium">エラーが発生しました</p>
						<p class="text-red-300 text-sm mt-1">{{ manualError }}</p>
					</div>

					<!-- ユーザー情報テーブル -->
					<div v-if="manualUser && !manualLoading" class="overflow-x-auto">
						<table class="w-full border-collapse bg-neutral-900 rounded-lg">
							<thead>
								<tr class="bg-neutral-800">
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										項目
									</th>
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										値
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-b border-neutral-800">
									<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
										ID
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200 font-mono">
										{{ manualUser.id }}
									</td>
								</tr>
								<tr class="border-b border-neutral-800">
									<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
										名前
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200">
										{{ manualUser.name }}
									</td>
								</tr>
								<tr class="border-b border-neutral-800">
									<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
										ユーザー名
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200">
										{{ manualUser.username }}
									</td>
								</tr>
								<tr class="border-b border-neutral-800">
									<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
										メールアドレス
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200">
										{{ manualUser.email }}
									</td>
								</tr>
								<tr class="border-b border-neutral-800">
									<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
										電話番号
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200">
										{{ manualUser.phone }}
									</td>
								</tr>
								<tr class="border-b border-neutral-800">
									<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
										ウェブサイト
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200">
										{{ manualUser.website }}
									</td>
								</tr>
								<tr>
									<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
										住所
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200">
										{{ manualUser.address?.street }},
										{{ manualUser.address?.city }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</UCard>

			<!-- セクション3: Promise.all（並列処理） -->
			<UCard class="mb-6 bg-neutral-950">
				<template #header>
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-semibold text-neutral-100">
							3. マルチデータ取得（Promise.all - 並列処理）
						</h2>
						<div
							v-if="parallelData && !parallelLoading"
							class="text-sm text-neutral-400"
						>
							処理時間: {{ parallelData.duration }}ms
						</div>
					</div>
				</template>
				<div class="space-y-4">
					<UButton
						@click="fetchMultipleData"
						:loading="parallelLoading"
						color="primary"
					>
						<template v-if="!parallelLoading">複数データを並列取得</template>
						<template v-else>並列取得中...</template>
					</UButton>

					<div
						v-if="parallelError"
						class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
					>
						<p class="text-red-400 font-medium">エラーが発生しました</p>
						<p class="text-red-300 text-sm mt-1">{{ parallelError }}</p>
					</div>

					<!-- データグリッド表示 -->
					<div
						v-if="parallelData && !parallelLoading"
						class="grid grid-cols-1 md:grid-cols-3 gap-4"
					>
						<div
							class="bg-neutral-900 rounded-lg border border-neutral-800 p-4"
						>
							<div class="flex items-center justify-between mb-3">
								<h3 class="text-sm font-semibold text-neutral-300">
									投稿データ
								</h3>
								<span
									class="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded"
									>ID: {{ parallelData.post?.id }}</span
								>
							</div>
							<p class="text-neutral-200 font-medium text-sm mb-2">
								{{ parallelData.post?.title }}
							</p>
							<p class="text-neutral-400 text-xs line-clamp-2">
								{{ parallelData.post?.body }}
							</p>
						</div>

						<div
							class="bg-neutral-900 rounded-lg border border-neutral-800 p-4"
						>
							<div class="flex items-center justify-between mb-3">
								<h3 class="text-sm font-semibold text-neutral-300">
									ユーザーデータ
								</h3>
								<span
									class="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded"
									>ID: {{ parallelData.user?.id }}</span
								>
							</div>
							<p class="text-neutral-200 font-medium text-sm mb-2">
								{{ parallelData.user?.name }}
							</p>
							<p class="text-neutral-400 text-xs">
								{{ parallelData.user?.email }}
							</p>
						</div>

						<div
							class="bg-neutral-900 rounded-lg border border-neutral-800 p-4"
						>
							<div class="flex items-center justify-between mb-3">
								<h3 class="text-sm font-semibold text-neutral-300">
									コメントデータ
								</h3>
								<span
									class="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded"
									>ID: {{ parallelData.comment?.id }}</span
								>
							</div>
							<p class="text-neutral-200 font-medium text-sm mb-2">
								{{ parallelData.comment?.name }}
							</p>
							<p class="text-neutral-400 text-xs line-clamp-2">
								{{ parallelData.comment?.body }}
							</p>
						</div>
					</div>
				</div>
			</UCard>

			<!-- セクション4: 順次処理（await の連続） -->
			<UCard class="mb-6 bg-neutral-950">
				<template #header>
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-semibold text-neutral-100">
							4. 順次データ取得（await の連続）
						</h2>
						<div
							v-if="sequentialData && !sequentialLoading"
							class="text-sm text-neutral-400"
						>
							処理時間: {{ sequentialData.duration }}ms
						</div>
					</div>
				</template>
				<div class="space-y-4">
					<UButton
						@click="fetchSequentially"
						:loading="sequentialLoading"
						color="primary"
					>
						<template v-if="!sequentialLoading">データを順次取得</template>
						<template v-else>順次取得中...</template>
					</UButton>

					<div
						v-if="sequentialError"
						class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
					>
						<p class="text-red-400 font-medium">エラーが発生しました</p>
						<p class="text-red-300 text-sm mt-1">{{ sequentialError }}</p>
					</div>

					<!-- 処理フロー表示 -->
					<div v-if="sequentialData && !sequentialLoading" class="space-y-3">
						<div class="relative">
							<!-- ステップ1 -->
							<div class="flex items-start gap-4">
								<div
									class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm"
								>
									1
								</div>
								<div
									class="flex-1 bg-neutral-900 rounded-lg border border-neutral-800 p-4"
								>
									<div class="flex items-center justify-between mb-2">
										<p class="text-neutral-200 font-medium text-sm">
											投稿データ取得
										</p>
										<span class="text-xs text-neutral-500">完了</span>
									</div>
									<p class="text-neutral-400 text-sm">
										{{ sequentialData.post?.title }}
									</p>
								</div>
							</div>

							<!-- 矢印 -->
							<div class="ml-4 my-2">
								<div class="w-0.5 h-6 bg-neutral-700"></div>
							</div>

							<!-- ステップ2 -->
							<div class="flex items-start gap-4">
								<div
									class="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm"
								>
									2
								</div>
								<div
									class="flex-1 bg-neutral-900 rounded-lg border border-neutral-800 p-4"
								>
									<div class="flex items-center justify-between mb-2">
										<p class="text-neutral-200 font-medium text-sm">
											ユーザーデータ取得
										</p>
										<span class="text-xs text-neutral-500">完了</span>
									</div>
									<p class="text-neutral-400 text-sm">
										{{ sequentialData.user?.name }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</UCard>

			<!-- セクション5: エラーハンドリングの詳細 -->
			<UCard class="mb-6 bg-neutral-950">
				<template #header>
					<h2 class="text-xl font-semibold text-neutral-100">
						5. エラーハンドリング（詳細版）
					</h2>
				</template>
				<div class="space-y-4">
					<div
						class="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700"
					>
						<p class="text-sm text-neutral-300 mb-2">
							<span class="font-semibold">テスト内容:</span>
							存在しないリソース（ID:
							99999）にアクセスして、エラーハンドリングの動作を確認します。
						</p>
					</div>

					<UButton
						@click="fetchWithDetailedErrorHandling"
						:loading="errorHandlingLoading"
						color="primary"
					>
						<template v-if="!errorHandlingLoading"
							>エラーハンドリングをテスト</template
						>
						<template v-else>テスト実行中...</template>
					</UButton>

					<div v-if="errorHandlingResult" class="space-y-2">
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
								</table>
							</div>
						</div>
					</div>
				</div>
			</UCard>
		</div>
	</div>
</template>

<script setup lang="ts">
// Nuxt 3では useFetch と ref は自動インポートされます
// 型エラーが出る場合は、IDEの設定を確認してください

// ============================================================
// セクション1: useFetch を使った基本的なAPI通信
// ============================================================
// useFetch は Nuxt の便利な composable で、自動的にローディング状態と
// エラー状態を管理してくれます。
const {
	data: posts,
	pending: postsPending,
	error: postsError,
} = useFetch('https://jsonplaceholder.typicode.com/posts')

// ============================================================
// セクション2: 手動での非同期処理（async/await + try/catch）
// ============================================================
// 手動で fetch を使う場合のパターンです。
// ローディング状態とエラー状態を自分で管理する必要があります。
const manualLoading = ref(false)
const manualUser = ref<any>(null)
const manualError = ref<string | null>(null)

const fetchUserManually = async () => {
	// リセット
	manualUser.value = null
	manualError.value = null
	manualLoading.value = true

	try {
		// await で API のレスポンスを待つ
		const response = await fetch('https://jsonplaceholder.typicode.com/users/1')

		// HTTP エラーチェック（404, 500 など）
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		// JSON をパース
		const data = await response.json()
		manualUser.value = data
	} catch (error) {
		// エラーをキャッチして表示
		manualError.value = error instanceof Error ? error.message : '不明なエラー'
		console.error('エラー:', error)
	} finally {
		// 成功・失敗に関わらずローディングを終了
		manualLoading.value = false
	}
}

// ============================================================
// セクション3: Promise.all（並列処理）
// ============================================================
// 複数の API を同時に呼び出す場合のパターンです。
// すべての Promise が完了するまで待ちます。
const parallelLoading = ref(false)
const parallelData = ref<any>(null)
const parallelError = ref<string | null>(null)

const fetchMultipleData = async () => {
	parallelData.value = null
	parallelError.value = null
	parallelLoading.value = true

	const startTime = Date.now()

	try {
		// Promise.all で複数の API を並列実行
		const [postRes, userRes, commentRes] = await Promise.all([
			fetch('https://jsonplaceholder.typicode.com/posts/1'),
			fetch('https://jsonplaceholder.typicode.com/users/1'),
			fetch('https://jsonplaceholder.typicode.com/comments/1'),
		])

		// すべてのレスポンスをチェック
		if (!postRes.ok || !userRes.ok || !commentRes.ok) {
			throw new Error('一部のリクエストが失敗しました')
		}

		// すべての JSON をパース
		const [post, user, comment] = await Promise.all([
			postRes.json(),
			userRes.json(),
			commentRes.json(),
		])

		const duration = Date.now() - startTime

		parallelData.value = {
			post,
			user,
			comment,
			duration,
		}
	} catch (error) {
		parallelError.value =
			error instanceof Error ? error.message : '不明なエラー'
		console.error('並列処理エラー:', error)
	} finally {
		parallelLoading.value = false
	}
}

// ============================================================
// セクション4: 順次処理（await の連続）
// ============================================================
// 前の処理が完了してから次の処理を実行するパターンです。
// Promise.all と違い、順番に実行されるため時間がかかります。
const sequentialLoading = ref(false)
const sequentialData = ref<any>(null)
const sequentialError = ref<string | null>(null)

const fetchSequentially = async () => {
	sequentialData.value = null
	sequentialError.value = null
	sequentialLoading.value = true

	const startTime = Date.now()

	try {
		// 1つ目の API を実行して完了を待つ
		const postRes = await fetch('https://jsonplaceholder.typicode.com/posts/1')
		if (!postRes.ok) throw new Error('投稿の取得に失敗しました')
		const post = await postRes.json()

		// 2つ目の API を実行（1つ目が完了してから）
		const userRes = await fetch('https://jsonplaceholder.typicode.com/users/1')
		if (!userRes.ok) throw new Error('ユーザーの取得に失敗しました')
		const user = await userRes.json()

		const duration = Date.now() - startTime

		sequentialData.value = {
			post,
			user,
			duration,
		}
	} catch (error) {
		sequentialError.value =
			error instanceof Error ? error.message : '不明なエラー'
		console.error('順次処理エラー:', error)
	} finally {
		sequentialLoading.value = false
	}
}

// ============================================================
// セクション5: エラーハンドリング（詳細版）
// ============================================================
// より詳細なエラーハンドリングのパターンです。
// HTTP ステータスコードやエラーメッセージを適切に処理します。
const errorHandlingLoading = ref(false)
const errorHandlingResult = ref<any>(null)

const fetchWithDetailedErrorHandling = async () => {
	errorHandlingResult.value = null
	errorHandlingLoading.value = true

	try {
		// 存在しない ID を指定してエラーを発生させる
		const response = await fetch(
			'https://jsonplaceholder.typicode.com/posts/99999'
		)

		// HTTP ステータスコードに応じた処理
		if (response.status === 404) {
			errorHandlingResult.value = {
				success: false,
				message: 'リソースが見つかりませんでした（404）',
				status: 404,
			}
			return
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

		const data = await response.json()
		errorHandlingResult.value = {
			success: true,
			message: 'データの取得に成功しました',
			data,
		}
	} catch (error) {
		// ネットワークエラーなどの場合
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
	} finally {
		errorHandlingLoading.value = false
	}
}
</script>
