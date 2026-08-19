# AgentHearth ECS 部署说明

## 当前拓扑

- 产品：AgentHearth 0.3.0
- 容器：`agenthearth-web`
- 镜像：`agenthearth-web:0.3.0`
- 宿主机监听：`127.0.0.1:14211`
- 健康检查：`http://127.0.0.1:14211/api/health`
- 公网入口：`https://hearth.baoganai.com`
- 接入方式：现有 Cloudflare Named Tunnel

AgentHearth 不新增 ECS 公网端口。Cloudflare Tunnel 将 `hearth.baoganai.com` 转发到本机回环地址；PackFlow 原有路由保持独立。

## DNS

在 Cloudflare 中创建显式记录，以覆盖 `baoganai.com` 的通配记录：

| 类型 | 名称 | 目标 | 代理 |
| --- | --- | --- | --- |
| CNAME | `hearth` | `5bf53c42-5bb1-4183-8ba4-89047f5c7e38.cfargotunnel.com` | 开启 |

## 容器约束

- `restart: unless-stopped`
- 内存上限 `384M`
- CPU 上限 `0.5`
- 以非 root 用户 `nextjs` 运行
- Docker 镜像平台为 `linux/amd64`

## 验收

```bash
docker ps --filter name=agenthearth-web
docker inspect agenthearth-web --format '{{.State.Health.Status}}'
curl -fsS http://127.0.0.1:14211/api/health
curl -fsS https://hearth.baoganai.com/api/health
```

## Tunnel 配置

AgentHearth 的 ingress 规则必须位于最终的 `http_status:404` 规则之前：

```yaml
- hostname: hearth.baoganai.com
  service: http://127.0.0.1:14211
```

变更前的 Tunnel 配置备份为：

```text
/etc/cloudflared/config.yml.bak-agenthearth-20260819
```

## 回滚

1. 从 Tunnel 配置删除 AgentHearth ingress 规则并验证配置。
2. 重启 `cloudflared`。
3. 停止并删除 `agenthearth-web` 容器。
4. 删除或暂停 `hearth` DNS 记录。

回滚不得修改 PackFlow 的 `127.0.0.1:3001` 路由。
