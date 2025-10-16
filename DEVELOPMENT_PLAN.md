# JamVote 전체 개발 상세 계획

> 밴드 합주곡 투표 서비스 - 완전한 구현 가이드

---

## 📋 목차
1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [데이터베이스 설계](#4-데이터베이스-설계)
5. [API 설계](#5-api-설계)
6. [컴포넌트 설계](#6-컴포넌트-설계)
7. [Phase별 개발 계획](#7-phase별-개발-계획)
8. [구현 세부 사항](#8-구현-세부-사항)
9. [배포 전략](#9-배포-전략)
10. [테스트 계획](#10-테스트-계획)

---

## 1. 프로젝트 개요

### 1.1 서비스 목적
- 밴드 합주곡 선정을 위한 투표 플랫폼
- 모바일 중심의 간편한 사용성
- YouTube 연동을 통한 즉시 재생 및 확인
- 실시간 동기화로 원활한 소통

### 1.2 핵심 가치
- **편의성**: 회원가입 없이 방 ID만으로 즉시 사용
- **실시간성**: Socket.io를 통한 즉각적인 반영
- **직관성**: 모바일 최적화된 심플한 UI
- **투명성**: 기명 투표로 의견 공유

### 1.3 타겟 사용자
- 아마추어/세미프로 밴드
- 동아리 밴드
- 단기 프로젝트 밴드
- 합주 스터디 그룹

---

## 2. 기술 스택

### 2.1 프론트엔드
```json
{
  "framework": "React 18.3+",
  "buildTool": "Vite 5+",
  "language": "TypeScript 5+",
  "styling": "Tailwind CSS 3+",
  "stateManagement": "React Query (TanStack Query) 5+",
  "httpClient": "Axios 1+",
  "realtime": "Socket.io Client 4+",
  "routing": "React Router 6+",
  "forms": "React Hook Form 7+",
  "ui": "Headless UI (모달, 드롭다운)"
}
```

### 2.2 백엔드
```json
{
  "runtime": "Node.js 20 LTS",
  "framework": "Express 4+",
  "language": "JavaScript (ES Modules)",
  "database": "MongoDB 7+",
  "odm": "Mongoose 8+",
  "realtime": "Socket.io 4+",
  "scheduling": "node-cron 3+",
  "security": "bcrypt 5+",
  "validation": "express-validator 7+",
  "cors": "cors 2+",
  "env": "dotenv 16+"
}
```

### 2.3 외부 API
- **YouTube Data API v3**: 검색 기능
- **YouTube IFrame Player API**: 임베드 재생

### 2.4 호스팅
- **프론트엔드**: Vercel (무료)
- **백엔드**: Railway 또는 Render (무료 티어)
- **데이터베이스**: MongoDB Atlas (무료 512MB)

---

## 3. 프로젝트 구조

### 3.1 프론트엔드 구조
```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/              # 이미지, 아이콘
│   │   └── icons/           # SVG 세션 아이콘
│   │       ├── VocalIcon.tsx
│   │       ├── GuitarIcon.tsx
│   │       ├── BassIcon.tsx
│   │       ├── DrumsIcon.tsx
│   │       ├── KeyboardIcon.tsx
│   │       └── UserIcon.tsx
│   ├── components/          # 재사용 가능 컴포넌트
│   │   ├── common/          # 공통 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── FloatingFeedbackButton.tsx
│   │   ├── jam/             # 방 관련
│   │   │   ├── JamHeader.tsx
│   │   │   ├── JamExpiryBadge.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── song/            # 곡 관련
│   │   │   ├── SongCard.tsx
│   │   │   ├── SongList.tsx
│   │   │   ├── SongSearchBar.tsx
│   │   │   ├── SongDetailModal.tsx
│   │   │   ├── YouTubePlayer.tsx
│   │   │   ├── VoteButton.tsx
│   │   │   └── SessionDifficultySlider.tsx
│   │   ├── comment/         # 댓글 관련
│   │   │   ├── CommentList.tsx
│   │   │   ├── CommentItem.tsx
│   │   │   └── CommentForm.tsx
│   │   └── feedback/        # 피드백 관련
│   │       └── FeedbackModal.tsx
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── HomePage.tsx     # 방 생성/접속
│   │   ├── LoginPage.tsx    # 로그인/프로필 생성
│   │   ├── JamPage.tsx      # 방 진행 (메인)
│   │   └── NotFoundPage.tsx
│   ├── hooks/               # 커스텀 훅
│   │   ├── useAuth.ts       # 인증 관련
│   │   ├── useJam.ts        # 방 정보
│   │   ├── useSongs.ts      # 곡 목록
│   │   ├── useVotes.ts      # 투표
│   │   ├── useComments.ts   # 댓글
│   │   ├── useSocket.ts     # 실시간 동기화
│   │   └── useYouTube.ts    # 유튜브 검색
│   ├── api/                 # API 호출 함수
│   │   ├── client.ts        # Axios 인스턴스
│   │   ├── jam.ts
│   │   ├── user.ts
│   │   ├── song.ts
│   │   ├── vote.ts
│   │   ├── comment.ts
│   │   ├── feedback.ts
│   │   └── youtube.ts
│   ├── types/               # TypeScript 타입
│   │   ├── jam.ts
│   │   ├── user.ts
│   │   ├── song.ts
│   │   ├── vote.ts
│   │   └── comment.ts
│   ├── utils/               # 유틸리티 함수
│   │   ├── storage.ts       # localStorage 관리
│   │   ├── normalize.ts     # 이름 정규화
│   │   ├── date.ts          # 날짜 포맷
│   │   └── validation.ts    # 유효성 검증
│   ├── constants/           # 상수
│   │   ├── sessions.ts      # 세션 종류
│   │   └── config.ts        # 앱 설정
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .env.local
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 3.2 백엔드 구조
```
backend/
├── src/
│   ├── models/              # Mongoose 스키마
│   │   ├── Jam.js
│   │   ├── User.js
│   │   ├── Song.js
│   │   ├── Vote.js
│   │   ├── Comment.js
│   │   └── Feedback.js
│   ├── routes/              # Express 라우터
│   │   ├── jam.js
│   │   ├── user.js
│   │   ├── song.js
│   │   ├── vote.js
│   │   ├── comment.js
│   │   └── feedback.js
│   ├── controllers/         # 비즈니스 로직
│   │   ├── jamController.js
│   │   ├── userController.js
│   │   ├── songController.js
│   │   ├── voteController.js
│   │   ├── commentController.js
│   │   └── feedbackController.js
│   ├── middleware/          # 미들웨어
│   │   ├── auth.js          # 인증 검증
│   │   ├── validate.js      # 입력값 검증
│   │   └── errorHandler.js  # 에러 핸들링
│   ├── utils/               # 유틸리티 함수
│   │   ├── generateId.js    # ID 생성
│   │   ├── normalize.js     # 이름 정규화
│   │   └── cleanup.js       # 데이터 정리
│   ├── config/              # 설정
│   │   ├── db.js            # MongoDB 연결
│   │   └── socket.js        # Socket.io 설정
│   ├── jobs/                # 크론 잡
│   │   └── cleanup.js       # 만료 방 삭제
│   ├── app.js               # Express 앱
│   └── server.js            # 서버 시작
├── .env.example
├── .env
├── package.json
└── README.md
```

---

## 4. 데이터베이스 설계

### 4.1 Jam (방) 컬렉션
```javascript
{
  _id: ObjectId,
  jamId: String,              // Unique, 6자리 영문+숫자 (인덱스)
  name: String,               // 방 이름 (없으면 jamId 사용)
  description: String,        // 설명 (optional)
  createdAt: Date,            // 생성일
  expireAt: Date              // 만료일 (인덱스)
}

// 인덱스
jamId: unique
expireAt: 1 (크론 잡 쿼리 최적화)
```

### 4.2 User (사용자) 컬렉션
```javascript
{
  _id: ObjectId,
  jamId: String,              // FK to Jam (인덱스)
  name: String,               // 사용자 이름 (공백 없음, 대소문자 구분)
  passwordHash: String,       // bcrypt 해시 (optional)
  sessions: [String],         // ['보컬', '기타']
  createdAt: Date
}

// 인덱스
jamId: 1
{ jamId: 1, name: 1 }: unique (방 내 중복 방지)
```

### 4.3 Song (곡) 컬렉션
```javascript
{
  _id: ObjectId,
  songId: String,             // Unique, UUID
  jamId: String,              // FK to Jam (인덱스)
  proposerName: String,       // 제안자 이름
  youtubeUrl: String,         // 유튜브 링크
  youtubeVideoId: String,     // 유튜브 영상 ID (재생용)
  title: String,              // 곡 제목
  artist: String,             // 가수/아티스트
  duration: String,           // 재생시간 (예: "3:45")
  thumbnailUrl: String,       // 썸네일 URL
  genre: String,              // 장르 (optional)
  requiredSessions: [String], // ['보컬', '기타', '베이스']
  sessionDifficulties: {      // { '보컬': 3, '기타': 4 }
    type: Map,
    of: Number                // 1~5
  },
  allowEditByOthers: Boolean, // 다른 사람 수정 가능 여부
  createdAt: Date
}

// 인덱스
songId: unique
jamId: 1
{ jamId: 1, createdAt: -1 } (곡 리스트 정렬 최적화)
```

### 4.4 Vote (투표) 컬렉션
```javascript
{
  _id: ObjectId,
  voteId: String,             // Unique, UUID
  songId: String,             // FK to Song (인덱스)
  userName: String,           // 투표자 이름
  type: String,               // 'like' | 'impossible'
  reason: String,             // 불가능 이유 (optional)
  createdAt: Date
}

// 인덱스
voteId: unique
songId: 1
{ songId: 1, userName: 1 }: unique (한 곡에 한 번만)
```

### 4.5 Comment (댓글) 컬렉션
```javascript
{
  _id: ObjectId,
  commentId: String,          // Unique, UUID
  songId: String,             // FK to Song (인덱스)
  writerName: String,         // 작성자 이름
  sessionInfo: [String],      // 작성자 세션 정보
  content: String,            // 댓글 내용
  createdAt: Date
}

// 인덱스
commentId: unique
songId: 1
{ songId: 1, createdAt: 1 } (댓글 리스트 정렬)
```

### 4.6 Feedback (피드백) 컬렉션
```javascript
{
  _id: ObjectId,
  feedbackId: String,         // Unique, UUID
  jamId: String,              // 방 ID (optional)
  userName: String,           // 사용자 이름 (optional)
  content: String,            // 피드백 내용
  rating: Number,             // 1~5 (optional)
  createdAt: Date
}

// 인덱스
feedbackId: unique
createdAt: -1 (관리자 확인 시 최신순)
```

### 4.7 Cascade 삭제 전략
```javascript
// Jam 삭제 시
- User.deleteMany({ jamId })
- Song.deleteMany({ jamId })
- Vote.deleteMany({ songId: { $in: songIds } })
- Comment.deleteMany({ songId: { $in: songIds } })

// Song 삭제 시
- Vote.deleteMany({ songId })
- Comment.deleteMany({ songId })
```

---

## 5. API 설계

### 5.1 Jam API

#### `POST /api/jams`
방 생성
```javascript
// Request
{
  name?: string,           // 비어있으면 jamId 사용
  description?: string,
  expireDays: number       // 7, 15, 30, 60, 90
}

// Response
{
  jamId: string,
  name: string,
  description: string,
  expireAt: Date,
  shareLink: string        // "https://jamvote.app/{jamId}"
}
```

#### `GET /api/jams/:jamId`
방 정보 조회
```javascript
// Response
{
  jamId: string,
  name: string,
  description: string,
  createdAt: Date,
  expireAt: Date,
  daysRemaining: number
}
```

#### `PATCH /api/jams/:jamId/expiry`
방 유효기한 수정
```javascript
// Request
{
  expireDays: number       // 7, 15, 30, 60, 90
}

// Response
{
  expireAt: Date,
  daysRemaining: number
}
```

### 5.2 User API

#### `POST /api/users`
프로필 생성 (회원가입)
```javascript
// Request
{
  jamId: string,
  name: string,
  password?: string,       // optional
  sessions: string[]       // ['보컬', '기타']
}

// Response
{
  userName: string,
  sessions: string[],
  token: string            // 간단한 인증 토큰 (선택)
}
```

#### `POST /api/users/login`
로그인
```javascript
// Request
{
  jamId: string,
  name: string,
  password?: string
}

// Response
{
  userName: string,
  sessions: string[],
  token: string
}
```

#### `PATCH /api/users/:jamId/:userName`
프로필 수정
```javascript
// Request
{
  newName?: string,
  sessions?: string[]
}

// Response
{
  userName: string,
  sessions: string[]
}
```

### 5.3 Song API

#### `POST /api/songs`
곡 추가
```javascript
// Request
{
  jamId: string,
  proposerName: string,
  youtubeUrl: string,
  title: string,
  artist: string,
  duration: string,
  thumbnailUrl: string,
  genre?: string,
  requiredSessions: string[],
  sessionDifficulties: { [session: string]: number },
  allowEditByOthers: boolean
}

// Response
{
  songId: string,
  ...
}
```

#### `GET /api/songs?jamId={jamId}`
곡 목록 조회
```javascript
// Response
{
  songs: [
    {
      songId: string,
      title: string,
      artist: string,
      youtubeVideoId: string,
      thumbnailUrl: string,
      genre: string,
      requiredSessions: string[],
      sessionDifficulties: object,
      proposerName: string,
      allowEditByOthers: boolean,
      likesCount: number,
      impossibleCount: number,
      createdAt: Date
    }
  ]
}
```

#### `GET /api/songs/:songId`
곡 상세 조회
```javascript
// Response
{
  songId: string,
  title: string,
  ...
  votes: {
    likes: [
      { userName: string, sessions: string[] }
    ],
    impossibles: [
      { userName: string, sessions: string[], reason: string }
    ]
  },
  comments: [...]
}
```

#### `PATCH /api/songs/:songId`
곡 수정
```javascript
// Request
{
  userName: string,        // 권한 체크용
  title?: string,
  artist?: string,
  genre?: string,
  requiredSessions?: string[],
  sessionDifficulties?: object
}

// Response
{
  songId: string,
  ...
}
```

#### `DELETE /api/songs/:songId`
곡 삭제
```javascript
// Request Query
?userName=string&jamId=string

// Response
{
  success: true
}
```

### 5.4 Vote API

#### `POST /api/votes`
투표 생성/변경
```javascript
// Request
{
  songId: string,
  userName: string,
  type: 'like' | 'impossible',
  reason?: string          // impossible일 때
}

// Response
{
  voteId: string,
  type: string
}
```

#### `DELETE /api/votes/:voteId`
투표 취소
```javascript
// Response
{
  success: true
}
```

#### `GET /api/votes?songId={songId}`
특정 곡의 투표 목록
```javascript
// Response
{
  likes: [
    { userName: string, sessions: string[], createdAt: Date }
  ],
  impossibles: [
    { userName: string, sessions: string[], reason: string, createdAt: Date }
  ]
}
```

### 5.5 Comment API

#### `POST /api/comments`
댓글 작성
```javascript
// Request
{
  songId: string,
  writerName: string,
  sessionInfo: string[],
  content: string
}

// Response
{
  commentId: string,
  writerName: string,
  content: string,
  createdAt: Date
}
```

#### `GET /api/comments?songId={songId}`
댓글 목록
```javascript
// Response
{
  comments: [
    {
      commentId: string,
      writerName: string,
      sessionInfo: string[],
      content: string,
      createdAt: Date
    }
  ]
}
```

#### `PATCH /api/comments/:commentId`
댓글 수정
```javascript
// Request
{
  writerName: string,      // 권한 체크
  content: string
}

// Response
{
  commentId: string,
  content: string
}
```

#### `DELETE /api/comments/:commentId`
댓글 삭제
```javascript
// Request Query
?writerName=string

// Response
{
  success: true
}
```

### 5.6 Feedback API

#### `POST /api/feedback`
피드백 전송
```javascript
// Request
{
  jamId?: string,
  userName?: string,
  content: string,
  rating?: number          // 1~5
}

// Response
{
  feedbackId: string,
  success: true
}
```

### 5.7 YouTube API

#### `GET /api/youtube/search?q={query}`
유튜브 검색
```javascript
// Response
{
  results: [
    {
      videoId: string,
      title: string,
      channelTitle: string,
      thumbnailUrl: string,
      duration: string
    }
  ]
}
```

---

## 6. 컴포넌트 설계

### 6.1 페이지 컴포넌트

#### HomePage
```typescript
// 방 생성 및 접속 화면
- JamIdInput: 방 ID 입력
- JamCreateForm: 방 생성 폼
  - 방 이름 입력 (선택)
  - 설명 입력 (선택)
  - 유효기한 선택 드롭다운
  - 생성 버튼
- ShareLinkDisplay: 생성된 공유 링크 표시
```

#### LoginPage
```typescript
// 로그인 및 프로필 생성 화면
- LoginForm: 로그인 폼
  - 이름 입력
  - 비밀번호 입력 (선택)
  - 로그인 버튼
- ProfileCreateForm: 프로필 생성 폼
  - 이름 입력
  - 비밀번호 입력 (선택)
  - 세션 선택 (체크박스)
  - 프로필 생성 버튼
```

#### JamPage
```typescript
// 방 메인 화면
- JamHeader: 상단 바
  - JamExpiryBadge: 유효기한 표시
  - JamName: 방 이름
  - UserProfile: 사용자 프로필
- SongSearchBar: 곡 검색창
- YouTubeSearchResults: 유튜브 검색 결과
- SongList: 곡 목록
  - SongCard: 개별 곡 카드
    - VoteButton: 투표 버튼
    - SongExpandView: 펼쳐보기
      - YouTubePlayer: 임베드 플레이어
      - VoteResults: 투표 결과
      - CommentSection: 댓글 영역
- FloatingFeedbackButton: 피드백 버튼
```

### 6.2 주요 컴포넌트 Props

#### SongCard
```typescript
interface SongCardProps {
  song: Song;
  currentUser: User;
  onVote: (songId: string, type: 'like' | 'impossible', reason?: string) => void;
  onEdit: (songId: string) => void;
  onDelete: (songId: string) => void;
}
```

#### VoteButton
```typescript
interface VoteButtonProps {
  type: 'like' | 'impossible';
  count: number;
  isActive: boolean;
  onClick: () => void;
}
```

#### YouTubePlayer
```typescript
interface YouTubePlayerProps {
  videoId: string;
  autoplay?: boolean;
}
```

#### CommentItem
```typescript
interface CommentItemProps {
  comment: Comment;
  currentUser: User;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}
```

---

## 7. Phase별 개발 계획

### 7.1 Phase 1 - MVP (2주, 핵심 기능)

#### Week 1: 기본 인프라 및 방 생성/접속
**Day 1-2: 프로젝트 초기 설정**
- [ ] 프론트엔드 Vite + React + TypeScript 설정
- [ ] Tailwind CSS 설정
- [ ] 백엔드 Express 프로젝트 설정
- [ ] MongoDB Atlas 계정 생성 및 데이터베이스 설정
- [ ] 환경 변수 설정 (.env)
- [ ] Git 저장소 설정

**Day 3-4: 데이터베이스 및 기본 API**
- [ ] Mongoose 모델 작성 (Jam, User)
- [ ] ID 생성 유틸리티 (6자리 랜덤)
- [ ] Jam API 구현
  - [ ] POST /api/jams (방 생성)
  - [ ] GET /api/jams/:jamId (방 조회)
- [ ] User API 구현
  - [ ] POST /api/users (프로필 생성)
  - [ ] POST /api/users/login (로그인)
- [ ] bcrypt 비밀번호 해싱
- [ ] 이름 정규화 유틸리티

**Day 5-7: 프론트 - 방 생성/접속 화면**
- [ ] HomePage 컴포넌트
  - [ ] 방 ID 입력 + 접속 버튼
  - [ ] 방 생성 폼
  - [ ] 유효기한 드롭다운
- [ ] LoginPage 컴포넌트
  - [ ] 로그인 폼
  - [ ] 프로필 생성 폼
  - [ ] 세션 선택 UI
- [ ] localStorage 인증 관리
- [ ] React Router 설정
- [ ] Toast 알림 시스템
- [ ] API 연결 (Axios)

#### Week 2: 곡 관리 및 투표 기능
**Day 8-9: 곡 관리 백엔드**
- [ ] Song, Vote 모델 작성
- [ ] Song API 구현
  - [ ] POST /api/songs (곡 추가)
  - [ ] GET /api/songs (목록 조회)
  - [ ] PATCH /api/songs/:songId (수정)
  - [ ] DELETE /api/songs/:songId (삭제)
- [ ] Vote API 구현
  - [ ] POST /api/votes (투표)
  - [ ] DELETE /api/votes/:voteId (취소)
  - [ ] GET /api/votes?songId= (조회)
- [ ] YouTube Data API 연동
  - [ ] GET /api/youtube/search (검색)

**Day 10-11: 곡 관리 프론트엔드**
- [ ] YouTube 검색 API 훅
- [ ] SongSearchBar 컴포넌트
- [ ] YouTubeSearchResults 컴포넌트
- [ ] SongDetailModal (곡 정보 입력)
  - [ ] 제목/가수/재생시간 입력
  - [ ] YouTube 임베드 플레이어
  - [ ] 장르 입력
  - [ ] 세션 선택
  - [ ] 난이도 슬라이더
  - [ ] 수정 권한 체크박스
- [ ] 세션 아이콘 SVG 컴포넌트

**Day 12-13: 투표 및 곡 리스트**
- [ ] JamPage 레이아웃
- [ ] JamHeader 컴포넌트
  - [ ] 유효기한 표시
  - [ ] 방 이름
  - [ ] 사용자 프로필 표시
- [ ] SongList 컴포넌트
- [ ] SongCard 컴포넌트
  - [ ] 기본 정보 표시
  - [ ] VoteButton (좋아요/불가능)
  - [ ] 펼쳐보기 토글
- [ ] 투표 로직 구현
  - [ ] 투표 생성/변경/취소
  - [ ] 불가능 투표 이유 모달

**Day 14: 실시간 동기화**
- [ ] Socket.io 서버 설정
- [ ] Socket.io 클라이언트 설정
- [ ] 실시간 이벤트 정의
  - [ ] newSong: 곡 추가
  - [ ] updateSong: 곡 수정
  - [ ] deleteSong: 곡 삭제
  - [ ] newVote: 투표
  - [ ] deleteVote: 투표 취소
- [ ] 방별 룸 관리 (io.to(jamId))
- [ ] 재연결 로직
- [ ] MVP 테스트 및 버그 수정

### 7.2 Phase 2 - 추가 기능 (1주)

**Day 15-16: 댓글 기능**
- [ ] Comment 모델 작성
- [ ] Comment API 구현
  - [ ] POST /api/comments (작성)
  - [ ] GET /api/comments?songId= (조회)
  - [ ] PATCH /api/comments/:commentId (수정)
  - [ ] DELETE /api/comments/:commentId (삭제)
- [ ] CommentSection 컴포넌트
- [ ] CommentList 컴포넌트
- [ ] CommentItem 컴포넌트
- [ ] CommentForm 컴포넌트
- [ ] 실시간 댓글 동기화

**Day 17: 프로필 및 방 수정**
- [ ] 프로필 수정 API (PATCH /api/users/:jamId/:userName)
- [ ] 프로필 수정 모달
  - [ ] 이름 변경 (중복 체크)
  - [ ] 세션 변경
- [ ] 방 유효기한 수정 API (PATCH /api/jams/:jamId/expiry)
- [ ] 유효기한 수정 모달
- [ ] 만료 임박 알림 (1일 이하)

**Day 18: 피드백 시스템**
- [ ] Feedback 모델 작성
- [ ] Feedback API (POST /api/feedback)
- [ ] FloatingFeedbackButton 컴포넌트
- [ ] FeedbackModal 컴포넌트
  - [ ] 별점 선택 (1~5)
  - [ ] 피드백 텍스트
  - [ ] 개발자 연락처 표시

**Day 19-20: Rate Limiting 및 검증**
- [ ] express-rate-limit 설정
  - [ ] 투표 API: 1분에 30회
  - [ ] 댓글 API: 1분에 10회
- [ ] express-validator 적용
  - [ ] 입력값 길이 제한
  - [ ] 필수 필드 검증
  - [ ] 타입 검증
- [ ] 에러 핸들링 미들웨어
- [ ] Phase 2 테스트 및 버그 수정

**Day 21: 크론 잡 및 최종 정리**
- [ ] node-cron 설정 (매일 새벽 1시)
- [ ] 만료 방 삭제 로직
  - [ ] Cascade 삭제 구현
- [ ] 만료된 방 접속 시 처리
- [ ] 로딩 상태 개선
- [ ] 에러 메시지 통일
- [ ] 접근성 개선 (aria-label)

### 7.3 Phase 3 - 확장 기능 (추후)

**AI 자동 판단 (장르/난이도)**
- [ ] OpenAI API 또는 Google Gemini 연동
- [ ] 곡 정보 자동 분석
- [ ] 세션별 난이도 추정
- [ ] 사용자 수정 가능하게 유지

**데이터 백업/복구**
- [ ] JSON 내보내기 기능
- [ ] 방 데이터 다운로드
- [ ] 방 데이터 가져오기

**대댓글 지원**
- [ ] Comment 스키마 수정 (parentId 추가)
- [ ] 대댓글 UI
- [ ] 대댓글 API

**기타 개선 사항**
- [ ] 다크모드/라이트모드 토글
- [ ] 곡 정렬 옵션 (최신순/인기순/제목순)
- [ ] 곡 필터링 (세션별/장르별)
- [ ] 프로필 이미지 업로드
- [ ] 알림 시스템 (브라우저 알림)

---

## 8. 구현 세부 사항

### 8.1 인증 시스템

#### localStorage 구조
```typescript
// 키: jam_{jamId}
// 값: { userName: string, sessions: string[] }

// 예시
localStorage.setItem('jam_abc123', JSON.stringify({
  userName: '김철수',
  sessions: ['보컬', '기타']
}));

// 유틸리티 함수
function getAuth(jamId: string): { userName: string; sessions: string[] } | null {
  const data = localStorage.getItem(`jam_${jamId}`);
  return data ? JSON.parse(data) : null;
}

function setAuth(jamId: string, userName: string, sessions: string[]): void {
  localStorage.setItem(`jam_${jamId}`, JSON.stringify({ userName, sessions }));
}

function clearAuth(jamId: string): void {
  localStorage.removeItem(`jam_${jamId}`);
}
```

#### 비밀번호 해싱 (백엔드)
```javascript
import bcrypt from 'bcrypt';

// 프로필 생성 시
if (password) {
  const hash = await bcrypt.hash(password, 10);
  user.passwordHash = hash;
}

// 로그인 시
if (user.passwordHash) {
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: '비밀번호가 틀렸습니다' });
  }
}
```

### 8.2 이름 정규화

```typescript
// 프론트엔드 & 백엔드 공통
function normalizeUsername(name: string): string {
  return name.trim().toLowerCase();
}

// 사용 예시
const normalized = normalizeUsername('  John  '); // "john"
const normalized2 = normalizeUsername('김철수'); // "김철수"
```

### 8.3 ID 생성

```javascript
// 백엔드 유틸리티
function generateJamId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// 고유성 보장
async function createUniqueJamId() {
  let jamId;
  let exists = true;
  
  while (exists) {
    jamId = generateJamId();
    exists = await Jam.findOne({ jamId });
  }
  
  return jamId;
}

// UUID (songId, voteId 등)
import { v4 as uuidv4 } from 'uuid';
const songId = uuidv4();
```

### 8.4 YouTube API 연동

#### 검색 API (백엔드)
```javascript
import axios from 'axios';

export async function searchYouTube(query) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const url = 'https://www.googleapis.com/youtube/v3/search';
  
  const response = await axios.get(url, {
    params: {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: 10,
      key: API_KEY,
      videoCategoryId: '10' // 음악 카테고리
    }
  });
  
  return response.data.items.map(item => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnailUrl: item.snippet.thumbnails.medium.url
  }));
}
```

#### 재생시간 가져오기
```javascript
export async function getVideoDuration(videoId) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const url = 'https://www.googleapis.com/youtube/v3/videos';
  
  const response = await axios.get(url, {
    params: {
      part: 'contentDetails',
      id: videoId,
      key: API_KEY
    }
  });
  
  const duration = response.data.items[0].contentDetails.duration;
  return parseISO8601Duration(duration); // "PT3M45S" → "3:45"
}

