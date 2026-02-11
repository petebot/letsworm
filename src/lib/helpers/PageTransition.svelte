<script lang="ts">
  import { blur, fly } from "svelte/transition";
  import { onDestroy } from "svelte";
  import { navigationStore } from "$lib/store.js";

  export let inDelay = 200;
  export let inDuration = 200;
  export let outDuration = 200;

  export let pathname = "";

  let useFly = false;
  let flyDirection = "next"; // 'next' or 'prev'

  let unsubscribe: any;

  $: {
    unsubscribe && unsubscribe();
    unsubscribe = navigationStore.subscribe((value) => {
      useFly = value.useFly;
      flyDirection = value.flyDirection;
    });
  }

  onDestroy(() => unsubscribe && unsubscribe());
  let inFlyX: number;
  let outFlyX: number;

  $: if (useFly) {
    inFlyX = flyDirection === "next" ? -200 : 200;
    outFlyX = flyDirection === "next" ? 200 : -200;
  }

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
  .transition-wrap > * {
    width: 100%;
    min-width: 0;
  }
</style>
