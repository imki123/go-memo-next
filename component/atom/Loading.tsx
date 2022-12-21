import styled from '@emotion/styled'

/**
 * Loading 컴포넌트
 * @params
 */
const Loading = () => {
  return <StyledLoading>로딩중...</StyledLoading>
}

export default Loading

const StyledLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`
