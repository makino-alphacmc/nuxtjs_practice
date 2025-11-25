// composables/crud/p1/useHttpPosts.ts
import type { Post, CreatePostRequest, UpdatePostRequest } from '~/types/crud/p1/api'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

/**
 * HTTP通信の基本操作（GET / POST / PUT / DELETE）を実装したcomposable
 * 
 * このcomposableでは、$fetchを使用して手動でHTTPリクエストを送信します。
 * useFetchとは異なり、より細かい制御が可能です。
 */
export const useHttpPosts = () => {
	// 投稿一覧の状態管理
	const posts = useState<Post[]>('http-posts', () => [])
	const loading = useState<boolean>('http-posts-loading', () => false)
	const error = useState<Error | null>('http-posts-error', () => null)

	/**
	 * GET: 投稿一覧を取得
	 */
	const fetchPosts = async () => {
		loading.value = true
		error.value = null
		try {
			const data = await $fetch<Post[]>(BASE_URL)
			posts.value = data
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
	 * GET: 特定の投稿を取得
	 */
	const fetchPostById = async (id: number) => {
		loading.value = true
		error.value = null
		try {
			const data = await $fetch<Post>(`${BASE_URL}/${id}`)
			return { success: true, data }
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error(`投稿ID ${id} の取得に失敗しました`)
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
			return { success: true }
		} catch (err) {
			const errorMessage = err instanceof Error ? err : new Error('投稿の削除に失敗しました')
			error.value = errorMessage
			return { success: false, error: errorMessage }
		} finally {
			loading.value = false
		}
	}

	return {
		// 状態
		posts: readonly(posts),
		loading: readonly(loading),
		error: readonly(error),
		// メソッド
		fetchPosts,
		fetchPostById,
		createPost,
		updatePost,
		deletePost,
	}
}

