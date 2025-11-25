<!-- components/async-await/p1/UserInfo.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-neutral-100">
					2. ユーザー情報を手動取得（async/await）
				</h2>
				<UButton @click="$emit('fetch')" :loading="loading" color="primary">
					<template v-if="!loading">ユーザー情報を取得</template>
					<template v-else>取得中...</template>
				</UButton>
			</div>
		</template>
		<div class="space-y-4">
			<!-- ローディング状態 -->
			<div v-if="loading" class="text-center py-8 text-neutral-400">
				<div
					class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
				></div>
				<p class="mt-2">ユーザー情報を読み込み中...</p>
			</div>

			<!-- エラー状態 -->
			<div
				v-if="error"
				class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
			>
				<p class="text-red-400 font-medium">エラーが発生しました</p>
				<p class="text-red-300 text-sm mt-1">{{ error }}</p>
				<UButton size="sm" color="red" class="mt-3" @click="$emit('fetch')">
					再試行する
				</UButton>
			</div>

			<!-- 結果テーブル -->
			<div v-if="user && !loading" class="overflow-x-auto">
				<table class="w-full border-collapse bg-neutral-900 rounded-lg">
					<thead>
						<tr class="bg-neutral-800 border-b border-neutral-700">
							<th
								class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
							>
								項目
							</th>
							<th
								class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
							>
								値
							</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border-b border-neutral-800">
							<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
								名前
							</td>
							<td class="px-4 py-3 text-sm text-neutral-200">
								{{ user.name }}
							</td>
						</tr>
						<tr class="border-b border-neutral-800">
							<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
								メール
							</td>
							<td class="px-4 py-3 text-sm text-neutral-200">
								{{ user.email }}
							</td>
						</tr>
						<tr class="border-b border-neutral-800">
							<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
								住所
							</td>
							<td class="px-4 py-3 text-sm text-neutral-200">
								{{ user.address?.city }} / {{ user.address?.street }}
							</td>
						</tr>
						<tr>
							<td class="px-4 py-3 text-sm text-neutral-400 font-medium">
								会社
							</td>
							<td class="px-4 py-3 text-sm text-neutral-200">
								{{ user.company?.name }}
							</td>
						</tr>
					</tbody>
				</table>
				<p class="mt-4 text-sm text-neutral-400 text-center">
					JSONPlaceholder のユーザー ID: {{ user.id }}
				</p>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { User } from '~/types/async-await/p1/api'

interface Props {
	user: User | null
	loading: boolean
	error: string | null
}

export default defineComponent({
	name: 'UserInfo',
	props: {
		user: {
			type: Object as () => User | null,
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
