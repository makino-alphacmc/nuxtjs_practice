// composables/form-handling/p1/useContactForm.ts
import { reactive, ref } from 'vue'
import type { ContactForm, FormValidationError, SubmitResult } from '~/types/form-handling/p1/form'

const initialFormState = (): ContactForm => ({
  name: '',
  email: '',
  topic: 'question',
  message: '',
  agree: false,
})

const EMAIL_REGEX = /^[\w.!#$%&'*+/=?`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/

export const useContactForm = () => {
  const form = reactive<ContactForm>(initialFormState())
  const errors = ref<FormValidationError[]>([])
  const isSubmitting = ref(false)
  const submitResult = ref<SubmitResult | null>(null)

  const setFieldError = (field: keyof ContactForm, message: string | null) => {
    errors.value = errors.value.filter((error) => error.field !== field)
    if (message) {
      errors.value.push({ field, message })
    }
  }

  const validateField = (field: keyof ContactForm, value: ContactForm[keyof ContactForm]) => {
    switch (field) {
      case 'name':
        if (!value || String(value).trim().length < 2) {
          return '氏名は2文字以上で入力してください'
        }
        return null
      case 'email':
        if (!value || !EMAIL_REGEX.test(String(value))) {
          return '正しいメールアドレスを入力してください'
        }
        return null
      case 'topic':
        if (!value) {
          return 'お問い合わせ種別を選択してください'
        }
        return null
      case 'message':
        if (!value || String(value).trim().length < 10) {
          return 'お問い合わせ内容は10文字以上で入力してください'
        }
        return null
      case 'agree':
        if (!value) {
          return 'プライバシーポリシーに同意してください'
        }
        return null
      default:
        return null
    }
  }

  const validateForm = () => {
    const fields = Object.keys(form) as Array<keyof ContactForm>
    let isValid = true
    errors.value = []

    fields.forEach((field) => {
      const result = validateField(field, form[field])
      if (result) {
        isValid = false
        errors.value.push({ field, message: result })
      }
    })

    return isValid
  }

  const updateField = (field: keyof ContactForm, value: ContactForm[keyof ContactForm]) => {
    form[field] = value as never
    const fieldError = validateField(field, value)
    setFieldError(field, fieldError)
  }

  const resetForm = () => {
    Object.assign(form, initialFormState())
    errors.value = []
    submitResult.value = null
  }

  const submitForm = async () => {
    // バリデーション通過を確認
    if (!validateForm()) {
      return { success: false, error: new Error('入力内容を確認してください') }
    }

    // ローディング状態を ON
    isSubmitting.value = true
    submitResult.value = null

    try {
      // JSONPlaceholder に POST リクエストを送信
      // 実務では実際の API エンドポイントに置き換える
      const response = await $fetch<{ id: number; [key: string]: unknown }>(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          body: {
            title: form.name,
            body: form.message,
            userId: 1,
            email: form.email,
            topic: form.topic,
            agree: form.agree,
          },
        }
      )

      // 結果を保持 & UI に反映
      const result: SubmitResult = {
        success: true,
        timestamp: new Date().toISOString(),
        payload: { ...form },
      }
      submitResult.value = result
      resetForm()
      return { success: true, data: result }
    } catch (error) {
      // 例外処理: エラーメッセージを統一
      const err = error instanceof Error ? error : new Error('送信に失敗しました')
      return { success: false, error: err }
    } finally {
      // finally ブロック: 成功・失敗どちらでもローディング解除
      isSubmitting.value = false
    }
  }

  const getFieldError = (field: keyof ContactForm) => {
    return errors.value.find((error) => error.field === field)?.message ?? null
  }

  return {
    form,
    errors,
    isSubmitting,
    submitResult,
    updateField,
    resetForm,
    submitForm,
    getFieldError,
  }
}
