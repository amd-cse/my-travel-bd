"use client"

import { useState } from "react"
import { addComment } from "@/actions/post"
import Image from "next/image"

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
    locationNames: string[]
    createdAt: Date
    author: {
        name: string | null
        image: string | null
    }
    comments: Comment[]
}

export default function PostCard({ post, currentUserId }: { post: Post, currentUserId: string }) {
    console.log("PostCard rendering post:", post.id, "Images:", post.images);
    const [commentText, setCommentText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!commentText.trim()) return

        setIsSubmitting(true)
        const res = await addComment(post.id, commentText)
        setIsSubmitting(false)

        if (res.success) {
            setCommentText("")
        } else {
            alert("Failed to add comment")
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-100">
            {/* Header */}
            <div className="p-4 flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {post.author.image ? (
                        <Image src={post.author.image} alt={post.author.name || "User"} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 uppercase font-bold">
                            {post.author.name?.[0] || "U"}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.district && (
                            <>
                                <span>•</span>
                                <span className="text-teal-600 font-medium">{post.district}</span>
                            </>
                        )}
                        {post.locationNames && post.locationNames.length > 0 && (
                            <>
                                <span>•</span>
                                <div className="flex flex-wrap gap-1">
                                    {post.locationNames.map((locName, idx) => (
                                        <span key={idx} className="text-teal-600 text-xs px-2 py-0.5 bg-teal-50 rounded-full">
                                            📍 {locName}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-2">
                <p className="text-gray-800 whitespace-pre-wrap">{post.caption}</p>
            </div>

            {/* Images */}
            {/* Images - Dynamic Grid */}
            {post.images.length > 0 && (
                <div className="mt-3">
                    <div className={`grid gap-1 overflow-hidden ${post.images.length === 1 ? 'grid-cols-1' :
                        post.images.length === 2 ? 'grid-cols-2' :
                            post.images.length === 3 ? 'grid-cols-2' :
                                'grid-cols-2'
                        }`}>
                        {post.images.map((img, idx) => {
                            // Logic for irregular grids (like Facebook style)
                            let spanClass = "";
                            let heightClass = "h-64"; // Default height

                            if (post.images.length === 1) {
                                heightClass = "h-auto max-h-[500px] min-h-[300px]";
                            } else if (post.images.length === 3) {
                                if (idx === 0) {
                                    spanClass = "row-span-2 h-full";
                                    heightClass = "h-[400px]";
                                } else {
                                    heightClass = "h-[198px]";
                                }
                            } else if (post.images.length >= 4) {
                                heightClass = "h-48";
                            }

                            return (
                                <div key={idx} className={`relative bg-gray-100 ${spanClass} ${heightClass}`}>
                                    <Image
                                        src={img}
                                        alt={`Post image ${idx + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                                        className="object-cover hover:opacity-95 transition-opacity cursor-pointer"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Footer / Comments */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="mb-4 space-y-3">
                    {post.comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-2 text-sm">
                            <span className="font-semibold text-gray-900 flex-shrink-0">{comment.author.name}:</span>
                            <span className="text-gray-700">{comment.content}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleCommentSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                        type="submit"
                        disabled={!commentText.trim() || isSubmitting}
                        className="px-4 py-2 bg-teal-600 text-white rounded-full text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Post
                    </button>
                </form>
            </div>
        </div>
    )
}
