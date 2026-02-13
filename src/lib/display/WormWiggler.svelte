<svg
  class="worm"
  x="0px"
  y="0px"
  viewBox="0 0 316 40"
  style="enable-background:new 0 0 316 40;"
  xml:space="preserve"
>
  <path
    d="M6.5,6.5c30,0,30,26.9,60,26.9c30,0,30-26.9,60-26.9c30,0,30,26.9,60,26.9c30,0,30-26.9,60-26.9
	c30,0,30,26.9,60,26.9"
  />
</svg>

<style>
  .worm {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.2);
    width: 300px;
    margin-left: -50px;
  }
  .worm path {
    stroke-dasharray: 203px, 345px;
    stroke-dashoffset: 0;
    fill: none;
    stroke: var(--color-primary);
    stroke-width: 13;
    stroke-linecap: round;
    stroke-miterlimit: 10;
    -webkit-animation: worm 1s linear infinite;
    animation: worm 1s linear infinite;
  }

  @-webkit-keyframes worm {
    0% {
      stroke-dashoffset: 0px;
      transform: translateX(119px);
    }
    100% {
      stroke-dashoffset: -136px;
      transform: translateX(0);
    }
  }

  @keyframes worm {
    0% {
      stroke-dashoffset: 0px;
      transform: translateX(119px);
    }
    100% {
      stroke-dashoffset: -136px;
      transform: translateX(0);
    }
  }
</style>
