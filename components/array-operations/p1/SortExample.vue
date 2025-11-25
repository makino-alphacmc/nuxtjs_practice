<!-- components/array-operations/p1/SortExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				5. ソート - データの並び替え
			</h2>
		</template>
		<div class="space-y-4">
			<div class="flex gap-2">
				<UButton
					:color="sortBy === 'id' ? 'primary' : 'gray'"
					@click="$emit('update:sortBy', 'id')"
					variant="outline"
				>
					ID順
				</UButton>
				<UButton
					:color="sortBy === 'title' ? 'primary' : 'gray'"
					@click="$emit('update:sortBy', 'title')"
					variant="outline"
				>
					タイトル順
				</UButton>
				<UButton
					:color="sortBy === 'userId' ? 'primary' : 'gray'"
					@click="$emit('update:sortBy', 'userId')"
					variant="outline"
				>
					ユーザーID順
				</UButton>
				<UButton
					:color="sortOrder === 'asc' ? 'primary' : 'gray'"
					@click="$emit('toggleSortOrder')"
					variant="outline"
				>
					{{ sortOrder === 'asc' ? '昇順' : '降順' }}
				</UButton>
			</div>
			<div v-if="sortedPosts.length > 0" class="space-y-2">
				<div
					v-for="post in sortedPosts.slice(0, 10)"
					:key="post.id"
					class="p-3 bg-neutral-900 rounded-lg"
				>
					<p class="text-sm text-neutral-200">
						ID {{ post.id }} | ユーザーID {{ post.userId }} | {{ post.title }}
					</p>
				</div>
				<p v-if="sortedPosts.length > 10" class="text-xs text-neutral-500">
					他 {{ sortedPosts.length - 10 }}件...
				</p>
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
	name: 'SortExample',
	props: {
		sortBy: {
			type: String as () => 'id' | 'title' | 'userId',
			required: true,
		},
		sortOrder: {
			type: String as () => 'asc' | 'desc',
			required: true,
		},
		sortedPosts: {
			type: Array as () => Post[],
			required: true,
		},
	},
	emits: ['update:sortBy', 'toggleSortOrder'],
})
</script>

