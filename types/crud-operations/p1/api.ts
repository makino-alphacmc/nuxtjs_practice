// types/crud-operations/p1/api.ts

export interface Post {
	id: number
	title: string
	body: string
	userId: number
}

export interface CreatePostRequest {
	title: string
	body: string
	userId: number
}

export interface UpdatePostRequest {
	id: number
	title: string
	body: string
	userId: number
}

export interface ApiResponse<T> {
	data: T | null
	error: Error | null
	loading: boolean
}

