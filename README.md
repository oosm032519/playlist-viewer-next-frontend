## フロントエンド README

# Playlist Viewer Next.js フロントエンド

このプロジェクトは、Spotify のプレイリストを閲覧、分析、操作するための Next.js フロントエンドアプリケーションです。ユーザーは
Spotify アカウントでログインし、プレイリストを検索、詳細情報の表示、推奨トラックの取得、プレイリストへのトラックの追加・削除、新しいプレイリストの作成、お気に入りのプレイリストの管理などができます。

## 機能

- Spotify ログイン
- プレイリスト検索
- プレイリスト詳細情報の表示（トラックリスト、ジャンル分布、オーディオ特徴量）
- 推奨トラックの取得と試聴
- プレイリストへのトラックの追加・削除
- 新しいプレイリストの作成
- お気に入りのプレイリストの管理

## 技術スタック

- Next.js
- React
- TanStack Query
- Tailwind CSS
- Recharts
- Lucide React
- React Hook Form
- Yup
- DOMPurify

## インストール

1. プロジェクトのルートディレクトリに移動します。
2. 依存関係をインストールします。

```bash
npm install
```

## 開発サーバーの起動

```bash
npm run dev
```

## 環境変数

以下の環境変数を設定する必要があります。

- `NEXT_PUBLIC_BACKEND_URL`: バックエンドサーバーのURL

## 使用方法

1. Spotify アカウントでログインします。
2. プレイリストを検索するか、URL からプレイリスト ID を入力します。
3. プレイリストの詳細情報、推奨トラック、および利用可能なアクションを表示します。

## ディレクトリ構造

```
├── app
│   ├── api
│   │   ├── playlists
│   │   │   ├── add-track
│   │   │   │   └── route.ts
│   │   │   ├── create
│   │   │   │   └── route.ts
│   │   │   ├── favorite
│   │   │   │   └── route.ts
│   │   │   ├── favorites
│   │   │   │   └── route.ts
│   │   │   ├── followed
│   │   │   │   └── route.ts
│   │   │   ├── remove-track
│   │   │   │   └── route.ts
│   │   │   ├── search
│   │   │   │   └── route.ts
│   │   │   └── [id]
│   │   │       └── route.ts
│   │   ├── session
│   │   │   ├── check
│   │   │   │   └── route.ts
│   │   │   ├── logout
│   │   │   │   └── route.ts
│   │   │   └── sessionId
│   │   │       └── route.ts
│   │   └── spotify
│   │       └── route.ts
│   ├── components
│   │   ├── CombinedAudioFeaturesChart.tsx
│   │   ├── CustomTooltip.tsx
│   │   ├── ErrorAlert.tsx
│   │   ├── FavoritePlaylistsTable.tsx
│   │   ├── FollowedPlaylists.tsx
│   │   ├── GenreChart.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoginButton.tsx
│   │   ├── PaginationButtons.tsx
│   │   ├── PlaylistDetails.tsx
│   │   ├── PlaylistDetailsLoader.tsx
│   │   ├── PlaylistDetailsTable.tsx
│   │   ├── PlaylistDisplay.tsx
│   │   ├── PlaylistIdForm.tsx
│   │   ├── PlaylistSearch.tsx
│   │   ├── PlaylistSearchForm.tsx
│   │   ├── PlaylistTable.tsx
│   │   ├── PlaylistTableHeader.tsx
│   │   ├── PlaylistTableRow.tsx
│   │   ├── RecommendationsTable.tsx
│   │   └── TrackPlayer.tsx
│   ├── context
│   │   ├── FavoriteContext.tsx
│   │   ├── PlaylistContext.tsx
│   │   └── UserContext.tsx
│   ├── hooks
│   │   ├── useCreatePlaylistMutation.ts
│   │   ├── useSearchPlaylists.ts
│   │   └── useTrackActions.ts
│   ├── lib
│   │   ├── PlaylistDetailsTableColumns.tsx
│   │   ├── api-utils.ts
│   │   ├── audioFeaturesUtils.ts
│   │   ├── errors.ts
│   │   ├── tableUtils.ts
│   │   └── trackUtils.ts
│   ├── types
│   │   ├── audioFeaturesTypes.ts
│   │   ├── playlist.ts
│   │   ├── recommendationsTableProps.ts
│   │   └── track.ts
│   ├── utils
│   │   └── prepareChartData.ts
│   ├── validationSchema.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public
│   └── favicon.ico
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── package.json

```

## ライセンス

MIT License

## 免責事項

このプロジェクトは、Spotify とは一切関係ありません。
