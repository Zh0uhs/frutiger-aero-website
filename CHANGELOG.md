# 更新日志

## 2026-04-30 功能补充完成

### 新增功能

#### 1. 多页面路由系统
- 创建了 4 个新页面：
  - `/services` - 服务展示页面，包含6个服务卡片和统计数据
  - `/gallery` - 图片画廊页面，使用 Embla Carousel 实现轮播
  - `/about` - 关于我们页面，展示团队成员和公司历程
  - `/contact` - 联系页面，完整表单验证 + Toast 通知

#### 2. 天气组件动态化
- 新增 `hooks/useWeather.ts` - 接入 Open-Meteo 免费 API
- 新增 `hooks/useTime.ts` - 实时时间更新（每秒刷新）
- 天气数据包括：温度、体感温度、天气状况、湿度

#### 3. 音乐播放器功能
- 新增 `hooks/useAudio.ts` - HTML5 Audio API 管理
- 支持播放/暂停、上一曲/下一曲
- 进度条支持点击跳转
- 内置3首示例音乐

#### 4. 主题切换
- 修改 `app/layout.tsx` 集成 ThemeProvider
- 新增 `components/theme-toggle.tsx`
- Dock 栏 Settings 按钮可切换亮/暗模式

#### 5. Toast 通知
- 在 layout 中集成 Sonner Toaster
- Contact 页面表单提交后显示成功通知

#### 6. 导航系统
- Navigation 组件改为 Next.js Link
- 所有链接可正常跳转
- 激活状态自动高亮

### 文件变更

#### 新建文件
- `hooks/useWeather.ts`
- `hooks/useTime.ts`
- `hooks/useAudio.ts`
- `components/theme-toggle.tsx`
- `app/services/page.tsx`
- `app/gallery/page.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`

#### 修改文件
- `app/layout.tsx` - 集成 ThemeProvider 和 Toaster
- `components/harmony-hero.tsx` - 所有组件改为动态交互
