export type MemoEntity = {
  memoId: number
  text?: string
  createdAt?: string
  editedAt?: string
  fetching?: boolean
}

export const memoEntity = {
  MAX_TEXT_LENGTH: 10000 as const,

  isValidMemoId: (id: number): boolean => id > 0,

  isEmptyText: (text: string | undefined): boolean =>
    !text || text.trim().length === 0,

  truncateText: (text: string, maxLength = 100): string => {
    if (text.length <= maxLength) {
      return text
    }
    return text.slice(0, maxLength) + '...'
  },

  getPreviewText: (text: string | undefined, maxLength = 50): string => {
    if (!text) {
      return ''
    }
    const firstLine = text.split('\n')[0]
    return memoEntity.truncateText(firstLine, maxLength)
  },

  formatDate: (dateString: string | undefined): string => {
    if (!dateString) {
      return ''
    }
    return dateString
  },

  canCreateMemo: (): boolean => true,

  canEditMemo: (_memo: MemoEntity): boolean => true,

  canDeleteMemo: (_memo: MemoEntity): boolean => true,

  isMemoEntity: (value: unknown): value is MemoEntity => {
    if (!value || typeof value !== 'object') {
      return false
    }
    const obj = value as Record<string, unknown>
    return typeof obj.memoId === 'number'
  },
}
