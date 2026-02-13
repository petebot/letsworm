<script lang="ts">
  import IssueCard from "$lib/display/IssueCard.svelte";
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
  <div class="issues-grid">
    {#each issues as issue (issue.slug?.current ?? issue.issueNumber ?? issue.title)}
      <IssueCard
        title={issue.title}
        number={normalizeIssueNumber(issue.issueNumber)}
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
  .issues-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.75rem;
    margin: 2.5rem auto 4rem;
    width: min(100%, 72rem);
    padding: 0 1.5rem;
    box-sizing: border-box;
  }
</style>
