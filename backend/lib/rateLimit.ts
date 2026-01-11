// Simple in-memory rate limiter (per IP)
const isDev = process.env.NODE_ENV !== "production";

// In dev: 2 requests / 5s (quick testing)
// In prod: 60 requests / 60s (sane real-world limit)
const rateLimitWindowMs = isDev ? 5 * 1000 : 60 * 1000;
const maxRequests = isDev ? 2 : 60;

const ipRequestMap = new Map<string, { count: number; startTime: number }>();

export function rateLimit(ip: string): {
  success: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const record = ipRequestMap.get(ip);

  if (!record) {
    ipRequestMap.set(ip, { count: 1, startTime: now });
    return { success: true };
  }

  const elapsed = now - record.startTime;

  if (elapsed < rateLimitWindowMs) {
    if (record.count >= maxRequests) {
      const retryAfter = Math.ceil((rateLimitWindowMs - elapsed) / 1000);
      return { success: false, retryAfter };
    }
    record.count++;
    return { success: true };
  } else {
    // Reset window
    ipRequestMap.set(ip, { count: 1, startTime: now });
    return { success: true };
  }
}
