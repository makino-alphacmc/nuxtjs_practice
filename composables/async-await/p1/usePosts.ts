// composables/async-await/p1/usePosts.ts
import type { Post } from '~/types/async-await/p1/api'

export const usePosts = () => {
	const {
		data: posts,
		pending: postsPending,
		error: postsError,
		refresh: refreshPosts,
	} = useFetch<Post[]>('https://jsonplaceholder.typicode.com/posts')

	// 投稿を ID で検索する関数
	const getPostById = (id: number) => {
		return posts.value?.find((post) => post.id === id)
	}

	// 投稿をユーザー ID でフィルタする関数
	const getPostsByUserId = (userId: number) => {
		return posts.value?.filter((post) => post.userId === userId) || []
	}

	return {
		posts,
		postsPending,
		postsError,
		refreshPosts,
		getPostById,
		getPostsByUserId,
	}
}

