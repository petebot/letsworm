<script lang="ts">
  import IssueHero from "$lib/display/IssueHero.svelte";
  import StoryHero from "$lib/display/StoryHero.svelte";
  import { urlFor } from "../../../sanity";
  import { normalizeIssueNumber } from "$lib/helpers/formatIssueNumber";

  export let data: { issue?: any };
  const issue = data?.issue ?? null;

  const issueImage = issue?.heroImage
    ? urlFor(issue.heroImage as any)
        .width(1600)
        .url()
    : null;

  const getByline = (item: any): string | undefined => {
    const writer = item.writer ?? undefined;
    const illustrator = item.illustrator ?? undefined;
    if (writer && illustrator) return `${writer} & ${illustrator}`;
    return writer ?? illustrator ?? item.author ?? undefined;
  };
</script>

<svelte:head>
  <title>{issue?.title ?? "Issue"} — Let's Worm</title>
  <meta name="description" content={issue?.title ?? "Issue"} />
</svelte:head>

{#if issue}
  <IssueHero
    title={issue.title}
    number={normalizeIssueNumber(issue.issueNumber)}
    issueImageUrl={issueImage}
    href={null}
    link={false}
  />

  {#if Array.isArray(issue.stories) && issue.stories.length > 0}
    <div class="issue-stories">
      {#each issue.stories as item (item.slug?.current ?? item.title)}
        <StoryHero
          title={item.title}
          byline={getByline(item)}
          excerpt={item.excerpt}
          coverUrl={item?.mainImage
            ? urlFor(item.mainImage).width(1600).url()
            : null}
          href={item?.slug?.current ? `/${item.slug.current}` : null}
          link={true}
        />
      {/each}
    </div>
  {:else}
    <section class="empty-state">
      <p>No stories in this issue.</p>
    </section>
  {/if}
{:else}
  <section class="empty-state">
    <p>Issue not found.</p>
  </section>
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
