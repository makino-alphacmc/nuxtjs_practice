<template>
  <div class="min-h-screen bg-neutral-900 p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <header class="space-y-3">
        <p class="text-sm uppercase tracking-[0.3em] text-primary-300">Practice 5</p>
        <h1 class="text-3xl font-bold text-neutral-100">入力フォーム処理の基礎をマスターする</h1>
        <p class="text-neutral-400">
          v-model の双方向データバインディング、リアルタイムバリデーション、エラー表示、送信処理、リセット処理までを一気に体験します。
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-2">
        <ContactFormCard
          :form="form"
          :errors="errors"
          :loading="isSubmitting"
          @update-field="handleFieldUpdate"
          @submit="handleSubmit"
          @reset="resetForm"
        />

        <div class="space-y-4">
          <SubmitResultCard :result="submitResult" :errors="errors" :loading="isSubmitting" />

          <UCard class="bg-neutral-950">
            <template #header>
              <h2 class="text-lg font-semibold text-neutral-100">このセクションで押さえる 5 つの要素</h2>
            </template>
            <ol class="list-decimal list-inside space-y-2 text-sm text-neutral-300">
              <li><strong>v-model</strong> でフォームの状態を管理</li>
              <li><strong>バリデーション</strong> でルールを定義・判定</li>
              <li><strong>エラー表示</strong> でユーザーに即時フィードバック</li>
              <li><strong>サブミット処理</strong> で API 連携を想定した非同期処理</li>
              <li><strong>フォームリセット</strong> で状態を初期化し、再送信できるようにする</li>
            </ol>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 実務で必須の 4 つの概念: 明示的なインポート（依存明確化）
// Composables を明示的にインポート
import { useContactForm } from '~/composables/form-handling/p1/useContactForm'

// Components を明示的にインポート
import ContactFormCard from '~/components/form-handling/p1/ContactFormCard.vue'
import SubmitResultCard from '~/components/form-handling/p1/SubmitResultCard.vue'

// 型定義を明示的にインポート
import type { ContactForm } from '~/types/form-handling/p1/form'

const { form, errors, isSubmitting, submitResult, updateField, submitForm, resetForm } = useContactForm()

const handleFieldUpdate = ({ field, value }: { field: keyof ContactForm; value: ContactForm[keyof ContactForm] }) => {
  updateField(field, value)
}

const handleSubmit = async () => {
  await submitForm()
}
</script>
