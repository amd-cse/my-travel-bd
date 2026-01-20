"use client"

import { useState } from "react"
import { useUploadThing } from "@/lib/uploadthing"
import { createPost } from "@/actions/post"
import Image from "next/image"
import EXIF from "exif-js"
import { addLocationToTrip, fetchUserTrips } from "@/actions/trip"
import { fetchNearestPOIData } from "@/actions/poi"

const DIST = ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur',
    'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur',
    'Tangail', 'Barguna', 'Barisal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur',
    'Bandarban', 'Brahmanbaria', 'Chandpur', 'Chittagong', 'Comilla', "Cox's Bazar",
    'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati', 'Mymensingh',
    'Netrokona', 'Jamalpur', 'Sherpur', 'Bogura', 'Joypurhat', 'Naogaon', 'Natore',
    'Chapainawabganj', 'Pabna', 'Rajshahi', 'Sirajganj', 'Dinajpur', 'Gaibandha',
    'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon',
    'Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet', 'Bagerhat', 'Chuadanga',
    'Jessore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'
];

function convertDMSToDD(degrees: number, minutes: number, seconds: number, direction: string) {
    let dd = degrees + minutes / 60 + seconds / (60 * 60);
    if (direction === "S" || direction === "W") {
        dd = dd * -1;
    }
    return dd;
}

