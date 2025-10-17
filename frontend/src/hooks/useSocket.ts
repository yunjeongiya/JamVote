// Socket.io 클라이언트 hook

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface UseSocketOptions {
  jamId: string;
  onSongCreated?: (data: any) => void;
  onSongUpdated?: (data: any) => void;
  onSongDeleted?: (data: { songId: string }) => void;
  onVoteCreated?: (data: any) => void;
  onVoteChanged?: (data: any) => void;
  onVoteDeleted?: (data: any) => void;
  onCommentCreated?: (data: any) => void;
  onCommentDeleted?: (data: any) => void;
}

export function useSocket(options: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const {
    jamId,
    onSongCreated,
    onSongUpdated,
    onSongDeleted,
    onVoteCreated,
    onVoteChanged,
    onVoteDeleted,
    onCommentCreated,
    onCommentDeleted,
  } = options;
  
  useEffect(() => {
    // Socket.io 연결
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });
    
    const socket = socketRef.current;
    
    // 방 입장
    socket.emit('joinJam', jamId);
    console.log(`Joined jam: ${jamId}`);
    
    // 이벤트 리스너 등록
    if (onSongCreated) {
      socket.on('songCreated', onSongCreated);
    }
    
    if (onSongUpdated) {
      socket.on('songUpdated', onSongUpdated);
    }
    
    if (onSongDeleted) {
      socket.on('songDeleted', onSongDeleted);
    }
    
    if (onVoteCreated) {
      socket.on('voteCreated', onVoteCreated);
    }
    
    if (onVoteChanged) {
      socket.on('voteChanged', onVoteChanged);
    }
    
    if (onVoteDeleted) {
      socket.on('voteDeleted', onVoteDeleted);
    }
    
    if (onCommentCreated) {
      socket.on('commentCreated', onCommentCreated);
    }
    
    if (onCommentDeleted) {
      socket.on('commentDeleted', onCommentDeleted);
    }
    
    // 연결 성공
    socket.on('connect', () => {
      console.log('Socket.io connected');
    });
    
    // 연결 해제
    socket.on('disconnect', () => {
      console.log('Socket.io disconnected');
    });
    
    // 클린업
    return () => {
      socket.emit('leaveJam', jamId);
      socket.off('songCreated');
      socket.off('songUpdated');
      socket.off('songDeleted');
      socket.off('voteCreated');
      socket.off('voteChanged');
      socket.off('voteDeleted');
      socket.off('commentCreated');
      socket.off('commentDeleted');
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [
    jamId,
    onSongCreated,
    onSongUpdated,
    onSongDeleted,
    onVoteCreated,
    onVoteChanged,
    onVoteDeleted,
    onCommentCreated,
    onCommentDeleted,
  ]);
  
  return socketRef.current;
}

