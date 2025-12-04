# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## 项目概述

HaloLight Netlify 部署版本，基于 Next.js 15 + React 19，集成 Netlify Edge Functions、Forms、Identity。

## 技术栈

- **框架**: Next.js 15 App Router + React 19 + TypeScript
- **样式**: Tailwind CSS 4、shadcn/ui
- **部署**: Netlify (Edge Functions, Forms, Identity)

## 常用命令

```bash
pnpm dev          # 本地开发
pnpm build        # 生产构建
netlify dev       # Netlify CLI 本地预览
netlify deploy    # 部署到 Netlify
```

## Netlify 特性

### Edge Functions

```typescript
// netlify/edge-functions/hello.ts
export default async (request: Request) => {
  return new Response("Hello from Edge!");
};

export const config = { path: "/api/hello" };
```

### Forms

```tsx
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <input name="email" type="email" />
  <button type="submit">Submit</button>
</form>
```

### Identity

```typescript
import { useIdentityContext } from 'react-netlify-identity';
const { user, loginUser, logoutUser } = useIdentityContext();
```

## 配置文件

- `netlify.toml` - Netlify 构建和部署配置
- `netlify/edge-functions/` - Edge Functions 目录
- `netlify/functions/` - Serverless Functions 目录
