<!-- components/array-operations/p1/MapExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				1. map - データの変換・表示
			</h2>
		</template>
		<div class="space-y-4">
			<p class="text-sm text-neutral-400">
				各投稿のタイトルを大文字に変換して表示
			</p>
			<div v-if="mappedPosts.length > 0" class="space-y-2">
				<div
					v-for="post in mappedPosts"
					:key="post.id"
					class="p-3 bg-neutral-900 rounded-lg"
				>
					<p class="text-sm text-neutral-300">
						<strong class="text-neutral-100">ID {{ post.id }}:</strong>
						{{ post.uppercaseTitle }}
					</p>
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

interface MappedPost extends Post {
	uppercaseTitle: string
}

interface Props {
	mappedPosts: MappedPost[]
}

defineProps<Props>()
</script>

