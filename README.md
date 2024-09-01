# Playlist Viewer Next.js フロントエンド

## 概要

このプロジェクトは、Spotify のプレイリストを閲覧、分析、操作するための Next.js フロントエンドアプリケーションです。ユーザーは
Spotify アカウントでログインし、プレイリストを検索、詳細情報の表示、推奨トラックの取得、プレイリストへのトラックの追加・削除、新しいプレイリストの作成、お気に入りのプレイリストの管理などができます。

**[デモサイト](https://playlist-viewer-next-frontend.vercel.app)**

## 主な機能

* **Spotify ログイン**: Spotify OAuth2 を使用した安全なログイン
* **プレイリスト操作**:
    * プレイリストの検索、閲覧
    * プレイリストの詳細情報の取得 (トラックリスト、ジャンル分布、オーディオ特徴量)
    * プレイリストへのトラックの追加・削除
    * 新しいプレイリストの作成
* **プレイリスト分析**:
    * ジャンル分布の表示 (円グラフ)
    * Audio Features の分析 (レーダーチャート、danceability, energy, valence など)
    * 推奨トラックの取得とプレビュー
* **お気に入りのプレイリスト管理**:
    * プレイリストをお気に入りに登録
    * お気に入りのプレイリスト一覧表示
* **フォロー中のプレイリスト表示**:
    * Spotify でフォロー中のプレイリスト一覧表示

## 技術スタック

* **フレームワーク**: Next.js 14 (App Router)
* **UI ライブラリ**: React
* **データフェッチ**: TanStack Query
* **スタイリング**: Tailwind CSS
* **チャート**: Recharts
* **フォーム**: React Hook Form, Yup
* **セキュリティ**: DOMPurify
* **その他**: TypeScript

## 開発環境のセットアップ

1. **前提条件**:
    * Node.js 16 以上
    * npm または yarn
2. **リポジトリのクローン**:
    ```bash
    git clone https://github.com/oosm032519/playlist-viewer-next-frontend.git
    ```
3. **環境変数の設定**:
    * `.env.local` ファイルを作成します。
    * `.env.local` に以下の環境変数を設定します。
        * `NEXT_PUBLIC_BACKEND_URL`: バックエンドアプリケーションの URL (例: `http://localhost:8080`)
4. **依存関係のインストール**:
    ```bash
    npm install
    # または
    yarn install
    ```
5. **開発サーバーの起動**:
    ```bash
    npm run dev
    # または
    yarn dev
    ```

## ビルドとデプロイ

1. **ビルド**:
    ```bash
    npm run build
    # または
    yarn build
    ```
2. **デプロイ**:
   Vercel, Netlify などのサービスを利用してデプロイできます。

## ライセンス

MIT License

## 免責事項

このプロジェクトは、Spotify とは一切関係ありません。
