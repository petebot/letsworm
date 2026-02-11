<script lang="ts">
  export let title: string = "Untitled Issue";
  export let number: number | string = "";
  export let subtitle: string = "";
  export let issueImageUrl: string | null = null;
  // `href` can be empty to render a non-link hero (useful on index pages)
  export let href: string | null = null;
  // allow explicitly disabling linking even when `href` is provided
  // support boolean or boolean-like string values from markup (e.g. link="false")
  export let link: boolean | string = true;
  $: normalizedLink = link === true || link === "true";
  $: tag = href && normalizedLink ? "a" : "div";
  export let height: string = "min(72vh, 720px)";
  // control the visual size and position of the issue image
  // default uses viewport-relative sizing but is capped in CSS to avoid overscaling
  export let issueImageSize: string = "45vw";
  export let issueImagePosition: string = "center center";
</script>

<section
  class="issue-hero"
  style={`--height:${height}; --issue-image-size:${issueImageSize}; --issue-image-position:${issueImagePosition}; ${issueImageUrl ? `--issue-image: url('${issueImageUrl}')` : ``}`}
>
  <svelte:element
    this={tag}
    {...tag === "a" ? { href } : {}}
    class={tag === "a" ? "hero-link" : "hero-plain"}
    role={tag === "div" ? "region" : undefined}
    aria-label={tag === "div" ? title : undefined}
  >
    <div class="issue-image" aria-hidden="true">
      {#if issueImageUrl}
        <img src={issueImageUrl} alt="" class="issue-img" />
      {/if}
    </div>

    <div class="content">
      <div class="title-wrap">
        {#if number !== ""}
          <div class="issue-number">ISSUE Nº {number}</div>
        {/if}

        <h1 class="issue-title">{title}</h1>
      </div>

      {#if subtitle}
        <div class="issue-sub">{subtitle}</div>
      {/if}
    </div>
  </svelte:element>
</section>

<style>
  .issue-hero {
    position: relative;
    height: var(--height);
    min-height: 360px;
    display: flex;
    align-items: center;
    overflow: hidden;
    background-color: var(--color-bg-primary, #3b2b10);
    color: var(--color-text, #fff);
  }

  .hero-link,
  .hero-plain {
    display: block;
    width: 100%;
    color: inherit;
    text-decoration: none;
  }

  .issue-image {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    overflow: hidden;
  }

  .issue-img {
    /* width is viewport-relative but clamped to a sensible max so it doesn't explode on large screens */
    width: min(var(--issue-image-size, 45vw), 250px);
    height: auto;
    object-fit: contain;
    transform: translateZ(0);
    pointer-events: none;
    user-select: none;
    display: block;
    margin: 0 auto;
  }

  @media (min-width: 1400px) {
    .issue-img {
      /* slightly smaller cap on very large screens */
      width: min(var(--issue-image-size, 45vw), 360px);
    }
  }

  .issue-image::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.14),
      rgba(0, 0, 0, 0.55)
    );
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 2;
    width: 100%;
    max-width: 80rem;
    padding: clamp(1rem, 4vw, 4rem);
    box-sizing: border-box;
  }

  .title-wrap {
    margin: 0 auto;
    text-align: left;
    display: block;
    max-width: 100%;
  }

  .issue-number {
    font-family: var(--font-head);
    font-weight: 600;
    font-size: 1.25rem;
    letter-spacing: 0.12em;
    margin: 0 0 0.75rem 0;
    color: var(--color-text);
  }

  .issue-title {
    margin: 0;
    font-weight: 800;
    line-height: 0.95;
    font-size: clamp(2.25rem, 6vw, 7.5rem);
    color: var(--color-text, #fff);
    text-transform: uppercase;
    letter-spacing: -0.02em;
    max-width: 52rem;
    text-align: left;
  }

  .issue-sub {
    margin-top: 1rem;
    color: var(--color-text-subtle, rgba(255, 255, 255, 0.9));
    font-size: clamp(1rem, 2vw, 1.25rem);
  }

  @media (max-width: 640px) {
    .issue-title {
      font-size: clamp(1.75rem, 9vw, 3.8rem);
    }
    .content {
      padding: 1.25rem;
    }
  }
</style>
