<script lang="ts">
  import Worm from "$lib/display/Worm.svelte";
  import type { Post } from "$lib/data/posts";

  export let data: {
    data: {
      categoryTitle?: string;
      category?: string;
      posts?: Post[];
    };
  };

  const ensureArray = <T,>(value: T[] | undefined | null): T[] =>
    Array.isArray(value) ? value : [];


  $: categoryTitle = data?.data?.categoryTitle ?? "";
  $: category = data?.data?.category ?? "";
  $: posts = ensureArray(data?.data?.posts);
</script>

<main>
  <h1>{categoryTitle}</h1>

  {#if posts.length > 0}
    <ul class="auto-grid">
      {#each posts as item}
        <Worm {item} />
      {/each}
    </ul>
  {:else}
    <p>No posts found in this category.</p>
  {/if}
</main>

<style>
  h1 {
    text-align: left;
  }

</style>
