<!-- components/array-operations/p1/DataFetch.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				データ取得
			</h2>
		</template>
		<div class="space-y-4">
			<UButton
				:loading="loading"
				@click="$emit('fetch')"
				color="primary"
			>
				投稿データを取得
			</UButton>
			<div v-if="postsCount > 0" class="text-sm text-neutral-400">
				取得件数: {{ postsCount }}件
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
// 型定義を明示的にインポート
interface Props {
	loading: boolean
	postsCount: number
}

defineProps<Props>()

// emits を定義
defineEmits<{
	fetch: []
}>()
</script>

