// Song 컨트롤러

const Song = require('../models/Song');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');
const Jam = require('../models/Jam');
const { generateUUID } = require('../utils/generateId');

/**
 * 곡 추가
 * POST /api/songs
 */
async function createSong(req, res, next) {
  try {
    const {
      jamId,
      proposerName,
      youtubeUrl,
      title,
      artist,
      duration,
      thumbnailUrl,
      genre,
      requiredSessions,
      sessionDifficulties,
      allowEditByOthers,
    } = req.body;
    
    // 방 존재 여부 확인
    const jam = await Jam.findOne({ jamId });
    if (!jam) {
      return res.status(404).json({ error: '존재하지 않는 방입니다' });
    }
    
    // YouTube 비디오 ID 추출
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (!videoIdMatch) {
      return res.status(400).json({ error: '올바른 YouTube URL이 아닙니다' });
    }
    const youtubeVideoId = videoIdMatch[1];
    
    // 곡 생성
    const song = await Song.create({
      songId: generateUUID(),
      jamId,
      proposerName,
      youtubeUrl,
      youtubeVideoId,
      title,
      artist,
      duration,
      thumbnailUrl,
      genre: genre || '',
      requiredSessions: requiredSessions || [],
      sessionDifficulties: sessionDifficulties || {},
      allowEditByOthers: allowEditByOthers !== undefined ? allowEditByOthers : true,
    });
    
    const responseData = {
      songId: song.songId,
      jamId: song.jamId,
      proposerName: song.proposerName,
      youtubeUrl: song.youtubeUrl,
      youtubeVideoId: song.youtubeVideoId,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      thumbnailUrl: song.thumbnailUrl,
      genre: song.genre,
      requiredSessions: song.requiredSessions,
      sessionDifficulties: song.sessionDifficulties,
      allowEditByOthers: song.allowEditByOthers,
      createdAt: song.createdAt,
    };
    
    // Socket.io 이벤트 발송
    if (req.io) {
      req.io.to(jamId).emit('songCreated', responseData);
    }
    
    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
}

/**
 * 곡 목록 조회
 * GET /api/songs?jamId=xxx&userName=xxx (optional)
 */
async function getSongs(req, res, next) {
  try {
    const { jamId, userName } = req.query;
    
    if (!jamId) {
      return res.status(400).json({ error: 'jamId가 필요합니다' });
    }
    
    // MongoDB Aggregation Pipeline을 사용하여 N+1 쿼리 문제 해결
    const pipeline = [
      // 1. jamId로 필터링
      { $match: { jamId } },
      
      // 2. Vote 컬렉션과 조인
      {
        $lookup: {
          from: 'votes',
          localField: 'songId',
          foreignField: 'songId',
          as: 'votes'
        }
      },
      
      // 3. 투표 집계 및 사용자 투표 추출
      {
        $addFields: {
          likesCount: {
            $size: {
              $filter: {
                input: '$votes',
                as: 'vote',
                cond: { $eq: ['$$vote.type', 'like'] }
              }
            }
          },
          impossibleCount: {
            $size: {
              $filter: {
                input: '$votes',
                as: 'vote',
                cond: { $eq: ['$$vote.type', 'impossible'] }
              }
            }
          },
          userVoteData: userName ? {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$votes',
                  as: 'vote',
                  cond: { $eq: ['$$vote.userName', userName] }
                }
              },
              0
            ]
          } : null
        }
      },
      
      // 4. 좋아요 수 내림차순 → 작성일 내림차순 정렬
      {
        $sort: {
          likesCount: -1,
          createdAt: -1
        }
      },
      
      // 5. 필요한 필드만 선택 및 재구성
      {
        $project: {
          _id: 0,
          songId: 1,
          jamId: 1,
          proposerName: 1,
          youtubeUrl: 1,
          youtubeVideoId: 1,
          title: 1,
          artist: 1,
          duration: 1,
          thumbnailUrl: 1,
          genre: 1,
          requiredSessions: 1,
          sessionDifficulties: 1,
          allowEditByOthers: 1,
          likesCount: 1,
          impossibleCount: 1,
          userVote: { $ifNull: ['$userVoteData.type', null] },
          userVoteId: { $ifNull: ['$userVoteData.voteId', null] },
          createdAt: 1
        }
      }
    ];
    
    const songsWithVotes = await Song.aggregate(pipeline);
    
    res.json({ songs: songsWithVotes });
  } catch (error) {
    next(error);
  }
}

