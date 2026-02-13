<script lang="ts">
  import Avatar from "./Avatar.svelte";
  import {
    formatContributorName,
    type ContributorName,
  } from "$lib/helpers/formatContributorName";

  type ContributorLike =
    | (ContributorName & {
        slug?: { current?: string | null } | null;
        image?: Record<string, unknown> | null;
        _id?: string | null;
      })
    | string
    | null
    | undefined;

  export let contributor: ContributorLike = null;
  export let label: string | null = null;
  export let showAvatar = true;
  export let avatarSize: "tiny" | "small" | "default" | "large" = "small";
  export let link = true;

  const normalizeContributor = (
    value: ContributorLike,
  ):
    | (ContributorName & {
        slug?: { current?: string | null } | null;
        image?: Record<string, unknown> | null;
        _id?: string | null;
      })
    | null => {
    if (!value) return null;
    if (typeof value === "string") {
      return { name: value };
    }
    return value;
  };

  $: normalized = normalizeContributor(contributor);
  $: displayName = normalized
    ? formatContributorName(normalized)
    : typeof contributor === "string"
      ? contributor
      : "";
  $: hasLinkTarget =
    link &&
    normalized?.slug?.current &&
    typeof normalized.slug.current === "string";
  $: href = hasLinkTarget
    ? `/contributors/${normalized?.slug?.current}`
    : undefined;
  $: tag = hasLinkTarget ? "a" : "div";
  $: shouldRenderAvatar = showAvatar && normalized && displayName;
</script>

<svelte:element
  this={tag}
  {...tag === "a" && href ? { href } : {}}
  class={`contributor-link ${shouldRenderAvatar ? "has-avatar" : "no-avatar"}`}
  aria-label={displayName || undefined}
>
  {#if shouldRenderAvatar}
    <Avatar contributor={normalized} alt={displayName} size={avatarSize} />
  {/if}

  <span class="contributor-text">
    {#if label}
      <span class="contributor-label">{label}</span>
    {/if}
    {#if displayName}
      <span class="contributor-name">{displayName}</span>
    {/if}
  </span>
</svelte:element>

<style>
  .contributor-link {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
    color: inherit;
  }

  .contributor-link.has-avatar {
    padding: 0.2rem 0.4rem 0.2rem 0.2rem;
    border-radius: 999px;
    transition: box-shadow 160ms ease;
  }

  a.contributor-link.has-avatar:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  }

  .contributor-text {
    display: inline-flex;
    flex-direction: column;
    gap: 0.1rem;
    line-height: 1.1;
  }

  .contributor-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--color-text-subtle);
    font-family: var(--font-head);
  }

  .contributor-name {
    font-size: 0.95rem;
    font-weight: 600;
    font-family: var(--font-head);
  }

  .contributor-link.no-avatar .contributor-name {
    font-weight: 500;
  }

  .contributor-link.no-avatar {
    gap: 0.25rem;
  }

  a.contributor-link.no-avatar:hover {
    text-decoration: underline;
  }
</style>
