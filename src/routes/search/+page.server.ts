import type { PageServerLoad } from "./$types";
import client from "../../sanity";

const buildContributorName = (person: {
  name?: string | null;
  givenName?: string | null;
  middleName?: string | null;
  familyName?: string | null;
}) => {
  if (person?.name) return person.name;
  return [person?.givenName, person?.middleName, person?.familyName]
    .filter(Boolean)
    .join(" ")
    .trim();
};

const normalizeQuery = (value: string) => value.replace(/\s+/g, " ").trim();

const findMatchIndex = (text: string, terms: string[]) => {
  const lower = text.toLowerCase();
  let best = -1;
  for (const term of terms) {
    const idx = lower.indexOf(term.toLowerCase());
    if (idx !== -1 && (best === -1 || idx < best)) {
      best = idx;
    }
  }
  return best;
};

const buildSnippet = (text: string | null | undefined, query: string) => {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  const terms = normalizeQuery(query).split(" ").filter(Boolean);
  if (terms.length === 0) return trimmed.slice(0, 160);
  const idx = findMatchIndex(trimmed, terms);
  const maxLength = 180;
  if (idx === -1) {
    return trimmed.length > maxLength
      ? `${trimmed.slice(0, maxLength)}...`
      : trimmed;
  }
  const start = Math.max(0, idx - 70);
  const end = Math.min(trimmed.length, idx + terms[0].length + 70);
  let snippet = trimmed.slice(start, end).trim();
  if (start > 0) snippet = `...${snippet}`;
  if (end < trimmed.length) snippet = `${snippet}...`;
  return snippet;
};

// Find the best matching snippet from multiple field options
const findBestSnippet = (
  query: string,
  fields: Array<{ text: string | null | undefined; priority: number }>
) => {
  const terms = normalizeQuery(query).split(" ").filter(Boolean);
  const candidates = fields
    .filter((f) => f.text)
    .map((f) => {
      const idx = findMatchIndex(f.text!, terms);
      return { text: f.text!, idx, priority: f.priority };
    })
    .sort((a, b) => {
      // Sort by whether it contains match (has match comes first)
      if ((a.idx !== -1) !== (b.idx !== -1)) {
        return a.idx !== -1 ? -1 : 1;
      }
      // Then by priority
      return b.priority - a.priority;
    });

  if (candidates.length === 0) return null;
  return buildSnippet(candidates[0].text, query);
};

type ContributorRef = {
  name?: string | null;
  givenName?: string | null;
  middleName?: string | null;
  familyName?: string | null;
};

type PostResult = {
  _id: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  excerpt?: string | null;
  mainImage?: Record<string, unknown> | null;
  promptedBy?: "art" | "writing" | null;
  bodyText?: string | null;
  author?: ContributorRef | null;
  illustrator?: ContributorRef | null;
};

type PageResult = {
  _id: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  hero?: { heroImage?: Record<string, unknown> | null } | null;
  bodyText?: string | null;
  heroHeading?: string | null;
  heroTagline?: string | null;
};

type ContributorResult = ContributorRef & {
  _id: string;
  slug?: { current?: string | null } | null;
  image?: Record<string, unknown> | null;
};

export const load: PageServerLoad = async ({ url }) => {
  const rawQuery = url.searchParams.get("q") ?? "";
  const query = normalizeQuery(rawQuery);

  if (!query) {
    return { query, results: [] };
  }

  const match = `${query}*`;

  const [posts, pages, contributors] = await Promise.all([
    client.fetch(
      `
      *[_type == "post" && (
        title match $match ||
        excerpt match $match ||
        pt::text(body) match $match ||
        author->name match $match ||
        illustrator->name match $match
      )] | order(publishedAt desc)[0...50]{
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        promptedBy,
        "bodyText": pt::text(body),
        "author": author->{name, givenName, middleName, familyName},
        "illustrator": illustrator->{name, givenName, middleName, familyName}
      }
    `,
      { match }
    ),
    client.fetch(
      `
      *[_type == "page" && (
        title match $match ||
        pt::text(body) match $match ||
        hero.heading match $match ||
        hero.tagline match $match
      )] | order(_updatedAt desc)[0...50]{
        _id,
        title,
        slug,
        hero,
        "bodyText": pt::text(body),
        "heroHeading": hero.heading,
        "heroTagline": hero.tagline
      }
    `,
      { match }
    ),
    client.fetch(
      `
      *[_type == "author" && (
        name match $match ||
        givenName match $match ||
        middleName match $match ||
        familyName match $match
      )] | order(familyName asc, givenName asc)[0...50]{
        _id,
        name,
        givenName,
        middleName,
        familyName,
        slug,
        image
      }
    `,
      { match }
    ),
  ]);

  const storyResults = (posts ?? []).map((post: PostResult) => {
    const authorName = buildContributorName(post.author ?? {});
    const illustratorName = buildContributorName(post.illustrator ?? {});
    const byline = [authorName, illustratorName].filter(Boolean).join(" & ");

    const snippetSource =
      post.excerpt ||
      findBestSnippet(query, [
        { text: post.title, priority: 3 },
        { text: post.bodyText, priority: 2 },
        { text: authorName, priority: 1 },
        { text: illustratorName, priority: 1 },
      ]) ||
      (byline ? `${byline}` : null);

    return {
      id: post._id,
      type: "Story",
      title: post.title ?? "Untitled",
      url: post.slug?.current ? `/${post.slug.current}` : "#",
      image: post.mainImage ?? null,
      snippet: snippetSource,
      meta: byline ? `${byline}` : null,
      bodyText: post.bodyText,
    };
  });

  const pageResults = (pages ?? []).map((page: PageResult) => {
    const snippetSource = findBestSnippet(query, [
      { text: page.title, priority: 3 },
      { text: page.heroHeading, priority: 3 },
      { text: page.heroTagline, priority: 2 },
      { text: page.bodyText, priority: 1 },
    ]);
    return {
      id: page._id,
      type: "Page",
      title: page.title ?? "Untitled",
      url: page.slug?.current ? `/pages/${page.slug.current}` : "#",
      image: page.hero?.heroImage ?? null,
      snippet: snippetSource,
      meta: null,
      bodyText: page.bodyText,
    };
  });

  const contributorResults = (contributors ?? []).map(
    (person: ContributorResult) => {
      const name = buildContributorName(person) || "Contributor";
    return {
      id: person._id,
      type: "Contributor",
      title: name,
      url: person.slug?.current ? `/contributors/${person.slug.current}` : "#",
      image: person.image ?? null,
      snippet: null,
      meta: "Contributor",
      givenName: person.givenName ?? null,
      familyName: person.familyName ?? null,
    };
    }
  );

  const results = [...contributorResults, ...storyResults, ...pageResults];

  return { query, results };
};
