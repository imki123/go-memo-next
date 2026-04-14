# 검증 프로세스

코드 변경 후 검증은 다음 명령어로 진행합니다.

## 검증 명령어

```bash
pnpm checkAll
```

`checkAll`은 다음 단계를 순차 실행합니다:

1. **`pnpm prettier`** - 코드 포맷팅
2. **`pnpm lint`** - ESLint 검사 및 자동 수정
3. **`pnpm type`** - TypeScript 타입 검사
4. **`pnpm test`** - 테스트 실행 (현재는 placeholder 상태)

## 검증 단계 설명

| 단계   | 명령어          | 설명                        |
| ------ | --------------- | --------------------------- |
| 포맷팅 | `pnpm prettier` | 코드 스타일统一             |
| 린트   | `pnpm lint`     | ESLint로 코드 품질 검사     |
| 타입   | `pnpm type`     | TypeScript로 타입 오류 검사 |
| 테스트 | `pnpm test`     | 단위 및 통합 테스트         |

## 검증 기준

- 모든 단계가 통과해야 병합 가능
- 빌드(`pnpm build`)는 검증 단계에 포함되지 않음
  - 빌드는 개발/배포 시 별도로 수행