function parseISO8601Duration(duration) {
  const match = duration.match(/PT(\d+M)?(\d+S)?/);
  const minutes = match[1] ? parseInt(match[1]) : 0;
  const seconds = match[2] ? parseInt(match[2]) : 0;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
```

#### IFrame Player (프론트엔드)
```typescript
import { useEffect, useRef } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  autoplay?: boolean;
}

export function YouTubePlayer({ videoId, autoplay = false }: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  
  useEffect(() => {
    // YouTube IFrame API 로드
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
    
    // 플레이어 초기화
    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0
        }
      });
    };
  }, [videoId, autoplay]);
  
  return (
    <div id="youtube-player" className="aspect-video w-full"></div>
  );
}
```

### 8.5 Socket.io 실시간 동기화

#### 서버 설정
```javascript
import { Server } from 'socket.io';

export function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // 방 입장
    socket.on('joinJam', (jamId) => {
      socket.join(jamId);
      console.log(`User ${socket.id} joined jam ${jamId}`);
    });
    
    // 방 퇴장
    socket.on('leaveJam', (jamId) => {
      socket.leave(jamId);
    });
    
    // 연결 해제
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
  
  return io;
}

// 이벤트 발송 예시 (컨트롤러에서 사용)
export function emitToJam(io, jamId, event, data) {
  io.to(jamId).emit(event, data);
}
```

#### 클라이언트 훅
```typescript
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(jamId: string) {
  const socketRef = useRef<Socket | null>(null);
  
  useEffect(() => {
    // 연결
    socketRef.current = io(import.meta.env.VITE_API_URL);
    
    // 방 입장
    socketRef.current.emit('joinJam', jamId);
    
    // 재연결 처리
    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      socketRef.current?.emit('joinJam', jamId);
    });
    
    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    // 정리
    return () => {
      socketRef.current?.emit('leaveJam', jamId);
      socketRef.current?.disconnect();
    };
  }, [jamId]);
  
  return socketRef.current;
}

