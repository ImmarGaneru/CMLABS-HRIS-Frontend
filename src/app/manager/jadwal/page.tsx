"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useAttendance, CheckClockSetting } from "@/contexts/AttendanceContext";
import { Overlay } from "@radix-ui/react-dialog";
import OverlaySpinner from "@/components/OverlaySpinner";
import { toast, Toaster } from "sonner";

export default function JadwalTablePage() {
  const { checkClockSettings, deleteCheckClockSetting } = useAttendance();
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterTipeJadwal] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSetting, setSelectedSchedule] = useState<CheckClockSetting | null>(null);

  const jadwalFilters = [
    { label: 'WFO', value: 'WFO' },
    { label: 'WFA', value: 'WFA' },
    { label: 'Hybrid', value: 'Hybrid' },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const shouldLoading = () => {
    return checkClockSettings === null || isLoading;
  }

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
                title="Edit"
                onClick={() => router.push(`/manager/jadwal/edit?id=${data.id}`)}
                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
              >
                <FaEdit />
              </button>
              <button
                title="Delete"
                onClick={() => {
                  setIsLoading(true);
                  deleteCheckClockSetting(data.id).then(() => {
                    setIsLoading(false);
                  });
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

  // Filter data based on search text, tipe jadwal, and tanggal
  const filteredData = useMemo(() => {
    if (!filterText && !filterType) {
      return checkClockSettings;
    }
    return (checkClockSettings ?? []).filter((item) => {
      const matchesText = item.name.toLowerCase().includes(filterText.toLowerCase());
      const matchesType = filterType ? item.type === filterType : true;
      // const matchesDate = filterTanggal ? item.tanggalEfektif === filterTanggal : true; // Uncomment if date filtering is implemented
      return matchesText && matchesType; // && matchesDate; // Uncomment if date filtering is implemented
    });
  }, [checkClockSettings, filterText, filterType]);
  //RETURN CLASS MAIN FUNCTION== 
  return (
    <div className="px-2 py-4 min-h-screen flex flex-col gap-4">
      <OverlaySpinner isLoading={shouldLoading()} />
      {/* Second Section: Schedule Information */}
      <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
        <Toaster />
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
            onAdd={() => router.push("/manager/jadwal/tambah")}
          />

          {/* Data Tabel Isi Jadwal */}
          <DataTable columns={jadwalColumns} data={filteredData ?? []} />

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
