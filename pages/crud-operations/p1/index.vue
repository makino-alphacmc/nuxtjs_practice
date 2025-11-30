<template>
	<div class="min-h-screen bg-neutral-900 p-8">
		<div class="max-w-7xl mx-auto space-y-6">
			<h1 class="text-3xl font-bold text-neutral-100 mb-8">
				CRUD処理（実務アプリの核心）- API + 配列操作の実践版
			</h1>

			<!-- エラー表示 -->
			<div
				v-if="error"
				class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
			>
				<p class="text-red-400 font-medium">エラーが発生しました</p>
				<p class="text-red-300 text-sm mt-1">{{ error.message }}</p>
			</div>

			<!-- データ取得ボタン -->
			<UCard class="bg-neutral-950">
				<template #header>
					<h2 class="text-xl font-semibold text-neutral-100">
						データ取得
					</h2>
				</template>
				<div class="p-4">
					<UButton
						@click="handleFetchPosts"
						:loading="loading"
						color="primary"
					>
						投稿一覧を取得
					</UButton>
					<p class="text-sm text-neutral-400 mt-2">
						全 {{ posts.length }}件の投稿を取得できます
					</p>
				</div>
			</UCard>

			<!-- 投稿一覧（検索・フィルタ・ソート・ページネーション付き） -->
			<PostListWithOperations
				:posts="posts"
				:paginated-posts="paginatedPosts"
				:loading="loading"
				:search-query="searchQuery"
				:filter-user-id="filterUserId"
				:sort-by="sortBy"
				:sort-order="sortOrder"
				:current-page="currentPage"
				:total-pages="totalPages"
				:items-per-page="itemsPerPage"
				:total-items="posts.length"
				:filtered-count="filteredAndSortedPosts.length"
				:start-index="startIndex"
				:end-index="endIndex"
				@update:searchQuery="searchQuery = $event"
				@update:filterUserId="filterUserId = $event ? Number($event) : null"
				@update:sortBy="sortBy = $event"
				@toggleSortOrder="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
				@update:itemsPerPage="itemsPerPage = $event ? Number($event) : 10"
				@prevPage="currentPage = Math.max(1, currentPage - 1)"
				@nextPage="currentPage = Math.min(totalPages, currentPage + 1)"
				@clearSearch="clearSearch"
				@clearFilter="clearFilter"
				@clearAllFilters="clearAllFilters"
				@edit="selectPostForEdit"
				@delete="handleDeletePost"
			/>

			<!-- 新規投稿作成 -->
			<PostCreateForm
				:loading="loading"
				@create="handleCreatePost"
			/>

			<!-- 投稿更新 -->
			<PostEditForm
				:editing-post="editingPost"
				:loading="loading"
				@update="handleUpdatePost"
				@cancel="cancelEdit"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useCrudWithArrayOperations } from '~/composables/crud-operations/p1/useCrudWithArrayOperations'

// Components を明示的にインポート
import PostListWithOperations from '~/components/crud-operations/p1/PostListWithOperations.vue'
import PostCreateForm from '~/components/http-signal/p1/PostCreateForm.vue'
import PostEditForm from '~/components/http-signal/p1/PostEditForm.vue'

// 型定義を明示的にインポート（必要に応じて使用）
import type {
	Post,
	CreatePostRequest,
	UpdatePostRequest,
} from '~/types/crud-operations/p1/api'

// API通信 + 配列操作のcomposableを使用
const {
	posts,
	loading,
	error,
	searchQuery,
	filterUserId,
	sortBy,
	sortOrder,
	currentPage,
	itemsPerPage,
	filteredAndSortedPosts,
	totalPages,
	startIndex,
	endIndex,
	paginatedPosts,
	fetchPosts,
	createPost,
	updatePost,
	deletePost,
	clearSearch,
	clearFilter,
	clearAllFilters,
} = useCrudWithArrayOperations()

// 編集中の投稿の状態
const editingPost = ref<UpdatePostRequest | null>(null)

/**
 * GET: 投稿一覧を取得
 */
const handleFetchPosts = async () => {
	const result = await fetchPosts()
	if (result.success) {
		console.log('投稿一覧の取得に成功しました', result.data)
	}
}

/**
 * POST: 新規投稿を作成
 */
const handleCreatePost = async (postData: CreatePostRequest) => {
	const result = await createPost(postData)
	if (result.success) {
		console.log('投稿の作成に成功しました', result.data)
		alert('投稿を作成しました！')
	}
}

/**
 * PUT: 投稿を更新するために選択
 */
const selectPostForEdit = (post: Post) => {
	editingPost.value = {
		id: post.id,
		title: post.title,
		body: post.body,
		userId: post.userId,
	}
	// 編集セクションまでスクロール
	nextTick(() => {
		const editSection = document.querySelector('[data-edit-section]')
		editSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	})
}

/**
 * PUT: 投稿を更新
 */
const handleUpdatePost = async () => {
	if (!editingPost.value) return

	if (!editingPost.value.title || !editingPost.value.body) {
		alert('タイトルと本文を入力してください')
		return
	}

	const result = await updatePost(editingPost.value)
	if (result.success) {
		console.log('投稿の更新に成功しました', result.data)
		editingPost.value = null
		alert('投稿を更新しました！')
	}
}

/**
 * 編集をキャンセル
 */
const cancelEdit = () => {
	editingPost.value = null
}

/**
 * DELETE: 投稿を削除
 */
const handleDeletePost = async (id: number) => {
	if (!confirm(`投稿ID ${id} を削除してもよろしいですか？`)) {
		return
	}

	const result = await deletePost(id)
	if (result.success) {
		console.log('投稿の削除に成功しました')
		alert('投稿を削除しました！')
	}
}
</script>

