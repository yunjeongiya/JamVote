// 곡 추가 모달 컴포넌트

import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import { DifficultySlider } from './DifficultySlider';
import { YouTubePlayer } from './YouTubePlayer';
import { SESSION_OPTIONS } from '../../constants/sessions';
import type { YouTubeSearchResult } from '../../types';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: YouTubeSearchResult | null;
  proposerName: string;
  jamId: string;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function AddSongModal({
  isOpen,
  onClose,
  selectedVideo,
  proposerName,
  jamId,
  onSubmit,
  isSubmitting,
}: AddSongModalProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [requiredSessions, setRequiredSessions] = useState<string[]>([]);
  const [sessionDifficulties, setSessionDifficulties] = useState<Record<string, number>>({});
  const [allowEditByOthers, setAllowEditByOthers] = useState(true);
  
  // 선택된 비디오가 변경되면 초기값 설정
  useEffect(() => {
    if (selectedVideo) {
      setTitle(selectedVideo.title);
      setArtist(selectedVideo.channelTitle);
    }
  }, [selectedVideo]);
  
  const handleSessionToggle = (session: string) => {
    if (requiredSessions.includes(session)) {
      setRequiredSessions(requiredSessions.filter(s => s !== session));
      const newDifficulties = { ...sessionDifficulties };
      delete newDifficulties[session];
      setSessionDifficulties(newDifficulties);
    } else {
      setRequiredSessions([...requiredSessions, session]);
      setSessionDifficulties({ ...sessionDifficulties, [session]: 3 });
    }
  };
  
  const handleDifficultyChange = (session: string, value: number) => {
    setSessionDifficulties({ ...sessionDifficulties, [session]: value });
  };
  
  const handleSubmit = () => {
    if (!selectedVideo) return;
    
    onSubmit({
      jamId,
      proposerName,
      youtubeUrl: `https://www.youtube.com/watch?v=${selectedVideo.videoId}`,
      title: title.trim(),
      artist: artist.trim(),
      duration: selectedVideo.duration || '0:00',
      thumbnailUrl: selectedVideo.thumbnailUrl,
      genre: genre.trim(),
      requiredSessions,
      sessionDifficulties,
      allowEditByOthers,
    });
  };
  
  if (!selectedVideo) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="곡 추가" size="lg">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* YouTube 플레이어 */}
        <YouTubePlayer videoId={selectedVideo.videoId} />
        
        {/* 곡 정보 */}
        <Input
          label="곡 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <Input
          label="아티스트"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />
        
        <Input
          label="장르 (선택)"
          placeholder="예: 록, 발라드, 재즈"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        
        {/* 필요 세션 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            필요 세션 (선택)
          </label>
          <div className="space-y-2">
            {SESSION_OPTIONS.map((session) => (
              <Checkbox
                key={session}
                label={session}
                checked={requiredSessions.includes(session)}
                onChange={() => handleSessionToggle(session)}
              />
            ))}
          </div>
        </div>
        
        {/* 세션별 난이도 */}
        {requiredSessions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              세션별 난이도
            </label>
            <div className="space-y-3">
              {requiredSessions.map((session) => (
                <DifficultySlider
                  key={session}
                  session={session}
                  value={sessionDifficulties[session] || 3}
                  onChange={(value) => handleDifficultyChange(session, value)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* 수정 권한 */}
        <Checkbox
          label="다른 사람도 수정 가능"
          checked={allowEditByOthers}
          onChange={(e) => setAllowEditByOthers(e.target.checked)}
        />
        
        {/* 제출 버튼 */}
        <div className="flex space-x-2 pt-4">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={!title.trim() || !artist.trim() || isSubmitting}
          >
            {isSubmitting ? '추가 중...' : '곡 추가하기'}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
}

