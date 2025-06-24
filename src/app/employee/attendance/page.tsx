"use client"
import { useRouter } from "next/navigation";
import DataTableHeader from "@/components/DatatableHeader"
import { DataTable } from "@/components/Datatable"
import { JSX, useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { FaEdit, FaEye } from "react-icons/fa";
import { useAttendance, CheckClockSetting, CheckClock, CheckClockSettingTime } from "@/contexts/AttendanceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import OverlaySpinner from "@/components/OverlaySpinner";
import LeafletMap from "@/components/LeafletMap";
import { Circle, CircleMarker, Marker, Popup, Tooltip } from "react-leaflet";
import { LatLngTuple } from "leaflet";



export default function AttendacePage() {
    const { selfCheckClockSetting, selfCheckClocks, handleClockIn, handleClockOut } = useAttendance();
    const router = useRouter();
    const [filterText, setFilterText] = useState("");
    const [filterTipeKehadiran, setFilterTipeKehadiran] = useState("");
    const [filterTanggal, setFilterTanggal] = useState("");
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [currentLatLng, setCurrentLatLng] = useState<LatLngTuple | null>(null);

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    function success(pos: any) {
        const crd = pos.coords;
        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        setCurrentLatLng([crd.latitude, crd.longitude]);
    }

    function error(err: any) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

    const initializingState = () => {
        return selfCheckClockSetting === null || selfCheckClocks === null || currentLatLng === null;
    }

    const shouldLoading = () => {
        return initializingState() || isLoading;
    }

    function leafletMap(): JSX.Element {
        if (shouldLoading()) {
            return <></>
        }

        let attendanceLatLng: LatLngTuple | undefined;

        if (selfCheckClockSetting!.location_lat !== null && selfCheckClockSetting!.location_lng !== null) {
            attendanceLatLng = [selfCheckClockSetting!.location_lat!, selfCheckClockSetting!.location_lng!];
        }

        return (
            <LeafletMap initialPosition={currentLatLng || [0, 0]}>
                <Marker position={currentLatLng || [0, 0]}>
                    <Tooltip direction="top" offset={[-15, -10]} opacity={1} permanent>
                        <span className="text-sm">Your Location</span>
                    </Tooltip>
                    <Popup>
                        <div className="text-sm">
                            <h3 className="font-semibold">Current Location</h3>
                            <p>Latitude: {currentLatLng ? currentLatLng[0] : "Loading..."}</p>
                            <p>Longitude: {currentLatLng ? currentLatLng[1] : "Loading..."}</p>
                        </div>
                    </Popup>
                </Marker>
                {attendanceLatLng && (
                    <><Marker position={attendanceLatLng}>
                        <Tooltip direction="top" offset={[-15, -10]} opacity={1} permanent>
                            <span className="text-sm">Attendance Location</span>
                        </Tooltip>
                        <Popup>
                            <div className="text-sm">
                                <h3 className="font-semibold">Attendance Location</h3>
                                <p>Latitude: {attendanceLatLng[0]}</p>
                                <p>Longitude: {attendanceLatLng[1]}</p>
                            </div>
                        </Popup>
                    </Marker>
                        <Circle
                            center={attendanceLatLng}
                            pathOptions={{ color: 'blue' }}
                            radius={selfCheckClockSetting!.radius || 0}>
                        </Circle>
                    </>
                )}
            </LeafletMap>
        );
    }

    //Kolom untuk tabel attendance
    const attendanceColumns = useMemo<ColumnDef<CheckClock>[]>(
        () => [
            {
                id: "No",
                header: "No",
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        {row.index + 1}
                    </div>
                ),
                size: 60,
            },
            {
                accessorKey: "user.employee.first_name",
                header: "Nama",
                cell: info => (
                    <div className="truncate w-[120px] justify-center">
                        {info.getValue() as string}
                    </div>
                ),
            },
            {
                accessorKey: "user.employee.jenis_kelamin",
                header: "Jenis Kelamin",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                )
            },
            {
                accessorKey: "created_at",
                header: "Tanggal",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                )
            },
            {
                accessorKey: "clock_in",
                header: "Clock-In",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                )
            },
            {
                accessorKey: "break_start",
                header: "Break Start",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                )
            },
            {
                accessorKey: "break_end",
                header: "Break End",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                )
            },
            {
                accessorKey: "clock_out",
                header: "Clock-Out",
                cell: info => (
                    <div className="flex justify-center">
                        {info.getValue() as string}
                    </div>
                )
            },
        ], []
    )


    // Filter data based on search text, status and type
    const filteredData = useMemo(() => {
        if (!filterText) {
            return selfCheckClocks;
        }
        return (selfCheckClocks || []).filter((item) => {
            const matchesText = item.user.employee.first_name.includes(filterText.toLowerCase());
            return matchesText;
        });
    }, [selfCheckClocks, filterText]);

    //END FUNGSI-FUNGSI FILTER==

    const actions = [
        {
            'name': "Clock In",
            'action': () => {
                const options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                };

                function success(pos: any) {
                    const crd = pos.coords;

                    handleClockIn(crd.latitude, crd.longitude);

                    console.log("Your current position is:");
                    console.log(`Latitude : ${crd.latitude}`);
                    console.log(`Longitude: ${crd.longitude}`);
                    console.log(`More or less ${crd.accuracy} meters.`);
                }

                function error(err: any) {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                }

                navigator.geolocation.getCurrentPosition(success, error, options);
            }
        },
        {
            'name': "Clock Out",
            'action': () => {
                const options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                };

                function success(pos: any) {
                    const crd = pos.coords;

                    handleClockOut(crd.latitude, crd.longitude);

                    console.log("Your current position is:");
                    console.log(`Latitude : ${crd.latitude}`);
                    console.log(`Longitude: ${crd.longitude}`);
                    console.log(`More or less ${crd.accuracy} meters.`);
                }

                function error(err: any) {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                }

                navigator.geolocation.getCurrentPosition(success, error, options);
            }
        }
    ]
    return (
        <main className="px-2 py-4 min-h-screen flex flex-col gap-4">
            <OverlaySpinner isLoading={shouldLoading()} />
            <Toaster />
            <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
                {leafletMap()}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-6">
                    {actions.map((action) => (
                        <Button
                            key={action.name}
                            className="text-center py-4 rounded-2xm text-base font-semibold border border-black"
                            variant="ghost"
                            onClick={action.action}
                        >
                            {action.name}
                        </Button>
                    ))}
                </div>
                <div className="flex justify-between items-center mb-4 gap-4 flex-wrap mt-6">
                    {/* Data Table Header */}
                    <DataTableHeader
                        title="Informasi Kehadiran"
                        hasSearch={true}
                        hasFilter={true}
                        hasExport={true}
                        searchValue={filterText}
                        onSearch={setFilterText}
                        filterValue={filterTipeKehadiran}
                    />
                    {/* Data Tabel Isi attendance */}
                    <DataTable columns={attendanceColumns} data={filteredData || []} />
                </div>

            </div>

        </main>
    )
}
