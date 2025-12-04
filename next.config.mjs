import withPWA from "next-pwa";

// ============================================================================
// Netlify 环境检测
// NETLIFY: Netlify 构建时自动注入
// CONTEXT: 部署上下文 (production/deploy-preview/branch-deploy)
// DEPLOY_PRIME_URL: 主要部署 URL
// ============================================================================
const isNetlify = process.env.NETLIFY === "true";
const isVercel = process.env.VERCEL === "1";
const isProduction = process.env.NODE_ENV === "production";
const netlifyContext = process.env.CONTEXT || "development";

// Netlify 部署环境下不使用 standalone 输出模式
// Netlify 使用 @netlify/plugin-nextjs 处理 Next.js 应用
const useStandalone = !isNetlify && !isVercel;

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: true, // 暂时禁用 PWA 以解决构建问题
  runtimeCaching: [
    // 本地字体缓存（已改用自托管字体，无需 Google Fonts 规则）
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-font-assets",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-image-assets",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-image",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:mp3|wav|ogg)$/i,
      handler: "CacheFirst",
      options: {
        rangeRequests: true,
        cacheName: "static-audio-assets",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:mp4)$/i,
      handler: "CacheFirst",
      options: {
        rangeRequests: true,
        cacheName: "static-video-assets",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    // Next.js 带哈希的静态资源（文件名包含哈希，内容不变）
    // 使用 CacheFirst 因为文件名变化意味着新资源
    {
      urlPattern: /\/_next\/static\/.+\.(js|css)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static-assets",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    // 非 _next/static 的 JS/CSS（如第三方脚本）使用 NetworkFirst
    // 确保部署后用户能获取最新版本
    {
      urlPattern: ({ url }) => {
        const pathname = url.pathname;
        // 排除已处理的 _next/static
        if (pathname.startsWith("/_next/static/")) return false;
        return /\.(js|css)$/i.test(pathname);
      },
      handler: "NetworkFirst",
      options: {
        cacheName: "dynamic-assets",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 3,
      },
    },
    // Next.js 页面数据（路由预取数据）
    // 使用 NetworkFirst 确保用户获取最新页面数据
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "next-data",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 3,
      },
    },
    {
      urlPattern: /\.(?:json|xml|csv)$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "static-data-assets",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: ({ url }) => {
        const isSameOrigin = self.origin === url.origin;
        if (!isSameOrigin) return false;
        const pathname = url.pathname;
        // Exclude /api routes
        if (pathname.startsWith("/api/")) return false;
        return true;
      },
      handler: "NetworkFirst",
      options: {
        cacheName: "others",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: ({ url }) => {
        const isSameOrigin = self.origin === url.origin;
        return !isSameOrigin;
      },
      handler: "NetworkOnly", // 跨域资源不缓存，避免 OpaqueResponseBlocking
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 安全：移除 X-Powered-By 响应头
  poweredByHeader: false,

  // 打包优化
  compiler: {
    // 移除 console.log（生产环境）
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // 实验性功能
  experimental: {
    // 优化包导入 - 减少打包体积
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "framer-motion",
      "@tanstack/react-query",
      "recharts",
      "date-fns",
      "zustand",
    ],
    // 启用服务端 Actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // 图片优化
  // Netlify 支持 Next.js 原生图片优化
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 远程图片域名白名单
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
    ],
  },

  // 压缩优化
  compress: true,

  // 生产环境 source map 关闭以减小体积和首包下载
  productionBrowserSourceMaps: false,

  // 输出配置
  // Netlify 使用 @netlify/plugin-nextjs 处理，不需要 standalone 模式
  ...(useStandalone ? { output: "standalone" } : {}),

  // 静态资源缓存（由 netlify.toml 处理，这里保留作为备用）
  headers: async () => [
    {
      source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/fonts/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],

  // 重定向和重写规则
  async redirects() {
    return [
      // 旧路由重定向示例
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },

  // 忽略构建时的 ESLint 错误（CI 中单独检查）
  eslint: {
    // 仅在 CI 环境忽略，本地开发保持检查
    ignoreDuringBuilds: process.env.CI === "true",
  },

  // 忽略 TypeScript 构建错误（CI 中单独检查）
  typescript: {
    // 仅在 CI 环境忽略，本地开发保持检查
    ignoreBuildErrors: process.env.CI === "true",
  },

  // 暴露部署环境信息到客户端（用于调试和环境判断）
  env: {
    // 部署平台标识
    NEXT_PUBLIC_DEPLOY_PLATFORM: isNetlify
      ? "netlify"
      : isVercel
        ? "vercel"
        : "other",
    // Netlify 部署上下文
    NEXT_PUBLIC_NETLIFY_CONTEXT: netlifyContext,
    // Git 信息（仅在非生产环境暴露，避免泄露私有仓库信息）
    ...((!isProduction || process.env.NEXT_PUBLIC_SHOW_GIT_INFO === "true") && {
      NEXT_PUBLIC_GIT_BRANCH: process.env.BRANCH || "",
      NEXT_PUBLIC_GIT_COMMIT_SHA: process.env.COMMIT_REF
        ? process.env.COMMIT_REF.slice(0, 7)
        : "",
    }),
  },
};

export default pwaConfig(nextConfig);
