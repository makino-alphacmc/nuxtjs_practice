<template>
	<UCard>
		<template #header>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-neutral-100">投稿データ一覧</h2>
				<div v-if="posts && !postPending">全{{ posts.length }}件</div>
			</div>

			<!-- ローディング状態 -->
			<div v-if="postPending" class="text-center px-50 text-neutral-400">
				<div
					class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
				></div>
				<!-- スピナーアニメーション（回転する円） -->
				<p class="mt-2">データを読み込み中...</p>
				<!-- ローディングメッセージ -->
			</div>

			<!-- データテーブル表示 -->
			<div v-if="posts && !postPending" class="overflow-x-auto">
				<!-- データが存在し、ローディング中でない場合のみ表示 -->
				<table class="w-full border-collapse">
					<thead>
						<tr class="bg-neutral-800 border-b border-neutral-700">
							<th
								class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
							>
								ID
								<!-- テーブルのヘッダー：ID列 -->
							</th>
							<th
								class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
							>
								タイトル
								<!-- テーブルのヘッダー：タイトル列 -->
							</th>
							<th
								class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
							>
								本文（抜粋）
								<!-- テーブルのヘッダー：本文列 -->
							</th>
							<th
								class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
							>
								ユーザーID
								<!-- テーブルのヘッダー：ユーザーID列 -->
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="post in posts?.slice(0, 10) || []" :key="post.id">
							<td class="px-4 py-3 text-sm text-neutral-300 font-mono">
								{{ post.id }}
								<!-- 投稿IDを表示 -->
							</td>
							<td class="px-4 py-3 text-sm text-neutral-200 font-medium">
								{{ post.title }}
								<!-- 投稿タイトルを表示 -->
							</td>
							<td class="px-4 py-3 text-sm text-neutral-400 max-w-md truncate">
								{{ post.body }}
								<!-- 投稿本文を表示（長い場合は切り詰め） -->
							</td>
							<td class="px-4 py-3 text-sm text-neutral-300">
								{{ post.userId }}
								<!-- ユーザーIDを表示 -->
							</td>
						</tr>
					</tbody>
				</table>
				<div class="mt-4 text-sm text-neutral-400 text-center">
					表示中: 1-10件 / 全{{ posts.length }}件
					<!-- 表示件数と総件数を表示 -->
				</div>
			</div>
		</template>
	</UCard>
</template>

<script setup lang="ts">
import type { Post } from '~/types/async-await/p2/api'

interface Props {
	posts: Post[] | null
	postPending: boolean
	postError: Error | null
}

defineProps<Props>()
</script>
