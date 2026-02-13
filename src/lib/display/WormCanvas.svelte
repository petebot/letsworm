<script lang="ts">
  import type { DigitAsset } from "$lib/display/digits";
  import digitsDefault from "$lib/display/digits";
  import {
    computeGlobalScale,
    defaultAdvanceWidth,
    computeNormals,
    offsetPoints,
  } from "$lib/display/worm-helpers";
  import type { Vec } from "$lib/display/worm-helpers";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  export let number: string | number = "14";
  export let thickness = 40;
  export let ringSpacing = 3;
  export let ringCount = 18;
  // circle-mode draws overlapping radial-gradient circles along the path
  export let circleMode: boolean = true;
  export let circleSpacing: number = 6; // px between circle centers (before scaling)
  // supersample factor for offscreen rendering to reduce aliasing (1 = no supersample)
  export let supersample: number = 3;
  // if true, read colors from CSS variables (fallback to props)
  export let useCssVars: boolean = true;
  // stroke controls
  export let strokeColorHex: string = "#000000";
  export let strokeAlpha: number = 0.15;
  export let strokeWidthFactor: number = 0.08; // fraction of radius used for circle stroke width
  // minimum displayed width (px) to avoid tiny canvas; can be adjusted
  export let minDisplayWidth: number = 600;
  export let colorStops = [
    { offset: 0, color: "#3b2a18" },
    { offset: 1, color: "#e6b7c0" },
  ];
  export let gap = 18;
  export let segments = 64;
  export let targetHeight = 700;
  export let advanceWidth: number = defaultAdvanceWidth();
  export let digitMap: Record<number, DigitAsset> = digitsDefault;

  // derived
  // Preserve 0 as a valid issue number
  $: numStr = String(number ?? "");
  $: globalScale = computeGlobalScale(digitMap, targetHeight);
  $: slotWidth = advanceWidth;
  $: digitWidths = numStr
    .split("")
    .map((ch) => digitMap?.[Number(ch)]?.width ?? slotWidth);
  $: totalWidth =
    digitWidths.reduce((acc, w) => acc + w * globalScale, 0) +
    Math.max(0, numStr.length - 1) * gap;
  $: canvasWidth = Math.max(1, Math.round(totalWidth));
  $: canvasHeight = Math.max(1, Math.round(targetHeight));

  let canvas: HTMLCanvasElement | null = null;
  let mounted = false;

  function hexToRgb(hex: string) {
    const m = hex.replace("#", "");
    const bigint = parseInt(
      m.length === 3
        ? m
            .split("")
            .map((c) => c + c)
            .join("")
        : m,
      16,
    );
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }

  function cssVar(name: string, fallback: string) {
    try {
      const el = canvas?.parentElement || document.documentElement;
      const v = getComputedStyle(el).getPropertyValue(name).trim();
      return v || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function lerpColor(a: string, b: string, t: number) {
    const A = hexToRgb(a);
    const B = hexToRgb(b);
    const r = Math.round(A.r + (B.r - A.r) * t);
    const g = Math.round(A.g + (B.g - A.g) * t);
    const bl = Math.round(A.b + (B.b - A.b) * t);
    return `rgb(${r},${g},${bl})`;
  }

  function samplePathPoints(d: string, samples: number): Vec[] {
    try {
      const svgNS = "http://www.w3.org/2000/svg";
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", d || "");
      const L = path.getTotalLength();
      if (!isFinite(L) || L <= 0) return [];
      const pts: Vec[] = [];
      for (let i = 0; i < samples; i++) {
        const pos = path.getPointAtLength((i / (samples - 1)) * L);
        pts.push({ x: pos.x, y: pos.y });
      }
      return pts;
    } catch (e) {
      return [];
    }
  }

  function draw() {
    if (!browser || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // set physical canvas size with devicePixelRatio support
    const dpr = (window && (window.devicePixelRatio || 1)) || 1;
    // add padding so thick strokes / circles near edges are not clipped
    const pad = Math.ceil(thickness / 2 + Math.max(1, thickness * 0.04) + 2);
    const padX = pad;
    const displayWidth = Math.max(canvasWidth + padX * 2, minDisplayWidth);
    const displayHeight = canvasHeight + pad * 2;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    // backing store: device pixels (include vertical padding)
    canvas.width = Math.max(1, Math.round(displayWidth * dpr));
    canvas.height = Math.max(1, Math.round(displayHeight * dpr));

    // prepare an offscreen high-res buffer if supersampling requested
    const SS = Math.max(1, Math.floor(supersample));
    let drawCtx: CanvasRenderingContext2D = ctx;
    let offscreen: HTMLCanvasElement | null = null;
    if (SS > 1) {
      offscreen = document.createElement("canvas");
      offscreen.width = Math.max(1, Math.round(canvas.width * SS));
      offscreen.height = Math.max(1, Math.round(canvas.height * SS));
      const oc = offscreen.getContext("2d");
      if (!oc) return;
      // map logical units to offscreen device pixels (dpr * SS)
      oc.setTransform(dpr * SS, 0, 0, dpr * SS, 0, 0);
      oc.imageSmoothingEnabled = true;
      // @ts-ignore - some browsers support imageSmoothingQuality
      oc.imageSmoothingQuality = "high";
      oc.clearRect(0, 0, displayWidth, displayHeight);
      drawCtx = oc;
    } else {
      // use main ctx but set transform to dpr so logical coords map to device pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      // @ts-ignore
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, displayWidth, displayHeight);
    }

    // resolve colors (prefer css vars when enabled)
    const resolvedA = useCssVars
      ? cssVar("--worm-color-a", colorStops[0].color)
      : colorStops[0].color;
    const resolvedB = useCssVars
      ? cssVar("--worm-color-b", colorStops[1].color)
      : colorStops[1].color;
    const resolvedStroke = useCssVars
      ? cssVar("--worm-stroke", strokeColorHex)
      : strokeColorHex;
    const localColorStops = [
      { offset: 0, color: resolvedA },
      { offset: 1, color: resolvedB },
    ];
    const localStrokeColorHex = resolvedStroke;

    const samplesPerStroke = Math.max(12, segments);
    const rings = Math.max(4, ringCount);
    const spacing = Math.max(1, ringSpacing);

    // draw each digit
    let penX = 0;
    for (let i = 0; i < numStr.length; i++) {
      const ch = Number(numStr[i]);
      const dAsset = digitMap?.[ch];
      if (!dAsset || !dAsset.paths || dAsset.paths.length === 0) continue;
      const dx = penX;
      const s = globalScale;
      const transY = pad + (canvasHeight - dAsset.height * s);
      const centerOffset = 0;

      for (const d of dAsset.paths) {
        if (circleMode) {
          // circle-based sampling along arc length with spacing
          try {
            const svgNS = "http://www.w3.org/2000/svg";
            const pathEl = document.createElementNS(svgNS, "path");
            pathEl.setAttribute("d", d || "");
            const L = pathEl.getTotalLength();
            if (!isFinite(L) || L <= 0) continue;
            // step measured in original path units -> divide by scale
            const step = Math.max(1, circleSpacing / s);
            // draw circles from back to front along the path
            for (let dist = 0; dist <= L; dist += step) {
              const pos = pathEl.getPointAtLength(dist);
              const displayOffset = (displayWidth - canvasWidth) / 2;
              const cx = displayOffset + dx + centerOffset + pos.x * s;
              const cy = transY + pos.y * s;
              const radius = Math.max(1, thickness / 2);
              // linear gradient across circle (left->right) to emulate blended look
              const grad = drawCtx.createLinearGradient(
                cx - radius,
                cy,
                cx + radius,
                cy,
              );
              grad.addColorStop(
                0,
                localColorStops[1]?.color || localColorStops[0].color,
              );
              grad.addColorStop(1, localColorStops[0].color);
              drawCtx.beginPath();
              drawCtx.fillStyle = grad;
              drawCtx.arc(cx, cy, radius, 0, Math.PI * 2);
              drawCtx.fill();
              // subtle stroke to enhance 3D feel (configurable)
              const strokeRgb = hexToRgb(localStrokeColorHex || "#000");
              drawCtx.lineWidth = Math.max(0.5, radius * strokeWidthFactor);
              drawCtx.strokeStyle = `rgba(${strokeRgb.r},${strokeRgb.g},${strokeRgb.b},${strokeAlpha})`;
              drawCtx.stroke();
            }
          } catch (e) {
            // fall back to polygon bands if something fails
            continue;
          }
        } else {
          const pts = samplePathPoints(d, samplesPerStroke);
          if (!pts || pts.length < 2) continue;
          const normals = computeNormals(pts);

          for (let r = rings - 1; r >= 0; r--) {
            const outerOff = (r * spacing) / s;
            const innerOff = ((r - 1) * spacing) / s;
            const outerPts = offsetPoints(pts, normals, outerOff);
            const innerPts = offsetPoints(pts, normals, Math.max(0, innerOff));
            if (
              !outerPts ||
              outerPts.length < 2 ||
              !innerPts ||
              innerPts.length < 2
            )
              continue;

            // build polygon: outer forward, inner reversed
            drawCtx.beginPath();
            const displayOffset = (displayWidth - canvasWidth) / 2;
            for (let k = 0; k < outerPts.length; k++) {
              const p = outerPts[k];
              const x = displayOffset + dx + centerOffset + p.x * s;
              const y = transY + p.y * s;
              if (k === 0) drawCtx.moveTo(x, y);
              else drawCtx.lineTo(x, y);
            }
            for (let k = innerPts.length - 1; k >= 0; k--) {
              const p = innerPts[k];
              const x = displayOffset + dx + centerOffset + p.x * s;
              const y = transY + p.y * s;
              drawCtx.lineTo(x, y);
            }
            drawCtx.closePath();

            // fill color interpolated across rings
            const t = r / Math.max(1, rings - 1);
            const color = lerpColor(
              localColorStops[0].color,
              localColorStops[1].color,
              t,
            );
            drawCtx.fillStyle = color;
            drawCtx.fill();
            // optional subtle outline for each band
            const strokeRgb = hexToRgb(localStrokeColorHex || "#000");
            drawCtx.lineWidth = Math.max(0.5, thickness * 0.04);
            drawCtx.strokeStyle = `rgba(${strokeRgb.r},${strokeRgb.g},${strokeRgb.b},${strokeAlpha})`;
            drawCtx.stroke();
          }
        }
      }

      penX += (dAsset.width || slotWidth) * s + gap;
    }

    // if we rendered to an offscreen high-res buffer, downscale to the main canvas
    if (offscreen) {
      // reset main ctx transform and draw the downscaled image
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      // @ts-ignore
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        offscreen,
        0,
        0,
        offscreen.width,
        offscreen.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    }
  }

  // This component is render-only (no public export functions).

  // Re-run draw when relevant inputs change (controls)
  $: if (browser && mounted) {
    // dependencies
    numStr;
    thickness;
    ringSpacing;
    ringCount;
    colorStops;
    gap;
    segments;
    targetHeight;
    advanceWidth;
    digitMap;
    globalScale;
    draw();
  }

  onMount(() => {
    mounted = true;
    draw();
    // observe theme / css-var changes and redraw when they change
    let mo: MutationObserver | null = null;
    if (useCssVars && typeof MutationObserver !== "undefined") {
      mo = new MutationObserver(() => draw());
      try {
        mo.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["data-theme", "style"],
        });
      } catch (e) {
        // ignore
      }
    }
    return () => {
      if (mo) mo.disconnect();
    };
  });
</script>

<canvas
  bind:this={canvas}
  style="height:auto;background:transparent;display:block"
></canvas>

<style>
  canvas {
    image-rendering: optimizeQuality;
    margin: 0 auto;
  }
</style>
