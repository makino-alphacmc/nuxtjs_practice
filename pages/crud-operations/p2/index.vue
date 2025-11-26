<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">データ取得</h2>
		</template>
		<div class="p-4">
			<UButton @click="handleFetchPosts" :loading="loading" color="primary"
				>投稿一覧を取得</UButton
			>
			<p class="text-sm text-neutral-400 mt-2">全 {{ posts.length }}</p>
		</div>
	</UCard>
	<div v-if="error" class="p-4 bg-red-950/20 border border-red-800 rounded-lg">
		<p class="text-red-400 font-medium">エラーが発生しました</p>
		<p class="text-red-300 text-sm mt-1">{{ error.message }}</p>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p2/useCrudWithArrayOperations'

const { posts, loading, error, fetchPosts } = useCrudWithArrayOperations()

const handleFetchPosts = async () => {
	const result = await fetchPosts()
	if (result.success) {
		console.log('投稿一覧の取得に成功しました', result.data)
	}
}
</script>
