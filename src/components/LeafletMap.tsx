/* eslint-disable @next/next/no-sync-scripts */
'use client';

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { LatLngTuple } from 'leaflet'
import LeafletMapControl from "./LeafletMapControl";

const position: LatLngTuple = [-7.95450378241118, 112.63217148198788]

export default function LeafletMap({
    cb
}: {
    cb?: (e: any) => void;
}) {
    if (typeof window === 'undefined') {
        return null;
    } else {
        return (

            <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
                < LeafletMapControl cb={cb} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        );
    }
}