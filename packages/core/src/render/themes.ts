/**
 * Sidebar color themes for CV templates
 */

export interface SidebarTheme {
  id: string;
  name: string;
  hex: string;
  dark: boolean; // true = white text, false = dark text
}

export const SIDEBAR_THEMES: SidebarTheme[] = [
  // 浅色系 (dark text)
  { id: 'mist-blue', name: '雾蓝', hex: '#E6EDF8', dark: false },
  { id: 'lilac-gray', name: '丁香灰', hex: '#EAE8F2', dark: false },
  { id: 'jade-green', name: '浅绿玉', hex: '#E2EFE9', dark: false },
  { id: 'pearl-rice', name: '珍珠米', hex: '#F2EDE7', dark: false },
  { id: 'soft-green', name: '柔和绿', hex: '#EFF1F0', dark: false },
  { id: 'soft-red', name: '柔和红', hex: '#F6F1F0', dark: false },
  
  // 蓝色系 (white text)
  { id: 'morandi-blue', name: '莫兰迪蓝', hex: '#406495', dark: true },
  { id: 'rainbow-blue', name: '虹蓝', hex: '#2661A7', dark: true },
  
  // 深色系 (white text)
  { id: 'basic-black', name: '基础黑', hex: '#252525', dark: true },
  { id: 'ink-blue', name: '墨蓝', hex: '#232935', dark: true },
  { id: 'dark-brown', name: '暗褐', hex: '#2B2222', dark: true },
  
  // 暖色系 (white text)
  { id: 'jujube-red', name: '枣红', hex: '#B24946', dark: true },
  { id: 'morandi-red', name: '莫兰迪红', hex: '#895A57', dark: true },
  
  // 绿色系 (white text)
  { id: 'emerald', name: '翠绿', hex: '#2B856F', dark: true },
  { id: 'morandi-green', name: '莫兰迪绿', hex: '#498072', dark: true },
];

export const DEFAULT_THEME = 'mist-blue';

export function getTheme(idOrHex: string): SidebarTheme | null {
  // First try to find by ID
  const byId = SIDEBAR_THEMES.find(t => t.id === idOrHex);
  if (byId) return byId;
  
  // Then try by hex (with or without #)
  const hex = idOrHex.startsWith('#') ? idOrHex : `#${idOrHex}`;
  const byHex = SIDEBAR_THEMES.find(t => t.hex.toLowerCase() === hex.toLowerCase());
  if (byHex) return byHex;
  
  // If it looks like a hex color, create a custom theme
  if (/^#?[0-9A-Fa-f]{6}$/.test(idOrHex)) {
    const normalizedHex = idOrHex.startsWith('#') ? idOrHex : `#${idOrHex}`;
    // Guess if dark based on luminance
    const r = parseInt(normalizedHex.slice(1, 3), 16);
    const g = parseInt(normalizedHex.slice(3, 5), 16);
    const b = parseInt(normalizedHex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return {
      id: 'custom',
      name: 'Custom',
      hex: normalizedHex.toUpperCase(),
      dark: luminance < 0.5,
    };
  }
  
  return null;
}

export function getThemeCSS(theme: SidebarTheme): string {
  if (theme.dark) {
    return `
      --sb-bg: ${theme.hex};
      --sb-text: rgba(255,255,255,0.9);
      --sb-text-bright: #ffffff;
      --sb-text-dim: rgba(255,255,255,0.65);
      --sb-border: rgba(255,255,255,0.18);
      --sb-bullet: rgba(255,255,255,0.5);
    `;
  } else {
    return `
      --sb-bg: ${theme.hex};
      --sb-text: rgba(20,35,75,0.82);
      --sb-text-bright: rgba(10,22,60,0.92);
      --sb-text-dim: rgba(20,35,75,0.55);
      --sb-border: rgba(20,35,75,0.14);
      --sb-bullet: rgba(20,35,75,0.38);
    `;
  }
}

export function listThemes(): string[] {
  return SIDEBAR_THEMES.map(t => t.id);
}
