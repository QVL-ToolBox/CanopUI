import { useEffect, useState } from "react";

export type CanopyCodecOrder = "pending" | "webm-first" | "mp4-first";

type SettledCodecOrder = Exclude<CanopyCodecOrder, "pending">;

const SCENE_FORMAT = { width: 1920, height: 1080, bitrate: 5_200_000, framerate: 24 };
const VP9_CONTENT_TYPE = 'video/webm; codecs="vp09.00.40.08"';
const H264_CONTENT_TYPE = 'video/mp4; codecs="avc1.640028"';

let settledOrder: SettledCodecOrder | undefined;
let pendingOrder: Promise<SettledCodecOrder> | undefined;

function canAskDecoder(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "mediaCapabilities" in navigator &&
    typeof navigator.mediaCapabilities?.decodingInfo === "function"
  );
}

async function decodesEfficiently(contentType: string): Promise<boolean> {
  const info = await navigator.mediaCapabilities.decodingInfo({
    type: "file",
    video: { contentType, ...SCENE_FORMAT },
  });
  return info.supported && info.powerEfficient;
}

async function askDecoder(): Promise<SettledCodecOrder> {
  try {
    const [vp9, h264] = await Promise.all([
      decodesEfficiently(VP9_CONTENT_TYPE),
      decodesEfficiently(H264_CONTENT_TYPE),
    ]);
    return !vp9 && h264 ? "mp4-first" : "webm-first";
  } catch {
    return "webm-first";
  }
}

function initialOrder(): CanopyCodecOrder {
  if (settledOrder) return settledOrder;
  return canAskDecoder() ? "pending" : "webm-first";
}

export function useVideoCodecOrder(): CanopyCodecOrder {
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    if (order !== "pending") return;
    let cancelled = false;
    pendingOrder ??= askDecoder();
    void pendingOrder.then((next) => {
      settledOrder = next;
      if (!cancelled) setOrder(next);
    });
    return () => {
      cancelled = true;
    };
  }, [order]);

  return order;
}
