import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (!path) {
    return new NextResponse("Missing image path", { status: 400 });
  }

  // Determine target URL
  let targetUrl = path;
  if (!path.startsWith("http://") && !path.startsWith("https://")) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    targetUrl = `https://image.tmdb.org/t/p/w342${cleanPath}`;
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*",
      },
      next: { revalidate: 86400 },
    });

    if (!upstreamRes.ok) {
      return new NextResponse("Upstream image error", { status: upstreamRes.status });
    }

    const contentType = upstreamRes.headers.get("content-type") || "image/jpeg";
    const buffer = await upstreamRes.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new NextResponse("Failed to proxy image", { status: 502 });
  }
}
