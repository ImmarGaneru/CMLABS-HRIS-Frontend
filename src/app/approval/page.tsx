"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, SlidersHorizontal, Eye } from "lucide-react"
import {useRouter} from "next/navigation";

export default function ApprovalPage() {
    const router = useRouter();
    type AttendanceStatus = "Waiting Approval" | "Rejected" | "Approved"
    const statuses: Record<AttendanceStatus, string> = {
        "Waiting Approval": "bg-yellow-500 text-white",
        "Rejected": "bg-red-500 text-white",
        "Approved": "bg-green-600 text-white",
    }

    const approvals: {
        id: number
        nama: string
        type: string
        date: string
        status: AttendanceStatus
    }[] = [
        {
            id:1,
            nama: "Ahmad",
            type: "Izin",
            date: "26 Apr, 2025",
            status: "Waiting Approval",
        },
        {
            id: 2,
            nama: "Luna Christina aj",
            type: "Sakit",
            date: "26 Apr, 2025",
            status: "Waiting Approval",
        },
        {
            id: 3,
            nama: "Didik Putra Utar",
            type: "Cuti",
            date: "26 Apr, 2025",
            status: "Waiting Approval",
        },
        {
            id: 4,
            nama: "Nirmala Sukma",
            type: "Izin",
            date: "26 Apr, 2025",
            status: "Approved",
        },
        {
            id: 5,
            nama: "Didik Putra Utar",
            type: "Izin",
            date: "26 Apr, 2025",
            status: "Rejected",
        },
        {
            id: 6,
            nama: "Luna Christina aj",
            type: "Perubahan Data",
            date: "26 Apr, 2025",
            status: "Approved",
        },
        {
            id: 7,
            nama: "Ahmad",
            type: "Perubahan Data",
            date: "26 Apr, 2025",
            status: "Approved",
        },
        {
            id: 8,
            nama: "Luna Christina aj",
            type: "Izin",
            date: "26 Apr, 2025",
            status: "Rejected",
        },
        {
            id: 9,
            nama: "Didik Putra Utar",
            type: "Perubahan Data",
            date: "26 Apr, 2025",
            status: "Approved",
        },
    ]

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <main className="w-full min-h-screen p-6 ">
            <div className="bg-white rounded-2xl p-4 shadow-sm mt-2">
                <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 mb-8">
                    <h1 className="text-2xl font-bold">Approval Overview</h1>
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
                            <TableHead>Nama Karyawan</TableHead>
                            <TableHead>Jenis Pengajuan</TableHead>
                            <TableHead>Tanggal Pengajuan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {approvals.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.nama}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>
                                    <Badge className={statuses[row.status as AttendanceStatus]}>{row.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        className="bg-[#2D8EFF]"
                                        onClick={() => router.push(`/approval/${row.id}`)}
                                    >
                                        <Eye/>
                                    </Button>
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
