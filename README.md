# {project-name}

Astro + microCMS + Cloudflare Pages + Resend で構成した企業サイトテンプレートです。

- 「お知らせ」「商品紹介」をmicroCMSで管理し、ビルド時に静的生成します。
- 「お問い合わせ」フォームは 入力 → 確認 → 送信完了 の3ステップで、入力・確認は同一URL内でJavaScriptにより表示を切り替え、送信完了時のみ計測用に別URL（サンクスページ）へ遷移します。
- お問い合わせの送信はResend経由でメール通知します。
- CSSはSCSSで記述し、BEM記法（FLOCSSライクな `foundation/layout/object(component/project)/utility` 構成）に統一しています。
- JavaScriptはChrome / Edge / Safari（iOS含む）/ Firefoxの最新版のみを対象としています。

## 必要要件

- Node.js 22以上
- npm

## セットアップ

### インストール

```bash
npm install
```

### 環境変数の設定

```bash
cp .env.example .env
```

`.env` を開き、以下の値を実際の値に置き換えてください。

| 変数名 | 説明 |
| --- | --- |
| `MICROCMS_SERVICE_DOMAIN` | microCMSのサービスドメイン（`https://{service-domain}.microcms.io` の `{service-domain}` 部分） |
| `MICROCMS_API_KEY` | microCMS管理画面の「サービス設定」>「APIキー」で発行したAPIキー |
| `RESEND_API_KEY` | Resendダッシュボードの「API Keys」で発行したAPIキー |
| `CONTACT_FROM_EMAIL` | お問い合わせメールの送信元アドレス（Resendで検証済みドメインのアドレス） |
| `CONTACT_TO_EMAIL` | お問い合わせメールの受信先アドレス（社内の担当窓口アドレス） |

お問い合わせAPI（`src/pages/api/contact.ts`）をローカルの `wrangler pages dev` で動作確認する場合は、`.dev.vars.example` を `.dev.vars` としてコピーし、同様に値を設定してください。

```bash
cp .dev.vars.example .dev.vars
```

### ローカル開発サーバーの起動

```bash
npm run dev
```

## microCMSのコンテンツモデル

以下の3つのAPI（リスト形式）を作成してください。`categories` は `products` から参照するため先に作成しておく必要があります。

### `news`（お知らせ）

| フィールドID | 種類 | 必須 |
| --- | --- | --- |
| `title` | テキストフィールド | 必須 |
| `content` | リッチエディタ | 必須 |

### `categories`（商品カテゴリー）

| フィールドID | 種類 | 必須 |
| --- | --- | --- |
| `name` | テキストフィールド | 必須 |

### `products`（商品紹介）

| フィールドID | 種類 | 必須 |
| --- | --- | --- |
| `name` | テキストフィールド | 必須 |
| `description` | テキストフィールド | 必須 |
| `thumbnail` | 画像フィールド | 必須 |
| `body` | リッチエディタ | 必須 |
| `category` | コンテンツ参照（`categories`を選択） | 必須 |
| `price` | 数値フィールド | 任意 |

商品はカテゴリーごとのアーカイブページ（`/products/category/{カテゴリーID}`）が自動生成されます。`categories`に登録した各カテゴリーに対して静的ページが1つ作られる仕組みなので、カテゴリー追加後は再ビルドが必要です。

## ビルド

```bash
npm run build
```

`news` / `products` / トップページはビルド時にmicroCMSへ実際にAPIリクエストを行い静的生成されるため、**ビルド前に `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` を有効な値に設定しておく必要があります**。未設定・不正な値の場合ビルドは失敗します。

## Cloudflare Pagesへのデプロイ

1. Cloudflare Pagesのプロジェクト作成時、以下のビルド設定を指定します。
   - Build command: `npm run build`
   - Build output directory: `dist`
2. Pagesプロジェクトの `Settings > Environment variables` に、`.env.example` と同じ5つの環境変数を設定します（Production / Preview 両方）。
3. Resend側で送信元ドメインの検証（DNSレコードの設定）を行ってください。未検証の場合、メール送信が失敗します。

## ディレクトリ構成

```
src/
  components/     … 再利用可能なUIコンポーネント
  layouts/        … 共通レイアウト
  lib/            … microCMSクライアント等
  pages/          … ルーティング（Astroの規約に従う）
    api/contact.ts … お問い合わせ送信API（Cloudflare Pages Functions）
    company/        … 会社概要（静的ページ）
    service/        … サービス紹介（静的ページ）
    contact/        … お問い合わせフォーム（入力/確認）・完了ページ
    news/           … お知らせ一覧・詳細
    products/       … 商品紹介一覧・詳細
  styles/         … SCSS（foundation/layout/object/utility）
  types/          … microCMSのコンテンツ型定義
```
