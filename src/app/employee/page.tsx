"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState, useRef } from "react";
import { FaCloudUploadAlt, FaFileDownload, FaEdit, FaTrash, FaSearch, FaCloudDownloadAlt, FaPlusCircle, FaFilter } from "react-icons/fa";
import * as XLSX from "xlsx";
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

// Definisikan tipe data untuk Employee
interface Employee {
  id: number;
  nama: string;
  jenisKelamin: string;
  nomor: string;
  cabang: string;
  jabatan: string;
  status: boolean;
}

// Data awal karyawan
const employees: Employee[] = [
  { id: 1, nama: "Ahmad", jenisKelamin: "Laki-laki", nomor: "085850219981", cabang: "Malang", jabatan: "Manager", status: true },
  { id: 2, nama: "Luna Christina aj", jenisKelamin: "Perempuan", nomor: "085850219981", cabang: "Malang", jabatan: "Manager", status: true },
  { id: 3, nama: "Didik Putra Utar", jenisKelamin: "Laki-laki", nomor: "085850219981", cabang: "Malang", jabatan: "Manager", status: true },
  { id: 4, nama: "Nirmala Sukma", jenisKelamin: "Perempuan", nomor: "085850219981", cabang: "Malang", jabatan: "Manager", status: false },
];

export default function EmployeeTablePage() {
  const [filterText, setFilterText] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [statusData, setStatusData] = useState<Employee[]>(employees);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // parsing logic
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(statusData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data-export.xlsx");
  };

  const navigateToAnotherPage = () => router.push("/employee/tambah");

  const filteredEmployees = statusData.filter(
    (item) =>
      item.nama.toLowerCase().includes(filterText.toLowerCase()) &&
      (filterGender === "" || item.jenisKelamin === filterGender)
  );

  const toggleStatus = (id: number) => {
    setStatusData((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status: !emp.status } : emp))
    );
  };

  const columns = useMemo(
    () => [
      { name: "No", selector: (row: Employee) => row.id, width: "60px" },
      { name: "Avatar", cell: () => <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-lg">👤</div>,width: "80px",},
      { name: "Nama", selector: (row: Employee) => row.nama, sortable: true },
      { name: "Jenis Kelamin", selector: (row: Employee) => row.jenisKelamin, sortable: true },
      { name: "Nomor Telepon", selector: (row: Employee) => row.nomor },
      { name: "Cabang", selector: (row: Employee) => row.cabang },
      { name: "Jabatan", selector: (row: Employee) => row.jabatan },
      {
        name: "Status",
        cell: (row: Employee) => (
          <label className="inline-block w-10 h-5 relative">
            <input
              type="checkbox"
              checked={row.status}
              onChange={() => toggleStatus(row.id)}
              className="opacity-0 w-0 h-0"
            />
            <span className={`absolute top-0 left-0 right-0 bottom-0 rounded-full transition-all ${row.status ? 'bg-green-600' : 'bg-red-600'}`}>
              <span
                className={`absolute h-4 w-4 bottom-0.5 bg-white rounded-full transition-all ${row.status ? 'left-5' : 'left-1'}`}
              ></span>
            </span>
          </label>
        ),
        width: "100px",
      },
      {
        name: "Action",
        cell: (row: Employee) => (
          <div className="flex gap-2">
            <button
              title="Lihat"
              onClick={() => alert(`Lihat ${row.nama}`)}
              className="bg-white border border-blue-900 text-blue-900 px-3 py-1 rounded"
            >
              <FaFileDownload />
            </button>
            <button
              title="Edit"
              onClick={() => alert(`Edit ${row.nama}`)}
              className="bg-white border border-blue-900 text-blue-900 px-3 py-1 rounded"
            >
              <FaEdit />
            </button>
            <AlertDialog>
              <AlertDialogTrigger>
                <button className="bg-white border border-blue-900 text-blue-900 px-3 py-1 rounded">
                  <FaTrash />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
      },
    ],
    [statusData]
  );

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
