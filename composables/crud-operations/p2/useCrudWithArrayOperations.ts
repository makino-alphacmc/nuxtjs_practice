import type { Post } from '~/types/crud-operations/p2/api'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

export const useCrudWithArrayOperations = () => {
	// 投稿一覧の状態管理
	const posts = useState<Post[]>('crud-operations-p1-posts', () => [])
	const loading = useState<boolean>('crud-operations-p1-loading', () => false)
	const error = useState<Error | null>('crud-operations-p1-error', () => null)

	/**
	 * GET: 投稿一覧を取得
	 */
	const fetchPosts = async () => {
		loading.value = true
		error.value = null
		try {
			const data = await $fetch<Post[]>(BASE_URL)
			posts.value = data
			// currentPage.value = 1 // データ取得後は1ページ目に戻す
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

	return {
		posts: readonly(posts),
		loading: readonly(loading),
		error: readonly(error),
		fetchPosts,
	}
}
