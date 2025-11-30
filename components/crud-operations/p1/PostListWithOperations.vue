<!-- components/crud-operations/p1/PostListWithOperations.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				投稿一覧（検索・フィルタ・ソート・ページネーション付き）
			</h2>
		</template>
		<div class="space-y-4">
			<!-- 検索・フィルタ・ソート -->
			<div class="space-y-4 p-4 bg-neutral-900 rounded-lg">
				<!-- 検索 -->
				<div class="flex items-center gap-4">
					<UInput
						:model-value="searchQuery"
						@update:model-value="$emit('update:searchQuery', $event)"
						placeholder="タイトルで検索..."
						label="検索"
						class="flex-1"
					/>
					<UButton
						v-if="searchQuery"
						@click="$emit('clearSearch')"
						color="gray"
						variant="outline"
					>
						クリア
					</UButton>
				</div>

				<!-- フィルタ -->
				<div class="flex items-center gap-4">
					<UInput
						:model-value="filterUserId"
						@update:model-value="$emit('update:filterUserId', $event)"
						type="number"
						placeholder="ユーザーID（1-10）"
						label="ユーザーIDでフィルタ"
						class="w-48"
					/>
					<UButton
						v-if="filterUserId !== null"
						@click="$emit('clearFilter')"
						color="gray"
						variant="outline"
					>
						クリア
					</UButton>
				</div>

				<!-- ソート -->
				<div class="flex items-center gap-2 flex-wrap">
					<span class="text-sm text-neutral-400">ソート:</span>
					<UButton
						:color="sortBy === 'id' ? 'primary' : 'gray'"
						@click="$emit('update:sortBy', 'id')"
						variant="outline"
						size="sm"
					>
						ID順
					</UButton>
					<UButton
						:color="sortBy === 'title' ? 'primary' : 'gray'"
						@click="$emit('update:sortBy', 'title')"
						variant="outline"
						size="sm"
					>
						タイトル順
					</UButton>
					<UButton
						:color="sortBy === 'userId' ? 'primary' : 'gray'"
						@click="$emit('update:sortBy', 'userId')"
						variant="outline"
						size="sm"
					>
						ユーザーID順
					</UButton>
					<UButton
						:color="sortOrder === 'asc' ? 'primary' : 'gray'"
						@click="$emit('toggleSortOrder')"
						variant="outline"
						size="sm"
					>
						{{ sortOrder === 'asc' ? '昇順' : '降順' }}
					</UButton>
				</div>

				<!-- 全クリア -->
				<UButton
					v-if="searchQuery || filterUserId !== null"
					@click="$emit('clearAllFilters')"
					color="gray"
					variant="outline"
					size="sm"
				>
					全てのフィルタをクリア
				</UButton>
			</div>

			<!-- 統計情報 -->
			<div class="flex items-center justify-between text-sm text-neutral-400">
				<p>
					全 {{ totalItems }}件中 {{ startIndex + 1 }}-{{ endIndex }}件を表示
					<span v-if="searchQuery || filterUserId !== null">
						（フィルタ適用: {{ filteredCount }}件）
					</span>
				</p>
			</div>

			<!-- ローディング -->
			<div v-if="loading" class="text-center py-8">
				<p class="text-neutral-400">読み込み中...</p>
			</div>

			<!-- 投稿一覧 -->
			<div v-else-if="paginatedPosts.length > 0" class="space-y-2">
				<div
					v-for="post in paginatedPosts"
					:key="post.id"
					class="p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
				>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<div class="flex items-center gap-2 mb-2">
								<span class="text-xs font-semibold text-neutral-500">
									ID: {{ post.id }}
								</span>
								<span class="text-xs font-semibold text-neutral-500">
									ユーザーID: {{ post.userId }}
								</span>
							</div>
							<h3 class="text-lg font-semibold text-neutral-100 mb-2">
								{{ post.title }}
							</h3>
							<p class="text-sm text-neutral-300 line-clamp-2">
								{{ post.body }}
							</p>
						</div>
						<div class="flex gap-2 ml-4">
							<UButton
								@click="$emit('edit', post)"
								color="blue"
								variant="outline"
								size="sm"
							>
								編集
							</UButton>
							<UButton
								@click="$emit('delete', post.id)"
								color="red"
								variant="outline"
								size="sm"
							>
								削除
							</UButton>
						</div>
					</div>
				</div>
			</div>

			<!-- データなし -->
			<div v-else class="text-center py-8">
				<p class="text-neutral-400">
					{{ searchQuery || filterUserId !== null ? '該当する投稿がありません' : '投稿がありません' }}
				</p>
			</div>

			<!-- ページネーション -->
			<div v-if="paginatedPosts.length > 0" class="flex items-center justify-between pt-4 border-t border-neutral-800">
				<div class="flex items-center gap-4">
					<UInput
						:model-value="itemsPerPage"
						@update:model-value="$emit('update:itemsPerPage', $event)"
						type="number"
						placeholder="1ページあたりの件数"
						label="1ページあたりの件数"
						class="w-48"
						:min="1"
						:max="100"
					/>
				</div>
				<div class="flex items-center gap-2">
					<UButton
						@click="$emit('prevPage')"
						:disabled="currentPage === 1"
						color="gray"
						variant="outline"
						size="sm"
					>
						前へ
					</UButton>
					<span class="text-sm text-neutral-400 px-4">
						ページ {{ currentPage }} / {{ totalPages }}
					</span>
					<UButton
						@click="$emit('nextPage')"
						:disabled="currentPage === totalPages"
						color="gray"
						variant="outline"
						size="sm"
					>
						次へ
					</UButton>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
// 型定義を明示的にインポート
import type { Post } from '~/types/crud-operations/p1/api'

interface Props {
	posts: Post[]
	paginatedPosts: Post[]
	loading: boolean
	searchQuery: string
	filterUserId: number | null
	sortBy: 'id' | 'title' | 'userId'
	sortOrder: 'asc' | 'desc'
	currentPage: number
	totalPages: number
	itemsPerPage: number
	totalItems: number
	filteredCount: number
	startIndex: number
	endIndex: number
}

defineProps<Props>()

// emits を定義
defineEmits<{
	'update:searchQuery': [value: string]
	'update:filterUserId': [value: string | null]
	'update:sortBy': [value: 'id' | 'title' | 'userId']
	toggleSortOrder: []
	'update:itemsPerPage': [value: string | number]
	prevPage: []
	nextPage: []
	clearSearch: []
	clearFilter: []
	clearAllFilters: []
	edit: [post: Post]
	delete: [id: number]
}>()
</script>