/**
 * 곡 상세 조회
 * GET /api/songs/:songId
 */
async function getSong(req, res, next) {
  try {
    const { songId } = req.params;
    
    const song = await Song.findOne({ songId });
    if (!song) {
      return res.status(404).json({ error: '곡을 찾을 수 없습니다' });
    }
    
    // 투표 정보 조회
    const votes = await Vote.find({ songId });
    const likesCount = votes.filter(v => v.type === 'like').length;
    const impossibleCount = votes.filter(v => v.type === 'impossible').length;
    
    res.json({
      songId: song.songId,
      jamId: song.jamId,
      proposerName: song.proposerName,
      youtubeUrl: song.youtubeUrl,
      youtubeVideoId: song.youtubeVideoId,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      thumbnailUrl: song.thumbnailUrl,
      genre: song.genre,
      requiredSessions: song.requiredSessions,
      sessionDifficulties: song.sessionDifficulties,
      allowEditByOthers: song.allowEditByOthers,
      likesCount,
      impossibleCount,
      createdAt: song.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 곡 수정
 * PATCH /api/songs/:songId
 */
async function updateSong(req, res, next) {
  try {
    const { songId } = req.params;
    const { userName, title, artist, genre, requiredSessions, sessionDifficulties } = req.body;
    
    const song = await Song.findOne({ songId });
    if (!song) {
      return res.status(404).json({ error: '곡을 찾을 수 없습니다' });
    }
    
    // 수정 권한 체크
    if (!song.allowEditByOthers && song.proposerName !== userName) {
      return res.status(403).json({ error: '수정 권한이 없습니다' });
    }
    
    // 수정
    if (title !== undefined) song.title = title;
    if (artist !== undefined) song.artist = artist;
    if (genre !== undefined) song.genre = genre;
    if (requiredSessions !== undefined) song.requiredSessions = requiredSessions;
    if (sessionDifficulties !== undefined) song.sessionDifficulties = sessionDifficulties;
    
    await song.save();
    
    const responseData = {
      songId: song.songId,
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      requiredSessions: song.requiredSessions,
      sessionDifficulties: song.sessionDifficulties,
    };
    
    // Socket.io 이벤트 발송
    if (req.io) {
      req.io.to(song.jamId).emit('songUpdated', responseData);
    }
    
    res.json(responseData);
  } catch (error) {
    next(error);
  }
}

/**
 * 곡 삭제
 * DELETE /api/songs/:songId
 */
async function deleteSong(req, res, next) {
  try {
    const { songId } = req.params;
    const { userName, jamId } = req.query;
    
    if (!userName || !jamId) {
      return res.status(400).json({ error: 'userName과 jamId가 필요합니다' });
    }
    
    const song = await Song.findOne({ songId });
    if (!song) {
      return res.status(404).json({ error: '곡을 찾을 수 없습니다' });
    }
    
    // 삭제 권한 체크 (제안자만)
    if (song.proposerName !== userName) {
      return res.status(403).json({ error: '삭제 권한이 없습니다' });
    }
    
    // Cascade 삭제
    await Vote.deleteMany({ songId });
    await Comment.deleteMany({ songId });
    await Song.deleteOne({ songId });
    
    // Socket.io 이벤트 발송
    if (req.io) {
      req.io.to(jamId).emit('songDeleted', { songId });
    }
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSong,
  getSongs,
  getSong,
  updateSong,
  deleteSong,
};

