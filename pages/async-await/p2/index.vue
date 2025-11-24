<template>
	<div class="min-h-screen bg-neutral-900 p-8">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-3xl font-bold text-neutral-100 mb-8">非同期処理の練習</h1>
			<!--------------------------------------------------
      セクション1: 基本的なAPI通信（useFetch）
      --------------------------------------------------->
			<UCard>
				<template #header>
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-semibold text-neutral-100">
							1.投稿データ一覧_useFetch
						</h2>
						<div v-if="posts && !postsPending" class="text-sm text-neutral-400">
							全{{ posts.length }}
						</div>
					</div>
				</template>

				<!-- ローディング中 -->
				<div class="space-y-4">
					<div v-if="postsPending" class="text-center py-8 text-neutral-400">
						<div
							class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
						></div>
						<p class="mt-2">データを読み込み中...</p>
					</div>

					<!-- エラー表示 -->
					<div
						v-if="postsError"
						class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
					>
						<p class="text-red-400 font-medium">エラーが発生しました</p>
						<p class="text-red-300 text-sm mt-1">{{ postsError.message }}</p>
					</div>

					<!-- テーブル表示 -->
					<div>
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
										本文
									</th>
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										ユーザID
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
							表示中：1-10件 / 全{{ posts.length }}件
						</div>
					</div>
				</div>
			</UCard>

			<!--------------------------------------------------
      セクション2: 手動での非同期処理（async/await）
      --------------------------------------------------->
			<UCard>
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

				<div class="space-y-4">
					<div v-if="manualLoading" class="text-center py-8 text-neutral-400">
						<div
							class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
						></div>
						<p class="mt-2">ユーザー情報を読み込み中...</p>
					</div>

					<div
						v-if="manualError"
						class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
					>
						<p class="text-red-400 font-medium">エラーが発生しました</p>
						<p class="text-red-300 text-sm mt-1">{{ manualError }}</p>
						<UButton
							size="sm"
							color="red"
							class="mt-3"
							@click="fetchUserManually"
							>再試行する</UButton
						>
					</div>

					<div v-if="manualUser && !manualLoading" class="overflow-x-auto">
						<table class="w-full border-collapse bg-neutral-900 rounded-lg">
							<thead>
								<tr class="bg-neutral-800 border-b border-neutral-700">
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
										名前
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200">
										{{ manualUser.name }}
									</td>
								</tr>
								<tr class="border-b border-neutral-800">
									<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
										メール
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200">
										{{ manualUser.email }}
									</td>
								</tr>
								<tr class="border-b border-neutral-800">
									<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
										住所
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200">
										{{ manualUser.address?.city }} /
										{{ manualUser.address?.street }}
									</td>
								</tr>
								<tr>
									<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
										会社
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200">
										{{ manualUser.company?.name }}
									</td>
								</tr>
							</tbody>
						</table>
						<p class="mt-4 text-sm text-neutral-400 text-center">
							JSONPlaceholder のユーザー ID: {{ manualUser.id }}
						</p>
					</div>
				</div>
			</UCard>

			<!-- セクション3: Promise.all（並列処理） -->
			<!-- セクション4: 順次処理（await の連続） -->
			<!-- セクション5: エラーハンドリングの詳細 -->
		</div>
	</div>
</template>

<script setup lang="ts">
// セクション1: 基本的なAPI通信（useFetch）
const {
	data: posts,
	pending: postsPending,
	error: postsError,
} = useFetch('https://jsonplaceholder.typicode.com/posts')

// セクション2: 手動での非同期処理（async/await）
const manualLoading = ref(false)
const manualUser = ref<any>(null)
const manualError = ref<string | null>(null)

const fetchUserManually = async () => {
	manualUser.value = null
	manualError.value = null
	manualLoading.value = true

	try {
		const response = await fetch('https://jsonplaceholder.typicode.com/users/1')
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const data = await response.json()
		manualUser.value = data
	} catch (error) {
		manualError.value = error instanceof Error ? error.message : '不明なエラー'
		console.error('エラー：', error)
	} finally {
		manualLoading.value = false
	}
}

// セクション3: Promise.all（並列処理）
// セクション4: 順次処理（await の連続）
// セクション5: エラーハンドリングの詳細
</script>

<style></style>
