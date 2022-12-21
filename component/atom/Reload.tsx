import styled from '@emotion/styled'
import ReplayIcon from '@mui/icons-material/Replay'
import React from 'react'
/**
 * Reload 컴포넌트
 * @params
 */
const Reload = ({ isReloading }: { isReloading: boolean }) => {
  // style
  const StyledReplayIcon = styled.div`
    ${isReloading &&
    `
      @keyframes rotating{
        0%: {
          rotate: 0deg;
        }
        50%: {
          rotate: -180deg;
        }
        100%{
          rotate: -360deg;
        }
      }
      animation: rotating 0.5s linear infinite;
    }
  `}
  `
  return (
    <StyledReplayIcon>
      <ReplayIcon />
    </StyledReplayIcon>
  )
}

export default React.memo(Reload)
