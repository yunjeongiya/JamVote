// JamPage 모든 모달 그룹화 컴포넌트

import { AddSongModal } from '../../components/song/AddSongModal';
import { EditSongModal } from '../../components/song/EditSongModal';
import { ImpossibleReasonModal } from '../../components/song/ImpossibleReasonModal';
import { ProfileEditModal } from '../../components/user/ProfileEditModal';
import { JamExpiryModal } from '../../components/jam/JamExpiryModal';
import { FeedbackModal } from '../../components/feedback/FeedbackModal';
import type { YouTubeSearchResult, Song } from '../../types';

interface JamModalsGroupProps {
  // Add Song Modal
  isAddModalOpen: boolean;
  selectedVideo: YouTubeSearchResult | null;
  proposerName: string;
  jamId: string;
  onAddSongSubmit: (data: any) => void;
  onAddSongClose: () => void;
  isAddingSong: boolean;

  // Edit Song Modal
  editingSong: Song | null;
  onEditSongSubmit: (data: any) => void;
  onEditSongClose: () => void;
  isEditingSong: boolean;

  // Impossible Reason Modal
  impossibleVoteSongId: string | null;
  onImpossibleSubmit: (reason: string) => void;
  onImpossibleClose: () => void;
  isVoting: boolean;

  // Profile Edit Modal
  isProfileModalOpen: boolean;
  currentUserName: string;
  currentSessions: string[];
  onProfileSubmit: (data: { newName?: string; sessions: string[] }) => void;
  onProfileClose: () => void;
  isUpdatingProfile: boolean;

  // Jam Expiry Modal
  isExpiryModalOpen: boolean;
  currentDaysRemaining: number;
  onExpirySubmit: (days: number) => void;
  onExpiryClose: () => void;
  isUpdatingExpiry: boolean;

  // Feedback Modal
  isFeedbackModalOpen: boolean;
  userName?: string;
  onFeedbackSubmit: (data: {
    rating: number;
    content: string;
    contactInfo: string;
  }) => void;
  onFeedbackClose: () => void;
  isSubmittingFeedback: boolean;
}

export function JamModalsGroup({
  // Add Song
  isAddModalOpen,
  selectedVideo,
  proposerName,
  jamId,
  onAddSongSubmit,
  onAddSongClose,
  isAddingSong,

  // Edit Song
  editingSong,
  onEditSongSubmit,
  onEditSongClose,
  isEditingSong,

  // Impossible
  impossibleVoteSongId,
  onImpossibleSubmit,
  onImpossibleClose,
  isVoting,

  // Profile
  isProfileModalOpen,
  currentUserName,
  currentSessions,
  onProfileSubmit,
  onProfileClose,
  isUpdatingProfile,

  // Expiry
  isExpiryModalOpen,
  currentDaysRemaining,
  onExpirySubmit,
  onExpiryClose,
  isUpdatingExpiry,

  // Feedback
  isFeedbackModalOpen,
  userName,
  onFeedbackSubmit,
  onFeedbackClose,
  isSubmittingFeedback,
}: JamModalsGroupProps) {
  return (
    <>
      {/* 곡 추가 모달 */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={onAddSongClose}
        selectedVideo={selectedVideo}
        proposerName={proposerName}
        jamId={jamId}
        onSubmit={onAddSongSubmit}
        isSubmitting={isAddingSong}
      />

      {/* 곡 수정 모달 */}
      {editingSong && (
        <EditSongModal
          isOpen={!!editingSong}
          onClose={onEditSongClose}
          song={editingSong}
          onSubmit={onEditSongSubmit}
          isSubmitting={isEditingSong}
        />
      )}

      {/* 어려워요 투표 이유 모달 */}
      <ImpossibleReasonModal
        isOpen={!!impossibleVoteSongId}
        onClose={onImpossibleClose}
        onSubmit={onImpossibleSubmit}
        isSubmitting={isVoting}
      />

      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={onProfileClose}
        currentUserName={currentUserName}
        currentSessions={currentSessions}
        jamId={jamId}
        onSubmit={onProfileSubmit}
        isSubmitting={isUpdatingProfile}
      />

      {/* 유효기한 연장 모달 */}
      <JamExpiryModal
        isOpen={isExpiryModalOpen}
        onClose={onExpiryClose}
        currentDaysRemaining={currentDaysRemaining}
        onSubmit={onExpirySubmit}
        isSubmitting={isUpdatingExpiry}
      />

      {/* 피드백 모달 */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={onFeedbackClose}
        jamId={jamId}
        userName={userName}
        onSubmit={onFeedbackSubmit}
        isSubmitting={isSubmittingFeedback}
      />
    </>
  );
}
