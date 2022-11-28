import styled from '@emotion/styled'
import OpenColor from 'open-color'
import React, { ReactNode, useEffect, useState } from 'react'
import Button from '../component/Button'

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
  const [modalTitle, setTitle] = useState('')
  const [modalText, setText] = useState('')
  const [modalModalButtons, setButtons] = useState<ModalButtonModel[]>()
  const openModal = () => {
    document.body.style.overflow = 'hidden'
    setVisible(true)
  }
  const closeModal = () => {
    document.body.removeAttribute('style')
    setVisible(false)
  }
  const Modal = ({ title, text, buttons }: ModalModel) => {
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
              <TitleDiv>{modalTitle || title}</TitleDiv>
              {text && <TextDiv>{modalText || text}</TextDiv>}
              {(modalModalButtons || buttons) && (
                <ButtonDiv>
                  {(modalModalButtons || buttons)?.map(({ text, onClick }) => (
                    <Button key={text} onClick={onClick}>
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
  }
}

export default useModal

const ModalWrapper = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  text-align: center;
`

const ModalContent = styled.div`
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
    :not(:last-of-type) {
      background: ${OpenColor.gray[8]};
    }
    :not(:first-of-type) {
      margin-left: 20px;
    }
  }
`
