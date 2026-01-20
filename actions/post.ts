"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

export async function createPost(data: {
    caption: string
    images: string[]
    district?: string
    locationNames?: string[]
    lats?: number[]
    lngs?: number[]
}) {
    const session = await auth()
    if (!session || !session.user?.id) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const post = await prisma.post.create({
            data: {
                caption: data.caption,
                images: data.images,
                district: data.district,
                locationNames: data.locationNames || [],
                lats: data.lats || [],
                lngs: data.lngs || [],
                authorId: session.user.id,
            },
        })
        revalidatePath("/feed")
        return { success: true, post }
    } catch (error) {
        console.error("Error creating post:", error)
        return { success: false, error: "Failed to create post" }
    }
}

export async function getPosts(filter?: { district?: string }) {
    const session = await auth()

    if (!session || !session.user?.id) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const where: Prisma.PostWhereInput = {}
        if (filter?.district) {
            where.district = filter.district
        }

        const posts = await prisma.post.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        })
        return { success: true, posts }
    } catch (error) {
        console.error("Error fetching posts:", error)
        return { success: false, error: "Failed to fetch posts" }
    }
}

export async function addComment(postId: string, content: string) {
    const session = await auth()
    if (!session || !session.user?.id) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: session.user.id,
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        })
        revalidatePath("/feed")
        return { success: true, comment }
    } catch (error) {
        console.error("Error adding comment:", error)
        return { success: false, error: "Failed to add comment" }
    }
}
