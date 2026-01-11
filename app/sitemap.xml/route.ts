// app/sitemap.xml/route.ts
export const dynamic = "force-dynamic";

type Nominee = {
  _id: string;
  updatedAt: string;
};

type NewsArticle = {
  publishedAt: string;
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isNominee(v: unknown): v is Nominee {
  if (!isObject(v)) return false;
  return typeof v._id === "string" && typeof v.updatedAt === "string";
}

function isNomineeArray(v: unknown): v is Nominee[] {
  return Array.isArray(v) && v.every(isNominee);
}

function isNewsArticle(v: unknown): v is NewsArticle {
  if (!isObject(v)) return false;
  return typeof v.publishedAt === "string";
}

function isNewsArray(v: unknown): v is NewsArticle[] {
  return Array.isArray(v) && v.every(isNewsArticle);
}

export async function GET() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // ===== Fetch nominees =====
  let nominees: Nominee[] = [];
  try {
    const res = await fetch(`${BASE_URL}/api/nominees`, { cache: "no-store" });
    if (res.ok) {
      const json: unknown = await res.json();
      // Your API wraps nominees: { data: { nominees: [...] } }
      if (
        isObject(json) &&
        isObject(json.data) &&
        isNomineeArray((json.data as Record<string, unknown>).nominees)
      ) {
        nominees = (json.data as Record<string, unknown>).nominees as Nominee[];
      }
    }
  } catch (err) {
    // swallow — sitemap will fallback to timestamps below
    // optionally log: console.error("Nominees fetch error", err);
  }

  // latest nominee update time (fallback to now)
  const latestNomineeMillis =
    nominees.length > 0
      ? Math.max(...nominees.map((n) => new Date(n.updatedAt).getTime()))
      : Date.now();
  const latestNomineeDate = new Date(latestNomineeMillis).toISOString();

  // ===== Fetch news =====
  let latestNewsDate = new Date().toISOString();
  try {
    const res = await fetch(`${BASE_URL}/api/news`, { cache: "no-store" });
    if (res.ok) {
      const json: unknown = await res.json();
      // Your /api/news returns an array directly — adjust if different
      if (isNewsArray(json)) {
        const latest = Math.max(
          ...json.map((a) => new Date(a.publishedAt).getTime())
        );
        latestNewsDate = new Date(latest).toISOString();
      } else if (
        isObject(json) &&
        Array.isArray((json as Record<string, unknown>).articles)
      ) {
        const articles = (json as Record<string, unknown>)
          .articles as unknown[];
        if (isNewsArray(articles)) {
          const latest = Math.max(
            ...articles.map((a) => new Date(a.publishedAt).getTime())
          );
          latestNewsDate = new Date(latest).toISOString();
        }
      }
    }
  } catch (err) {
    // optionally log error
  }

  // ===== Static pages that depend on nominees or news =====
  const staticPages = [
    { loc: `${BASE_URL}/`, lastmod: latestNomineeDate },
    { loc: `${BASE_URL}/nominees`, lastmod: latestNomineeDate },
    { loc: `${BASE_URL}/vote`, lastmod: latestNomineeDate },
    { loc: `${BASE_URL}/results`, lastmod: latestNomineeDate },

    // news page updated by latestNewsDate
    { loc: `${BASE_URL}/news`, lastmod: latestNewsDate },

    // about may be tied to news updates (adjust if needed)
    { loc: `${BASE_URL}/about`, lastmod: latestNewsDate },
  ];

  // ===== Dynamic nominee pages =====
  const nomineePagesXml = nominees
    .map(
      (n) => `
    <url>
      <loc>${BASE_URL}/nominees/${n._id}</loc>
      <lastmod>${new Date(n.updatedAt).toISOString()}</lastmod>
    </url>`
    )
    .join("");

  // ===== Build sitemap XML =====
  const staticXml = staticPages
    .map(
      (p) => `
    <url>
      <loc>${p.loc}</loc>
      <lastmod>${p.lastmod}</lastmod>
    </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${nomineePagesXml}
</urlset>`.trim();

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
