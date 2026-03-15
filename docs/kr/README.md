## go-memo-next

간단하고 가벼운 메모 앱입니다. 브라우저에서 바로 사용할 수 있는 `unrich` 노트 앱을 목표로 합니다.

![image](https://github.com/imki123/go-memo-next/assets/43270441/828aea82-0843-4a69-8612-0cb88be083c5)

---

## 환경 설정

- **런타임**: Node.js 20 (LTS 권장)
- **패키지 매니저**: pnpm

### 의존성 설치

```bash
npm i -g pnpm
pnpm i
```

---

## 프로젝트 실행

### 로컬 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:4000`으로 접속하면 앱을 확인할 수 있습니다.

### 브라우저에서 테스트

- 브라우저에서 `http://localhost:4000`으로 접속합니다.
- TODO: 일부 환경에서 **Sign in** 기능이 아직 정상 동작하지 않습니다.

---

## 빌드 · 배포 · 품질 체크

### 빌드 & 프로덕션 서버

```bash
pnpm build    # 프로덕션 빌드
pnpm start    # 빌드 결과로 프로덕션 서버 실행
```

### 코드 품질 스크립트

- **`pnpm lint`**: ESLint 자동 수정 모드 실행 (`--fix`)
- **`pnpm type`**: 단발성 TypeScript 타입 검사
- **`pnpm test`**: RTL/Jest 기반 테스트 러너 (추후 설정 예정, 현재는 placeholder)
- **`pnpm checkAll`**: lint → type → test 순서로 실행하며, 각 단계 완료 시 콘솔에 진행 상황을 출력

### gh-pages 배포

이 프로젝트는 GitHub Pages(`gh-pages` 브랜치)로 배포합니다.

1. `.env.production.local` 파일에 다음 환경 변수를 추가합니다.
   - `NEXT_PUBLIC_BE_URL`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
2. 아래 명령어를 실행합니다.

```bash
pnpm gh-deploy
```

`gh-deploy` 스크립트는 환경 변수 검사(`checkEnv.mjs`) → 빌드 → `out/` 디렉터리를 서브트리로 분리 → `gh-pages` 브랜치에 force push 하는 과정을 자동으로 수행합니다.

---

## FE 아키텍처 개요

이 프로젝트는 **도메인 기반 FE 아키텍처**를 사용하여, 비즈니스 로직을 도메인 단위로 응집하고 페이지에서는 도메인 훅만 사용하도록 구성했습니다.

### 디렉터리 개요

- `app/`: Next.js 앱 엔트리, 전역 설정
- `pages/`: 화면 라우트 엔트리
- `domain/`: 도메인별 entity, service, repository, hook 등 비즈니스 로직
- `infra/`: HTTP 클라이언트, 상태 저장소(zustand) 등 인프라 구현
- `shared/`: 여러 도메인에서 공통으로 사용하는 유틸, UI 컴포넌트 등

의존 방향은 아래와 같습니다.

```text
pages → hook → service → repository → infra/store
                ↑
              entity (의존 없음)
```

자세한 규칙과 예시는 `docs/fe-architecture.md`를 참고해주세요.

---

## 기타 문서

- **영문 README**: 프로젝트 루트의 `README.md`
- **프론트엔드 아키텍처**: `docs/fe-architecture.md`

