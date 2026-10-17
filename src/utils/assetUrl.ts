/**
 * Asset URL Resolver for RAIS Agencies Web Platform
 * 
 * Ensures all static image and media assets resolve correctly across:
 * - GitHub Pages subpath (/RAIS-AGENCIES/)
 * - Custom domain root (/)
 * - Local Vite Dev & Preview environments
 */
export function assetUrl(path: string | undefined | null): string {
  if (!path) return '';
  
  // If it is already an external URL, data URI, or blob, return untouched
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('//')
  ) {
    return path;
  }

  // Base provided by Vite (e.g. '/RAIS-AGENCIES/' or '/')
  const base = import.meta.env.BASE_URL || '/';
  
  // Ensure trailing slash on base
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  
  // Strip leading slash from asset path to prevent domain-root browser override
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${normalizedBase}${cleanPath}`;
}
