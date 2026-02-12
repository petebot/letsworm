<script lang="ts">
  import ContributorCard from "$lib/display/ContributorCard.svelte";

  export let data: { contributors?: Array<any> };
  const contributors = data?.contributors ?? [];
</script>

<svelte:head>
  <title>Contributors — Let's Worm</title>
  <meta
    name="description"
    content="Meet the artists and authors behind Let's Worm."
  />
</svelte:head>

<main class="contributors-page">
  <section class="contributors-hero">
    <div class="hero-inner">
      <p class="eyebrow">The Crew</p>
      <h1>Contributors</h1>
      <p class="lead">
        Writers and artists who bring worms, stories, and oddities to life.
      </p>
    </div>
  </section>

  {#if contributors.length === 0}
    <section class="empty-state">
      <p>No contributors yet. Check back soon.</p>
    </section>
  {:else}
    <section class="contributors-grid">
      {#each contributors as contributor (contributor._id)}
        <ContributorCard {contributor} />
      {/each}
    </section>
  {/if}
</main>

<style>
  .contributors-page {
    width: min(100%, 80rem);
    padding: 2rem 1.5rem 4rem;
    margin: 0 auto;
  }

  .contributors-hero {
    position: relative;
    padding: 3rem 2rem;
    overflow: hidden;
    margin-bottom: 2.5rem;
    text-align: center;
  }

  .eyebrow {
    margin: 0 0 0.5rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.8rem;
  }

  h1 {
    margin: 0 0 0.75rem;
    font-size: clamp(2.5rem, 5vw, 4.5rem);
  }

  .lead {
    margin: 0 auto;
    font-size: 1.15rem;
    color: var(--color-text-subtle);
    max-width: 36rem;
  }

  .contributors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .empty-state {
    padding: 2.5rem;
    text-align: center;
    border: 1px dashed var(--color-border);
    border-radius: 16px;
  }

  @media (max-width: 640px) {
    .contributors-page {
      padding: 1.5rem 1rem 3rem;
    }

    .contributors-hero {
      padding: 2rem 1.5rem;
    }
  }
</style>
