'use client'

import { Button } from "@/component/ui/button";
import { Card, CardContent, CardHeader } from "@/component/ui/card"
import { CreateTrip } from "@/lib/actions/create-trip";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useTransition } from "react";
export default function NewTrip() {
    const [isPending, startTranstion] = useTransition();
    const [imgUrl, setimgURL] = useState<string | null>(null);
    return (
        <div className="max-w-lg mx-auto mt-10">
            <Card>
                <CardHeader>New Trip</CardHeader>
                <CardContent>
                    <form className="space-y-8" action={(formData: FormData) => {
                        if (imgUrl) {
                            formData.append("imgUrl", imgUrl);
                        }
                        startTranstion(() => {
                            CreateTrip(formData);
                        });
                    }}>
                        <div>
                            <label className="block text-gray-900 font-medium text-sm mb-2">Title</label>
                            <input type="text" placeholder="CXB trip" name='title' className={
                                cn("w-full border border-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl px-4 py-2")
                            } required />
                        </div>
                        <div>
                            <label className="block text-gray-900 font-medium text-sm mb-2">Description</label>
                            <textarea placeholder="How was the trip?" name='description' className={
                                cn("w-full border border-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl px-4 py-2")
                            } required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-900 font-medium text-sm mb-2">Start Date</label>
                                <input type="Date" placeholder="05-08-2025" name='start-date' className={
                                    cn("w-full border border-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl px-4 py-2")
                                } />
                            </div>
                            <div>
                                <label className="block text-gray-900 font-medium text-sm mb-2">End Date</label>
                                <input type="Date" placeholder="05-08-2025" name='end-date' className={
                                    cn("w-full border border-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl px-4 py-2")
                                } />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="Trip Image Section" className="text-md text-gray-700">Trip Image</label>
                            {imgUrl &&
                                (

                                    <Image width="400" height="200" src={imgUrl} alt="Trip-image-preview" className="w-full mb-4 rounded-md max-h-48 object-cover" />
                                )}
                            <UploadButton endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    if (res && res[0].ufsUrl) {
                                        setimgURL(res[0].ufsUrl);
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    console.error("Upload Error: ", error)
                                }}
                            />
                        </div>
                        <Button type="submit" disabled={isPending} className="w-full bg-teal-500 hover:bg-teal-700 cursor-pointer">{isPending ? "Creating Trip..." : "Create Trip"}</Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}