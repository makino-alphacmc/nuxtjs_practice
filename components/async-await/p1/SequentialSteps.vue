<!-- components/async-await/p1/SequentialSteps.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-neutral-100">
					4. データを順次取得（連続 await）
				</h2>
				<div v-if="data?.duration && !loading" class="text-sm text-neutral-400">
					処理時間: {{ data.duration }}ms
				</div>
			</div>
		</template>
		<div class="space-y-4">
			<UButton
				@click="$emit('fetch')"
				:loading="loading"
				color="primary"
				class="mt-4"
			>
				<template v-if="!loading">データを順次取得</template>
				<template v-else>順次取得中...</template>
			</UButton>

			<!-- ローディング状態 -->
			<div v-if="loading" class="text-center py-8 text-neutral-400">
				<div
					class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
				></div>
				<p class="mt-2">ステップを順番に進めています...</p>
			</div>

			<!-- エラー表示 -->
			<div
				v-if="error"
				class="p-4 bg-red-950/20 border border-red-800 rounded-lg mt-4"
			>
				<p class="text-red-400 font-medium">エラーが発生しました</p>
				<p class="text-red-300 text-sm mt-1">{{ error }}</p>
				<UButton size="sm" color="red" class="mt-3" @click="$emit('fetch')">
					再試行する
				</UButton>
			</div>

			<!-- ステップフローの可視化 -->
			<div v-if="data && !loading" class="space-y-3 mt-6">
				<div class="flex items-start gap-4">
					<div
						class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm"
					>
						1
					</div>
					<div
						class="flex-1 bg-neutral-900 rounded-lg border border-neutral-800 p-4"
					>
						<p class="text-neutral-200 font-medium text-sm">投稿データ取得</p>
						<p class="text-neutral-400 text-sm">{{ data.post?.title }}</p>
					</div>
				</div>
				<div class="ml-4 my-2">
					<div class="w-0.5 h-6 bg-neutral-700"></div>
				</div>
				<div class="flex items-start gap-4">
					<div
						class="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm"
					>
						2
					</div>
					<div
						class="flex-1 bg-neutral-900 rounded-lg border border-neutral-800 p-4"
					>
						<p class="text-neutral-200 font-medium text-sm">
							ユーザーデータ取得
						</p>
						<p class="text-neutral-400 text-sm">{{ data.user?.name }}</p>
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { SequentialData } from '~/types/async-await/p1/api'

export default defineComponent({
	name: 'SequentialSteps',
	props: {
		data: {
			type: Object as () => SequentialData | null,
			default: null,
		},
		loading: {
			type: Boolean,
			required: true,
		},
		error: {
			type: String as () => string | null,
			default: null,
		},
	},
	emits: ['fetch'],
})
</script>
