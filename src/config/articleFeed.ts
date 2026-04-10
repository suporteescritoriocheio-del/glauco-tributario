export interface ArticleImage {
  src: string;
  alt: string;
}

export interface ArticleCard {
  title: string;
  excerpt: string;
  href: string;
  category: string;
  image?: ArticleImage;
}

export interface ManualArticleFeedSource {
  type: "manual";
  articles: ArticleCard[];
}

export interface WordPressArticleFeedSource {
  type: "wordpress";
  keyword?: string;
  limit?: number;
  baseUrl?: string;
  fallbackArticles?: ArticleCard[];
}

export type ArticleFeedSource =
  | ManualArticleFeedSource
  | WordPressArticleFeedSource;

interface WordPressRenderedField {
  rendered?: string;
}

interface WordPressTerm {
  name?: string;
}

interface WordPressFeaturedMedia {
  source_url?: string;
  alt_text?: string;
}

interface WordPressEmbeddedData {
  "wp:featuredmedia"?: WordPressFeaturedMedia[];
  "wp:term"?: WordPressTerm[][];
}

interface WordPressPost {
  link?: string;
  title?: WordPressRenderedField;
  excerpt?: WordPressRenderedField;
  _embedded?: WordPressEmbeddedData;
}

const DEFAULT_WORDPRESS_BASE_URL = "https://glaucoramos.com.br";

const HTML_ENTITY_MAP: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&#039;": "'",
  "&#8217;": "'",
  "&rsquo;": "'",
  "&ldquo;": '"',
  "&rdquo;": '"',
  "&#8220;": '"',
  "&#8221;": '"',
  "&hellip;": "...",
  "&#8230;": "...",
  "&ndash;": "-",
  "&#8211;": "-",
};

function decodeHtmlEntities(value: string): string {
  return value.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    return HTML_ENTITY_MAP[entity] ?? entity;
  });
}

function stripHtml(value?: string): string {
  if (!value) {
    return "";
  }

  return decodeHtmlEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function getFirstTermName(embedded?: WordPressEmbeddedData): string {
  const termGroups = embedded?.["wp:term"] ?? [];

  for (const group of termGroups) {
    for (const term of group) {
      const name = term.name?.trim();
      if (name) {
        return name;
      }
    }
  }

  return "Artigo";
}

function mapWordPressPostToArticle(post: WordPressPost): ArticleCard | null {
  const href = post.link?.trim();
  const title = stripHtml(post.title?.rendered);

  if (!href || !title) {
    return null;
  }

  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];
  const image =
    featuredImage?.source_url?.trim()
      ? {
          src: featuredImage.source_url,
          alt: stripHtml(featuredImage.alt_text) || title,
        }
      : undefined;

  return {
    title,
    excerpt: stripHtml(post.excerpt?.rendered),
    href,
    category: getFirstTermName(post._embedded),
    image,
  };
}

export async function getArticleFeed(
  source: ArticleFeedSource,
): Promise<ArticleCard[]> {
  if (source.type === "manual") {
    return source.articles;
  }

  try {
    const endpoint = new URL("/wp-json/wp/v2/posts", source.baseUrl ?? DEFAULT_WORDPRESS_BASE_URL);
    const limit = source.limit ?? 3;

    endpoint.searchParams.set("_embed", "1");
    endpoint.searchParams.set("per_page", String(limit));
    endpoint.searchParams.set("status", "publish");
    endpoint.searchParams.set("orderby", source.keyword ? "relevance" : "date");

    if (source.keyword?.trim()) {
      endpoint.searchParams.set("search", source.keyword.trim());
    }

    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress feed request failed with ${response.status}`);
    }

    const posts = (await response.json()) as WordPressPost[];
    const articles = posts
      .map(mapWordPressPostToArticle)
      .filter((article): article is ArticleCard => article !== null);

    if (articles.length > 0) {
      return articles;
    }
  } catch {
    return source.fallbackArticles ?? [];
  }

  return source.fallbackArticles ?? [];
}
