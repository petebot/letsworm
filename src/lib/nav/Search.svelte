<script lang="ts">
  import { tick } from "svelte";
  import { clickOutside } from "$lib/actions/clickOutside";

  let query = "";
  let showSearch = false;
  let searchEl: HTMLInputElement | null = null;

  async function openSearch(e: MouseEvent) {
    e.stopPropagation();
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
</script>

<div class="search-wrap">
  <button
    class="icon-btn"
    class:active={showSearch}
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

<style>
  .search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: transparent;
    border: 1px solid transparent;
    color: color-mix(in srgb, var(--color-text) 50%, var(--color-background));
  }

  .icon-btn:hover {
    background: color-mix(in srgb, var(--color-text) 6%, transparent);
  }
  .icon-btn.active {
    background: color-mix(in srgb, var(--color-text) 12%, transparent);
    border-color: color-mix(in srgb, var(--color-text) 12%, transparent);
  }

  .search-pop {
    position: relative;
    display: flex;
    gap: 0.5rem;
    background: var(--base-background-color);
    padding: 0.5rem;
    z-index: 40;
    min-width: 14rem;
    width: min(20rem, calc(100vw - 2rem));
    max-width: calc(100vw - 2rem);
  }

  .search-input {
    padding: 0.4rem 0.6rem 0.2rem;
    border: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);
    background: var(--color-bg-emphasis);
    color: var(--color-text);
  }

  .submit-btn {
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);
    color: var(--color-text);
    padding: 0.35rem 0.6rem;
    border-radius: 999px;
    font-family: var(--font-head);
    text-transform: uppercase;
    transition: all 0.3s ease;
  }
  .submit-btn:hover {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--base-background-color);
  }
</style>
