<!-- components/array-operations/p1/CrudExample.vue -->
<template>
	<UCard class="bg-neutral-950">
		<template #header>
			<h2 class="text-xl font-semibold text-neutral-100">
				7. データの追加・削除・更新
			</h2>
		</template>
		<div class="space-y-4">
			<!-- 追加 -->
			<div class="p-4 bg-neutral-900 rounded-lg">
				<h3 class="text-sm font-semibold text-neutral-100 mb-3">追加</h3>
				<div class="space-y-3">
					<UInput
						:model-value="newPostTitle"
						@update:model-value="$emit('update:newPostTitle', $event)"
						placeholder="タイトル"
						label="タイトル"
					/>
					<UInput
						:model-value="newPostUserId"
						@update:model-value="$emit('update:newPostUserId', $event)"
						type="number"
						placeholder="ユーザーID"
						label="ユーザーID"
					/>
					<UButton
						@click="$emit('add')"
						color="green"
						:disabled="!newPostTitle || !newPostUserId"
					>
						投稿を追加
					</UButton>
				</div>
			</div>

			<!-- 更新 -->
			<div class="p-4 bg-neutral-900 rounded-lg">
				<h3 class="text-sm font-semibold text-neutral-100 mb-3">更新</h3>
				<div class="space-y-3">
					<UInput
						:model-value="updatePostId"
						@update:model-value="$emit('update:updatePostId', $event)"
						type="number"
						placeholder="更新する投稿ID"
						label="投稿ID"
					/>
					<UInput
						:model-value="updatePostTitle"
						@update:model-value="$emit('update:updatePostTitle', $event)"
						placeholder="新しいタイトル"
						label="新しいタイトル"
					/>
					<UButton
						@click="$emit('update')"
						color="blue"
						:disabled="!updatePostId || !updatePostTitle"
					>
						投稿を更新
					</UButton>
				</div>
			</div>

			<!-- 削除 -->
			<div class="p-4 bg-neutral-900 rounded-lg">
				<h3 class="text-sm font-semibold text-neutral-100 mb-3">削除</h3>
				<div class="space-y-3">
					<UInput
						:model-value="deletePostId"
						@update:model-value="$emit('update:deletePostId', $event)"
						type="number"
						placeholder="削除する投稿ID"
						label="投稿ID"
					/>
					<UButton
						@click="$emit('delete')"
						color="red"
						:disabled="!deletePostId"
					>
						投稿を削除
					</UButton>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
interface Props {
	newPostTitle: string
	newPostUserId: number | null
	updatePostId: number | null
	updatePostTitle: string
	deletePostId: number | null
}

defineProps<Props>()

// emits を定義
defineEmits<{
	'update:newPostTitle': [value: string]
	'update:newPostUserId': [value: string | number | null]
	'update:updatePostId': [value: string | number | null]
	'update:updatePostTitle': [value: string]
	'update:deletePostId': [value: string | number | null]
	add: []
	update: []
	delete: []
}>()
</script>

