// lib/fingerprint.ts
import Cookies from "js-cookie";

export async function computeFingerprint(): Promise<string> {
  const voterId = Cookies.get("nominee_id") || "";
  const baseData = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    screen.colorDepth,
    screen.width,
    screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency || 0,
    voterId,
  ].join("|");

  const fullString = baseData; // + "|" + geoData + "|" + canvasData;

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(fullString)
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
