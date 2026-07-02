import type { MicroCMSImage, MicroCMSListContent } from 'microcms-js-sdk';

/**
 * 「お知らせ」コンテンツ（microCMS: リスト形式API、APIエンドポイント例 `news`）
 * 必須フィールド: title, content
 */
export interface News extends MicroCMSListContent {
  title: string;
  content: string;
}

/**
 * 「商品カテゴリー」コンテンツ（microCMS: リスト形式API、APIエンドポイント例 `categories`）
 * 必須フィールド: name
 */
export interface Category extends MicroCMSListContent {
  name: string;
}

/**
 * 「商品紹介」コンテンツ（microCMS: リスト形式API、APIエンドポイント例 `products`）
 * 必須フィールド: name, description, thumbnail, body, category（`categories`へのコンテンツ参照）
 * 任意フィールド: price
 */
export interface Product extends MicroCMSListContent {
  name: string;
  description: string;
  thumbnail: MicroCMSImage;
  body: string;
  category: Category;
  price?: number;
}
