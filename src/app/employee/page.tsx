"use client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
// import DataTable from "react-data-table-component";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Datatable";
import { RxAvatar } from "react-icons/rx";
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
  FaFileDownload,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaPlusCircle,
  FaFilter,
} from "react-icons/fa"; // Import the icons

// Objek Employee
type Employee = {
  id: number
  nama: string
  jenisKelamin: string
  notelp: string
  cabang: string
  jabatan: string
  status: string
  
}

// Dummy data employee berdasarkan objek/type yg dibuat
const dummyData: Employee[] = [
  {
    id: 1,
    nama: "Ahmad",
    jenisKelamin: "Laki-laki",
    notelp: "085850219981",
    cabang: "Malang",
    jabatan: "Manager",
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Luna Christina ajeng",
    jenisKelamin: "Perempuan",
    notelp: "085850219981",
    cabang: "Malang",
    jabatan: "Manager",
    status: "Aktif",
  },
  {
    id: 3,
    nama: "Didik Putra Utarlana Mahmud",
    jenisKelamin: "Laki-laki",
    notelp: "085850219981",
    cabang: "Malang",
    jabatan: "Manager",
    status: "Aktif",
  },
  {
    id: 4,
    nama: "Nirmala Sukma",
    jenisKelamin: "Perempuan",
    notelp: "085850219981",
    cabang: "Malang",
    jabatan: "Manager",
    status: "Aktif",
  },
];


export default function EmployeeTablePage() {
  const [filterText, setFilterText] = useState("");
  const [filterGender, setFilterGender] = useState(""); // ✅ pindahkan ke sini
  // const [statusData, setStatusData] = useState(employees);
  const router = useRouter();

  const navigateToAnotherPage = () => {
    router.push("/employee/tambah"); // Navigasi ke halaman lain
  };

  const navigateToDetailPage = (id: number) => {
    console.log("Navigating to detail page with id:", id); // Debugging untuk memastikan id ada
    router.push(`/employee/detail/${id}`);
  };

  // Start tabel berdasarkan data dummy
  const employeeColumns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: "No",
        header: "No",
        cell: ({ row }) => row.index + 1,
        size: 60,
      },
      {
        id: "Avatar",
        header: "Avatar",
        cell: () => (
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-lg">
            <RxAvatar/>
          </div>
        ),
      },
      {
        accessorKey: "nama",
        header: "Nama",
        cell:  info => (
          <div className="truncate max-w-[200px] min-w-[120px]">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "jenisKelamin",
        header: "Jenis Kelamin",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "notelp",
        header: "Nomor Telepon",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "cabang",
        header: "Cabang",
        cell: info=> info.getValue(),
      },
      {
        accessorKey: "jabatan",
        header: "Jabatan",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: info => (
          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
            {info.getValue() as String}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const data = row.original
          return (
            <div className="flex gap-2">
              <button
                title="Lihat"
                onClick={() => alert(`Lihat ${data.nama}`)}
                className="border border-blue-900 px-3 py-1 rounded text-blue-900 bg-white"
              >
                <FaFileDownload />
              </button>
              <button
                title="Edit"
                onClick={() => alert(`Edit ${data.nama}`)}
                className="border border-blue-900 px-3 py-1 rounded text-blue-900 bg-white"
              >
                <FaEdit />
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    title="Hapus"
                    className="border border-blue-900 px-3 py-1 rounded text-blue-900 bg-white"
                  >
                    <FaTrash />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah kamu yakin ingin menghapus data {data.nama}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => alert(`Hapus ${data.nama}`)}>
                      Ya, Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <div
      style={{ padding: 24, backgroundColor: "#f9fafb", minHeight: "100vh" }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
        >
          {[
            { label: "Periode", value: "Aug/2025" },
            { label: "Total Employee", value: "234 Employee" },
            { label: "Total New Hire", value: "12 Person" },
            { label: "Full Time Employee", value: "212 Full Time" },
          ].map((info, idx) => (
            <div key={idx} style={{ flex: 1, textAlign: "center" }}>
              <strong style={{ fontSize: 18 }}>{info.value}</strong>
              <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
                {info.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginTop: 24, // Menambahkan jarak dari atas
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.0)",
            marginTop: 24, // Menambahkan jarak dari atas
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.0)",
              marginTop: 0, // Menambahkan jarak dari atas
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                gap: 16, // Memberikan jarak antar elemen
                flexWrap: "wrap", // Membungkus elemen jika lebar layar kecil
              }}
            >
              {/* kontainer bagian judul dan button komponnen search filter dll  */}
              <div style={{ display: "flex", gap: 10, width: "100%" }}>
                <h3
                  style={{ fontSize: 18, fontWeight: "bold", color: "#1E3A5F" }}
                >
                  Semua Informasi Karyawan
                </h3>

                {/* Input pencarian */}

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
                  <div className="w-full md:flex-1">
                    <input
                      type="text"
                      placeholder="search here"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      className="w-full h-9 pl-[30px] pr-2 py-2 border border-[#1E3A5F] rounded-md text-sm"
                    />
                  </div>
                </div>

                {/* Tombol Filter, Export, Import, Tambah Data */}

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
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#1E3A5F",
                      outline: "none",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">All</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <button
                  onClick={() => alert("Export clicked")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    backgroundColor: "white",
                    border: "1px solid #1E3A5F", // Border biru
                    color: "#1E3A5F",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <FaCloudUploadAlt /> {/* Ikon Export */}
                  Export
                </button>

                <button
                  onClick={() => alert("Import clicked")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    backgroundColor: "white",
                    border: "1px solid #1E3A5F", // Border biru
                    color: "#1E3A5F",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <FaCloudDownloadAlt /> {/* Ikon Import */}
                  Import
                </button>

                {/* Tombol Tambah Data */}
                <button
                  onClick={navigateToAnotherPage}
                  type="button"
                  className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#155A8A] transition duration-200 ease-in-out shadow-md cursor-pointer"
                >
                  <FaPlusCircle className="text-lg" />
                  <span className="font-medium">Tambah Data</span>
                </button>
              </div>
            </div>
          </div>
        
          {/* <DataTable
            columns={columns}
            data={filteredEmployees}
            customStyles={{ rows: { style: { cursor: "pointer" } } }}
            onRowClicked={(row) => navigateToDetailPage(row.id)}  // Add this line
          /> */}
          <DataTable columns={employeeColumns} data={dummyData}/>

        </div>
      </div>
    </div>
  );
}
