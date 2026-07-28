// ============================================================
// Liquid UI -- icon registry
// SF Symbols-style monochrome icons. Use iconSvg(name) to render.
// ============================================================

export type IconName =
  | 'search'
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronUp'
  | 'chevronDown'
  | 'close'
  | 'check'
  | 'plus'
  | 'minus'
  | 'more'
  | 'share'
  | 'play'
  | 'pause'
  | 'stop'
  | 'skipBack'
  | 'skipForward'
  | 'volume'
  | 'sun'
  | 'moon'
  | 'copy'
  | 'trash'
  | 'flag'
  | 'duplicate'
  | 'document'
  | 'transcript'
  | 'edit'
  | 'options'
  | 'mic'
  | 'message'
  | 'bell'
  | 'emoji'
  | 'airplane'
  | 'wifi'
  | 'bluetooth'
  | 'battery'
  | 'home'
  | 'gear'
  | 'shield'
  | 'paint'
  | 'person'
  | 'undo'
  | 'redo'
  | 'bolt'
  | 'sparkles'
  | 'games'
  | 'apps'
  | 'arcade'
  | 'today'
  | 'rocket'
  | 'layers'
  | 'palette'
  | 'cube'
  | 'speaker'
  | 'loader'
  | 'delete'
  | 'shift'

const PATHS: Record<IconName, string> = {
  search:
    '<path d="M11 19a8 8 0 1 1 5.3-2L21 21" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  chevronLeft:
    '<path d="M14.5 5l-7 7 7 7" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  chevronRight:
    '<path d="M9.5 5l7 7-7 7" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  chevronUp:
    '<path d="M5 14.5l7-7 7 7" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  chevronDown:
    '<path d="M5 9.5l7 7 7-7" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  close:
    '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  check:
    '<path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  minus: '<path d="M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  more: '<circle cx="5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="19" cy="12" r="1.8" fill="currentColor"/>',
  share:
    '<path d="M12 3v13M12 3l-4 4M12 3l4 4" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  play: '<path d="M7 5l12 7-12 7V5z" fill="currentColor"/>',
  pause:
    '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>',
  skipBack:
    '<path d="M19 5L9 12l10 7V5zM6 5v14" stroke="currentColor" stroke-width="1.8" fill="currentColor" stroke-linejoin="round"/>',
  skipForward:
    '<path d="M5 5l10 7-10 7V5zM18 5v14" stroke="currentColor" stroke-width="1.8" fill="currentColor" stroke-linejoin="round"/>',
  volume:
    '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8a5 5 0 010 8" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  sun: '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 119.5 4a7 7 0 0010.5 10.5z" fill="currentColor"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  trash:
    '<path d="M5 7h14M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M7 7l1 12a2 2 0 002 2h4a2 2 0 002-2l1-12" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 3 2 3H5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  duplicate:
    '<rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.8" fill="none"/><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  document:
    '<path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM14 3v5h5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  transcript:
    '<rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  edit: '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  options:
    '<path d="M3 7h10M17 7h4M3 17h4M11 17h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="15" cy="7" r="1.8" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="9" cy="17" r="1.8" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  message:
    '<path d="M21 12c0 4.5-4 8-9 8a10 10 0 01-3-.5L4 21l1-4a8 8 0 01-1-4c0-4.5 4-8 9-8s8 3.5 8 7z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  bell: '<path d="M6 16v-5a6 6 0 0112 0v5l1.5 2h-15L6 16zM10 21h4" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round" stroke-linecap="round"/>',
  emoji:
    '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><path d="M8 14a5 5 0 008 0" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  airplane: '<path d="M12 2l3 10 7 3-7 2-3 7-3-7-7-2 7-3 3-10z" fill="currentColor"/>',
  wifi: '<path d="M2 9a16 16 0 0120 0M5.5 12.5a11 11 0 0113 0M9 16a6 6 0 016 0" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/>',
  bluetooth:
    '<path d="M7 5l10 7-5 5V3l5 5-10 7" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  battery:
    '<rect x="2" y="8" width="18" height="8" rx="2" stroke="currentColor" stroke-width="1.8" fill="none"/><rect x="21" y="10" width="2" height="4" rx="1" fill="currentColor"/>',
  home: '<path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-7h-6v7H5a1 1 0 01-1-1v-9z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  gear: '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  shield:
    '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  paint:
    '<path d="M5 7l7-3 7 3v3a2 2 0 01-2 2h-1v6a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6H7a2 2 0 01-2-2V7z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  person:
    '<circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  undo: '<path d="M9 8l-4 4 4 4M5 12h10a4 4 0 010 8h-2" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  redo: '<path d="M15 8l4 4-4 4M19 12H9a4 4 0 000 8h2" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  bolt: '<path d="M13 2L4 13h6l-1 9 9-11h-6l1-9z" stroke="currentColor" stroke-width="1.8" fill="currentColor" stroke-linejoin="round"/>',
  sparkles:
    '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zM19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="currentColor"/>',
  games:
    '<path d="M6 9h12a3 3 0 013 3v2a3 3 0 01-3 3h-1l-2-2H9l-2 2H6a3 3 0 01-3-3v-2a3 3 0 013-3z" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M8 12h2M9 11v2M15 12h.01M17 13h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  apps: '<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" fill="none"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  arcade:
    '<path d="M5 7c0-1 1-2 2-2h10a2 2 0 012 2v9a3 3 0 01-3 3H8a3 3 0 01-3-3V7zM9 11h6M12 8v6" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  today:
    '<rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="14" r="2.5" fill="currentColor"/>',
  rocket:
    '<path d="M12 2c4 3 6 7 6 11l-2 2-2-2c-1 1-2 2-4 2s-3-1-4-2l-2 2-2-2c0-4 2-8 6-11z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/><circle cx="12" cy="9" r="2" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  layers:
    '<path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  palette:
    '<path d="M12 3a9 9 0 100 18 3 3 0 003-3 2 2 0 012-2h2a4 4 0 004-4 9 9 0 00-9-9z" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="9" cy="7" r="1.2" fill="currentColor"/><circle cx="13" cy="6" r="1.2" fill="currentColor"/><circle cx="17" cy="9" r="1.2" fill="currentColor"/>',
  cube: '<path d="M12 3l9 5v8l-9 5-9-5V8l9-5zM3 8l9 5 9-5M12 13v10" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
  speaker:
    '<rect x="5" y="3" width="14" height="18" rx="3" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="12" cy="14" r="3.5" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="12" cy="7" r="1" fill="currentColor"/>',
  loader:
    '<path d="M12 2v4M12 18v4M4 12H2M22 12h-2M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  delete:
    '<rect x="3" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M21 12l-4-4M21 12l-4 4M21 12H8" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  shift:
    '<path d="M12 4l8 7h-4v8H8v-8H4l8-7z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>',
}

export function iconSvg(name: IconName | string, size: number = 16): string {
  const path = PATHS[name as IconName]
  if (!path) return ''
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">${path}</svg>`
}
