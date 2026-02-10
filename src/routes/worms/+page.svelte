<script lang="ts">
  import Worm from "$lib/display/Worm.svelte";
  import type { Post } from "$lib/data/posts";

  export let data: { data?: Post[] };

  $: posts = Array.isArray(data?.data) ? data.data : [];
</script>

<svelte:head>
  <title>All Worms | Let's Worm</title>
  <meta name="description" content="Browse the full Worm archive." />
</svelte:head>

<section class="all-worms">
  <header class="all-worms__header">
    <h2>All Worms</h2>
    <p class="lead">Every Worm in one easy-to-scan grid.</p>
  </header>

  {#if posts.length > 0}
    <ul class="auto-grid">
      {#each posts as item}
        <Worm {item} />
      {/each}
    </ul>
  {:else}
    <p>No data available.</p>
  {/if}
</section>

<style>
  .all-worms {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    z-index: 1;
  }

  .all-worms__header {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .all-worms__header p {
    margin: 0;
  }
</style>
