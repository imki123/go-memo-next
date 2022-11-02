import styled from "@emotion/styled";
import { useRouter } from "next/router";
import Memo from "../../component/Memo";

export default function MemoIdPage() {
    const router = useRouter()
    const { query: { memoId } } = router
    console.log(router)
    return <MemoWrapper><Memo memoId={Number(memoId)} /></MemoWrapper>
}

const MemoWrapper = styled.div`
    height: 100vh;
    padding: 20px;
    border-radius: 20px;;
`