// 사용 예시
function JamPage() {
  const { jamId } = useParams();
  const socket = useSocket(jamId!);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!socket) return;
    
    // 새 곡 추가
    socket.on('newSong', (song) => {
      queryClient.setQueryData(['songs', jamId], (old: any) => {
        return [...old, song];
      });
    });
    
    // 투표 업데이트
    socket.on('newVote', (vote) => {
      queryClient.invalidateQueries(['songs', jamId]);
    });
    
    return () => {
      socket.off('newSong');
      socket.off('newVote');
    };
  }, [socket, jamId, queryClient]);
  
  return <div>...</div>;
}
```

### 8.6 크론 잡 (만료 방 삭제)

```javascript
import cron from 'node-cron';
import Jam from './models/Jam.js';
import Song from './models/Song.js';
import User from './models/User.js';
import Vote from './models/Vote.js';
import Comment from './models/Comment.js';

// 매일 새벽 1시 실행
export function setupCleanupJob() {
  cron.schedule('0 1 * * *', async () => {
    console.log('Running cleanup job...');
    
    try {
      // 만료된 방 찾기
      const expiredJams = await Jam.find({
        expireAt: { $lt: new Date() }
      });
      
      const jamIds = expiredJams.map(jam => jam.jamId);
      
      if (jamIds.length === 0) {
        console.log('No expired jams found');
        return;
      }
      
      // Cascade 삭제
      // 1. 곡 ID 수집
      const songs = await Song.find({ jamId: { $in: jamIds } });
      const songIds = songs.map(song => song.songId);
      
      // 2. 투표/댓글 삭제
      await Vote.deleteMany({ songId: { $in: songIds } });
      await Comment.deleteMany({ songId: { $in: songIds } });
      
      // 3. 곡 삭제
      await Song.deleteMany({ jamId: { $in: jamIds } });
      
      // 4. 사용자 삭제
      await User.deleteMany({ jamId: { $in: jamIds } });
      
      // 5. 방 삭제
      await Jam.deleteMany({ jamId: { $in: jamIds } });
      
      console.log(`Deleted ${jamIds.length} expired jams`);
    } catch (error) {
      console.error('Cleanup job error:', error);
    }
  });
}
```

### 8.7 에러 핸들링

#### 백엔드 미들웨어
```javascript
// middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  console.error(err);
  
  // Mongoose 중복 키 에러
  if (err.code === 11000) {
    return res.status(409).json({
      error: '이미 존재하는 데이터입니다',
      field: Object.keys(err.keyPattern)[0]
    });
  }
  
  // Mongoose 유효성 에러
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: '입력값이 유효하지 않습니다',
      details: err.errors
    });
  }
  
  // 기본 에러
  res.status(err.status || 500).json({
    error: err.message || '서버 오류가 발생했습니다'
  });
}

