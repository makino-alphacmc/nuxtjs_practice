<!-- components/form-handling/p1/ContactFormCard.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<div class="space-y-1">
				<p class="text-sm uppercase tracking-wide text-primary-300">
					Practice 5
				</p>
				<h2 class="text-2xl font-semibold text-neutral-100">
					入力フォームの基本
				</h2>
				<p class="text-neutral-400 text-sm">
					v-model / バリデーション / エラー表示 / サブミット / リセット
				</p>
			</div>
		</template>

		<form class="space-y-6" @submit.prevent="emit('submit')">
			<div class="grid gap-4">
				<div>
					<UInput
						:model-value="form.name"
						@update:model-value="
							(value) => emit('update-field', { field: 'name', value })
						"
						label="氏名"
						placeholder="山田 太郎"
						icon="i-heroicons-user"
					/>
					<p v-if="fieldError('name')" class="mt-1 text-sm text-red-400">
						{{ fieldError('name') }}
					</p>
				</div>

				<div>
					<UInput
						:model-value="form.email"
						@update:model-value="
							(value) => emit('update-field', { field: 'email', value })
						"
						label="メールアドレス"
						placeholder="example@mail.com"
						icon="i-heroicons-envelope"
					/>
					<p v-if="fieldError('email')" class="mt-1 text-sm text-red-400">
						{{ fieldError('email') }}
					</p>
				</div>

				<div>
					<USelect
						:model-value="form.topic"
						@update:model-value="
							(value) => emit('update-field', { field: 'topic', value })
						"
						:options="topicOptions"
						label="お問い合わせ種別"
					/>
					<p v-if="fieldError('topic')" class="mt-1 text-sm text-red-400">
						{{ fieldError('topic') }}
					</p>
				</div>

				<div>
					<UTextarea
						:model-value="form.message"
						@update:model-value="
							(value) => emit('update-field', { field: 'message', value })
						"
						label="お問い合わせ内容"
						placeholder="できるだけ具体的にご記入ください"
						:rows="5"
					/>
					<div class="flex items-center justify-between mt-1 text-sm">
						<p v-if="fieldError('message')" class="text-red-400">
							{{ fieldError('message') }}
						</p>
						<p class="text-neutral-500">{{ form.message.length }}/500</p>
					</div>
				</div>

				<div class="flex items-start gap-3 rounded-lg bg-neutral-900 p-4">
					<UCheckbox
						:model-value="form.agree"
						@update:model-value="
							(value) => emit('update-field', { field: 'agree', value })
						"
					/>
					<div>
						<p class="text-sm text-neutral-200">
							<span class="font-semibold">プライバシーポリシー</span
							>に同意します
						</p>
						<p v-if="fieldError('agree')" class="text-sm text-red-400 mt-1">
							{{ fieldError('agree') }}
						</p>
					</div>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<UButton
					type="submit"
					:loading="loading"
					:disabled="loading"
					color="primary"
					icon="i-heroicons-paper-airplane"
				>
					送信する
				</UButton>
				<UButton
					type="button"
					color="gray"
					variant="ghost"
					icon="i-heroicons-arrow-path"
					:disabled="loading"
					@click="emit('reset')"
				>
					入力をクリア
				</UButton>
				<span v-if="errors.length && !loading" class="text-sm text-red-300">
					入力内容に不備があります（{{ errors.length }}）
				</span>
			</div>
		</form>
	</UCard>
</template>

<script lang="ts">
import { defineComponent } from '#imports'
import type { PropType } from '#imports'
import type {
	ContactForm,
	FormValidationError,
} from '~/types/form-handling/p1/form'

interface UpdatePayload {
	field: keyof ContactForm
	value: ContactForm[keyof ContactForm]
}

interface ContactFormEmit {
	(event: 'update-field', payload: UpdatePayload): void
	(event: 'submit'): void
	(event: 'reset'): void
}

export default defineComponent({
	name: 'ContactFormCard',
	props: {
		form: {
			type: Object as PropType<ContactForm>,
			required: true,
		},
		errors: {
			type: Array as PropType<FormValidationError[]>,
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	emits: {
		'update-field': (payload: UpdatePayload) => Boolean(payload),
		submit: () => true,
		reset: () => true,
	},
	setup(
		props: Readonly<{
			form: ContactForm
			errors: FormValidationError[]
			loading: boolean
		}>,
		context: { emit: ContactFormEmit }
	) {
		const { emit } = context
		const topicOptions = [
			{ label: '不具合の報告', value: 'bug' },
			{ label: '使い方の質問', value: 'question' },
			{ label: '機能のリクエスト', value: 'request' },
		]

		const fieldError = (field: keyof ContactForm) => {
			return (
				props.errors.find((error: FormValidationError) => error.field === field)
					?.message ?? null
			)
		}

		return {
			topicOptions,
			emit,
			fieldError,
		}
	},
})
</script>
