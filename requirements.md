# JamVote - 밴드 합주곡 투표 서비스 요구사항

## 서비스 개요
밴드에서 합주곡을 정하는 걸 돕는 간단한 모바일 기반 웹서비스.
- 모바일 중심 UI/UX
- 일회성 서비스로 복잡한 회원가입 없이 가볍게 사용
- 보안보다 편의성 우선
- 유튜브 연동으로 곡 검색/재생 즉시 가능
- 세션 정보로 소통 편의성 향상

## 기술 스택
### 프론트엔드
- React (Vite) + TypeScript
- Tailwind CSS (빠른 스타일링)
- React Query (서버 상태 관리)
- Axios (API 통신)

### 백엔드
- Node.js + Express
- Socket.io (실시간 동기화)
- node-cron (방 만료 처리)
- bcrypt (비밀번호 해시)
- express-rate-limit (Rate limiting, 선택)

### 데이터베이스
- MongoDB (빠른 개발, 스키마 유연성)
- Mongoose (ODM)

### 유튜브 연동
- YouTube Data API v3 (검색)
- YouTube IFrame Player API (임베드 재생)

### 호스팅
- 프론트: Vercel (무료, 자동 배포)
- 백엔드: Railway 또는 Render (무료 티어)
- DB: MongoDB Atlas (무료 티어, 512MB)

## 데이터베이스 스키마
### Jam (방)
```javascript
{
  jamId: String (unique, 6자리 영문+숫자),
  name: String,
  description: String (optional),
  createdAt: Date,
  expireAt: Date
}
```

### User (사용자)
```javascript
{
  jamId: String (FK),
  name: String,
  normalizedName: String (소문자 변환, 공백 제거 - 중복 체크용),
  passwordHash: String (optional, bcrypt),
  sessions: [String], // ['보컬', '기타']
  createdAt: Date
}
```

### Song (곡)
```javascript
{
  songId: String (unique),
  jamId: String (FK),
  proposerName: String,
  youtubeUrl: String,
  title: String,
  artist: String,
  duration: String,
  genre: String (optional),
  requiredSessions: [String], // ['보컬', '기타', '베이스']
  sessionDifficulties: Object, // { '보컬': 3, '기타': 4 }
  allowEditByOthers: Boolean (default: true),
  createdAt: Date
}
```

### Vote (투표)
```javascript
{
  voteId: String (unique),
  songId: String (FK),
  userName: String,
  type: String, // 'like' | 'impossible'
  reason: String (optional, 불가능 투표 시),
  createdAt: Date
}
// Unique Index: (songId, userName) - 한 곡에 한 번만 투표
```

### Comment (댓글)
```javascript
{
  commentId: String (unique),
  songId: String (FK),
  writerName: String,
  sessionInfo: [String],
  content: String,
  createdAt: Date
}
```

### Feedback (피드백)
```javascript
{
  feedbackId: String (unique),
  jamId: String (optional),
  userName: String (optional),
  content: String,
  rating: Number (1-5, optional),
  createdAt: Date
}
```

### Cascade 삭제 규칙
- Jam 삭제 시: 해당 jamId의 User, Song, Vote, Comment 모두 삭제
- Song 삭제 시: 해당 songId의 Vote, Comment 모두 삭제

## 0. 소통 기능
### 기능
- 모든 화면 우측 하단 말풍선 플로팅 버튼
- 클릭 시 피드백 모달: 전체적인 만족도 별점(1~5), 평가 텍스트, 문의사항
- 개발자 연락처: 이메일 주소 표시
- 데이터는 MongoDB에 저장, 개발자가 직접 확인

### 화면 구성
- 모달에 별점 선택 UI, 텍스트 입력 필드, 전송 버튼
- 개발자 정보: "문의: yunjeongiya@gmail.com"

