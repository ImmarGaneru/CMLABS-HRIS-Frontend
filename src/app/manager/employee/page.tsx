"use client";

import { useRouter } from "next/navigation";
import { FEEmployee } from "@/types/employee";
import * as XLSX from "xlsx";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Datatable";
import { RxAvatar } from "react-icons/rx";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import EmployeeCardSum from "./component_employee/employee_card_sum";
import DataTableHeader from "@/components/DatatableHeader";
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
import api from "@/lib/axios";
// import { Email } from "@mui/icons-material";

type Employee = {
  id_user: string;
  jenis_kelamin: string;
  id: string;
  first_name: string;
  last_name: string;
  employment_status: "active" | "inactive" | "resign";
  created_at: string;
  address: string;
  id_position: string | null;
  tipe_kontrak: string | null;

  // tambahan
  user?: { email: string };
  position?: { name: string };
  no_telp: string;
  cabang: string;
  jabatan: string;
};

export default function EmployeeTablePage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<FEEmployee[]>([]);
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
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/employee/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menghapus data");
      }

      // Update state untuk menghapus employee yang sudah dihapus
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (error) {
      let errorMessage = "Gagal menghapus data";

      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage += `: ${(error as { message: string }).message}`;
      }

      alert(errorMessage);
      console.error(error);
    }
  };

  // Fetch data dari backend
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/admin/employees/comp-employees");
        
        const feData = res.data.data.map((emp: Employee) => ({
          id: emp.id,
          id_user: emp.id_user,
          nama: `${emp.first_name} ${emp.last_name}`,
          jenis_kelamin: emp.jenis_kelamin,
          no_telp: emp.no_telp || "-",
          cabang: emp.cabang || "-",
          jabatan: emp.jabatan || "-",
          status: emp.employment_status,
          Email: emp.user?.email || "-",

          // hireDate: emp.created_at,
          // employmentType: emp.tipe_kontrak || "-",
        }));

        setEmployees(feData);
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
      "Non-Aktif": "bg-red-100 text-red-800",
      Resign: "bg-gray-100 text-gray-800",
    };
    return styles[status] ?? "bg-gray-100 text-gray-800";
  };

  const employeeColumns = useMemo<ColumnDef<FEEmployee>[]>(
    () => [
      {
        id: "No",
        header: "No",
        cell: ({ row }) => (
          <div className="flex justify-center">{row.index + 1}</div>
        ),
        size: 20,
      },
      {
        id: "Avatar",
        header: "Avatar",
        cell: () => (
          <div className="flex items-center justify-center text-lg">
            <RxAvatar size={24} />
          </div>
        ),
        size: 40,
      },
      {
        accessorKey: "nama",
        header: "Nama",
        cell: (info) => (
          <div className="truncate max-w-[120px]">
            {info.getValue() as string}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "jenis_kelamin",
        header: "Jenis Kelamin",
        cell: (info) => (
          <div className="truncate max-w-[100px]">
            {info.getValue() as string}
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "no_telp",
        header: "Nomor Telepon",
        cell: (info) => (
          <div className="truncate max-w-[120px]">
            {info.getValue() as string}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "cabang",
        header: "Cabang",
        cell: (info) => (
          <div className="truncate max-w-[100px]">
            {info.getValue() as string}
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "jabatan",
        header: "Jabatan",
        cell: (info) => (
          <div className="truncate max-w-[120px]">
            {info.getValue() as string}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as "active" | "inactive";

          let displayStatus = "Unknown";
          if (status === "active") displayStatus = "Aktif";
          else if (status === "inactive") displayStatus = "inactive";

          return (
            <div className="flex justify-center w-[100px]">
              <span
                className={`px-2 py-1 text-xs rounded ${getStatusStyle(
                  displayStatus
                )}`}
              >
                {displayStatus}
              </span>
            </div>
          );
        },
        size: 100,
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const data = row.original;
          return (
            <div className="flex gap-2 justify-center w-[120px]">
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    title="Hapus"
                    className="border border-red-600 px-3 py-1 rounded text-red-600 bg-[#f8f8f8] hover:bg-red-100"
                  >
                    <FaTrash />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Yakin menghapus data ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Data yang sudah dihapus tidak dapat dikembalikan
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleSoftDelete(data.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
        size: 120,
      },
    ],
    [router]
  );

  // Export CSV
  const handleExportCSV = (dataToExport: FEEmployee[]) => {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "employees_data.xlsx");
  };

  // Ref input file untuk reset
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Import handler

  const handleImportCSV = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("File kosong atau tidak terbaca");

        const fileName = file.name.toLowerCase();

        let workbook;
        if (fileName.endsWith(".csv")) {
          workbook = XLSX.read(data, { type: "string" });
        } else {
          workbook = XLSX.read(data, { type: "array" });
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawJsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          {
            defval: "",
          }
        );

        // Konversi semua field jadi string (kecuali null/empty)
        const jsonData: FEEmployee[] = rawJsonData.map((row) => {
          const newRow: Record<string, unknown> = {};
          for (const key in row) {
            const val = row[key];
            newRow[key] = val === null || val === "" ? "" : String(val);
          }
          return newRow as FEEmployee;
        });

        if (jsonData.length === 0)
          throw new Error("Tidak ada data yang terbaca");

        // Kirim data ke backend dengan axios instance api
        const response = await api.post("/employee/import", {
          employee: jsonData,
        });

        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Gagal menyimpan data ke server");
        }

        // const savedEmployees = response.data;

        if (Array.isArray(response.data)) {
          setEmployees(response.data);
        } else {
          alert("Backend tidak mengembalikan array data karyawan");
          setEmployees([]); // reset supaya tidak error filter
        }

        alert("Import dan simpan berhasil!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Gagal impor:", error);

        const message =
          error?.response?.data?.message || // Jika Laravel kirim { message: "..."}
          error?.response?.data?.error || // Jika Laravel kirim { error: "..." }
          error?.message || // Jika error JS
          JSON.stringify(error); // fallback, tampilkan objek sebagai string

        alert("Terjadi kesalahan saat mengimpor file: " + message);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    if (file.name.toLowerCase().endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
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

      const matchesGender = !filterGender || item.jenis_kelamin === filterGender;
      const matchesStatus = !filterStatus || item.status === filterStatus;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [employees, filterText, filterGender, filterStatus]);

  return (
    <div className="px-4 py-6 min-h-screen flex flex-col gap-4">
      <EmployeeCardSum employeesCard={employees} />

      <div className="bg-[#f8f8f8] rounded-xl p-4 md:p-8 shadow-md w-full overflow-x-auto">
        <div className="flex flex-col gap-4 min-w-0">
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
            onAdd={() => router.push("/employee/tambah")}
            importInputRef={fileInputRef}
            onExport={() => handleExportCSV(employees)}
            onImport={handleImportCSV}
          />

          <div className="w-full overflow-x-auto">
            <DataTable columns={employeeColumns} data={filteredData} />
          </div>
        </div>
      </div>
    </div>
  );
}