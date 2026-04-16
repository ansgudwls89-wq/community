# my-community

Next.js 기반 커뮤니티 게시판. 카테고리별 글 작성/조회, Tiptap 리치 에디터, Supabase 인증·DB·스토리지를 사용합니다.

## 스택

- **프레임워크:** Next.js 16 (App Router) + React 19
- **언어:** TypeScript 5
- **스타일:** Tailwind CSS 4
- **백엔드:** Supabase (Auth, Postgres, Storage)
- **에디터:** Tiptap 3 (image / table / link / youtube 등 확장 포함)
- **기타:** next-themes (다크모드), sonner (토스트), isomorphic-dompurify / sanitize-html (XSS 방어)

## 로컬 실행

```bash
# 1) 의존성 설치
npm install

# 2) 환경변수 파일 생성 후 실제 값 채우기
cp .env.example .env.local

# 3) 개발 서버 (http://localhost:3000)
npm run dev
```

기타 스크립트:

```bash
npm run lint       # ESLint
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 실행
```

## 환경변수

`.env.local` 에 아래 키가 필요합니다. 값은 Supabase 프로젝트 설정에서 가져옵니다.

| 키 | 용도 | 노출 여부 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 클라이언트 노출 OK |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 익명(public) API 키 | 클라이언트 노출 OK |
| `SUPABASE_SERVICE_ROLE_KEY` | service-role 키, RLS 우회 | **서버 전용 — 절대 클라이언트로 흘리지 말 것** |

`SUPABASE_SERVICE_ROLE_KEY` 는 `/admin` 등 관리자 서버 액션에서만 사용합니다.

## 라우트 맵

| 경로 | 설명 |
| --- | --- |
| `/` | 홈 (최근 글 / 카테고리 진입점) |
| `/login`, `/signup`, `/forgot-password` | 인증 화면 |
| `/auth/*` | Supabase auth 콜백 / 서버 액션 |
| `/s/[category]` | 카테고리 글 목록 |
| `/s/[category]/write` | 글 작성 |
| `/s/[category]/[idx]` | 글 상세 |
| `/s/[category]/[idx]/edit` | 글 수정 |
| `/profile` | 내 프로필 |
| `/profile/[nickname]` | 다른 사용자 프로필 |
| `/search` | 통합 검색 |
| `/admin` | 관리자 콘솔 (서버 측 권한 가드) |

## 디렉토리 구조

```
app/                # Next.js App Router (라우트 + 서버 액션)
  admin/            # 관리자 페이지 + actions.ts
  auth/             # 인증 서버 액션
  s/[category]/     # 카테고리/글 라우트 트리
  profile/          # 프로필
components/         # 공용 React 컴포넌트 (TipTapEditor, WriteForm, CommentSection 등)
utils/
  supabase/         # Supabase 클라이언트(server / client / middleware)
middleware.ts       # 세션 갱신 + 라우트 가드
public/             # 정적 자산
```

## 배포

Vercel 에 연결되어 있으며 `main` 브랜치 push 시 자동 배포됩니다. 환경변수는 Vercel 프로젝트 설정에 동일한 키 이름으로 등록해야 합니다.
