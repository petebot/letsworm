<script module lang="ts">
  export const prerender = false;
</script>

<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Email Preview | Let's Worm</title>
</svelte:head>

<div class="shell">
  <div class="meta">
    <p class="eyebrow">Email Preview</p>
    <h1>Welcome Email</h1>
    <p class="lede">
      This route uses the normal Svelte dev server and local assets. The iframe
      below renders the compiled email HTML.
    </p>

    <div class="details">
      <p><strong>Subject:</strong> {data.subject}</p>
      <p><strong>Sample props:</strong> {data.propsPath}</p>
      <p><strong>Local oneWorm URL:</strong> {data.localOneWormUrl}</p>
      <p><strong>Local logo URL:</strong> {data.localLogoUrl}</p>
      <p><strong>Export command:</strong> <code>npm run email:export</code></p>
    </div>
  </div>

  <div class="preview-frame">
    <iframe title="Welcome email preview" src={data.previewUrl}></iframe>
  </div>
</div>

<style>
  .shell {
    display: grid;
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem 3rem;
  }

  .meta {
    display: grid;
    gap: 0.75rem;
    max-width: 56rem;
  }

  .eyebrow {
    margin: 0;
    font-family: var(--font-head);
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
  }

  h1 {
    margin: 0;
    text-align: left;
  }

  .lede {
    margin: 0;
    max-width: 48rem;
  }

  .details {
    display: grid;
    gap: 0.3rem;
    padding: 1rem 1.25rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-emphasis);
  }

  .details p {
    margin: 0;
    overflow-wrap: anywhere;
  }

  .preview-frame {
    min-height: 75vh;
    border: 1px solid var(--color-border);
    background: var(--color-bg-primary);
  }

  iframe {
    width: 100%;
    min-height: 75vh;
    border: 0;
    background: white;
  }
</style>
