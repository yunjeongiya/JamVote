// 곡 리스트 컴포넌트

import type { Song, VoteResults } from '../../types';
import { SongCard } from './SongCard';
import { Loading } from '../common/Loading';

interface SongListProps {
  songs: Song[];
  isLoading: boolean;
  currentUserName: string;
  onVote: (songId: string, type: 'like' | 'impossible') => void;
  onEdit?: (song: Song) => void;
  onDelete?: (songId: string) => void;
  getUserVoteType?: (songId: string) => 'like' | 'impossible' | null;
  getVoteResults?: (songId: string) => VoteResults | undefined;
  isLoadingVotes?: (songId: string) => boolean;
  onToggleExpand?: (songId: string) => void;
  expandedSongIds?: Set<string>;
}

export function SongList({
  songs,
  isLoading,
  currentUserName,
  onVote,
  onEdit,
  onDelete,
  getUserVoteType,
  getVoteResults,
  isLoadingVotes,
  onToggleExpand,
  expandedSongIds,
}: SongListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading text="곡 목록을 불러오는 중..." />
      </div>
    );
  }
  
  if (songs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-2">아직 제안된 곡이 없습니다</p>
        <p className="text-sm text-gray-500">첫 번째 곡을 제안해보세요!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {songs.map((song) => (
        <SongCard
          key={song.songId}
          song={song}
          currentUserName={currentUserName}
          onVote={onVote}
          onEdit={onEdit}
          onDelete={onDelete}
          userVoteType={getUserVoteType ? getUserVoteType(song.songId) : null}
          voteResults={getVoteResults ? getVoteResults(song.songId) : undefined}
          isLoadingVotes={isLoadingVotes ? isLoadingVotes(song.songId) : false}
          isExpanded={expandedSongIds ? expandedSongIds.has(song.songId) : false}
          onToggleExpand={onToggleExpand ? () => onToggleExpand(song.songId) : undefined}
        />
      ))}
    </div>
  );
}

