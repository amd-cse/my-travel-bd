'use server'

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export async function CreateTrip(formData: FormData) {
    const session = await auth();
    if (!session || !session.user?.id) {
        throw new Error("Not authenticated, please login to continue");
    }
    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const startDate = new Date(formData.get('start-date')?.toString() || '01-01-1970');
    const endDate = new Date(formData.get('end-date')?.toString() || '01-01-1984');
    const imageurl = formData.get("imgUrl")?.toString();
    if (!title || !description || !startDate || !endDate) {
        throw new Error("All fields are required")
    }
    await prisma.trip.create({
        data: {
            title,
            description,
            startDate,
            endDate,
            imageurl,
            userID: session.user?.id
        }
    })
    redirect("/trips");
}