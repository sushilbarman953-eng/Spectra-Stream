import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "movie";
  const season = searchParams.get("season") || "1";
  const episode = searchParams.get("episode") || "1";
  const server = searchParams.get("server") || "vidlink";

  // Multi-server direct stream mappings
  // In production, these resolve to direct m3u8 streams or extractor pipelines
  const STREAM_SOURCES: Record<string, string> = {
    vidlink: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`,
    vidsrc: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
    "2embed": `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4`,
    autoembed: `https://test-streams.mux.dev/test_001/stream.m3u8`,
  };

  const streamUrl = STREAM_SOURCES[server] || STREAM_SOURCES["vidlink"];

  return NextResponse.json({
    success: true,
    server,
    streamUrl,
    title: `${id} (${type})`,
  });
}
