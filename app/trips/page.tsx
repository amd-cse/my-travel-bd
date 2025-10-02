import { auth } from "@/auth";
import { Button } from "@/component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TripsPage() {
    const session = await auth();
    const trips = await prisma.trip.findMany({
        where: {
            userID: session?.user?.id
        }
    })
    const sortedTrips = [...trips].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());


    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingTrips = sortedTrips.filter((trip) => new Date(trip.startDate) >= today);


    if (!session) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-700 text xl">
                Please Sign in
            </div>

        )
    }
    return (
        <div className="space-y-6 container mx-auto px-4 py-8">
            <div className="flex rounded-xl  justify-between p-2 items-center">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <Link href="/trips/new">
                    <Button>New Trip</Button>
                </Link>
            </div>
            <Card>
                <CardHeader>

                    <CardTitle>Welcome {session.user?.name} </CardTitle>

                </CardHeader>
                <CardContent>
                    <p>
                        {trips.length === 0 ? "Start planning your first trip by clicking on the \"Add Trip\" Button" : `Number of trip${trips.length === 1
                            ? "" : "s"} planned: ${trips.length}. ${upcomingTrips.length > 0 ? `${upcomingTrips.length} upcoming` : ""} `}
                    </p>
                </CardContent>
            </Card>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Your Recent Trips</h2>
                {trips.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <h3 className="text-xl font-thin"> No Trips Yet. </h3>
                            <p className="text-center max-w-md">Start Planning by adding your first Trip</p>
                            <Link href="/trips/new">
                                <Button>New Trip</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sortedTrips.splice(0, 6).map((trip, key) => {
                            return (
                                <Link key={key} href={`/trips/${trip.tripID}`}>
                                    <Card className="h-full hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="line-clamp-2">{trip.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-md mb-2">{trip.description}</p>
                                            <div className='text-sm'>
                                                {new Date(trip.startDate).toLocaleDateString() + " - " + new Date(trip.endDate).toLocaleDateString()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}

                    </div>
                )}
            </div>
        </div>
    )

}