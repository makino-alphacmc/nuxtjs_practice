// composables/crud-operations/p1/useCrudWithArrayOperations.ts
import { ref, computed, watch, readonly } from 'vue'
import { useState } from '#app'
import type { Post, CreatePostRequest, UpdatePostRequest } from '~/types/crud-operations/p1/api'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

/**
 * API通信 + 配列操作の実践版composable
 *
 * CRUD操作（GET/POST/PUT/DELETE）と配列操作（検索・フィルタ・ソート・ページネーション）を組み合わせた実践的な実装
 */
export const useCrudWithArrayOperations = () => {
	// 投稿一覧の状態管理
	const posts = useState<Post[]>('crud-operations-p1-posts', () => [])
	const loading = useState<boolean>('crud-operations-p1-loading', () => false)
	const error = useState<Error | null>('crud-operations-p1-error', () => null)

	// 配列操作の状態管理
	const searchQuery = ref<string>('')
	const filterUserId = ref<number | null>(null)
	const sortBy = ref<'id' | 'title' | 'userId'>('id')
	const sortOrder = ref<'asc' | 'desc'>('asc')
	const currentPage = ref(1)
	const itemsPerPage = ref(10)

	/**
	 * GET: 投稿一覧を取得
	 */
	const fetchPosts = async () => {
		loading.value = true
		error.value = null
		try {
			const data = await $fetch<Post[]>(BASE_URL)
			posts.value = data
			currentPage.value = 1 // データ取得後は1ページ目に戻す
			return { success: true, data }
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error('投稿の取得に失敗しました')
			error.value = errorMessage
			return { success: false, error: errorMessage }
		} finally {
			loading.value = false
		}
	}

	/**
	 * POST: 新規投稿を作成
	 */
	const createPost = async (postData: CreatePostRequest) => {
		loading.value = true
		error.value = null
		try {
			const data = await $fetch<Post>(BASE_URL, {
				method: 'POST',
				body: postData,
			})
			// 作成した投稿を一覧に追加（実際のAPIでは保存されないが、UI上で反映）
			posts.value = [data, ...posts.value]
			currentPage.value = 1 // 新規作成後は1ページ目に戻す
			return { success: true, data }
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error('投稿の作成に失敗しました')
			error.value = errorMessage
			return { success: false, error: errorMessage }
		} finally {
			loading.value = false
		}
	}

	/**
	 * PUT: 投稿を更新（全フィールドを更新）
	 */
	const updatePost = async (postData: UpdatePostRequest) => {
		loading.value = true
		error.value = null
		try {
			const data = await $fetch<Post>(`${BASE_URL}/${postData.id}`, {
				method: 'PUT',
				body: postData,
			})
			// 更新した投稿を一覧で更新（実際のAPIでは保存されないが、UI上で反映）
			const index = posts.value.findIndex((p) => p.id === postData.id)
			if (index !== -1) {
				posts.value[index] = data
			}
			return { success: true, data }
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error('投稿の更新に失敗しました')
			error.value = errorMessage
			return { success: false, error: errorMessage }
		} finally {
			loading.value = false
		}
	}

	/**
	 * DELETE: 投稿を削除
	 */
	const deletePost = async (id: number) => {
		loading.value = true
		error.value = null
		try {
			await $fetch(`${BASE_URL}/${id}`, {
				method: 'DELETE',
			})
			// 削除した投稿を一覧から削除（実際のAPIでは削除されないが、UI上で反映）
			posts.value = posts.value.filter((p) => p.id !== id)
			// 削除後に現在のページが空になったら前のページに移動
			if (filteredAndSortedPosts.value.length === 0 && currentPage.value > 1) {
				currentPage.value = currentPage.value - 1
			}
			return { success: true }
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error('投稿の削除に失敗しました')
			error.value = errorMessage
			return { success: false, error: errorMessage }
		} finally {
			loading.value = false
		}
	}

	/**
	 * 検索・フィルタ・ソートを適用した投稿一覧
	 */
	const filteredAndSortedPosts = computed(() => {
		let result = [...posts.value]

		// 1. 検索（タイトルで検索）
		if (searchQuery.value.trim()) {
			const query = searchQuery.value.toLowerCase()
			result = result.filter((post) => post.title.toLowerCase().includes(query))
		}

		// 2. フィルタ（ユーザーIDでフィルタ）
		if (filterUserId.value !== null) {
			result = result.filter((post) => post.userId === filterUserId.value)
		}

		// 3. ソート
		result.sort((a, b) => {
			let aValue: string | number
			let bValue: string | number

			if (sortBy.value === 'id') {
				aValue = a.id
				bValue = b.id
			} else if (sortBy.value === 'title') {
				aValue = a.title
				bValue = b.title
			} else {
				aValue = a.userId
				bValue = b.userId
			}

			if (aValue < bValue) {
				return sortOrder.value === 'asc' ? -1 : 1
			}
			if (aValue > bValue) {
				return sortOrder.value === 'asc' ? 1 : -1
			}
			return 0
		})

		return result
	})

	/**
	 * ページネーション
	 */
	const totalPages = computed(() => {
		return Math.ceil(filteredAndSortedPosts.value.length / itemsPerPage.value)
	})

	const startIndex = computed(() => {
		return (currentPage.value - 1) * itemsPerPage.value
	})

	const endIndex = computed(() => {
		return Math.min(startIndex.value + itemsPerPage.value, filteredAndSortedPosts.value.length)
	})

	const paginatedPosts = computed(() => {
		return filteredAndSortedPosts.value.slice(startIndex.value, endIndex.value)
	})

	/**
	 * 検索クエリをクリア
	 */
	const clearSearch = () => {
		searchQuery.value = ''
		currentPage.value = 1
	}

	/**
	 * フィルタをクリア
	 */
	const clearFilter = () => {
		filterUserId.value = null
		currentPage.value = 1
	}

	/**
	 * 全てのフィルタ・検索をクリア
	 */
	const clearAllFilters = () => {
		searchQuery.value = ''
		filterUserId.value = null
		sortBy.value = 'id'
		sortOrder.value = 'asc'
		currentPage.value = 1
	}

	// itemsPerPage が変更されたら、現在のページを調整
	watch(itemsPerPage, () => {
		if (currentPage.value > totalPages.value) {
			currentPage.value = totalPages.value || 1
		}
	})

	// 検索・フィルタが変更されたら、1ページ目に戻す
	watch([searchQuery, filterUserId], () => {
		currentPage.value = 1
	})

	return {
		// 状態
		posts: readonly(posts),
		loading: readonly(loading),
		error: readonly(error),
		// 配列操作の状態
		searchQuery,
		filterUserId,
		sortBy,
		sortOrder,
		currentPage,
		itemsPerPage,
		// 計算プロパティ
		filteredAndSortedPosts,
		totalPages,
		startIndex,
		endIndex,
		paginatedPosts,
		// メソッド
		fetchPosts,
		createPost,
		updatePost,
		deletePost,
		clearSearch,
		clearFilter,
		clearAllFilters,
	}
}

