import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing media url parameter" }, { status: 400 });
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "*/*",
        "Accept-Encoding": "identity",
      },
      cache: "no-store",
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: `Upstream source returned HTTP ${upstreamRes.status}` },
        { status: upstreamRes.status }
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", upstreamRes.headers.get("Content-Type") || "video/mp4");

    const length = upstreamRes.headers.get("Content-Length");
    if (length) headers.set("Content-Length", length);

    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cache-Control", "no-cache");

    return new NextResponse(upstreamRes.body, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error("Download proxy error:", err);
    return NextResponse.json({ error: "Failed to pipe download media stream" }, { status: 500 });
  }
}
