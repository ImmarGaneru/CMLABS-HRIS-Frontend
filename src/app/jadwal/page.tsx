"use client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { FaEdit, FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";


export default function JadwalTablePage() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [filterTipeJadwal, setFilterTipeJadwal] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  
  const jadwalFilters = [
    { label: 'WFO', value: 'WFO' },
    { label: 'WFH', value: 'WFH' }
  ];

  // objek schedule
  type Schedule = {
    id: number;
    namaJadwal: string;
    hariKerja: string;
    jamKerja: string;
    tanggalEfektif: string;
    tipeJadwal: string;
  };

  //Kolom untuk Tabel jadwal
  const jadwalColumns = useMemo<ColumnDef<Schedule>[]>(
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
        accessorKey: "namaJadwal",
        header: "Nama Jadwal",
        cell: info => (
          <div>
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "hariKerja",
        header: "Hari Kerja",
        cell: info => (
          <div className="flex justify-center">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "jamKerja",
        header: "Work Hours (month)",
        cell: info => (
          <div className="flex justify-center">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "tanggalEfektif",
        header: "Tanggal Efektif",
        cell: info => (
          <div className="flex justify-center">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "tipeJadwal",
        header: "Tipe Jadwal",
        cell: info => {
          const tipeJadwal = info.getValue() as string;
          const style = tipeJadwal === "WFO" 
            ? "bg-blue-100 text-blue-800" 
            : "bg-green-100 text-green-800";
          
          return (
            <div className="flex justify-center">
              <span className={`px-2 py-1 text-xs rounded ${style}`}>
                {tipeJadwal}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const data = row.original;
          return (
            <div className="flex gap-2">
              <button
                title="Detail"
                onClick={() => {
                  setSelectedSchedule(data);
                  setIsDetailOpen(true);
                }}
                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
              >
                <FaEye />
              </button>
              <button
                title="Edit"
                onClick={() => router.push(`/jadwal/edit/${data.id}`)}
                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
              >
                <FaEdit />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  // Dummy data schedule berdasarkan type Schedule
  const schedulesData: Schedule[] = [
    {
      id: 1,
      namaJadwal: "Jadwal Kantor",
      hariKerja: "5 Hari",
      jamKerja: "180 h",
      tanggalEfektif: "01/01/2025",
      tipeJadwal: "WFO",
    },
    {
      id: 2,
      namaJadwal: "Shift Pagi",
      hariKerja: "6 Hari",
      jamKerja: "200 h",
      tanggalEfektif: "01/01/2025",
      tipeJadwal: "WFO",
    },
    {
      id: 3,
      namaJadwal: "Shift Malam",
      hariKerja: "5 Hari",
      jamKerja: "180 h",
      tanggalEfektif: "01/01/2025",
      tipeJadwal: "WFO",
    },
    {
      id: 4,
      namaJadwal: "Kontrak 6 bulan",
      hariKerja: "4 Hari",
      jamKerja: "160 h",
      tanggalEfektif: "01/01/2025",
      tipeJadwal: "WFH",
    },
  ];

//FUNGSI-FUNGSI FILTER==

  // Function to handle CSV export
  const handleExportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(schedulesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedules");
    XLSX.writeFile(workbook, "schedules_data.xlsx");
  };

  // Function to handle CSV import
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          console.log('Imported data:', jsonData);
        } catch (error) {
          console.error('Error importing file:', error);
          alert('Error importing file. Please check the file format.');
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  // Filter data based on search text, tipe jadwal, and tanggal
  const filteredData = useMemo(() => {
    return schedulesData.filter((item) => {
      const matchesSearch = item.namaJadwal.toLowerCase().includes(filterText.toLowerCase());
      const matchesTipeJadwal = !filterTipeJadwal || item.tipeJadwal === filterTipeJadwal;
      const matchesTanggal = !filterTanggal || item.tanggalEfektif === filterTanggal;
      return matchesSearch && matchesTipeJadwal && matchesTanggal;
    });
  }, [filterText, filterTipeJadwal, filterTanggal]);

//RETURN CLASS MAIN FUNCTION== 
  return (
    <div className="p-4 min-h-screen flex flex-col gap-4">
      {/* Second Section: Schedule Information */}
      <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
        <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
          
          {/* Data Tabel Header */}
          <DataTableHeader
            title="Informasi Jadwal"
            hasSearch={true}
            hasFilter={true}
            hasDateFilter={true}
            hasExport={true}
            hasImport={true}
            hasAdd={true}
            searchValue={filterText}
            onSearch={setFilterText}
            filterValue={filterTipeJadwal}
            onFilterChange={setFilterTipeJadwal}
            dateFilterValue={filterTanggal}
            onDateFilterChange={setFilterTanggal}
            filterOptions={jadwalFilters}
            onExport={handleExportCSV}
            onImport={handleImportCSV}
            onAdd={() => router.push("/jadwal/tambah")}
          />

          {/* Data Tabel Isi Jadwal */}
          <DataTable columns={jadwalColumns} data={filteredData}/>

        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedSchedule && (
        <>
          <div
            onClick={() => setIsDetailOpen(false)}
            className="fixed inset-0 bg-black opacity-50 z-40"
          />
          <div
            className="fixed top-0 right-0 h-screen w-[600px] bg-white border border-gray-300 rounded-l-lg shadow-lg z-50 p-5 font-sans overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[#1E3A5F] text-2xl font-bold mb-4 border-b border-gray-200 pb-2">
              Detail Jadwal
            </h2>

            <div className="bg-[#F9FAFB] border border-gray-200 rounded-lg p-3 mb-4 text-sm text-[#374151]">
              Jadwal efektif minimal jadwal kerja adalah --/--/----, karena
              harus sehari setelah atau sama dengan jadwal karyawan bekerja.
            </div>

            <label className="text-sm text-[#374151] mb-2 block">
              Berlaku efektif mulai tanggal
            </label>
            <div className="border border-gray-300 rounded-lg p-2 flex items-center mb-4">
              <span role="img" aria-label="calendar" className="mr-2">
                📅
              </span>
              {selectedSchedule.tanggalEfektif}
            </div>

            <table className="w-full border-collapse text-sm text-[#1E3A5F] border border-gray-200">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="p-2 border border-gray-200">Hari</th>
                  <th className="p-2 border border-gray-200">Jenis</th>
                  <th className="p-2 border border-gray-200">Clock In</th>
                  <th className="p-2 border border-gray-200">Clock Out</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Senin", "Hari Kerja", "08:00", "17:00"],
                  ["Selasa", "Hari Kerja", "08:00", "17:00"],
                  ["Rabu", "Hari Kerja", "08:00", "17:00"],
                  ["Kamis", "Hari Kerja", "08:00", "17:00"],
                  ["Jumat", "Hari Kerja", "08:00", "17:00"],
                  ["Sabtu", "Day Off", "00:00", "00:00"],
                  ["Minggu", "Day Off", "00:00", "00:00"],
                ].map(([hari, jenis, inTime, outTime], index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-2 border border-gray-200">{hari}</td>
                    <td className="p-2 border border-gray-200">{jenis}</td>
                    <td className="p-2 border border-gray-200">{inTime}</td>
                    <td className="p-2 border border-gray-200">{outTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="text-xs text-[#1E3A5F] mt-4 pl-5 py-3">
              <li>Hari libur nasional libur</li>
              <li>Cuti bersama libur</li>
              <li>Jam kerja tidak fleksibel</li>
              <li>Toleransi keterlambatan 30 menit</li>
            </ul>

            <button
              onClick={() => setIsDetailOpen(false)}
              className="mt-5 bg-[#1E3A5F] text-white py-2 px-4 rounded-lg font-bold"
            >
              Tutup
            </button>
          </div>
        </>
      )}
    </div>
  );
}
