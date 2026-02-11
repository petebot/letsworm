<script lang="ts">
  import Worm from "$lib/display/Worm.svelte";
  import IssueHero from "$lib/display/IssueHero.svelte";
  import StoryHero from "$lib/display/StoryHero.svelte";
  import type { Post } from "$lib/data/posts";
  import { urlFor } from "../sanity";

  export let data: { data?: Post[]; issue?: any };

  const MAX_SUPPORTING_STORIES = 3;
  const MAX_SECTION_STORIES = 4;
  const MAX_SET_SUMMARIES = 4;
  const FALLBACK_SECTION_KEY = "__latest";
  const SETS_SLUG = "sets";

  type OrderedSection = {
    title: string;
    slug?: string;
    items: Post[];
    order: number;
    isFallback?: boolean;
  };

  type SetSummary = {
    id: string;
    title: string;
    slug?: string;
    description?: string;
    entry?: Post;
    order: number;
  };

  type RenderBlock =
    | { kind: "sets"; title: string; order: number; items: SetSummary[] }
    | { kind: "section"; order: number; section: OrderedSection };

  const ensureArray = <T,>(value: T[] | undefined | null): T[] =>
    Array.isArray(value) ? value : [];

  const slugValue = (slug?: { current?: string }): string =>
    slug?.current ?? "";

  const publishedTime = (value?: string): number => {
    const parsed = value ? Date.parse(value) : NaN;
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const uniqueBySlug = (items: Post[]): Post[] => {
    const seen = new Set<string>();
    return items.filter((item) => {
      const slug = item?.slug?.current;
      if (!slug) {
        return false;
      }
      if (seen.has(slug)) {
        return false;
      }
      seen.add(slug);
      return true;
    });
  };

  $: issue = data.issue;
  $: issueImage = issue?.heroImage
    ? urlFor(issue.heroImage).width(1600).url()
    : null;
  $: issueNumber = issue?.issueNumber ? parseInt(issue.issueNumber, 10) : "";
  $: issueHref = issue?.slug?.current
    ? `/issues/${issue.slug.current}`
    : `/issues`;

  const buildSections = (items: Post[]) => {
    const sections = new Map<string, OrderedSection>();
    let nextOrder = 0;
    const setPosts: Post[] = [];
    let setsMeta: { title: string; order: number } | undefined;

    for (const item of items) {
      if (!item) continue;

      const categories = ensureArray(item.categories);
      if (categories.length === 0) {
        if (!sections.has(FALLBACK_SECTION_KEY)) {
          sections.set(FALLBACK_SECTION_KEY, {
            title: "Latest Dispatches",
            items: [],
            order: nextOrder++,
            isFallback: true,
          });
        }
        const fallback = sections.get(FALLBACK_SECTION_KEY);
        if (
          fallback &&
          !fallback.items.some(
            (existing) => existing?.slug?.current === item?.slug?.current,
          )
        ) {
          fallback.items.push(item);
        }
        continue;
      }

      for (const category of categories) {
        if (!category) continue;
        const slug = category.slug?.current;
        if (slug === SETS_SLUG) {
          if (!setsMeta) {
            setsMeta = {
              title: category.title ?? "Sets",
              order: nextOrder++,
            };
          }
          setPosts.push(item);
          continue;
        }

        const key =
          category._id ??
          slug ??
          `${category.title ?? "category"}-${nextOrder}`;

        if (!sections.has(key)) {
          sections.set(key, {
            title: category.title ?? "More Stories",
            slug,
            items: [],
            order: nextOrder++,
          });
        }

        const section = sections.get(key);
        if (
          section &&
          !section.items.some(
            (existing) => existing?.slug?.current === item?.slug?.current,
          )
        ) {
          section.items.push(item);
        }
      }
    }

    const orderedSections = Array.from(sections.values())
      .map((section) => ({
        ...section,
        items: section.items
          .filter(Boolean)
          .sort(
            (first, second) =>
              publishedTime(second?.publishedAt) -
              publishedTime(first?.publishedAt),
          )
          .slice(0, MAX_SECTION_STORIES),
      }))
      .filter((section) => section.items.length > 0)
      .sort((a, b) => a.order - b.order);

    let fallback: OrderedSection | undefined;
    const standard: OrderedSection[] = [];

    for (const section of orderedSections) {
      if (section.isFallback) {
        fallback = section;
      } else {
        standard.push(section);
      }
    }

    return {
      sections: standard,
      fallback,
      setPosts: uniqueBySlug(setPosts),
      setsMeta,
    };
  };

  const buildSetSummaries = (items: Post[]): SetSummary[] => {
    const summaries = new Map<string, SetSummary>();
    let order = 0;

    for (const item of items) {
      const cycles = ensureArray(item.storyCycleName);
      if (cycles.length === 0) continue;

      for (const cycle of cycles) {
        if (!cycle) continue;
        const id =
          cycle._id ??
          slugValue(cycle.slug) ??
          `${cycle.title ?? "cycle"}-${order}`;

        if (!summaries.has(id)) {
          summaries.set(id, {
            id,
            title: cycle.title ?? "Untitled Set",
            slug: slugValue(cycle.slug),
            description: cycle.description ?? item.excerpt,
            entry: item,
            order: order++,
          });
          continue;
        }

        const summary = summaries.get(id);
        if (!summary) continue;

        if (
          publishedTime(item.publishedAt) >
          publishedTime(summary.entry?.publishedAt)
        ) {
          summary.entry = item;
        }
        if (!summary.description && cycle.description) {
          summary.description = cycle.description;
        }
      }
    }

    return Array.from(summaries.values())
      .sort((a, b) => a.order - b.order)
      .slice(0, MAX_SET_SUMMARIES);
  };

  const setHref = (summary: SetSummary): string => {
    if (summary.slug) {
      return `/category/story-cycles#${summary.slug}`;
    }
    const entrySlug = summary.entry?.slug?.current;
    return entrySlug ? `/${entrySlug}` : "/category/story-cycles";
  };

  // Prefer stories from the latest published issue (if present), otherwise fall back to global posts
  $: posts = ensureArray(
    data?.issue &&
      Array.isArray(data.issue.stories) &&
      data.issue.stories.length > 0
      ? data.issue.stories
      : data?.data,
  );
  $: featured = posts[0];
  $: supporting = posts.slice(1, MAX_SUPPORTING_STORIES + 1);

  let sections: OrderedSection[] = [];
  let fallbackSection: OrderedSection | undefined;
  let setSummaries: SetSummary[] = [];
  let setsMeta: { title: string; order: number } | undefined;

  $: {
    const afterSupporting = posts.slice(1 + MAX_SUPPORTING_STORIES);
    const result = buildSections(afterSupporting);
    sections = result.sections;
    fallbackSection = result.fallback;
    setsMeta = result.setsMeta;
    setSummaries = buildSetSummaries(result.setPosts);
  }

  $: renderBlocks = (() => {
    const blocks: RenderBlock[] = [];

    if (setsMeta && setSummaries.length > 0) {
      blocks.push({
        kind: "sets",
        title: setsMeta.title,
        order: setsMeta.order,
        items: setSummaries,
      });
    }

    for (const section of sections) {
      blocks.push({
        kind: "section",
        order: section.order,
        section,
      });
    }

    return blocks.sort((a, b) => a.order - b.order);
  })();
</script>

<svelte:head>
  <title>Let's Worm</title>
  <meta name="description" content="Let's Worm" />
</svelte:head>

{#if issue}
  <IssueHero
    title={issue.title}
    number={issueNumber}
    issueImageUrl={issueImage}
    href={issueHref}
    link={false}
  />
{:else}
  <p>No issue available</p>
{/if}

{#if posts.length === 0}
  <section class="empty-state">
    <p>No stories available.</p>
  </section>
{:else}
  <div class="issue-stories">
    {#each posts as item (item?.slug?.current)}
      <StoryHero
        title={item.title}
        byline={item.author}
        excerpt={item.excerpt}
        coverUrl={item?.mainImage ? urlFor(item.mainImage).width(1600).url() : null}
        href={item?.slug?.current ? `/${item.slug.current}` : null}
        link={true}
      />
    {/each}
  </div>
{/if}

<style>
  .empty-state {
    margin: 4rem 0;
    text-align: center;
  }
</style>
