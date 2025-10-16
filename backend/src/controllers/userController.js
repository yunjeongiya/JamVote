// User 컨트롤러

const bcrypt = require('bcrypt');
const User = require('../models/User');
const Jam = require('../models/Jam');
const { normalizeUsername } = require('../utils/normalize');

/**
 * 프로필 생성 (회원가입)
 * POST /api/users
 */
async function createUser(req, res, next) {
  try {
    const { jamId, name, password, sessions } = req.body;
    
    // 방 존재 여부 확인
    const jam = await Jam.findOne({ jamId });
    if (!jam) {
      return res.status(404).json({ error: '존재하지 않는 방입니다' });
    }
    
    // 방 만료 여부 확인
    if (jam.expireAt < new Date()) {
      return res.status(410).json({ error: '유효기한이 지난 방입니다' });
    }
    
    // 이름 정규화
    const normalizedName = normalizeUsername(name);
    
    // 중복 체크
    const existingUser = await User.findOne({ jamId, normalizedName });
    if (existingUser) {
      return res.status(409).json({ error: '이미 사용 중인 이름입니다' });
    }
    
    // 비밀번호 해싱
    let passwordHash = null;
    if (password && password.trim()) {
      passwordHash = await bcrypt.hash(password, 10);
    }
    
    // 사용자 생성
    const user = await User.create({
      jamId,
      name: name.trim(),
      normalizedName,
      passwordHash,
      sessions: sessions || [],
    });
    
    res.status(201).json({
      userName: user.name,
      sessions: user.sessions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 로그인
 * POST /api/users/login
 */
async function loginUser(req, res, next) {
  try {
    const { jamId, name, password } = req.body;
    
    // 방 존재 여부 확인
    const jam = await Jam.findOne({ jamId });
    if (!jam) {
      return res.status(404).json({ error: '존재하지 않는 방입니다' });
    }
    
    // 방 만료 여부 확인
    if (jam.expireAt < new Date()) {
      return res.status(410).json({ error: '유효기한이 지난 방입니다' });
    }
    
    // 이름 정규화
    const normalizedName = normalizeUsername(name);
    
    // 사용자 찾기
    const user = await User.findOne({ jamId, normalizedName });
    if (!user) {
      return res.status(404).json({ error: '존재하지 않는 사용자입니다' });
    }
    
    // 비밀번호 검증
    if (user.passwordHash) {
      if (!password) {
        return res.status(401).json({ error: '비밀번호가 필요합니다' });
      }
      
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: '비밀번호가 틀렸습니다' });
      }
    }
    
    res.json({
      userName: user.name,
      sessions: user.sessions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 프로필 수정
 * PATCH /api/users/:jamId/:userName
 */
async function updateUser(req, res, next) {
  try {
    const { jamId, userName } = req.params;
    const { newName, sessions } = req.body;
    
    // 기존 사용자 찾기
    const normalizedOldName = normalizeUsername(userName);
    const user = await User.findOne({ jamId, normalizedName: normalizedOldName });
    
    if (!user) {
      return res.status(404).json({ error: '존재하지 않는 사용자입니다' });
    }
    
    // 이름 변경 시 중복 체크
    if (newName && newName.trim() !== user.name) {
      const normalizedNewName = normalizeUsername(newName);
      
      const existingUser = await User.findOne({
        jamId,
        normalizedName: normalizedNewName,
      });
      
      if (existingUser) {
        return res.status(409).json({ error: '이미 사용 중인 이름입니다' });
      }
      
      user.name = newName.trim();
      user.normalizedName = normalizedNewName;
    }
    
    // 세션 변경
    if (sessions !== undefined) {
      user.sessions = sessions;
    }
    
    await user.save();
    
    res.json({
      userName: user.name,
      sessions: user.sessions,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  loginUser,
  updateUser,
};

