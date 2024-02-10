import type {Config} from 'drizzle-kit'
import * as dotenv from 'dotenv'

//as nextjs doesn't handle .env outside the root folder just installed dotenv
dotenv.config({
    path: '.env'
})

export default {
    driver: 'pg',
    schema: './src/lib/db/schema.ts',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    }
} satisfies Config