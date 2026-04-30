# Frutiger Aero Website

> Where nature meets technology - A modern web experience with beautiful UI design

---

## 📖 目录 / Table of Contents

- [项目简介 / Introduction](#项目简介--introduction)
- [功能特性 / Features](#功能特性--features)
- [技术栈 / Tech Stack](#技术栈--tech-stack)
- [快速开始 / Getting Started](#快速开始--getting-started)
- [项目结构 / Project Structure](#项目结构--project-structure)
- [开发指南 / Development](#开发指南--development)
- [贡献 / Contributing](#贡献--contributing)
- [许可证 / License](#许可证--license)

---

## 项目简介 / Introduction

**Frutiger Aero** 是一个现代化的单页网站应用，采用 Frutiger Aero 设计风格，融合自然元素与科技感，提供沉浸式的用户体验。

**Frutiger Aero** is a modern single-page website application featuring the Frutiger Aero design aesthetic, blending natural elements with technological sophistication for an immersive user experience.

---

## 功能特性 / Features

### ✨ 核心功能 / Core Features

- **响应式设计** / **Responsive Design** - 完美适配各种设备尺寸
- **沉浸式视觉效果** / **Immersive Visual Effects** - 毛玻璃效果、渐变背景、3D 变换
- **实时天气展示** / **Real-time Weather Display** - 模拟天气信息展示组件
- **音乐播放器界面** / **Music Player UI** - 精美的音乐播放控制界面
- **导航菜单** / **Navigation Menu** - 优雅的侧边导航栏

### 🎨 设计亮点 / Design Highlights

- Frutiger Aero 设计风格
- 柔和的色彩搭配（天空蓝、自然绿）
- 玻璃拟态效果（Glassmorphism）
- 流畅的动画过渡效果

---

## 技术栈 / Tech Stack

| 分类 / Category | 技术 / Technology |
|----------------|-------------------|
| 框架 / Framework | Next.js 16 |
| 语言 / Language | TypeScript |
| 样式 / Styling | Tailwind CSS 4 |
| UI 组件 / UI Components | Radix UI |
| 图标 / Icons | Lucide React |
| 构建工具 / Build Tool | Turbopack |

---

## 快速开始 / Getting Started

### 前置要求 / Prerequisites

- Node.js >= 20.x
- npm 或 pnpm

### 安装步骤 / Installation

```bash
# 克隆仓库 / Clone the repository
git clone https://github.com/Zh0uhs/frutiger-aero-website.git

# 进入目录 / Navigate to the project directory
cd frutiger-aero-website

# 安装依赖 / Install dependencies
pnpm install

# 启动开发服务器 / Start development server
pnpm run dev
```

### 运行项目 / Run the Project

```bash
# 开发模式 / Development mode
pnpm run dev

# 构建生产版本 / Build for production
pnpm run build

# 启动生产服务器 / Start production server
pnpm run start

# 代码检查 / Lint code
pnpm run lint
```

---

## 项目结构 / Project Structure

```
frutiger-aero-website/
├── app/                    # Next.js App Router
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── components/             # UI 组件
│   ├── ui/                 # Radix UI 组件
│   ├── harmony-hero.tsx    # 主英雄区域组件
│   └── theme-provider.tsx  # 主题提供者
├── hooks/                  # 自定义 Hooks
├── lib/                    # 工具函数
├── public/                 # 静态资源
├── styles/                 # 样式文件
├── .next/                  # Next.js 构建输出
├── out/                    # 静态导出目录
├── next.config.mjs         # Next.js 配置
├── package.json            # 项目依赖
└── tsconfig.json           # TypeScript 配置
```

---

## 开发指南 / Development

### 分支管理 / Branch Management

- `main` - 主分支，稳定版本
- `dev` - 开发分支，功能开发

### 提交规范 / Commit Guidelines

遵循 Conventional Commits 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具更新

---

## 贡献 / Contributing

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 许可证 / License

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 联系方式 / Contact

- GitHub: [Zh0uhs](https://github.com/Zh0uhs)
- Repository: [frutiger-aero-website](https://github.com/Zh0uhs/frutiger-aero-website)

---

*Built with ❤️ using Next.js*
