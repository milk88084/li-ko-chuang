// Max's latest Medium posts, read from the profile's RSS feed on the server.
// Pages call this directly so the articles are in the HTML (and therefore
// visible to search engines), and /api/medium-rss wraps it for anything that
// still wants JSON. The feed is cached for an hour.

const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME ?? "dearno.3";

export interface MediumArticle {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  categories: string[];
}

function extractCDATA(xml: string, tag: string): string {
  const regex = new RegExp(
    `<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`,
  );
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

/**
 * Medium RSS thumbnail priority:
 * 1. <media:thumbnail url="..."/>
 * 2. <media:content url="..." medium="image"/>
 * 3. First <img> in <content:encoded>
 * 4. First <img> in <description>
 */
function extractThumbnail(item: string): string {
  // 1. media:thumbnail
  const mediaThumbnail = item.match(/<media:thumbnail[^>]+url="([^"]+)"/);
  if (mediaThumbnail) return mediaThumbnail[1];

  // 2. media:content with image
  const mediaContent = item.match(
    /<media:content[^>]+url="([^"]+)"[^>]*medium="image"/,
  );
  if (mediaContent) return mediaContent[1];

  // Also try reversed attribute order
  const mediaContent2 = item.match(
    /<media:content[^>]+medium="image"[^>]+url="([^"]+)"/,
  );
  if (mediaContent2) return mediaContent2[1];

  // 3. First <img> in content:encoded
  const contentEncoded = extractCDATA(item, "content:encoded");
  if (contentEncoded) {
    const imgMatch = contentEncoded.match(/<img[^>]+src="([^"]+)"/);
    if (imgMatch) return imgMatch[1];
  }

  // 4. First <img> in description
  const description = extractCDATA(item, "description");
  const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
  return imgMatch ? imgMatch[1] : "";
}

function extractCategories(xml: string): string[] {
  const categories: string[] = [];
  const regex = /<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    categories.push(match[1].trim());
  }
  return categories.slice(0, 3);
}

/** Up to `limit` of the newest posts; an empty list if the feed is down. */
export async function getMediumArticles(limit = 10): Promise<MediumArticle[]> {
  try {
    const res = await fetch(`https://medium.com/feed/@${MEDIUM_USERNAME}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const articles: MediumArticle[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && articles.length < limit) {
      const item = match[1];
      articles.push({
        title: extractCDATA(item, "title"),
        link: extractTag(item, "link"),
        pubDate: extractTag(item, "pubDate"),
        thumbnail: extractThumbnail(item),
        categories: extractCategories(item),
      });
    }
    return articles;
  } catch (error) {
    console.error("[medium] fetch/parse failed:", error);
    return [];
  }
}
