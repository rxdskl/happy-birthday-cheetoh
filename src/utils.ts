import { ComicConfig, DEFAULT_CONFIG } from './types';

/**
 * Extracts the 11-character YouTube Video ID from any standard, shortened, or embed URL.
 * If the input is already an 11-character alphanumeric code, returns it directly.
 */
export function extractYoutubeId(url: string): string {
  if (!url) return '';
  
  // If it's already a clean 11-character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    return url.trim();
  }

  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return match[2];
    }
  } catch (e) {
    console.error('Error parsing YouTube URL:', e);
  }
  
  return '';
}

/**
 * Encodes a ComicConfig object into a URL-safe Base64 string.
 */
export function encodeComicConfig(config: ComicConfig): string {
  try {
    const jsonStr = JSON.stringify(config);
    // Use encodeURIComponent to handle special Unicode characters cleanly, then encode to Base64
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    const binaryStr = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryStr);
  } catch (e) {
    console.error('Error encoding config:', e);
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 string back into a ComicConfig object.
 * Falls back to DEFAULT_CONFIG if decoding fails.
 */
export function decodeComicConfig(base64Str: string | null): ComicConfig {
  if (!base64Str) return DEFAULT_CONFIG;
  
  try {
    const binaryStr = atob(base64Str);
    const bytes = new Uint8Array(binaryStr.split('').map(char => char.charCodeAt(0)));
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);
    
    // Deep merge/fallback checks for safety against older/malformed configs
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      panel1: { ...DEFAULT_CONFIG.panel1, ...(parsed.panel1 || {}) },
      panel2: {
        ...DEFAULT_CONFIG.panel2,
        ...(parsed.panel2 || {}),
        stats: parsed.panel2?.stats || DEFAULT_CONFIG.panel2.stats
      },
      panel3: { ...DEFAULT_CONFIG.panel3, ...(parsed.panel3 || {}) },
      panel4: { ...DEFAULT_CONFIG.panel4, ...(parsed.panel4 || {}) }
    };
  } catch (e) {
    console.error('Error decoding config, loading defaults:', e);
    return DEFAULT_CONFIG;
  }
}

/**
 * Compresses an uploaded image file using an offscreen canvas to keep its base64 size small.
 */
export function compressImage(file: File, maxWidth = 350, maxHeight = 350, quality = 0.65): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale keeping aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Save as medium quality JPEG to save storage space
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

