// YouTube 컨트롤러

const axios = require('axios');

/**
 * YouTube 검색
 * GET /api/youtube/search?q=검색어
 */
async function searchYouTube(req, res, next) {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: '검색어가 필요합니다' });
    }
    
    const API_KEY = process.env.YOUTUBE_API_KEY;
    
    // API 키가 없으면 임시 데이터 반환
    if (!API_KEY || API_KEY === '임시로비워두기') {
      return res.json({
        results: [
          {
            videoId: 'dQw4w9WgXcQ',
            title: `[테스트] ${q} - 검색 결과 1`,
            channelTitle: '테스트 채널',
            thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
            duration: '3:45',
          },
          {
            videoId: 'jNQXAC9IVRw',
            title: `[테스트] ${q} - 검색 결과 2`,
            channelTitle: '테스트 채널 2',
            thumbnailUrl: 'https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg',
            duration: '4:20',
          },
        ],
      });
    }
    
    // YouTube Data API v3 검색
    const searchUrl = 'https://www.googleapis.com/youtube/v3/search';
    const searchResponse = await axios.get(searchUrl, {
      params: {
        part: 'snippet',
        q: q,
        type: 'video',
        maxResults: 10,
        key: API_KEY,
        videoCategoryId: '10', // 음악 카테고리
      },
    });
    
    const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');
    
    // 비디오 상세 정보 가져오기 (재생시간 포함)
    const videosUrl = 'https://www.googleapis.com/youtube/v3/videos';
    const videosResponse = await axios.get(videosUrl, {
      params: {
        part: 'contentDetails',
        id: videoIds,
        key: API_KEY,
      },
    });
    
    // 결과 조합
    const results = searchResponse.data.items.map((item, index) => {
      const videoDetails = videosResponse.data.items[index];
      const duration = videoDetails ? parseISO8601Duration(videoDetails.contentDetails.duration) : '0:00';
      
      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        duration,
      };
    });
    
    res.json({ results });
  } catch (error) {
    // YouTube API 에러 처리
    if (error.response) {
      console.error('YouTube API Error:', error.response.data);
      return res.status(error.response.status).json({
        error: 'YouTube API 호출에 실패했습니다',
        details: error.response.data.error?.message,
      });
    }
    next(error);
  }
}

/**
 * ISO 8601 duration을 "M:SS" 형식으로 변환
 * 예: "PT3M45S" → "3:45"
 */
function parseISO8601Duration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

module.exports = {
  searchYouTube,
};

