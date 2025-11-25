// composables/async-await/p1/useErrorHandling.ts
import type { Post, ErrorHandlingResult } from '~/types/async-await/p1/api'

export const useErrorHandling = () => {
	const loading = ref(false)
	const result = ref<ErrorHandlingResult | null>(null)

	const fetchWithDetailedErrorHandling = async (postId: number = 99999) => {
		result.value = null
		loading.value = true

		try {
			const response = await fetch(
				`https://jsonplaceholder.typicode.com/posts/${postId}`
			)

			if (response.status === 404) {
				result.value = {
					success: false,
					message: 'リソースが見つかりませんでした（404）',
					status: 404,
				}
				return
			}

			if (response.status >= 500) {
				result.value = {
					success: false,
					message: 'サーバーエラーが発生しました（500番台）',
					status: response.status,
				}
				return
			}

			if (!response.ok) {
				result.value = {
					success: false,
					message: `HTTP エラー: ${response.status}`,
					status: response.status,
				}
				return
			}

			const data = (await response.json()) as Post
			result.value = {
				success: true,
				message: 'データの取得に成功しました',
				data,
			}
		} catch (error) {
			if (error instanceof TypeError && error.message.includes('fetch')) {
				result.value = {
					success: false,
					message: 'ネットワークエラー: インターネット接続を確認してください',
					status: 'NETWORK_ERROR',
				}
			} else {
				result.value = {
					success: false,
					message: error instanceof Error ? error.message : '不明なエラー',
					status: 'UNKNOWN_ERROR',
				}
			}
			console.error('詳細エラー情報:', error)
		} finally {
			loading.value = false
		}
	}

	return {
		loading,
		result,
		fetchWithDetailedErrorHandling,
	}
}

