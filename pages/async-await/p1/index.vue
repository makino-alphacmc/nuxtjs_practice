<template>
  <div class="min-h-screen bg-neutral-900 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-neutral-100 mb-8">
        非同期処理の練習
      </h1>

      <!-- セクション1: 基本的なAPI通信（useFetch） -->
      <UCard class="mb-6 bg-neutral-950">
        <template #header>
          <h2 class="text-xl font-semibold text-neutral-100">
            1. 基本的なAPI通信（useFetch）
          </h2>
        </template>
        <div class="space-y-4">
          <!-- ローディング状態 -->
          <div v-if="postsPending" class="text-neutral-400">
            読み込み中...
          </div>
          
          <!-- エラー状態 -->
          <div v-if="postsError" class="text-red-400">
            エラー: {{ postsError.message }}
          </div>
          
          <!-- データ表示 -->
          <div v-if="posts && !postsPending" class="space-y-2">
            <p class="text-neutral-300">
              取得した投稿数: {{ posts.length }}件
            </p>
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
          
          <div v-if="manualError" class="text-red-400 p-3 bg-red-950/20 rounded">
            エラー: {{ manualError }}
          </div>
          
          <div v-if="manualUser && !manualLoading" class="p-4 bg-neutral-900 rounded-lg">
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
          
          <div v-if="parallelError" class="text-red-400 p-3 bg-red-950/20 rounded">
            エラー: {{ parallelError }}
          </div>
          
          <div v-if="parallelData && !parallelLoading" class="space-y-3">
            <div class="p-4 bg-neutral-900 rounded-lg">
              <p class="text-neutral-200 font-medium mb-2">投稿 #1</p>
              <p class="text-neutral-400 text-sm">{{ parallelData.post?.title }}</p>
            </div>
            <div class="p-4 bg-neutral-900 rounded-lg">
              <p class="text-neutral-200 font-medium mb-2">ユーザー #1</p>
              <p class="text-neutral-400 text-sm">{{ parallelData.user?.name }}</p>
            </div>
            <div class="p-4 bg-neutral-900 rounded-lg">
              <p class="text-neutral-200 font-medium mb-2">コメント #1</p>
              <p class="text-neutral-400 text-sm">{{ parallelData.comment?.body }}</p>
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
          
          <div v-if="sequentialError" class="text-red-400 p-3 bg-red-950/20 rounded">
            エラー: {{ sequentialError }}
          </div>
          
          <div v-if="sequentialData && !sequentialLoading" class="space-y-3">
            <div class="p-4 bg-neutral-900 rounded-lg">
              <p class="text-neutral-200 font-medium mb-2">ステップ1: 投稿 #1</p>
              <p class="text-neutral-400 text-sm">{{ sequentialData.post?.title }}</p>
            </div>
            <div class="p-4 bg-neutral-900 rounded-lg">
              <p class="text-neutral-200 font-medium mb-2">ステップ2: ユーザー #1</p>
              <p class="text-neutral-400 text-sm">{{ sequentialData.user?.name }}</p>
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
// useFetch は Nuxt の便利な composable で、自動的にローディング状態と
// エラー状態を管理してくれます。
const {
  data: posts,
  pending: postsPending,
  error: postsError,
} = useFetch('https://jsonplaceholder.typicode.com/posts')

// ============================================================
// セクション2: 手動での非同期処理（async/await + try/catch）
// ============================================================
// 手動で fetch を使う場合のパターンです。
// ローディング状態とエラー状態を自分で管理する必要があります。
const manualLoading = ref(false)
const manualUser = ref<any>(null)
const manualError = ref<string | null>(null)

const fetchUserManually = async () => {
  // リセット
  manualUser.value = null
  manualError.value = null
  manualLoading.value = true

  try {
    // await で API のレスポンスを待つ
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1')
    
    // HTTP エラーチェック（404, 500 など）
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    // JSON をパース
    const data = await response.json()
    manualUser.value = data
  } catch (error) {
    // エラーをキャッチして表示
    manualError.value = error instanceof Error ? error.message : '不明なエラー'
    console.error('エラー:', error)
  } finally {
    // 成功・失敗に関わらずローディングを終了
    manualLoading.value = false
  }
}

