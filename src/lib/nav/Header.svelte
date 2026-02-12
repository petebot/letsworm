<script lang="ts">
  import Logo from "$lib/nav/Logo.svelte";
  import Search from "$lib/nav/Search.svelte";
  import NavLinks from "$lib/nav/NavLinks.svelte";

  export let pages: Array<{
    title: string;
    slug: { current: string };
    _id: string;
  }> = [];
</script>

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

    <nav class="right">
      <NavLinks {pages} />
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

  /* Additional spacing for header nav links */
  .right :global(a) {
    height: 100%;
    padding: 0.25rem 0.125rem;
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
