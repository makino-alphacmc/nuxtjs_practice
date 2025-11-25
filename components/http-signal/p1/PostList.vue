<!-- components/http-signal/p1/PostList.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-neutral-100">
					1. GET - 投稿一覧を取得
				</h2>
				<UButton
					:loading="loading"
					@click="$emit('fetch')"
					color="primary"
				>
					一覧を取得
				</UButton>
			</div>
		</template>
		<div class="space-y-4">
			<div v-if="loading" class="text-center py-8 text-neutral-400">
				<div
					class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
				></div>
				<p class="mt-2">データを読み込み中...</p>
			</div>
			<div v-else-if="posts && posts.length > 0" class="overflow-x-auto">
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
							<th
								class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
							>
								操作
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
							<td class="px-4 py-3">
								<div class="flex gap-2">
									<UButton
										size="xs"
										color="blue"
										@click="$emit('edit', post)"
									>
										編集
									</UButton>
									<UButton
										size="xs"
										color="red"
										@click="$emit('delete', post.id)"
									>
										削除
									</UButton>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="mt-4 text-sm text-neutral-400 text-center">
					表示中: 1-10件 / 全{{ posts?.length || 0 }}件
				</div>
			</div>
			<div v-else class="text-center py-8 text-neutral-400">
				データがありません。「一覧を取得」ボタンをクリックしてください。
			</div>
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Post } from '~/types/http-signal/p1/api'

export default defineComponent({
	name: 'PostList',
	props: {
		posts: {
			type: Array as () => Post[] | null,
			default: null,
		},
		loading: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['fetch', 'edit', 'delete'],
})
</script>

