// composables/async-await/p1/useSequentialData.ts
import type { Post, User, SequentialData } from '~/types/async-await/p1/api'

export const useSequentialData = () => {
	const loading = ref(false)
	const data = ref<SequentialData | null>(null)
	const error = ref<string | null>(null)

	const fetchSequentially = async () => {
		data.value = null
		error.value = null
		loading.value = true

		const startTime = Date.now()

		try {
			const postRes = await fetch(
				'https://jsonplaceholder.typicode.com/posts/1'
			)
			if (!postRes.ok) throw new Error('投稿の取得に失敗しました')
			const post = (await postRes.json()) as Post

			const userRes = await fetch(
				'https://jsonplaceholder.typicode.com/users/1'
			)
			if (!userRes.ok) throw new Error('ユーザーの取得に失敗しました')
			const user = (await userRes.json()) as User

			const duration = Date.now() - startTime
			data.value = { post, user, duration }
		} catch (err) {
			error.value = err instanceof Error ? err.message : '不明なエラー'
			console.error('順次処理エラー:', err)
		} finally {
			loading.value = false
		}
	}

	return {
		loading,
		data,
		error,
		fetchSequentially,
	}
}

