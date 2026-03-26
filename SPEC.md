# 个人博客项目规格说明

## 1. 项目概述

- **项目名称**: 我的博客
- **类型**: 静态博客网站
- **框架**: VitePress 1.x + Vue 3
- **设计风格**: 参考 craftinginterpreters.com

## 2. 技术栈

- **框架**: VitePress 1.x
- **构建工具**: Vite
- **模板**: Vue 3
- **字体**: Crimson Pro (衬线体), Source Sans 3 (无衬线)

## 3. 目录结构

```
Blogspot/
├── docs/
│   ├── .vitepress/
│   │   ├── config.mjs       # VitePress 配置
│   │   └── theme/
│   │       ├── index.js    # 主题入口
│   │       └── custom.css  # 自定义样式
│   ├── articles/
│   │   ├── javascript-closure.md
│   │   ├── css-layout.md
│   │   ├── typescript-types.md
│   │   └── responsive-design.md
│   ├── index.md             # 首页
│   └── about.md            # 关于页
├── package.json
└── SPEC.md
```

## 4. 设计特点

### 配色方案
- 页面背景: 深蓝灰 (#29313d)
- 内容卡片: 白色 / 深色模式 (#252b33)
- 强调色: 金色 (#bf9540)
- 链接色: 蓝色 (#1481b8)

### 字体
- 标题: Crimson Pro (衬线体，优雅古典)
- 正文: Source Sans 3 (无衬线，清爽现代)

## 5. 功能特性

- [x] Markdown 文章管理
- [x] 响应式布局
- [x] 深色/浅色模式切换
- [x] 文章列表展示
- [x] 侧边栏导航
- [x] 本地搜索功能
- [x] 订阅表单（前端模拟）
- [x] 关于页面

## 6. 运行命令

```bash
# 安装依赖
npm install

# 开发服务器
npm run docs:dev

# 构建静态文件
npm run docs:build

# 预览构建结果
npm run docs:preview
```