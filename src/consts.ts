// サイト共通の定数。会社名・サイトURL等は実際の値に置き換える。
export const SITE_NAME = '{company-name}株式会社';
export const SITE_DESCRIPTION = '{company-name}株式会社の公式サイトです。';
// Cloudflare Pagesの本番URL（OGP等の絶対URL生成に使用）
export const SITE_URL = 'https://{project-name}.pages.dev';

// 一覧ページ1ページあたりの表示件数
export const NEWS_PAGE_SIZE = 5;
export const PRODUCTS_PAGE_SIZE = 9;

export const NAV_ITEMS = [
  { label: '会社概要', href: '/company' },
  { label: 'サービス紹介', href: '/service' },
  { label: 'お知らせ', href: '/news' },
  { label: '商品紹介', href: '/products' },
  { label: 'お問い合わせ', href: '/contact' },
] as const;

// 会社概要ページの掲載内容。実際の値に置き換える。
export const COMPANY_INFO = [
  { label: '会社名', value: `${SITE_NAME}` },
  { label: '設立', value: '{establishment-date}' },
  { label: '資本金', value: '{capital}' },
  { label: '代表者', value: '{representative-name}' },
  { label: '所在地', value: '{company-address}' },
  { label: '電話番号', value: '{company-tel}' },
  { label: '事業内容', value: '{business-description}' },
] as const;

// サービス紹介ページの掲載内容。実際の値に置き換える。
export const SERVICES = [
  { title: '{service-name-1}', description: '{service-description-1}' },
  { title: '{service-name-2}', description: '{service-description-2}' },
  { title: '{service-name-3}', description: '{service-description-3}' },
] as const;
