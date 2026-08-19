import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HearthDashboard } from "@/components/hearth/HearthDashboard";

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe("AgentHearth V3 dashboard", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("renders the complete runtime overview", () => {
    render(<HearthDashboard />);

    expect(screen.getByRole("heading", { name: "本机运行时，一切就绪" })).toBeInTheDocument();
    expect(screen.getByText("Project Connector")).toBeInTheDocument();
    expect(screen.getByText("Agent 连接")).toBeInTheDocument();
    expect(screen.getByText("治理状态")).toBeInTheDocument();
  });

  it("opens and submits the project connection flow", () => {
    render(<HearthDashboard />);

    fireEvent.click(screen.getAllByRole("button", { name: /连接新项目/ })[0]);
    expect(screen.getByRole("dialog", { name: "连接新项目" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Git 仓库地址"), {
      target: { value: "https://github.com/weisiwu/packflow" },
    });
    fireEvent.click(screen.getByRole("button", { name: /开始连接/ }));

    expect(screen.queryByRole("dialog", { name: "连接新项目" })).not.toBeInTheDocument();
  });

  it("opens the governance policy details", () => {
    render(<HearthDashboard />);
    fireEvent.click(screen.getByRole("button", { name: /查看策略/ }));
    expect(screen.getByRole("dialog", { name: "桥接与治理策略" })).toBeInTheDocument();
    expect(screen.getByText("Local-first 数据边界")).toBeInTheDocument();
  });
});
