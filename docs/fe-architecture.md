# 도메인 기반 FE 아키텍처

**도메인 중심의 단순·실용 구조**로, 코드 응집도와 유지보수성을 목표로 합니다.

## 목표

- 도메인 중심 구조, 높은 응집도, 낮은 탐색 비용
- 과도한 DI 제거, 테스트 가능한 Service 구조

---

## 디렉터리 구조

```
src/
  app/
    providers/
    App.tsx
  pages/
    routes.ts
  domain/
    user/
      entity.ts
      ports.ts
      repository.ts
      service.ts
      hook.ts
    todo/
      entity.ts
      ports.ts
      repository.ts
      service.ts
      hook.ts
  infra/
    store/                    # 스토어 구현
      create.ts               # zustand create re-export (스토어 생성 설정)
      reservationStore.ts     # 예약 도메인 저장소 구현체 (Zustand)
    http/                     # fetch, axios 등 외부 데이터 접근 (기술 과제에서는 toss http 사용)
    query/                    # query client 구현 (기술 과제에서는 미사용)
  shared/
    ui/
    util/
```

---

## 레이어 역할

| 레이어     | 역할                                                  |
| ---------- | ----------------------------------------------------- |
| **app**    | 라우터, 전역 providers (앱 진입·설정)                 |
| **pages**  | 화면 구성, domain hook 사용                           |
| **domain** | 비즈니스 로직 (entity, service, repository, hook)     |
| **infra**  | 스토어(store/), HTTP, axios, query client, storage 등 |
| **shared** | 여러 도메인 공통 코드                                 |

도메인 관련 코드는 구현(repository)까지 포함해 **domain 폴더에 응집**한다.

---

## 도메인 내부 (entity → service → ports → repository → hook)

- **Entity**: 순수 도메인 규칙 (타입, validation, 계산). Entity는 어디에도 의존하지 않음. 순수 타입·순수 함수로 구성되며 service에서 직접 사용해도 된다.
- **Service**: 도메인 API(Facade). entity 규칙을 적용하고, 구체 구현 대신 ports에 정의된 계약을 통해 repository를 의존한다. class + singleton export로 테스트·실사용 분리.
- **Ports**: service와 repository(및 다른 도메인 모듈) 사이의 중간 레이어. 모듈 간 계약(입출력 규칙)은 `interface`로, 단순 데이터 구조는 `type`으로 정의해 **의존성을 역전**시킨다.
- **Repository**: 개념상 **저장소**. ports에서 정의한 계약을 구현하며, API 호출 후 결과를 저장소에 반영하고, 저장소 구현체(infra의 zustand 스토어 등)를 사용한다. 도메인은 저장소만 알며, store는 모름.
- **Hook**: repository가 노출한 구독 훅 + service 호출. 상태는 repository를 통해 구독.

**의존 방향**: `pages → hook → service → repository → infra/store`. 저장소 구현체는 `infra/store/`에 두고 repository가 사용하며, 도메인 간 계약은 `ports`(interface/type)로 정의한다.

---

## 핵심 규칙

1. Page는 repository 직접 사용 금지
2. Hook은 repository를 통한 상태 구독 + service 호출만
3. Service는 도메인 API 역할
4. Repository는 저장소 역할. API 호출 후 반드시 저장소(infra/store 구현체)에 반영
5. Entity는 순수 유지
6. 도메인 코드는 `domain/` 아래에 응집. 스토어 구현체는 `infra/store/`에만 둠

---

## 요약

```
pages → hook → service → repository → infra/store (저장소 구현체: zustand 등)
                ↑
    repository 가 저장소에 API 결과 반영
                ↑
              entity (의존 없음)
```

- 도메인 중심
- 단순한 레이어
- 높은 응집도
- 테스트 가능한 Service

---

## Next.js Pages Router에서의 적용

이 섹션은 위에서 설명한 일반적인 도메인 기반 FE 아키텍처를 Next.js Pages Router에서 사용할 때의 최소한의 매핑만 정리합니다.

### 디렉터리 매핑

- `src/pages/_app.tsx` → 이 문서의 `app` 레이어 역할(전역 Provider, 공통 레이아웃)
- `src/pages/**/*.tsx` → 이 문서의 `pages` 레이어 역할(각 라우트 화면, 도메인 hook 사용)
- `src/domain/*` / `src/infra/*` / `src/shared/*` → 이 문서의 `domain` / `infra` / `shared` 레이어와 1:1 대응

### 데이터 패칭과 도메인 계층

Next.js Pages Router에서는 다음 정도만 기억하면 충분합니다.

- 서버 사이드 데이터(`getServerSideProps`, `getStaticProps`)는 가능한 한 도메인에서 기대하는 형태로 가공해서 페이지 props로 넘깁니다.
- 클라이언트 사이드 조회/변경은 페이지에서 직접 API를 호출하지 않고, 도메인 hook을 통해 `service → repository → infra` 순으로 의존합니다.
- 도메인 레이어는 Next.js의 라우팅/라이프사이클을 모르고, 페이지는 도메인 규칙 세부를 모른 채 hook/service만 사용합니다.
