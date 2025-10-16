# JamVote 개발 진행 상황

> 개발 진행 상황을 실시간으로 기록합니다.

**시작일**: 2025-10-14  
**현재 Phase**: Phase 1 - MVP

---

## ✅ 완료된 작업

### 2025-10-14

#### 프로젝트 초기 설정
- [x] 요구사항 문서 작성 (requirements.md)
- [x] 의사결정 내역 작성 (decisions.md)
- [x] 개발 계획 수립 (DEVELOPMENT_PLAN.md)
- [x] 진행 상황 추적 파일 생성 (PROGRESS.md)

#### Day 1-2: 프로젝트 초기 설정
- [x] 프론트엔드 Vite + React + TypeScript 설정
- [x] Tailwind CSS 설정
- [x] 프론트엔드 추가 패키지 설치 (react-router-dom, react-hook-form, @headlessui/react)
- [x] 백엔드 Express 프로젝트 설정
- [x] 백엔드 추가 패키지 설치 (express-validator, express-rate-limit, uuid)
- [x] 프론트엔드 디렉토리 구조 생성
- [x] 백엔드 디렉토리 구조 생성
- [x] TypeScript 타입 정의 (jam, user, song, vote, comment, feedback)
- [x] 프론트엔드 상수 파일 (sessions, config)
- [x] 프론트엔드 유틸리티 (storage, normalize, date, validation)
- [x] 백엔드 기본 설정 (db, app, server)
- [x] 백엔드 유틸리티 (generateId, normalize)
- [x] 백엔드 미들웨어 (errorHandler)
- [x] 프론트엔드 API 클라이언트 (jam, user, song, vote, comment, feedback, youtube)
- [x] 환경 변수 템플릿 생성 (ENV_SETUP.md)
- [x] Git 초기 커밋 ✅

#### Day 3-4: 데이터베이스 및 기본 API
- [x] Mongoose 모델 작성 (Jam, User, Song, Vote, Comment, Feedback)
- [x] ID 생성 유틸리티 구현
- [x] 상수 정의 (constants.js)
- [x] 입력값 검증 미들웨어 (validate.js)
- [x] Jam API 구현 (컨트롤러, 라우터)
  - [x] POST /api/jams (방 생성)
  - [x] GET /api/jams/:jamId (방 조회)
  - [x] PATCH /api/jams/:jamId/expiry (유효기한 수정)
- [x] User API 구현 (컨트롤러, 라우터)
  - [x] POST /api/users (프로필 생성)
  - [x] POST /api/users/login (로그인)
  - [x] PATCH /api/users/:jamId/:userName (프로필 수정)
- [x] bcrypt 비밀번호 해싱
- [x] ~~이름 정규화 유틸리티~~ (제거됨 - 스키마 단순화)
- [x] API 라우터 연결
- [x] Git 커밋 ✅

#### [긴급] User 스키마 단순화 (2025-10-16)
- [x] normalizedName 필드 제거
- [x] 중복 체크 방식 변경 (정확한 일치)
- [x] 공백 검증 추가 (프론트/백엔드)
- [x] normalize 유틸리티 삭제
- [x] validation.ts 업데이트
- [x] Git 커밋 ✅

#### Day 5-7: 프론트엔드 기본 구조
- [x] 세션 아이콘 SVG 컴포넌트
- [x] 공통 UI 컴포넌트 (Button, Input, Modal, Toast 등)
- [x] React Router 설정
- [x] React Query 설정
- [x] 홈 페이지 (방 생성/접속)
- [x] 로그인 페이지 (프로필 생성)
- [x] 방 페이지 스켈레톤

---

#### Day 8-9: 곡 관리 백엔드
- [x] Song API 구현 (컨트롤러, 라우터)
  - [x] POST /api/songs (곡 추가)
  - [x] GET /api/songs (목록 조회, 투표 수 집계)
  - [x] GET /api/songs/:songId (상세 조회)
  - [x] PATCH /api/songs/:songId (수정, 권한 체크)
  - [x] DELETE /api/songs/:songId (삭제, Cascade)
- [x] Vote API 구현 (컨트롤러, 라우터)
  - [x] POST /api/votes (투표 생성/변경)
  - [x] DELETE /api/votes/:voteId (투표 취소)
  - [x] GET /api/votes?songId= (투표 목록, 세션 정보 포함)
- [x] YouTube API 구현
  - [x] GET /api/youtube/search (검색)
  - [x] Fallback 임시 데이터 (API 키 없을 때)
  - [x] ISO 8601 duration 파싱
- [x] axios 설치
- [x] API 라우터 연결
- [x] Git 커밋 ✅

#### Day 10-11: 곡 관리 프론트엔드
- [x] Hooks 구현
  - [x] useSongs (CRUD)
  - [x] useVotes (투표 관리)
  - [x] useYouTube (검색, 디바운싱)
- [x] Song 컴포넌트 구현 (9개)
  - [x] YouTubePlayer (임베드)
  - [x] VoteButton (좋아요/불가능)
  - [x] SessionBadge (세션 아이콘)
  - [x] DifficultySlider (난이도 슬라이더)
  - [x] SongCard (곡 카드, 펼치기)
  - [x] SongList (곡 목록)
  - [x] YouTubeSearchResult (검색 결과)
  - [x] SongSearchBar (검색 바)
  - [x] AddSongModal (곡 추가 모달)
- [x] JamPage 통합
  - [x] YouTube 검색 통합
  - [x] 곡 리스트 표시
  - [x] 투표 기능
  - [x] 곡 추가 워크플로우
- [x] Git 커밋 ✅

---

## 🚧 진행 중인 작업

없음 (Day 10-11 완료!)

---

## 📝 다음 작업

### Day 12-13: 투표 및 실시간 기능
- 투표 취소 기능
- 투표 결과 상세 표시
- Socket.io 실시간 동기화
- 곡 수정/삭제 기능

### 수동 작업 (테스트용)
- MongoDB Atlas 계정 생성 및 설정
- 환경 변수 실제 값 설정 (.env 파일 생성)
- 백엔드 서버 테스트 실행

---

## 📊 Phase 1 진행률

### Week 1 (7일)
- [x] Day 0: 문서 작성 ✅
- [ ] Day 1-2: 프로젝트 초기 설정 (진행 중)
- [ ] Day 3-4: 데이터베이스 및 기본 API
- [ ] Day 5-7: 프론트 - 방 생성/접속 화면

### Week 2 (7일)
- [ ] Day 8-9: 곡 관리 백엔드
- [ ] Day 10-11: 곡 관리 프론트엔드
- [ ] Day 12-13: 투표 및 곡 리스트
- [ ] Day 14: 실시간 동기화

**전체 진행률**: 7% (1/14 일차 완료)

---

## 🐛 알려진 이슈

없음

---

## 💡 참고사항

### 수동으로 해야 할 작업
1. **MongoDB Atlas 설정**
   - https://www.mongodb.com/cloud/atlas 접속
   - 무료 계정 생성
   - M0 클러스터 생성 (512MB)
   - 데이터베이스 사용자 생성
   - 네트워크 접근 허용 (0.0.0.0/0)
   - 연결 문자열 복사

2. **YouTube Data API 키 발급**
   - https://console.cloud.google.com/ 접속
   - 새 프로젝트 생성
   - YouTube Data API v3 활성화
   - API 키 생성

### 환경 변수 설정
프로젝트 설정 완료 후:
- `frontend/.env.local` 파일에 실제 값 입력
- `backend/.env` 파일에 실제 값 입력

---

**최종 업데이트**: 2025-10-14 (자동 업데이트)

