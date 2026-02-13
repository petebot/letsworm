<script lang="ts">
  export let open = false;
  export let strokeWidth = 2.6;
  export let color = "currentColor";
</script>

<svg
  class:open
  style={`--icon-color:${color};--icon-stroke:${strokeWidth};`}
  width="32"
  height="28"
  viewBox="0 0 32 28"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  focusable="false"
>
  <g class="icon-worm" aria-hidden="true">
    <path
      class="worm-line"
      d="M3 6c2.6-3.2 5.2 3.2 7.8 0s5.2-3.2 7.8 0 5.2-3.2 7.8 0"
    />
    <path
      class="worm-line"
      d="M3 14c2.6-3.2 5.2 3.2 7.8 0s5.2-3.2 7.8 0 5.2-3.2 7.8 0"
    />
    <path
      class="worm-line"
      d="M3 22c2.6-3.2 5.2 3.2 7.8 0s5.2-3.2 7.8 0 5.2-3.2 7.8 0"
    />
  </g>

  <g class="icon-close" aria-hidden="true">
    <line class="close-line" x1="7" y1="7" x2="25" y2="21" />
    <line class="close-line" x1="25" y1="7" x2="7" y2="21" />
  </g>
</svg>

<style>
  svg {
    display: block;
    transition: transform 0.32s ease;
  }

  .worm-line {
    stroke: var(--icon-color);
    stroke-width: var(--icon-stroke);
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    transition: opacity 0.2s ease;
  }

  .icon-worm {
    transition:
      opacity 0.2s ease,
      transform 0.28s ease;
  }

  .icon-close {
    opacity: 0;
    transform: scale(0.85);
    transform-origin: center;
    transition:
      opacity 0.2s ease,
      transform 0.28s ease;
  }

  .close-line {
    stroke: var(--icon-color);
    stroke-width: var(--icon-stroke);
    stroke-linecap: round;
  }

  svg.open .icon-worm {
    opacity: 0;
    transform: scale(0.8);
  }

  svg.open .icon-close {
    opacity: 1;
    transform: scale(1);
  }
</style>
