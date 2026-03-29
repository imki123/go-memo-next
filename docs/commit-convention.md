# 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

## 형식

```
<type>(<scope>): <subject>
```

- `scope`: 변경 대상 도메인 또는 레이어 (선택). 예: `lock`, `auth`, `infra`
- `subject`: 명령형, 소문자 시작, 마침표 없음

## 타입

| 타입       | 용도                     |
| ---------- | ------------------------ |
| `feat`     | 새 기능                  |
| `fix`      | 버그 수정                |
| `refactor` | 기능 변경 없는 코드 개선 |
| `docs`     | 문서 변경                |
| `chore`    | 빌드·설정·의존성 등 기타 |
| `test`     | 테스트 추가·수정         |

## 예시

```
feat(lock): 잠금 화면 자동 표시 추가
fix(auth): 로그인 토큰 만료 처리
refactor(lock): centralize lock service hook
docs: fe-architecture 업데이트
chore: pnpm 버전 고정
```
