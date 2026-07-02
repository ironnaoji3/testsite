import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// お知らせ・商品紹介ページは静的生成（ビルド時にmicroCMSから取得）、
// お問い合わせAPI（src/pages/api/contact.ts）のみ `export const prerender = false;` で
// Cloudflare Pages Functionsとしてオンデマンド実行する。
export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    imageService: 'compile',
  }),
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    build: {
      // 対象ブラウザ: Chrome / Edge / Safari(iOS含む) / Firefox の最新版のみ
      target: 'es2022',
    },
  },
});
