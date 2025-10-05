'use client'

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function BangladeshMap() {


    const mapCont = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const styleUrl = `https://api.maptiler.com/maps/0199aef6-d23c-7ad9-877f-02e0014f3efb/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`;

    useEffect(() => {
        if (map.current || !mapCont.current) return
        map.current = new maplibregl.Map({
            container: mapCont.current,
            style: styleUrl,
            center: [90.4073, 23.7104],
            zoom: 5.6,
            minZoom: 5,
            maxZoom: 9
        });
        map.current?.addControl(new maplibregl.FullscreenControl());

        map.current?.on('load', () => {
            map.current?.addSource('districts', {
                type: 'geojson',
                data: '/bd_districts.json'
            });
            map.current?.addLayer({
                id: 'districts-fill',
                type: 'fill',
                source: 'districts',
                paint: {
                    'fill-color': '#e0f2fe',
                    'fill-outline-color': '#7ec8e3',
                    'fill-opacity': 0.6
                }
            })
            map.current?.addLayer({
                id: 'districts-label',
                type: 'symbol',
                source: 'districts',
                layout: {
                    "text-field": ['get', 'ADM2_EN'],
                    "text-offset": [0, 1.5], // Adjusted offset for better placement below the circle
                    'text-anchor': 'top',
                    'text-size': 12,
                    'text-allow-overlap': true, // Prevents labels from overlapping
                    'text-ignore-placement': true
                },
                paint: {
                    'text-color': '#ffffff',
                    'text-halo-color': '#F0F0F0',
                    'text-halo-width': 0.3
                }
            })
            map.current?.addLayer({
                source: 'districts',
                id: 'districts-outline',
                type: 'line',
                paint: {
                    'line-color': '#0284c7',
                    'line-width': 1
                }
            });
            map.current?.on('click', 'districts-fill', (e) => {
                console.log(e);
                const distName = e.features?.[0]?.properties?.ADM2_EN;
                console.log("Dist Name: ", distName);
                window.location.href = `/district/${distName}`;
            })

        });
        return () => {
            map.current?.remove();
        }


    }, []);

    return (
        <div
            ref={mapCont}
            style={{
                width: '100%',
                height: '70vh',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
        />

    )


}