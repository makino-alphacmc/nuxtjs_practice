<!-- components/array-operations/p1/FindExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				4. find - 特定のデータを検索
			</h2>
		</template>
		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<UInput
					:model-value="searchId"
					@update:model-value="$emit('update:searchId', $event)"
					type="number"
					placeholder="投稿ID"
					label="IDで検索"
					class="w-48"
				/>
				<UButton
					@click="$emit('clearSearch')"
					color="gray"
					variant="outline"
				>
					クリア
				</UButton>
			</div>
			<div v-if="foundPost" class="p-4 bg-neutral-900 rounded-lg">
				<p class="text-sm text-neutral-300 mb-2">
					<strong class="text-neutral-100">ID:</strong> {{ foundPost.id }}
				</p>
				<p class="text-sm text-neutral-300 mb-2">
					<strong class="text-neutral-100">タイトル:</strong> {{ foundPost.title }}
				</p>
				<p class="text-sm text-neutral-300">
					<strong class="text-neutral-100">ユーザーID:</strong> {{ foundPost.userId }}
				</p>
			</div>
			<div v-else-if="hasData && searchId" class="text-sm text-neutral-500">
				該当するデータがありません
			</div>
			<div v-else-if="!hasData" class="text-sm text-neutral-500">
				データを取得してください
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
// 型定義を明示的にインポート
import type { Post } from '~/types/array-operations/p1/api'

interface Props {
	searchId: number | null
	foundPost: Post | null
	hasData: boolean
}

defineProps<Props>()

// emits を定義
defineEmits<{
	'update:searchId': [value: string | null]
	clearSearch: []
}>()
</script>

