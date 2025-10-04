'use client';

import { useEffect, useRef } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { FeatureCollection, Point } from 'geojson'
interface DistrictMapProps {
    geojsonData: FeatureCollection<Point>;
}


export default function DistrictMap({ geojsonData }: DistrictMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    console.log("First Feature: ", geojsonData.features[0])
    useEffect(() => {
        if (!mapContainer.current) return

        const styleUrl = `https://api.maptiler.com/maps/0199aef6-d23c-7ad9-877f-02e0014f3efb/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`;

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
                    'text-allow-overlap': true, // Prevents labels from overlapping
                    'text-ignore-placement': true
                },
                paint: {
                    'text-color': '#ffffff',
                    'text-halo-color': '#F0F0F0',
                    'text-halo-width': 1
                }
            })

            map.current?.on('click', 'attractions-points', (e) => {
                const coords = e.features![0].geometry.coordinates as [number, number];
                const name = e.features![0].properties!.name || "no name in geojson";

                const type = e.features![0].properties!.tourism || e.features![0].properties!.natural || e.features![0].properties!.historic || "Attraction default value";
                new maplibregl.Popup().setLngLat(coords).setHTML(`<h1>${name}</h1><br/><small>${type}</small>`).addTo(map.current!);
            })



        })
        return () => {
            if (map.current) {
                map.current.remove();
            }
        }
    }, [geojsonData]);

    return <div ref={mapContainer} style={{ width: '100%', height: '600px', borderRadius: '12px' }} />





}
