<svelte:options runes={true} />

<script lang="ts">
  import { page } from "$app/stores";
  import { createEventDispatcher } from "svelte";
  import WormUnderline from "$lib/display/WormUnderline.svelte";

  const dispatch = createEventDispatcher<{
    navigate: { event: MouseEvent; anchor: HTMLAnchorElement | null };
  }>();

  let {
    pages = [],
  }: {
    pages?: Array<{
      title: string;
      slug: { current: string };
      _id: string;
    }>;
  } = $props();

  const handleAnchorClick = (event: MouseEvent) => {
    const anchor =
      event.currentTarget instanceof HTMLAnchorElement
        ? event.currentTarget
        : null;
    dispatch("navigate", { event, anchor });
  };
</script>

<a
  class={$page.url.pathname === "/" ? "active" : ""}
  href="/"
  onclick={handleAnchorClick}
>
  Home
  {#if $page.url.pathname !== "/"}
    <WormUnderline />
  {/if}
</a>
<a
  class={$page.url.pathname.startsWith("/issues") ? "active" : ""}
  href="/issues"
  onclick={handleAnchorClick}
>
  Issues
  {#if !$page.url.pathname.startsWith("/issues")}
    <WormUnderline />
  {/if}
</a>
<a
  class={$page.url.pathname.startsWith("/contributors") ? "active" : ""}
  href="/contributors"
  onclick={handleAnchorClick}
>
  Contributors
  {#if !$page.url.pathname.startsWith("/contributors")}
    <WormUnderline />
  {/if}
</a>
{#each pages as pageItem (pageItem._id)}
  <a
    class={$page.url.pathname === `/pages/${pageItem.slug.current}`
      ? "active"
      : ""}
    href={`/pages/${pageItem.slug.current}`}
    onclick={handleAnchorClick}
  >
    {pageItem.title}
    {#if $page.url.pathname !== `/pages/${pageItem.slug.current}`}
      <WormUnderline />
    {/if}
  </a>
{/each}

<style>
  a {
    position: relative;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    color: var(--color-primary);
    font-size: 1rem;
    font-family: var(--font-head);
    font-weight: 500;
  }

  a :global(.worm-underline) {
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  a:hover :global(.worm-underline) {
    opacity: 1;
    left: -0.25rem;
  }

  a:hover {
    color: var(--color-text);
    text-decoration: none;
  }

  a.active {
    color: var(--color-text);
    cursor: default;
  }

  a.active:hover {
    color: var(--color-text);
  }
</style>
