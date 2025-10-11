import { RotateCw } from 'lucide-react'
/**
 * Reload 컴포넌트
 * @params
 */
const ReloadButton = ({
  isReloading,
  onClick,
}: {
  isReloading: boolean
  onClick: () => void
}) => {
  return (
    <RotateCw
      onClick={onClick}
      className={`flex items-center justify-center bg-white text-black rounded-full border border-gray-500 opacity-70 w-8 h-8 p-1 cursor-pointer hover:bg-gray-200 ${
        isReloading ? 'animate-spin' : ''
      }`}
    />
  )
}

export default ReloadButton
