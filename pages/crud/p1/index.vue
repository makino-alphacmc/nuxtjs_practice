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
			<UCard class="bg-neutral-950">
				<template #header>
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-semibold text-neutral-100">
							1. GET - 投稿一覧を取得
						</h2>
						<UButton
							:loading="loading"
							@click="handleFetchPosts"
							color="primary"
						>
							一覧を取得
						</UButton>
					</div>
				</template>
				<div class="space-y-4">
					<div v-if="loading" class="text-center py-8 text-neutral-400">
						<div
							class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-400"
						></div>
						<p class="mt-2">データを読み込み中...</p>
					</div>
					<div v-else-if="posts && posts.length > 0" class="overflow-x-auto">
						<table class="w-full border-collapse">
							<thead>
								<tr class="bg-neutral-800 border-b border-neutral-700">
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										ID
									</th>
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										タイトル
									</th>
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										本文（抜粋）
									</th>
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										ユーザーID
									</th>
									<th
										class="px-4 py-3 text-left text-sm font-semibold text-neutral-200"
									>
										操作
									</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="post in posts.slice(0, 10)"
									:key="post.id"
									class="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
								>
									<td class="px-4 py-3 text-sm text-neutral-300 font-mono">
										{{ post.id }}
									</td>
									<td class="px-4 py-3 text-sm text-neutral-200 font-medium">
										{{ post.title }}
									</td>
									<td
										class="px-4 py-3 text-sm text-neutral-400 max-w-md truncate"
									>
										{{ post.body }}
									</td>
									<td class="px-4 py-3 text-sm text-neutral-300">
										{{ post.userId }}
									</td>
									<td class="px-4 py-3">
										<div class="flex gap-2">
											<UButton
												size="xs"
												color="blue"
												@click="selectPostForEdit(post)"
											>
												編集
											</UButton>
											<UButton
												size="xs"
												color="red"
												@click="handleDeletePost(post.id)"
											>
												削除
											</UButton>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						<div class="mt-4 text-sm text-neutral-400 text-center">
							表示中: 1-10件 / 全{{ posts?.length || 0 }}件
						</div>
					</div>
					<div v-else class="text-center py-8 text-neutral-400">
						データがありません。「一覧を取得」ボタンをクリックしてください。
					</div>
				</div>
			</UCard>

			<!-- セクション2: POST - 新規投稿作成 -->
			<UCard class="bg-neutral-950">
				<template #header>
					<h2 class="text-xl font-semibold text-neutral-100">
						2. POST - 新規投稿を作成
					</h2>
				</template>
				<div class="space-y-4">
					<UInput
						v-model="newPost.title"
						placeholder="タイトルを入力"
						label="タイトル"
						class="w-full"
					/>
					<UTextarea
						v-model="newPost.body"
						placeholder="本文を入力"
						label="本文"
						:rows="4"
						class="w-full"
					/>
					<UInput
						v-model.number="newPost.userId"
						type="number"
						placeholder="ユーザーID（1-10）"
						label="ユーザーID"
						class="w-full"
					/>
					<UButton
						:loading="loading"
						@click="handleCreatePost"
						color="green"
						block
					>
						投稿を作成
					</UButton>
				</div>
			</UCard>

			<!-- セクション3: PUT - 投稿更新 -->
			<UCard class="bg-neutral-950" data-edit-section>
				<template #header>
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-semibold text-neutral-100">
							3. PUT - 投稿を更新
						</h2>
						<UButton
							v-if="editingPost"
							size="xs"
							color="gray"
							@click="cancelEdit"
						>
							キャンセル
						</UButton>
					</div>
				</template>
				<div v-if="editingPost" class="space-y-4">
					<p class="text-sm text-neutral-400">
						編集中の投稿ID: {{ editingPost.id }}
					</p>
					<UInput
						v-model="editingPost.title"
						placeholder="タイトルを入力"
						label="タイトル"
						class="w-full"
					/>
					<UTextarea
						v-model="editingPost.body"
						placeholder="本文を入力"
						label="本文"
						:rows="4"
						class="w-full"
					/>
					<UInput
						v-model.number="editingPost.userId"
						type="number"
						placeholder="ユーザーID"
						label="ユーザーID"
						class="w-full"
					/>
					<UButton
						:loading="loading"
						@click="handleUpdatePost"
						color="blue"
						block
					>
						投稿を更新
					</UButton>
				</div>
				<div v-else class="text-center py-8 text-neutral-400">
					一覧から「編集」ボタンをクリックして投稿を選択してください。
				</div>
			</UCard>

			<!-- セクション4: DELETE - 投稿削除 -->
			<UCard class="bg-neutral-950">
				<template #header>
					<h2 class="text-xl font-semibold text-neutral-100">
						4. DELETE - 投稿を削除
					</h2>
				</template>
				<div class="space-y-4">
					<p class="text-sm text-neutral-400">
						一覧から「削除」ボタンをクリックすると、投稿が削除されます。
					</p>
					<p class="text-xs text-neutral-500">
						※
						JSONPlaceholderでは実際には削除されませんが、UI上では反映されます。
					</p>
				</div>
			</UCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import type {
	Post,
	CreatePostRequest,
	UpdatePostRequest,
} from '~/types/2_crud/p1/api'

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

// 新規投稿フォームの状態
const newPost = ref<CreatePostRequest>({
	title: '',
	body: '',
	userId: 1,
})

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
const handleCreatePost = async () => {
	if (!newPost.value.title || !newPost.value.body) {
		alert('タイトルと本文を入力してください')
		return
	}

	const result = await createPost(newPost.value)
	if (result.success) {
		console.log('投稿の作成に成功しました', result.data)
		// フォームをリセット
		newPost.value = {
			title: '',
			body: '',
			userId: 1,
		}
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