## 1. 방 생성 & 접속
### 기능
- **방(Jam) 생성**: 
  - 시스템은 항상 고유한 6자리 랜덤 `jamId` (영문+숫자)를 생성합니다.
  - 사용자는 `방 이름`과 `설명`(선택)을 입력할 수 있습니다.
  - 사용자가 `방 이름`을 비워두면, 생성된 `jamId`가 `방 이름`으로 자동 저장됩니다.
- **공유 링크**: `https://jamvote.app/{jamId}` 형식의 링크로 공유합니다.
- **방 유효기한**:
  - 기본값 30일
  - 선택 옵션: 7일/15일/30일/60일/90일
  - 만료 시 자동 삭제 (매일 새벽 1시 크론 잡 실행)
- **접속**: `jamId`가 포함된 링크로 접속하거나, 메인 화면에서 `jamId`를 입력하여 접속합니다.
- 존재하지 않는 방 접속 시 "존재하지 않는 방입니다" 알림

### 화면 구성
- 중앙: 서비스 로고 + 소개 ("밴드 합주곡, 쉽고 빠르게 정하자")
- 하단:
  - 방 ID(`jamId`) 입력 필드 + "접속하기" 버튼
  - 구분선
  - 방 이름 입력 필드 (선택)
  - 방 설명 입력 필드 (선택)
  - 방 유효기한 드롭다운 (7일/15일/30일(기본)/60일/90일)
  - "방 생성하기" 버튼
- 방 생성 시:
  - 생성된 공유 링크(`https://jamvote.app/{jamId}`)가 클립보드에 자동 복사되고 알림 토스트가 표시됩니다.
  - 생성된 링크와 복사 버튼이 화면에 표시됩니다.

## 2. 방 가입 & 로그인
### 기능
- 프로필 정보: 이름, 비밀번호(선택), 세션(선택, 복수 선택 가능)
- 세션 종류: 보컬, 기타, 베이스, 드럼, 키보드, 기타(직접입력)
- 이름 중복 체크:
  - 방 내 유니크 (normalizedName 기준: 소문자 변환 + 공백 제거)
  - "김철수" vs "김철수" → 중복 ❌
  - "John" vs "john" → 중복 ❌ (영문 이름 배려)
  - " 김철수 " vs "김철수" → 중복 ❌ (공백 무시)
  - 중복 시 "이미 사용 중인 이름입니다" 알림
- 비밀번호:
  - 미설정 시 이름만으로 재입장 가능 (편의성 우선)
  - 설정 시 bcrypt 해시 저장
- 로그인 상태는 localStorage에 방 아이디별로 저장 (브라우저 종료 시에도 유지)
  ```javascript
  // localStorage 구조 예시
  {
    "jam_abc123": { userName: "김철수", sessions: ["보컬"] },
    "jam_def456": { userName: "John", sessions: ["기타", "베이스"] }
  }
  ```

### 화면 구성
#### 로그인 화면
- 중앙: 서비스 로고
- 하단:
  - 이름 입력 필드
  - 비밀번호 입력 필드 (선택)
  - "로그인" 버튼
  - "새 프로필 만들기" 버튼 (→ 프로필 생성 화면)

#### 프로필 생성 화면
- 이름 입력 필드
- 비밀번호 입력 필드 (선택, "비밀번호 없이 사용" 체크박스)
- 세션 선택 (체크박스: 보컬, 기타, 베이스, 드럼, 키보드, 직접입력)
- "프로필 생성하고 입장" 버튼

## 3. 방 진행
### 3.1 기능
#### 3.1.1 곡 제안
- 유튜브 검색 API로 곡 검색
- 곡 정보: 제목, 가수, 재생시간, 유튜브 링크, 장르, 필요 세션, 세션별 난이도
- 제목/가수/재생시간은 유튜브 영상 제목/채널명/재생시간으로 자동 입력, 수정 가능
- 장르: 텍스트 입력 (예: 록, 발라드, 재즈 등)
- 필요 세션: 체크박스 (보컬, 기타, 베이스, 드럼, 키보드 등)
- 세션별 난이도: 1~5점 슬라이더 (1=매우 쉬움, 5=매우 어려움), 제안자가 입력
- "다른 사람도 수정 가능" 체크박스 (기본값: 체크됨)
  - 체크 시: 아무나 곡 정보 수정 가능
  - 미체크 시: 제안자만 수정 가능
