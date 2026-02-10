<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  let visible = false;
  const threshold = 320;

  function onScroll() {
    visible = window.scrollY > threshold;
  }

  function scrollToTop() {
    // smooth scroll using window.scrollTo
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  onMount(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  });

  onDestroy(() => {
    window.removeEventListener("scroll", onScroll);
  });
</script>

<button
  class="back-to-top"
  aria-label="Back to top"
  on:click={scrollToTop}
  class:visible
>
  ↑
</button>

<style>
  .back-to-top {
    position: fixed;
    right: 1rem;
    bottom: 1.5rem;
    background: var(--color-text);
    color: var(--color-bg-primary);
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

  @media (max-width: 720px) {
    .back-to-top {
      right: 0.75rem;
      bottom: 1rem;
      width: 2.5rem;
      height: 2.5rem;
    }
  }
</style>
