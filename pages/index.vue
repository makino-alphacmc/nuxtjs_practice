<template>
	<div class="min-h-screen bg-neutral-900 p-4">
		<div class="max-w-1xl mx-auto">
			<h1 class="text-4xl font-bold text-neutral-100 mb-6 text-center">
				Nuxt 3 練習ページ
			</h1>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- async-await/p1 へのリンク -->
				<UCard class="bg-neutral-950 hover:bg-neutral-800 transition-colors">
					<template #header>
						<h2 class="text-xl font-semibold text-neutral-100">
							非同期処理の練習
						</h2>
					</template>
					<div class="space-y-4">
						<p class="text-neutral-400">
							非同期処理の基本練習（useFetch、async/await）
						</p>
						<NuxtLink to="/async-await/p1">
							<UButton color="primary" block> 練習ページへ </UButton>
						</NuxtLink>
					</div>
				</UCard>

				<!-- http-signal/p1 へのリンク -->
				<UCard class="bg-neutral-950 hover:bg-neutral-800 transition-colors">
					<template #header>
						<h2 class="text-xl font-semibold text-neutral-100">
							API連携（HTTP通信）の練習
						</h2>
					</template>
					<div class="space-y-4">
						<p class="text-neutral-400">
							CRUD操作の練習（GET、POST、PUT、DELETE）
						</p>
						<NuxtLink to="/http-signal/p1">
							<UButton color="primary" block> 練習ページへ </UButton>
						</NuxtLink>
					</div>
				</UCard>

				<!-- array-operations/p1 へのリンク -->
				<UCard class="bg-neutral-950 hover:bg-neutral-800 transition-colors">
					<template #header>
						<h2 class="text-xl font-semibold text-neutral-100">
							配列操作の練習
						</h2>
					</template>
					<div class="space-y-4">
						<p class="text-neutral-400">
							配列操作（map、filter、reduce、find、ソート、ページネーション）
						</p>
						<NuxtLink to="/array-operations/p1">
							<UButton color="primary" block> 練習ページへ </UButton>
						</NuxtLink>
					</div>
				</UCard>

				<!-- crud-operations/p1 へのリンク -->
				<UCard class="bg-neutral-950 hover:bg-neutral-800 transition-colors">
					<template #header>
						<h2 class="text-xl font-semibold text-neutral-100">
							CRUD処理（実務用）
						</h2>
					</template>
					<div class="space-y-4">
						<p class="text-neutral-400">
							API通信と配列操作を組み合わせた実践版（検索・フィルタ・ソート・ページネーション）
						</p>
						<NuxtLink to="/crud-operations/p1">
							<UButton color="primary" block> 練習ページへ </UButton>
						</NuxtLink>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>
