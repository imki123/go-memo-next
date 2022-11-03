import Header from "../component/Header";
import MemoGrid from "../component/MemoGrid";

export default function HomePage() {
    return <>
        <Header title="고영이 메모장 🐈" backButton={false} />
        <MemoGrid />
    </>
}