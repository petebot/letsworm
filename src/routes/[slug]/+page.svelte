<script lang="ts">
  import PrevNext from "$lib/nav/PrevNext.svelte";

  import Worm from "$lib/display/Worm.svelte";
  import { urlFor } from "../../sanity";
  import { PortableText } from "@portabletext/svelte";
  import InlineImage from "$lib/display/InlineImage.svelte";
  import { getContributorEntries } from "$lib/helpers/formatByline";
  import { formatContributorName } from "$lib/helpers/formatContributorName";
  import ContributorLink from "$lib/display/ContributorLink.svelte";

  export let data: any;

  let worm: any;
  let relatedWorms: string | any[] = [];
  let suitePosts: any[] = [];
  let previousPost: { slug: { current: any }; title: any } | null = null;
  let nextPost: { slug: { current: any }; title: any } | null = null;

  $: contributorEntries = getContributorEntries({
    author: worm?.author ?? worm?.authorDisplayName,
    illustrator: worm?.illustrator ?? worm?.illustratorDisplayName,
    promptedByRole: worm?.promptedBy,
    formatName: (value) =>
      typeof value === "string" ? value : formatContributorName(value),
  });

  function formatDate(dateString: string): string {
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  $: {
    worm = data.data.post;
    relatedWorms = data.data.relatedPosts;
    suitePosts = data.data.suitePosts;

    updatePreviousNextPosts();
  }

  function updatePreviousNextPosts() {
    if (suitePosts && suitePosts.length > 0 && worm && worm.publishedAt) {
      suitePosts.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
      const currentIndex = suitePosts.findIndex(
        (post) =>
          new Date(post.publishedAt).getTime() ===
          new Date(worm.publishedAt).getTime(),
      );
      if (currentIndex !== -1) {
        previousPost = suitePosts[currentIndex - 1] || null;
        nextPost = suitePosts[currentIndex + 1] || null;
      }
    }
  }
</script>

<main>
  <PrevNext {previousPost} {nextPost}></PrevNext>
  {#if worm}
    {#if worm.title}
      <h1>{worm.title}</h1>
    {/if}
    {#if worm.mainImage && worm.mainImage.asset}
      <img src={urlFor(worm.mainImage).url()} alt={worm.title} />
    {/if}
    <div class="metadata">
      {#if worm.publishedAt}
        <p class="meta-item">{formatDate(worm.publishedAt)}</p>
      {/if}
      {#if contributorEntries.length > 0}
        <div class="meta-contributors">
          {#each contributorEntries as entry (entry.role + entry.name)}
            <ContributorLink
              contributor={entry.person ?? entry.name}
              label={entry.label}
              showAvatar={true}
              avatarSize="small"
            />
          {/each}
        </div>
      {/if}
      {#if worm.categories}
        {#each worm.categories as category}
          <p class="meta-item">{category.title}</p>
        {/each}
      {/if}
    </div>
    {#if worm.body}
      <div class="write">
        <PortableText
          value={worm.body}
          components={{ types: { image: InlineImage } }}
        />
      </div>
    {/if}
    <PrevNext {previousPost} {nextPost}></PrevNext>

    {#if relatedWorms.length > 0}
      <section>
        <h3>Related Worms</h3>
        <div class="auto-grid">
          {#each relatedWorms as item}
            <Worm {item} />
          {/each}
        </div>
      </section>
    {/if}
  {:else}
    <p>Loading worm...</p>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem auto;
    padding: 0 1rem;
    max-width: 64rem;
  }
  img {
    max-width: 100%;
  }
  .write {
    font-size: 1.2rem;
  }
  .metadata {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-self: stretch;
    margin: 1.5rem 0;
  }
  .meta-item {
    margin: 0;
    color: var(--color-text-subtle);
    font-size: 0.95rem;
    letter-spacing: 0.04em;
  }
  .meta-contributors {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
</style>
