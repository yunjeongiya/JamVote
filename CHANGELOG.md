# JamVote 변경 이력

## [2025-10-16] User 스키마 단순화

### 변경 사항

#### 1. User 스키마 변경
**Before:**
```javascript
{
  name: "John",              // 원본 이름
  normalizedName: "john"     // 정규화된 이름 (중복 체크용)
}
```

**After:**
```javascript
{
  name: "John"               // 이름만 저장 (공백 불가)
}
```

#### 2. 중복 체크 방식 변경
**Before:**
- 공백 제거 + 소문자 변환 후 비교
- "John" ≈ "john" ≈ " john " (모두 중복)

**After:**
- 정확히 일치하는 이름만 중복
- "John" ≠ "john" ≠ " john " (모두 다른 사람)
- 공백은 입력 단계에서 차단

### 변경 이유

1. **사용자 혼란 제거**
   - 공백 있는/없는 이름을 같은 사람으로 인식하는 것이 혼란스러움
   - 대소문자가 다른 이름을 같은 사람으로 보는 것이 직관적이지 않음

2. **더 직관적인 UX**
   - 사용자가 입력한 그대로 저장되고 표시됨
   - 예상과 다르게 동작하는 경우가 없음

3. **코드 단순화**
   - DB 필드 1개 감소
   - 정규화 로직 제거
   - 유지보수 용이

### 영향받는 파일

#### 백엔드
- `backend/src/models/User.js` - normalizedName 필드 제거
- `backend/src/controllers/userController.js` - 중복 체크 로직 단순화
- `backend/src/routes/user.js` - 공백 검증 추가
- `backend/src/utils/normalize.js` - 삭제 (더 이상 불필요)

#### 프론트엔드
- `frontend/src/utils/normalize.ts` - 삭제
- 모든 입력 필드 - 공백 자동 제거 (trim)

### 구현 상세

#### User 모델
```javascript
// normalizedName 필드 제거
// 인덱스 변경: { jamId: 1, normalizedName: 1 } → { jamId: 1, name: 1 }
userSchema.index({ jamId: 1, name: 1 }, { unique: true });
```

#### 프론트엔드 입력 검증
```javascript
// 이름 입력 시 공백 자동 제거
const handleNameChange = (e) => {
  const value = e.target.value.replace(/\s/g, ''); // 모든 공백 제거
  setName(value);
};
```

#### 백엔드 검증
```javascript
// express-validator 규칙 강화
body('name')
  .trim()
  .notEmpty()
  .matches(/^\S+$/) // 공백 없는 문자만 허용
  .withMessage('이름에 공백을 포함할 수 없습니다')
```

#### 중복 체크
```javascript
// 단순 일치 검사
const existingUser = await User.findOne({ 
  jamId, 
  name: name.trim() // 정확히 일치
});
```

### 마이그레이션

기존 데이터베이스에서 normalizedName 필드 제거:
```javascript
// MongoDB Shell
db.users.updateMany(
  {},
  { $unset: { normalizedName: "" } }
);
```

### 테스트 케이스

| 입력 1 | 입력 2 | Before | After |
|--------|--------|--------|-------|
| "John" | "john" | ❌ 중복 | ✅ 허용 |
| "John" | " John " | ❌ 중복 | ❌ 차단 (공백) |
| "김철수" | "김철수" | ❌ 중복 | ❌ 중복 |
| "김 철수" | "김철수" | ❌ 중복 | ❌ 차단 (공백) |

### 호환성

- ⚠️ **Breaking Change**: 기존 DB 데이터 마이그레이션 필요
- ✅ API 엔드포인트 변경 없음
- ✅ 프론트엔드 타입 변경 없음

---

**작성일**: 2025-10-16  
**작성자**: Development Team
