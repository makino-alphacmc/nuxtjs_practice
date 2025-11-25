<!-- components/http-signal/p1/PostCreateForm.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				2. POST - 新規投稿を作成
			</h2>
		</template>
		<div class="space-y-4">
			<UInput
				v-model="formData.title"
				placeholder="タイトルを入力"
				label="タイトル"
				class="w-full"
			/>
			<UTextarea
				v-model="formData.body"
				placeholder="本文を入力"
				label="本文"
				:rows="4"
				class="w-full"
			/>
			<UInput
				v-model.number="formData.userId"
				type="number"
				placeholder="ユーザーID（1-10）"
				label="ユーザーID"
				class="w-full"
			/>
			<UButton
				:loading="loading"
				@click="handleSubmit"
				color="green"
				block
			>
				投稿を作成
			</UButton>
		</div>
	</UCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { CreatePostRequest } from '~/types/http-signal/p1/api'

export default defineComponent({
	name: 'PostCreateForm',
	props: {
		loading: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['create'],
	setup(props, { emit }) {
		const formData = ref<CreatePostRequest>({
			title: '',
			body: '',
			userId: 1,
		})

		const handleSubmit = () => {
			if (!formData.value.title || !formData.value.body) {
				alert('タイトルと本文を入力してください')
				return
			}
			emit('create', formData.value)
			// フォームをリセット
			formData.value = {
				title: '',
				body: '',
				userId: 1,
			}
		}

		return {
			formData,
			handleSubmit,
		}
	},
})
</script>

