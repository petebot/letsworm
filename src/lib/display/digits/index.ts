// Auto-generated digit loader — imports raw SVGs and extracts path `d` strings
import d0 from '$lib/images/worm-digits/0.svg?raw';
import d1 from '$lib/images/worm-digits/1.svg?raw';
import d2 from '$lib/images/worm-digits/2.svg?raw';
import d3 from '$lib/images/worm-digits/3.svg?raw';
import d4 from '$lib/images/worm-digits/4.svg?raw';
import d5 from '$lib/images/worm-digits/5.svg?raw';
import d6 from '$lib/images/worm-digits/6.svg?raw';
import d7 from '$lib/images/worm-digits/7.svg?raw';
import d8 from '$lib/images/worm-digits/8.svg?raw';
import d9 from '$lib/images/worm-digits/9.svg?raw';

export type DigitAsset = {
  paths: string[]; // array of path `d` strings (multi-stroke digits possible)
  width: number;
  height: number;
};

function parseSVG(raw: string) {
  const viewBoxMatch = raw.match(/viewBox="([\-\d\.\s]+)"/);
  let width = 100;
  let height = 100;
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(/\s+/).map(Number);
    if (parts.length === 4) {
      width = parts[2];
      height = parts[3];
    }
  }

  const paths: string[] = [];
  const pathRE = /<path[^>]*d=\"([^\"]+)\"/g;
  let m: RegExpExecArray | null;
  while ((m = pathRE.exec(raw))) {
    paths.push(m[1]);
  }

  return { paths, width, height } as DigitAsset;
}

export const digits: Record<number, DigitAsset> = {
  0: parseSVG(d0),
  1: parseSVG(d1),
  2: parseSVG(d2),
  3: parseSVG(d3),
  4: parseSVG(d4),
  5: parseSVG(d5),
  6: parseSVG(d6),
  7: parseSVG(d7),
  8: parseSVG(d8),
  9: parseSVG(d9),
};

export default digits;
