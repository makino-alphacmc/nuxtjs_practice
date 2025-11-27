import type { Post } from '~/types/crud-operations/p2/api'
import { ref, readonly, computed, watch } from 'vue'
import { $fetch } from 'ofetch'
import { useState } from '#app'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

export const useCrudWithArrayOperations = () => {
	// 投稿一覧の状態管理
	const posts = useState<Post[]>('crud-operations-p2-posts', () => [])
	const loading = useState<boolean>('crud-operations-p2-loading', () => false)
	const error = useState<Error | null>('crud-operations-p2-error', () => null)

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
			const errorMessage =
				err instanceof Error ? err : new Error('投稿の取得に失敗しました')
			error.value = errorMessage
			return { success: false, error: errorMessage }
		} finally {
			loading.value = false
		}
	}
	/**
	 * 検索・フィルターソートを適用した投稿一覧
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

	const paginatedPosts = computed(() => {
		const startIndex = (currentPage.value - 1) * itemsPerPage.value
		const endIndex = startIndex + itemsPerPage.value
		return filteredAndSortedPosts.value.slice(startIndex, endIndex)
	})

	watch([searchQuery, filterUserId], () => {
		currentPage.value = 1
	})

	return {
		posts: readonly(posts),
		loading: readonly(loading),
		error: readonly(error),
		fetchPosts,
		searchQuery,
		filterUserId,
		sortBy,
		sortOrder,
		currentPage,
		itemsPerPage,
		filteredAndSortedPosts,
		totalPages,
		paginatedPosts,
	}
}
