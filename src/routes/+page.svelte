<script lang="ts">
  import IssueHero from "$lib/display/IssueHero.svelte";
  import StoryHero from "$lib/display/StoryHero.svelte";
  import type { Post } from "$lib/data/posts";
  import { getByline, getContributorEntries } from "$lib/helpers/formatByline";
  import { formatContributorName } from "$lib/helpers/formatContributorName";

  type Issue = {
    title?: string;
    issueNumber?: string;
    slug?: { current?: string };
    publishedAt?: string;
    heroImage?: unknown;
    stories?: Post[];
  } | null;

  export let data: { data?: Post[]; issue?: Issue };

  let issue: Issue | undefined;
  let posts: Post[] = [];
  let featured: Post | undefined;
  let supporting: Post[] = [];

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
      if (!slug) return false;
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    });
  };

  $: issue = data.issue as Issue | undefined;
  import { normalizeIssueNumber } from "$lib/helpers/formatIssueNumber";
  $: issueNumber = normalizeIssueNumber(issue?.issueNumber);
  $: issueHref = issue?.slug?.current
    ? `/issues/${issue.slug.current}`
    : `/issues`;

  // Prefer stories from the latest published issue (if present), otherwise fall back to global posts
  $: {
    const raw =
      data?.issue &&
      Array.isArray(data.issue.stories) &&
      data.issue.stories.length > 0
        ? data.issue.stories
        : data?.data;
    posts = ensureArray<Post>(raw);
    featured = posts[0];
    supporting = posts.slice(1);
  }
</script>

<svelte:head>
  <title>Let's Worm</title>
  <meta name="description" content="Let's Worm" />
</svelte:head>

{#if issue}
  <IssueHero
    title={issue.title}
    number={issueNumber}
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
    {#each posts as item (item.slug?.current ?? "")}
      <StoryHero
        title={item.title}
        byline={getByline({
          author: item.author,
          illustrator: item.illustrator,
          promptedByRole: item.promptedBy,
          formatName: (value) =>
            typeof value === "string" ? value : formatContributorName(value),
        })}
        contributors={getContributorEntries({
          author: item.author ?? item.authorDisplayName,
          illustrator: item.illustrator ?? item.illustratorDisplayName,
          promptedByRole: item.promptedBy,
          formatName: (value) =>
            typeof value === "string" ? value : formatContributorName(value),
        })}
        showContributorAvatars={true}
        excerpt={item.excerpt}
        coverImage={item?.mainImage ?? null}
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
  .issue-stories {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin: 3rem auto;
    width: 100%;
    max-width: 80rem;
  }
</style>
