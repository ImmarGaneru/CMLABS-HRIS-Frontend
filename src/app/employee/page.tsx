"use client";

import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
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
  <div className="p-4 bg-gray-100 min-h-screen flex flex flex-col gap-4">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between gap-4">
          {[{ label: "Periode", value: "Aug/2025" },
            { label: "Total Employee", value: "234 Employee" },
            { label: "Total New Hire", value: "12 Person" },
            { label: "Full Time Employee", value: "212 Full Time" }].map((info, idx) => (
              <div key={idx} className="flex-1 text-center">
                <strong className="text-xl">{info.value}</strong>
                <p className="text-sm text-gray-500">{info.label}</p>
              </div>
          ))}
        </div>
        </div>

    {/* Second Section: Employee Information */}
    <div className="bg-white rounded-xl p-8 shadow-md mt-6">
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <div className="flex gap-4 w-full">
          <h3 className="text-xl font-bold text-[#1E3A5F]">Semua Informasi Karyawan</h3>

          {/* Input pencarian */}
          <div className="relative flex-1">
            <FaSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="search here"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full h-9 pl-8 pr-2 py-2 border border-[#1E3A5F] rounded-md text-sm"
            />
          </div>

          {/* Tombol Filter, Export, Import, Tambah Data */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white border border-[#1E3A5F] text-[#1E3A5F] flex items-center gap-2">
              <FaFilter />
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="border-none bg-transparent text-[#1E3A5F] outline-none text-sm cursor-pointer"
              >
                <option value="">All</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#1E3A5F] text-[#1E3A5F] cursor-pointer"
            >
              <FaCloudUploadAlt />
              Export
            </button>

            <button
              onClick={handleImport}
              className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#1E3A5F] text-[#1E3A5F] cursor-pointer"
            >
              <FaCloudDownloadAlt />
              Import
            </button>

            {/* Input file disembunyikan, tapi tetap ada di DOM */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

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
        
          {/* <DataTable
            columns={columns}
            data={filteredEmployees}
            customStyles={{ rows: { style: { cursor: "pointer" } } }}
            onRowClicked={(row) => navigateToDetailPage(row.id)}  // Add this line
          /> */}
          <DataTable columns={employeeColumns} data={dummyData}/>
        </div>
      </div>

      {/* Tabel Karyawan and Buttons in One Box */}
      <div className="bg-white rounded-xl p-4 shadow-md mt-6">
        <DataTable
          columns={columns}
          data={filteredEmployees}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  </div>
);

}