export default function CreatePost() {
    const [caption, setCaption] = useState("")
    const [district, setDistrict] = useState("")
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const [locations, setLocations] = useState<{ lat: number, lng: number, name: string }[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [trips, setTrips] = useState<{ tripID: string, title: string, locations: any[] }[]>([])
    const [showTripSelector, setShowTripSelector] = useState(false)

    const { startUpload } = useUploadThing("imageUploader")

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            setSelectedFiles(prev => [...prev, ...files])

            const newPreviews = files.map(file => URL.createObjectURL(file))
            setPreviewUrls(prev => [...prev, ...newPreviews])

            // Load user trips if not already loaded
            if (trips.length === 0) {
                const userTrips = await fetchUserTrips()
                if (userTrips) {
                    console.log("handleFileSelect: loaded trips", userTrips);
                    setTrips(userTrips as any)
                }
            }

            // Process each file for GPS coordinates
            files.forEach((file, fileIndex) => {
                // @ts-ignore
                EXIF.getData(file as any, async function () {
                    // @ts-ignore
                    const latData = EXIF.getTag(this, "GPSLatitude");
                    // @ts-ignore
                    const latRef = EXIF.getTag(this, "GPSLatitudeRef");
                    // @ts-ignore
                    const lngData = EXIF.getTag(this, "GPSLongitude");
                    // @ts-ignore
                    const lngRef = EXIF.getTag(this, "GPSLongitudeRef");

                    if (latData && lngData && latRef && lngRef) {
                        const lat = convertDMSToDD(latData[0], latData[1], latData[2], latRef);
                        const lng = convertDMSToDD(lngData[0], lngData[1], lngData[2], lngRef);

                        console.log(`File ${fileIndex + 1}: Found GPS coordinates`, { lat, lng });

                        // Check if coordinates match any existing trip locations
                        const matchedTrip = await checkLocationMatch(lat, lng);

                        if (matchedTrip) {
                            console.log(`File ${fileIndex + 1}: Matched with trip`, matchedTrip);
                            // Optionally, you can add the location to the trip here
                            // For now, we'll just set it as the post location
                        }

                        // Add location if not already present
                        const POIdata = await fetchNearestPOIData(lat, lng, 0.16);
                        console.log("Nearest Wikidata Item:", POIdata);
                        const POIname = POIdata?.placeLabel || "Photo Location";

                        // Check if this location is already in our list
                        setLocations(prev => {
                            const exists = prev.some(loc =>
                                Math.abs(loc.lat - lat) < 0.0001 &&
                                Math.abs(loc.lng - lng) < 0.0001
                            );
                            if (!exists) {
                                return [...prev, { lat, lng, name: POIname }];
                            }
                            return prev;
                        });
                    }
                });
            });
        }
    }

    // Helper function to check if coordinates match any trip location
    const checkLocationMatch = async (lat: number, lng: number) => {
        const MATCH_THRESHOLD_KM = 0.5; // 500 meters

        for (const trip of trips) {
            for (const loc of trip.locations) {
                const distance = calculateDistance(lat, lng, loc.lat, loc.lng);
                if (distance <= MATCH_THRESHOLD_KM) {
                    return {
                        tripId: trip.tripID,
                        tripTitle: trip.title,
                        location: loc,
                        distance
                    };
                }
            }
        }
        return null;
    }

    // Calculate distance between two coordinates using Haversine formula
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    }

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
        setPreviewUrls(prev => {
            const newUrls = [...prev]
            URL.revokeObjectURL(newUrls[index])
            return newUrls.filter((_, i) => i !== index)
        })
    }

    const handleTripTag = async () => {
        setShowTripSelector(true)
        if (trips.length === 0) {
            const userTrips = await fetchUserTrips()
            if (userTrips) {
                console.log("CreatePost: loaded trips", userTrips);
                setTrips(userTrips as any)
            }
        }
    }

    const handleSubmit = async () => {
        console.log("handleSubmit called");
        console.log("Caption:", caption);
        console.log("Selected Files:", selectedFiles.length, selectedFiles);

        if (!caption && selectedFiles.length === 0) return;
        setIsUploading(true);

        let imageUrls: string[] = [];

        if (selectedFiles.length > 0) {
            console.log("Starting upload...");
            try {
                const res = await startUpload(selectedFiles);
                console.log("Upload result:", res);
                if (res) {
                    imageUrls = res.map(f => f.url);
                    console.log("Extracted image URLs:", imageUrls);
                } else {
                    console.error("Upload returned no result");
                }
            } catch (err) {
                console.error("Upload error:", err);
            }
        }

        const res = await createPost({
            caption,
            images: imageUrls,
            district,
            locationNames: locations.map(loc => loc.name),
            lats: locations.map(loc => loc.lat),
            lngs: locations.map(loc => loc.lng)
        });

        setIsUploading(false);
        if (res.success) {
            setIsOpen(false);
            setCaption("");
            setSelectedFiles([]);
            setPreviewUrls([]);
            setLocations([]);
            setDistrict("");
        } else {
            alert("Failed to create post");
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-left text-gray-500 hover:bg-gray-50 transition-colors mb-6 flex items-center space-x-3"
            >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                <span>Share your travel experience...</span>
            </button>
        )
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
            <h2 className="text-xl font-bold mb-4">Create Post</h2>

            <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Tell us about your trip..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none mb-4 min-h-[100px]"
            />

            {previewUrls.length > 0 && (
                <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {previewUrls.map((url, idx) => (
                        <div key={url} className="relative rounded-lg overflow-hidden h-32 bg-gray-100">
                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeFile(idx)}
                                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 w-6 h-6 flex items-center justify-center text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {locations.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {locations.map((loc, idx) => (
                        <div key={idx} className="inline-flex items-center bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm">
                            📍 {loc.name}
                            <button
                                onClick={() => setLocations(prev => prev.filter((_, i) => i !== idx))}
                                className="ml-2 hover:text-teal-900"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-teal-500"
                    >
                        <option value="">Select District</option>
                        {DIST.sort().map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Locations</label>
                    <button
                        onClick={handleTripTag}
                        className="w-full p-2 text-left border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
                    >
                        Add location from trip...
                    </button>
                </div>
            </div>

            {/* Trip Selector Modal/Popovver (Simplified inline for now) */}
            {showTripSelector && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">Select from your trips</span>
                        <button onClick={() => setShowTripSelector(false)} className="text-xs text-gray-500">Close</button>
                    </div>
                    {trips.length === 0 ? (
                        <p className="text-sm text-gray-500">Loading trips...</p>
                    ) : (
                        <div className="space-y-2">
                            {trips.map(trip => (
                                <div key={trip.tripID}>
                                    <p className="text-xs font-bold text-gray-700 mb-1">{trip.title}</p>
                                    <div className="pl-2 space-y-1">
                                        {/* We need locations here. If not available in trip object, we can't show them. */}
                                        {/* Assuming trip.locations exists based on my assumption earlier */}
                                        {trip.locations && trip.locations.map((loc: any) => (
                                            <button
                                                key={loc.id}
                                                onClick={() => {
                                                    setLocations(prev => {
                                                        const exists = prev.some(l => l.lat === loc.lat && l.lng === loc.lng);
                                                        if (!exists) {
                                                            return [...prev, { lat: loc.lat, lng: loc.lng, name: loc.locationTitle }];
                                                        }
                                                        return prev;
                                                    });
                                                    setShowTripSelector(false);
                                                }}
                                                className="block w-full text-left text-xs text-gray-600 hover:bg-gray-200 p-1 rounded"
                                            >
                                                📍 {loc.locationTitle}
                                            </button>
                                        ))}
                                        {(!trip.locations || trip.locations.length === 0) && <p className="text-xs text-gray-400">No locations</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                    <label className="cursor-pointer text-gray-500 hover:text-teal-600 p-2 rounded-full hover:bg-teal-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
                    </label>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isUploading || (!caption && selectedFiles.length === 0)}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isUploading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {isUploading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>
        </div>
    )
}
