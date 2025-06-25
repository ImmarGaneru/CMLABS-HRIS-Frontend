/* eslint-disable @next/next/no-sync-scripts */
'use client';

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { LatLngTuple } from 'leaflet'

const position: LatLngTuple = [-7.95450378241118, 112.63217148198788]

export default function LeafletMap({
    initialPosition,
    children
}: {
    initialPosition?: LatLngTuple;
    children?: React.ReactNode;
}) {
    if (typeof window === 'undefined') {
        return null;
    } else {
        return (

            <MapContainer center={initialPosition || position} zoom={7} scrollWheelZoom={true}>
                {children}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        );
    }
}