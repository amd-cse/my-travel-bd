
import { auth } from "@/auth"
import { getPosts } from "@/actions/post"
import CreatePost from "@/component/feed/CreatePost"
import PostCard from "@/component/feed/PostCard"
import FeedFilter from "@/component/feed/FeedFilter"
import { redirect } from "next/navigation"

export default async function FeedPage({ searchParams }: { searchParams: { district?: string } }) {
    const session = await auth()
    if (!session || !session.user) {
        redirect("/api/auth/signin?callbackUrl=/feed")
    }
    const sp = await searchParams;

    interface Comment {
        id: string
        content: string
        createdAt: Date
        author: {
            name: string | null
            image: string | null
        }
    }

    interface Post {
        id: string
        caption: string
        images: string[]
        district: string | null
        locationName: string | null
        lat: number | null
        lng: number | null
        createdAt: Date
        author: {
            name: string | null
            image: string | null
        }
        comments: Comment[]
    }

    // Await the searchParams to get the district
    const { posts } = await getPosts({ district: sp.district })

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Travel Feed</h1>
                    <p className="text-gray-500">Discover where others are traveling</p>
                </header>

                <FeedFilter />
                <CreatePost />

                <div className="space-y-6">
                    {posts && posts.length > 0 ? (
                        posts.map((post: Post) => (
                            <PostCard key={post.id} post={post} currentUserId={session.user?.id || ""} />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No posts yet. Be the first to share utilizing the button above!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
