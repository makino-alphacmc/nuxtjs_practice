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
// Composables を明示的にインポート
// 注: composables/async-await/p1/ のような深い階層では自動インポートが機能しないため、明示的にインポートします
import { usePosts } from '~/composables/async-await/p1/usePosts'
import { useUser } from '~/composables/async-await/p1/useUser'
import { useParallelData } from '~/composables/async-await/p1/useParallelData'
import { useSequentialData } from '~/composables/async-await/p1/useSequentialData'
import { useErrorHandling } from '~/composables/async-await/p1/useErrorHandling'

// Components を明示的にインポート
import PostList from '~/components/async-await/p1/PostList.vue'
import UserInfo from '~/components/async-await/p1/UserInfo.vue'
import ParallelDataCards from '~/components/async-await/p1/ParallelDataCards.vue'
import SequentialSteps from '~/components/async-await/p1/SequentialSteps.vue'
import ErrorResultDisplay from '~/components/async-await/p1/ErrorResultDisplay.vue'

// 型定義を明示的にインポート（必要に応じて使用）
// import type { Post, User, ParallelData, SequentialData, ErrorHandlingResult } from '~/types/async-await/p1/api'

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
