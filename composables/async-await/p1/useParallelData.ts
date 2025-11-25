// composables/async-await/p1/useParallelData.ts
import type { Post, User, Comment, ParallelData } from '~/types/async-await/p1/api'

export const useParallelData = () => {
	const loading = ref(false)
	const data = ref<ParallelData | null>(null)
	const error = ref<string | null>(null)

	const fetchMultipleData = async () => {
		data.value = null
		error.value = null
		loading.value = true

		const startTime = Date.now()

		try {
			const [postRes, userRes, commentRes] = await Promise.all([
				fetch('https://jsonplaceholder.typicode.com/posts/1'),
				fetch('https://jsonplaceholder.typicode.com/users/1'),
				fetch('https://jsonplaceholder.typicode.com/comments/1'),
			])

			if (!postRes.ok || !userRes.ok || !commentRes.ok) {
				throw new Error('一部のリクエストが失敗しました')
			}

			const [post, user, comment] = await Promise.all([
				postRes.json() as Promise<Post>,
				userRes.json() as Promise<User>,
				commentRes.json() as Promise<Comment>,
			])

			const duration = Date.now() - startTime
			data.value = { post, user, comment, duration }
		} catch (err) {
			error.value = err instanceof Error ? err.message : '不明なエラー'
			console.error('並列処理エラー:', err)
		} finally {
			loading.value = false
		}
	}

	return {
		loading,
		data,
		error,
		fetchMultipleData,
	}
}

