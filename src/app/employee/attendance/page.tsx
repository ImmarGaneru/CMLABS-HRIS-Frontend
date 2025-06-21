"use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {ChevronLeft, ChevronRight, Eye, SlidersHorizontal} from "lucide-react"
import { useRouter } from "next/navigation";
import DataTableHeader from "@/components/DatatableHeader"
import { DataTable } from "@/components/Datatable"
import { useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { FaEdit, FaEye } from "react-icons/fa";
import { useAttendance, CheckClockSetting, CheckClock, CheckClockSettingTime } from "@/contexts/AttendanceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



export default function AttendacePage() {
    const { selfCheckClockSetting, selfCheckClocks, handleClockIn, handleClockOut, handleBreakStart, handleBreakEnd } = useAttendance();
    const router = useRouter();
    const [filterText, setFilterText] = useState("");
    const [filterTipeKehadiran, setFilterTipeKehadiran] = useState("");
    const [filterTanggal, setFilterTanggal] = useState("");
    const [isDetailOpen, setIsDetailOpen] = useState(false);

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
        return selfCheckClocks.filter((item) => {
            const matchesText = item.user.employee.first_name.includes(filterText.toLowerCase());
            return matchesText;
        });
    }, [selfCheckClocks, filterText]);

    //END FUNGSI-FUNGSI FILTER==

    const actions = [
        {
            'name': "Clock In",
            'action': () => {
                handleClockIn();
            }
        },
        {
            'name': "Break Start",
            'action': () => {
                handleBreakStart();
            }
        },
        {
            'name': "Break End",
            'action': () => {
                handleBreakEnd();
            }
        },
        {
            'name': "Clock Out",
            'action': () => {
                handleClockOut();
            }
        }
    ]
    return (
        <main className="px-2 py-4 min-h-screen flex flex-col gap-4">
            <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
                <Select
                    defaultValue="${selfCheckClockSetting?.id}">
                    <SelectTrigger className="w-full border border-black rounded-2xl">
                        <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="${selfCheckClockSetting?.id}">
                            {selfCheckClockSetting?.name || ""}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {actions.map((action) => (
                        <Button
                            key={action.name}
                            className="text-center py-4 rounded-2xl text-base font-semibold border border-black"
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
                    <DataTable columns={attendanceColumns} data={filteredData} />
                </div>

            </div>

        </main>
    )
}
