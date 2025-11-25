<!-- components/async-await/p1/ErrorResultDisplay.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-neutral-100">
					5. エラーハンドリングを徹底解説
				</h2>
				<div v-if="result?.status" class="text-sm text-neutral-400">
					最新ステータス: {{ result.status }}
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
				<template v-if="!loading">エラーハンドリングをテスト</template>
				<template v-else>テスト実行中...</template>
			</UButton>

			<!-- 成功／失敗の結果表示 -->
			<div v-if="result" class="space-y-2 mt-4">
				<div
					v-if="result.success"
					class="p-4 bg-green-950/20 rounded-lg border border-green-800"
				>
					<div class="flex items-center gap-2 mb-2">
						<span class="text-green-400 text-xl">✓</span>
						<p class="text-green-400 font-medium">処理成功</p>
					</div>
					<p class="text-neutral-300 text-sm mt-1">
						{{ result.message }}
					</p>
				</div>
				<div
					v-else
					class="p-4 bg-red-950/20 rounded-lg border border-red-800"
				>
					<div class="flex items-center gap-2 mb-2">
						<span class="text-red-400 text-xl">✗</span>
						<p class="text-red-400 font-medium">エラー発生</p>
					</div>
					<p class="text-neutral-300 text-sm mt-1">
						{{ result.message }}
					</p>
					<div class="mt-3 pt-3 border-t border-red-800">
						<table class="w-full text-xs">
							<tr>
								<td class="text-neutral-400 py-1">ステータスコード:</td>
								<td class="text-neutral-200 font-mono">
									{{ result.status }}
								</td>
							</tr>
							<tr v-if="result.status === 404">
								<td class="text-neutral-400 py-1">エラータイプ:</td>
								<td class="text-neutral-200">リソース未検出</td>
							</tr>
							<tr v-else-if="result.status === 'NETWORK_ERROR'">
								<td class="text-neutral-400 py-1">エラータイプ:</td>
								<td class="text-neutral-200">通信エラー</td>
							</tr>
							<tr v-else-if="result.status === 'UNKNOWN_ERROR'">
								<td class="text-neutral-400 py-1">エラータイプ:</td>
								<td class="text-neutral-200">想定外エラー</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { ErrorHandlingResult } from '~/types/async-await/p1/api'

interface Props {
	result: ErrorHandlingResult | null
	loading: boolean
}

defineProps<Props>()
defineEmits<{
	fetch: []
}>()
</script>

