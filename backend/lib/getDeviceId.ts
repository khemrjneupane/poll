/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getDeviceId(): Promise<string> {
  const nav = navigator;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "unknown";

  const components = [
    `ua:${normalizeUserAgent(nav.userAgent)}`,
    `platform:${nav.platform || "unknown"}`,
    `lang:${nav.language || "unknown"}`,
    `tz:${tz}`,
    `offset:${new Date().getTimezoneOffset()}`,
    `screen:${screen.width}x${screen.height}`,
    `ratio:${window.devicePixelRatio || 1}`,
    `touch:${"ontouchstart" in window}`,
    `maxTouch:${nav.maxTouchPoints ?? 0}`,
  ].join("|");

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(components)
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

/**
 * Normalize user agent for consistency under Firefox RFP.
 */
function normalizeUserAgent(ua: string): string {
  try {
    // Remove minor version noise
    return ua
      .replace(/\/[\d.]+/g, "/x")
      .replace(/[\d.]+/g, "x")
      .toLowerCase();
  } catch {
    return "ua:unknown";
  }
}
