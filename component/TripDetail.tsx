'use client';
import { Trip } from "@prisma/client";
import Image from "next/image";
import { Calendar, Plus } from 'lucide-react';
import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { act, useState } from "react";
interface TripProps {
    trip: Trip
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
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    )
}