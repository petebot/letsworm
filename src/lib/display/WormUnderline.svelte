<svg
  class="worm-underline"
  viewBox="0 0 316 40"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path
    d="M6.5,6.5c30,0,30,26.9,60,26.9c30,0,30-26.9,60-26.9c30,0,30,26.9,60,26.9c30,0,30-26.9,60-26.9c30,0,30,26.9,60,26.9"
  />
</svg>

<style>
  .worm-underline {
    position: absolute;
    left: -1rem;
    bottom: -0.25rem;
    width: 100%;
    height: 4px;
    pointer-events: none;
    transition: var(--transition-base);
  }

  .worm-underline path {
    stroke-dasharray: 203px, 345px;
    stroke-dashoffset: 0;
    fill: none;
    stroke: var(--color-primary);
    stroke-width: 13;
    stroke-linecap: round;
    stroke-miterlimit: 10;
    animation: worm-wiggle 1s linear infinite;
  }

  @keyframes worm-wiggle {
    0% {
      stroke-dashoffset: 0px;
      transform: translateX(37.7%);
    }
    100% {
      stroke-dashoffset: -136px;
      transform: translateX(0);
    }
  }
</style>
