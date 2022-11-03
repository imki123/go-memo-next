import styled from '@emotion/styled'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useRouter } from 'next/router'

interface HeaderModel {
  title?: string | number
  backButton?: boolean
}
export default function Header({ title, backButton = true }: HeaderModel) {
  const router = useRouter()
  return (
    <HeaderWrapper>
      <HeaderFixed>
        <LeftItems>
          {backButton && (
            <StyledArrowBackIosNewIcon
              fontSize='inherit'
              onClick={router.back}
            />
          )}
          {title}
        </LeftItems>
      </HeaderFixed>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.div`
  height: 40px;
`
const HeaderFixed = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-weight: bold;
`
const LeftItems = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const StyledArrowBackIosNewIcon = styled(ArrowBackIosNewIcon)`
  :hover {
    cursor: pointer;
  }
`
