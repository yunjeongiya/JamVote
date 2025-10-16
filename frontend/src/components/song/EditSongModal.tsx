// 곡 수정 모달 컴포넌트

import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import { DifficultySlider } from './DifficultySlider';
import { SESSION_OPTIONS } from '../../constants/sessions';
import type { Song } from '../../types';

interface EditSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function EditSongModal({
  isOpen,
  onClose,
  song,
  onSubmit,
  isSubmitting,
}: EditSongModalProps) {
  const [title, setTitle] = useState(song.title);
  const [artist, setArtist] = useState(song.artist);
  const [genre, setGenre] = useState(song.genre || '');
  const [requiredSessions, setRequiredSessions] = useState<string[]>(song.requiredSessions);
  const [sessionDifficulties, setSessionDifficulties] = useState<Record<string, number>>(
    song.sessionDifficulties
  );
  
  // song이 변경되면 상태 초기화
  useEffect(() => {
    setTitle(song.title);
    setArtist(song.artist);
    setGenre(song.genre || '');
    setRequiredSessions(song.requiredSessions);
    setSessionDifficulties(song.sessionDifficulties);
  }, [song]);
  
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
    onSubmit({
      title: title.trim(),
      artist: artist.trim(),
      genre: genre.trim(),
      requiredSessions,
      sessionDifficulties,
    });
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="곡 수정" size="lg">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
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
        
        {/* 제출 버튼 */}
        <div className="flex space-x-2 pt-4">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={!title.trim() || !artist.trim() || isSubmitting}
          >
            {isSubmitting ? '수정 중...' : '수정 완료'}
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

