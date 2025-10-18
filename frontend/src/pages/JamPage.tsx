// 방 메인 페이지 (리팩토링 버전)

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getJam } from '../api/jam';
import { getAuth, setAuth, clearAuth } from '../utils/storage';
import { useSongs, useCreateSong, useUpdateSong, useDeleteSong } from '../hooks/useSongs';
import { useCreateVote, useDeleteVote } from '../hooks/useVotes';
import { updateUser } from '../api/user';
import { updateJamExpiry } from '../api/jam';
import { createFeedback } from '../api/feedback';
import { useYouTubeSearch } from '../hooks/useYouTube';
import { useSocket } from '../hooks/useSocket';
import { getVotes } from '../api/vote';
import { createComment } from '../api/comment';
import { useToast } from '../hooks/useToast';
import { Loading } from '../components/common/Loading';
import { ToastContainer } from '../components/common/Toast';
import { SongSearchBar } from '../components/song/SongSearchBar';
import { YouTubeSearchResultItem } from '../components/song/YouTubeSearchResult';
import { SongList } from '../components/song/SongList';
import { FloatingFeedbackButton } from '../components/feedback/FloatingFeedbackButton';
import { useJamState } from './JamPage/useJamState';
import { useVoteCache } from './JamPage/useVoteCache';
import { JamHeader } from './JamPage/JamHeader';
import { JamModalsGroup } from './JamPage/JamModalsGroup';

