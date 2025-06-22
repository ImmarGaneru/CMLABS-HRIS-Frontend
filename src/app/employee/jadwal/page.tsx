"use client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useAttendance, CheckClockSetting } from "@/contexts/AttendanceContext";

export default function JadwalTablePage() {
  const { checkClockSettings, deleteCheckClockSetting } = useAttendance();
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterTipeJadwal] = useState("");
  const [filterTanggal] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSetting, setSelectedSchedule] = useState<CheckClockSetting | null>(null);

  const jadwalFilters = [
    { label: 'WFO', value: 'WFO' },
    { label: 'WFH', value: 'WFH' }
  ];

  //Kolom untuk Tabel jadwal
  const jadwalColumns = useMemo<ColumnDef<CheckClockSetting>[]>(
    () => [
      {
        id: "settingNo",
        header: "No",
        cell: ({ row }) => (
          <div className="flex justify-center">
            {row.index + 1}
          </div>
        ),
        size: 60,
      },
      {
        accessorKey: "name",
        header: "Setting Name",
        cell: info => (
          <div className="flex justify-center">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Setting Type",
        cell: info => (
          <div className="flex justify-center">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const data = row.original;
          return (
            <div className="flex gap-2 justify-center">
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
                onClick={() => router.push(`/employee/jadwal/edit/${data.id}`)}
                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
              >
                <FaEdit />
              </button>
              <button
                title="Delete"
                onClick={() => {
                  deleteCheckClockSetting(data.id);
                }}
                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
              >
                <FaTrash />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  // Dummy data schedule berdasarkan type Schedule
  // const schedulesData: Schedule[] = [
  //   {
  //     id: 1,
  //     namaJadwal: "Jadwal Kantor",
  //     hariKerja: "5 Hari",
  //     jamKerja: "180 h",
  //     tanggalEfektif: "01/01/2025",
  //     tipeJadwal: "WFO",
  //   },
  //   {
  //     id: 2,
  //     namaJadwal: "Shift Pagi",
  //     hariKerja: "6 Hari",
  //     jamKerja: "200 h",
  //     tanggalEfektif: "01/01/2025",
  //     tipeJadwal: "WFO",
  //   },
  //   {
  //     id: 3,
  //     namaJadwal: "Shift Malam",
  //     hariKerja: "5 Hari",
  //     jamKerja: "180 h",
  //     tanggalEfektif: "01/01/2025",
  //     tipeJadwal: "WFO",
  //   },
  //   {
  //     id: 4,
  //     namaJadwal: "Kontrak 6 bulan",
  //     hariKerja: "4 Hari",
  //     jamKerja: "160 h",
  //     tanggalEfektif: "01/01/2025",
  //     tipeJadwal: "WFH",
  //   },
  // ];

  //FUNGSI-FUNGSI FILTER==

  // Function to handle CSV export
  // const handleExportCSV = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(schedulesData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Schedules");
  //   XLSX.writeFile(workbook, "schedules_data.xlsx");
  // };

  // Function to handle CSV import
  // const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       try {
  //         const data = e.target?.result;
  //         const workbook = XLSX.read(data, { type: 'binary' });
  //         const sheetName = workbook.SheetNames[0];
  //         const worksheet = workbook.Sheets[sheetName];
  //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
  //         console.log('Imported data:', jsonData);
  //       } catch (error) {
  //         console.error('Error importing file:', error);
  //         alert('Error importing file. Please check the file format.');
  //       }
  //     };
  //     reader.readAsBinaryString(file);
  //   }
  // };

  // Filter data based on search text, tipe jadwal, and tanggal
  const filteredData = useMemo(() => {
    if (!filterText && !filterType) {
      return checkClockSettings;
    }
    return checkClockSettings.filter((item) => {
      const matchesText = item.name.toLowerCase().includes(filterText.toLowerCase());
      const matchesType = filterType ? item.type === filterType : true;
      // const matchesDate = filterTanggal ? item.tanggalEfektif === filterTanggal : true; // Uncomment if date filtering is implemented
      return matchesText && matchesType; // && matchesDate; // Uncomment if date filtering is implemented
    });
  }, [checkClockSettings, filterText, filterType]);
  //RETURN CLASS MAIN FUNCTION== 
  return (
    <div className="px-2 py-4 min-h-screen flex flex-col gap-4">
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
            filterValue={filterType}
            onFilterChange={setFilterTipeJadwal}
            // dateFilterValue={filterTanggal}
            // onDateFilterChange={setFilterTanggal}
            filterOptions={jadwalFilters}
            // onExport={handleExportCSV}
            // onImport={handleImportCSV}
            onAdd={() => router.push("/employee/jadwal/tambah")}
          />

          {/* Data Tabel Isi Jadwal */}
          <DataTable columns={jadwalColumns} data={filteredData} />

        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedSetting && (
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
            {/* <div className="border border-gray-300 rounded-lg p-2 flex items-center mb-4">
              <span role="img" aria-label="calendar" className="mr-2">
                📅
              </span>
              {selectedSetting.tanggalEfektif}
            </div> */}

            <table className="w-full border-collapse text-sm text-[#1E3A5F] border border-gray-200">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="p-2 border border-gray-200">Hari</th>
                  <th className="p-2 border border-gray-200">Clock In</th>
                  <th className="p-2 border border-gray-200">Break Start</th>
                  <th className="p-2 border border-gray-200">Break End</th>
                  <th className="p-2 border border-gray-200">Clock Out</th>
                </tr>
              </thead>
              <tbody>
                {
                  selectedSetting.check_clock_setting_time.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-2 border border-gray-200">{item.day}</td>
                      <td className="p-2 border border-gray-200">{item.clock_in}</td>
                      <td className="p-2 border border-gray-200">{item.break_start}</td>
                      <td className="p-2 border border-gray-200">{item.break_end}</td>
                      <td className="p-2 border border-gray-200">{item.clock_out}</td>
                    </tr>
                  ))
                }
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