export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['@nuxt/ui', '@nuxtjs/tailwindcss'],
	css: ['~/assets/css/main.css'],
	compatibilityDate: '2024-04-03',

	// コンポーネントの自動インポート設定
	components: [
		{
			path: '~/components',
			pathPrefix: false,
		},
	],
})
