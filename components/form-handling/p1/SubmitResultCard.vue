<!-- components/form-handling/p1/SubmitResultCard.vue -->
<template>
  <UCard class="bg-neutral-950">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm uppercase tracking-wide text-primary-300">Result</p>
          <h2 class="text-xl font-semibold text-neutral-100">送信結果 / デバッグパネル</h2>
        </div>
        <UBadge v-if="statusLabel" :color="statusColor">{{ statusLabel }}</UBadge>
      </div>
    </template>

    <div class="space-y-4">
      <div v-if="!result" class="text-sm text-neutral-500">
        送信結果はまだありません。フォームを送信するとここに結果が表示されます。
      </div>

      <div v-else class="space-y-2">
        <p class="text-sm text-neutral-400">送信日時: {{ formatDate(result.timestamp) }}</p>
        <pre class="rounded-lg bg-neutral-900 p-4 text-xs text-neutral-200 overflow-auto">
{{ formattedPayload }}
        </pre>
      </div>

      <div class="rounded-lg bg-neutral-900 p-4 space-y-2">
        <p class="text-sm text-neutral-400">リアルタイム検証</p>
        <ul class="text-sm list-disc list-inside">
          <li v-if="errors.length === 0" class="text-emerald-400">エラーはありません 🎉</li>
          <li v-for="error in errors" :key="error.field" class="text-red-300">
            {{ fieldLabels[error.field] }}: {{ error.message }}
          </li>
        </ul>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// 型定義を明示的にインポート
import type { FormValidationError, SubmitResult, ContactForm } from '~/types/form-handling/p1/form'

// Props の型定義
interface Props {
	result: SubmitResult | null
	errors: FormValidationError[]
	loading: boolean
}

// Props を定義
const props = withDefaults(defineProps<Props>(), {
	result: null,
	errors: () => [],
	loading: false,
})

// フィールドラベル
const fieldLabels: Record<keyof ContactForm, string> = {
	name: '氏名',
	email: 'メールアドレス',
	topic: 'お問い合わせ種別',
	message: '本文',
	agree: '同意',
}

// ステータスラベル
const statusLabel = computed(() => {
	if (props.loading) return '送信中'
	if (props.result?.success) return '送信完了'
	if (props.errors.length > 0) return '入力不備'
	return null
})

// ステータスカラー
const statusColor = computed(() => {
	if (props.loading) return 'yellow'
	if (props.result?.success) return 'green'
	if (props.errors.length > 0) return 'red'
	return 'gray'
})

// フォーマットされたペイロード
const formattedPayload = computed(() => {
	if (!props.result?.payload) return ''
	return JSON.stringify(props.result.payload, null, 2)
})

// 日付をフォーマットする関数
const formatDate = (iso: string) => {
	return new Date(iso).toLocaleString('ja-JP', {
		hour12: false,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	})
}
</script>
