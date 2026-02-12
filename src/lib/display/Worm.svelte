<script lang="ts">
  import { urlFor } from "../../sanity";
  export let item: any;

  function formatDate(dateString: string): string {
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
</script>

<li>
  {#if item.mainImage && item.mainImage.asset && item.slug.current && item.title}<a href="/{item.slug.current}">
      <img
        src={urlFor(item.mainImage).width(512).height(288).url()}
        alt={item.title}
      />
    </a>
    <h3><a href="/{item.slug.current}">{item.title}</a></h3>
  {/if}
  <div class="metadata">
    {#if item.publishedAt}
      <time datetime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
    {/if}
  </div>
  {#if item.excerpt && item.slug.current}
    <p class="excerpt">
      {item.excerpt}
      <a href="/{item.slug.current}" class="cta">Look & Read &rarr;</a>
    </p>
  {/if}
</li>

<style>
  h3 {
    text-transform: uppercase;
    font-weight: 200;
    margin: 1rem 0 0;
  }
  .excerpt {
    color: var(--color-text-subtle);
    margin-top: 0;
  }
  .metadata {
    justify-content: start;
  }
  .cta {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.1rem;
    font-family: var(--font-head);
    word-break: keep-all;
    display: inline-flex;
    align-items: center;
  }
  img {
    max-width: 100%;
    width: 100%;
  }
  li {
    list-style: none;
  }

  time {
    color: var(--color-text-subtle);
    margin: 0 0 0.25rem;
  }
</style>
