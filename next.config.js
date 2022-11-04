/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: '/go-memo-next',
  images:{
    domains: ['localhost', "github.githubassets.com", '*']
  }
}

module.exports = nextConfig
