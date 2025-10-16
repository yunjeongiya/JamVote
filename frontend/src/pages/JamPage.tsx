// 방 메인 페이지

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJam } from '../api/jam';
import { getAuth } from '../utils/storage';
import { useSongs, useCreateSong } from '../hooks/useSongs';
import { useCreateVote } from '../hooks/useVotes';
import { useYouTubeSearch } from '../hooks/useYouTube';
import { Loading } from '../components/common/Loading';
import { SongSearchBar } from '../components/song/SongSearchBar';
import { YouTubeSearchResultItem } from '../components/song/YouTubeSearchResult';
import { AddSongModal } from '../components/song/AddSongModal';
import { SongList } from '../components/song/SongList';
import type { YouTubeSearchResult } from '../types';

export default function JamPage() {
  const { jamId } = useParams<{ jamId: string }>();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeSearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const auth = jamId ? getAuth(jamId) : null;
  
  // 인증 확인
  useEffect(() => {
    if (jamId && !auth) {
      navigate(`/${jamId}/login`);
    }
  }, [jamId, auth, navigate]);
  
  // 방 정보 조회
  const { data: jamInfo, isLoading: jamLoading } = useQuery({
    queryKey: ['jam', jamId],
    queryFn: () => getJam(jamId!),
    enabled: !!jamId,
  });
  
  // 곡 목록 조회
  const { data: songs = [], isLoading: songsLoading } = useSongs(jamId!);
  
  // YouTube 검색
  const { data: searchResults } = useYouTubeSearch(searchQuery);
  
  // 곡 추가 mutation
  const createSongMutation = useCreateSong(jamId!);
  
  // 투표 mutation
  const createVoteMutation = useCreateVote(jamId!);
  
  const handleVideoSelect = (video: YouTubeSearchResult) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    setSearchQuery(''); // 검색 초기화
  };
  
  const handleAddSong = async (data: any) => {
    try {
      await createSongMutation.mutateAsync(data);
      setIsModalOpen(false);
      setSelectedVideo(null);
      alert('곡이 추가되었습니다!');
    } catch (error: any) {
      alert(error.response?.data?.error || '곡 추가에 실패했습니다');
    }
  };
  
  const handleVote = async (songId: string, type: 'like' | 'impossible') => {
    if (!auth) return;
    
    // TODO: 현재 투표 상태 확인해서 같은 타입이면 취소, 다르면 변경
    try {
      await createVoteMutation.mutateAsync({
        songId,
        userName: auth.userName,
        type,
      });
    } catch (error: any) {
      alert(error.response?.data?.error || '투표에 실패했습니다');
    }
  };
  
  if (jamLoading || !auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="방 정보를 불러오는 중..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h1 className="text-2xl font-bold text-blue-500 mb-2">
            {jamInfo?.name}
          </h1>
          {jamInfo?.description && (
            <p className="text-gray-400 mb-4">{jamInfo.description}</p>
          )}
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-500">로그인:</span>{' '}
              <span className="text-white">{auth.userName}</span>
              {auth.sessions.length > 0 && (
                <>
                  {' '}
                  <span className="text-gray-500">
                    ({auth.sessions.join(', ')})
                  </span>
                </>
              )}
            </div>
            <div>
              <span className="text-gray-500">유효기한:</span>{' '}
              <span className={jamInfo && jamInfo.daysRemaining <= 1 ? 'text-red-400' : 'text-white'}>
                {jamInfo?.daysRemaining}일 남음
              </span>
            </div>
          </div>
        </div>
        
        {/* 검색 바 */}
        <SongSearchBar
          onSearch={setSearchQuery}
          placeholder="YouTube에서 곡 검색..."
        />
        
        {/* YouTube 검색 결과 */}
        {searchQuery && searchResults && searchResults.length > 0 && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">검색 결과</h3>
            <div className="space-y-2">
              {searchResults.map((result) => (
                <YouTubeSearchResultItem
                  key={result.videoId}
                  result={result}
                  onClick={() => handleVideoSelect(result)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* 곡 리스트 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            제안된 곡 ({songs.length})
          </h2>
          <SongList
            songs={songs}
            isLoading={songsLoading}
            currentUserName={auth.userName}
            onVote={handleVote}
          />
        </div>
        
        {/* 곡 추가 모달 */}
        <AddSongModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVideo(null);
          }}
          selectedVideo={selectedVideo}
          proposerName={auth.userName}
          jamId={jamId!}
          onSubmit={handleAddSong}
          isSubmitting={createSongMutation.isPending}
        />
      </div>
    </div>
  );
}

