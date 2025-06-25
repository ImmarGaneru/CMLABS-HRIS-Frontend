"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { FEEmployee } from "@/types/employee";
import * as XLSX from "xlsx";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/Datatable";
import { RxAvatar } from "react-icons/rx";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import EmployeeCardSum from "./component_employee/employee_card_sum";
import DataTableHeader from "@/components/DatatableHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  user?: { email: string; phone_number: string };
  position?: { name: string };
  // phone_number: string;
  cabang: string;
  jabatan: string;
};

export default function EmployeeTablePage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<FEEmployee[]>([]);
  const [loading, setLoading] = useState(true);
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
      const res = await api.delete(`/admin/employees/${id}`);

      // Jika responsenya punya struktur `data.success` atau semacam itu, kamu bisa cek di sini
      if (res.status !== 200) {
        throw new Error(res.data?.message || "Gagal menghapus data");
      }

      // Hapus data dari state
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      // ✅ Tambahkan toast sukses
      toast.success("Data berhasil dihapus!");
    } catch (error) {
      let errorMessage = "Gagal menghapus data";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      // ✅ Tambahkan toast error
      toast.error(errorMessage);
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

        // Fetch position details for each employee
     const feData = res.data.data.map((emp: any) => ({
  id: emp.id,
  id_user: emp.id_user,
  nama: `${emp.first_name ?? ""} ${emp.last_name ?? ""}`,
  jenis_kelamin: emp.jenis_kelamin ?? "-",
  phone_number: emp.user?.phone_number ?? emp.phone_number ?? "-",
  cabang: emp.cabang ?? "-",
  tipe_kontrak: emp.tipe_kontrak ?? "-",
  jabatan: emp.position?.name ?? emp.jabatan ?? "-",
  status: emp.employment_status ?? "-",
  email: emp.user?.email ?? emp.email ?? "-",
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
      //     {
      //     id: "Avatar",
      // header: "Avatar",
      // cell: ({ row }) => (
      //   <div className="flex items-center justify-center">
      //     {row.original.avatar ? (
      //       // eslint-disable-next-line @next/next/no-img-element
      //       <img
      //         src={`/storage/${row.original.avatar}`} // atau URL lengkap jika disimpan sebagai path lengkap
      //         alt="Avatar"
      //         className="w-8 h-8 rounded-full object-cover"
      //       />
      //     ) : (
      //       <RxAvatar size={24} className="text-gray-400" />
      //     )}
      //   </div>
      // ),
      // size: 60,
      //     },
      {
        accessorKey: "nama",
        header: "Nama",
        cell: (info) => (
          <div className="truncate max-w-[120px]flex text-center flex items-center justify-center">
            {info.getValue() as string}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "jenis_kelamin",
        header: "Jenis Kelamin",
        cell: (info) => (
          <div className="truncate max-w-[100px] text-center flex items-center justify-center">
            {info.getValue() as string}
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "phone_number",
        header: "Nomor Telepon",
        cell: (info) => (
          <div className="truncate max-w-[120px]text-center flex items-center justify-center">
            {info.getValue() as string}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "cabang",
        header: "Cabang",
        cell: (info) => (
          <div className="truncate max-w-[100px] text-center flex items-center justify-center">
            {info.getValue() as string}
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "jabatan",
        header: "Jabatan",
        cell: (info) => (
          <div className="truncate max-w-[120px] text-center flex items-center justify-center">
            {info.getValue() as string}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "tipe_kontrak",
        header: "Tipe Kontrak",
        cell: (info) => (
          <div className="truncate max-w-[100px] text-center flex items-center justify-center">
            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
              {(info.getValue() as string) || "-"}
            </span>
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = (info.getValue() as string)?.toLowerCase();

          let displayLabel = "Tidak Diketahui";
          let color = "bg-gray-200 text-gray-600";

          if (status === "active") {
            displayLabel = "active";
            color = "bg-green-100 text-green-700";
          } else if (status === "resign") {
            displayLabel = "resign";
            color = "bg-red-100 text-red-700";
          } else if (status === "inactive") {
            displayLabel = "inactive";
            color = "bg-yellow-100 text-yellow-700";
          }

          return (
            <div className="truncate max-w-[100px] text-center flex items-center justify-center ">
              <span className={`px-2 py-1 text-xs rounded ${color}`}>
                {displayLabel}
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
            <div className="flex gap-2 justify-center w-[120px] ">
              <button
                title="Detail"
                onClick={() =>
                  router.push(`/manager/employee/detail/${data.id}`)
                }
                className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
              >
                <FaEye />
              </button>
              <button
                title="Edit"
                onClick={() => router.push(`/manager/employee/edit/${data.id}`)}
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
      const workbook = fileName.endsWith(".csv")
        ? XLSX.read(data, { type: "string" })
        : XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawJsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        worksheet,
        { defval: "" }
      );

     const mappedEmployees = rawJsonData.map((row, i) => {
  console.log(`📦 Row ${i}:`, row); // Tambahkan ini

  const [first_name, ...last] = (row["nama"] || "").toString().split(" ");
  return {
    id: row["id"] || undefined,
    first_name,
    last_name: last.join(" "),
    email: (row["email"] || row["Email"] || "")
      .toString()
      .toLowerCase(),
    phone_number: row["phone_number"],
    jenis_kelamin: row["jenis_kelamin"],
    cabang: row["cabang"],
    jabatan: row["jabatan"], // apakah ini undefined?
    department: row["department"] || null,
    address: "Tidak Diketahui",
    status: row["status"] || "active",
  };
});


      if (mappedEmployees.length === 0)
        throw new Error("Tidak ada data valid untuk diimpor");

      // 🔁 Kirim ke backend
      await api.post("/admin/employees/import", {
        employees: mappedEmployees,
      });

      // ✅ Setelah import, ambil ulang data dari backend
 const fetchRes = await api.get("/admin/employees/comp-employees");
const rawData = fetchRes.data.data;

const updatedEmployees = await Promise.all(
  rawData.map(async (emp: any) => {
    let jabatan = "-";

    if (emp.position?.name) {
      jabatan = emp.position.name;
    } else if (emp.jabatan) {
      jabatan = emp.jabatan;
    } else if (emp.id_position) {
      try {
        const posRes = await api.get(`/admin/positions/get/${emp.id_position}`);
        if (posRes.data.meta.success) {
          jabatan = posRes.data.data.name;
        }
      } catch (err) {
        console.warn("Gagal ambil jabatan dari id_position", err);
      }
    }

    return {
      id: emp.id,
      id_user: emp.id_user,
      nama: `${emp.first_name} ${emp.last_name}`,
      jenis_kelamin: emp.jenis_kelamin,
      phone_number: emp.user?.phone_number || "-",
      cabang: emp.cabang || "-",
      jabatan, // ✅ sekarang benar
      tipe_kontrak: emp.tipe_kontrak,
      status: emp.employment_status?.toLowerCase(),
      email: emp.user?.email || "-",
    };
  })
);

// ✅ Pindahkan setEmployees ke sini
setEmployees(updatedEmployees);

      toast.success("Import berhasil dan data diperbarui!");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Unknown error";
      alert("Terjadi kesalahan saat mengimpor file: " + message);
      console.error(error);
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

      const matchesGender =
        !filterGender || item.jenis_kelamin === filterGender;
      const matchesStatus = !filterStatus || item.status === filterStatus;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [employees, filterText, filterGender, filterStatus]);

  return (
    <div className="flex flex-col px-4 py-6 gap-6 w-full h-fit">
      <EmployeeCardSum employeesCard={employees} />

      <div className="bg-[#f8f8f8] rounded-xl p-4 md:p-8 shadow-md w-full overflow-x-auto">
        <div className="flex flex-col gap-4 min-w-0">
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
            onAdd={() => router.push("/manager/employee/tambah")}
            importInputRef={fileInputRef}
            onExport={() => handleExportCSV(employees)}
            onImport={handleImportCSV}
            emptyContent={
              loading ? (
                <div className="flex justify-center items-center w-full h-screen">
                  <LoadingSpinner size={48} />
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Employee not found
                </div>
              )
            }
          />
          <div className="w-full overflow-x-auto">
            <DataTable
              columns={employeeColumns}
              data={filteredData}
              loading={loading}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
