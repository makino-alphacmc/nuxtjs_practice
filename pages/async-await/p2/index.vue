<template>
	<div class="min-h-screen bg-neutral-900 p-8">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-3xl font-bold text-neutral-100 mb-8">非同期処理の練習</h1>
			<!-- セクション1: 基本的なAPI通信（useFetch） -->
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

			<!-- セクション2: 手動での非同期処理（async/await） -->
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
// セクション3: Promise.all（並列処理）
// セクション4: 順次処理（await の連続）
// セクション5: エラーハンドリングの詳細
</script>

<style></style>
