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
      entity.ts (필요시)
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

## 도메인 내부 (entity → service → repository → hook)

- **Entity**: 순수 도메인 규칙 (타입, validation, 계산). Entity는 어디에도 의존하지 않음.
- **Service**: 도메인 API(Facade). repository 호출 + entity 규칙 적용. class + singleton export로 테스트·실사용 분리.
- **Repository**: 개념상 **저장소**. API 호출 후 결과를 저장소에 반영하고, 저장소 구현체(infra의 zustand 스토어 등)를 사용. 도메인은 저장소만 알며, store는 모름.
- **Hook**: repository가 노출한 구독 훅 + service 호출. 상태는 repository를 통해 구독.

**의존 방향**: `pages → hook → service → repository → infra/store`. 저장소 구현체는 `infra/store/`에 두고 repository가 사용.

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
