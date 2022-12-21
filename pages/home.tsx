import Header from '../component/molecule/Header'
import MemoGridContainer from '../container/home/MemoGridContainer'

export default function HomePage() {
  // state

  return (
    <>
      <Header title='고영이 메모장 🐈' backButton={false} />
      <MemoGridContainer />
    </>
  )
}
