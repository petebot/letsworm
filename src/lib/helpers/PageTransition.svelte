<svelte:options runes={true} />

<script lang="ts">
  import { blur, fly } from "svelte/transition";
  import { get } from "svelte/store";
  import { navigationStore } from "$lib/store.js";

  let {
    inDelay = 200,
    inDuration = 200,
    outDuration = 200,
    pathname = "",
  } = $props();

  let navState = $state(get(navigationStore));

  // Subscribe to navigation store
  $effect(() => {
    const unsubscribe = navigationStore.subscribe((value) => {
      navState = value;
    });
    return unsubscribe;
  });

  let useFly = $derived(navState.useFly);
  let flyDirection = $derived(navState.flyDirection);

  let inFlyX = $derived(useFly ? (flyDirection === "next" ? -200 : 200) : 0);
  let outFlyX = $derived(useFly ? (flyDirection === "next" ? 200 : -200) : 0);

  // Add offset to avoid scroll to top before transition.
  function offsetFade(
    node: any,
    { delay = 0, duration = 400, offset }: any = {},
  ) {
    // Guard window access for SSR and capture scroll offset at runtime
    const startOffset = typeof window !== "undefined" ? window.scrollY : 0;
    const o = +getComputedStyle(node).opacity;
    const usedOffset = typeof offset === "number" ? offset : startOffset;

    return {
      delay,
      duration,
      css: (t: any) => {
        // Use transform translateY instead of margin-top to avoid layout reflow / squishing
        const translate = (1 - t) * -usedOffset;
        return `opacity: ${t * o}; transform: translateY(${translate}px); z-index: 0;`;
      },
    };
  }
</script>

{#if useFly}
  {#key pathname}
    <div
      class="transition-wrap"
      in:fly={{ x: inFlyX, duration: inDuration, delay: inDelay }}
      out:fly={{ x: outFlyX, duration: outDuration }}
    >
      <!-- svelte-ignore slot_element_deprecated -->
      <slot />
    </div>
  {/key}
{:else}
  {#key pathname}
    <div
      class="transition-wrap"
      in:blur={{ duration: inDuration, delay: inDelay }}
      out:offsetFade={{ duration: outDuration }}
    >
      <!-- svelte-ignore slot_element_deprecated -->
      <slot />
    </div>
  {/key}
{/if}

<style>
  .transition-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-width: 0; /* prevents flex or grid children from overflowing and causing shrink */
    box-sizing: border-box;
    will-change: transform, opacity;
    z-index: 0;
  }

  /* Ensure the immediate child (the slotted page) can use full width */
  .transition-wrap :global(> *) {
    width: 100%;
    min-width: 0;
  }
</style>
