<script lang="ts">
  import { PortableText } from "@portabletext/svelte";
  import InlineImage from "$lib/display/InlineImage.svelte";
  import { urlFor } from "../../sanity";

  export let data: { page?: any };
  const page = data?.page ?? null;
</script>

<svelte:head>
  <title>{page?.title ?? "About"} — Let's Worm</title>
  <meta name="description" content={page?.title ?? "About Let's Worm"} />
</svelte:head>

{#if page}
  <main class="page-content">
    {#if page.hero?.heading}
      <header
        class="page-hero"
        style={page.hero?.heroImage
          ? `background-image: url('${urlFor(page.hero.heroImage).url()}')`
          : ""}
      >
        <div class="hero-overlay">
          <h1>{page.hero.heading}</h1>
          {#if page.hero.tagline}
            <p class="tagline">{page.hero.tagline}</p>
          {/if}
        </div>
      </header>
    {:else if page.title}
      <header class="page-hero">
        <h1>{page.title}</h1>
      </header>
    {/if}

    {#if page.body}
      <article class="prose">
        <PortableText
          value={page.body}
          components={{ types: { image: InlineImage } }}
        />
      </article>
    {/if}
  </main>
{:else}
  <main class="page-content">
    <p>Loading...</p>
  </main>
{/if}

<style>
  .page-content {
    max-width: 80rem;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  .page-hero {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    margin-bottom: 3rem;
    text-align: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 12px;
    overflow: hidden;
  }

  .page-hero h1 {
    font-size: clamp(2.5rem, 6vw, 6rem);
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 0.5rem 0;
    color: var(--color-text);
    text-shadow: 1px 1px 0px var(--base-background-color);
  }

  .tagline {
    font-size: 1.25rem;
    color: var(--color-text);
    margin: 0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }

  .prose {
    font-size: 1.125rem;
    line-height: 1.7;
  }

  .prose :global(h2) {
    font-size: 2rem;
    font-weight: 700;
    margin: 2.5rem 0 1rem 0;
    line-height: 1.2;
  }

  .prose :global(h3) {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 2rem 0 0.75rem 0;
    line-height: 1.3;
  }

  .prose :global(p) {
    margin: 0 0 1.5rem 0;
  }

  .prose :global(ul),
  .prose :global(ol) {
    margin: 0 0 1.5rem 0;
    padding-left: 1.75rem;
  }

  .prose :global(li) {
    margin-bottom: 0.5rem;
  }

  .prose :global(a) {
    color: var(--color-primary);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }

  .prose :global(a:hover) {
    text-decoration-thickness: 2px;
  }

  .prose :global(blockquote) {
    border-left: 4px solid var(--color-primary);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: var(--color-text-subtle);
  }

  .prose :global(img) {
    max-width: 100%;
    height: auto;
    margin: 2rem 0;
    border-radius: 8px;
  }

  @media (max-width: 640px) {
    .page-content {
      padding: 1.5rem 1rem 3rem;
    }

    .page-hero h1 {
      font-size: clamp(2rem, 8vw, 3rem);
    }

    .prose {
      font-size: 1rem;
    }
  }
</style>
