<template>
	<div class="min-h-screen bg-neutral-900 p-8">
		<div class="max-w-7xl mx-auto">
			<h1 class="text-3xl font-bold text-neutral-100 mb-8">
				非同期処理の練習 - 業務システム風UI
			</h1>

			<!-- セクション1: 基本的なAPI通信（useFetch） -->
			<PostList
				:posts="posts"
				:posts-pending="postsPending"
				:posts-error="postsError"
				class="mb-6"
			/>

			<!-- セクション2: 手動での非同期処理（async/await） -->
			<UserInfo
				:user="user"
				:loading="loading"
				:error="error"
				@fetch="fetchUser"
				class="mb-6"
			/>

			<!-- セクション3: Promise.all で複数データを並列取得 -->
			<ParallelDataCards
				:data="parallelData"
				:loading="parallelLoading"
				:error="parallelError"
				@fetch="fetchMultipleData"
				class="mb-6"
			/>

			<!-- セクション4: await を連続させた順次データ取得 -->
			<SequentialSteps
				:data="sequentialData"
				:loading="sequentialLoading"
				:error="sequentialError"
				@fetch="fetchSequentially"
				class="mb-6"
			/>

			<!-- セクション5: エラーハンドリングを徹底解説 -->
			<ErrorResultDisplay
				:result="errorHandlingResult"
				:loading="errorHandlingLoading"
				@fetch="fetchWithDetailedErrorHandling"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
// セクション1: useFetch
const { posts, postsPending, postsError } = usePosts()

// セクション2: async/await + try/catch
const { loading, user, error, fetchUser } = useUser(1)

// セクション3: Promise.all
const {
	loading: parallelLoading,
	data: parallelData,
	error: parallelError,
	fetchMultipleData,
} = useParallelData()

// セクション4: Sequential await
const {
	loading: sequentialLoading,
	data: sequentialData,
	error: sequentialError,
	fetchSequentially,
} = useSequentialData()

// セクション5: Error Handling
const {
	loading: errorHandlingLoading,
	result: errorHandlingResult,
	fetchWithDetailedErrorHandling,
} = useErrorHandling()
</script>
