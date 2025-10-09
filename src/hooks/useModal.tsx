import { ComponentProps, ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/zustand/useThemeStore'

export type ModalProps = {
  visible: boolean
  title?: ReactNode
  description?: ReactNode
  buttons?: ComponentProps<typeof Button>[]
  onClose: () => void
}

function useModal() {
  const [visible, setVisible] = useState(false)
  const { theme } = useThemeStore()

  function openModal() {
    document.body.style.overflow = 'hidden'
    setVisible(true)
  }

  function closeModal() {
    document.body.removeAttribute('style')
    setVisible(false)
  }

  function Modal({
    visible,
    title,
    description,
    buttons,
    onClose,
  }: ModalProps) {
    const ModalContent = () => (
      <>
        {visible && (
          <div
            className='fixed z-[999] top-0 left-0 h-screen w-screen flex justify-center items-center text-center bg-black bg-opacity-60 transition-all duration-300 ease-in-out'
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            <div
              className={`flex flex-col justify-center items-center w-[80%] max-w-[400px] max-h-[80%] min-h-[120px] rounded-[20px] p-5 shadow-[0px_0px_4px_1px_rgba(0,0,0,0.5)] ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {title && <div className='font-bold break-all'>{title}</div>}

              {description && <div className='break-all'>{description}</div>}

              {buttons && (
                <div className='flex justify-center items-center gap-3 mt-[30px]'>
                  {buttons?.map(({ children, onClick }, i) => (
                    <Button key={i} onClick={onClick} className='text-sm'>
                      {children}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )

    if (typeof window !== 'undefined') {
      return createPortal(<ModalContent />, document.body)
    } else {
      return null
    }
  }

  useEffect(() => {
    return () => {
      closeModal()
    }
  }, [])

  return {
    openModal,
    closeModal,
    Modal,
    visible,
  }
}

export default useModal
