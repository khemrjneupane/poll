import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ["content:encoded", "contentEncoded"],
      ["dc:creator", "creator"],
    ],
  },
  timeout: 10000,
});

const FEEDS = [
  //"https://www.telegraphnepal.com/feed/",
  "https://onlinetvnepal.com/feed/",
  "https://www.eadarsha.com/feed",
  "https://arthasarokar.com/feed",
  "https://www.ratopati.com/feed",
  //"https://nepalipost.com/beta/feed",
  "https://techmandu.com/feed/",
  "https://www.osnepal.com/feed",
  //"https://newsofnepal.com/feed/",
  //"https://english.onlinekhabar.com/feed",
  //"https://rajdhanidaily.com/feed/",
];

// ✅ NEW STRICT FILTER FUNCTION
function isRelevantNews(text: string) {
  const electionKeywords = [
    "चुनाव",
    "निर्वाचन",
    "निर्वाचन आयोग",
    "मतदान",
    "मतगणना",
    "उम्मेदवार",
    "भोट",
    "जनमत",
    "सभामुख",
    "प्रधानमन्त्री चयन",
    "मतपत्र",
  ];

  const genZKeywords = [
    "gen-z",
    "genz",
    "gen z",
    "जेन-जे",
    "जेनेरेशन जेड",
    "युवा मतदाता",
    "नयाँ पुस्ता",
    "new generation",
    "youth vote",
  ];

  const content = text.toLowerCase();

  const isElection = electionKeywords.some((k) => content.includes(k));
  const isGenZ = genZKeywords.some((k) => content.includes(k));

  return isElection || isGenZ;
}

// Fix XML if malformed
function sanitizeXML(xml: string) {
  return xml
    .replace(/(\s[a-zA-Z0-9-]+)=([a-zA-Z0-9-]+)/g, '$1="$2"')
    .replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, "&amp;");
}

export async function GET() {
  try {
    const feedResults = await Promise.all(
      FEEDS.map(async (url) => {
        try {
          const res = await fetch(url, { next: { revalidate: 60 } });
          const text = await res.text();
          const safeXML = sanitizeXML(text);
          const feed = await parser.parseString(safeXML);

          const filteredItems = feed.items
            .filter((item) =>
              isRelevantNews(
                (item.title || "") +
                  " " +
                  (item.contentSnippet || "") +
                  " " +
                  (item.contentEncoded || "")
              )
            )
            .slice(0, 3) // max 3 per feed
            .map((item) => {
              const imgMatch = item.contentEncoded?.match(
                /<img[^>]+src="([^">]+)"/
              );
              const image = imgMatch ? imgMatch[1] : null;
              let content = item.contentEncoded || item.contentSnippet || "";
              if (image && imgMatch) content = content.replace(imgMatch[0], "");

              return {
                title: item.title,
                link: item.link,
                author: item.creator || item["dc:creator"] || "Unknown",
                publishedAt: item.isoDate || item.pubDate,
                source: item.link
                  ? new URL(item.link).hostname.replace("www.", "")
                  : null,
                content,
                image,
              };
            });

          return filteredItems;
        } catch (err) {
          console.warn(`Failed to parse ${url}:`, err);
          return [];
        }
      })
    );

    const flattened = feedResults
      .flat()
      .sort(
        (a, b) =>
          new Date(b.publishedAt || "").getTime() -
          new Date(a.publishedAt || "").getTime()
      );

    return Response.json(flattened);
  } catch (err) {
    console.error("Feed fetch failed:", err);
    return Response.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
