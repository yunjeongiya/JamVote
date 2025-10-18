// JamPage 상태 관리 훅

import { useState } from 'react';
import type { YouTubeSearchResult, Song, VoteResults } from '../../types';

export function useJamState() {
  // 검색 관련
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeSearchResult | null>(null);

  // 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [impossibleVoteSongId, setImpossibleVoteSongId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // 로딩 상태
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingExpiry, setIsUpdatingExpiry] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // 곡 관련 상태
  const [expandedSongIds, setExpandedSongIds] = useState<Set<string>>(new Set());
  const [voteResultsCache, setVoteResultsCache] = useState<Record<string, VoteResults>>({});

  return {
    // 검색
    searchQuery,
    setSearchQuery,
    selectedVideo,
    setSelectedVideo,

    // 모달
    isAddModalOpen,
    setIsAddModalOpen,
    editingSong,
    setEditingSong,
    impossibleVoteSongId,
    setImpossibleVoteSongId,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isExpiryModalOpen,
    setIsExpiryModalOpen,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,

    // 로딩
    isUpdatingProfile,
    setIsUpdatingProfile,
    isUpdatingExpiry,
    setIsUpdatingExpiry,
    isSubmittingFeedback,
    setIsSubmittingFeedback,

    // 곡
    expandedSongIds,
    setExpandedSongIds,
    voteResultsCache,
    setVoteResultsCache,
  };
}
