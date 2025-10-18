# 🔧 JamVote 개선 계획서

**작성일**: 2025-10-18
**현재 점수**: 78/100
**목표 점수**: 90/100

---

## 📋 개선 작업 우선순위

### 🔴 Phase 1: Critical Issues (즉시 해결)

#### 1.1 useSocket 메모리 누수 수정 ⚡
**문제**: 의존성 배열에 함수들이 포함되어 매 렌더링마다 소켓 재연결 위험
**파일**: `frontend/src/hooks/useSocket.ts`
**예상 시간**: 30분
**영향도**: 🔴 High (성능 및 안정성)

**개선 내용**:
- useRef로 콜백 함수들 저장
- 의존성 배열에서 함수 제거
- jamId만 의존성으로 유지

#### 1.2 검색 Debouncing 추가 ⚡
**문제**: 타이핑마다 API 호출로 불필요한 네트워크 요청
**파일**: `frontend/src/components/song/SongSearchBar.tsx`
**예상 시간**: 20분
**영향도**: 🟡 Medium (성능)

**개선 내용**:
- useDebounce 훅 생성
- 500ms 딜레이 적용

#### 1.3 JamPage 리팩토링 - Part 1: Custom Hooks 분리 ⚡
**문제**: 642줄의 거대한 컴포넌트, 15개 이상의 상태 관리
**파일**: `frontend/src/pages/JamPage.tsx`
**예상 시간**: 2시간
**영향도**: 🔴 High (유지보수성)

**개선 내용**:
- `useJamState.ts` - 모든 상태 관리
- `useJamHandlers.ts` - 모든 이벤트 핸들러
- `useJamModals.ts` - 모달 상태 관리

#### 1.4 JamPage 리팩토링 - Part 2: 컴포넌트 분리 ⚡
**예상 시간**: 1.5시간

**개선 내용**:
- `JamHeader.tsx` - 헤더 영역 (lines 398-482)
- `JamSearchSection.tsx` - 검색 섹션 (lines 484-542)
- `JamModalsGroup.tsx` - 모든 모달 그룹화 (lines 568-631)

---

### 🟡 Phase 2: High Priority (단기 개선)

#### 2.1 window.confirm을 모달로 교체 🎨
**문제**: 구식 UI, 커스터마이징 불가
**파일**: `frontend/src/components/song/SongCard.tsx:42-44`
**예상 시간**: 40분

**개선 내용**:
- `ConfirmModal.tsx` 컴포넌트 생성
- 재사용 가능한 confirm 훅

#### 2.2 매직 넘버/문자열 상수화 📝
**파일**:
- `frontend/src/api/client.ts:11`
- `frontend/src/constants/config.ts` (신규)
**예상 시간**: 30분

**개선 내용**:
```typescript
// constants/config.ts
export const API_TIMEOUT = 10000;
export const SOCKET_RECONNECT_DELAY = 3000;
export const DEBOUNCE_DELAY = 500;
export const MAX_USERNAME_LENGTH = 20;
```

#### 2.3 에러 핸들링 개선 🛡️
**파일**:
- `frontend/src/components/common/ErrorBoundary.tsx` (신규)
- `backend/src/middleware/errorHandler.js`
**예상 시간**: 1시간

**개선 내용**:
- React Error Boundary 추가
- 백엔드 에러 로깅 체계화
- 사용자 친화적 에러 메시지

#### 2.4 접근성 개선 ♿
**파일**: 모든 인터랙티브 컴포넌트
**예상 시간**: 1.5시간

**개선 내용**:
- ARIA 라벨 추가
- 키보드 네비게이션 (Tab, Enter, Escape)
- focus-visible 스타일링
- 스크린리더 지원

---

### 🟢 Phase 3: Medium Priority (중기 개선)

#### 3.1 Code Splitting 🚀
**예상 시간**: 1시간

**개선 내용**:
```typescript
const JamPage = lazy(() => import('./pages/JamPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
```

#### 3.2 투표 결과 캐시 로직 중복 제거 🧹
**파일**: `frontend/src/pages/JamPage.tsx`
**예상 시간**: 30분

**개선 내용**:
- `invalidateVoteCache` 유틸 함수로 추출
- 중복 코드 제거 (lines 196-202, 217-222)

#### 3.3 이미지 최적화 🖼️
**예상 시간**: 45분

**개선 내용**:
- YouTube 썸네일 크기 파라미터 추가
- Lazy loading 적용
- srcset 고려

---

## 📊 예상 결과

### Before
- **클린 코드**: 70/100
- **성능**: 80/100
- **UI/UX**: 75/100
- **전체**: 78/100

### After (Phase 1-2 완료 시)
- **클린 코드**: 85/100 (+15)
- **성능**: 90/100 (+10)
- **UI/UX**: 85/100 (+10)
- **전체**: 88/100 (+10)

### After (Phase 3 완료 시)
- **전체**: 90/100 (+12)

---

## 🎯 작업 순서

### Day 1 (4시간)
1. ✅ useSocket 메모리 누수 수정 (30분)
2. ✅ 검색 Debouncing 추가 (20분)
3. ✅ 매직 넘버 상수화 (30분)
4. ✅ JamPage 리팩토링 Part 1 - Hooks 분리 (2시간)
5. ✅ window.confirm 모달 교체 (40분)

### Day 2 (3시간)
6. ✅ JamPage 리팩토링 Part 2 - 컴포넌트 분리 (1.5시간)
7. ✅ 에러 핸들링 개선 (1시간)
8. ✅ 투표 캐시 로직 중복 제거 (30분)

### Day 3 (2시간)
9. ✅ 접근성 개선 (1.5시간)
10. ✅ Code Splitting (30분)

---

## 🚫 이번 개선에서 제외된 항목 (추후 고려)

1. **JWT 인증 시스템** - 아키텍처 대대적 변경 필요
2. **테스트 코드 작성** - 별도 프로젝트로 진행
3. **Sentry 통합** - 인프라 설정 필요
4. **이미지 CDN** - 배포 인프라 필요
5. **모바일 네이티브 제스처** - 라이브러리 도입 필요

---

## 📝 변경 이력

- 2025-10-18: 초기 계획서 작성
