// YouTube API

import client from './client';
import type { YouTubeSearchResult } from '../types';

/**
 * YouTube 검색
 */
export async function searchYouTube(query: string): Promise<YouTubeSearchResult[]> {
  const response = await client.get('/api/youtube/search', {
    params: { q: query },
  });
  return response.data.results;
}

