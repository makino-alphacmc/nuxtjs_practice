<!-- components/async-await/p1/PostList.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-neutral-100">
					1. 投稿データ一覧（useFetch）
				</h2>
				<div v-if="posts && !postsPending" class="text-sm text-neutral-400">
					全{{ posts?.length || 0 }}件
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
							v-for="post in (posts || []).slice(0, 10)"
							:key="post.id"
							class="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
						>
							<td class="px-4 py-3 text-sm text-neutral-300 font-mono">
								{{ post.id }}
							</td>
							<td class="px-4 py-3 text-sm text-neutral-200 font-medium">
								{{ post.title }}
							</td>
							<td class="px-4 py-3 text-sm text-neutral-400 max-w-md truncate">
								{{ post.body }}
							</td>
							<td class="px-4 py-3 text-sm text-neutral-300">
								{{ post.userId }}
							</td>
						</tr>
					</tbody>
				</table>
				<div class="mt-4 text-sm text-neutral-400 text-center">
					表示中: 1-10件 / 全{{ posts?.length || 0 }}件
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
// 型定義を明示的にインポート
import type { Post } from '~/types/async-await/p1/api'

interface Props {
	posts: Post[] | null
	postsPending: boolean
	postsError: Error | null
}

defineProps<Props>()
</script>
