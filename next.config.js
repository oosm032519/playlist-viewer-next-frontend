/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // 画像最適化の設定
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
                pathname: '/image/**',
            },
            {
                protocol: 'https',
                hostname: 'example.com',
                pathname: '/assets/**',
            },
        ],
        minimumCacheTTL: 60,
        // 画像のサイズ制限を追加
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // セキュリティヘッダーの強化
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self), accelerometer=(), autoplay=(), display-capture=(), encrypted-media=(), gyroscope=(), magnetometer=(), midi=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), xr-spatial-tracking=()',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Access-Control-Allow-Credentials',
                        value: 'true',
                    },
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: process.env.NEXT_PUBLIC_BACKEND_URL,
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              block-all-mixed-content;
              upgrade-insecure-requests;
              connect-src 'self' ${process.env.NEXT_PUBLIC_BACKEND_URL};
              worker-src 'self' blob:;
              manifest-src 'self';
              media-src 'self';
              frame-src 'self';
              child-src 'self';
            `.replace(/\s+/g, ' ').trim(),
                    },
                    // キャッシュ制御ヘッダーの追加
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, must-revalidate',
                    },
                ],
            },
        ];
    },

    // 追加のセキュリティ設定
    poweredByHeader: false, // 'X-Powered-By' ヘッダーを無効化
    compress: true, // レスポンスの圧縮を有効化
    productionBrowserSourceMaps: false, // 本番環境でのソースマップ生成を無効化

    // ビルド出力の最適化
    output: 'standalone',

    // 環境変数の検証
    env: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    },

    // セキュリティ強化: ランタイム設定
    experimental: {
        scrollRestoration: true,
        optimizeCss: true,
    },
};

module.exports = nextConfig;