export default function JamPage() {
  const { jamId } = useParams<{ jamId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toasts, removeToast, success, error } = useToast();

  // 모든 상태를 useJamState로 통합
  const state = useJamState();

  const auth = jamId ? getAuth(jamId) : null;

  // 투표 캐시 관리
  const { invalidateVoteCache, removeFromVoteCache } = useVoteCache({
    voteResultsCache: state.voteResultsCache,
    setVoteResultsCache: state.setVoteResultsCache,
    expandedSongIds: state.expandedSongIds,
  });

  // Socket.io 연결 및 실시간 동기화
  useSocket({
    jamId: jamId!,
    onSongCreated: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
    onSongUpdated: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
    onSongDeleted: ({ songId }) => {
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
      removeFromVoteCache(songId);
    },
    onVoteCreated: ({ songId }) => {
      invalidateVoteCache(songId);
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
    onVoteChanged: ({ songId }) => {
      invalidateVoteCache(songId);
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
    onVoteDeleted: ({ songId }) => {
      invalidateVoteCache(songId);
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
    onCommentCreated: ({ songId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', songId] });
    },
    onCommentDeleted: ({ songId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', songId] });
    },
  });

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
  const { data: songs = [], isLoading: songsLoading } = useSongs(jamId!, auth?.userName);

  // YouTube 검색
  const { data: searchResults } = useYouTubeSearch(state.searchQuery);

  // Mutations
  const createSongMutation = useCreateSong(jamId!);
  const updateSongMutation = useUpdateSong(jamId!);
  const deleteSongMutation = useDeleteSong(jamId!);
  const createVoteMutation = useCreateVote(jamId!);
  const deleteVoteMutation = useDeleteVote(jamId!);

  // 펼쳐진 곡의 투표 결과 로드
  useEffect(() => {
    const fetchVotesForExpanded = async () => {
      const promises = Array.from(state.expandedSongIds).map(async (songId) => {
        if (!state.voteResultsCache[songId]) {
          try {
            const results = await getVotes(songId);
            state.setVoteResultsCache((prev) => ({ ...prev, [songId]: results }));
          } catch (error) {
            console.error(`Failed to load votes for song ${songId}:`, error);
          }
        }
      });
      await Promise.all(promises);
    };

    fetchVotesForExpanded();
  }, [state.expandedSongIds]);

  // === 핸들러 함수들 ===

  const handleVideoSelect = (video: any) => {
    state.setSelectedVideo(video);
    state.setIsAddModalOpen(true);
    state.setSearchQuery('');
  };

  const handleAddSong = async (data: any) => {
    try {
      await createSongMutation.mutateAsync(data);
      state.setIsAddModalOpen(false);
      state.setSelectedVideo(null);
      success('곡이 추가되었습니다!');
    } catch (err: any) {
      error(err.response?.data?.error || '곡 추가에 실패했습니다');
    }
  };

  const handleEditSong = async (data: any) => {
    if (!state.editingSong || !auth) return;

    try {
      await updateSongMutation.mutateAsync({
        songId: state.editingSong.songId,
        data: { ...data, userName: auth.userName },
      });
      state.setEditingSong(null);
      success('곡이 수정되었습니다!');
      removeFromVoteCache(state.editingSong.songId);
    } catch (err: any) {
      error(err.response?.data?.error || '곡 수정에 실패했습니다');
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!auth) return;

    try {
      await deleteSongMutation.mutateAsync({ songId, userName: auth.userName });
      success('곡이 삭제되었습니다!');
      removeFromVoteCache(songId);
      state.setExpandedSongIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(songId);
        return newSet;
      });
    } catch (err: any) {
      error(err.response?.data?.error || '곡 삭제에 실패했습니다');
    }
  };

  const handleToggleExpand = (songId: string) => {
    state.setExpandedSongIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  const handleVote = async (songId: string, type: 'like' | 'impossible') => {
    if (!auth) return;

    const song = songs.find((s) => s.songId === songId);
    const currentVote = song?.userVote;
    const currentVoteId = song?.userVoteId;

    // 같은 타입 재클릭 시 취소
    if (currentVote === type && currentVoteId) {
      try {
        await deleteVoteMutation.mutateAsync(currentVoteId);
        invalidateVoteCache(songId);
        return;
      } catch (err: any) {
        error(err.response?.data?.error || '투표 취소에 실패했습니다');
        return;
      }
    }

    // 어려워요는 이유 입력 모달
    if (type === 'impossible') {
      state.setImpossibleVoteSongId(songId);
      return;
    }

    // 좋아요 투표
    try {
      await createVoteMutation.mutateAsync({
        songId,
        userName: auth.userName,
        type,
      });
      invalidateVoteCache(songId);
    } catch (err: any) {
      error(err.response?.data?.error || '투표에 실패했습니다');
    }
  };

  const handleImpossibleVote = async (reason: string) => {
    if (!state.impossibleVoteSongId || !auth) return;

    try {
      await createVoteMutation.mutateAsync({
        songId: state.impossibleVoteSongId,
        userName: auth.userName,
        type: 'impossible',
      });

      if (reason.trim()) {
        await createComment({
          songId: state.impossibleVoteSongId,
          userName: auth.userName,
          content: `어려운 이유: ${reason.trim()}`,
        });
      }

      state.setImpossibleVoteSongId(null);
      success('투표가 완료되었습니다!');
      invalidateVoteCache(state.impossibleVoteSongId);
    } catch (err: any) {
      error(err.response?.data?.error || '투표에 실패했습니다');
    }
  };

  const handleProfileUpdate = async (data: { newName?: string; sessions: string[] }) => {
    if (!auth || !jamId) return;

    state.setIsUpdatingProfile(true);
    try {
      await updateUser(jamId, auth.userName, {
        newName: data.newName,
        sessions: data.sessions,
      });
      setAuth(jamId, data.newName || auth.userName, data.sessions);
      state.setIsProfileModalOpen(false);
      success('프로필이 수정되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
      queryClient.invalidateQueries({ queryKey: ['jam', jamId] });
    } catch (err: any) {
      error(err.response?.data?.error || '프로필 수정에 실패했습니다');
    } finally {
      state.setIsUpdatingProfile(false);
    }
  };

  const handleLogout = () => {
    if (!jamId) return;
    clearAuth(jamId);
    navigate(`/${jamId}/login`);
  };

  const handleExpiryUpdate = async (expireDays: number) => {
    if (!jamId) return;

    state.setIsUpdatingExpiry(true);
    try {
      await updateJamExpiry(jamId, expireDays);
      state.setIsExpiryModalOpen(false);
      success('유효기한이 연장되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['jam', jamId] });
    } catch (err: any) {
      error(err.response?.data?.error || '유효기한 연장에 실패했습니다');
    } finally {
      state.setIsUpdatingExpiry(false);
    }
  };

  const handleFeedbackSubmit = async (data: {
    rating: number;
    content: string;
    contactInfo: string;
  }) => {
    state.setIsSubmittingFeedback(true);
    try {
      const response = await createFeedback({
        jamId,
        userName: auth?.userName,
        rating: data.rating,
        content: data.content,
        contactInfo: data.contactInfo,
      });
      state.setIsFeedbackModalOpen(false);
      success(response.message || '피드백이 전송되었습니다. 감사합니다!');
    } catch (err: any) {
      error(err.response?.data?.error || '피드백 전송에 실패했습니다');
    } finally {
      state.setIsSubmittingFeedback(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    success('링크가 복사되었습니다!');
  };

  // === 렌더링 ===

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
        {jamInfo && (
          <JamHeader
            jamId={jamId!}
            jamName={jamInfo.name}
            jamDescription={jamInfo.description}
            daysRemaining={jamInfo.daysRemaining}
            userName={auth.userName}
            userSessions={auth.sessions}
            onExpiryClick={() => state.setIsExpiryModalOpen(true)}
            onProfileClick={() => state.setIsProfileModalOpen(true)}
            onLogout={handleLogout}
            onCopyLink={handleCopyLink}
          />
        )}

        {/* 검색 바 */}
        <SongSearchBar
          onSearch={state.setSearchQuery}
          placeholder="곡 제목, 아티스트 또는 YouTube 검색..."
        />

        {/* 검색 모드 */}
        {state.searchQuery ? (
          <div className="space-y-4">
            {/* 기존 곡에서 검색 */}
            {(() => {
              const filteredSongs = songs.filter(
                (song) =>
                  song.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                  song.artist.toLowerCase().includes(state.searchQuery.toLowerCase())
              );

              return filteredSongs.length > 0 ? (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    제안된 곡에서 검색 ({filteredSongs.length})
                  </h2>
                  <SongList
                    songs={filteredSongs}
                    isLoading={false}
                    currentUserName={auth.userName}
                    onVote={handleVote}
                    onEdit={state.setEditingSong}
                    onDelete={handleDeleteSong}
                    getUserVoteType={(songId) => {
                      const song = songs.find((s) => s.songId === songId);
                      return song?.userVote || null;
                    }}
                    getVoteResults={(songId) => state.voteResultsCache[songId]}
                    isLoadingVotes={(songId) =>
                      state.expandedSongIds.has(songId) && !state.voteResultsCache[songId]
                    }
                    onToggleExpand={handleToggleExpand}
                    expandedSongIds={state.expandedSongIds}
                  />
                </div>
              ) : null;
            })()}

            {/* YouTube 검색 결과 */}
            {searchResults && searchResults.length > 0 && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">
                  YouTube 검색 결과
                </h3>
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
          </div>
        ) : (
          /* 전체 곡 리스트 */
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              제안된 곡 ({songs.length})
            </h2>
            <SongList
              songs={songs}
              isLoading={songsLoading}
              currentUserName={auth.userName}
              onVote={handleVote}
              onEdit={state.setEditingSong}
              onDelete={handleDeleteSong}
              getUserVoteType={(songId) => {
                const song = songs.find((s) => s.songId === songId);
                return song?.userVote || null;
              }}
              getVoteResults={(songId) => state.voteResultsCache[songId]}
              isLoadingVotes={(songId) =>
                state.expandedSongIds.has(songId) && !state.voteResultsCache[songId]
              }
              onToggleExpand={handleToggleExpand}
              expandedSongIds={state.expandedSongIds}
            />
          </div>
        )}

        {/* 모든 모달 */}
        <JamModalsGroup
          // Add Song Modal
          isAddModalOpen={state.isAddModalOpen}
          selectedVideo={state.selectedVideo}
          proposerName={auth.userName}
          jamId={jamId!}
          onAddSongSubmit={handleAddSong}
          onAddSongClose={() => {
            state.setIsAddModalOpen(false);
            state.setSelectedVideo(null);
          }}
          isAddingSong={createSongMutation.isPending}
          // Edit Song Modal
          editingSong={state.editingSong}
          onEditSongSubmit={handleEditSong}
          onEditSongClose={() => state.setEditingSong(null)}
          isEditingSong={updateSongMutation.isPending}
          // Impossible Modal
          impossibleVoteSongId={state.impossibleVoteSongId}
          onImpossibleSubmit={handleImpossibleVote}
          onImpossibleClose={() => state.setImpossibleVoteSongId(null)}
          isVoting={createVoteMutation.isPending}
          // Profile Modal
          isProfileModalOpen={state.isProfileModalOpen}
          currentUserName={auth.userName}
          currentSessions={auth.sessions}
          onProfileSubmit={handleProfileUpdate}
          onProfileClose={() => state.setIsProfileModalOpen(false)}
          isUpdatingProfile={state.isUpdatingProfile}
          // Expiry Modal
          isExpiryModalOpen={state.isExpiryModalOpen}
          currentDaysRemaining={jamInfo?.daysRemaining || 0}
          onExpirySubmit={handleExpiryUpdate}
          onExpiryClose={() => state.setIsExpiryModalOpen(false)}
          isUpdatingExpiry={state.isUpdatingExpiry}
          // Feedback Modal
          isFeedbackModalOpen={state.isFeedbackModalOpen}
          userName={auth?.userName}
          onFeedbackSubmit={handleFeedbackSubmit}
          onFeedbackClose={() => state.setIsFeedbackModalOpen(false)}
          isSubmittingFeedback={state.isSubmittingFeedback}
        />

        {/* 플로팅 피드백 버튼 */}
        <FloatingFeedbackButton onClick={() => state.setIsFeedbackModalOpen(true)} />
      </div>

      {/* Toast 알림 */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
