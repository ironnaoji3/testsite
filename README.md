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

## Xserver Staticへのデプロイと自動更新

`.github/workflows/deploy.yml` により、GitHub Actions上で `npm run build` を実行しFTPでXserver Staticへ同期します。以下の3経路のいずれかでワークフローが起動します。

- `main` ブランチへのpush（通常のコード変更）
- 手動実行（`workflow_dispatch`）
- microCMSのコンテンツ更新（Webhook経由の `repository_dispatch`）

> **注意**: このプロジェクトは `@astrojs/cloudflare` アダプターを使用しており、お問い合わせフォームの送信API（`src/pages/api/contact.ts`）はCloudflare Pages Functions（サーバーレス実行環境）を前提にしています。Xserver Staticは静的ファイルのみをホスティングするため、**このワークフローでデプロイした場合お問い合わせフォームの送信は動作しません**。別途、フォーム送信先を用意する対応が必要です。

### 1. Xserver StaticでFTPを有効化

Xserver Staticの管理画面でFTPの利用を有効にし、FTPサーバー名・ユーザー名・パスワードを控えます。

### 2. GitHubにRepository secretsを登録

`Settings > Secrets and variables > Actions` で以下を登録します。

| Secret名 | 値 |
| --- | --- |
| `FTP_SERVER` | Xserver StaticのFTPサーバー名 |
| `FTP_USERNAME` | FTPユーザー名 |
| `FTP_PASSWORD` | FTPパスワード |
| `MICROCMS_SERVICE_DOMAIN` | `.env` と同じ値 |
| `MICROCMS_API_KEY` | `.env` と同じ値 |

### 3. GitHub Personal Access Tokenを発行（microCMS Webhook用）

1. GitHubの `Settings > Developer settings > Fine-grained tokens` で新規発行
2. 対象リポジトリをこのリポジトリのみに限定
3. Repository permissionsで `Contents: Read and write` を付与

### 4. microCMSにWebhookを設定

各API（`news` / `products` / `categories`）の管理画面 → Webhook → 「+ 追加」→ サービス選択で **「GitHub Actions」** を選び、以下を入力します。

- **GitHubトークン**: 手順3で発行したPersonal Access Token
- **リポジトリのユーザー名**: `ironnaoji3`
- **リポジトリ名**: `testsite`
- **トリガーイベント名**: `microcms`（`deploy.yml` の `repository_dispatch.types` と一致させる）
- 通知タイミング: コンテンツの作成・更新・削除・公開など必要なものを選択

### 5. 動作確認

`Actions` タブから `Deploy to Xserver Static` を手動実行（`workflow_dispatch`）してデプロイが成功することを確認したうえで、microCMSでコンテンツを更新し、Webhook経由でワークフローが自動起動することを確認してください。

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
