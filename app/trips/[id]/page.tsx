'use server'
import { auth } from "@/auth";
import TripDetail from "@/component/TripDetail";
import { prisma } from "@/lib/prisma";

export default async function indivTripDetail({ params }: { params: Promise<{ id: string }> }) {

    const { id: tripID } = await params;
    console.log("Trip ID from inDiivTripDetail: " + tripID);
    const session = await auth();
    if (!session || !session.user?.id) {
        return <div className="bg-red-500 text-white text-center text-xl mx-auto h-screen">
            Please Login
        </div>
    }


    const trip = await prisma.trip.findFirst({
        where: {
            tripID: tripID,
            userID: session.user?.id
        },
        include: {
            locations: {
                orderBy: { createdAt: 'asc' }
            }
        }
    });
    if (!trip) {
        return <div className="bg-teal-500 text-white text-center text-xl mx-auto h-screen">
            Trip not found
        </div>
    }

    return <TripDetail trip={trip} />

}