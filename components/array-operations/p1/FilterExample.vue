<!-- components/array-operations/p1/FilterExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				2. filter - データの絞り込み
			</h2>
		</template>
		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<UInput
					:model-value="filterUserId"
					@update:model-value="$emit('update:filterUserId', $event)"
					type="number"
					placeholder="ユーザーID（1-10）"
					label="ユーザーIDでフィルタ"
					class="w-48"
				/>
				<UButton
					@click="$emit('clearFilter')"
					color="gray"
					variant="outline"
				>
					クリア
				</UButton>
			</div>
			<div v-if="filteredPosts.length > 0" class="space-y-2">
				<p class="text-sm text-neutral-400">
					フィルタ結果: {{ filteredPosts.length }}件
				</p>
				<div
					v-for="post in filteredPosts.slice(0, 5)"
					:key="post.id"
					class="p-3 bg-neutral-900 rounded-lg"
				>
					<p class="text-sm text-neutral-200">
						ID {{ post.id }}: {{ post.title }}
					</p>
				</div>
				<p v-if="filteredPosts.length > 5" class="text-xs text-neutral-500">
					他 {{ filteredPosts.length - 5 }}件...
				</p>
			</div>
			<div v-else-if="hasData" class="text-sm text-neutral-500">
				該当するデータがありません
			</div>
			<div v-else class="text-sm text-neutral-500">
				データを取得してください
			</div>
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Post } from '~/types/array-operations/p1/api'

export default defineComponent({
	name: 'FilterExample',
	props: {
		filterUserId: {
			type: Number as () => number | null,
			default: null,
		},
		filteredPosts: {
			type: Array as () => Post[],
			required: true,
		},
		hasData: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['update:filterUserId', 'clearFilter'],
})
</script>

