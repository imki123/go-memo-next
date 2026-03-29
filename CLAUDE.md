# CLAUDE.md

## Commands

```bash
pnpm dev       # 개발 서버 (localhost:4000)
pnpm lint      # ESLint --fix
pnpm type      # TypeScript 타입 검사
pnpm checkAll  # lint → type → test 순차 실행
```

## Architecture

도메인 기반 클린 아키텍처. 상세 규칙은 [docs/fe-architecture.md](./docs/fe-architecture.md) 참고.

### 도메인 파일 구조

```
domain/{name}/
  entity.ts              # 순수 타입·함수 (외부 의존 없음)
  port.ts                # 인터페이스 계약 (의존성 역전)
  service.ts             # 도메인 Facade (React/store 모름)
  hook.ts                # React 연동 (useQuery, useMutation, zustand)
  repositories/
    localRepository.ts   # 클라이언트 상태 → zustand
    remoteRepository.ts  # 서버 데이터 → queryClient + API
```

### 핵심 규칙

- React 컴포넌트: `hook.ts`만 사용
- React 외부: `service.ts` 직접 사용
- 서버 데이터: tanstack queryClient 관리
- 클라이언트 전용 상태: zustand 관리
- `pages`에서 repository / service 직접 import 금지
