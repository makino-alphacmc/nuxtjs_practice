<template>
	<div>
		<PostList
			:posts="posts"
			:postPending="postPending"
			:postError="postError"
		/>
	</div>
</template>

<script setup lang="ts">
// Composables を明示的にインポート
import { usePosts } from '~/composables/async-await/p2/usePosts'

// Components を明示的にインポート
import PostList from '~/components/async-await/p2/PostList.vue'

import type { Post } from '~/types/async-await/p2/api'

// composable からデータを取得
const { posts, postPending, postError } = usePosts()
</script>
