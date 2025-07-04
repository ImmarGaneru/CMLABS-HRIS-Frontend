"use client"
import { useRouter } from "next/navigation";
import DataTableHeader from "@/components/DatatableHeader"
import { DataTable } from "@/components/Datatable"
import { useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { FaEdit, FaEye } from "react-icons/fa";
import { useAttendance, CheckClockSetting, CheckClock, CheckClockSettingTime } from "@/contexts/AttendanceContext";


export default function AttendacePage() {
    const { employeeCheckClocks } = useAttendance();
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
            return employeeCheckClocks;
        }
        return employeeCheckClocks.filter((item) => {
            const matchesText = item.user.employee.first_name.includes(filterText.toLowerCase());
            return matchesText;
        });
    }, [employeeCheckClocks, filterText]);

    //END FUNGSI-FUNGSI FILTER==

    //RETURN CLASS MAIN FUNCTION==
    return (
        <main className="px-2 py-4 min-h-screen flex flex-col gap-4">
            <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
                <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
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
