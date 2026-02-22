## 도메인 목적

도메인은 같은 비즈니스 영역을 다루는 모듈들을 묶어서 관리하는 단위이다.

## 도메인 domain

- entity.ts: 비즈니스의 규칙, 정책을 정의한다.
- service.ts: 외부 구현체들의 인터페이스를 정의한다. 엔티티와 외부 구현체를 사용하여 비즈니스 행동 로직을 구현한다.
- di.ts: 외부 구현체들을 주입하여 서비스를 생성한다.
- facade.ts: service, query, store 를 조합하여 애플리케이션이 facade 에만 의존하여 사용할 수 있도록 묶어준다.

## 인프라 infra

인프라는 교체가능한 외부 모듈을 도메인 인터페이스에 맞게 구현한 모듈이다. domains/{domain}/di.ts 파일에서 서비스에 주입되어 사용된다.

- infra/query.ts: 리액트 Tanstack Query 를 사용하여 데이터 조회, 캐싱, 캐시 무효화를 구현한다.
- infra/store.ts: 리액트 렌더링 동기화를 위한 store, state 를 구현한다.
- infra/remoteRepository.ts: 쿼리 캐싱을 위해 QueryClient 를 사용하여 외부 데이터 소스를 조회, 저장, 삭제하는 인터페이스를 정의한다.
- infra/localRepository.ts: store 를 사용하여 로컬 데이터 소스에 접근하여 데이터를 조회, 저장, 삭제하는 인터페이스를 정의한다.
