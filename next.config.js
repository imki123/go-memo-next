/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process')

let gitCommitHash = 'unknown'
try {
  gitCommitHash = execSync('git rev-parse HEAD').toString().trim()
} catch (error) {
  console.error('Git commit hash를 가져올 수 없습니다.', error)
}

const buildTime =
  new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) + ' (KST)'

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  basePath: '/go-memo-next',
  images: {
    domains: ['localhost', 'github.githubassets.com', '*'],
    loader: 'akamai',
    path: '.',
  },
  env: {
    NEXT_PUBLIC_GIT_COMMIT_HASH: gitCommitHash,
    NEXT_PUBLIC_BUILD_TIME: buildTime,
  },
}

module.exports = nextConfig
