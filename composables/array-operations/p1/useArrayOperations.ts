// composables/array-operations/p1/useArrayOperations.ts
import type { Post } from '~/types/array-operations/p1/api'

/**
 * 配列操作のロジックを管理するcomposable
 */
export const useArrayOperations = () => {
	// データ取得
	const posts = useState<Post[]>('array-operations-posts', () => [])
	const loading = useState<boolean>('array-operations-loading', () => false)

	const fetchPosts = async () => {
		loading.value = true
		try {
			const data = await $fetch<Post[]>('https://jsonplaceholder.typicode.com/posts')
			posts.value = data
		} catch (error) {
			console.error('データの取得に失敗しました:', error)
		} finally {
			loading.value = false
		}
	}

	// 1. map - データの変換・表示
	const mappedPosts = computed(() => {
		return posts.value.map((post) => ({
			...post,
			uppercaseTitle: post.title.toUpperCase(),
		}))
	})

	// 2. filter - データの絞り込み
	const getFilteredPosts = (userId: number | null) => {
		if (userId === null) {
			return posts.value
		}
		return posts.value.filter((post) => post.userId === userId)
	}

	// 3. reduce - 集計
	const getUserPostCounts = computed(() => {
		return posts.value.reduce((acc, post) => {
			const userId = post.userId
			acc[userId] = (acc[userId] || 0) + 1
			return acc
		}, {} as Record<number, number>)
	})

	// 4. find - 特定のデータを検索
	const findPostById = (id: number | null) => {
		if (id === null) {
			return null
		}
		return posts.value.find((post) => post.id === id) || null
	}

	// 5. ソート - データの並び替え
	const getSortedPosts = (
		sortBy: 'id' | 'title' | 'userId',
		sortOrder: 'asc' | 'desc'
	) => {
		const sorted = [...posts.value]
		sorted.sort((a, b) => {
			let aValue: string | number
			let bValue: string | number

			if (sortBy === 'id') {
				aValue = a.id
				bValue = b.id
			} else if (sortBy === 'title') {
				aValue = a.title
				bValue = b.title
			} else {
				aValue = a.userId
				bValue = b.userId
			}

			if (aValue < bValue) {
				return sortOrder === 'asc' ? -1 : 1
			}
			if (aValue > bValue) {
				return sortOrder === 'asc' ? 1 : -1
			}
			return 0
		})
		return sorted
	}

	// 6. ページネーション - データの分割表示
	const getPaginatedPosts = (currentPage: number, itemsPerPage: number) => {
		const startIndex = (currentPage - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		return posts.value.slice(startIndex, endIndex)
	}

	const getTotalPages = (itemsPerPage: number) => {
		return Math.ceil(posts.value.length / itemsPerPage)
	}

	// 7. データの追加・削除・更新
	const addPost = (title: string, userId: number) => {
		if (!title || !userId) {
			return false
		}
		const maxId = posts.value.length > 0 ? Math.max(...posts.value.map((p) => p.id)) : 0
		const newId = maxId + 1
		posts.value.push({
			id: newId,
			title,
			body: '',
			userId,
		})
		return true
	}

	const updatePost = (id: number, title: string) => {
		if (!id || !title) {
			return false
		}
		const index = posts.value.findIndex((p) => p.id === id)
		if (index !== -1) {
			posts.value[index].title = title
			return true
		}
		return false
	}

	const deletePostById = (id: number) => {
		if (!id) {
			return false
		}
		const index = posts.value.findIndex((p) => p.id === id)
		if (index !== -1) {
			posts.value.splice(index, 1)
			return true
		}
		return false
	}

	return {
		// 状態
		posts: readonly(posts),
		loading: readonly(loading),
		// メソッド
		fetchPosts,
		// 配列操作
		mappedPosts,
		getFilteredPosts,
		getUserPostCounts,
		findPostById,
		getSortedPosts,
		getPaginatedPosts,
		getTotalPages,
		// CRUD操作
		addPost,
		updatePost,
		deletePostById,
	}
}

