"use client";

import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Datatable";
import { RxAvatar } from "react-icons/rx";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import EmployeeCardSum from "./component_employee/employee_card_sum";
import DataTableHeader from "@/components/DatatableHeader";

// Pindahkan tipe di luar komponen
type Employee = {
id: string;      
  nama: string;
  jenisKelamin: string;
  notelp: string;
  cabang: string;
  jabatan: string;
  status: string;
  hireDate: string;         // Added to match EmployeeCardSum type
  employmentType: string;   // Added to match EmployeeCardSum type
};



export default function EmployeeTablePage() {
  
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterText, setFilterText] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const employeeFilters = [
    { label: "Laki-laki", value: "Laki-laki" },
    { label: "Perempuan", value: "Perempuan" },
  ];

  const statusFilters = [
    { label: "active", value: "active" },
    { label: "inactive", value: "inactive" },
  ];
   const handleSoftDelete = async (id: number | string) => {
    if (!confirm("Apakah anda yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/employee/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menghapus data");
      }

      alert("Data berhasil dihapus (soft delete).");

      // **Update state employees dengan menghapus employee yang sudah softdelete**
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (error) {
      if (error instanceof Error) {
        alert(`Gagal menghapus data: ${error.message}`);
        console.error(error);
      } else {
        alert('Gagal menghapus data: Unknown error occurred');
        console.error('Unknown error:', error);
      }
    }
  };
  // Fetch data dari backend
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/employee", {
          next: { revalidate: 0 },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setEmployees(data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Style status untuk reuse
  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      Aktif: "bg-green-100 text-green-800",
      "Tidak Aktif": "bg-red-100 text-red-800",
    };
    return styles[status] ?? "bg-gray-100 text-gray-800";
  };

  const employeeColumns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: "No",
        header: "No",
        cell: ({ row }) => <div className="flex justify-center">{row.index + 1}</div>,
        size: 60,
      },
      {
        id: "Avatar",
        header: "Avatar",
        cell: () => (
          <div className="flex items-center justify-center text-lg">
            <RxAvatar size={24} />
          </div>
        ),
      },
      {
        accessorKey: "nama",
        header: "Nama",
        cell: (info) => <div className="truncate w-[120px]">{info.getValue() as string}</div>,
      },
      {
        accessorKey: "jenisKelamin",
        header: "Jenis Kelamin",
        cell: (info) => <div>{info.getValue() as string}</div>,
      },
      {
        accessorKey: "notelp",
        header: "Nomor Telepon",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "cabang",
        header: "Cabang",
        cell: (info) => <div className="truncate w-[80px]">{info.getValue() as string}</div>,
      },
      {
        accessorKey: "jabatan",
        header: "Jabatan",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <div className="flex justify-center w-[120px]">
              <span className={`px-2 py-1 text-xs rounded ${getStatusStyle(status)}`}>
                {status}
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
           <button
  title="Hapus"
  onClick={() => handleSoftDelete(data.id)} // Kirim id disini
  className="border border-red-600 px-3 py-1 rounded text-red-600 bg-[#f8f8f8] hover:bg-red-100"
>
  <FaTrash />
</button>

            </div>
          );
        },
      },
    ],
    [router]
  );

  // Export CSV
  const handleExportCSV = (dataToExport: Employee[]) => {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "employees_data.xlsx");
  };

  // Ref input file untuk reset
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Import CSV
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("File kosong");

        const workbook = XLSX.read(data, { type: "array" }); // gunakan 'array' untuk readAsArrayBuffer
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Employee>(worksheet);
        console.log("Imported data:", jsonData);
        alert("Import berhasil. Lihat console untuk data.");
        // Jika ingin langsung update state:
        // setEmployees(jsonData);
      } catch (error) {
        console.error("Error importing file:", error);
        alert("Error mengimpor file. Pastikan format benar.");
      } finally {
        // Reset input supaya bisa import ulang file sama
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Filter data sesuai filter user
  const filteredData = useMemo(() => {
    return employees.filter((item) => {
      const nama = item.nama ?? "";
      const cabang = item.cabang ?? "";
      const jabatan = item.jabatan ?? "";

      const matchesSearch =
        nama.toLowerCase().includes(filterText.toLowerCase()) ||
        cabang.toLowerCase().includes(filterText.toLowerCase()) ||
        jabatan.toLowerCase().includes(filterText.toLowerCase());

      const matchesGender = !filterGender || item.jenisKelamin === filterGender;
      const matchesStatus = !filterStatus || item.status === filterStatus;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [employees, filterText, filterGender, filterStatus]);

  
  return (
    <div className="px-2 py-4 min-h-screen flex flex-col gap-4">
      <EmployeeCardSum employees={employees} />

      <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
        <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
          {loading && <p>Loading data...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}

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
            onExport={() => handleExportCSV(filteredData)}
            onImport={handleImportCSV}
            onAdd={() => router.push("/employee/tambah")}
            importInputRef={fileInputRef}
          />

          <DataTable columns={employeeColumns} data={filteredData} />
        </div>
      </div>
    </div>
  );
}
