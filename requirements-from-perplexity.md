아래는 “가볍고 빠른 MVP(최소기능제품)” 개발을 위한 구체적이고 불확실성을 최소화한 요구사항 명세서다.  
모든 내용은 “편의성”을 최우선으로 하였고, 불필요한 보안·디자인은 최소화하였다.

***

### 1. 데이터 구조 / 인증

- **DB 테이블**  
  - Jam(방): jam_id, name, description, created_at, expire_at  
  - User(사용자): jam_id, name, password_hash(Nullable), sessions(JSON array), created_at  
  - Song(곡): song_id, jam_id, proposer_name, youtube_url, title, artist, duration, genre, required_sessions(JSON array), session_difficulties(JSON), allow_edit_by_others(Boolean), created_at  
  - Vote(투표): vote_id, song_id, user_name, type('like'/'impossible'), reason(Nullable), created_at  
  - Comment(댓글): comment_id, song_id, writer_name, session_info, content, created_at  
  - Feedback(문의): feedback_id, jam_id(Nullable), user_name(Nullable), content, rating(Nullable), created_at

- **Jam 만료 로직**  
  - 매일 새벽 1시 Scheduled Job으로 expire_at 지난 Jam 및 관련 데이터 Cascade 삭제

- **비밀번호 인증**  
  - 선택 사항. 세션스토리지/쿠키에 사용자명만 저장(비밀번호 입력 시 bcrypt 1회 해시 후 저장&비교)
  - 동일 Jam에서 name이 중복되면 가입/수정 불가

***

### 2. 기능 명세

#### 2.1 방 생성/입장
- Jam 생성 시: jam_id, 이름(생략시 jam_id 사용), 설명(생략가능), 유효기간(기본 1달, 1~90일 설정 가능)
- 생성 즉시 링크와 jam_id 반환, 클립보드 자동 복사 및 “복사됨” 토스트 알림 표출
- 다른 사용자는 jam_id로 입장 가능

#### 2.2 프로필 생성/로그인
- 최초 입장: 이름(필수, 중복 불가), 비밀번호(선택), 세션(0~n개, 건반/기타/드럼/보컬 등 선택)
- 비밀번호 미입력 시 이름만으로 재입장/수정 가능
- 로그인 시 이름(필수), 비밀번호(설정한 경우 입력 필요)

#### 2.3 곡 제안/검색/입력
- 검색창: 입력 → 기존 곡 중복 확인 → 미중복시 유튜브 빠른 검색(YouTube Data API, 1페이지)
- 검색 결과 클릭 시: 제목/아티스트/재생시간 자동 입력(수정 자유), genre/필요세션/세션난이도는 빈칸 가능
- allow_edit_by_others(Boolean) 기본값 true, 체크 해제시만 본인만 수정 가능

#### 2.4 곡 리스트/투표
- 곡 리스트: 투표수 내림차순 → 작성일 내림차순 정렬
- 각 곡: 펼치기/접기, 영상 임베드, 정보, 필요세션 아이콘, 투표(좋아요/불가능, 본인 표시)
- 좋아요 & 불가능 중복 불가. 투표 결과 본인 선택 상태 표시. 재투표(변경) 가능.
- 불가능 클릭 시: 이유 입력 Prompt(선택사항)
- 댓글: 별도 댓글란(작성자 이름+세션+내용+날짜, 수정/삭제 본인만 가능)

#### 2.5 피드백 제출
- 모든 화면 우측하단 플로팅 말풍선: 클릭 시 Modal에 문의/평가/별점 작성
- 관리자 연락처 표기, 제출시 DB 저장. *후속 이메일/메신저 연동은 MVP 이후*

***

### 3. UI/UX Flow 요약

- Jam 생성 & 입장: 홈화면 → jam_id 입력 or 생성 → 클립보드복사 → 입장
- 프로필: 이름(중복검증)/비번(생략가능)/세션 선택 → 생성 → jam 입장
- 메인: 상단(D-day/방이름/프로필수정) → 중앙(검색창/곡등록/리스트뷰) → 곡개별(임베드/투표/댓글/정보입력)
- 투표/댓글/수정은 실시간 UI 반영(REST or WebSocket Polling, 3초 주기 추천)
- Jam, 곡, 댓글 등 정보 수정은 해당 작성자 또는 allow_edit_by_others=true 시만 허용

***

### 4. 예외/권한처리

- 동일 Jam 내에는 동일 이름 가입 불가(대소문자 구분 X)
- 곡, 댓글, 프로필 입력자/작성자만 수정/삭제 가능(별도 관리자 개입 없음)
- 세션 항목은 프론트에 나열된 값에서 선택, “+직접입력”으로 추가/수정 가능

***

### 5. 기타

- 네트워크 불안시 입력값 임시 저장(프론트 LocalStorage)
- Mobile Web Touch를 우선 고려(버튼/입력란 Large touch area)
- 테마/디자인 최소: 흰 바탕, 메인 컬러 1~2개, 모바일 풀스크린, Bottom Sheet Modal 사용
- 접근성: 기본 콘트라스트, 한글 16px 이상, 버튼 라벨 한글 우선 표시

***

이 명세서는 불확실성이 최소화된 MVP 개발 기준으로, 빠르게 프로토타이핑 및 실제 서비스 론칭이 가능하도록 설계되었습니다.  
부족한 부분이 있다면 언제든 상세를 추가 요청하실 수 있습니다.