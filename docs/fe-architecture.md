# 도메인 기반 FE 아키텍처

**도메인 중심의 단순·실용 구조**로, 코드 응집도와 유지보수성을 목표로 합니다.

## 목표

- 도메인 중심 구조, 높은 응집도, 낮은 탐색 비용
- 의존성 역전(DIP)으로 테스트 가능한 Service 구조

---

## 디렉터리 구조

```
src/
  app/
    providers/
  pages/
  domain/
    {domain}/
      entity.ts
      port.ts
      service.ts
      hook.ts
      repositories/
        localRepository.ts
        remoteRepository.ts
  infra/
    store/          # zustand 스토어 구현체
    http/           # fetch / axios 등
    query/          # queryClient, queryKeys
  shared/
    ui/
    util/
```

---

## 레이어 역할

| 레이어     | 역할                                                      |
| ---------- | --------------------------------------------------------- |
| **app**    | 라우터, 전역 providers                                    |
| **pages**  | 화면 구성, domain hook만 사용                             |
| **domain** | 비즈니스 로직 (entity, port, service, hook, repositories) |
| **infra**  | zustand store, queryClient, HTTP 클라이언트               |
| **shared** | 여러 도메인 공통 코드                                     |

---

## 도메인 내부 파일 역할

- **entity.ts**: 순수 타입·순수 함수. 외부 의존 없음. 비즈니스 규칙(검증, 계산)만.
- **port.ts**: service ↔ repository 사이의 인터페이스 계약. 의존성 역전(DIP)의 핵심.
- **service.ts**: 도메인 Facade. entity 규칙 적용, port 인터페이스를 통해 repository에 의존. React/스토어 구현체를 직접 알지 않음. `class + singleton` export.
- **repositories/localRepository.ts**: 클라이언트 저장소. zustand store를 읽고 씀.
- **repositories/remoteRepository.ts**: 서버 저장소. API 호출 후 queryClient에 반영.
- **hook.ts**: React 연동 레이어. `useQuery` / `useMutation`으로 서버 상태 관리, zustand로 클라이언트 상태 구독. service와 infra를 조합해 React에 노출.

---

## 상태 관리 전략

| 상태 종류            | 저장소                   | 예시                           |
| -------------------- | ------------------------ | ------------------------------ |
| 서버 데이터          | **tanstack queryClient** | API 응답, DB 데이터            |
| 클라이언트 전용 상태 | **zustand**              | 모달 열림 여부, 로컬 잠금 상태 |

---

## 의존 방향

```
# 도메인 의존성
entity ← service → port ← repositories → infra

# React 의존성
pages → hook → (service, queryClient, zustand store)
```

---

## 핵심 규칙

1. `entity.ts`: 순수 유지. 프레임워크·라이브러리 import 금지.
2. `service.ts`: port 인터페이스에만 의존. React / queryClient / zustand 구현체 직접 import 금지.
3. `hook.ts`: React 연동의 단일 진입점. useQuery/useMutation으로 서버 상태, zustand로 클라이언트 상태 처리.
4. `remoteRepository.ts`: 모든 서버 데이터는 queryClient에서 관리.
5. `localRepository.ts`: 클라이언트 전용 상태는 zustand에서 관리.
6. `pages` / React 컴포넌트: `hook.ts`만 사용. repository / service 직접 import 금지.
7. React 외부 (미들웨어, 유틸, 비React 로직): `service.ts` 직접 사용.

---

## Next.js Pages Router 매핑

- `src/pages/_app.tsx` → `app` 레이어 (전역 Provider, 공통 레이아웃)
- `src/pages/**/*.tsx` → `pages` 레이어
- `src/app/providers/*` → QueryClientProvider 하위 초기화 컴포넌트 (`_app` 루트에서 useQuery 직접 호출 시 SSR 오류 발생)
- `src/domain/*` / `src/infra/*` / `src/shared/*` → 동일
