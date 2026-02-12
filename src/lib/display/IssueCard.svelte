<script lang="ts">
  import WormCanvas from "$lib/display/WormCanvas.svelte";

  export let title: string = "Untitled Issue";
  export let number: number | string = "";
  export let subtitle: string = "";
  export let href: string | null = null;
  export let link: boolean | string = true;
  $: normalizedLink = link === true || link === "true";
  $: tag = href && normalizedLink ? "a" : "div";
</script>

<svelte:element
  this={tag}
  {...tag === "a" ? { href } : {}}
  class={tag === "a" ? "issue-card is-link" : "issue-card"}
  role={tag === "div" ? "article" : undefined}
  aria-label={tag === "div" ? title : undefined}
>
  <div class="worm-wrap" aria-hidden="true">
    {#if number !== ""}
      <WormCanvas
        {number}
        targetHeight={190}
        minDisplayWidth={0}
        useCssVars={true}
        thickness={40}
      />
    {/if}
  </div>

  <div class="card-content">
    {#if number !== ""}
      <div class="issue-number">ISSUE Nº {number}</div>
    {/if}
    <h2 class="issue-title">{title}</h2>
    {#if subtitle}
      <p class="issue-sub">{subtitle}</p>
    {/if}
  </div>
</svelte:element>

<style>
  .issue-card {
    position: relative;
    display: grid;
    align-items: center;
    justify-items: center;
    min-height: 16rem;
    padding: 1.25rem;
    background: var(--color-bg-emphasis);
    color: var(--color-text);
    overflow: hidden;
    border: 1px solid var(--color-border);
    --worm-color-a: var(--color-mauve-dark);
    --worm-color-b: var(--color-mauve);
    --worm-stroke: var(--color-black);
  }

  .issue-card.is-link {
    text-decoration: none;
    color: inherit;
    transition:
      transform 160ms ease,
      box-shadow 160ms ease;
  }

  .issue-card.is-link:hover {
    transform: translateY(-3px);
    box-shadow: inset 0 0 0 1rem var(--color-primary-a50);
  }

  .worm-wrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.9;
    pointer-events: none;
  }

  .worm-wrap :global(canvas) {
    width: min(60%, 220px);
    height: auto;
  }

  .card-content {
    position: relative;
    z-index: 2;
    text-align: center;
  }

  .issue-number {
    font-family: var(--font-head);
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.18em;
    margin: 0 0 0.25rem 0;
    color: var(--color-text);
    text-shadow: 1px 1px 0 var(--base-background-color);
  }

  .issue-title {
    margin: 0;
    font-weight: 800;
    line-height: 1;
    font-size: clamp(1.4rem, 2.6vw, 2.2rem);
    text-transform: uppercase;
    letter-spacing: -0.01em;
    text-shadow: 1px 1px 0 var(--base-background-color);
  }

  .issue-sub {
    margin: 0.6rem 0 0 0;
    color: var(--color-text-subtle, rgba(255, 255, 255, 0.9));
    font-size: 0.95rem;
  }
</style>
