# JamVote 프로젝트

## 프로젝트 개요
밴드 합주곡 선정을 위한 투표 및 협업 도구

## 기술 스택
- **Frontend**: Next.js 15.5.2 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Storage**: LocalStorage (브라우저 기반)
- **Package Manager**: npm

## 주요 기능
1. **곡 제안**: 사용자가 곡 제목, 아티스트, YouTube URL을 입력하여 새로운 곡 제안
2. **투표 시스템**: 각 곡에 대해 찬성/반대 투표 (사용자별 중복 방지)
3. **YouTube 임베드**: 제안된 곡을 바로 들을 수 있는 플레이어
4. **코멘트**: 각 곡에 대한 의견 공유
5. **자동 정렬**: 투표 수 기준 내림차순 정렬

## 프로젝트 구조
```
jamvote/
├── app/
│   ├── page.tsx          # 메인 페이지 (모든 기능 통합)
│   ├── layout.tsx        # 레이아웃
│   └── globals.css       # 전역 스타일
├── public/              # 정적 파일
├── package.json         # 프로젝트 설정
└── tailwind.config.ts   # Tailwind 설정
```

## 개발 서버 실행
```bash
cd jamvote
npm run dev
```
http://localhost:3000 에서 확인

## 데이터 구조

### Song 인터페이스
```typescript
interface Song {
  id: string           // 고유 ID
  title: string        // 곡 제목
  artist: string       // 아티스트
  youtubeUrl?: string  // YouTube URL (선택)
  votes: number        // 투표 수
  votedBy: string[]    // 투표한 사용자 목록
  comments: Comment[]  // 댓글 목록
  suggestedBy: string  // 제안자
  createdAt: string    // 생성 시간
}
```

### Comment 인터페이스
```typescript
interface Comment {
  id: string          // 고유 ID
  author: string      // 작성자
  text: string        // 댓글 내용
  createdAt: string   // 작성 시간
}
```

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Management Guidelines
- 단계별로 todo를 작성해서 업무를 진행하고, 단계를 끝마칠때마다 요약 보고를 출력할 것. 모든 단계를 끝마치면 수정했던 모든 파일들과 어떤 로직을 추가했는지 등을 포함한 총 정리 보고를 할 것.
- todo 한 단계를 완료할 때마다 간략 보고를 출력해야 해.

## 통합된 문서화 및 추적 가이드라인

### 1. 기본 원칙
- 모든 대화와 파일을 수정할 때마다, **수정 목적과 수정 내용에 대한 기록**을 남깁니다.
- 모든 기록은 **한글로 작성**하는 것을 원칙으로 합니다.
- 단, 심각한 보안 사항이나 git에 올라가면 안 되는 사항(api key, password 등)들은 문서화하지 않고, 글로만 출력합니다.

### 2. 저장 위치 및 파일 형식
- 모든 작업 기록 파일은 `./docs/daily_work_summary/` 폴더 내에 저장합니다.
- 파일명은 한국 표준시(KST) 기준 작업 날짜를 따라 `YYYY-MM-DD.md` 형식으로 생성합니다. (예: `2025-08-27.md`)
- 한 날짜의 모든 작업 내역은 **해당 날짜의 파일 하나에만 기록**하여 관리합니다.

### 3. 작업 절차 및 내용
- **(사전 확인)** 파일 수정 작업 시작 전, `./docs/daily_work_summary/` 폴더에서 오늘 날짜에 해당하는 파일이 있는지 확인합니다.
    - 파일이 존재하면, 내용을 먼저 읽고 충돌이 발생하지 않도록 주의하며 이어서 기록을 추가합니다.
- **(내용 기록)** 파일 안에는 완료된 작업을 구분하여(chapter별) 다음 내용을 기록합니다.
    - **완료 시각**: 해당 작업이 완료된 시각을 한국 표준시(KST) 기준으로 명시합니다. (예: `21:30 KST`)
    - **수정 목적 및 내용**: 어떤 파일을 왜, 어떻게 수정했는지 구체적으로 서술합니다.
    - **(선택) Git 커밋 로그**: `git log` 확인 시 새로운 커밋이 있다면, 해당 커밋 내역을 요약하여 함께 작성합니다.

### 4. 시간 기준
- 문서에 기록되는 모든 시간은 **한국 표준시(Korean Standard Time)**를 기준으로 하며, 시간 뒤에 **'KST'**를 명시합니다.
- **중요**: 작업 기록 파일명은 반드시 시스템 날짜를 기준으로 생성합니다. 사용자가 언급하는 날짜가 아닌 실제 오늘 날짜를 사용해야 합니다.

## General Guidelines
- package가 없거나 명령어 에러가 나서 다른 방식으로 성공한 경우, 해당 에러를 반복하지 않기 위해 CLAUDE.md에 새롭게 추가해서 수정할 것.

## Windows 환경 명령어 가이드라인
### Bash 명령어 사용 시 주의사항
- **현재 환경**: Windows 11 (WSL 없음)
- **작동하지 않는 명령어**:
  - `del`, `move`, `xcopy` - Windows CMD 명령어지만 Bash에서는 작동하지 않음
  - `/mnt/c/` 경로 - WSL 전용 경로이므로 사용 불가
  - `C:\` Windows 경로 - Bash에서는 `C:/` 형태로 변환 필요
  
### 올바른 명령어 사용법
```bash
# 파일 복사
cp source_file destination_file
cp -r source_folder/ destination_folder/

# 파일 이동
mv old_name new_name

# 파일 삭제
rm file_name
rm -rf folder_name

# 디렉토리 생성
mkdir -p folder_path

# Windows 경로 사용 시
# 잘못된 예: C:\Users\YJL\Desktop
# 올바른 예: C:/Users/YJL/Desktop
```

### Important Instruction Reminders
- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User