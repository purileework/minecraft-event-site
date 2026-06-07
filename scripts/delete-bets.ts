import { config } from 'dotenv'
config({ path: '.env.local' })

async function main() {
    const { db } = await import('../db')
    const { bets } = await import('../db/schema')

    const deleted = await db.delete(bets).returning({ id: bets.id })
    console.log(`Deleted ${deleted.length} bets.`)
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Delete failed:', err)
        process.exit(1)
    })
