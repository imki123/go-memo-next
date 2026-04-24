# 코드 품질 체크

코드 변경 후에는 다음 명령어로 코드 품질 체크를 진행합니다.

## 실행 명령어

```bash
pnpm check:all
```

`check:all`은 다음 단계를 순차적으로 실행합니다:

1. **`pnpm prettier`** - 코드 포맷팅
2. **`pnpm lint`** - ESLint 검사 및 자동 수정
3. **`pnpm type`** - TypeScript 타입 검사
4. **`pnpm test`** - 테스트 실행 (현재는 placeholder 상태)

## 단계 설명

| 단계   | 명령어          | 설명                        |
| ------ | --------------- | --------------------------- |
| 포맷팅 | `pnpm prettier` | 코드 스타일 정리            |
| 린트   | `pnpm lint`     | ESLint로 코드 품질 검사     |
| 타입   | `pnpm type`     | TypeScript로 타입 오류 검사 |
| 테스트 | `pnpm test`     | 단위 및 통합 테스트         |

## 기준

- 모든 단계가 통과해야 병합 가능
- 코드 변경 후 기본 검증 명령어는 `pnpm check:all`
- 개발서버와 충돌이 날 수 있어서 `pnpm build` 사용 금지
