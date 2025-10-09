export default function Splash({ visible }: { visible?: boolean }) {
  return (
    <div 
      className={`fixed top-0 left-0 w-screen h-full flex justify-center items-center bg-blue-200 dark:bg-gray-700 text-xl transition-opacity duration-300 z-[9999] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      잔짜잔! 고영이 메모장🐈
    </div>
  )
}
