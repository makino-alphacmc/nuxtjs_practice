<!-- components/async-await/p1/ParallelDataCards.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-neutral-100">
					3. 複数データを並列取得（Promise.all）
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
				<template v-if="!loading">複数データを並列取得</template>
				<template v-else>並列取得中...</template>
			</UButton>

			<!-- ローディング状態 -->
			<div v-if="loading" class="text-center py-8 text-neutral-400">
				<div
					class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
				></div>
				<p class="mt-2">複数のデータを読み込み中...</p>
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

			<!-- 並列取得結果のカード表示 -->
			<div
				v-if="data && !loading"
				class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
			>
				<div class="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
					<h3 class="text-sm font-semibold text-neutral-300">投稿データ</h3>
					<p class="text-neutral-200 font-medium text-sm mb-2">
						{{ data.post?.title }}
					</p>
					<p class="text-neutral-400 text-xs line-clamp-3">
						{{ data.post?.body }}
					</p>
				</div>
				<div class="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
					<h3 class="text-sm font-semibold text-neutral-300">ユーザー情報</h3>
					<p class="text-neutral-200 text-sm font-medium">
						{{ data.user?.name }}
					</p>
					<p class="text-neutral-400 text-xs">
						{{ data.user?.email }} /
						{{ data.user?.address?.city }}
					</p>
				</div>
				<div class="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
					<h3 class="text-sm font-semibold text-neutral-300">コメント</h3>
					<p class="text-neutral-200 text-sm font-medium">
						{{ data.comment?.name }}
					</p>
					<p class="text-neutral-400 text-xs line-clamp-2">
						{{ data.comment?.body }}
					</p>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
// 型定義を明示的にインポート
import type { ParallelData } from '~/types/async-await/p1/api'

interface Props {
	data: ParallelData | null
	loading: boolean
	error: string | null
}

defineProps<Props>()

// emits を定義
defineEmits<{
	fetch: []
}>()
</script>