// ============================================================
// セクション3: Promise.all（並列処理）
// ============================================================
// 複数の API を同時に呼び出す場合のパターンです。
// すべての Promise が完了するまで待ちます。
const parallelLoading = ref(false)
const parallelData = ref<any>(null)
const parallelError = ref<string | null>(null)

const fetchMultipleData = async () => {
  parallelData.value = null
  parallelError.value = null
  parallelLoading.value = true

  const startTime = Date.now()

  try {
    // Promise.all で複数の API を並列実行
    const [postRes, userRes, commentRes] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts/1'),
      fetch('https://jsonplaceholder.typicode.com/users/1'),
      fetch('https://jsonplaceholder.typicode.com/comments/1'),
    ])

    // すべてのレスポンスをチェック
    if (!postRes.ok || !userRes.ok || !commentRes.ok) {
      throw new Error('一部のリクエストが失敗しました')
    }

    // すべての JSON をパース
    const [post, user, comment] = await Promise.all([
      postRes.json(),
      userRes.json(),
      commentRes.json(),
    ])

    const duration = Date.now() - startTime

    parallelData.value = {
      post,
      user,
      comment,
      duration,
    }
  } catch (error) {
    parallelError.value = error instanceof Error ? error.message : '不明なエラー'
    console.error('並列処理エラー:', error)
  } finally {
    parallelLoading.value = false
  }
}

// ============================================================
// セクション4: 順次処理（await の連続）
// ============================================================
// 前の処理が完了してから次の処理を実行するパターンです。
// Promise.all と違い、順番に実行されるため時間がかかります。
const sequentialLoading = ref(false)
const sequentialData = ref<any>(null)
const sequentialError = ref<string | null>(null)

const fetchSequentially = async () => {
  sequentialData.value = null
  sequentialError.value = null
  sequentialLoading.value = true

  const startTime = Date.now()

  try {
    // 1つ目の API を実行して完了を待つ
    const postRes = await fetch('https://jsonplaceholder.typicode.com/posts/1')
    if (!postRes.ok) throw new Error('投稿の取得に失敗しました')
    const post = await postRes.json()

    // 2つ目の API を実行（1つ目が完了してから）
    const userRes = await fetch('https://jsonplaceholder.typicode.com/users/1')
    if (!userRes.ok) throw new Error('ユーザーの取得に失敗しました')
    const user = await userRes.json()

    const duration = Date.now() - startTime

    sequentialData.value = {
      post,
      user,
      duration,
    }
  } catch (error) {
    sequentialError.value = error instanceof Error ? error.message : '不明なエラー'
    console.error('順次処理エラー:', error)
  } finally {
    sequentialLoading.value = false
  }
}

// ============================================================
// セクション5: エラーハンドリング（詳細版）
// ============================================================
// より詳細なエラーハンドリングのパターンです。
// HTTP ステータスコードやエラーメッセージを適切に処理します。
const errorHandlingLoading = ref(false)
const errorHandlingResult = ref<any>(null)

const fetchWithDetailedErrorHandling = async () => {
  errorHandlingResult.value = null
  errorHandlingLoading.value = true

  try {
    // 存在しない ID を指定してエラーを発生させる
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/99999')

    // HTTP ステータスコードに応じた処理
    if (response.status === 404) {
      errorHandlingResult.value = {
        success: false,
        message: 'リソースが見つかりませんでした（404）',
        status: 404,
      }
      return
    }

    if (response.status >= 500) {
      errorHandlingResult.value = {
        success: false,
        message: 'サーバーエラーが発生しました（500番台）',
        status: response.status,
      }
      return
    }

    if (!response.ok) {
      errorHandlingResult.value = {
        success: false,
        message: `HTTP エラー: ${response.status}`,
        status: response.status,
      }
      return
    }

    const data = await response.json()
    errorHandlingResult.value = {
      success: true,
      message: 'データの取得に成功しました',
      data,
    }
  } catch (error) {
    // ネットワークエラーなどの場合
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorHandlingResult.value = {
        success: false,
        message: 'ネットワークエラー: インターネット接続を確認してください',
        status: 'NETWORK_ERROR',
      }
    } else {
      errorHandlingResult.value = {
        success: false,
        message: error instanceof Error ? error.message : '不明なエラー',
        status: 'UNKNOWN_ERROR',
      }
    }
  } finally {
    errorHandlingLoading.value = false
  }
}
</script>

