# AgentHearth

AgentHearth 是一个 local-first 的 Agent Runtime 管理面：把项目上下文、知识、工具与客户端连接汇聚到同一个受控网关，并在浏览器中提供运行状态、治理状态和审计入口。

当前发布版本为 **V3 / 0.3.0**。仓库、npm 包、容器和运行时服务都以 AgentHearth 为唯一当前实现。

## V3 能力

- 项目连接与上下文同步状态
- Context Pack、Knowledge Builder、Tools & Skills、Agent Adapter 流水线
- 本地数据边界、最小权限和审计状态
- Codex、Claude Code、OpenClaw 等客户端连接视图
- 运行时间线与健康检查接口
- 桌面与移动端响应式界面

## 技术栈

- Next.js 16.3.1（App Router / standalone）
- React 19.2
- TypeScript
- Vitest + Testing Library
- Docker + Cloudflare Tunnel

## 本地开发

要求 Node.js 20.9 或更高版本。

```bash
npm install
npm run dev
```

默认开发地址为 `http://localhost:3000`。

## 验证

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit
```

V3 只发布以下路由：

- `/`
- `/api/health`

## Docker

```bash
docker compose up -d --build
curl http://127.0.0.1:14211/api/health
```

容器默认只绑定宿主机回环地址 `127.0.0.1:14211`，不直接开放公网端口。公网访问应通过受控反向代理或 Tunnel 接入。

## 生产地址

推荐子域名：`hearth.baoganai.com`

ECS 与 Cloudflare Tunnel 的部署拓扑、DNS 记录和回滚方式见 [AgentHearth ECS 部署说明](docs/deployment/agenthearth-ecs.md)。

AgentHearth 简称 **Hearth**。
