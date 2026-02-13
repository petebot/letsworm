<script lang="ts">
  import { onMount, tick } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { browser } from "$app/environment";

  import Logo from "$lib/nav/Logo.svelte";
  import Search from "$lib/nav/Search.svelte";
  import NavLinks from "$lib/nav/NavLinks.svelte";
  import WormMenuIcon from "$lib/nav/WormMenuIcon.svelte";

  export let pages: Array<{
    title: string;
    slug: { current: string };
    _id: string;
  }> = [];

  let menuOpen = false;
  let mobileSearchInput: HTMLInputElement | null = null;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
  };

  const closeMenu = () => {
    menuOpen = false;
  };

  const shouldIgnoreNavigation = (
    event: MouseEvent,
    anchor: HTMLAnchorElement | null,
  ) => {
    if (!anchor) return true;
    return (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      anchor.target === "_blank"
    );
  };

  const handleMobileNavNavigate = (
    event: CustomEvent<{ event: MouseEvent; anchor: HTMLAnchorElement | null }>,
  ) => {
    if (!menuOpen) return;
    const detail = event.detail;
    if (!detail) return;
    const { event: mouseEvent, anchor } = detail;
    if (!mouseEvent || shouldIgnoreNavigation(mouseEvent, anchor)) return;
    closeMenu();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && menuOpen) {
      closeMenu();
    }
  };

  const focusMobileSearch = async () => {
    if (!browser) return;
    await tick();
    mobileSearchInput?.focus();
  };

  $: if (browser) {
    document.documentElement.classList.toggle("mobile-menu-open", menuOpen);
  }

  $: if (browser && menuOpen) {
    focusMobileSearch();
  }

  onMount(() => {
    if (!browser) return;

    afterNavigate(() => {
      menuOpen = false;
    });

    return () => {
      document.documentElement.classList.remove("mobile-menu-open");
    };
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<header class="site-header">
  <div class="header-inner">
    <div class="left">
      <Search />
    </div>

    <div class="center">
      <a class="logo" href="/">
        <Logo fill="var(--color-primary)" height={64} />
      </a>
    </div>

    <div class="right">
      <button
        class="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        on:click={toggleMenu}
      >
        <WormMenuIcon open={menuOpen} />
      </button>

      <nav class="desktop-nav">
        <NavLinks {pages} />
      </nav>
    </div>
  </div>

  <div
    class="mobile-menu-overlay"
    class:open={menuOpen}
    aria-hidden={!menuOpen}
    on:click={(event) => event.target === event.currentTarget && closeMenu()}
  >
    <div class="mobile-menu" role="dialog" aria-modal="true">
      <div class="menu-header">
        <span class="menu-label">Menu</span>
        <button
          class="close-btn"
          type="button"
          aria-label="Close menu"
          on:click={closeMenu}
        >
          <WormMenuIcon open={true} />
        </button>
      </div>

      <form class="mobile-search" method="get" action="/search">
        <label class="sr-only" for="mobile-search-input">Search</label>
        <input
          id="mobile-search-input"
          name="q"
          type="search"
          placeholder="Search"
          bind:this={mobileSearchInput}
        />
        <button type="submit">Go</button>
      </form>

      <nav class="mobile-nav-links">
        <NavLinks {pages} on:navigate={handleMobileNavNavigate} />
      </nav>
    </div>
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
    gap: 0.75rem;
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-top: 0.5rem;
    align-items: center;
  }
  .desktop-nav {
    display: flex;
    gap: 1.25rem;
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

  /* Additional spacing for header nav links */
  .desktop-nav :global(a) {
    height: 100%;
    padding: 0.25rem 0.125rem;
  }

  .menu-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 999px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--color-primary);
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;
  }

  .menu-toggle:hover,
  .menu-toggle:focus-visible {
    background: color-mix(in srgb, var(--color-text) 8%, transparent);
    border-color: color-mix(in srgb, var(--color-text) 12%, transparent);
    color: var(--color-text);
    outline: none;
  }

  .close-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);
    background: transparent;
    color: var(--color-text);
    transition:
      background 0.2s ease,
      border-color 0.2s ease;
  }

  .close-btn:hover,
  .close-btn:focus-visible {
    background: color-mix(in srgb, var(--color-text) 10%, transparent);
    border-color: color-mix(in srgb, var(--color-text) 24%, transparent);
    outline: none;
  }

  .mobile-menu-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: flex-end;
    background: color-mix(in srgb, var(--color-bg-emphasis) 65%, transparent);
    backdrop-filter: blur(10px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.28s ease;
    z-index: 999;
  }

  .mobile-menu-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  .mobile-menu {
    width: min(100%, 22rem);
    height: 100%;
    background: var(--base-background-color);
    color: var(--color-text);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1.5rem;
    box-sizing: border-box;
    box-shadow: -16px 0 32px rgba(0, 0, 0, 0.18);
    transform: translateX(110%);
    transition: transform 0.32s ease;
  }

  .mobile-menu-overlay.open .mobile-menu {
    transform: translateX(0);
  }

  .menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .menu-label {
    font-family: var(--font-head);
    font-size: 1.1rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .mobile-search {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .mobile-search input {
    flex: 1;
    padding: 0.65rem 0.8rem 0.55rem;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--color-text) 16%, transparent);
    background: var(--color-bg-emphasis);
    color: var(--color-text);
    font-size: 1rem;
  }

  .mobile-search button {
    padding: 0.5rem 1rem;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--color-text) 16%, transparent);
    background: transparent;
    color: var(--color-text);
    font-family: var(--font-head);
    text-transform: uppercase;
    font-size: 0.95rem;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;
  }

  .mobile-search button:hover,
  .mobile-search button:focus-visible {
    background: var(--color-primary);
    color: var(--base-background-color);
    border-color: var(--color-primary);
    outline: none;
  }

  .mobile-nav-links {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .mobile-nav-links :global(a) {
    display: inline-flex;
    font-size: 1.2rem;
    letter-spacing: 0.04em;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (max-width: 720px) {
    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0 0.75rem;
    }
    .left {
      display: none;
    }
    .center {
      justify-content: flex-start;
      flex: 1;
    }
    .right {
      gap: 0.5rem;
    }
    .desktop-nav {
      display: none;
    }
    .mobile-nav-links :global(a) {
      font-size: 1.05rem;
    }
  }

  @media (min-width: 721px) {
    .menu-toggle,
    .mobile-menu-overlay {
      display: none;
    }
  }

  :global(html.mobile-menu-open) {
    overflow: hidden;
  }

  :global(html.mobile-menu-open body) {
    overflow: hidden;
  }
</style>
