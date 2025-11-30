<!-- components/http-signal/p1/PostEditForm.vue -->
<template>
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
					@click="handleCancel"
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
				@click="handleSubmit"
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
</template>

<script setup lang="ts">
// 型定義を明示的にインポート
import type { UpdatePostRequest } from '~/types/crud-operations/p1/api'

interface Props {
	editingPost: UpdatePostRequest | null
	loading: boolean
}

const props = defineProps<Props>()

// emits を定義
const emit = defineEmits<{
	update: [postData: UpdatePostRequest]
	cancel: []
}>()

// 編集中の投稿データ（props を直接使用）
const editingPost = ref<UpdatePostRequest | null>(props.editingPost)

// props の変更を監視
watch(
	() => props.editingPost,
	(newVal) => {
		editingPost.value = newVal
	}
)

const handleSubmit = () => {
	if (!editingPost.value) return

	if (!editingPost.value.title || !editingPost.value.body) {
		alert('タイトルと本文を入力してください')
		return
	}

	emit('update', editingPost.value)
}

const handleCancel = () => {
	emit('cancel')
}
</script>

