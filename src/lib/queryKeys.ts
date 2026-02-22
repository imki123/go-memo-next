const memoKeys = {
  all: ['memo'] as const,
  list: () => [...memoKeys.all, 'list'] as const,
  detail: (memoId: number) => [...memoKeys.all, 'detail', memoId] as const,
}

const userKeys = {
  all: ['user'] as const,
  checkLogin: () => [...userKeys.all, 'checkLogin'] as const,
}

export const queryKeys = {
  memoKeys,
  userKeys,
}
