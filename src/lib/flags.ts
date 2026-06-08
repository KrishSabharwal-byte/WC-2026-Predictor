export type FlagSize = 'sm' | 'md' | 'lg' | 'xl';

const FLAG_WIDTH: Record<FlagSize, number> = {
  sm: 28,
  md: 36,
  lg: 52,
  xl: 96,
};

/** Local bundled SVG flags in /public/flags/ */
export function flagUrl(flagCode: string): string {
  return `/flags/${flagCode.toLowerCase()}.svg`;
}

export function flagImg(flagCode: string, size: FlagSize = 'md', alt = ''): string {
  const url = flagUrl(flagCode);
  const width = FLAG_WIDTH[size];
  const height = Math.round(width * 0.75);
  const label = alt ? `${alt} flag` : `${flagCode} flag`;
  return `<img class="flag-img flag-${size}" src="${url}" alt="${label}" title="${label}" width="${width}" height="${height}" decoding="async" />`;
}
