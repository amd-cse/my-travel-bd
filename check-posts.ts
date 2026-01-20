
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const posts = await prisma.post.findMany({
        take: 5,
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            caption: true,
            images: true,
            locationNames: true,
            createdAt: true
        }
    })

    console.log("Latest 5 posts:")
    posts.forEach(post => {
        console.log(`ID: ${post.id}`)
        console.log(`Caption: ${post.caption}`)
        console.log(`Images (${post.images.length}):`, post.images)
        console.log(`Locations:`, post.locationNames)
        console.log('---')
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
