import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
    output: 'hybrid',
    adapter: vercel(),
    build: {
        inlineStylesheets: 'auto',
        format: 'file',
    },
    compressHTML: true,
    vite: {
        build: {
            cssMinify: true,
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    passes: 2,
                },
            },
        },
    },
});
