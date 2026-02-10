<script lang="ts">
  import Logo from "$lib/nav/Logo.svelte";
  // Simple footer component
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
      <a href="/">Home</a>
      <a href="/issues">Issues</a>
      <a href="/about">About</a>
      <a href="/submissions">Submissions</a>
    </nav>

    <div class="meta">
      <small>© {year} Letsworm. All rights reserved.</small>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    border-top: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent);
    background: var(--color-bg-footer);
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

  .logo-wrap {
    display: inline-block;
    margin-right: 0.75rem;
  }

  .links a {
    color: var(--color-primary);
    text-decoration: none;
    font-family: Georgia, "Times New Roman", serif;
  }

  .links a:hover {
    color: var(--color-text);
    text-decoration: underline;
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
  }
</style>
