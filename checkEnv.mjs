import fs from 'fs'
import path from 'path'

import { parse } from 'dotenv'

const envFilePath = path.resolve(process.cwd(), '.env.production.local')

if (fs.existsSync(envFilePath)) {
  const envConfig = parse(fs.readFileSync(envFilePath))

  const requiredEnvVars = ['NEXT_PUBLIC_BE_URL', 'NEXT_PUBLIC_GOOGLE_CLIENT_ID']
  const missingEnvVars = requiredEnvVars.filter((envVar) => !envConfig[envVar])

  if (missingEnvVars.length > 0) {
    console.error(
      `[checkEnv] 🛑 Missing environment variables: ${missingEnvVars.join(
        ', '
      )}\n`
    )
    process.exit(1)
  } else {
    console.info(
      '[checkEnv] 🙌 All required environment variables are present.\n'
    )
  }
} else {
  console.error(`[checkEnv] 🛑 Environment file not found at ${envFilePath}\n`)
  process.exit(1)
}
