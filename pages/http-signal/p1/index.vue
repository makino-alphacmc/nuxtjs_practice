<template>
	<div class="min-h-screen bg-neutral-900 p-8">
		<div class="max-w-7xl mx-auto space-y-6">
			<h1 class="text-3xl font-bold text-neutral-100 mb-8">
				API連携（HTTP通信）の練習
			</h1>

			<!-- エラー表示 -->
			<div
				v-if="error"
				class="p-4 bg-red-950/20 border border-red-800 rounded-lg"
			>
				<p class="text-red-400 font-medium">エラーが発生しました</p>
				<p class="text-red-300 text-sm mt-1">{{ error.message }}</p>
			</div>

			<!-- セクション1: GET - 投稿一覧取得 -->
			<PostList
				:posts="posts"
				:loading="loading"
				@fetch="handleFetchPosts"
				@edit="selectPostForEdit"
				@delete="handleDeletePost"
				class="mb-6"
			/>

			<!-- セクション2: POST - 新規投稿作成 -->
			<PostCreateForm
				:loading="loading"
				@create="handleCreatePost"
				class="mb-6"
			/>

			<!-- セクション3: PUT - 投稿更新 -->
			<PostEditForm
				:editing-post="editingPost"
				:loading="loading"
				@update="handleUpdatePost"
				@cancel="cancelEdit"
				class="mb-6"
			/>

			<!-- セクション4: DELETE - 投稿削除 -->
			<PostDeleteInfo />
		</div>
	</div>
</template>

<script setup lang="ts">
// 実務で必須の 4 つの概念: 明示的なインポート（依存明確化）
// Composables を明示的にインポート
import { useHttpPosts } from '~/composables/http-signal/p1/useHttpPosts'

// Components を明示的にインポート
import PostList from '~/components/http-signal/p1/PostList.vue'
import PostCreateForm from '~/components/http-signal/p1/PostCreateForm.vue'
import PostEditForm from '~/components/http-signal/p1/PostEditForm.vue'
import PostDeleteInfo from '~/components/http-signal/p1/PostDeleteInfo.vue'

// 型定義を明示的にインポート
import type {
	Post,
	CreatePostRequest,
	UpdatePostRequest,
} from '~/types/http-signal/p1/api'

// HTTP通信のcomposableを使用
const {
	posts,
	loading,
	error,
	fetchPosts,
	createPost,
	updatePost,
	deletePost,
} = useHttpPosts()

// 編集中の投稿の状態
const editingPost = ref<UpdatePostRequest | null>(null)

/**
 * GET: 投稿一覧を取得
 */
const handleFetchPosts = async () => {
	const result = await fetchPosts()
	if (result.success) {
		console.log('投稿一覧の取得に成功しました', result.data)
	}
}

/**
 * POST: 新規投稿を作成
 */
const handleCreatePost = async (postData: CreatePostRequest) => {
	const result = await createPost(postData)
	if (result.success) {
		console.log('投稿の作成に成功しました', result.data)
		alert('投稿を作成しました！')
	}
}

/**
 * PUT: 投稿を更新するために選択
 */
const selectPostForEdit = (post: Post) => {
	editingPost.value = {
		id: post.id,
		title: post.title,
		body: post.body,
		userId: post.userId,
	}
	// 編集セクションまでスクロール
	nextTick(() => {
		const editSection = document.querySelector('[data-edit-section]')
		editSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	})
}

/**
 * PUT: 投稿を更新
 */
const handleUpdatePost = async () => {
	if (!editingPost.value) return

	if (!editingPost.value.title || !editingPost.value.body) {
		alert('タイトルと本文を入力してください')
		return
	}

	const result = await updatePost(editingPost.value)
	if (result.success) {
		console.log('投稿の更新に成功しました', result.data)
		editingPost.value = null
		alert('投稿を更新しました！')
	}
}

/**
 * 編集をキャンセル
 */
const cancelEdit = () => {
	editingPost.value = null
}

/**
 * DELETE: 投稿を削除
 */
const handleDeletePost = async (id: number) => {
	if (!confirm(`投稿ID ${id} を削除してもよろしいですか？`)) {
		return
	}

	const result = await deletePost(id)
	if (result.success) {
		console.log('投稿の削除に成功しました')
		alert('投稿を削除しました！')
	}
}

// ページ読み込み時に自動で一覧を取得
onMounted(() => {
	handleFetchPosts()
})
</script>

