"use client"
import { useRouter } from "next/navigation";
import DataTableHeader from "@/components/DatatableHeader"
import { DataTable } from "@/components/Datatable"
import { JSX, useEffect, useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { useAttendance, CheckClockSetting, CheckClock, CheckClockSettingTime } from "@/contexts/AttendanceContext";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import OverlaySpinner from "@/components/OverlaySpinner";
import { LatLngTuple } from "leaflet";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dynamic from "next/dynamic";

const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), {
    ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
    ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
    ssr: false,
});
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), {
    ssr: false,
});

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
    ssr: false,
});

export default function AttendacePage() {
    const { selfCheckClockSetting, selfCheckClocks, handleClockIn, handleClockOut } = useAttendance();
    const router = useRouter();
    const [filterText, setFilterText] = useState("");
    const [filterTipeKehadiran, setFilterTipeKehadiran] = useState("");

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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check if geolocation is supported
            if ("geolocation" in navigator) {
                // Get current position
                navigator.geolocation.getCurrentPosition(success, error, options);
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        }
    });

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
                <Accordion elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                        aria-controls="panel1-content"
                        id="panel1-header" style={{ backgroundColor: '#1e3a5f', color: 'white' }} >
                        <h2 className="text-lg">
                            {selfCheckClockSetting ? selfCheckClockSetting.name : "Check Clock Setting"}
                        </h2>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                            <div>
                                <label className="block font-medium mb-1">Nama Jadwal</label>
                                <input
                                    type="text"
                                    name="ck_setting_name"
                                    defaultValue={selfCheckClockSetting?.name || ""}
                                    placeholder="Masukkan nama jadwal"
                                    className="w-full border rounded px-3 py-2"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Radius</label>
                                <input
                                    type="number"
                                    name="ck_setting_radius"
                                    defaultValue={selfCheckClockSetting?.radius || ""}
                                    placeholder="Masukkan radius (dalam meter)"
                                    className="w-full border rounded px-3 py-2"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Type</label>
                                <select className="w-full border rounded px-3 py-2" name="ck_setting_type" defaultValue={selfCheckClockSetting?.type || "WFO"} disabled>
                                    <option value="WFO">WFO</option>
                                    <option value="WFA">WFA</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>

                        </div>

                        {/* Tabel Jadwal */}
                        <div className="overflow-x-auto border rounded mb-6">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 font-semibold">
                                    <tr>
                                        <th className="px-4 py-2">Hari</th>
                                        <th className="px-4 py-2">Clock In</th>
                                        <th className="px-4 py-2">Break Start</th>
                                        <th className="px-4 py-2">Break End</th>
                                        <th className="px-4 py-2">Clock Out</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selfCheckClockSetting?.check_clock_setting_time.map((row, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="px-4 py-2">{row.day}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="time"
                                                    name={`ck_setting_clock_in_${idx}`}
                                                    defaultValue={row.clock_in.split(":").slice(0, 2).join(":")}
                                                    className="border rounded px-2 py-1 w-full"
                                                    disabled
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="time"
                                                    name={`ck_setting_break_start_${idx}`}
                                                    defaultValue={row.break_start.split(":").slice(0, 2).join(":")}
                                                    className="border rounded px-2 py-1 w-full"
                                                    disabled
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="time"
                                                    name={`ck_setting_break_end_${idx}`}
                                                    defaultValue={row.break_end.split(":").slice(0, 2).join(":")}
                                                    className="border rounded px-2 py-1 w-full"
                                                    disabled
                                                />
                                            </td>
                                            <td className="px-4 py-2 ">
                                                <input
                                                    type="time"
                                                    name={`ck_setting_clock_out_${idx}`}
                                                    defaultValue={row.clock_out.split(":").slice(0, 2).join(":")}
                                                    className="border rounded px-2 py-1 w-full"
                                                    disabled
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {leafletMap()}
                    </AccordionDetails>
                </Accordion>
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

        </main >
    )
}
