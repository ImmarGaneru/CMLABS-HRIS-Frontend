"use client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlusCircle,
  FaFilter,
  FaEye,
} from "react-icons/fa";

const schedules = [
  {
    id: 1,
    namaJadwal: "Jadwal Kantor",
    hariKerja: "5 Hari",
    jamKerja: "180 h",
    tanggalEfektif: "01/01/2025",
  },
  {
    id: 2,
    namaJadwal: "Shift Pagi",
    hariKerja: "6 Hari",
    jamKerja: "200 h",
    tanggalEfektif: "01/01/2025",
  },
  {
    id: 3,
    namaJadwal: "Shift Malam",
    hariKerja: "5 Hari",
    jamKerja: "180 h",
    tanggalEfektif: "01/01/2025",
  },
  {
    id: 4,
    namaJadwal: "Kontrak 6 bulan",
    hariKerja: "4 Hari",
    jamKerja: "160 h",
    tanggalEfektif: "01/01/2025",
  },
];

export default function JadwalTablePage() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [filterHari, setFilterHari] = useState("");
  const [filteredData, setFilteredData] = useState(schedules);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  type Schedule = {
    id: number;
    namaJadwal: string;
    hariKerja: string;
    jamKerja: string;
    tanggalEfektif: string;
  };

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  useEffect(() => {
    let filtered = schedules;

    if (filterText) {
      filtered = filtered.filter((item) =>
        item.namaJadwal.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    if (filterHari) {
      filtered = filtered.filter((item) => item.hariKerja === filterHari);
    }

    setFilteredData(filtered);
  }, [filterText, filterHari]);

  const navigateToDetailPage = (id: number) => {
    router.push(`/jadwal/detail/${id}`);
  };

  const navigateToAddPage = () => {
    router.push("/jadwal/tambah");
  };

  const columns = useMemo(
    () => [
      {
        name: "No",
        selector: (row: { id: number }) => row.id,
        width: "60px",
      },
      {
        name: "Nama Jadwal",
        selector: (row: { namaJadwal: string }) => row.namaJadwal,
        sortable: true,
      },
      {
        name: "Hari Kerja",
        selector: (row: { hariKerja: string }) => row.hariKerja,
      },
      {
        name: "Work Hours (month)",
        selector: (row: { jamKerja: string }) => row.jamKerja,
      },
      {
        name: "Tanggal Efektif",
        selector: (row: { tanggalEfektif: string }) => row.tanggalEfektif,
      },
      {
        name: "Action",
        cell: (row: { id: number }) => (
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Here, you need to make sure that `row` has the full `Schedule` data
                const fullSchedule = {
                  id: row.id,
                  namaJadwal: "Example Schedule", // Replace with actual data
                  hariKerja: "Monday", // Replace with actual data
                  jamKerja: "09:00 - 17:00", // Replace with actual data
                  tanggalEfektif: "2025-01-01", // Replace with actual data
                };
                setSelectedSchedule(fullSchedule); // Now, this matches the `Schedule` type
                setIsDetailOpen(true);
              }}
              className="bg-white border border-[#1E3A5F] p-2 rounded text-[#1E3A5F] cursor-pointer"
            >
              <FaEye />
            </button>

            <button
              onClick={() => navigateToDetailPage(row.id)}
              className="bg-white border border-[#1E3A5F] p-2 rounded text-[#1E3A5F] cursor-pointer"
            >
              <FaEdit />
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="bg-white border border-[#1E3A5F] p-2 rounded text-[#1E3A5F] cursor-pointer">
                  <FaTrash />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Data jadwal ini akan dihapus secara permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => console.log("Deleting ID:", row.id)}
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
        width: "200px",
      },
    ],
    []
  );

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      {/* Title and Action Bar */}
      <div className="flex flex-wrap gap-2 mb-20 justify-between items-center mt-10">
        <h3 className="text-lg font-semibold text-[#1E3A5F]">
          Semua Jadwal Kerja
        </h3>

        <div className="flex gap-2 flex-wrap w-full sm:w-auto justify-end">
          {/* Search Input */}
          <div className="relative w-full sm:w-1/3">
            <FaSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari jadwal..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full h-10 pl-8 pr-2 py-2 border border-[#1E3A5F] rounded-md text-sm"
            />
          </div>

          {/* Filter Hari Kerja */}
          <div className="flex items-center gap-2 p-2 border border-[#1E3A5F] rounded text-[#1E3A5F] w-full sm:w-1/4">
            <FaFilter />
            <select
              value={filterHari}
              onChange={(e) => setFilterHari(e.target.value)}
              className="bg-transparent border-none outline-none text-[#1E3A5F] cursor-pointer text-sm w-full"
            >
              <option value="">Semua</option>
              <option value="4 Hari">4 Hari</option>
              <option value="5 Hari">5 Hari</option>
              <option value="6 Hari">6 Hari</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={navigateToAddPage}
            className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#155A8A] transition duration-200 ease-in-out shadow-md w-full sm:w-auto"
          >
            <FaPlusCircle className="text-lg" />
            <span className="font-medium">Tambah Data</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="relative bg-white rounded-xl p-4 shadow-md">
        <DataTable columns={columns} data={filteredData} pagination />
      </div>

      {isDetailOpen && selectedSchedule && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setIsDetailOpen(false)}
            className="fixed inset-0 bg-black opacity-50 z-40"
          />

          {/* Panel detail */}
          <div
            className="fixed top-0 right-0 h-screen w-[600px] bg-white border border-gray-300 rounded-l-lg shadow-lg z-50 p-5 font-sans overflow-auto"
            onClick={(e) => e.stopPropagation()} // Supaya klik dalam panel tidak menutup panel
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
              {selectedSchedule.tanggalEfektif || "27/04/2025"}
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
