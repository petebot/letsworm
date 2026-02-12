<svelte:options runes={true} />

<script lang="ts">
  const threshold = 320;

  // `scrollY` is bound to the window scroll position via <svelte:window bind:scrollY />
  let scrollY = $state(0);
  let visible = $derived(scrollY > threshold);

  function scrollToTop() {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<svelte:window bind:scrollY />

<button
  class="back-to-top"
  aria-label="Back to top"
  on:click={scrollToTop}
  class:visible
  aria-hidden={!visible}
  tabindex={visible ? 0 : -1}
>
  <svg
    class="arrow"
    viewBox="0 0 8.02 25.51"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4.17,12.22c1.07-.53,2.28-1.12,2.28-2.41,0-1.19-.63-1.82-1.13-2.32-.46-.46-.82-.82-.83-1.56h3.54L3.95,0,0,5.93h3.48c.02,1.16.63,1.77,1.13,2.27.47.47.84.83.84,1.61,0,.62-.68,1-1.72,1.51-1.07.53-2.28,1.12-2.28,2.41s1.21,1.89,2.28,2.41c1.04.51,1.72.89,1.72,1.51s-.68,1-1.72,1.51c-1.07.52-2.28,1.12-2.28,2.41,0,1.19.63,1.82,1.13,2.32.47.47.84.83.84,1.61h1c0-1.19-.63-1.82-1.13-2.32-.47-.47-.84-.83-.84-1.61,0-.62.68-1,1.72-1.51,1.07-.52,2.28-1.12,2.28-2.41s-1.21-1.89-2.28-2.41c-1.04-.51-1.72-.89-1.72-1.51s.68-1,1.72-1.51Z"
      fill="currentColor"
    />
  </svg>
</button>

<style>
  .back-to-top {
    position: fixed;
    right: 3.5rem;
    bottom: 1.5rem;
    background: var(--color-primary);
    color: var(--base-background-color);
    border: none;
    border-radius: 999px;
    width: 3rem;
    height: 3rem;
    display: grid;
    place-items: center;
    box-shadow: var(--shadow-md);
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 180ms ease,
      transform 180ms ease;
    cursor: pointer;
    z-index: var(--z-fixed);
  }

  .back-to-top.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .back-to-top:focus {
    outline: 2px solid
      color-mix(in srgb, var(--color-text) 30%, var(--color-background));
    outline-offset: 2px;
  }

  .arrow {
    width: 1.2rem;
    height: 1.2rem;
    color: inherit;
  }

  @media (max-width: 720px) {
    .back-to-top {
      right: 0.75rem;
      bottom: 1rem;
      width: 2.5rem;
      height: 2.5rem;
    }
  }
</style>
