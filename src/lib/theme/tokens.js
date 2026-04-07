/**
 * @typedef {{ r: number; g: number; b: number }} RgbColor
 */

/**
 * @param {number} value
 */
const clampChannel = (value) => Math.max(0, Math.min(255, Math.round(value)));

/**
 * @param {string} hex
 * @returns {RgbColor}
 */
const hexToRgb = (hex) => {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : normalized;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
};

/**
 * @param {RgbColor} color
 */
const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((channel) => clampChannel(channel).toString(16).padStart(2, "0"))
    .join("")}`;

/**
 * @param {string} foreground
 * @param {string} background
 * @param {number} foregroundWeight
 */
const mixHex = (foreground, background, foregroundWeight) => {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  const weight = Math.max(0, Math.min(1, foregroundWeight));
  const backgroundWeight = 1 - weight;

  return rgbToHex({
    r: fg.r * weight + bg.r * backgroundWeight,
    g: fg.g * weight + bg.g * backgroundWeight,
    b: fg.b * weight + bg.b * backgroundWeight,
  });
};

/**
 * @param {string} hex
 * @param {number} alpha
 */
const rgba = (hex, alpha) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const palette = {
  white: "#F6EEE8",
  black: "#271d09",
  mauveDark: "#8C5061",
  mauve: "#bf718e",
  mauveLight: "#D9A5B3",
  cream: "#F5F1E8",
  pureblack: "#000000",
};

const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "4xl": "6rem",
};

const layout = {
  containerMax: "64rem",
  contentMax: "48rem",
  contentNarrow: "36rem",
  breakpointMobile: "480px",
  breakpointTablet: "720px",
  breakpointDesktop: "1024px",
};

const font = {
  body: '"adobe-caslon-pro", serif',
  head: `"futura-pt", Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
		Cantarell, "Open Sans", "Helvetica Neue", sans-serif`,
  mono: '"Fira Mono", monospace',
};

const color = {
  ...palette,
  primary: palette.mauveLight,
  primaryTint10: mixHex(palette.white, palette.mauveLight, 0.1),
  primaryTint20: mixHex(palette.white, palette.mauveLight, 0.2),
  primaryTint30: mixHex(palette.white, palette.mauveLight, 0.3),
  primaryTint40: mixHex(palette.white, palette.mauveLight, 0.4),
  primaryTint50: mixHex(palette.white, palette.mauveLight, 0.5),
  primaryShade10: mixHex(palette.pureblack, palette.mauveLight, 0.1),
  primaryShade20: mixHex(palette.pureblack, palette.mauveLight, 0.2),
  primaryShade30: mixHex(palette.pureblack, palette.mauveLight, 0.3),
  primaryShade40: mixHex(palette.pureblack, palette.mauveLight, 0.4),
  primaryShade50: mixHex(palette.pureblack, palette.mauveLight, 0.5),
  primaryA10: rgba(palette.mauveLight, 0.1),
  primaryA20: rgba(palette.mauveLight, 0.2),
  primaryA30: rgba(palette.mauveLight, 0.3),
  primaryA40: rgba(palette.mauveLight, 0.4),
  primaryA50: rgba(palette.mauveLight, 0.5),
  primaryA60: rgba(palette.mauveLight, 0.6),
  primaryA70: rgba(palette.mauveLight, 0.7),
  primaryA80: rgba(palette.mauveLight, 0.8),
  primaryA90: rgba(palette.mauveLight, 0.9),
  primaryA100: rgba(palette.mauveLight, 1),
  blackA10: rgba(palette.black, 0.1),
  blackA20: rgba(palette.black, 0.2),
  blackA30: rgba(palette.black, 0.3),
  blackA40: rgba(palette.black, 0.4),
  blackA50: rgba(palette.black, 0.5),
  blackA60: rgba(palette.black, 0.6),
  blackA70: rgba(palette.black, 0.7),
  blackA80: rgba(palette.black, 0.8),
  blackA90: rgba(palette.black, 0.9),
  blackA100: rgba(palette.black, 1),
  whiteA10: rgba(palette.white, 0.1),
  whiteA20: rgba(palette.white, 0.2),
  whiteA30: rgba(palette.white, 0.3),
  whiteA40: rgba(palette.white, 0.4),
  whiteA50: rgba(palette.white, 0.5),
  whiteA60: rgba(palette.white, 0.6),
  whiteA70: rgba(palette.white, 0.7),
  whiteA80: rgba(palette.white, 0.8),
  whiteA90: rgba(palette.white, 0.9),
  whiteA100: rgba(palette.white, 1),
  blackTint10: mixHex(palette.white, palette.black, 0.1),
  blackTint20: mixHex(palette.white, palette.black, 0.2),
  blackTint30: mixHex(palette.white, palette.black, 0.3),
  blackTint40: mixHex(palette.white, palette.black, 0.4),
  blackTint50: mixHex(palette.white, palette.black, 0.5),
  blackShade10: mixHex(palette.pureblack, palette.black, 0.1),
  blackShade20: mixHex(palette.pureblack, palette.black, 0.2),
  blackShade30: mixHex(palette.pureblack, palette.black, 0.3),
  blackShade40: mixHex(palette.pureblack, palette.black, 0.4),
  blackShade50: mixHex(palette.pureblack, palette.black, 0.5),
  blackDark: mixHex(palette.pureblack, palette.black, 0.5),
  whiteShade10: mixHex(palette.black, palette.white, 0.1),
  whiteShade20: mixHex(palette.black, palette.white, 0.2),
  whiteShade30: mixHex(palette.black, palette.white, 0.3),
  whiteShade40: mixHex(palette.black, palette.white, 0.4),
  whiteShade50: mixHex(palette.black, palette.white, 0.5),
};

export const themeTokens = {
  color,
  spacing,
  layout,
  font,
};

export const emailTheme = {
  bodyBackground: color.black,
  surface: color.black,
  border: color.whiteShade20,
  text: color.white,
  accent: color.primary,
  accentText: color.black,
  serifFont: "Georgia, Times New Roman, serif",
};

export const themeCssVariables = {
  "color-primary": color.primary,
  "color-white": color.white,
  "color-black": color.black,
  "color-mauve-dark": color.mauveDark,
  "color-mauve": color.mauve,
  "color-mauve-light": color.mauveLight,
  "color-cream": color.cream,
  pureblack: color.pureblack,
  "color-primary-tint-10": color.primaryTint10,
  "color-primary-tint-20": color.primaryTint20,
  "color-primary-tint-30": color.primaryTint30,
  "color-primary-tint-40": color.primaryTint40,
  "color-primary-tint-50": color.primaryTint50,
  "color-primary-shade-10": color.primaryShade10,
  "color-primary-shade-20": color.primaryShade20,
  "color-primary-shade-30": color.primaryShade30,
  "color-primary-shade-40": color.primaryShade40,
  "color-primary-shade-50": color.primaryShade50,
  "color-primary-a10": color.primaryA10,
  "color-primary-a20": color.primaryA20,
  "color-primary-a30": color.primaryA30,
  "color-primary-a40": color.primaryA40,
  "color-primary-a50": color.primaryA50,
  "color-primary-a60": color.primaryA60,
  "color-primary-a70": color.primaryA70,
  "color-primary-a80": color.primaryA80,
  "color-primary-a90": color.primaryA90,
  "color-primary-a100": color.primaryA100,
  "color-black-a10": color.blackA10,
  "color-black-a20": color.blackA20,
  "color-black-a30": color.blackA30,
  "color-black-a40": color.blackA40,
  "color-black-a50": color.blackA50,
  "color-black-a60": color.blackA60,
  "color-black-a70": color.blackA70,
  "color-black-a80": color.blackA80,
  "color-black-a90": color.blackA90,
  "color-black-a100": color.blackA100,
  "color-white-a10": color.whiteA10,
  "color-white-a20": color.whiteA20,
  "color-white-a30": color.whiteA30,
  "color-white-a40": color.whiteA40,
  "color-white-a50": color.whiteA50,
  "color-white-a60": color.whiteA60,
  "color-white-a70": color.whiteA70,
  "color-white-a80": color.whiteA80,
  "color-white-a90": color.whiteA90,
  "color-white-a100": color.whiteA100,
  "color-black-tint-10": color.blackTint10,
  "color-black-tint-20": color.blackTint20,
  "color-black-tint-30": color.blackTint30,
  "color-black-tint-40": color.blackTint40,
  "color-black-tint-50": color.blackTint50,
  "color-black-shade-10": color.blackShade10,
  "color-black-shade-20": color.blackShade20,
  "color-black-shade-30": color.blackShade30,
  "color-black-shade-40": color.blackShade40,
  "color-black-shade-50": color.blackShade50,
  "color-black-dark": color.blackDark,
  "color-white-shade-10": color.whiteShade10,
  "color-white-shade-20": color.whiteShade20,
  "color-white-shade-30": color.whiteShade30,
  "color-white-shade-40": color.whiteShade40,
  "color-white-shade-50": color.whiteShade50,
  "space-xs": spacing.xs,
  "space-sm": spacing.sm,
  "space-md": spacing.md,
  "space-lg": spacing.lg,
  "space-xl": spacing.xl,
  "space-2xl": spacing["2xl"],
  "space-3xl": spacing["3xl"],
  "space-4xl": spacing["4xl"],
  "container-max": layout.containerMax,
  "content-max": layout.contentMax,
  "content-narrow": layout.contentNarrow,
  "breakpoint-mobile": layout.breakpointMobile,
  "breakpoint-tablet": layout.breakpointTablet,
  "breakpoint-desktop": layout.breakpointDesktop,
  "font-body": font.body,
  "font-head": font.head,
  "font-mono": font.mono,
};
