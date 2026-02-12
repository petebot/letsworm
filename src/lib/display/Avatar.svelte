<svelte:options runes={true} />

<script lang="ts">
  import { urlFor } from "../../sanity";
  import {
    getContributorInitials,
    type ContributorName,
  } from "$lib/helpers/formatContributorName";

  let {
    contributor = null,
    alt = "",
    size = "default",
    hideInitials = false
  }: {
    contributor?: (ContributorName & {
      image?: Record<string, unknown> | null;
    }) | null;
    alt?: string;
    size?: "small" | "default" | "large";
    hideInitials?: boolean;
  } = $props();

  let initials = $derived(hideInitials ? "" : getContributorInitials(contributor));
</script>

<div
  class="avatar"
  class:small={size === "small"}
  class:large={size === "large"}
>
  {#if contributor?.image}
    <img
      src={urlFor(contributor.image)
        .width(240)
        .height(240)
        .auto("format")
        .url()}
      {alt}
    />
  {:else if initials}
    <span class="initials" aria-hidden="true">{initials}</span>
  {/if}
</div>

<style>
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
    flex-shrink: 0;
  }

  .avatar.small {
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }

  .avatar.large {
    width: 180px;
    height: 180px;
    border-radius: 24px;
  }

  img {
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

  .avatar.large .initials {
    font-size: 3rem;
  }

  .avatar.small .initials {
    font-size: 1.1rem;
  }
</style>
