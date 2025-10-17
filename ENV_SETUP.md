# 환경 변수 설정 가이드

## 프론트엔드 (.env.local)

`frontend/.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# API 서버 URL
VITE_API_URL=http://localhost:5000

# YouTube Data API 키
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

## 백엔드 (.env)

`backend/.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# 서버 포트
PORT=5000

# MongoDB 연결 문자열
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jamvote?retryWrites=true&w=majority

# YouTube Data API 키
YOUTUBE_API_KEY=your_youtube_api_key_here

# 프론트엔드 URL (CORS 설정용)
FRONTEND_URL=http://localhost:5173

# 환경 (development | production)
NODE_ENV=development

# 관리자 API 비밀 키 (선택, 프로덕션에서 필수)
ADMIN_SECRET_KEY=your_secure_admin_key_here
```

## YouTube API 키 발급 방법

1. https://console.cloud.google.com/ 접속
2. 새 프로젝트 생성 (또는 기존 프로젝트 선택)
3. "API 및 서비스" > "라이브러리" 메뉴로 이동
4. "YouTube Data API v3" 검색 후 활성화
5. "사용자 인증 정보" > "사용자 인증 정보 만들기" > "API 키" 선택
6. 생성된 API 키를 복사하여 위 환경 변수에 입력

## MongoDB Atlas 설정 방법

1. https://www.mongodb.com/cloud/atlas 접속 후 무료 계정 생성
2. "Create a New Cluster" 클릭
3. 무료 티어(M0) 선택 후 클러스터 생성
4. "Database Access" 메뉴에서 데이터베이스 사용자 생성
5. "Network Access" 메뉴에서 IP 주소 허용 (0.0.0.0/0 - 모든 IP 허용)
6. "Clusters" 메뉴에서 "Connect" 클릭
7. "Connect your application" 선택
8. 연결 문자열 복사하여 위 MONGODB_URI에 입력
   - `<password>`를 실제 비밀번호로 교체
   - `jamvote`를 데이터베이스 이름으로 설정

## 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 이미 포함되어 있습니다
- API 키와 데이터베이스 연결 문자열은 외부에 노출되지 않도록 주의하세요

