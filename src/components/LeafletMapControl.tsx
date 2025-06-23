/* eslint-disable @next/next/no-sync-scripts */
'use client';

import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngTuple } from 'leaflet'

import { useState } from "react";

const position: LatLngTuple = [-7.95450378241118, 112.63217148198788]

export default function LeafletMapControl({
    initialMarkerPosition = position,
    cb
}: {
    initialMarkerPosition?: LatLngTuple;
    cb?: (e: any) => void;
}) {

    const [currentLatLng, setCurrentLatLng] = useState<LatLngTuple>(initialMarkerPosition || position);

    const map = useMapEvents({
        click: (e) => {
            map.locate()
            console.log('map clicked:', e.latlng);
            if (cb) {
                cb(e);
                setCurrentLatLng([e.latlng.lat, e.latlng.lng]);
            }
        },
        locationfound: (location) => {
            console.log('location found:', location)
        },
    })

    if (typeof window !== 'undefined') {
        return (
            <Marker position={currentLatLng} >
                <Popup>
                    <div className="text-sm">
                        <p>Latitude: {currentLatLng[0]}</p>
                        <p>Longitude: {currentLatLng[1]}</p>
                    </div>
                </Popup>
            </Marker>
        )
    }
    return null
}