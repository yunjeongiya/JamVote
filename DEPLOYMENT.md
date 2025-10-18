# JamVote 배포 가이드

## 📋 배포 전 체크리스트

### 1. 변경사항 커밋
```bash
git status
git add .
git commit -m "feat: UI 개선 및 검색 기능 강화"
git push origin main
```

### 2. 환경변수 설정 확인

#### Backend (.env)
```env
# MongoDB 연결
MONGODB_URI=your_mongodb_atlas_connection_string

# 서버 포트
PORT=5000

# 프론트엔드 URL (CORS)
FRONTEND_URL=https://your-frontend-domain.com

# 공유 링크 베이스 URL
SHARE_LINK_BASE=https://your-frontend-domain.com

# 관리자 API 비밀 키 (필수!)
ADMIN_SECRET_KEY=your_secure_admin_key_here
```

#### Frontend (.env)
```env
# 백엔드 API URL
VITE_API_URL=https://your-backend-domain.com

# YouTube API Key
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

---

## 🚀 배포 옵션

### 옵션 1: Vercel (프론트엔드) + Render (백엔드)

#### 백엔드 배포 (Render)

1. **Render 계정 생성**: https://render.com

2. **새 Web Service 생성**
   - Connect Repository (GitHub 연동)
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node

3. **환경변수 설정**
   - `MONGODB_URI`: MongoDB Atlas 연결 문자열
   - `PORT`: `5000` (Render가 자동으로 PORT 환경변수 제공)
   - `FRONTEND_URL`: Vercel 배포 후 URL (예: `https://jamvote.vercel.app`)
   - `SHARE_LINK_BASE`: 프론트엔드 URL
   - `ADMIN_SECRET_KEY`: 강력한 비밀 키

4. **Deploy 버튼 클릭**

5. **배포된 URL 복사** (예: `https://jamvote-api.onrender.com`)

#### 프론트엔드 배포 (Vercel)

1. **Vercel 계정 생성**: https://vercel.com

2. **프로젝트 Import**
   - GitHub 레포지토리 연결
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **환경변수 설정**
   - `VITE_API_URL`: Render에서 배포한 백엔드 URL
   - `VITE_YOUTUBE_API_KEY`: YouTube API 키

4. **Deploy 버튼 클릭**

5. **Render로 돌아가서 `FRONTEND_URL` 업데이트** (Vercel URL로)

---

### 옵션 2: Railway (풀스택)

1. **Railway 계정 생성**: https://railway.app

2. **프로젝트 생성**
   - New Project → Deploy from GitHub repo
   - 레포지토리 선택

3. **백엔드 서비스 추가**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - 환경변수 설정 (위와 동일)

4. **프론트엔드 서비스 추가**
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -l $PORT`
   - 환경변수 설정

5. **MongoDB Atlas 연결**

---

### 옵션 3: AWS / GCP / Azure

#### EC2 / Compute Engine / VM 인스턴스

```bash
# 1. 서버 접속
ssh user@your-server-ip

# 2. 필수 도구 설치
sudo apt update
sudo apt install -y nodejs npm nginx

# 3. 프로젝트 클론
git clone https://github.com/yunjeongiya/jamvote.git
cd jamvote

# 4. 백엔드 설정
cd backend
npm install
npm install -g pm2

# 환경변수 설정
nano .env
# (위의 환경변수 입력)

# PM2로 실행
pm2 start src/server.js --name jamvote-backend
pm2 startup
pm2 save

# 5. 프론트엔드 빌드
cd ../frontend
npm install
npm run build

# 6. Nginx 설정
sudo nano /etc/nginx/sites-available/jamvote

# Nginx 설정 내용:
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/jamvote/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket (Socket.io)
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Nginx 활성화
sudo ln -s /etc/nginx/sites-available/jamvote /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 7. SSL 인증서 (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔧 프로덕션 최적화

### Frontend

1. **빌드 최적화**
   ```bash
   cd frontend
   npm run build
   ```

2. **성능 확인**
   - Lighthouse 점수 확인
   - Bundle 크기 최적화

### Backend

1. **로깅 설정**
   ```javascript
   // backend/src/config/logger.js 생성 권장
   ```

2. **에러 모니터링**
   - Sentry 연동 고려

3. **PM2 클러스터 모드**
   ```bash
   pm2 start src/server.js -i max
   ```

---

## 🗄️ MongoDB Atlas 설정

1. **프로덕션 클러스터 생성**
   - M0 (무료) 또는 M2 이상

2. **네트워크 액세스 설정**
   - IP Whitelist: `0.0.0.0/0` (모든 IP 허용, 프로덕션에서는 서버 IP만 허용 권장)

3. **데이터베이스 사용자 생성**
   - 강력한 비밀번호 사용

4. **연결 문자열 복사**
   - `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/jamvote?retryWrites=true&w=majority`

---

## 📊 모니터링

### 백엔드 헬스체크
```bash
curl https://your-backend-domain.com/health
```

### 관리자 API (청소 작업)
```bash
curl -H "X-Admin-Key: your_secret_key" https://your-backend-domain.com/api/admin/status
```

---

## 🔒 보안 체크리스트

- [ ] `ADMIN_SECRET_KEY` 강력한 비밀번호로 설정
- [ ] MongoDB 사용자 비밀번호 강력하게 설정
- [ ] 프로덕션 환경변수 설정 확인
- [ ] CORS 설정 확인 (`FRONTEND_URL`)
- [ ] SSL 인증서 적용 (HTTPS)
- [ ] MongoDB IP 화이트리스트 제한 (선택)
- [ ] Rate Limiting 확인
- [ ] 환경변수 파일 (.env) Git에 커밋 안 됨 확인

---

## 🎉 배포 완료 후

1. **테스트**
   - 방 생성
   - 곡 추가
   - 투표
   - 댓글
   - 실시간 동기화

2. **피드백 수집**
   - 피드백 모달로 사용자 의견 수집

3. **모니터링**
   - 에러 로그 확인
   - 성능 모니터링

---

## 🆘 트러블슈팅

### CORS 에러
- `FRONTEND_URL` 환경변수 확인
- 프로토콜(http/https) 확인

### WebSocket 연결 실패
- Nginx 프록시 설정 확인
- Socket.io 경로 확인

### MongoDB 연결 실패
- 연결 문자열 확인
- IP 화이트리스트 확인
- 네트워크 연결 확인

### YouTube API 할당량 초과
- API 키 확인
- 할당량 증가 요청 (Google Cloud Console)

---

## 📞 문제 발생 시

- GitHub Issues: https://github.com/yunjeongiya/jamvote/issues
- 이메일: yunjeongiya@gmail.com

---

**Good Luck! 🚀**