- AI 자동 판단 기능은 추후 확장 기능으로 보류 (v1에서는 미구현)

#### 3.1.2 곡 투표
- 투표 종류: 좋아요, 불가능
- 투표 규칙:
  - 한 사람이 여러 곡에 투표 가능
  - 한 곡에는 좋아요/불가능 중 하나만 선택 (상호배타적)
  - 투표 변경 가능: 좋아요 → 불가능, 또는 반대로
  - 투표 취소 가능 (같은 버튼 다시 클릭)
- 불가능 투표 시 이유 입력 모달 (선택 사항)
- 기명투표: 이름 + 세션 SVG 아이콘 표시
- DB 제약: (songId, userName) Unique Index로 중복 투표 방지

#### 3.1.3 댓글
- 펼쳐보기 상태에서 댓글 작성 가능
- 댓글 수정/삭제: 작성자만 가능
- 대댓글: v1에서는 미지원

#### 3.1.4 실시간 동기화
- Socket.io로 곡 추가, 투표, 댓글 실시간 반영
  ```javascript
  // 서버 예시
  io.to(jamId).emit('newVote', { songId, userName, type });

  // 클라이언트 예시
  socket.on('newVote', (data) => {
    // UI 업데이트
  });
  ```
- 네트워크 불안정 시:
  - "연결이 끊겼습니다. 재연결 중..." 토스트
- Socket.io 자동 재연결 기능 활용

### 3.2 화면 구성
#### 3.2.1 상단 바
- 좌측: 방 유효기한 디데이 (1일 이하 시 빨간색, 클릭 시 수정 모달)
  - 수정 권한: 아무나 가능
  - 만료 전 알림: 1일 남았을 때 접속 시 알림 토스트
- 중앙: 방 이름
- 우측: 본인 세션 SVG 아이콘 + 이름 (클릭 시 프로필 수정 화면)

#### 3.2.2 프로필 수정
- 비밀번호 재검증 없음 (편의성 우선)
- 이름 수정 (방 내 중복 체크)
- 세션 수정 (복수 선택)

#### 3.2.3 곡 검색 & 리스트
- 최상단: 검색창
  - 입력 시 현재 리스트 내 곡 먼저 표시 (제목/가수 매칭)
  - 그 아래 유튜브 검색 결과 표시 (썸네일 + 제목 + 채널명)
- 검색 결과 클릭 → 곡 정보 입력 화면

#### 3.2.4 곡 정보 입력 화면
- 맨 위: 제목, 가수, 재생시간 입력 필드 (자동 입력, 수정 가능)
- 유튜브 임베드 (즉시 재생 가능)
- 장르 입력 필드
- 필요 세션 체크박스
- 세션별 난이도 슬라이더 (1~5)
- "다른 사람도 수정 가능" 체크박스 (기본 체크)
- "곡 추가하기" 버튼

#### 3.2.5 곡 리스트
- 정렬: 좋아요 수 내림차순 → 작성일 내림차순
- 각 카드:
  - 좌측: 펼쳐보기 토글 버튼 (▼/▲)
  - 중앙: 곡 제목, 가수, 필요 세션 SVG 아이콘
  - 우측: 좋아요 버튼 (숫자), 불가능 버튼 (숫자)
- 펼쳐보기 시:
  - 장르, 세션별 난이도 표시
  - 유튜브 임베드 (바로 재생 가능)
  - 투표 결과: 좋아요한 사람들 (이름 + 세션 SVG 아이콘)
  - 불가능 투표한 사람들 (이름 + 세션 SVG 아이콘 + 이유)
  - 댓글 리스트 (작성자 이름 + 세션 SVG 아이콘 + 내용 + 작성일)
  - 댓글 입력 필드 + 작성 버튼
  - "수정하기" 버튼 (수정 권한 있을 경우만 표시)

