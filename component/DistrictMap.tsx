'use client';
import { fetchNearestPOIData, POIResult } from "@/actions/poi";
// Update on 28 OCT 2025
import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { FeatureCollection, Point } from 'geojson'
import { features } from "process";
interface DistrictMapProps {
    geojsonData: FeatureCollection<Point>;
}


export default function DistrictMap({ geojsonData }: DistrictMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [selectedPOI, setSelectedPOI] = useState<POIResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [clickLocation, setClickLocation] = useState<{ name: string, type: string, lat: number, lng: number } | null>(null);


    console.log("First Feature: ", geojsonData.features[0])
    useEffect(() => {
        if (!mapContainer.current) return

        const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: styleUrl,
            center: [90.4073, 23.7104],
            zoom: 15
        })
        map.current?.addControl(new maplibregl.NavigationControl());

        map.current?.on('load', () => {

            console.log("features: ", geojsonData.features);
            map.current?.addSource('attractions', {
                type: 'geojson',
                data: geojsonData,
            })

            map.current?.addLayer({
                id: 'attractions-points',
                type: 'circle',
                source: 'attractions',
                paint: {
                    'circle-radius': 6,
                    "circle-color": '#0978ff',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            });
            map.current?.addLayer({
                id: 'attractions-label',
                type: 'symbol',
                source: 'attractions',
                layout: {
                    "text-field": ['coalesce', ['get', 'name'], ['literal', '']],
                    "text-offset": [0, 1.5], // Adjusted offset for better placement below the circle
                    'text-anchor': 'top',
                    'text-size': 12,
                    'text-allow-overlap': false, // Prevents labels from overlapping
                    'text-ignore-placement': false
                },
                paint: {
                    'text-color': '#000',
                    'text-halo-color': '#F0F0F0',
                    'text-halo-width': 0.3
                }
            })

            const handlePOIClick = (e: any) => {
                const coords = (e.features![0].geometry as GeoJSON.Point).coordinates as [number, number];
                const name = e.features![0].properties!.name || "Unknown Place";
                const type = e.features![0].properties!.tourism || e.features![0].properties!.natural || e.features![0].properties!.historic || "Attraction";

                // Clear previous popup if any (optional, or we rely on just the side panel)
                // new maplibregl.Popup().setLngLat(coords).setHTML(`<h1>${name}</h1><br/><small>${type}</small>`).addTo(map.current!);

                setClickLocation({ name, type, lat: coords[1], lng: coords[0] });
                setIsLoading(true);
                setSelectedPOI(null);

                // Fetch Wikidata
                fetchNearestPOIData(coords[1], coords[0], 0.16).then(data => {
                    console.log("Clicked POI:", name);
                    console.log("Nearest Wikidata Item:", data);
                    setSelectedPOI(data);
                    setIsLoading(false);
                });
            };

            map.current?.on('click', 'attractions-points', handlePOIClick);
            map.current?.on('click', 'attractions-label', handlePOIClick);

            // Cursor pointer style
            map.current?.on('mouseenter', 'attractions-points', () => {
                map.current!.getCanvas().style.cursor = 'pointer';
            });
            map.current?.on('mouseleave', 'attractions-points', () => {
                map.current!.getCanvas().style.cursor = '';
            });


            if (geojsonData.features.length > 0) {
                const bounds = new maplibregl.LngLatBounds();
                geojsonData.features.forEach(feature => {
                    const coords = feature.geometry.coordinates;
                    if (Array.isArray(coords) && coords.length == 2) {
                        bounds.extend(coords as [number, number])
                    }
                });
                if (!bounds.isEmpty()) {
                    map.current?.fitBounds(bounds, {
                        padding: 60,
                        maxZoom: 12,
                        duration: 100
                    })
                }
            }


        })
        return () => {
            if (map.current) {
                map.current.remove();
            }
        }
    }, [geojsonData]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '600px' }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />

            {(isLoading || clickLocation) && (
                <div className="absolute top-4 left-4 z-10 w-80 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 ease-in-out">
                    <button
                        onClick={() => {
                            setClickLocation(null);
                            setSelectedPOI(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-gray-100 transition-colors z-20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>

                    {isLoading ? (
                        <div className="p-6 flex flex-col items-center justify-center space-y-3">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-gray-500 font-medium">Finding info for {clickLocation?.name}...</p>
                        </div>
                    ) : selectedPOI ? (
                        <POIInfoPanel selectedPOI={selectedPOI} clickLocation={clickLocation} />
                    ) : (
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{clickLocation?.name}</h2>
                            <p className="text-sm text-gray-500 italic mb-4">{clickLocation?.type}</p>
                            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-500 text-center">
                                No additional info found on Wikidata nearby.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function POIInfoPanel({ selectedPOI, clickLocation }: { selectedPOI: POIResult, clickLocation: { name: string, type: string, lat: number, lng: number } | null }) {
    const [isAdding, setIsAdding] = useState(false);
    const [trips, setTrips] = useState<{ tripID: string, title: string }[] | null>([]);
    const [selectedTripId, setSelectedTripId] = useState("");
    const [fetchError, setFetchError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Import actions dynamically or pass as props if preferred, but simpler here
    const { fetchUserTrips, addLocationToTrip } = require("@/actions/trip");
    const { signIn } = require("next-auth/react");

    const handleAddClick = async () => {
        setIsAdding(true);
        setFetchError("");
        setSaveMessage(null);
        try {
            const userTrips = await fetchUserTrips();
            setTrips(userTrips);
            if (userTrips && userTrips.length > 0) setSelectedTripId(userTrips[0].tripID);
        } catch (e) {
            setFetchError("Failed to load trips.");
        }
    };

    const handleSave = async () => {
        if (!selectedTripId) return;
        setIsSaving(true);
        setSaveMessage(null);

        // Use coordinates from clickLocation
        if (!clickLocation) {
            setSaveMessage({ type: 'error', text: "Missing location data." });
            setIsSaving(false);
            return;
        }

        const res = await addLocationToTrip(selectedTripId, selectedPOI, clickLocation.lat, clickLocation.lng);

        setIsSaving(false);
        if (res.success) {
            setSaveMessage({ type: 'success', text: "Added to trip!" });
            setTimeout(() => {
                setIsAdding(false);
                setSaveMessage(null);
            }, 2000);
        } else {
            setSaveMessage({ type: 'error', text: res.error || "Failed." });
        }
    };

    return (
        <>
            {selectedPOI.image && (
                <div className="relative h-48 w-full">
                    <img
                        src={selectedPOI.image}
                        alt={selectedPOI.placeLabel}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
            )}
            <div className="p-5">
                <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">{selectedPOI.placeLabel}</h2>
                {clickLocation?.name !== selectedPOI.placeLabel && (
                    <p className="text-xs text-gray-400 mb-2">Mapped from: {clickLocation?.name}</p>
                )}
                <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                        {Number(selectedPOI.dist).toFixed(2)} km away
                    </span>
                    {selectedPOI.source && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${selectedPOI.source === 'Foursquare' ? 'bg-pink-50 text-pink-700 border-pink-100' : 'bg-gray-50 text-gray-700 border-gray-100'}`}>
                            via {selectedPOI.source}
                        </span>
                    )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 mb-4">
                    {selectedPOI.description || "No description available from Wikidata."}
                </p>

                {/* Add to Trip Section */}
                {!isAdding ? (
                    <button
                        onClick={handleAddClick}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                        <span>Add to Trip</span>
                    </button>
                ) : (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-semibold text-gray-600">
                                {trips === null ? "Authentication Required" : "Select Trip"}
                            </label>
                            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button>
                        </div>

                        {fetchError ? (
                            <p className="text-xs text-red-500 mb-2">{fetchError}</p>
                        ) : trips === null ? (
                            <div className="text-center py-2">
                                <p className="text-xs text-gray-500 mb-2">Please sign in to save trips.</p>
                                <button
                                    onClick={() => signIn('google')}
                                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                                >
                                    Sign in with Google
                                </button>
                            </div>
                        ) : trips.length === 0 ? (
                            <p className="text-xs text-gray-500 mb-2">No trips found. Create one first!</p>
                        ) : (
                            <>
                                <select
                                    className="w-full text-sm p-2 border border-gray-200 rounded-md mb-2 focus:ring-1 focus:ring-teal-500 outline-none"
                                    value={selectedTripId}
                                    onChange={(e) => setSelectedTripId(e.target.value)}
                                >
                                    {trips.map(t => (
                                        <option key={t.tripID} value={t.tripID}>{t.title}</option>
                                    ))}
                                </select>
                                {saveMessage && (
                                    <p className={`text-xs mb-2 ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                        {saveMessage.text}
                                    </p>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || trips.length === 0}
                                    className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-medium rounded transition-colors"
                                >
                                    {isSaving ? "Saving..." : "Save to Trip"}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
