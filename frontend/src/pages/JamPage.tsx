// 방 메인 페이지

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getJam } from '../api/jam';
import { getAuth, setAuth } from '../utils/storage';
import { useSongs, useCreateSong, useUpdateSong, useDeleteSong } from '../hooks/useSongs';
import { useCreateVote, useDeleteVote } from '../hooks/useVotes';
import { updateUser } from '../api/user';
import { updateJamExpiry } from '../api/jam';
import { createFeedback } from '../api/feedback';
import { useYouTubeSearch } from '../hooks/useYouTube';
import { useSocket } from '../hooks/useSocket';
import { getVotes } from '../api/vote';
import { Loading } from '../components/common/Loading';
import { SongSearchBar } from '../components/song/SongSearchBar';
import { YouTubeSearchResultItem } from '../components/song/YouTubeSearchResult';
import { AddSongModal } from '../components/song/AddSongModal';
import { EditSongModal } from '../components/song/EditSongModal';
import { ImpossibleReasonModal } from '../components/song/ImpossibleReasonModal';
import { SongList } from '../components/song/SongList';
import { ProfileEditModal } from '../components/user/ProfileEditModal';
import { JamExpiryModal } from '../components/jam/JamExpiryModal';
import { FloatingFeedbackButton } from '../components/feedback/FloatingFeedbackButton';
import { FeedbackModal } from '../components/feedback/FeedbackModal';
import type { YouTubeSearchResult, Song, VoteResults } from '../types';

