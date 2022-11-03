import styled from '@emotion/styled';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function Header() {
    return (<HeaderWrapper>
        <HeaderFixed>
            <div>
                <ArrowBackIosNewIcon />
                타이틀
            </div>
        </HeaderFixed>
    </HeaderWrapper>)
}

const HeaderWrapper = styled.div`
    height: 40px;
`
const HeaderFixed = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px;
    
`