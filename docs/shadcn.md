# shadcn/ui 컴포넌트 추가 방법

이 프로젝트에서는 [shadcn/ui](https://ui.shadcn.com/) 컴포넌트를 **프로젝트에 코드를 복사하는 방식**으로 사용합니다.

---

## 사전 요구 사항

- **Tailwind CSS** 설정 완료
- **`src/shared/util/util.ts`**에 `cn()` 유틸리티 존재 (clsx + tailwind-merge)
- shadcn **초기화** 한 번 실행 완료 (`npx shadcn@latest init`)

---

## UI 컴포넌트 추가하기

### 1. npx로 컴포넌트 추가

```bash
# 단일 컴포넌트 추가
npx shadcn@latest add button

# 여러 컴포넌트 한 번에 추가
npx shadcn@latest add button card input
```

### 2. 생성되는 위치

초기화 시 설정한 경로에 따라 다릅니다. 일반적으로 다음 중 하나입니다.

- `src/components/ui/` (shadcn 기본)
- `src/shared/ui/` (이 프로젝트 공용 UI 경로)

프로젝트 규칙에 맞게 **경로를 `shared/ui`로 맞춰 두었거나**, init 단계에서 components path를 `shared/ui`로 지정했을 수 있습니다.  
생성된 파일이 `components/ui`라면 `shared/ui`로 옮기고 import 경로만 `shared/ui/...`로 수정하면 됩니다.

### 3. 사용 예시

```tsx
import { Button } from 'shared/ui/button';

<Button>기본 버튼</Button>
<Button variant="outline" size="sm">Outline Small</Button>
<Button variant="destructive">삭제</Button>
```

---

## 컴포넌트 목록 확인

추가 가능한 컴포넌트 목록은 공식 문서에서 확인합니다.

- [shadcn/ui Components](https://ui.shadcn.com/docs/components)

---

## 참고

- **npx 사용 시:** `npx shadcn@latest add button` 도 동일하게 사용 가능합니다.
- **초기화를 아직 안 했다면:**  
  `yarn dlx shadcn@latest init` 실행 후 스타일, 테마, 컴포넌트 경로 등을 선택합니다.
- 컴포넌트는 npm 패키지가 아니라 **소스 코드가 프로젝트에 복사**되므로, 필요에 맞게 수정해 사용할 수 있습니다.
