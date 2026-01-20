'use client';
import { Trip, Location } from "@prisma/client";
import Image from "next/image";
import { Calendar, Plus } from 'lucide-react';
import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { act, useState } from "react";
interface TripProps {
    trip: Trip & {
        locations: (Location & {
            imageUrl?: string | null;
            description?: string | null;
        })[]
    }
}
export default function TripDetail({ trip }: TripProps) {
    const [activeTab, setActiveTab] = useState("overview");
    console.log(activeTab);
    console.log(trip);
    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {trip.imageurl && (
                <div className="overflow-hidden w-full h-70 md:h-90 rounded-lg shadow-xl relative">
                    <Image src={trip.imageurl} alt="trip-header" className="object-cover" fill priority />                 </div>
            )}
            <div className="bg-white p-6 shadow-md rounded-lg flex flex-col md:flex-row justify-between items-start md:items center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">{trip.title} </h1>
                    <div className="flex items-center text-gray-500 mt-3">
                        <Calendar /><span className="text-lg">{
                            trip.startDate.toLocaleDateString() + " - " + trip.endDate.toLocaleDateString()
                        }</span>
                    </div>
                </div>
                <div className="mt-4 md: mt-0">
                    <Link href={`/trips/${trip.tripID}/itinerary/new`}>
                        <Button className="cursor-pointer"><Plus></Plus>Add Location</Button>
                    </Link>
                </div>
            </div>
            <div className="bg-teal-200 p-6 shadow-md shadow-blue-100 rounded-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value='overview' className='text-lg'>Overview</TabsTrigger>
                        <TabsTrigger value='itinerary' className='text-lg'>Itinerary</TabsTrigger>
                        <TabsTrigger value='map' className='text-lg'>Map</TabsTrigger>

                    </TabsList>
                    <TabsContent value='overview' className='space-y-2'>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-2xl mb-4 font-semibold">Trip Summary</h2>
                                <div className="space-y-2">
                                    <div className='flex items-center'>
                                        <Calendar className="h-8 w-8 text-gray-400 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-600">Date: </p>
                                            <p className='text-sm text-gray-700'>{
                                                trip.startDate.toLocaleDateString() + " - " + trip.endDate.toLocaleDateString()
                                            }
                                                <br />
                                                {Math.round(trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24) + ' Days'}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value='itinerary' className='space-y-6'>
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Saved Locations</h2>
                        </div>

                        {trip.locations && trip.locations.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {trip.locations.map((loc) => (
                                    <LocationCard key={loc.id} location={loc} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-500 mb-4">No locations added yet.</p>
                                <Link href={`/district/Dhaka`}>
                                    <Button variant="outline">Explore Map to Add Locations</Button>
                                </Link>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    )
}

function LocationCard({ location }: { location: any }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const { removeLocationFromTrip } = require("@/actions/trip");

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to remove this location?")) return;
        setIsDeleting(true);
        const res = await removeLocationFromTrip(location.id);
        if (res.success) {
            setIsDeleted(true);
            // In a real app we might want to revalidate path 
            // or update local state, but simply hiding it works for now
        } else {
            alert("Failed to delete");
            setIsDeleting(false);
        }
    }

    if (isDeleted) return null;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {location.imageUrl ? (
                <div className="relative h-48 w-full">
                    <Image
                        src={location.imageUrl}
                        alt={location.locationTitle}
                        fill
                        className="object-cover"
                    />
                </div>
            ) : (
                <div className="h-24 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                </div>
            )}

            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{location.locationTitle}</h3>
                {location.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{location.description}</p>
                )}

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                        Added {new Date(location.createdAt).toLocaleDateString()}
                    </span>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Removing..." : "Remove"}
                    </Button>
                </div>
            </div>
        </div>
    )
}