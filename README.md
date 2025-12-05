# HaloLight Netlify

[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7.svg?logo=netlify)](https://halolight-netlify.h7ml.cn)
[![Next.js](https://img.shields.io/badge/Next.js-15-%23000000.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-%233178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-%2361DAFB.svg)](https://react.dev/)

HaloLight 后台管理系统的 **Netlify 部署版本**，基于 Next.js 15 App Router + React 19 构建，集成 Netlify Edge Functions、Forms 和 Identity。

- 在线预览：<https://halolight-netlify.h7ml.cn>
- GitHub：<https://github.com/halolight/halolight-netlify>

## 功能亮点

- **Netlify Edge Functions**：Deno 运行时，边缘计算
- **Netlify Forms**：无后端表单处理
- **Netlify Identity**：内置用户认证
- **Deploy Previews**：PR 自动预览
- **Split Testing**：A/B 测试支持
- **Background Functions**：后台任务处理

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/halolight/halolight-netlify.git
cd halolight-netlify

# 安装依赖
pnpm install

# 本地开发
pnpm dev

# 使用 Netlify CLI 本地预览
netlify dev
```

## 部署到 Netlify

### 方式一：Git 集成

1. 在 [Netlify Dashboard](https://app.netlify.com/start) 导入项目
2. 配置构建命令：`pnpm build`
3. 发布目录：`.next`

### 方式二：Netlify CLI

```bash
# 安装 CLI
pnpm add -g netlify-cli

# 登录并部署
netlify login
netlify deploy --prod
```

## Netlify 配置

### netlify.toml

```toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"

[[edge_functions]]
  path = "/api/*"
  function = "api-handler"
```

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `NEXT_PUBLIC_API_URL` | API 基础地址 |
| `NETLIFY_AUTH_TOKEN` | Netlify API Token |

## 相关链接

- [HaloLight 文档](https://halolight.docs.h7ml.cn)
- [Netlify 文档](https:/docs.netlify.com/)
- [Netlify Next.js Runtime](https:/docs.netlify.com/frameworks/next-js/)

## 许可证

[MIT](LICENSE)
