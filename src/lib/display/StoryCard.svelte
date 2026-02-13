<script lang="ts">
  import { urlFor } from "../../sanity";
  import ContributorLink from "./ContributorLink.svelte";
  import type { ContributorEntry } from "$lib/helpers/formatByline";

  export let story: {
    _id: string;
    title?: string;
    excerpt?: string;
    slug?: { current?: string };
    mainImage?: Record<string, unknown> | null;
    issue?: {
      title?: string;
      issueNumber?: number | string;
      slug?: { current?: string };
    };
  };
  export let href: string;
  export let byline: string[] = [];
  export let contributors: ContributorEntry[] = [];
  export let showContributorAvatars = false;

  const getHotspotPosition = (
    image: Record<string, unknown> | null | undefined,
  ): string | null => {
    if (!image || typeof image !== "object") return null;
    const hotspot = (image as { hotspot?: { x?: number; y?: number } }).hotspot;
    if (
      !hotspot ||
      typeof hotspot.x !== "number" ||
      typeof hotspot.y !== "number"
    ) {
      return null;
    }
    const x = Math.round(hotspot.x * 100);
    const y = Math.round(hotspot.y * 100);
    return `${x}% ${y}%`;
  };

  $: imagePosition = getHotspotPosition(story?.mainImage);
</script>

<a class="story-card" {href}>
  {#if story.mainImage}
    <div class="story-image">
      <img
        src={urlFor(story.mainImage).width(600).auto("format").url()}
        alt={story.title ?? "Story"}
        style={imagePosition ? `object-position: ${imagePosition};` : ""}
      />
    </div>
  {/if}

  <div class="story-content">
    <div class="story-meta">
      {#if contributors.length > 0}
        <div class="story-contributors">
          {#each contributors as entry (entry.role + entry.name)}
            <ContributorLink
              contributor={entry.person ?? entry.name}
              label={entry.label}
              showAvatar={showContributorAvatars}
              avatarSize="tiny"
            />
          {/each}
        </div>
      {:else if byline.length > 0}
        <div class="story-labels">
          {#each byline as name}
            <span>{name}</span>
          {/each}
        </div>
      {/if}
      {#if story.title}
        <h3>{story.title}</h3>
      {/if}
      {#if story.excerpt}
        <p class="excerpt">{story.excerpt}</p>
      {/if}
    </div>
  </div>
</a>

<style>
  .story-card {
    display: flex;
    flex-direction: column;
    gap: 0;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid var(--color-border);
    text-decoration: none;
    color: inherit;
    background: var(--color-bg-emphasis);
    transition:
      transform 180ms ease,
      box-shadow 180ms ease;
  }

  .story-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  }

  .story-image {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-primary-a10) 30%, transparent),
      color-mix(in srgb, var(--color-bg-emphasis) 85%, transparent)
    );
  }

  .story-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .story-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem;
  }

  .story-meta {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  h3 {
    margin: 0;
    font-size: 1.3rem;
    line-height: 1.3;
  }

  .excerpt {
    margin: 0;
    font-size: 0.95rem;
    color: var(--color-text-subtle);
    line-height: 1.5;
  }

  .story-labels {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
  }

  .story-labels span {
    color: var(--color-text-subtle);
  }

  .story-contributors {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 640px) {
    h3 {
      font-size: 1.15rem;
    }
  }
</style>
