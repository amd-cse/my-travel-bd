'use client';

import { useEffect, useRef } from "react";
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
                    'circle-radius': 5,
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

            map.current?.on('click', 'attractions-points', (e) => {
                const coords = (e.features![0].geometry as GeoJSON.Point).coordinates as [number, number];
                const name = e.features![0].properties!.name || "no name in geojson";

                const type = e.features![0].properties!.tourism || e.features![0].properties!.natural || e.features![0].properties!.historic || "Attraction default value";
                new maplibregl.Popup().setLngLat(coords).setHTML(`<h1>${name}</h1><br/><small>${type}</small>`).addTo(map.current!);
            })
            map.current?.on('click', 'attractions-label', (e) => {
                const coords = (e.features![0].geometry as GeoJSON.Point).coordinates as [number, number];
                const name = e.features![0].properties!.name || "no name in geojson";

                const type = e.features![0].properties!.tourism || e.features![0].properties!.natural || e.features![0].properties!.historic || "Attraction default value";
                new maplibregl.Popup().setLngLat(coords).setHTML(`<h1>${name}</h1><br/><small>${type}</small>`).addTo(map.current!);
            })
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

    return <div ref={mapContainer} style={{ width: '100%', height: '600px', borderRadius: '12px' }} />





}
