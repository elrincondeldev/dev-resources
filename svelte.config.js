import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		files: {
			lib: './src/lib'
		},
		alias: {
			'@/*': './src/*',
			'@entities/*': './src/entities/*',
			'@features/*': './src/features/*',
			'@shared/*': './src/shared/*',
			'@widgets/*': './src/widgets/*'
		}
	}
};

export default config;
