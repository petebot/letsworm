<script lang="ts">
  import {
    formatContributorName,
    type ContributorName,
  } from "$lib/helpers/formatContributorName";
  import Avatar from "./Avatar.svelte";

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
  $: avatarSize = (
    resolvedVariant === "hero"
      ? "large"
      : resolvedVariant === "compact"
        ? "small"
        : "default"
  ) as "small" | "default" | "large";
</script>

<svelte:element
  this={tag}
  {...href ? { href } : {}}
  class={`contributor-card ${resolvedVariant}`}
  aria-label={name}
>
  <Avatar {contributor} alt={name} size={avatarSize} />

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
