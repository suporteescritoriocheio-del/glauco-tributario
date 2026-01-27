import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: 'static',
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
