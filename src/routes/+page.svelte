<script lang="ts">
  import Worm from "$lib/display/Worm.svelte";
  import type { Post } from "$lib/data/posts";
  import { urlFor } from "../sanity";

  export let data: { data?: Post[] };

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

  $: posts = ensureArray(data?.data);
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

{#if posts.length === 0}
  <section class="empty-state">
    <p>No stories available.</p>
  </section>
{:else}
  <section class="front-page">
    {#if featured}
      <div class="front-main">
        <div class="front-lead">
          <h2 class="section-heading">Lead Story</h2>
          <ul class="story-list feature-list">
            <Worm item={featured} />
          </ul>
        </div>

        {#if fallbackSection && fallbackSection.items.length > 0}
          <div class="latest-block">
            <h2 class="section-heading">Latest Dispatches</h2>
            <ul class="story-list latest-list">
              {#each fallbackSection.items as item}
                <Worm {item} />
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    {/if}

    {#if supporting.length > 0}
      <aside class="front-rail">
        <h2 class="section-heading">In Brief</h2>
        <ul class="story-list supporting-list">
          {#each supporting as item}
            <Worm {item} />
          {/each}
        </ul>
      </aside>
    {/if}
  </section>

  {#if renderBlocks.length > 0}
    <div class="section-wrap">
      {#each renderBlocks as block}
        {#if block.kind === "sets"}
          <section class="section-block">
            <header class="section-header">
              <span class="section-heading">{block.title}</span>
              <a class="section-more" href="/category/story-cycles">View all</a>
            </header>
            <ul class="auto-grid set-grid">
              {#each block.items as summary}
                <li class="set-card">
                  {#if summary.entry?.mainImage}
                    <a
                      class="set-card__media"
                      href={setHref(summary)}
                      aria-label={`Visit ${summary.title}`}
                    >
                      <img
                        src={urlFor(summary.entry.mainImage)
                          .width(512)
                          .height(288)
                          .url()}
                        alt={summary.entry?.title ?? summary.title}
                      />
                    </a>
                  {/if}
                  <h3><a href={setHref(summary)}>{summary.title}</a></h3>
                  {#if summary.description}
                    <p class="excerpt">{summary.description}</p>
                  {/if}
                </li>
              {/each}
            </ul>
          </section>
        {:else}
          <section class="section-block">
            <header class="section-header">
              {#if block.section.slug}
                <a
                  class="section-heading"
                  href={`/category/${block.section.slug}`}
                >
                  {block.section.title}
                </a>
              {:else}
                <span class="section-heading">{block.section.title}</span>
              {/if}
              {#if block.section.slug}
                <a
                  class="section-more"
                  href={`/category/${block.section.slug}`}
                >
                  View all
                </a>
              {/if}
            </header>
            <ul class="auto-grid section-grid">
              {#each block.section.items as item}
                <Worm {item} />
              {/each}
            </ul>
          </section>
        {/if}
      {/each}
    </div>
  {/if}
{/if}

<style>
  .front-page {
    display: grid;
    gap: 2.5rem;
    margin-bottom: 3rem;
  }

  @media (min-width: 960px) {
    .front-page {
      grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr);
      align-items: start;
    }
  }

  .front-main {
    display: grid;
    gap: 2.5rem;
  }

  .front-lead,
  .front-rail,
  .latest-block {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .story-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 2rem;
  }

  .feature-list {
    grid-template-columns: 1fr;
  }

  .latest-list {
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 1.75rem;
  }

  .supporting-list {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .section-heading {
    font-size: 1.25rem;
    letter-spacing: 0.08rem;
  }

  .section-wrap {
    display: grid;
    gap: 3rem;
  }

  .section-block {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .section-more {
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.1rem;
  }

  .section-grid {
    --auto-grid-min-size: 14rem;
  }

  .set-grid {
    --auto-grid-min-size: 16rem;
  }

  .set-card {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .set-card__media img {
    width: 100%;
    display: block;
  }

  .empty-state {
    margin: 4rem 0;
    text-align: center;
  }
</style>
