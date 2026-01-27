import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
    output: 'hybrid',
    adapter: vercel({
        maxDuration: 10,
    }),
    build: {
        inlineStylesheets: 'auto',
        format: 'directory',
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
