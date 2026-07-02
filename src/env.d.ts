/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Cloudflare Pages の環境変数（Pages の Settings > Environment variables で設定する）
type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

interface Env {
  /** microCMSのサービスドメイン（{service-domain}.microcms.io の {service-domain} 部分） */
  MICROCMS_SERVICE_DOMAIN: string;
  /** microCMSのAPIキー（管理画面の「サービス設定」>「APIキー」で発行） */
  MICROCMS_API_KEY: string;
  /** ResendのAPIキー（Resendダッシュボードの「API Keys」で発行） */
  RESEND_API_KEY: string;
  /** お問い合わせメールの送信元アドレス（Resendで検証済みのドメインのアドレス） */
  CONTACT_FROM_EMAIL: string;
  /** お問い合わせメールの受信先アドレス（社内の担当窓口アドレス） */
  CONTACT_TO_EMAIL: string;
}
