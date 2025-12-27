/**
 * Converts Spotify URLs (track, album, playlist) to official embed URLs.
 * Only handles official Spotify URLs. Never scrapes or proxies.
 */

export type SpotifyResourceType = 'track' | 'album' | 'playlist';

export interface SpotifyEmbedInfo {
  embedUrl: string;
  resourceType: SpotifyResourceType;
  resourceId: string;
}

/**
 * Extracts Spotify resource ID and type from various URL formats:
 * - https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
 * - https://open.spotify.com/album/1ATL5GLyefJaxhQzSPVrLX
 * - https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
 * - spotify:track:4iV5W9uYEdYUVa79Axb7Rh
 */
export function parseSpotifyUrl(url: string): SpotifyEmbedInfo | null {
  if (!url || typeof url !== 'string') return null;

  // Trim whitespace
  url = url.trim();

  // Handle spotify: URI format
  const uriMatch = url.match(/^spotify:(track|album|playlist):([a-zA-Z0-9]+)$/);
  if (uriMatch) {
    const [, resourceType, resourceId] = uriMatch;
    return {
      embedUrl: `https://open.spotify.com/embed/${resourceType}/${resourceId}?utm_source=generator`,
      resourceType: resourceType as SpotifyResourceType,
      resourceId,
    };
  }

  // Handle open.spotify.com URLs
  const openMatch = url.match(/^https?:\/\/(?:open\.)?spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (openMatch) {
    const [, resourceType, resourceId] = openMatch;
    return {
      embedUrl: `https://open.spotify.com/embed/${resourceType}/${resourceId}?utm_source=generator`,
      resourceType: resourceType as SpotifyResourceType,
      resourceId,
    };
  }

  // Handle shortened spoti.fi URLs - these need to be resolved, but we can't do that client-side
  // For now, reject them and ask user to use full URL
  if (url.includes('spoti.fi') || url.includes('spotify.link')) {
    return null;
  }

  return null;
}

/**
 * Validates if a string looks like a Spotify URL
 */
export function isValidSpotifyUrl(url: string): boolean {
  return parseSpotifyUrl(url) !== null;
}

