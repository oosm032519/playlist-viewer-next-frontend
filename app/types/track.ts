// app/types/track.ts

/**
 * 外部URL情報を表すインターフェース
 * @property {string} spotify - Spotifyの外部URL
 */
export interface ExternalUrls {
    externalUrls: {
        spotify: string;
    };
}

/**
 * トラックのアーティスト情報を表すインターフェース
 * @property {ExternalUrls} externalUrls - アーティストの外部URL情報
 * @property {string} href - アーティストのAPIエンドポイント
 * @property {string} id - アーティストの一意の識別子
 * @property {string} name - アーティスト名
 * @property {string} type - オブジェクトのタイプ (例: "artist")
 * @property {string} uri - Spotify URI
 */
export interface TrackArtist {
    externalUrls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

/**
 * アルバムの画像情報を表すインターフェース
 * @property {number} height - 画像の高さ (ピクセル)
 * @property {string} url - 画像のURL
 * @property {number} width - 画像の幅 (ピクセル)
 */
export interface TrackAlbumImage {
    height: number;
    url: string;
    width: number;
}

/**
 * トラックが属するアルバム情報を表すインターフェース
 * @property {string | null} albumGroup - アルバムグループ (例: "album", "single")、存在しない場合はnull
 * @property {string} albumType - アルバムのタイプ (例: "album", "single")
 * @property {TrackArtist[]} artists - アルバムに関連するアーティストの配列
 * @property {string[]} availableMarkets - アルバムの利用可能な市場の国コード配列
 * @property {ExternalUrls} externalUrls - アルバムの外部URL情報
 * @property {string} href - アルバムのAPIエンドポイント
 * @property {string} id - アルバムの一意の識別子
 * @property {TrackAlbumImage[]} images - アルバムの画像情報の配列
 * @property {string} name - アルバム名
 * @property {string} releaseDate - アルバムのリリース日 (YYYY-MM-DD形式)
 * @property {string} releaseDatePrecision - リリース日の精度 (例: "day", "month", "year")
 * @property {any | null} restrictions - アルバムの制限情報、存在しない場合はnull
 * @property {string} type - オブジェクトのタイプ (例: "album")
 * @property {string} uri - Spotify URI
 */
export interface TrackAlbum {
    albumGroup: string | null;
    albumType: string;
    artists: TrackArtist[];
    availableMarkets: string[];
    externalUrls: ExternalUrls;
    href: string;
    id: string;
    images: TrackAlbumImage[];
    name: string;
    releaseDate: string;
    releaseDatePrecision: string;
    restrictions: any | null;
    type: string;
    uri: string;
}

/**
 * トラック情報を表すインターフェース
 * @property {TrackAlbum} album - トラックが属するアルバム情報
 * @property {TrackArtist[]} artists - トラックに関連するアーティストの配列
 * @property {string[]} availableMarkets - トラックの利用可能な市場の国コード配列
 * @property {number} discNumber - ディスク番号 (複数ディスクの場合)
 * @property {number} durationMs - トラックの長さ (ミリ秒単位)
 * @property {{ isrc: string }} externalIds - トラックの外部ID情報 (例: ISRC)
 * @property {ExternalUrls} externalUrls - トラックの外部URL情報
 * @property {string} href - トラックのAPIエンドポイント
 * @property {string} id - トラックの一意の識別子
 * @property {boolean} isExplicit - トラックがExplicit（露骨な表現を含む）かどうか
 * @property {boolean | null} isPlayable - トラックが再生可能かどうか、nullの場合は不明
 * @property {any | null} linkedFrom - 元のトラックへのリンク、存在しない場合はnull
 * @property {string} name - トラック名
 * @property {number} popularity - トラックの人気スコア（0 - 100）
 * @property {string | null} previewUrl - プレビュー用のURL、存在しない場合はnull
 * @property {any | null} restrictions - トラックの制限情報、存在しない場合はnull
 * @property {number} trackNumber - トラック番号
 * @property {string} type - オブジェクトのタイプ (例: "track")
 * @property {string} uri - Spotify URI
 * @property {TrackAudioFeatures} [audioFeatures] - トラックのオーディオ特徴情報、存在する場合のみ
 */
export interface Track {
    album: TrackAlbum;
    artists: TrackArtist[];
    availableMarkets: string[];
    discNumber: number;
    durationMs: number;
    externalIds: { isrc: string };
    externalUrls: ExternalUrls;
    href: string;
    id: string;
    isExplicit: boolean;
    isPlayable: boolean | null;
    linkedFrom: any | null;
    name: string;
    popularity: number;
    previewUrl: string | null;
    restrictions: any | null;
    trackNumber: number;
    type: string;
    uri: string;
    audioFeatures?: TrackAudioFeatures;
}

/**
 * トラックのオーディオ特徴情報を表すインターフェース
 * @property {number} acousticness - アコースティックさの度合い (0.0 - 1.0)
 * @property {string} analysisUrl - オーディオ特徴の分析結果へのURL
 * @property {number} danceability - ダンス性の度合い (0.0 - 1.0)
 * @property {number} durationMs - トラックの長さ (ミリ秒単位)
 * @property {number} energy - エネルギーの度合い (0.0 - 1.0)
 * @property {string} id - トラックの一意の識別子
 * @property {number} instrumentalness - インストゥルメンタルの度合い (0.0 - 1.0)
 * @property {number} key - トラックの音楽的なキー (例: 0 = C, 1 = C#)
 * @property {number} liveness - ライブ感の度合い (0.0 - 1.0)
 * @property {number} loudness - ラウドネス (デシベル単位)
 * @property {string} mode - 曲のモード (例: "major" = 長調, "minor" = 短調)
 * @property {number} speechiness - スピーチ性の度合い (0.0 - 1.0)
 * @property {number} tempo - テンポ (BPM: Beats Per Minute)
 * @property {number} timeSignature - 拍子 (例: 4 = 4/4拍子)
 * @property {string} trackHref - トラックのAPIエンドポイント
 * @property {string} type - オブジェクトのタイプ (例: "audio_features")
 * @property {string} uri - Spotify URI
 * @property {number} valence - 曲のポジティブさの度合い (0.0 - 1.0)
 */
export interface TrackAudioFeatures {
    acousticness: number;
    analysisUrl: string;
    danceability: number;
    durationMs: number;
    energy: number;
    id: string;
    instrumentalness: number;
    key: number;
    liveness: number;
    loudness: number;
    mode: string;
    speechiness: number;
    tempo: number;
    timeSignature: number;
    trackHref: string;
    type: string;
    uri: string;
    valence: number;
}
