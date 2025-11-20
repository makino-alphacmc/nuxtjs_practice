<template>
	<div class="min-h-screen bg-neutral-900 p-8">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-3xl font-bold text-neutral-100 mb-8">非同期処理の練習</h1>

			<!-- セクション1: 基本的なAPI通信（useFetch） -->
			<UCard class="mb-6 bg-neutral-950">
				<template #header>
					<h2 class="text-xl font-semibold text-neutral-100">
						1. 基本的なAPI通信（useFetch）
					</h2>
				</template>
				<div class="space-y-4">
					<!-- ローディング状態 -->
					<div v-if="postsPending" class="text-neutral-400">読み込み中...</div>

					<!-- エラー状態 -->
					<div v-if="postsError" class="text-red-400">
						エラー: {{ postsError.message }}
					</div>

					<!-- データ表示 -->
					<div v-if="posts && !postsPending" class="space-y-2">
						<p class="text-neutral-300">取得した投稿数: {{ posts.length }}件</p>
						<div class="max-h-40 overflow-y-auto">
							<div
								v-for="post in posts.slice(0, 3)"
								:key="post.id"
								class="p-3 bg-neutral-900 rounded-lg mb-2"
							>
								<p class="text-neutral-200 font-medium">{{ post.title }}</p>
								<p class="text-neutral-400 text-sm">{{ post.body }}</p>
							</div>
						</div>
					</div>
				</div>
			</UCard>

			<!-- セクション2: 手動での非同期処理（async/await） -->
			<UCard class="mb-6 bg-neutral-950">
				<template #header>
					<h2 class="text-xl font-semibold text-neutral-100">
						2. 手動での非同期処理（async/await + try/catch）
					</h2>
				</template>
				<div class="space-y-4">
					<UButton
						@click="fetchUserManually"
						:loading="manualLoading"
						color="primary"
					>
						ユーザー情報を取得
					</UButton>

					<div
						v-if="manualError"
						class="text-red-400 p-3 bg-red-950/20 rounded"
					>
						エラー: {{ manualError }}
					</div>

					<div
						v-if="manualUser && !manualLoading"
						class="p-4 bg-neutral-900 rounded-lg"
					>
						<p class="text-neutral-200 font-medium">{{ manualUser.name }}</p>
						<p class="text-neutral-400 text-sm">{{ manualUser.email }}</p>
						<p class="text-neutral-400 text-sm">{{ manualUser.phone }}</p>
					</div>
				</div>
			</UCard>

			<!-- セクション3: Promise.all（並列処理） -->
			<UCard class="mb-6 bg-neutral-950">
				<template #header>
					<h2 class="text-xl font-semibold text-neutral-100">
						3. Promise.all（並列処理）
					</h2>
				</template>
				<div class="space-y-4">
					<UButton
						@click="fetchMultipleData"
						:loading="parallelLoading"
						color="primary"
					>
						複数のデータを並列取得
					</UButton>

					<div
						v-if="parallelError"
						class="text-red-400 p-3 bg-red-950/20 rounded"
					>
						エラー: {{ parallelError }}
					</div>

					<div v-if="parallelData && !parallelLoading" class="space-y-3">
						<div class="p-4 bg-neutral-900 rounded-lg">
							<p class="text-neutral-200 font-medium mb-2">投稿 #1</p>
							<p class="text-neutral-400 text-sm">
								{{ parallelData.post?.title }}
							</p>
						</div>
						<div class="p-4 bg-neutral-900 rounded-lg">
							<p class="text-neutral-200 font-medium mb-2">ユーザー #1</p>
							<p class="text-neutral-400 text-sm">
								{{ parallelData.user?.name }}
							</p>
						</div>
						<div class="p-4 bg-neutral-900 rounded-lg">
							<p class="text-neutral-200 font-medium mb-2">コメント #1</p>
							<p class="text-neutral-400 text-sm">
								{{ parallelData.comment?.body }}
							</p>
						</div>
						<p class="text-neutral-300 text-sm mt-2">
							取得時間: {{ parallelData.duration }}ms
						</p>
					</div>
				</div>
			</UCard>

			<!-- セクション4: 順次処理（await の連続） -->
			<UCard class="mb-6 bg-neutral-950">
				<template #header>
					<h2 class="text-xl font-semibold text-neutral-100">
						4. 順次処理（await の連続）
					</h2>
				</template>
				<div class="space-y-4">
					<UButton
						@click="fetchSequentially"
						:loading="sequentialLoading"
						color="primary"
					>
						データを順次取得
					</UButton>

					<div
						v-if="sequentialError"
						class="text-red-400 p-3 bg-red-950/20 rounded"
					>
						エラー: {{ sequentialError }}
					</div>

					<div v-if="sequentialData && !sequentialLoading" class="space-y-3">
						<div class="p-4 bg-neutral-900 rounded-lg">
							<p class="text-neutral-200 font-medium mb-2">
								ステップ1: 投稿 #1
							</p>
							<p class="text-neutral-400 text-sm">
								{{ sequentialData.post?.title }}
							</p>
						</div>
						<div class="p-4 bg-neutral-900 rounded-lg">
							<p class="text-neutral-200 font-medium mb-2">
								ステップ2: ユーザー #1
							</p>
							<p class="text-neutral-400 text-sm">
								{{ sequentialData.user?.name }}
							</p>
						</div>
						<p class="text-neutral-300 text-sm mt-2">
							合計時間: {{ sequentialData.duration }}ms
						</p>
					</div>
				</div>
			</UCard>

			<!-- セクション5: エラーハンドリングの詳細 -->
			<UCard class="mb-6 bg-neutral-950">
				<template #header>
					<h2 class="text-xl font-semibold text-neutral-100">
						5. エラーハンドリング（詳細版）
					</h2>
				</template>
				<div class="space-y-4">
					<UButton
						@click="fetchWithDetailedErrorHandling"
						:loading="errorHandlingLoading"
						color="primary"
					>
						エラーハンドリングをテスト
					</UButton>

					<div v-if="errorHandlingResult" class="space-y-2">
						<div
							v-if="errorHandlingResult.success"
							class="p-4 bg-green-950/20 rounded-lg border border-green-800"
						>
							<p class="text-green-400 font-medium">✓ 成功</p>
							<p class="text-neutral-300 text-sm mt-1">
								{{ errorHandlingResult.message }}
							</p>
						</div>
						<div
							v-else
							class="p-4 bg-red-950/20 rounded-lg border border-red-800"
						>
							<p class="text-red-400 font-medium">✗ エラー</p>
							<p class="text-neutral-300 text-sm mt-1">
								{{ errorHandlingResult.message }}
							</p>
							<p class="text-neutral-400 text-xs mt-1">
								ステータス: {{ errorHandlingResult.status }}
							</p>
						</div>
					</div>
				</div>
			</UCard>
		</div>
	</div>
