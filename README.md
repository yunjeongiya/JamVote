# 🎸 JamVote

밴드 합주곡 투표 서비스 - 함께 연주할 곡을 민주적으로 선택하세요!

## 📖 소개

JamVote는 밴드나 음악 동호회가 합주할 곡을 함께 정하기 위한 협업 플랫폼입니다.
YouTube 검색으로 곡을 추가하고, 투표와 댓글로 의견을 나누며, 실시간으로 결과를 확인할 수 있습니다.

### 주요 기능

- 🎵 **YouTube 연동**: 곡 검색 및 자동 정보 추출
- 🗳️ **투표 시스템**: 좋아요/불가능 투표 + 이유 작성
- 💬 **댓글 기능**: 곡에 대한 의견 공유
- 🔄 **실시간 동기화**: Socket.io 기반 멀티 유저 동기화
- 👥 **세션 관리**: 보컬, 기타, 베이스, 드럼, 건반 구분
- 📊 **난이도 표시**: 세션별 난이도 (1~5)
- ⏰ **자동 만료**: 설정 기간 후 자동 삭제
- 🔒 **비밀번호**: 선택적 사용자 비밀번호
- 📱 **모바일 최적화**: 반응형 디자인

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18+
- MongoDB
- YouTube Data API v3 키 (선택)

### 설치

```bash
# 프로젝트 클론
git clone https://github.com/your-username/JamVote.git
cd JamVote

# 백엔드 설치
cd backend
npm install

# 프론트엔드 설치
cd ../frontend
npm install
```

### 환경 변수 설정

**backend/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jamvote
FRONTEND_URL=http://localhost:5173
YOUTUBE_API_KEY=your_youtube_api_key_here
NODE_ENV=development
```

**frontend/.env.local**
```env
VITE_API_URL=http://localhost:5000
```

자세한 설정은 `ENV_SETUP.md`를 참고하세요.

### 실행

```bash
# 백엔드 실행 (터미널 1)
cd backend
npm run dev

# 프론트엔드 실행 (터미널 2)
cd frontend
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 📁 프로젝트 구조

```
JamVote/
├── backend/          # Express.js 백엔드
│   ├── src/
│   │   ├── models/      # Mongoose 모델
│   │   ├── controllers/ # API 로직
│   │   ├── routes/      # API 라우트
│   │   ├── middleware/  # 미들웨어
│   │   ├── jobs/        # 크론 잡
│   │   └── config/      # 설정
│   └── package.json
├── frontend/         # React + Vite 프론트엔드
│   ├── src/
│   │   ├── components/  # React 컴포넌트
│   │   ├── pages/       # 페이지
│   │   ├── hooks/       # 커스텀 훅
│   │   ├── api/         # API 클라이언트
│   │   └── utils/       # 유틸리티
│   └── package.json
└── README.md
```

## 🛠️ 기술 스택

### 백엔드
- **Express.js**: 웹 프레임워크
- **MongoDB + Mongoose**: 데이터베이스
- **Socket.io**: 실시간 통신
- **node-cron**: 스케줄링
- **bcrypt**: 비밀번호 해싱
- **express-validator**: 입력 검증
- **express-rate-limit**: 요청 제한

### 프론트엔드
- **React 18**: UI 라이브러리
- **Vite**: 빌드 도구
- **TypeScript**: 타입 안정성
- **React Query**: 데이터 fetching
- **React Router**: 라우팅
- **Tailwind CSS v4**: 스타일링
- **Socket.io-client**: 실시간 통신
- **Axios**: HTTP 클라이언트

## 📚 API 문서

주요 API 엔드포인트:

### 방 (Jam)
- `POST /api/jams` - 방 생성
- `GET /api/jams/:jamId` - 방 정보 조회
- `PATCH /api/jams/:jamId/expiry` - 유효기한 연장

### 사용자 (User)
- `POST /api/users` - 사용자 생성
- `POST /api/users/login` - 로그인
- `PATCH /api/users/:jamId/:userName` - 프로필 수정

### 곡 (Song)
- `POST /api/songs` - 곡 추가
- `GET /api/songs?jamId=xxx` - 곡 목록 조회
- `PATCH /api/songs/:songId` - 곡 수정
- `DELETE /api/songs/:songId` - 곡 삭제

### 투표 (Vote)
- `POST /api/votes` - 투표 생성/변경
- `DELETE /api/votes/:voteId` - 투표 취소
- `GET /api/votes?songId=xxx` - 투표 조회

### 댓글 (Comment)
- `POST /api/comments` - 댓글 작성
- `GET /api/comments?songId=xxx` - 댓글 조회
- `DELETE /api/comments/:commentId` - 댓글 삭제

### YouTube
- `GET /api/youtube/search?q=xxx` - 곡 검색

### 피드백
- `POST /api/feedback` - 피드백 전송

자세한 API 문서는 `DEVELOPMENT_PLAN.md`를 참고하세요.

## 🔒 보안

- **Rate Limiting**: API 요청 제한으로 남용 방지
- **입력 검증**: express-validator로 모든 입력 검증
- **비밀번호 해싱**: bcrypt로 안전하게 저장
- **CORS 설정**: 허용된 도메인만 접근

## 🧪 테스트

```bash
# 백엔드 테스트
cd backend
npm test

# 프론트엔드 테스트
cd frontend
npm test
```

## 📝 개발 문서

- `DEVELOPMENT_PLAN.md` - 전체 개발 계획 및 API 명세
- `PROGRESS.md` - 개발 진행 상황
- `ENV_SETUP.md` - 환경 변수 설정 가이드
- `decisions.md` - 주요 기술 결정 사항
- `CHANGELOG.md` - 변경 이력

## 🤝 기여

기여를 환영합니다! 다음 절차를 따라주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 💬 문의

- 이메일: jamvote@example.com
- GitHub Issues: [https://github.com/your-username/JamVote/issues](https://github.com/your-username/JamVote/issues)

## 🙏 감사의 말

- YouTube Data API
- Socket.io 팀
- React 커뮤니티
- 모든 오픈소스 기여자들

---

**Made with ❤️ for musicians**

