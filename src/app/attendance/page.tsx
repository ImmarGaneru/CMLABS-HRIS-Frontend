"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import {useRouter} from "next/navigation";

export default function AttendacePage() {
    const router = useRouter();
    type AttendanceStatus = "Waiting Approval" | "Sick Leave" | "On Time" | "Late"
    const statuses: Record<AttendanceStatus, string> = {
        "Waiting Approval": "bg-yellow-500 text-white",
        "Sick Leave": "bg-red-500 text-white",
        "On Time": "bg-green-600 text-white",
        "Late": "bg-red-600 text-white",
    }

    const dummyData: {
        date: string
        clockIn: string
        clockOut: string
        hours: string
        status: AttendanceStatus
    }[] = Array.from({ length: 10 }).map((_, i) => ({
        date: "26 Apr, 2025",
        clockIn: "08:00 AM",
        clockOut: "05:00 PM",
        hours: "09h 00m",
        status: i === 0 ? "Waiting Approval" : i === 1 || i === 2 ? "Sick Leave" : i === 9 ? "Late" : "On Time"
    }))

    return (
        <main className="w-full min-h-screen p-6 ">
            <div className="bg-white rounded-2xl p-4 shadow-sm mt-2">
                <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 mb-8">
                    <h1 className="text-2xl font-bold">Checkclock Overview</h1>
                    <Input placeholder="Search here..." className="max-w-lg" />
                    <div className="flex gap-2">
                        <Button variant="outline"><SlidersHorizontal/> Filter</Button>
                        <Button
                            onClick={() => router.push("/attendance/create")}
                            className="bg-[#1E3A5F]"
                        >
                            + Tambah Data
                        </Button>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Clock In</TableHead>
                            <TableHead>Clock Out</TableHead>
                            <TableHead>Work Hours</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummyData.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.clockIn}</TableCell>
                                <TableCell>{row.clockOut}</TableCell>
                                <TableCell>{row.hours}</TableCell>
                                <TableCell>
                                    <Badge className={statuses[row.status]}>{row.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-muted-foreground">Showing 1 to 10 of 80 records</span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary">2</Button>
                        <Button variant="outline" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

        </main>
    )
}
