import { NextResponse } from "next/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Request-ID",
  "Access-Control-Max-Age": "86400",
};

export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function jsonSuccess(
  data: unknown,
  requestId = generateRequestId(),
): NextResponse {
  return NextResponse.json(
    { success: true, code: 200, data, message: "ok", requestId },
    { status: 200, headers: corsHeaders },
  );
}

export function jsonError(
  message: string,
  status: number,
  requestId = generateRequestId(),
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      code: status,
      message,
      requestId,
      timestamp: new Date().toISOString(),
    },
    { status, headers: corsHeaders },
  );
}

export function optionsResponse(): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
