"use client";

import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Datatable";
import { RxAvatar } from "react-icons/rx";
import { FaEdit, FaEye } from "react-icons/fa";
import EmployeeCardSum from "./component_employee/employee_card_sum";
import DataTableHeader from "@/components/DatatableHeader";


export default function EmployeeTablePage() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const employeeFilters = [
    {label: 'Laki-laki', value: 'Laki-laki'},
    {label: 'Perempuan', value: 'Perempuan'},
  ];

  const statusFilters = [
    {label: 'Aktif', value: 'Aktif'},
    {label: 'Tidak Aktif', value: 'Tidak Aktif'},
  ];

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

  // Kolom tabel Employee
  const employeeColumns = useMemo<ColumnDef<Employee>[]>(
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
        id: "Avatar",
        header: "Avatar",
        cell: () => (
          <div className="flex items-center justify-center text-lg bg">
              <RxAvatar size={24}/>
          </div>
        ),
      },
      {
        accessorKey: "nama",
        header: "Nama",
        cell:  info => (
          <div className="truncate w-[120px]">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "jenisKelamin",
        header: "Jenis Kelamin",
        cell: info => 
          <div>
            {info.getValue() as String}
          </div>
      },
      {
        accessorKey: "notelp",
        header: "Nomor Telepon",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "cabang",
        header: "Cabang",
        cell: info=> (
          <div className="truncate w-[80px]">
            {info.getValue() as String}
          </div>
      ),
      },
      {
        accessorKey: "jabatan",
        header: "Jabatan",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: info => {
          const status = info.getValue() as string;

          //Mapping jenis status
          const statusStyle: Record<string, string> = {
            "Aktif": "bg-green-100 text-green-800",
            "Tidak Aktif": "bg-red-100 text-red-800",
          };
          return(
          <div className="flex justify-center w-[120px]">
            <span className={`px-2 py-1 text-xs rounded ${statusStyle[status] ?? "bg-gray-100 text-gray-800"}`}>
              {info.getValue() as String}
            </span>
          </div>
          );
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const data = row.original
          return (
            <div className="flex gap-2">
              <button
                title="Detail"
                onClick={() => router.push(`/employee/detail/${data.id}`)}
                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
              >
                <FaEye />
              </button>
              <button
                title="Edit"
                onClick={() => router.push(`/employee/edit/${data.id}`)}
                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
              >
                <FaEdit />
              </button>
            </div>
          )
        },
      },
    ],
    []
  )

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
      nama: "Luna Christina Ajeng",
      jenisKelamin: "Perempuan",
      notelp: "085850219981",
      cabang: "Malang Selatan",
      jabatan: "Manager",
      status: "Aktif",
    },
    {
      id: 3,
      nama: "Didik Putra Utarlana Mahmud",
      jenisKelamin: "Laki-laki",
      notelp: "085850219981",
      cabang: "Surabaya",
      jabatan: "CEO",
      status: "Tidak Aktif",
    },
    {
      id: 4,
      nama: "Nirmala Sukma",
      jenisKelamin: "Perempuan",
      notelp: "085850219981",
      cabang: "Malang Kabupaten",
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
    {
      id: 4,
      nama: "Nirmala Sukma",
      jenisKelamin: "Perempuan",
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
    {
      id: 4,
      nama: "Nirmala Sukma",
      jenisKelamin: "Perempuan",
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

//FUNGSI-FUNGSI FILTER==

  // Function to handle CSV export
  const handleExportCSV = () => {
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(dummyData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    
    // Generate and download file
    XLSX.writeFile(workbook, "employees_data.xlsx");
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
          
          // Here you would typically update your data state with the imported data
          console.log('Imported data:', jsonData);
          // TODO: Add your data update logic here
        } catch (error) {
          console.error('Error importing file:', error);
          alert('Error importing file. Please check the file format.');
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  // Filter data based on search text, gender and status
  const filteredData = useMemo(() => {
    return dummyData.filter((item) => {
      const matchesSearch = item.nama.toLowerCase().includes(filterText.toLowerCase()) ||
                          item.cabang.toLowerCase().includes(filterText.toLowerCase()) ||
                          item.jabatan.toLowerCase().includes(filterText.toLowerCase());
      const matchesGender = !filterGender || item.jenisKelamin === filterGender;
      const matchesStatus = !filterStatus || item.status === filterStatus;
      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [filterText, filterGender, filterStatus]);

//END FUNGSI-FUNGSI FILTER==

//RETURN CLASS MAIN FUNCTION==
  return (
    <div className="px-2 py-4 min-h-screen flex flex-col gap-4">

      {/* Label card informasi data karyawan bagian atas */}
      <EmployeeCardSum/>
      
      {/* Second Section: Employee Information */}
      <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
        <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
          {/* Tabel Halaman Start */}

            {/* Data Tabel Header */}
            <DataTableHeader
              title="Data Karyawan"
              hasSearch={true}
              hasFilter={true}
              hasSecondFilter={true}
              hasExport={true}
              hasImport={true}
              hasAdd={true}
              searchValue={filterText}
              onSearch={setFilterText}
              filterValue={filterGender}
              onFilterChange={setFilterGender}
              secondFilterValue={filterStatus}
              onSecondFilterChange={setFilterStatus}
              filterOptions={employeeFilters}
              secondFilterOptions={statusFilters}
              onExport={handleExportCSV}
              onImport={handleImportCSV}
              onAdd={() => router.push("/employee/tambah")}
            />

            {/* Data Tabel Isi Karyawan Menggunakan Component DataTable dummy */}
            <DataTable columns={employeeColumns} data={filteredData}/>

          {/* Tabel Halaman End */}
        </div>
      </div>
    </div>
  );

}