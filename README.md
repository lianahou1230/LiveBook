# LiveBook

**LiveBook** 是一款跨平台 Web 应用——记录每一场演出的感动瞬间，管理演出日程，书写观演日记，回顾你的观演旅程。

## 功能概览

- **Home** — 演出倒计时、即将到来的演出展示
- **Records** — 演出记录管理（增删改查），支持搜索、筛选、评分、照片上传
- **Journal** — 观演日记，支持心情/天气标签、照片、纸张风格
- **Insights** — 数据统计面板：演出统计、类型分布、月度趋势、艺术家词云、日历视图

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | React 19 + React Router | 跨平台 SPA |
| UI 组件 | shadcn/ui (Radix UI) + Tailwind CSS v4 | Macaron 主题设计系统 |
| 状态与请求 | TanStack React Query + fetch | 声明式数据获取与缓存 |
| 构建工具 | Vite 7 | 极速 HMR 开发体验 |
| 后端框架 | Hono (Node.js runtime) | 轻量高性能 Web 框架 |
| 数据库 | TypeORM + SQLite (默认) / PostgreSQL | 可切换的持久化方案 |
| API 契约 | Zod schema 校验 | 前后端共享类型安全 |
| 语言 | TypeScript | 全栈类型安全 |

## 目录结构

```text
.
├── client/
│   ├── index.html                # Vite 前端入口 HTML
│   ├── public/                   # 前端静态资源
│   └── src/
│       ├── App.tsx               # 前端应用根组件（路由 + 底部导航）
│       ├── main.tsx              # 前端挂载入口
│       ├── globals.css           # 全局样式与 Macaron 设计 token
│       ├── components/
│       │   ├── ui/               # shadcn/ui 组件（button, card, dialog, input, textarea）
│       │   ├── BottomNav.tsx     # 底部导航栏
│       │   └── ErrorBoundary.tsx # 错误边界
│       ├── hooks/                # 客户端 hooks（use-api）
│       ├── lib/                  # 前端通用工具（queryClient, utils, theme）
│       └── pages/                # 路由页面（home, shows, journal, review, not-found）
├── server/
│   ├── app.ts                    # Hono 装配入口（注册 middleware、routes、静态资源）
│   ├── dev-app.ts                # 开发态 server 入口
│   ├── index.ts                  # 生产态 server 入口
│   ├── controllers/              # HTTP 适配层（journal, photo, show, stats）
│   ├── db/                       # DataSource 与数据库配置
│   ├── middlewares/              # 日志、异常等横切能力
│   ├── models/
│   │   ├── entities/             # TypeORM entity（journal, photo, show）
│   │   └── repositories/         # 数据访问实现（journal, photo, show）
│   └── routes/                   # 路由绑定层（journal, photo, show, stats）
├── shared/
│   ├── contracts/                # 前后端共享 API path 与 Zod 契约
│   ├── routes.ts                 # contracts 的兼容 re-export
│   └── schema.ts                 # 共享 schema 聚合导出
├── .env.example                  # 环境变量示例
├── package.json
├── tsconfig.json
├── tsconfig.server.json
└── vite.config.ts
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm（推荐）或 npm

### 安装与运行

```bash
# 安装依赖
pnpm install

# 开发模式（默认端口 3000）
pnpm dev

# 指定端口开发
PORT=8080 pnpm dev

# 构建生产产物
pnpm build

# 生产模式启动
pnpm start

# 指定端口启动
PORT=8080 pnpm start
```

### 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 本地开发，启动 Vite + Hono dev server |
| `pnpm build` | 构建前端（Vite）并编译服务端（tsc） |
| `pnpm start` | 以生产模式启动构建产物 |
| `pnpm check` | 执行前后端 TypeScript 类型检查 |
| `pnpm lint` | 执行 ESLint |

## 分层约束

- `server/routes` 只能依赖 `controllers`
- `server/controllers` 只负责 HTTP 适配，依赖 `models` 与 `shared`
- `server/models/repositories` 只负责数据读写，不返回 HTTP 响应结构
- `shared/` 只能放前后端都能安全复用的契约和纯类型，禁止放 TypeORM entity、Node API、Hono 运行时代码

## 端口配置

启动时按以下顺序解析端口：

1. 环境变量 `PORT`
2. 若未设置，默认使用 `3000`

## 数据库

服务启动时会自动同步表结构。

- 默认数据库：`DB_TYPE=sqlite`
- 默认数据库文件：`./.data/app.db`
- 自定义 SQLite 路径：复制 `.env.example` 为 `.env.local` 后设置 `DATABASE_FILE`
- 切换 Postgres：
  - `DB_TYPE=postgres`
  - `DATABASE_URL=postgres://user:pass@host:5432/dbname`

数据库类型建议在项目首次启动前确定；初始化后默认按固定配置处理，不承诺无损切换。

## 构建产物

- 前端产物：`dist/client`
- 后端产物：`dist/server`

生产启动时由 Hono 同时承载 API、静态资源与 SPA fallback。

## API 路由

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/shows` | 获取演出列表（支持 `?upcoming=true&artist=` 筛选） |
| GET | `/api/shows/:id` | 获取单个演出 |
| POST | `/api/shows` | 创建演出 |
| PATCH | `/api/shows/:id` | 更新演出 |
| DELETE | `/api/shows/:id` | 删除演出 |
| GET | `/api/journals` | 获取日志列表（支持 `?showId=` 筛选） |
| GET | `/api/journals/:id` | 获取单条日志 |
| POST | `/api/journals` | 创建日志 |
| PATCH | `/api/journals/:id` | 更新日志 |
| DELETE | `/api/journals/:id` | 删除日志 |
| GET | `/api/photos` | 获取照片列表 |
| POST | `/api/photos` | 上传照片 |
| GET | `/api/stats` | 获取统计数据 |
| GET | `/api/stats/countdown` | 获取倒计时列表 |
| GET | `/api/stats/calendar` | 获取日历数据 |

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 首页：倒计时 + 即将演出 |
| `/shows` | Records | 演出记录管理 |
| `/journal` | Journal | 观演日记 |
| `/review` | Insights | 数据统计与回顾 |

## License

MIT License