// app.js에서 사용
app.use(errorHandler);
```

#### 프론트엔드 Axios 인터셉터
```typescript
import axios from 'axios';
import { toast } from './utils/toast';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// 응답 인터셉터
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || '요청에 실패했습니다';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default client;
```

### 8.8 React Query 설정

```typescript
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000 // 5분
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

// 사용 예시: hooks/useSongs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as songApi from '../api/song';

export function useSongs(jamId: string) {
  return useQuery({
    queryKey: ['songs', jamId],
    queryFn: () => songApi.getSongs(jamId)
  });
}

export function useAddSong(jamId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: songApi.addSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    }
  });
}
```

---

## 9. 배포 전략

### 9.1 환경 변수

#### 프론트엔드 (.env.local)
```bash
VITE_API_URL=http://localhost:5000
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

#### 백엔드 (.env)
```bash
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jamvote
YOUTUBE_API_KEY=your_youtube_api_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 9.2 Vercel 배포 (프론트엔드)

#### vercel.json
```json
{
  "rewrites": [
    { "source": "/:path*", "destination": "/index.html" }
  ]
}
```

#### 배포 단계
1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 프로젝트 루트: `frontend/`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. 환경 변수 설정:
   - `VITE_API_URL`: Railway/Render 백엔드 URL
   - `VITE_YOUTUBE_API_KEY`: YouTube API 키

### 9.3 Railway 배포 (백엔드)

#### railway.json
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 배포 단계
1. Railway 계정 생성
2. GitHub 저장소 연결
3. 프로젝트 루트: `backend/`
4. 환경 변수 설정:
   - `MONGODB_URI`: MongoDB Atlas 연결 문자열
   - `YOUTUBE_API_KEY`: YouTube API 키
   - `FRONTEND_URL`: Vercel 프론트엔드 URL
   - `PORT`: 5000 (Railway 자동 할당도 가능)

### 9.4 MongoDB Atlas 설정

1. MongoDB Atlas 계정 생성
2. 무료 클러스터 생성 (M0, 512MB)
3. 데이터베이스 사용자 생성
4. 네트워크 접근 허용 (0.0.0.0/0 - 모든 IP)
5. 연결 문자열 복사하여 환경 변수에 설정

### 9.5 도메인 설정 (선택)

- Vercel에서 커스텀 도메인 추가: `jamvote.app`
- DNS 설정 (A 레코드 또는 CNAME)
- HTTPS 자동 설정됨

---

## 10. 테스트 계획

### 10.1 단위 테스트 (선택)

#### 백엔드
```bash
npm install --save-dev jest supertest
```

```javascript
// __tests__/jam.test.js
import request from 'supertest';
import app from '../src/app';

