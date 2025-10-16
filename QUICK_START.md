# JamVote 빠른 시작 가이드

## 🎯 방법 1: 프론트엔드 UI만 확인 (바로 가능)

환경 설정 없이 UI만 먼저 확인하기:

```powershell
cd frontend
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

**확인 가능한 것:**
- ✅ 홈 페이지 디자인
- ✅ 입력 폼, 버튼 등 UI 컴포넌트
- ✅ 다크모드 스타일

**작동하지 않는 것:**
- ❌ 방 생성/접속 (백엔드 필요)
- ❌ API 호출

---

## 🚀 방법 2: 전체 기능 테스트 (환경 설정 필요)

### Step 1: MongoDB Atlas 설정 (5분)

1. https://www.mongodb.com/cloud/atlas 접속
2. 무료 계정 생성 (Google 로그인 가능)
3. "Create a Deployment" → "M0 FREE" 선택
4. 리전: Seoul 선택 (또는 가까운 곳)
5. "Create Deployment" 클릭
6. Database User 생성:
   - Username: `jamvote`
   - Password: 자동 생성된 것 복사해두기
7. "Connect" → "Drivers" 선택
8. 연결 문자열 복사 (예: `mongodb+srv://jamvote:<password>@...`)

### Step 2: 환경 변수 설정 (2분)

#### 백엔드 환경 변수
`backend/.env` 파일 생성:
```env
PORT=5000
MONGODB_URI=mongodb+srv://jamvote:여기에비밀번호@cluster0.xxxxx.mongodb.net/jamvote?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
YOUTUBE_API_KEY=임시로비워두기
```

#### 프론트엔드 환경 변수
`frontend/.env.local` 파일 생성:
```env
VITE_API_URL=http://localhost:5000
VITE_YOUTUBE_API_KEY=임시로비워두기
```

**주의:** `<password>` 부분을 실제 비밀번호로 교체하세요!

### Step 3: 백엔드 서버 실행

새 터미널 열고:
```powershell
cd backend
npm run dev
```

**성공 메시지 확인:**
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

### Step 4: 프론트엔드 실행

또 다른 터미널 열고:
```powershell
cd frontend
npm run dev
```

### Step 5: 테스트!

브라우저에서 `http://localhost:5173` 접속

**테스트 시나리오:**
1. ✅ 방 생성 → 공유 링크 복사 확인
2. ✅ 생성된 방 ID로 접속
3. ✅ 프로필 생성 (이름, 세션 선택)
4. ✅ 로그인 후 방 페이지 진입

---

## ⚠️ 문제 해결

### MongoDB 연결 실패
```
Error: connect ECONNREFUSED
```
→ MongoDB Atlas에서 Network Access 설정
→ "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)

### CORS 에러
```
Access to XMLHttpRequest blocked by CORS policy
```
→ 백엔드 `.env`의 `FRONTEND_URL` 확인
→ 프론트엔드 URL과 정확히 일치해야 함

### 포트 충돌
```
Error: listen EADDRINUSE: address already in use
```
→ 다른 프로그램이 5000번 포트 사용 중
→ 백엔드 `.env`에서 `PORT=5001`로 변경
→ 프론트엔드 `.env.local`에서도 `VITE_API_URL=http://localhost:5001`로 변경

---

## 📝 현재 구현된 기능

### ✅ 완료
- 방 생성/접속
- 프로필 생성/로그인
- 세션 선택
- 비밀번호 설정 (선택)
- localStorage 인증 관리

### 🚧 개발 예정
- 곡 검색 (YouTube)
- 곡 투표
- 댓글
- 실시간 동기화

---

## 💡 YouTube API는 나중에

YouTube API 키 없이도 위 기능들은 모두 테스트 가능합니다!
곡 검색 기능 구현할 때 다시 설정하면 됩니다.

