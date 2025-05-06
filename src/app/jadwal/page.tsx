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
          <div style={{ display: "flex", gap: "10px" }}>
         <button
  onClick={() => {
    // Here, you need to make sure that `row` has the full `Schedule` data
    const fullSchedule = {
      id: row.id,
      namaJadwal: "Example Schedule", // Replace with actual data
      hariKerja: "Monday",            // Replace with actual data
      jamKerja: "09:00 - 17:00",     // Replace with actual data
      tanggalEfektif: "2025-01-01",  // Replace with actual data
    };
    setSelectedSchedule(fullSchedule);  // Now, this matches the `Schedule` type
    setIsDetailOpen(true);
  }}
  style={{
    backgroundColor: "white",
    border: "1px solid #1E3A5F",
    padding: "6px 12px",
cursor: "pointer",
    borderRadius: 6,
    color: "#1E3A5F",
  }}
>
  <FaEye />
</button>

            <button
              onClick={() => navigateToDetailPage(row.id)}
              style={{
                backgroundColor: "white",
                border: "1px solid #1E3A5F",
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
                color: "#1E3A5F",
              }}
            >
              <FaEdit />
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #1E3A5F",
                    padding: "6px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: "#1E3A5F",
                  }}
                >
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
    <div
      style={{ padding: 24, backgroundColor: "#f9fafb", minHeight: "100vh" }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: "bold", color: "#1E3A5F" }}>
            Semua Jadwal Kerja
          </h3>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1 }}>
            {/* Search Input */}
            <div style={{ position: "relative", flex: 1 }}>
              <FaSearch
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  color: "#6b7280",
                }}
              />
              <input
                type="text"
                placeholder="Cari jadwal..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full h-10 pl-[30px] pr-2 py-2 border border-[#1E3A5F] rounded-md text-sm"
              />
            </div>

            {/* Filter Hari Kerja */}
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                backgroundColor: "white",
                border: "1px solid #1E3A5F",
                color: "#1E3A5F",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FaFilter />
              <select
                value={filterHari}
                onChange={(e) => setFilterHari(e.target.value)}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#1E3A5F",
                  outline: "none",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="">Semua</option>
                <option value="4 Hari">4 Hari</option>
                <option value="5 Hari">5 Hari</option>
                <option value="6 Hari">6 Hari</option>
              </select>
            </div>

            {/* Tombol Tambah */}
            <button
              onClick={navigateToAddPage}
              type="button"
              className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#155A8A] transition duration-200 ease-in-out shadow-md cursor-pointer"
            >
              <FaPlusCircle className="text-lg" />
              <span className="font-medium">Tambah Data</span>
            </button>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <DataTable
            columns={columns}
            data={filteredData}
          
            pagination
          />
        </div>
        {isDetailOpen && selectedSchedule && (
  <>
    {/* Overlay abu-abu gelap */}
    <div
      onClick={() => setIsDetailOpen(true)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)", //agar bg nya warna abu abu
        zIndex: 40,
      }}
    />

    {/* Panel detail */}
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        width: 600,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px 0 0 0",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        zIndex: 50,
        padding: 20,
        fontFamily: "Arial, sans-serif",
        overflow: "auto",
      }}
      onClick={(e) => e.stopPropagation()} // Supaya klik dalam panel tidak menutup panel
    >
      <h2
        style={{
          color: "#1E3A5F",
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
          borderBottom: "1px solid #E5E7EB",
          paddingBottom: 8,
        }}
      >
        Detail Jadwal
      </h2>

      <div
        style={{
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: 6,
          padding: 12,
          marginBottom: 16,
          fontSize: 14,
          color: "#374151",
        }}
      >
        Jadwal efektif minimal jadwal kerja adalah --/--/----, karena harus sehari setelah atau sama dengan jadwal karyawan bekerja.
      </div>

      <label
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 8,
          display: "block",
        }}
      >
        Berlaku efektif mulai tanggal
      </label>
      <div
        style={{
          border: "1px solid #D1D5DB",
          borderRadius: 6,
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <span role="img" aria-label="calendar" style={{ marginRight: 10 }}>
          📅
        </span>
        {selectedSchedule.tanggalEfektif || "27/04/2025"}
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          color: "#1E3A5F",
          border: "1px solid #E5E7EB",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #E5E7EB", textAlign: "left" }}>
            <th style={{ padding: "8px", border: "1px solid #E5E7EB" }}>Hari</th>
            <th style={{ padding: "8px", border: "1px solid #E5E7EB" }}>Jenis</th>
            <th style={{ padding: "8px", border: "1px solid #E5E7EB" }}>Clock In</th>
            <th style={{ padding: "8px", border: "1px solid #E5E7EB" }}>Clock Out</th>
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
            <tr key={index} style={{ borderBottom: "1px solid #E5E7EB" }}>
              <td style={{ padding: "8px", border: "1px solid #E5E7EB" }}>{hari}</td>
              <td style={{ padding: "8px", border: "1px solid #E5E7EB" }}>{jenis}</td>
              <td style={{ padding: "8px", border: "1px solid #E5E7EB" }}>{inTime}</td>
              <td style={{ padding: "8px", border: "1px solid #E5E7EB" }}>{outTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul
        style={{
          fontSize: 13,
          color: "#1E3A5F",
          marginTop: 16,
          paddingLeft: 18,
          padding: "10px",
        }}
      >
        <li>Hari libur nasional libur</li>
        <li>Cuti bersama libur</li>
        <li>Jam kerja tidak fleksibel</li>
        <li>Toleransi keterlambatan 30 menit</li>
      </ul>

      <button
        onClick={() => setIsDetailOpen(false)}
        style={{
          marginTop: 20,
          backgroundColor: "#1E3A5F",
          color: "white",
          padding: "10px 16px",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Tutup
      </button>
    </div>
  </>
)}

      </div>
    </div>
  );
}
