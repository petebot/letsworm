<script lang="ts">
  // StoryHero: large visual hero for individual stories or story previews
  export let title: string = "Untitled";
  export let byline: string | null = null;
  export let excerpt: string | null = null;
  export let coverUrl: string | null = null;
  export let href: string | null = null;
  export let link: boolean | string = true;
  $: normalizedLink = link === true || link === "true";
  $: tag = href && normalizedLink ? "a" : "div";
  export let height: string = "min(48vh, 35rem)";
  // allow tuning the focal point of the cover
  export let coverPosition: string = "center center";
</script>

<section
  class="story-hero"
  style={`--height:${height}; ${coverUrl ? `--cover:url('${coverUrl}');` : ""} --cover-position: ${coverPosition}`}
>
  <svelte:element
    this={tag}
    {...tag === "a" ? { href } : {}}
    class={tag === "a" ? "hero-link" : "hero-plain"}
    role={tag === "div" ? "region" : undefined}
    aria-label={tag === "div" ? title : undefined}
  >
    <div class="cover" aria-hidden="true"></div>

    <div class="meta">
      {#if byline}
        <div class="byline">{byline}</div>
      {/if}

      <h2 class="title">{title}</h2>

      {#if excerpt}
        <p class="excerpt">{excerpt}</p>
      {/if}
    </div>
  </svelte:element>
</section>

<style>
  .story-hero {
    position: relative;
    height: var(--height);
    min-height: 90vh;
    width: 100%;
    max-width: 80rem;
    padding: 1rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    overflow: hidden;
    color: var(--color-text, #fff);
    background-color: var(--color-bg-primary, #111);
  }

  .hero-link,
  .hero-plain {
    display: block;
    width: 100%;
    height: 100%;
    color: inherit;
    text-decoration: none;
  }

  .cover {
    position: absolute;
    inset: 0;
    background-image: var(--cover, none);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: var(--cover-position, center center);
    transform-origin: center;
    width: 100%;
    transition: 1s ease-in-out;
  }

  .story-hero .hero-link:after {
    content: "";
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 0 0 transparent;
    transition: all 0.4s ease-in-out 0.2s;
  }
  .story-hero:hover .hero-link:after {
    box-shadow: inset 0 0 0 1rem var(--color-primary-a50);
  }
  .story-hero:hover .hero-link .cover {
    transform: scale(1.05);
  }

  .cover::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.18),
      rgba(0, 0, 0, 0.55)
    );
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .meta {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    z-index: 2;
    max-width: 35rem;
    padding: 2rem;
    box-sizing: border-box;
    background: var(--base-background-color, rgba(255, 255, 255, 0.85));
  }

  .byline {
    color: var(--color-text-subtle, rgba(255, 255, 255, 0.85));
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    letter-spacing: 0.08em;
  }

  .title {
    margin: 0 0 0.5rem 0;
    font-size: clamp(1.25rem, 3.6vw, 2.75rem);
    line-height: 1.02;
    font-weight: 800;
    color: var(--color-text, #fff);
  }

  .excerpt {
    margin: 0;
    color: var(--color-text-subtle, rgba(255, 255, 255, 0.9));
    font-size: clamp(0.95rem, 2.2vw, 1.05rem);
    max-width: 56ch;
  }

  @media (min-width: 960px) {
    .title {
      font-size: clamp(1.8rem, 3.8vw, 4rem);
    }
  }
</style>
