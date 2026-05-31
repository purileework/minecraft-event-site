import { config } from 'dotenv'
config({ path: '.env.local' })

console.log('DATABASE_URL is:', process.env.DATABASE_URL)

import { db } from '.'
import { run } from './schema'

async function main() {
    const existing = await db.select().from(run).limit(1)

    if (existing.length > 0) {
        console.log('Run row already exists -- skipping seed.')
        return
    }

    await db.insert(run).values({}) // default values
    console.log('Seeded the run row.')
}

main()
    .catch((err) => {
        console.error('Seed failed:', err)
        process.exit(1)
    })