describe('POST /api/jams', () => {
  it('should create a new jam', async () => {
    const response = await request(app)
      .post('/api/jams')
      .send({
        name: '테스트 밴드',
        expireDays: 30
      });
    
    expect(response.status).toBe(201);
    expect(response.body.jamId).toHaveLength(6);
    expect(response.body.name).toBe('테스트 밴드');
  });
});
```

#### 프론트엔드
```bash
npm install --save-dev vitest @testing-library/react
```

```typescript
// __tests__/SongCard.test.tsx
import { render, screen } from '@testing-library/react';
import { SongCard } from '../src/components/song/SongCard';

describe('SongCard', () => {
  it('renders song information', () => {
    const song = {
      songId: '1',
      title: 'Test Song',
      artist: 'Test Artist',
      likesCount: 5,
      impossibleCount: 1
    };
    
    render(<SongCard song={song} />);
    
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
```

### 10.2 통합 테스트

#### E2E 테스트 시나리오
1. **방 생성 플로우**
   - 메인 페이지 접속
   - 방 이름 입력
   - 유효기한 선택
   - 방 생성 버튼 클릭
   - 공유 링크 생성 확인
   - 클립보드 복사 확인

2. **프로필 생성 및 로그인**
   - 방 접속
   - 이름 입력
   - 세션 선택
   - 프로필 생성 버튼 클릭
   - 방 페이지로 이동 확인

3. **곡 추가 플로우**
   - 검색창에 곡 이름 입력
   - YouTube 검색 결과 표시 확인
   - 검색 결과 클릭
   - 곡 정보 입력 모달 확인
   - 정보 입력 후 추가
   - 곡 리스트에 표시 확인

4. **투표 플로우**
   - 곡 카드에서 좋아요 버튼 클릭
   - 좋아요 카운트 증가 확인
   - 버튼 활성화 상태 확인
   - 불가능 버튼 클릭
   - 이유 입력 모달 확인
   - 투표 변경 확인 (좋아요 → 불가능)

5. **실시간 동기화**
   - 두 개의 브라우저 탭 열기
   - 한 쪽에서 곡 추가
   - 다른 쪽에서 자동 반영 확인
   - 투표 동기화 확인

### 10.3 수동 테스트 체크리스트

#### 방 생성/접속
- [ ] 방 이름 없이 생성 시 jamId가 이름으로 설정됨
- [ ] 유효기한 드롭다운 동작
- [ ] 공유 링크 자동 복사 및 토스트 표시
- [ ] 존재하지 않는 방 접속 시 에러 메시지
- [ ] 만료된 방 접속 시 에러 메시지

#### 프로필 생성/로그인
- [ ] 이름 중복 체크 (대소문자, 공백 무시)
- [ ] 비밀번호 선택 사항 동작
- [ ] 세션 복수 선택 가능
- [ ] 직접입력 세션 동작
- [ ] 로그인 시 비밀번호 검증
- [ ] localStorage 저장 확인

#### 곡 관리
- [ ] YouTube 검색 동작
- [ ] 썸네일, 제목, 채널명 표시
- [ ] 곡 정보 자동 입력
- [ ] YouTube 임베드 재생
- [ ] 세션 체크박스 동작
- [ ] 난이도 슬라이더 동작 (1~5)
- [ ] 수정 권한 체크박스 동작
- [ ] 곡 수정 권한 체크
- [ ] 곡 삭제 동작

#### 투표
- [ ] 좋아요/불가능 버튼 동작
- [ ] 투표 카운트 증가/감소
- [ ] 한 곡에 하나만 선택 가능
- [ ] 투표 변경 동작
- [ ] 투표 취소 동작
- [ ] 불가능 이유 모달
- [ ] 펼쳐보기에서 투표자 목록 표시

#### 댓글
- [ ] 댓글 작성
- [ ] 댓글 목록 표시
- [ ] 작성자 이름 + 세션 아이콘 표시
- [ ] 댓글 수정 (작성자만)
- [ ] 댓글 삭제 (작성자만)

#### 실시간 동기화
- [ ] 곡 추가 실시간 반영
- [ ] 투표 실시간 반영
- [ ] 댓글 실시간 반영
- [ ] 네트워크 끊김 시 토스트 표시
- [ ] 재연결 시 자동 복구

#### UI/UX
- [ ] 모바일 화면 (320px~)
- [ ] 터치 영역 크기 (44x44px 이상)
- [ ] 폰트 가독성 (16px 이상)
- [ ] Bottom Sheet 모달 동작
- [ ] 로딩 상태 표시
- [ ] 토스트 알림 표시
- [ ] 색상 대비 (다크모드)

#### 기타
- [ ] 피드백 버튼 동작
- [ ] 피드백 모달 (별점, 텍스트)
- [ ] 프로필 수정 모달
- [ ] 유효기한 수정 모달
- [ ] 만료 임박 알림 (1일 이하)

---

## 11. 성능 최적화 (Phase 3+)

### 11.1 프론트엔드
- [ ] React.memo로 불필요한 리렌더링 방지
- [ ] useMemo, useCallback 활용
- [ ] 이미지 지연 로딩 (Lazy Loading)
- [ ] 코드 스플리팅 (React.lazy)
- [ ] 번들 크기 최적화
- [ ] Service Worker (PWA)

### 11.2 백엔드
- [ ] 데이터베이스 인덱스 최적화
- [ ] API 응답 캐싱 (Redis)
- [ ] 페이지네이션 (곡 목록)
- [ ] Compression 미들웨어
- [ ] Rate limiting 세밀화

### 11.3 데이터베이스
- [ ] 복합 인덱스 추가
- [ ] 쿼리 프로파일링
- [ ] Aggregation Pipeline 최적화

---

## 12. 보안 강화 (Phase 3+)

- [ ] JWT 토큰 기반 인증 (localStorage → httpOnly 쿠키)
- [ ] CSRF 토큰
- [ ] XSS 방어 강화 (DOMPurify)
- [ ] SQL/NoSQL Injection 방어
- [ ] Rate limiting 세분화
- [ ] IP 블랙리스트
- [ ] Content Security Policy (CSP)

---

## 13. 모니터링 및 로깅

### 13.1 백엔드 로깅
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// 프로덕션 환경에서는 콘솔 로그 제거
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 13.2 에러 트래킹
- **Sentry**: 프론트엔드 + 백엔드 에러 추적
- **LogRocket**: 사용자 세션 리플레이

### 13.3 성능 모니터링
- **Vercel Analytics**: 프론트엔드 성능
- **Railway Metrics**: 백엔드 서버 모니터링

---

## 14. 문서화

### 14.1 API 문서
- Swagger/OpenAPI 스펙 작성
- Postman Collection 제공

### 14.2 README
- 프로젝트 소개
- 로컬 개발 환경 설정
- 환경 변수 설명
- 배포 가이드

### 14.3 기여 가이드
- 코드 스타일 (ESLint, Prettier)
- 커밋 메시지 규칙
- PR 템플릿

---

## 15. 프로젝트 타임라인 요약

| 기간 | Phase | 주요 작업 | 상태 |
|------|-------|----------|------|
| Week 1 | Phase 1 | 인프라 설정, 방 생성/접속, 프로필 | ⏳ 예정 |
| Week 2 | Phase 1 | 곡 관리, 투표, 실시간 동기화 | ⏳ 예정 |
| Week 3 | Phase 2 | 댓글, 수정 기능, 피드백, Rate limiting | ⏳ 예정 |
| Week 4+ | Phase 3 | AI 기능, 백업, 대댓글, 성능 최적화 | ⏳ 추후 |

---

## 16. 리소스 링크

### 공식 문서
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Socket.io](https://socket.io/)
- [YouTube Data API](https://developers.google.com/youtube/v3)

### 호스팅
- [Vercel](https://vercel.com/)
- [Railway](https://railway.app/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### 유틸리티
- [React Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Headless UI](https://headlessui.com/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [node-cron](https://www.npmjs.com/package/node-cron)

---

## 17. 다음 단계

1. **프로젝트 초기 설정**
   ```bash
   # 프론트엔드
   cd frontend
   npm install
   
   # 백엔드
   cd backend
   npm install
   ```

2. **환경 변수 설정**
   - `.env.example` 복사하여 `.env` 생성
   - API 키 발급 (YouTube Data API)
   - MongoDB Atlas 연결 문자열 설정

3. **개발 서버 실행**
   ```bash
   # 프론트엔드 (터미널 1)
   cd frontend
   npm run dev
   
   # 백엔드 (터미널 2)
   cd backend
   npm start
   ```

4. **Phase 1 개발 시작**
   - Day 1-2 작업 착수
   - Git 브랜치 전략 수립
   - 첫 커밋!

---

**문서 버전**: 1.0  
**최종 수정일**: 2025-10-14  
**작성자**: AI Assistant

