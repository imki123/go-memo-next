import { execSync } from 'child_process'

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })
const tryRun = (cmd) => { try { run(cmd) } catch {} }

try {
  // 사전 검사
  run('pnpm checkAll')
  run('pnpm checkEnv')
  run('rm -rf node_modules/.cache')

  // 임시 브랜치 정리 (이전 배포 잔여물)
  tryRun('git branch -D temp-for-deploy-gh-pages')

  // 빌드
  run('next build')
  run('touch out/.nojekyll')

  // gh-pages 배포
  run('git add -f out/')
  run('git checkout -b temp-for-deploy-gh-pages')
  run('git commit -m "Deploy Next.js to gh-pages"')
  run('git subtree split --prefix out -b gh-pages')
  run('git push -f origin gh-pages:gh-pages')

} finally {
  // 성공/실패 무관하게 항상 클린업
  tryRun('git branch -D gh-pages')
  tryRun('git checkout main')
  tryRun('git branch -D temp-for-deploy-gh-pages')
}
