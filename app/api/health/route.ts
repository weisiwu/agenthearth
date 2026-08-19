import { NextRequest } from "next/server";
import {
  generateRequestId,
  jsonError,
  jsonSuccess,
  optionsResponse,
} from "@/lib/api-shared";

export { optionsResponse as OPTIONS };

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("X-Request-ID") || generateRequestId();

  try {
    return jsonSuccess(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "agenthearth-web",
        product: "AgentHearth",
        release: "0.3.0",
        uptime: Math.round(process.uptime()),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: "MB",
        },
      },
      requestId,
    );
  } catch (error) {
    console.error("[Health] Error:", error);
    return jsonError("Health check failed", 500, requestId);
  }
}
