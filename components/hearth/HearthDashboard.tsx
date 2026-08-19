"use client";

import {
  Activity,
  BookOpen,
  Bot,
  Box,
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Command,
  FileCode2,
  FileStack,
  Folder,
  GitBranch,
  History,
  House,
  KeyRound,
  Layers3,
  Link2,
  Menu,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import styles from "./hearth-dashboard.module.css";

const navigation = [
  { id: "overview", label: "总览", icon: House },
  { id: "project", label: "项目", icon: Folder },
  { id: "context", label: "上下文", icon: FileStack },
  { id: "knowledge", label: "知识", icon: BookOpen },
  { id: "skills", label: "工具与技能", icon: Wrench },
  { id: "agents", label: "Agent 适配", icon: Bot },
  { id: "governance", label: "桥接与治理", icon: ShieldCheck },
  { id: "settings", label: "设置", icon: Settings },
] as const;

const pipeline = [
  { id: "project", label: "Project Connector", state: "仓库已连接", icon: Link2 },
  { id: "context", label: "Context Pack", state: "42 个实体", icon: Layers3 },
  { id: "knowledge", label: "Knowledge Builder", state: "索引新鲜", icon: BookOpen },
  { id: "skills", label: "Tools & Skills", state: "18 项可用", icon: Wrench },
  { id: "agents", label: "Agent Adapter", state: "3 个客户端", icon: Bot },
] as const;

const agents = [
  { client: "Codex", initials: "C", tone: "violet", project: "PackFlow", capability: "读取、搜索、工具调用、写入", activity: "12 秒前", status: "已连接", online: true },
  { client: "Claude Code", initials: "CC", tone: "amber", project: "PackFlow", capability: "读取、搜索、工具调用", activity: "3 分钟前", status: "空闲", online: false },
  { client: "OpenClaw", initials: "OC", tone: "green", project: "PackFlow", capability: "读取、搜索、工具调用", activity: "15 分钟前", status: "已连接", online: true },
] as const;

const activities = [
  { title: "上下文同步完成", detail: "PackFlow · 42 个实体已同步", time: "12 秒前", icon: RefreshCw, tone: "green" },
  { title: "技能暴露更新", detail: "18 项工具与技能已发布给 Agent Adapter", time: "3 分钟前", icon: Wrench, tone: "amber" },
  { title: "策略检查通过", detail: "最小权限与本地边界检查正常", time: "8 分钟前", icon: ShieldCheck, tone: "green" },
] as const;

const commands = [
  { label: "连接新项目", group: "操作", target: "project" },
  { label: "查看上下文流水线", group: "导航", target: "context" },
  { label: "管理工具与技能", group: "导航", target: "skills" },
  { label: "查看 Agent 连接", group: "导航", target: "agents" },
  { label: "检查治理策略", group: "导航", target: "governance" },
] as const;

type NavigationId = (typeof navigation)[number]["id"];

function scrollToSection(id: NavigationId) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Brand() {
  return (
    <div className={styles.brand}>
      {/* A tiny local brand asset; plain img avoids a production sharp dependency. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.brandMark} src="/agenthearth-mark.png" alt="" width={44} height={44} />
      <div>
        <strong>AgentHearth</strong>
        <span>Local Agent Runtime</span>
      </div>
    </div>
  );
}

function StatusDot({ online }: { online: boolean }) {
  return <span className={online ? styles.statusDotOnline : styles.statusDotIdle} aria-hidden="true" />;
}

export function HearthDashboard() {
  const [activeNav, setActiveNav] = useState<NavigationId>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectOpen, setConnectOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [syncLabel, setSyncLabel] = useState("最后心跳 12 秒前");
  const [refreshing, setRefreshing] = useState(false);
  const logsRef = useRef<HTMLElement>(null);

  const filteredCommands = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("zh-CN");
    if (!query) return commands;
    return commands.filter((item) => item.label.toLocaleLowerCase("zh-CN").includes(query));
  }, [searchQuery]);

  const navigate = (id: NavigationId) => {
    setActiveNav(id);
    setMobileNavOpen(false);
    scrollToSection(id);
  };

  const refreshContext = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      setSyncLabel("最后心跳 刚刚");
      setRefreshing(false);
      toast.success("PackFlow 上下文已刷新", { description: "42 个实体保持同步，知识索引状态正常。" });
    }, 650);
  };

  const chooseCommand = (target: NavigationId, label: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    if (label === "连接新项目") {
      setConnectOpen(true);
      return;
    }
    navigate(target);
  };

  const submitProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const repository = String(form.get("repository") ?? "").trim();
    if (!repository) return;
    setConnectOpen(false);
    toast.success("连接请求已创建", { description: `${repository} 将在权限校验后进入 Project Connector。` });
    event.currentTarget.reset();
  };

  return (
    <div className={styles.appShell}>
      <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarTop}>
          <Brand />
          <button className={styles.mobileClose} type="button" onClick={() => setMobileNavOpen(false)} aria-label="关闭导航">
            <X size={19} />
          </button>
        </div>
        <nav className={styles.navigation} aria-label="主导航">
          {navigation.map((item) => {
            const Icon = item.icon;
            const selected = activeNav === item.id;
            return (
              <button
                className={selected ? styles.navItemActive : styles.navItem}
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                aria-current={selected ? "page" : undefined}
              >
                <Icon size={20} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {mobileNavOpen ? <button className={styles.mobileBackdrop} type="button" onClick={() => setMobileNavOpen(false)} aria-label="关闭导航" /> : null}

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <button className={styles.mobileMenu} type="button" onClick={() => setMobileNavOpen(true)} aria-label="打开导航">
            <Menu size={20} />
          </button>

          <div className={styles.projectSwitcherWrap}>
            <button
              className={styles.projectSwitcher}
              type="button"
              onClick={() => setProjectMenuOpen((open) => !open)}
              aria-expanded={projectMenuOpen}
            >
              <Folder size={18} />
              <span>PackFlow</span>
              <ChevronDown size={16} />
            </button>
            {projectMenuOpen ? (
              <div className={styles.projectMenu}>
                <button type="button" onClick={() => setProjectMenuOpen(false)}>
                  <Check size={15} /> PackFlow
                </button>
                <button type="button" onClick={() => { setProjectMenuOpen(false); setConnectOpen(true); }}>
                  <Plus size={15} /> 连接新项目
                </button>
              </div>
            ) : null}
          </div>

          <div className={styles.searchWrap}>
            <Search className={styles.searchIcon} size={18} />
            <input
              value={searchQuery}
              onChange={(event) => { setSearchQuery(event.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              aria-label="搜索项目、工具或运行记录"
              placeholder="搜索项目、工具或运行记录"
            />
            <span className={styles.commandKey}><Command size={13} /> K</span>
            {searchOpen ? (
              <>
                <button className={styles.searchDismiss} type="button" onClick={() => setSearchOpen(false)} aria-label="关闭搜索结果" />
                <div className={styles.commandMenu}>
                  {filteredCommands.length ? filteredCommands.map((item) => (
                    <button key={item.label} type="button" onClick={() => chooseCommand(item.target, item.label)}>
                      <span>{item.label}</span>
                      <small>{item.group}</small>
                    </button>
                  )) : <p>没有匹配的操作</p>}
                </div>
              </>
            ) : null}
          </div>

          <button className={styles.userControl} type="button" onClick={() => toast("当前操作者", { description: "Weisi · 本机管理员" })}>
            <CircleUserRound size={19} />
            <span>Weisi</span>
            <ChevronDown size={15} />
          </button>
        </header>

        <main className={styles.main} id="overview">
          <section className={styles.intro}>
            <div>
              <h1>本机运行时，一切就绪</h1>
              <p>项目上下文、知识与工具正在通过同一个受控网关提供给 Agent。</p>
            </div>
            <div className={styles.introActions}>
              <button className={styles.primaryButton} type="button" onClick={() => setConnectOpen(true)}>
                <Plus size={18} /> 连接新项目
              </button>
              <button className={styles.secondaryButton} type="button" onClick={() => logsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}>
                <FileCode2 size={17} /> 查看运行日志
              </button>
            </div>
          </section>

          <section className={styles.runtimeStrip} aria-label="运行状态">
            <div className={styles.runtimeOnline}><span />Runtime 在线</div>
            <div><Braces size={16} />Gateway :14210 <small>预留</small></div>
            <div><Box size={16} />Web Admin :14211</div>
            <div><Activity size={16} />{syncLabel}</div>
          </section>

          <div className={styles.primaryGrid}>
            <section className={styles.projectPanel} id="project">
              <div className={styles.panelHeading}>
                <h2>PackFlow</h2>
                <div className={styles.projectMeta}>
                  <span><Box size={15} /> weisiwu/packflow</span>
                  <span><GitBranch size={15} /> main</span>
                  <span className={styles.synced}><Check size={15} /> 上下文已同步</span>
                  <button type="button" onClick={refreshContext} disabled={refreshing}>
                    <RefreshCw className={refreshing ? styles.spinning : ""} size={16} /> {refreshing ? "刷新中" : "立即刷新"}
                  </button>
                </div>
              </div>

              <div className={styles.pipeline} aria-label="AgentHearth V3 运行链路">
                {pipeline.map((stage, index) => {
                  const Icon = stage.icon;
                  return (
                    <button className={styles.pipelineStage} id={stage.id} key={stage.label} type="button" onClick={() => navigate(stage.id)}>
                      <span className={styles.stageIcon}><Icon size={22} strokeWidth={1.8} /></span>
                      <strong>{stage.label}</strong>
                      <small><StatusDot online />{stage.state}</small>
                      {index < pipeline.length - 1 ? <span className={styles.pipelineLine} aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={styles.governancePanel} id="governance">
              <h2>治理状态</h2>
              <div className={styles.governanceRow}>
                <ShieldCheck size={19} /><span>本地数据边界</span><strong><StatusDot online />已启用</strong>
              </div>
              <div className={styles.governanceRow}>
                <KeyRound size={19} /><span>最小权限</span><strong><StatusDot online />正常</strong>
              </div>
              <div className={styles.governanceRow}>
                <History size={19} /><span>审计记录</span><strong><StatusDot online />正常</strong>
              </div>
              <button className={styles.textButton} type="button" onClick={() => setPolicyOpen(true)}>
                查看策略 <ChevronRight size={15} />
              </button>
            </section>
          </div>

          <div className={styles.lowerGrid}>
            <section className={styles.agentPanel} id="agents">
              <div className={styles.sectionTitle}>
                <h2>Agent 连接</h2>
                <span>3 个客户端</span>
              </div>
              <div className={styles.agentTable} role="table" aria-label="Agent 连接">
                <div className={styles.tableHeader} role="row">
                  <span>客户端</span><span>项目</span><span>能力</span><span>最近活动</span><span>状态</span><span />
                </div>
                {agents.map((agent) => (
                  <button className={styles.agentRow} role="row" type="button" key={agent.client} onClick={() => toast(agent.client, { description: `${agent.capability} · ${agent.status}` })}>
                    <span className={styles.agentIdentity}><i data-tone={agent.tone}>{agent.initials}</i>{agent.client}</span>
                    <span>{agent.project}</span>
                    <span>{agent.capability}</span>
                    <span>{agent.activity}</span>
                    <span><StatusDot online={agent.online} />{agent.status}</span>
                    <span><MoreVertical size={16} /></span>
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.activityPanel} ref={logsRef}>
              <div className={styles.sectionTitle}><h2>最近运行</h2><span>实时</span></div>
              <div className={styles.timeline}>
                {activities.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div className={styles.timelineItem} key={item.title}>
                      <span className={styles.timelineIcon} data-tone={item.tone}><Icon size={18} /></span>
                      <div><strong>{item.title}</strong><p>{item.detail}</p></div>
                      <time>{item.time}</time>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <footer className={styles.footer} id="settings">
            <span>AgentHearth v0.3.0</span><i /> <span>Local-first</span><i /> <span>数据留在本机</span>
          </footer>
        </main>
      </div>

      {connectOpen ? (
        <div className={styles.modalLayer} role="presentation">
          <button className={styles.modalBackdrop} type="button" onClick={() => setConnectOpen(false)} aria-label="关闭连接项目窗口" />
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="connect-title">
            <div className={styles.modalHeader}>
              <div><h2 id="connect-title">连接新项目</h2><p>仓库先通过权限检查，再进入 V3 上下文流水线。</p></div>
              <button type="button" onClick={() => setConnectOpen(false)} aria-label="关闭"><X size={19} /></button>
            </div>
            <form onSubmit={submitProject}>
              <label htmlFor="repository">Git 仓库地址</label>
              <input id="repository" name="repository" placeholder="https://github.com/owner/repository" required autoFocus />
              <label htmlFor="branch">默认分支</label>
              <input id="branch" name="branch" placeholder="main" defaultValue="main" />
              <div className={styles.modalHint}><ShieldCheck size={17} />只申请读取仓库与构建上下文所需的最小权限。</div>
              <div className={styles.modalActions}>
                <button className={styles.secondaryButton} type="button" onClick={() => setConnectOpen(false)}>取消</button>
                <button className={styles.primaryButton} type="submit">开始连接 <ChevronRight size={16} /></button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {policyOpen ? (
        <div className={styles.modalLayer} role="presentation">
          <button className={styles.modalBackdrop} type="button" onClick={() => setPolicyOpen(false)} aria-label="关闭治理策略窗口" />
          <section className={`${styles.modal} ${styles.policyModal}`} role="dialog" aria-modal="true" aria-labelledby="policy-title">
            <div className={styles.modalHeader}>
              <div><h2 id="policy-title">桥接与治理策略</h2><p>AgentHearth 在暴露能力前执行三道边界检查。</p></div>
              <button type="button" onClick={() => setPolicyOpen(false)} aria-label="关闭"><X size={19} /></button>
            </div>
            <div className={styles.policyList}>
              <div><ShieldCheck /><span><strong>Local-first 数据边界</strong><small>项目文件与知识索引默认只在本机读取和保存。</small></span><Check /></div>
              <div><KeyRound /><span><strong>最小权限</strong><small>每个 Agent 只获得当前项目和显式授权的工具。</small></span><Check /></div>
              <div><History /><span><strong>可审计桥接</strong><small>连接、同步与工具调用写入可追踪的运行记录。</small></span><Check /></div>
            </div>
            <button className={styles.primaryButton} type="button" onClick={() => setPolicyOpen(false)}>策略正常</button>
          </section>
        </div>
      ) : null}
    </div>
  );
}
