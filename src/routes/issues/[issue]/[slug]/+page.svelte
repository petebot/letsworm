<script lang="ts">
  import PrevNext from "$lib/nav/PrevNext.svelte";
  import { urlFor } from "../../../../sanity";
  import { PortableText } from "@portabletext/svelte";
  import InlineImage from "$lib/display/InlineImage.svelte";
  import { normalizeIssueNumber } from "$lib/helpers/formatIssueNumber";
  import { getBylinePartsWithLabels } from "$lib/helpers/formatByline";

  export let data: any;

  let post = data.data.post;
  let relatedPosts = data.data.relatedPosts ?? [];
  let suitePosts = data.data.suitePosts ?? [];
  let issue = data.data.issue ?? null;

  $: bylineParts = getBylinePartsWithLabels({
    author: post?.author,
    illustrator: post?.illustrator,
    promptedByRole: post?.promptedBy,
  });

  function formatDate(dateString: string): string {
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  let previousPost: { slug: { current: any }; title: any } | null = null;
  let nextPost: { slug: { current: any }; title: any } | null = null;

  $: if (suitePosts && post && post.publishedAt) {
    suitePosts.sort(
      (a: any, b: any) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
    );
    const currentIndex = suitePosts.findIndex(
      (p: any) => p.slug?.current === post.slug?.current,
    );
    previousPost = suitePosts[currentIndex - 1] ?? null;
    nextPost = suitePosts[currentIndex + 1] ?? null;
  }
</script>

<main>
  <PrevNext {previousPost} {nextPost}></PrevNext>
  {#if post}
    {#if post.title}
      <h1>{post.title}</h1>
    {/if}
    {#if post.mainImage && post.mainImage.asset}
      <img src={urlFor(post.mainImage).url()} alt={post.title} />
    {/if}
    <div class="metadata">
      {#if post.publishedAt}
        <p>{formatDate(post.publishedAt)}</p>
      {/if}
      {#each bylineParts as part}
        <p>{part.label} {part.name}</p>
      {/each}
      {#if issue}
        <p>From Issue Nº {normalizeIssueNumber(issue.issueNumber)}</p>
      {/if}
      {#if post.categories}
        {#each post.categories as category}
          <p>{category.title}</p>
        {/each}
      {/if}
    </div>

    {#if post.body}
      <div class="write">
        <PortableText
          value={post.body}
          components={{ types: { image: InlineImage } }}
        />
      </div>
    {/if}
    <PrevNext {previousPost} {nextPost}></PrevNext>

    {#if relatedPosts.length > 0}
      <section>
        <h3>Related</h3>
        <div class="auto-grid">
          {#each relatedPosts as item}
            <!-- reuse Worm component if appropriate or simple link -->
            <a href={item.slug?.current ? `/${item.slug.current}` : "#"}
              >{item.title}</a
            >
          {/each}
        </div>
      </section>
    {/if}
  {:else}
    <p>Story not found.</p>
  {/if}
</main>

<style>
  main {
    margin: 2rem auto;
    padding: 0 1rem;
    max-width: 64rem;
  }
  img {
    max-width: 100%;
  }
  .write {
    font-size: 1.4rem;
  }
</style>
