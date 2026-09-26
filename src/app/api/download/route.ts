import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetUrl = body?.url;

    if (!targetUrl) {
      return NextResponse.json({ error: "Missing media url" }, { status: 400 });
    }

    const upstreamRes = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "*/*",
      },
      cache: "no-store",
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: `Upstream error: HTTP ${upstreamRes.status}` },
        { status: upstreamRes.status }
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", upstreamRes.headers.get("Content-Type") || "video/mp4");
    const len = upstreamRes.headers.get("Content-Length");
    if (len) headers.set("Content-Length", len);
    headers.set("Access-Control-Allow-Origin", "*");

    return new NextResponse(upstreamRes.body, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error("Download proxy error:", err);
    return NextResponse.json({ error: "Download stream failed" }, { status: 500 });
  }
}
