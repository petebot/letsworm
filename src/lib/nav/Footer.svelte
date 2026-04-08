<script lang="ts">
  import { page } from "$app/stores";
  import Logo from "$lib/nav/Logo.svelte";
  import NavLinks from "$lib/nav/NavLinks.svelte";

  export let pages: Array<{
    title: string;
    slug: { current: string };
    _id: string;
  }> = [];

  const year = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="footer-inner">
    <nav class="links">
      <div class="logo-wrap">
        <Logo
          variant="stacked"
          height={96}
          className="footer-logo"
          fill="var(--color-primary)"
        />
      </div>
      <div class="footer-nav">
        <NavLinks {pages} />
        <a
          class:active={$page.url.pathname === "/submission-guidelines"}
          href="/submission-guidelines"
        >
          Submission Guidelines
        </a>
      </div>
    </nav>

    <div class="meta">
      <small>© {year} Let's Worm. All rights reserved.</small>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    border-top: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent);
    background: var(--color-bg-emphasis);
    padding: 2rem 1rem;
    color: var(--color-text);
  }

  .footer-inner {
    max-width: 64rem;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .links {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .footer-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

  .logo-wrap {
    display: inline-block;
    margin-right: 0.75rem;
  }

  .footer-nav a {
    position: relative;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    color: var(--color-primary);
    font-size: 1rem;
    font-family: var(--font-head);
    font-weight: 500;
  }

  .footer-nav a:hover {
    color: var(--color-text);
    text-decoration: none;
  }

  .footer-nav a.active {
    color: var(--color-text);
    cursor: default;
  }

  .meta small {
    color: color-mix(in srgb, var(--color-text) 60%, var(--color-background));
  }

  @media (max-width: 720px) {
    .footer-inner {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .links {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .footer-nav {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .links :global(a) {
      font-size: 1rem;
    }
  }
</style>
