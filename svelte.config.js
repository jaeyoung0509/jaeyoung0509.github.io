import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'out',
			assets: 'out',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: ''
		},
		prerender: {
			entries: ['*'],
			handleHttpError: 'fail',
			handleMissingId: 'warn'
		},
		alias: {
			$components: 'src/components',
			$lib: 'src/lib',
			$content: 'content'
		}
	}
};

export default config;
