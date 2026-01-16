# 心青年智能体平台（前端 · React）

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![React](https://img.shields.io/badge/react-19.2.0-blue)
![License: GPLv3](https://img.shields.io/badge/license-GPLv3-blue)

## 简介

“心青年”智能体平台是一款面向孤独症家庭与专业服务者的智能咨询与服务平台。前端采用 React + Vite 构建，聚焦 RAG 智能问答、统一服务中心、知识库管理、志愿者与专家协作等核心场景，支持 PC/H5 响应式体验。

## 主要功能

- [x] RAG 智能咨询引擎（知识库问答）
- [x] 统一服务中心（模块化工作台）
- [x] 用户认证与鉴权（多角色 RBAC）
- [x] 知识库录入、查阅与审核
- [x] 志愿者招募、排班与服务记录
- [x] 专家协同与工单处理
- [x] 个人中心与信息管理
- [x] 首页导航与服务入口
- [x] 多端适配（PC/H5）

## 技术栈

- **前端框架**：React 19, Vite
- **UI组件库**：Ant Design Mobile, Vant Icons
- **路由管理**：React Router DOM
- **状态管理**：Context API / Redux
- **API 通信**：Fetch, js-cookie
- **样式**：CSS Modules, 变量主题
- **国际化**：预留 i18n
- **代码规范**：ESLint
- **测试**：预留 E2E（Cypress/Playwright）

## 项目结构

```
├── public/                # 静态资源
│   └── vite.svg
├── src/
│   ├── api/               # API 封装
│   ├── assets/            # 图片、SVG、主题
│   ├── components/        # 通用组件（Card、Header、Nav等）
│   ├── hooks/             # 自定义 Hook
│   ├── i18n/              # 国际化
│   ├── layouts/           # 页面布局（HomeLayout、SubLayout）
│   ├── pages/             # 业务页面（home、consult、knowledge、volunteer、expert等）
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理（UserContext等）
│   ├── styles/            # 全局样式与变量
│   ├── types/             # 类型定义（User等）
│   └── utils/             # 工具函数（角色映射等）
├── docs/                  # 设计与功能文档
├── LICENSE                # GPLv3 许可证
├── package.json           # 项目依赖与脚本
├── vite.config.js         # Vite 配置
└── README.md              # 项目说明
```

## 快速开始

### 环境要求

- Node.js >= 18
- 推荐使用 [pnpm](https://pnpm.io/) 或 [npm](https://www.npmjs.com/)
- 推荐安装 Git

### 安装依赖

```bash
git clone https://github.com/your-org/young-hearts-agent-platform-frontend-react.git
cd young-hearts-agent-platform-frontend-react
npm install
```

### 环境配置

如需自定义 API 地址、项目标题等，请参考 `.env.example` 文件，创建 `.env.local` 并填写：

```env
VITE_APP_TITLE=心青年智能体平台
VITE_API_BASE_URL=https://api.younghearts.com
```

### 启动开发环境

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看效果。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 代码规范检查

```bash
npm run lint
```

## API 文档

后端接口采用 RESTful 设计，详见 [docs/“心青年”智能体平台-数据模型与 API 设计.md](docs/“心青年”智能体平台-数据模型与 API 设计.md)。如需联调请确保后端服务已启动。

## 许可证

本项目采用 [GNU GPLv3](LICENSE) 开源协议，欢迎学习与二次开发，商用请遵循协议要求。

---

如需参与贡献或了解更多，请查阅 [docs/](docs/) 目录下的详细设计文档，或联系项目维护者。

