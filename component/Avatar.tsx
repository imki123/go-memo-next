import Image from 'next/image'
import { loginResponse } from '../api/user'
import styled from '@emotion/styled'

const Avatar = ({
  avatar,
  onClick,
}: {
  avatar: loginResponse
  onClick: () => void
}) => {
  return (
    <AvatarWrapper onClick={onClick}>
      <AvatarSpan>{avatar.name}</AvatarSpan>
      <Image src={avatar.picture || ''} width='30' height='30' alt='avatar' />
    </AvatarWrapper>
  )
}

export default Avatar

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    border-radius: 50%;
  }
`
const AvatarSpan = styled.span`
  font-size: 12px;
  margin-right: 8px;
`