export default function JamPage() {
  const { jamId } = useParams<{ jamId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeSearchResult | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [impossibleVoteSongId, setImpossibleVoteSongId] = useState<string | null>(null);
  const [expandedSongIds, setExpandedSongIds] = useState<Set<string>>(new Set());
  const [voteResultsCache, setVoteResultsCache] = useState<Record<string, VoteResults>>({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingExpiry, setIsUpdatingExpiry] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  
  const auth = jamId ? getAuth(jamId) : null;
  
  // Socket.io 연결 및 실시간 동기화
  useSocket({
    jamId: jamId!,
    onSongCreated: () => {
      // 곡 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
    onSongUpdated: () => {
      // 곡 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
    onSongDeleted: ({ songId }) => {
      // 곡 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
      // 투표 결과 캐시에서 제거
      setVoteResultsCache(prev => {
        const newCache = { ...prev };
        delete newCache[songId];
        return newCache;
      });
    },
    onVoteCreated: ({ songId }) => {
      // 해당 곡의 투표 결과 갱신
      invalidateVoteCache(songId);
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
    onVoteChanged: ({ songId }) => {
      // 해당 곡의 투표 결과 갱신
      invalidateVoteCache(songId);
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
    onVoteDeleted: ({ songId }) => {
      // 해당 곡의 투표 결과 갱신
      invalidateVoteCache(songId);
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
    onCommentCreated: ({ songId }) => {
      // 해당 곡의 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['comments', songId] });
    },
    onCommentDeleted: ({ songId }) => {
      // 해당 곡의 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['comments', songId] });
    },
  });
  
  const invalidateVoteCache = (songId: string) => {
    setVoteResultsCache(prev => {
      const newCache = { ...prev };
      delete newCache[songId];
      return newCache;
    });
  };
  
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
  
  // 곡 목록 조회 (현재 사용자의 투표 상태 포함)
  const { data: songs = [], isLoading: songsLoading } = useSongs(jamId!, auth?.userName);
  
  // YouTube 검색
  const { data: searchResults } = useYouTubeSearch(searchQuery);
  
  // 곡 mutations
  const createSongMutation = useCreateSong(jamId!);
  const updateSongMutation = useUpdateSong(jamId!);
  const deleteSongMutation = useDeleteSong(jamId!);
  
  // 투표 mutations
  const createVoteMutation = useCreateVote(jamId!);
  const deleteVoteMutation = useDeleteVote(jamId!);
  
  // 펼쳐진 곡의 투표 결과 로드
  useEffect(() => {
    expandedSongIds.forEach(async (songId) => {
      if (!voteResultsCache[songId]) {
        try {
          const results = await getVotes(songId);
          setVoteResultsCache(prev => ({ ...prev, [songId]: results }));
        } catch (error) {
          console.error('Failed to load votes:', error);
        }
      }
    });
  }, [expandedSongIds, voteResultsCache]);
  
  const handleVideoSelect = (video: YouTubeSearchResult) => {
    setSelectedVideo(video);
    setIsAddModalOpen(true);
    setSearchQuery(''); // 검색 초기화
  };
  
  const handleAddSong = async (data: any) => {
    try {
      await createSongMutation.mutateAsync(data);
      setIsAddModalOpen(false);
      setSelectedVideo(null);
      alert('곡이 추가되었습니다!');
    } catch (error: any) {
      alert(error.response?.data?.error || '곡 추가에 실패했습니다');
    }
  };
  
  const handleEditSong = async (data: any) => {
    if (!editingSong || !auth) return;
    
    try {
      await updateSongMutation.mutateAsync({
        songId: editingSong.songId,
        data: {
          ...data,
          userName: auth.userName,
        },
      });
      setEditingSong(null);
      alert('곡이 수정되었습니다!');
      // 투표 결과 캐시 무효화
      setVoteResultsCache(prev => {
        const newCache = { ...prev };
        delete newCache[editingSong.songId];
        return newCache;
      });
    } catch (error: any) {
      alert(error.response?.data?.error || '곡 수정에 실패했습니다');
    }
  };
  
  const handleDeleteSong = async (songId: string) => {
    if (!auth) return;
    
    try {
      await deleteSongMutation.mutateAsync({
        songId,
        userName: auth.userName,
      });
      alert('곡이 삭제되었습니다!');
      // 투표 결과 캐시에서 제거
      setVoteResultsCache(prev => {
        const newCache = { ...prev };
        delete newCache[songId];
        return newCache;
      });
      setExpandedSongIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(songId);
        return newSet;
      });
    } catch (error: any) {
      alert(error.response?.data?.error || '곡 삭제에 실패했습니다');
    }
  };
  
  const handleVote = async (songId: string, type: 'like' | 'impossible') => {
    if (!auth) return;
    
    // 현재 투표 상태 확인
    const song = songs.find(s => s.songId === songId);
    const currentVote = song?.userVote;
    const currentVoteId = song?.userVoteId;
    
    // 같은 타입의 투표를 다시 클릭하면 취소
    if (currentVote === type && currentVoteId) {
      try {
        await deleteVoteMutation.mutateAsync(currentVoteId);
        // 투표 결과 캐시 무효화
        invalidateVoteCache(songId);
        return;
      } catch (error: any) {
        alert(error.response?.data?.error || '투표 취소에 실패했습니다');
        return;
      }
    }
    
    // 불가능 투표는 이유 입력 모달 표시 (새로 투표하거나 변경하는 경우)
    if (type === 'impossible') {
      setImpossibleVoteSongId(songId);
      return;
    }
    
    // 좋아요 투표 (새로 투표하거나 변경하는 경우)
    try {
      await createVoteMutation.mutateAsync({
        songId,
        userName: auth.userName,
        type,
      });
      // 투표 결과 캐시 무효화
      invalidateVoteCache(songId);
    } catch (error: any) {
      alert(error.response?.data?.error || '투표에 실패했습니다');
    }
  };
  
  const handleImpossibleVote = async (reason: string) => {
    if (!impossibleVoteSongId || !auth) return;
    
    try {
      await createVoteMutation.mutateAsync({
        songId: impossibleVoteSongId,
        userName: auth.userName,
        type: 'impossible',
        reason,
      });
      setImpossibleVoteSongId(null);
      // 투표 결과 캐시 무효화
      invalidateVoteCache(impossibleVoteSongId);
    } catch (error: any) {
      alert(error.response?.data?.error || '투표에 실패했습니다');
    }
  };
  
  const handleProfileUpdate = async (data: { newName?: string; sessions: string[] }) => {
    if (!auth || !jamId) return;
    
    setIsUpdatingProfile(true);
    try {
      await updateUser(jamId, auth.userName, data.newName, data.sessions);
      
      // localStorage 업데이트
      setAuth(jamId, {
        userName: data.newName || auth.userName,
        sessions: data.sessions,
      });
      
      setIsProfileModalOpen(false);
      alert('프로필이 수정되었습니다!');
      
      // 페이지 새로고침하여 변경사항 반영
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.error || '프로필 수정에 실패했습니다');
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const handleExpiryUpdate = async (expireDays: number) => {
    if (!jamId) return;
    
    setIsUpdatingExpiry(true);
    try {
      await updateJamExpiry(jamId, expireDays);
      setIsExpiryModalOpen(false);
      alert('유효기한이 연장되었습니다!');
      
      // 방 정보 새로고침
      queryClient.invalidateQueries({ queryKey: ['jam', jamId] });
    } catch (error: any) {
      alert(error.response?.data?.error || '유효기한 연장에 실패했습니다');
    } finally {
      setIsUpdatingExpiry(false);
    }
  };
  
  const handleFeedbackSubmit = async (data: {
    rating: number;
    content: string;
    contactInfo: string;
  }) => {
    setIsSubmittingFeedback(true);
    try {
      const response = await createFeedback({
        jamId,
        userName: auth?.userName,
        rating: data.rating,
        content: data.content,
        contactInfo: data.contactInfo,
      });
      
      setIsFeedbackModalOpen(false);
      alert(response.message || '피드백이 전송되었습니다. 감사합니다!');
    } catch (error: any) {
      alert(error.response?.data?.error || '피드백 전송에 실패했습니다');
    } finally {
      setIsSubmittingFeedback(false);
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
          
          {/* 만료 임박 알림 */}
          {jamInfo && jamInfo.daysRemaining <= 1 && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-red-400 text-lg">⚠️</span>
                  <p className="text-sm text-red-300">
                    <strong>주의!</strong> 방 유효기한이 {jamInfo.daysRemaining}일 남았습니다.
                  </p>
                </div>
                <button
                  onClick={() => setIsExpiryModalOpen(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 underline"
                >
                  연장하기
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
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
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                프로필 수정
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div>
                <span className="text-gray-500">유효기한:</span>{' '}
                <span className={jamInfo && jamInfo.daysRemaining <= 3 ? 'text-yellow-400' : 'text-white'}>
                  {jamInfo?.daysRemaining}일 남음
                </span>
              </div>
              <button
                onClick={() => setIsExpiryModalOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                연장
              </button>
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
            onEdit={setEditingSong}
            onDelete={handleDeleteSong}
            getUserVoteType={(songId) => {
              const song = songs.find(s => s.songId === songId);
              return song?.userVote || null;
            }}
            getVoteResults={(songId) => voteResultsCache[songId]}
            isLoadingVotes={(songId) => expandedSongIds.has(songId) && !voteResultsCache[songId]}
          />
        </div>
        
        {/* 곡 추가 모달 */}
        <AddSongModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedVideo(null);
          }}
          selectedVideo={selectedVideo}
          proposerName={auth.userName}
          jamId={jamId!}
          onSubmit={handleAddSong}
          isSubmitting={createSongMutation.isPending}
        />
        
        {/* 곡 수정 모달 */}
        {editingSong && (
          <EditSongModal
            isOpen={!!editingSong}
            onClose={() => setEditingSong(null)}
            song={editingSong}
            onSubmit={handleEditSong}
            isSubmitting={updateSongMutation.isPending}
          />
        )}
        
        {/* 불가능 투표 이유 모달 */}
        <ImpossibleReasonModal
          isOpen={!!impossibleVoteSongId}
          onClose={() => setImpossibleVoteSongId(null)}
          onSubmit={handleImpossibleVote}
          isSubmitting={createVoteMutation.isPending}
        />
        
        {/* 프로필 수정 모달 */}
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUserName={auth.userName}
          currentSessions={auth.sessions}
          jamId={jamId!}
          onSubmit={handleProfileUpdate}
          isSubmitting={isUpdatingProfile}
        />
        
        {/* 유효기한 연장 모달 */}
        {jamInfo && (
          <JamExpiryModal
            isOpen={isExpiryModalOpen}
            onClose={() => setIsExpiryModalOpen(false)}
            currentDaysRemaining={jamInfo.daysRemaining}
            onSubmit={handleExpiryUpdate}
            isSubmitting={isUpdatingExpiry}
          />
        )}
        
        {/* 피드백 모달 */}
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          jamId={jamId}
          userName={auth?.userName}
          onSubmit={handleFeedbackSubmit}
          isSubmitting={isSubmittingFeedback}
        />
        
        {/* 플로팅 피드백 버튼 */}
        <FloatingFeedbackButton onClick={() => setIsFeedbackModalOpen(true)} />
      </div>
    </div>
  );
}

