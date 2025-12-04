# HaloLight Netlify 部署版本

## 已知问题

### 构建时错误

**问题**: 本地构建时 404/500 页面预渲染失败
- `<Html> should not be imported outside of pages/_document`  
- `useContext` 在构建时为 null

**原因**: 应用使用 `force-dynamic` + 大量 React Context，导致构建时预渲染失败

**影响**: 本地构建失败，但 Netlify 实际部署时能正常工作

**解决方案**:
1. Netlify 在部署时会自动处理这些错误
2. 如需本地完整构建，暂时注释 `src/app/layout.tsx` 中的 `export const dynamic = "force-dynamic"`

## 修改记录

### 从原版迁移的变更

1. **移除 Edge Runtime 声明**: 所有 `export const runtime = "edge"` 已移除，Netlify 自动处理
2. **添加 Netlify 配置**: netlify.toml、@netlify/plugin-nextjs
3. **调整 next.config.mjs**: 移除 Cloudflare 特定配置，添加 Netlify 环境检测
4. **环境变量**: 更新为 Netlify 环境变量命名规范

