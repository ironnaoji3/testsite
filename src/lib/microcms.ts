import { createClient } from 'microcms-js-sdk';

// お知らせ・商品紹介ページはビルド時に静的生成されるため、
// ここでは `import.meta.env`（.env / ビルド時環境変数）を参照する。
// Cloudflare Pagesの「Environment variables」にも同名で設定すること。
const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  throw new Error(
    'MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が設定されていません。.env を確認してください。',
  );
}

export const microcmsClient = createClient({
  serviceDomain,
  apiKey,
});
