import styled from '@emotion/styled'
import OpenColor from 'open-color'
import React, { useState } from 'react'

export interface ModalButtonModel {
  text: string
  onClick: () => void
}

export interface ModalModel {
  title: string
  text?: string
  buttons?: ModalButtonModel[]
}

const useModal = () => {
  const [visible, setVisible] = useState(false)
  const openModal = () => {
    setVisible(true)
  }
  const closeModal = () => {
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
            <ModalContent>
              <TitleDiv>{title}</TitleDiv>
              <TextDiv>{text || `  `}</TextDiv>
              <ButtonDiv>
                {React.Children.toArray(
                  buttons?.map(({ text, onClick }) => (
                    <button onClick={onClick}>{text}</button>
                  ))
                )}
              </ButtonDiv>
            </ModalContent>
          </ModalWrapper>
        )}
      </>
    )
  }
  return {
    openModal,
    closeModal,
    Modal,
  }
}

export default useModal

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
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
`

const TextDiv = styled.div`
  margin-top: 8px;
`

const ButtonDiv = styled.div`
  margin-top: 30px;
  font-size: 12px;
  button {
    font: inherit;
    border-radius: 8px;
    color: white;
    border: 0;
    padding: 8px 8px;
    :not(:last-of-type) {
      background: ${OpenColor.gray[8]};
    }
    :not(:first-of-type) {
      background: blue;
      margin-left: 20px;
    }
  }
`
