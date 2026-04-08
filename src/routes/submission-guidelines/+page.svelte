<script lang="ts">
  import {PortableText} from '@portabletext/svelte'
  import InlineImage from '$lib/display/InlineImage.svelte'

  type GuidelineMode = 'story' | 'art'

  export let data: {
    guidelines: {
      title: string
      intro?: string
      storyToggleLabel: string
      artToggleLabel: string
      storyTagline: string
      artTagline: string
      storyHeading?: string
      artHeading?: string
      storyGuidelines: any[]
      artGuidelines: any[]
    }
  }

  const guidelines = data.guidelines
  const defaultTagline = 'Your prompt inspires a prompt.'
  let activeMode: GuidelineMode | null = null

  $: activeTagline =
    activeMode === 'story'
      ? guidelines.storyTagline
      : activeMode === 'art'
        ? guidelines.artTagline
        : defaultTagline
  $: activeHeading =
    activeMode === 'story'
      ? guidelines.storyHeading || 'Written Submissions'
      : activeMode === 'art'
        ? guidelines.artHeading || 'Visual Submissions'
        : ''
  $: activeGuidelines =
    activeMode === 'story'
      ? guidelines.storyGuidelines
      : activeMode === 'art'
        ? guidelines.artGuidelines
        : []
</script>

<svelte:head>
  <title>{guidelines.title} — Let's Worm</title>
  <meta
    name="description"
    content={guidelines.intro || `${guidelines.title} — Let's Worm`}
  />
</svelte:head>

<main class="submission-guidelines">
  <section class="hero">
    <p class="eyebrow">Submission Portal</p>
    <h1>{guidelines.title}</h1>
    {#if guidelines.intro}
      <p class="intro">{guidelines.intro}</p>
    {/if}

    <p class="tagline">{activeTagline}</p>

    <div class="toggle-group" role="tablist" aria-label="Submission type">
      <button
        type="button"
        role="tab"
        class:active={activeMode === 'story'}
        aria-selected={activeMode === 'story'}
        on:click={() => (activeMode = 'story')}
      >
        {guidelines.storyToggleLabel}
      </button>
      <button
        type="button"
        role="tab"
        class:active={activeMode === 'art'}
        aria-selected={activeMode === 'art'}
        on:click={() => (activeMode = 'art')}
      >
        {guidelines.artToggleLabel}
      </button>
    </div>
  </section>

  {#if activeMode}
    <section class="guideline-card" aria-live="polite">
      <h2>{activeHeading}</h2>
      <div class="prose">
        <PortableText
          value={activeGuidelines}
          components={{types: {image: InlineImage}}}
        />
      </div>
    </section>
  {/if}
</main>

<style>
  .submission-guidelines {
    width: 100%;
    max-width: 72rem;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
    display: grid;
    gap: 2rem;
  }

  .hero {
    display: grid;
    gap: 1rem;
    justify-items: start;
    padding: 2rem 1.25rem;
    border: 1px solid var(--color-border);
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-primary-a10) 35%, transparent),
        transparent 45%
      ),
      color-mix(in srgb, var(--color-bg-emphasis) 90%, transparent);
  }

  .eyebrow {
    margin: 0;
    font-family: var(--font-head);
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
  }

  .hero h1 {
    margin: 0;
    text-align: left;
    font-size: clamp(2.3rem, 7vw, 4.75rem);
  }

  .intro {
    margin: 0;
    max-width: 40rem;
    font-size: 1.05rem;
  }

  .tagline {
    margin: 0.5rem 0 0;
    font-size: clamp(1.4rem, 4vw, 2.3rem);
    line-height: 1.1;
    font-style: italic;
  }

  .toggle-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .toggle-group button {
    border: 1px solid var(--color-text);
    background: transparent;
    color: var(--color-text);
    padding: 0.85rem 1.1rem;
    font-family: var(--font-head);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;
  }

  .toggle-group button.active,
  .toggle-group button:hover {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-text-inverse);
  }

  .guideline-card {
    padding: 2rem 1.25rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-primary);
  }

  .guideline-card h2 {
    margin: 0 0 1.25rem;
    text-align: left;
  }

  .prose {
    font-size: 1.05rem;
    line-height: 1.7;
    max-width: 46rem;
  }

  .prose :global(h2) {
    font-size: 1.8rem;
    margin: 2rem 0 0.75rem;
  }

  .prose :global(h3) {
    font-size: 1.35rem;
    margin: 1.75rem 0 0.65rem;
  }

  .prose :global(p) {
    margin: 0 0 1.1rem;
  }

  .prose :global(ul),
  .prose :global(ol) {
    margin: 0 0 1.25rem;
    padding-left: 1.4rem;
  }

  .prose :global(li) {
    margin-bottom: 0.5rem;
  }

  .prose :global(a) {
    color: var(--color-primary);
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }

  @media (max-width: 640px) {
    .submission-guidelines {
      padding: 1.5rem 1rem 3rem;
    }

    .hero,
    .guideline-card {
      padding: 1.5rem 1rem;
    }

    .toggle-group {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
    }
  }
</style>
