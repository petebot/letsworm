<script lang="ts">
  import { page } from "$app/stores";
  import { urlFor } from "../../sanity";
  import Avatar from "$lib/display/Avatar.svelte";

  export let data: {
    query: string;
    results: Array<{
      id: string;
      type: "Story" | "Page" | "Contributor";
      title: string;
      url: string;
      image: Record<string, unknown> | null;
      snippet: string | null;
      meta: string | null;
      bodyText?: string | null;
      givenName?: string | null;
      familyName?: string | null;
    }>;
  };

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlight = (value: string | null, query: string) => {
    if (!value) return "";
    const terms = query.split(/\s+/).filter(Boolean);
    if (terms.length === 0) return escapeHtml(value);
    const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
    return escapeHtml(value).replace(pattern, "<mark>$1</mark>");
  };

  // Check if query appears in text (case-insensitive)
  const queryAppearsIn = (
    text: string | null | undefined,
    query: string,
  ): boolean => {
    if (!text) return false;
    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const lowerText = text.toLowerCase();
    return searchTerms.some((term) => lowerText.includes(term));
  };

  // Extract snippet from text containing query term
  const extractSnippetFromBody = (
    text: string | null | undefined,
    query: string,
  ): string | null => {
    if (!text) return null;
    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const lowerText = text.toLowerCase();

    // Find the first matching term's position
    let bestIdx = -1;
    for (const term of searchTerms) {
      const idx = lowerText.indexOf(term);
      if (idx !== -1 && (bestIdx === -1 || idx < bestIdx)) {
        bestIdx = idx;
      }
    }

    if (bestIdx === -1) return null;

    // Extract snippet with context (70 chars before/after)
    const start = Math.max(0, bestIdx - 70);
    const end = Math.min(text.length, bestIdx + searchTerms[0].length + 70);
    let snippet = text.slice(start, end).trim();
    if (start > 0) snippet = `...${snippet}`;
    if (end < text.length) snippet = `${snippet}...`;
    return snippet;
  };

  // Get the best snippet, falling back to body search if needed
  const getResultSnippet = (
    query: string,
    title: string | null,
    meta: string | null,
    snippet: string | null,
    bodyText: string | null | undefined,
  ): string | null => {
    // If we have a snippet and the query appears in it, title, or meta, use it
    if (
      snippet &&
      (queryAppearsIn(snippet, query) ||
        queryAppearsIn(title, query) ||
        queryAppearsIn(meta, query))
    ) {
      return snippet;
    }

    // Otherwise, try to extract from body text
    if (bodyText) {
      const bodySnippet = extractSnippetFromBody(bodyText, query);
      if (bodySnippet) return bodySnippet;
    }

    // Fallback to original snippet if nothing else found
    return snippet;
  };

  $: query = data?.query ?? "";
  $: results = data?.results ?? [];
  $: resultCount = results.length;
  $: hasQuery = query.trim().length > 0;
  $: rawQuery = $page.url.searchParams.get("q") ?? "";
</script>

<svelte:head>
  <title>{hasQuery ? `Search: ${query}` : "Search"} — Let's Worm</title>
  <meta
    name="description"
    content={hasQuery
      ? `Search results for ${query}`
      : "Search across stories, pages, and contributors."}
  />
</svelte:head>

<main class="search-page">
  <header class="search-hero">
    <p class="eyebrow">Search</p>
    <h1>Find worms, stories, and people</h1>
    <p class="lead">
      {#if hasQuery}
        {resultCount} results for “{query}”.
      {:else}
        Search across story titles, copy, contributors, and pages.
      {/if}
    </p>

    <form class="search-form" method="GET" action="/search">
      <input
        name="q"
        type="search"
        value={rawQuery}
        placeholder="Search for a story, person, or phrase"
        aria-label="Search"
      />
      <button type="submit">Search</button>
    </form>
  </header>

  {#if !hasQuery}
    <section class="empty-state">
      <p>Try searching for a title, a contributor, or a phrase from a story.</p>
    </section>
  {:else if resultCount === 0}
    <section class="empty-state">
      <p>No results yet. Try a different term.</p>
    </section>
  {:else}
    <section class="results-grid">
      {#each results as item (item.id)}
        {@const resultSnippet = getResultSnippet(
          query,
          item.title,
          item.meta,
          item.snippet,
          item.bodyText,
        )}
        <a class="result-card" href={item.url}>
          <div class="thumb">
            {#if item.type === "Contributor"}
              <Avatar
                contributor={{
                  givenName: item.givenName,
                  familyName: item.familyName,
                  image: item.image,
                }}
                alt={item.title}
                size="default"
              />
            {:else if item.image}
              <img
                src={urlFor(item.image)
                  .width(240)
                  .height(240)
                  .auto("format")
                  .url()}
                alt={item.title}
              />
            {:else}
              <div class="thumb-fallback">{item.type}</div>
            {/if}
          </div>
          <div class="result-meta">
            <span class="type">{item.type}</span>
            <h2>{@html highlight(item.title, query)}</h2>
            {#if item.meta}
              <p class="meta">{@html highlight(item.meta, query)}</p>
            {/if}
            {#if resultSnippet}
              <p class="snippet">{@html highlight(resultSnippet, query)}</p>
            {/if}
          </div>
        </a>
      {/each}
    </section>
  {/if}
</main>

<style>
  .search-page {
    width: min(100%, 82rem);
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
  }

  .search-hero {
    display: grid;
    gap: 1rem;
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .eyebrow {
    margin: 0;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: var(--color-text-subtle);
  }

  h1 {
    margin: 0;
    font-size: clamp(2.25rem, 5vw, 4.25rem);
  }

  .lead {
    margin: 0 auto;
    font-size: 1.1rem;
    color: var(--color-text-subtle);
    max-width: 42rem;
  }

  .search-form {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .search-form input {
    min-width: min(100%, 22rem);
    padding: 0.75rem 1rem;
    border-radius: 999px;
    border: 1px solid var(--color-border);
    background: var(--color-bg-emphasis);
    color: var(--color-text);
    font-size: 1rem;
  }

  .search-form button {
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    border: 1px solid var(--color-primary);
    background: var(--color-primary);
    color: var(--base-background-color);
    cursor: pointer;
    font-family: var(--font-head);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .result-card {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: 16px;
    border: 1px solid var(--color-border);
    background: var(--color-bg-emphasis);
    color: inherit;
    text-decoration: none;
    transition:
      transform 180ms ease,
      box-shadow 180ms ease;
  }

  .result-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }

  .thumb {
    width: 90px;
    height: 90px;
    border-radius: 12px;
    overflow: hidden;
    background: color-mix(in srgb, var(--color-primary) 12%, transparent);
    display: grid;
    place-items: center;
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumb-fallback {
    text-transform: uppercase;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: var(--color-text-subtle);
    text-align: center;
    padding: 0 0.25rem;
  }

  .result-meta {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .type {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--color-text-subtle);
    font-family: var(--font-head);
  }

  .result-meta h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    font-family: var(--font-head);
  }

  .meta {
    margin: 0;
    color: var(--color-text-subtle);
    font-size: 0.9rem;
    font-family: var(--font-head);
  }

  .snippet {
    margin: 0;
    color: var(--color-text);
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1.5rem;
    border: 1px dashed var(--color-border);
    border-radius: 16px;
    color: var(--color-text-subtle);
  }

  @media (max-width: 720px) {
    .result-card {
      grid-template-columns: 1fr;
    }

    .thumb {
      width: 100%;
      height: 180px;
    }

    .search-hero {
      text-align: left;
    }

    .search-form {
      justify-content: flex-start;
    }
  }
</style>
