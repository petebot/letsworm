<script lang="ts">
  import Worm from "$lib/display/Worm.svelte";
  import type { Post } from "$lib/data/posts";

  export let data: {
    data: {
      categoryTitle?: string;
      category?: string;
      posts?: Post[];
      storyCycles?: Post[];
    };
  };

  type CycleGroup = {
    title: string;
    slug?: string;
    description?: string;
    stories: Post[];
  };

  const ensureArray = <T,>(value: T[] | undefined | null): T[] =>
    Array.isArray(value) ? value : [];

  const slugValue = (slug?: { current?: string }): string =>
    slug?.current ?? "";

  const publishedTime = (value?: string): number => {
    const parsed = value ? Date.parse(value) : NaN;
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const groupStoryCycles = (stories: Post[]): CycleGroup[] => {
    const groups = new Map<string, CycleGroup>();

    for (const story of stories) {
      if (!story) continue;
      const cycle = ensureArray(story.storyCycleName)[0];
      if (!cycle) continue;

      const key =
        cycle._id ??
        slugValue(cycle.slug) ??
        `${cycle.title ?? "cycle"}-${groups.size}`;

      if (!groups.has(key)) {
        groups.set(key, {
          title: cycle.title ?? "Story Cycle",
          slug: slugValue(cycle.slug),
          description: cycle.description ?? undefined,
          stories: [],
        });
      }

      const group = groups.get(key);
      if (!group) continue;

      group.stories.push(story);
    }

    for (const group of groups.values()) {
      group.stories.sort(
        (first, second) =>
          publishedTime(second?.publishedAt) -
          publishedTime(first?.publishedAt),
      );
    }

    return Array.from(groups.values()).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  };

  $: categoryTitle = data?.data?.categoryTitle ?? "";
  $: category = data?.data?.category ?? "";
  $: posts = ensureArray(data?.data?.posts);
  $: cyclePosts = ensureArray(data?.data?.storyCycles);
  $: groupedCycles = groupStoryCycles(cyclePosts);
</script>

<main>
  <h1>{categoryTitle}</h1>

  {#if category === "story-cycles"}
    {#if groupedCycles.length > 0}
      {#each groupedCycles as cycle}
        <section class="cycle-block" id={cycle.slug || undefined}>
          <h2>{cycle.title}</h2>
          {#if cycle.description}
            <p class="lead">{cycle.description}</p>
          {/if}
          <ul class="auto-grid">
            {#each cycle.stories as item}
              <Worm {item} />
            {/each}
          </ul>
        </section>
      {/each}
    {:else}
      <p>No story cycles available.</p>
    {/if}
  {:else if posts.length > 0}
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

  .cycle-block {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 3rem;
  }
</style>
