<script lang="ts">
  import WormWiggler from "./WormWiggler.svelte";
  import { urlFor } from "../../sanity";
  import ContributorLink from "./ContributorLink.svelte";
  import type { ContributorEntry } from "$lib/helpers/formatByline";
  // StoryHero: large visual hero for individual stories or story previews
  export let title: string = "Untitled";
  export let byline: string | null = null;
  export let contributors: ContributorEntry[] = [];
  export let showContributorAvatars = false;
  export let excerpt: string | null = null;
  export let coverImage: Record<string, unknown> | null = null;
  export let coverUrl: string | null = null;
  export let href: string | null = null;
  export let link: boolean | string = true;
  $: normalizedLink = link === true || link === "true";
  $: tag = href && normalizedLink ? "a" : "div";
  $: allowContributorLinks = tag !== "a";
  export let height: string = "min(48vh, 35rem)";
  // allow tuning the focal point of the cover
  export let coverPosition: string = "center center";

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

  $: resolvedCoverUrl = coverImage
    ? urlFor(coverImage).width(2000).auto("format").url()
    : coverUrl;
  $: resolvedCoverPosition = getHotspotPosition(coverImage) ?? coverPosition;
</script>

<section
  class="story-hero"
  style={`--height:${height}; ${resolvedCoverUrl ? `--cover:url('${resolvedCoverUrl}');` : ""} --cover-position: ${resolvedCoverPosition}`}
>
  <svelte:element
    this={tag}
    {...tag === "a" ? { href } : {}}
    class={tag === "a" ? "hero-link" : "hero-plain"}
    role={tag === "div" ? "region" : undefined}
    aria-label={tag === "div" ? title : undefined}
  >
    <div class="cover" aria-hidden="true"></div>

    <div class="meta">
      {#if contributors.length > 0}
        <ul class="contributors">
          {#each contributors as entry (entry.role + entry.name)}
            <li>
              <ContributorLink
                contributor={entry.person ?? entry.name}
                label={entry.label}
                showAvatar={showContributorAvatars}
                avatarSize="tiny"
                link={allowContributorLinks}
              />
            </li>
          {/each}
        </ul>
      {:else if byline}
        <div class="byline">{byline}</div>
      {/if}

      <h2 class="title">{title}</h2>

      {#if excerpt}
        <p class="excerpt">{excerpt}</p>
      {/if}
    </div>
  </svelte:element>
  {#if tag === "a"}
    <div class="show-wiggler">
      <WormWiggler />
    </div>
  {/if}
</section>

<style>
  .story-hero {
    position: relative;
    height: var(--height);
    min-height: 90vh;
    width: 100%;
    max-width: 80rem;
    padding: clamp(0.75rem, 3vw, 1.5rem);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    overflow: hidden;
    color: var(--color-text, #fff);
    background-color: var(--color-bg-primary, #111);
  }

  .hero-link,
  .hero-plain {
    display: block;
    width: 100%;
    height: 100%;
    color: inherit;
    text-decoration: none;
  }

  .cover {
    position: absolute;
    inset: 0;
    background-image: var(--cover, none);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: var(--cover-position, center center);
    transform-origin: center;
    width: 100%;
    transition: 1s ease-in-out;
  }

  .story-hero .hero-link:after {
    content: "";
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 0 0 transparent;
    transition: all 0.4s ease-in-out 0.2s;
  }
  .story-hero:hover .hero-link:after {
    box-shadow: inset 0 0 0 1rem var(--color-primary-a50);
  }
  .story-hero:hover .hero-link .cover {
    transform: scale(1.05);
  }

  .show-wiggler {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease-in;
    bottom: 3rem;
    right: 3rem;
    width: 18rem;
    height: 5rem;
  }
  .story-hero:hover .show-wiggler {
    opacity: 1;
    pointer-events: auto;
    transition: all 1.3s ease-out;
  }

  .cover::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.18),
      rgba(0, 0, 0, 0.55)
    );
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .meta {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    z-index: 2;
    max-width: min(35rem, calc(100% - 2rem));
    padding: clamp(1.25rem, 4vw, 2rem);
    box-sizing: border-box;
    background: var(--base-background-color, rgba(255, 255, 255, 0.85));
  }

  .contributors {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 0;
    margin: 0 0 0.5rem 0;
    list-style: none;
  }

  .byline {
    color: var(--color-text-subtle, rgba(255, 255, 255, 0.85));
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    letter-spacing: 0.08em;
    font-family: var(--font-head);
    text-transform: uppercase;
  }

  .title {
    margin: 0 0 0.5rem 0;
    font-size: clamp(1.25rem, 3.6vw, 2.75rem);
    line-height: 1.02;
    font-weight: 800;
    color: var(--color-text, #fff);
  }

  .excerpt {
    margin: 0;
    color: var(--color-text-subtle, rgba(255, 255, 255, 0.9));
    font-size: clamp(0.95rem, 2.2vw, 1.05rem);
    max-width: 56ch;
  }

  @media (min-width: 960px) {
    .title {
      font-size: clamp(1.8rem, 3.8vw, 4rem);
    }
  }

  @media (max-width: 720px) {
    .story-hero {
      min-height: min(80vh, 34rem);
    }

    .meta {
      left: 0.75rem;
      right: 0.75rem;
      bottom: 0.75rem;
      padding: 1.25rem;
    }

    .contributors {
      gap: 0.6rem;
    }

    .excerpt {
      font-size: 0.95rem;
    }
  }
</style>
