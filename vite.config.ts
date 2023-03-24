import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'development' ? './' : '/',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    },
  },

  plugins: [
    vue(),
    vueJsx({}),
    AutoImport({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    }),
    Icons({
      compiler: 'vue3',
      customCollections: {
        app: FileSystemIconLoader('./src/assets/svg-icons'),
      },
    }),
    ElementPlus({
      useSource: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/shared/styles/element-plus/index.scss" as *;`,
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api-dsapi/': {
        target: 'https://dsapi.osinfra.cn/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-dsapi/, ''),
      },
      '/api-omapi/': {
        target: 'https://omapi.osinfra.cn/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-omapi/, ''),
      },
      '/api-issues/': {
        // target: 'http://119.8.32.82',
        target: 'https://ipb.osinfra.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-issues/, ''),
      },
    },
  },
});
