import { NextRequest } from "next/server";
import { createProxyHandler } from "../../../proxy-utils";

export const dynamic = "force-dynamic";

const proxyHandler = createProxyHandler("reviews");

export async function GET(request: NextRequest) {
  return proxyHandler(request);
}

export async function POST(request: NextRequest) {
  return proxyHandler(request);
}

export async function PATCH(request: NextRequest) {
  return proxyHandler(request);
}

export async function DELETE(request: NextRequest) {
  return proxyHandler(request);
}
