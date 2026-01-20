'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { POIResult } from "./poi";

export async function fetchUserTrips() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return null;
    }

    try {
        const trips = await prisma.trip.findMany({
            where: {
                userID: session.user.id
            },
            select: {
                tripID: true,
                title: true,
                locations: {
                    select: {
                        id: true,
                        locationTitle: true,
                        lat: true,
                        lng: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        console.log("Fetched user trips with locations:", JSON.stringify(trips, null, 2));
        return trips;
    } catch (error) {
        console.error("Error fetching user trips:", error);
        return [];
    }
}


export async function addLocationToTrip(tripId: string, poi: POIResult, lat: number, lng: number) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Verify ownership
        const trip = await prisma.trip.findUnique({
            where: { tripID: tripId },
            select: { userID: true }
        });

        if (!trip || trip.userID !== session.user.id) {
            return { success: false, error: "Trip not found or unauthorized" };
        }

        const location = await prisma.location.create({
            data: {
                tripID: tripId,
                locationTitle: poi.placeLabel,
                lat: lat,
                lng: lng,
                imageUrl: poi.image,
                description: poi.description
            }
        });

        return { success: true, location };
    } catch (error) {
        console.error("Error adding location to trip:", error);
        return { success: false, error: "Failed to add location" };
    }
}

export async function removeLocationFromTrip(locationId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Verify ownership via Trip
        const location = await prisma.location.findUnique({
            where: { id: locationId },
            include: { trip: true }
        });

        if (!location || location.trip.userID !== session.user.id) {
            return { success: false, error: "Location not found or unauthorized" };
        }

        await prisma.location.delete({
            where: { id: locationId }
        });

        return { success: true };
    } catch (error) {
        console.error("Error removing location from trip:", error);
        return { success: false, error: "Failed to remove location" };
    }
}
