<!-- components/array-operations/p1/ReduceExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				3. reduce - 集計
			</h2>
		</template>
		<div class="space-y-4">
			<p class="text-sm text-neutral-400">
				ユーザーごとの投稿数を集計
			</p>
			<div v-if="hasData" class="space-y-2">
				<div
					v-for="(count, userId) in userPostCounts"
					:key="userId"
					class="p-3 bg-neutral-900 rounded-lg flex justify-between items-center"
				>
					<span class="text-sm text-neutral-300">
						ユーザーID {{ userId }}
					</span>
					<span class="text-sm font-semibold text-neutral-100">
						{{ count }}件
					</span>
				</div>
			</div>
			<div v-else class="text-sm text-neutral-500">
				データを取得してください
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
interface Props {
	userPostCounts: Record<number, number>
	hasData: boolean
}

defineProps<Props>()
</script>

