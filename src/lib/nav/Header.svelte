<script lang="ts">
  import { page } from "$app/stores";
  import Logo from "$lib/nav/Logo.svelte";

  import { tick } from "svelte";
  import { clickOutside } from "$lib/actions/clickOutside";

  export let pages: Array<{
    title: string;
    slug: { current: string };
    _id: string;
  }> = [];

  let query = "";
  let showSearch = false;
  let searchEl: HTMLInputElement | null = null;
  let searchWrap: HTMLElement | null = null;

  async function openSearch() {
    showSearch = true;
    await tick();
    searchEl?.focus();
  }

  function closeSearch() {
    showSearch = false;
  }

  function onSearch(e: Event) {
    e.preventDefault();
    const q = encodeURIComponent(query.trim());
    if (q) location.href = `/search?q=${q}`;
    closeSearch();
  }

  // using `use:clickOutside` action (see src/lib/actions/clickOutside.ts)
</script>

<header class="site-header">
  <div class="header-inner">
    <div class="left">
      <div class="search-wrap" bind:this={searchWrap}>
        <button
          class="icon-btn"
          aria-label="Open search"
          on:click={openSearch}
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="11"
              cy="11"
              r="6"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        {#if showSearch}
          <form
            on:submit|preventDefault={onSearch}
            class="search-pop"
            use:clickOutside={closeSearch}
          >
            <input
              bind:this={searchEl}
              aria-label="Search"
              placeholder="Search"
              bind:value={query}
              class="search-input"
              on:keydown={(e) => e.key === "Escape" && closeSearch()}
            />
            <button type="submit" class="submit-btn" aria-label="Submit search"
              >Go</button
            >
          </form>
        {/if}
      </div>
    </div>

    <div class="center">
      <a class="logo" href="/">
        <Logo fill="var(--color-primary)" height={64} />
      </a>
    </div>

    <nav class="right">
      <a class={$page.url.pathname === "/" ? "active" : ""} href="/">Home</a>
      <a
        class={$page.url.pathname.startsWith("/issues") ? "active" : ""}
        href="/issues">Issues</a
      >
      <a
        class={$page.url.pathname.startsWith("/contributors") ? "active" : ""}
        href="/contributors">Contributors</a
      >
      {#each pages as pageItem (pageItem._id)}
        <a
          class={$page.url.pathname === `/${pageItem.slug.current}`
            ? "active"
            : ""}
          href={`/${pageItem.slug.current}`}
        >
          {pageItem.title}
        </a>
      {/each}
    </nav>
  </div>
</header>

<style>
  .site-header {
    width: 100%;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-text) 10%, transparent);
    background: var(--base-background-color);
  }
  .header-inner {
    max-width: 64rem;
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
    height: 88px;
  }
  .left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    display: flex;
    justify-content: flex-end;
    gap: 1.25rem;
    padding-top: 0.5rem;
    align-items: center;
  }
  .logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--color-text);
    text-decoration: none;
  }
  .search-input {
    padding: 0.4rem 0.6rem;
    border: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);
    background: transparent;
    color: var(--color-text);
    border-radius: 6px;
    height: 40px;
    line-height: 1;
  }
  .search-wrap {
    position: relative;
  }
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid transparent;
    color: color-mix(in srgb, var(--color-text) 50%, var(--color-background));
  }
  .icon-btn:hover {
    background: color-mix(in srgb, var(--color-text) 6%, transparent);
  }
  .search-pop {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    display: flex;
    gap: 0.5rem;
    background: var(--base-background-color);
    padding: 0.5rem;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    z-index: 40;
    min-width: 220px;
  }
  .submit-btn {
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);
    color: var(--color-text);
    padding: 0.35rem 0.6rem;
    border-radius: 6px;
  }
  a {
    position: relative;
    text-decoration: none;
  }

  .right a {
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 0.25rem 0.125rem;
    color: var(--color-primary);
    font-size: 1rem;
    font-family: var(--font-head);
    font-weight: 500;
  }

  a::after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    transform-origin: center;
    transform: scaleX(0);
    transition: transform 0.25s ease;
    background-color: var(--color-primary);
  }

  .right a:hover {
    color: var(--color-text);
  }

  .right a:hover::after {
    transform: scaleX(0.6);
  }

  .right a.active {
    color: var(--color-text);
    cursor: default;
  }

  .right a.active::after {
    transform: scaleX(1) !important;
    background-color: var(--color-text);
  }

  @media (max-width: 720px) {
    .header-inner {
      grid-template-columns: 1fr auto 1fr;
      gap: 0.5rem;
    }
    .right {
      gap: 0.5rem;
      overflow-x: auto;
    }
  }
</style>
