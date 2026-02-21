import { ReactNode } from 'react'

/**
 * FloatingButtonsLayout 컴포넌트
 * // TODO: 엘리먼트 각각에 bottom 을 줄 수 있도록 수정 필요
 * // 이름도 Bottom이 들어가도록 수정 필요
 * @params
 */
function FloatingButtonsLayout({ children }: { children: ReactNode }) {
  return (
    <div className='fixed mx-auto bottom-[30px] right-[30px] max-[800px]:right-[30px] min-[800px]:right-[calc(50%-400px+40px)] min-[800px]:transform min-[800px]:-translate-x-1/2 flex flex-col justify-center items-center gap-5'>
      {children}
    </div>
  )
}

export default FloatingButtonsLayout
