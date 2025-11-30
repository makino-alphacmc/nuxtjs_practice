<!-- components/array-operations/p1/PaginationExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				6. ページネーション - データの分割表示
			</h2>
		</template>
		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<UInput
					:model-value="itemsPerPage"
					@update:model-value="$emit('update:itemsPerPage', $event)"
					type="number"
					placeholder="1ページあたりの件数"
					label="1ページあたりの件数"
					class="w-48"
					:min="1"
					:max="100"
				/>
			</div>
			<div v-if="paginatedPosts.length > 0" class="space-y-4">
				<div class="flex items-center justify-between">
					<p class="text-sm text-neutral-400">
						ページ {{ currentPage }} / {{ totalPages }}
						（全 {{ totalItems }}件中 {{ startIndex + 1 }}-{{ endIndex }}件を表示）
					</p>
					<div class="flex gap-2">
						<UButton
							@click="$emit('prevPage')"
							:disabled="currentPage === 1"
							color="gray"
							variant="outline"
						>
							前へ
						</UButton>
						<UButton
							@click="$emit('nextPage')"
							:disabled="currentPage === totalPages"
							color="gray"
							variant="outline"
						>
							次へ
						</UButton>
					</div>
				</div>
				<div class="space-y-2">
					<div
						v-for="post in paginatedPosts"
						:key="post.id"
						class="p-3 bg-neutral-900 rounded-lg"
					>
						<p class="text-sm text-neutral-200">
							ID {{ post.id }}: {{ post.title }}
						</p>
					</div>
				</div>
			</div>
			<div v-else class="text-sm text-neutral-500">
				データを取得してください
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
// 型定義を明示的にインポート
import type { Post } from '~/types/array-operations/p1/api'

interface Props {
	currentPage: number
	itemsPerPage: number
	totalPages: number
	totalItems: number
	startIndex: number
	endIndex: number
	paginatedPosts: Post[]
}

defineProps<Props>()

// emits を定義
defineEmits<{
	'update:itemsPerPage': [value: string | number]
	prevPage: []
	nextPage: []
}>()
</script>

