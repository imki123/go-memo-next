import styled from '@emotion/styled'
import Button, { ButtonTypes } from 'go-storybook/dist/component/atom/Button'
import OpenColor from 'open-color'
import React, { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export interface ModalButtonModel {
  text: string
  onClick: () => void
}

export interface ModalModel {
  title?: ReactNode
  text?: ReactNode
  buttons?: ModalButtonModel[]
}

const useModal = () => {
  const [visible, setVisible] = useState(false)
  const [modalTitle, setTitle] = useState<ReactNode>()
  const [modalText, setText] = useState<ReactNode>()
  const [modalModalButtons, setButtons] = useState<ModalButtonModel[]>()

  const openModal = () => {
    document.body.style.overflow = 'hidden'
    setVisible(true)
  }

  const closeModal = () => {
    document.body.removeAttribute('style')
    setVisible(false)
  }

  const resetModal = () => {
    setTitle(undefined)
    setText(undefined)
    setButtons(undefined)
  }

  const Modal_ = () => {
    return (
      <>
        {visible && (
          <ModalWrapper
            onClick={(e) => {
              e.stopPropagation()
              closeModal()
            }}
          >
            <ModalContent onClick={(e) => e.stopPropagation()}>
              {modalTitle && <TitleDiv>{modalTitle}</TitleDiv>}
              {modalText && <TextDiv>{modalText}</TextDiv>}
              {modalModalButtons && (
                <ButtonDiv>
                  {modalModalButtons?.map(({ text, onClick }, i) => (
                    <Button
                      buttonType={
                        i === 0 ? ButtonTypes.Secondary : ButtonTypes.Primary
                      }
                      key={text}
                      onClick={onClick}
                    >
                      {text}
                    </Button>
                  ))}
                </ButtonDiv>
              )}
            </ModalContent>
          </ModalWrapper>
        )}
      </>
    )
  }

  function Modal() {
    if (typeof window !== 'undefined') {
      return createPortal(<Modal_ />, document.body)
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
    setTitle,
    setText,
    setButtons,
    resetModal,
  }
}

export default useModal

const ModalWrapper = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  transition: 0s 1s background ease; // delay, duration, property, timing-function, behavior
`

const ModalContent = styled.div<{ theme?: 'dark' }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;
  max-width: 400px;
  max-height: 80%;
  min-height: 120px;
  background: white;
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 20px;
  ${({ theme }) => theme === 'dark' && `background: ${OpenColor.gray[9]};`}
`

const TitleDiv = styled.div`
  font-weight: bold;
  word-break: break-all;
`

const TextDiv = styled.div`
  margin-top: 8px;
  word-break: break-all;
`

const ButtonDiv = styled.div`
  margin-top: 30px;
  button {
    :not(:first-of-type) {
      margin-left: 20px;
    }
  }
`
