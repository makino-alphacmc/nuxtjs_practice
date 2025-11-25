// types/async-await/p1/api.ts

export interface Post {
	id: number
	title: string
	body: string
	userId: number
}

export interface User {
	id: number
	name: string
	username: string
	email: string
	phone?: string
	website?: string
	address?: {
		street: string
		city: string
		zipcode: string
	}
	company?: {
		name: string
		catchPhrase?: string
	}
}

export interface Comment {
	id: number
	name: string
	body: string
}

export interface ParallelData {
	post: Post
	user: User
	comment: Comment
	duration: number
}

export interface SequentialData {
	post: Post
	user: User
	duration: number
}

export type ErrorStatus = number | 'NETWORK_ERROR' | 'UNKNOWN_ERROR'

export interface ErrorHandlingResult {
	success: boolean
	message: string
	status: ErrorStatus
	data?: Post
}

