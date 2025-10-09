import { RotateCcw } from 'lucide-react'
import { memo } from 'react'
/**
 * Reload 컴포넌트
 * @params
 */
const Reload = ({
  isReloading,
  onClick,
}: {
  isReloading: boolean
  onClick: () => void
}) => {
  return (
    <RotateCcw 
      onClick={onClick}
      className={`flex items-center justify-center bg-white text-black rounded-full border border-gray-500 opacity-70 w-8 h-8 p-1 ${
        isReloading ? 'animate-spin' : ''
      }`}
    />
  )
}

export default memo(Reload)