</template>

<script setup lang="ts">
// ============================================================
// セクション1: useFetch を使った基本的なAPI通信
// ============================================================
// TODO: todo.mdのセクション1に沿って実装してください
// useFetch は Nuxt の便利な composable で、自動的にローディング状態と
// エラー状態を管理してくれます。
const posts = ref<any>(null)
const postsPending = ref(false)
const postsError = ref<any>(null)

// ============================================================
// セクション2: 手動での非同期処理（async/await + try/catch）
// ============================================================
// TODO: todo.mdのセクション2に沿って実装してください
// 手動で fetch を使う場合のパターンです。
// ローディング状態とエラー状態を自分で管理する必要があります。
const manualLoading = ref(false)
const manualUser = ref<any>(null)
const manualError = ref<string | null>(null)

const fetchUserManually = async () => {
	// TODO: ここに実装を追加してください
}

// ============================================================
// セクション3: Promise.all（並列処理）
// ============================================================
// TODO: todo.mdのセクション3に沿って実装してください
// 複数の API を同時に呼び出す場合のパターンです。
// すべての Promise が完了するまで待ちます。
const parallelLoading = ref(false)
const parallelData = ref<any>(null)
const parallelError = ref<string | null>(null)

const fetchMultipleData = async () => {
	// TODO: ここに実装を追加してください
}

// ============================================================
// セクション4: 順次処理（await の連続）
// ============================================================
// TODO: todo.mdのセクション4に沿って実装してください
// 前の処理が完了してから次の処理を実行するパターンです。
// Promise.all と違い、順番に実行されるため時間がかかります。
const sequentialLoading = ref(false)
const sequentialData = ref<any>(null)
const sequentialError = ref<string | null>(null)

const fetchSequentially = async () => {
	// TODO: ここに実装を追加してください
}

// ============================================================
// セクション5: エラーハンドリング（詳細版）
// ============================================================
// TODO: todo.mdのセクション5に沿って実装してください
// より詳細なエラーハンドリングのパターンです。
// HTTP ステータスコードやエラーメッセージを適切に処理します。
const errorHandlingLoading = ref(false)
const errorHandlingResult = ref<any>(null)

const fetchWithDetailedErrorHandling = async () => {
	// TODO: ここに実装を追加してください
}
</script>
