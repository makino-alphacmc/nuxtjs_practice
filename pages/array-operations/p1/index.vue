<template>
	<div class="min-h-screen bg-neutral-900 p-8">
		<div class="max-w-7xl mx-auto space-y-6">
			<h1 class="text-3xl font-bold text-neutral-100 mb-8">
				配列操作の練習
			</h1>

			<!-- データ取得 -->
			<DataFetch
				:loading="loading"
				:posts-count="posts.length"
				@fetch="handleFetchPosts"
			/>

			<!-- 1. map - データの変換・表示 -->
			<MapExample :mapped-posts="mappedPosts" />

			<!-- 2. filter - データの絞り込み -->
			<FilterExample
				v-model:filter-user-id="filterUserId"
				:filtered-posts="filteredPosts"
				:has-data="posts.length > 0"
				@clear-filter="filterUserId = null"
			/>

			<!-- 3. reduce - 集計 -->
			<ReduceExample
				:user-post-counts="userPostCounts"
				:has-data="posts.length > 0"
			/>

			<!-- 4. find - 特定のデータを検索 -->
			<FindExample
				v-model:search-id="searchId"
				:found-post="foundPost"
				:has-data="posts.length > 0"
				@clear-search="searchId = null"
			/>

			<!-- 5. ソート - データの並び替え -->
			<SortExample
				v-model:sort-by="sortBy"
				v-model:sort-order="sortOrder"
				:sorted-posts="sortedPosts"
				@toggle-sort-order="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
			/>

			<!-- 6. ページネーション - データの分割表示 -->
			<PaginationExample
				v-model:items-per-page="itemsPerPage"
				:current-page="currentPage"
				:total-pages="totalPages"
				:total-items="posts.length"
				:start-index="startIndex"
				:end-index="endIndex"
				:paginated-posts="paginatedPosts"
				@prev-page="currentPage = Math.max(1, currentPage - 1)"
				@next-page="currentPage = Math.min(totalPages, currentPage + 1)"
			/>

			<!-- 7. データの追加・削除・更新 -->
			<CrudExample
				v-model:new-post-title="newPostTitle"
				v-model:new-post-user-id="newPostUserId"
				v-model:update-post-id="updatePostId"
				v-model:update-post-title="updatePostTitle"
				v-model:delete-post-id="deletePostId"
				@add="handleAddPost"
				@update="handleUpdatePost"
				@delete="handleDeletePost"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { useArrayOperations } from '~/composables/array-operations/p1/useArrayOperations'

// Components を明示的にインポート
import DataFetch from '~/components/array-operations/p1/DataFetch.vue'
import MapExample from '~/components/array-operations/p1/MapExample.vue'
import FilterExample from '~/components/array-operations/p1/FilterExample.vue'
import ReduceExample from '~/components/array-operations/p1/ReduceExample.vue'
import FindExample from '~/components/array-operations/p1/FindExample.vue'
import SortExample from '~/components/array-operations/p1/SortExample.vue'
import PaginationExample from '~/components/array-operations/p1/PaginationExample.vue'
import CrudExample from '~/components/array-operations/p1/CrudExample.vue'

// Composables を使用
const {
	posts,
	loading,
	fetchPosts,
	mappedPosts,
	getFilteredPosts,
	getUserPostCounts,
	findPostById,
	getSortedPosts,
	getPaginatedPosts,
	getTotalPages,
	addPost: addPostToArray,
	updatePost: updatePostInArray,
	deletePostById,
} = useArrayOperations()

// データ取得
const handleFetchPosts = async () => {
	await fetchPosts()
}

// 2. filter - データの絞り込み
const filterUserId = ref<number | null>(null)
const filteredPosts = computed(() => {
	return getFilteredPosts(filterUserId.value)
})

// 3. reduce - 集計
const userPostCounts = computed(() => {
	return getUserPostCounts.value
})

// 4. find - 特定のデータを検索
const searchId = ref<number | null>(null)
const foundPost = computed(() => {
	return findPostById(searchId.value)
})

// 5. ソート - データの並び替え
const sortBy = ref<'id' | 'title' | 'userId'>('id')
const sortOrder = ref<'asc' | 'desc'>('asc')
const sortedPosts = computed(() => {
	return getSortedPosts(sortBy.value, sortOrder.value)
})

// 6. ページネーション - データの分割表示
const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => {
	return getTotalPages(itemsPerPage.value)
})

const startIndex = computed(() => {
	return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
	return Math.min(startIndex.value + itemsPerPage.value, posts.value.length)
})

const paginatedPosts = computed(() => {
	return getPaginatedPosts(currentPage.value, itemsPerPage.value)
})

// itemsPerPage が変更されたら、現在のページを調整
watch(itemsPerPage, () => {
	if (currentPage.value > totalPages.value) {
		currentPage.value = totalPages.value || 1
	}
})

// 7. データの追加・削除・更新
const newPostTitle = ref('')
const newPostUserId = ref<number | null>(1)

const handleAddPost = () => {
	if (!newPostTitle.value || !newPostUserId.value) {
		return
	}
	const success = addPostToArray(newPostTitle.value, newPostUserId.value)
	if (success) {
		newPostTitle.value = ''
		newPostUserId.value = 1
		alert('投稿を追加しました！')
	}
}

const updatePostId = ref<number | null>(null)
const updatePostTitle = ref('')

const handleUpdatePost = () => {
	if (!updatePostId.value || !updatePostTitle.value) {
		return
	}
	const success = updatePostInArray(updatePostId.value, updatePostTitle.value)
	if (success) {
		updatePostId.value = null
		updatePostTitle.value = ''
		alert('投稿を更新しました！')
	} else {
		alert('該当する投稿が見つかりませんでした')
	}
}

const deletePostId = ref<number | null>(null)

const handleDeletePost = () => {
	if (!deletePostId.value) {
		return
	}
	const success = deletePostById(deletePostId.value)
	if (success) {
		deletePostId.value = null
		alert('投稿を削除しました！')
	} else {
		alert('該当する投稿が見つかりませんでした')
	}
}
</script>