## 4. 방 삭제 & 만료
- 유효기한 지나면 자동 삭제:
  ```javascript
  // node-cron 예시
  cron.schedule('0 1 * * *', async () => { // 매일 새벽 1시
    await Jam.deleteMany({ expireAt: { $lt: new Date() } });
  });
  ```
- Cascade 삭제: Jam 삭제 시 관련 User, Song, Vote, Comment 모두 삭제
- 만료된 방 접속 시: "유효기한이 지난 방입니다" 알림 + 메인 화면으로 이동
- 데이터 백업 기능: v1에서는 미지원

## 5. 보안 가이드
### 기본 보안 조치
- **비밀번호 해시**: bcrypt (saltRounds: 10)
  ```javascript
  const hash = await bcrypt.hash(password, 10);
  ```
- **방 ID 랜덤성**: 6자리 영문+숫자 (무작위 접근 어려움)
- **HTTPS**: Vercel/Railway 자동 제공
- **세션 관리**: localStorage (XSS 위험 있으나 편의성 우선)

### 선택 보안 조치 (Phase 2)
- **Rate limiting**: 투표 API 남용 방지
  ```javascript
  const limiter = rateLimit({
    windowMs: 60000, // 1분
    max: 30 // 최대 30회
  });
  app.use('/api/vote', limiter);
  ```
- **입력값 검증**: express-validator 사용
- **XSS 방어**: React의 기본 escaping 활용

### 보안 vs 편의성 트레이드오프
- ✅ 비밀번호 선택 사항 → 진입장벽 낮춤
- ✅ 비밀번호 없는 프로필 수정 → UX 간소화
- ⚠️ 악의적 사용 가능 → 밴드 멤버 간 사회적 통제로 완화
- ⚠️ 데이터 중요도 낮음 → 합주곡 투표, 개인정보 없음

## 6. UI/UX 가이드
### 반응형
- 모바일 우선 (최소 320px)
- 태블릿/데스크톱에서도 사용 가능하나 모바일 중심 디자인

### 색상 테마 (Dark Mode)
- **배경 (Background)**: `#1A1A1A` (짙은 회색)
- **텍스트 (Text)**: `#F5F5F5` (밝은 회색/흰색)
- **포인트 컬러 (좋아요, 버튼 등)**: `#3B82F6` (선명한 파란색)
- **경고/부정 컬러 (불가능 투표, 유효기한 등)**: `#F87171` (명확한 빨간색)
- **구분선 등 보조 컬러**: `#404040` (중간 회색)

### 모바일 최적화
- **터치 영역**: 버튼/입력란 최소 44x44px
- **폰트 크기**: 한글 16px 이상 (가독성)
- **모달**: Bottom Sheet 스타일 (손가락 닿기 쉬움)
- **입력 필드**: 자동 포커스 최소화 (키보드 자동 팝업 방지)

### 로딩 상태
- API 호출 시 스피너 표시
- 실시간 동기화는 백그라운드 처리 (화면 멈춤 없음)

### 접근성
- 기본 콘트라스트 준수 (WCAG AA)
- 버튼 라벨 한글 우선 (아이콘만 있을 경우 aria-label)

## 7. 개발 우선순위
### Phase 1 (MVP)
1. 방 생성/접속
2. 프로필 생성/로그인
3. 곡 검색/추가 (유튜브 연동)
4. 곡 투표 (좋아요/불가능)
5. 실시간 동기화 (Socket.io)

### Phase 2 (추가 기능)
6. 댓글 기능
7. 프로필 수정
8. 방 유효기한 수정
9. 피드백 모달
10. Rate limiting

### Phase 3 (확장)
11. AI 자동 장르/난이도 판단
12. 데이터 백업/복구
13. 대댓글 지원
