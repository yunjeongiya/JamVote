# 🧪 JamVote 테스트 가이드

테스트 환경 설정 및 작성 가이드입니다.

---

## 📦 설치

```bash
cd frontend
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

---

## 🚀 실행 명령어

```bash
# 테스트 실행
npm run test

# Watch 모드
npm run test:watch

# UI 모드
npm run test:ui

# 커버리지
npm run test:coverage
```

---

## 📁 파일 구조

```
frontend/src/
├── components/
│   └── common/
│       ├── Button.tsx
│       └── __tests__/
│           └── Button.test.tsx
├── hooks/
│   ├── useDebounce.ts
│   └── __tests__/
│       └── useDebounce.test.ts
└── test/
    └── setup.ts (테스트 설정)
```

---

## ✅ 작성된 테스트

### 1. useDebounce 훅 테스트
**파일**: `src/hooks/__tests__/useDebounce.test.ts`

**커버리지**:
- ✅ 초기값 즉시 반환
- ✅ 값 변경 debounce
- ✅ 기본 delay 사용
- ✅ 빠른 변경 시 마지막 값만
- ✅ 다양한 타입 지원 (number, object)

### 2. Button 컴포넌트 테스트
**파일**: `src/components/common/__tests__/Button.test.tsx`

**커버리지**:
- ✅ children 렌더링
- ✅ click 이벤트
- ✅ disabled 상태
- ✅ variant 스타일 (primary, secondary, danger, ghost)
- ✅ size 스타일 (sm, md, lg)
- ✅ fullWidth prop
- ✅ 접근성 (ARIA, type)
- ✅ 키보드 접근성
- ✅ focus-visible

### 3. ErrorBoundary 컴포넌트 테스트
**파일**: `src/components/common/__tests__/ErrorBoundary.test.tsx`

**커버리지**:
- ✅ 정상 children 렌더링
- ✅ 에러 발생 시 UI
- ✅ 개발 모드 에러 상세
- ✅ 재시도 버튼
- ✅ 홈 버튼
- ✅ 커스텀 fallback
- ✅ componentDidCatch 로깅

---

## 📝 테스트 작성 예시

### Hook 테스트
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useMyHook('initial'));
    expect(result.current).toBe('initial');
  });

  it('should update value', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useMyHook(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });
});
```

### Component 테스트
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render text', () => {
    render(<MyComponent text="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle click', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<MyComponent onClick={handleClick} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🎯 테스트 전략

### 무엇을 테스트할까?

#### ✅ 테스트해야 할 것
1. **Public API**: Props, 반환값
2. **사용자 상호작용**: Click, input
3. **접근성**: ARIA, 키보드
4. **Edge cases**: 빈 값, 에러
5. **비즈니스 로직**: 계산, 변환

#### ❌ 테스트하지 말아야 할 것
1. **구현 세부사항**: 내부 state 이름
2. **외부 라이브러리**: React Query, Axios
3. **스타일**: className (시각적 테스트)
4. **타입**: TypeScript가 보장

---

## 📚 유용한 패턴

### 1. AAA 패턴
```typescript
it('should update count on click', async () => {
  // Arrange (준비)
  const user = userEvent.setup();
  render(<Counter />);

  // Act (실행)
  await user.click(screen.getByText('Increment'));

  // Assert (검증)
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 2. Custom Render
```typescript
// test/utils.tsx
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
}
```

### 3. Mock Functions
```typescript
import { vi } from 'vitest';

const mockFn = vi.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue({ data: [] });

expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith('arg');
```

### 4. Async 테스트
```typescript
// waitFor 사용
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// findBy 사용 (권장)
expect(await screen.findByText('Loaded')).toBeInTheDocument();
```

---

## 🔧 package.json 스크립트

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 📊 커버리지 목표

| 타입 | 목표 | 현재 |
|------|------|------|
| **Statements** | 80% | TBD |
| **Branches** | 75% | TBD |
| **Functions** | 80% | TBD |
| **Lines** | 80% | TBD |

---

## 🚨 주의사항

### 1. 비동기 작업
```typescript
// ❌ 나쁜 예
it('should load data', () => {
  render(<DataComponent />);
  expect(screen.getByText('Data')).toBeInTheDocument(); // 실패!
});

// ✅ 좋은 예
it('should load data', async () => {
  render(<DataComponent />);
  expect(await screen.findByText('Data')).toBeInTheDocument();
});
```

### 2. Timer Mock
```typescript
import { vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('should debounce', () => {
  // ...
  vi.advanceTimersByTime(500);
  // ...
});
```

### 3. Cleanup
```typescript
// setup.ts에서 자동으로 처리됨
afterEach(() => {
  cleanup();
});
```

---

## 🎓 추가 학습 자료

- [Vitest 공식 문서](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 📝 다음 테스트 작성 대상

1. ⚪ `useConfirm` 훅
2. ⚪ `ConfirmModal` 컴포넌트
3. ⚪ `Input` 컴포넌트
4. ⚪ `useJamState` 훅
5. ⚪ `useVoteCache` 훅

---

**테스트는 선택이 아닌 필수입니다!** 🧪✨
