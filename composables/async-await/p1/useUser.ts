// composables/async-await/p1/useUser.ts
import type { User } from '~/types/async-await/p1/api'

export const useUser = (userId: number = 1) => {
	const loading = ref(false)
	const user = ref<User | null>(null)
	const error = ref<string | null>(null)

	const fetchUser = async () => {
		user.value = null
		error.value = null
		loading.value = true

		try {
			const response = await fetch(
				`https://jsonplaceholder.typicode.com/users/${userId}`
			)
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			const data = (await response.json()) as User
			user.value = data
		} catch (err) {
			error.value = err instanceof Error ? err.message : '不明なエラー'
			console.error('エラー:', err)
		} finally {
			loading.value = false
		}
	}

	return {
		loading,
		user,
		error,
		fetchUser,
	}
}

