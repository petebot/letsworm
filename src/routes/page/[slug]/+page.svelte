<script lang="ts">
  import { PortableText } from "@portabletext/svelte";
  import { urlFor } from "../../../sanity";
  export let data: any;

  let page = data.data.page;

  console.log("flat: ", page);

  function formatDate(dateString: string): string {
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
</script>

<main>
  {#if page}
    {#if page.hero}
      <section class="hero">
        <h1>{page.hero.heading}</h1>
        <h2>{page.hero.tagline}</h2>
        {#if page.hero.heroImage && page.hero.heroImage.asset}
          <img src={urlFor(page.hero.heroImage).url()} alt={page.title} />
        {/if}
      </section>
    {/if}

    {#if page.body}
      <div class="content">
        <PortableText value={page.body} components={{}} />
      </div>
    {/if}
  {:else}
    <p>Loading page...</p>
  {/if}
</main>

<style>
  h1,
  h2 {
    text-align: center;
  }
  .hero img {
    max-width: 100%;
  }
  .content {
    font-size: 1.2rem;
  }
</style>
