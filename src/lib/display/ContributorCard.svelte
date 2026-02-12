<script lang="ts">
  import { urlFor } from "../../sanity";
  import {
    formatContributorName,
    getContributorInitials,
    type ContributorName,
  } from "$lib/helpers/formatContributorName";

  export let contributor:
    | (ContributorName & {
        slug?: { current?: string };
        image?: Record<string, unknown> | null;
        roles?: string[] | null;
        storyCount?: number | null;
      })
    | null = null;
  export let compact = false;
  export let variant: "default" | "compact" | "hero" | null = null;
  export let link = true;
  export let eyebrow: string | null = null;
  export let statsText: string | null = null;

  const roleLabels: Record<string, string> = {
    author: "Author",
    artist: "Artist",
    writer: "Writer",
    illustrator: "Illustrator",
  };

  const computeEyebrow = (roles: string[]): string => {
    const hasAuthor = roles.includes("author") || roles.includes("writer");
    const hasArtist = roles.includes("artist") || roles.includes("illustrator");

    if (hasAuthor && hasArtist) return "Author & Artist";
    if (hasArtist) return "Artist";
    if (hasAuthor) return "Author";
    return "Contributor";
  };

  $: name = formatContributorName(contributor);
  $: initials = getContributorInitials(contributor);
  $: roles = contributor?.roles ?? [];
  $: hasStoryCount =
    contributor?.storyCount !== undefined && contributor?.storyCount !== null;
  $: storyCount = contributor?.storyCount ?? 0;
  $: resolvedVariant = variant ?? (compact ? "compact" : "default");
  $: href =
    link && contributor?.slug?.current
      ? `/contributors/${contributor.slug.current}`
      : null;
  $: tag = href ? "a" : "div";
  $: defaultStatsText = `${storyCount} ${storyCount === 1 ? "story" : "stories"}`;
  $: resolvedStatsText = statsText ?? defaultStatsText;
  $: resolvedEyebrow = eyebrow ?? computeEyebrow(roles);
</script>

<svelte:element
  this={tag}
  {...href ? { href } : {}}
  class={`contributor-card ${resolvedVariant}`}
  aria-label={name}
>
  <div class="avatar">
    {#if contributor?.image}
      <img
        src={urlFor(contributor.image).width(240).height(240).url()}
        alt={name}
      />
    {:else}
      <span class="initials" aria-hidden="true">{initials}</span>
    {/if}
  </div>

  <div class="meta">
    {#if resolvedEyebrow}
      <div class="eyebrow">{resolvedEyebrow}</div>
    {/if}
    <div class="name">{name}</div>

    {#if hasStoryCount}
      <div class="stats">{resolvedStatsText}</div>
    {/if}
  </div>
</svelte:element>

<style>
  .contributor-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: center;
    padding: 1rem 1.25rem;
    border: 1px solid var(--color-border);
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-bg-emphasis) 85%, transparent),
      color-mix(in srgb, var(--color-primary-a10) 30%, transparent)
    );
    text-decoration: none;
    color: inherit;
    transition:
      transform 180ms ease,
      box-shadow 180ms ease;
  }

  .contributor-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  }

  .contributor-card.compact {
    grid-template-columns: auto 1fr;
    padding: 0.85rem 1rem;
  }

  .contributor-card.hero {
    gap: 2rem;
    padding: 2rem;
    border-radius: 28px;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-bg-emphasis) 90%, transparent),
      color-mix(in srgb, var(--color-primary-a20) 35%, transparent)
    );
  }

  .avatar {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    overflow: hidden;
    background: linear-gradient(
      135deg,
      var(--color-primary-tint-20),
      var(--color-primary-tint-50)
    );
    display: grid;
    place-items: center;
    border: 1px solid color-mix(in srgb, var(--color-black) 10%, transparent);
  }

  .contributor-card.compact .avatar {
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }

  .contributor-card.hero .avatar {
    width: 180px;
    height: 180px;
    border-radius: 24px;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .initials {
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 1.4rem;
    color: var(--color-black);
    text-transform: uppercase;
  }

  .contributor-card.hero .initials {
    font-size: 3rem;
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .name {
    font-family: var(--font-head);
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .contributor-card.hero .name {
    font-size: clamp(2rem, 4vw, 3.2rem);
    margin: 0.35rem 0 0.5rem;
  }

  .eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-size: 0.75rem;
  }

  .roles {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .role {
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    background: var(--color-primary-a20);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .contributor-card.hero .role {
    padding: 0.25rem 0.6rem;
    letter-spacing: 0.1em;
  }

  .stats {
    font-size: 0.9rem;
    color: var(--color-text-subtle);
  }

  @media (max-width: 640px) {
    .contributor-card {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .avatar {
      margin: 0 auto;
    }

    .roles {
      justify-content: center;
    }

    .contributor-card.hero {
      padding: 1.5rem;
    }
  }
</style>
