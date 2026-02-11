<script lang="ts">
  import IssueHero from "$lib/display/IssueHero.svelte";
  import { urlFor } from "../../sanity";
  import { normalizeIssueNumber } from "$lib/helpers/formatIssueNumber";

  export let data: { issues?: Array<any> };
  const issues = data?.issues ?? [];
</script>

<svelte:head>
  <title>Issues — Let's Worm</title>
  <meta name="description" content="Archive of published issues" />
</svelte:head>

{#if issues.length === 0}
  <section class="empty-state">
    <p>No issues available.</p>
  </section>
{:else}
  <div class="issues-archive">
    {#each issues as issue (issue.slug?.current ?? issue.issueNumber ?? issue.title)}
      <IssueHero
        title={issue.title}
        number={normalizeIssueNumber(issue.issueNumber)}
        issueImageUrl={issue.heroImage
          ? urlFor(issue.heroImage).width(1200).url()
          : null}
        href={issue.slug?.current ? `/issues/${issue.slug.current}` : `/issues`}
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
  .issues-archive {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    margin: 2.5rem auto;
    width: 100%;
    max-width: 64rem;
  }
</style>
