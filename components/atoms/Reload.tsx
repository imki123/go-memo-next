import styled from '@emotion/styled'
import ReplayIcon from '@mui/icons-material/Replay'
import React from 'react'
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
  // style
  const StyledReplayIcon = styled(ReplayIcon)`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: black;

    border-radius: 100%;
    border: 1px solid gray;
    opacity: 0.7;
    width: 32px;
    height: 32px;
    padding: 4px;

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
  return <StyledReplayIcon onClick={onClick} />
}

export default React.memo(Reload)
