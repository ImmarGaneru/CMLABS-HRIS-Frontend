"use client";

import { useEffect, useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import api from "@/lib/axios";
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";

interface Letter {
  id: string;
  id_user: string;
  id_letter_format: string;
  subject: string;
  user?: {
    email: string;  // ganti dari name ke email
  };
}

export default function LetteringTable() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    api
      .get("/letter")
      .then((res) => {
        if (res.data.meta?.success) {
          setLetters(res.data.data);
        } else {
          console.error("Gagal ambil data:", res.data.meta?.message);
        }
      })
      .catch((err) => {
        console.error("Error saat fetch data surat:", err);
      });
  }, []);

  const filteredData = useMemo(() => {
    const lower = filterText.toLowerCase();
    return letters.filter(
      (item) =>
        item.subject.toLowerCase().includes(lower) ||
        item.user?.email?.toLowerCase().includes(lower)  // ubah filter pakai email
    );
  }, [letters, filterText]);

  const columns: ColumnDef<Letter>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => <div>{getValue() as string}</div>,
    },
    {
      accessorKey: "user.email",   // akses user.email
      header: "Email Manager",     // header diganti
      cell: ({ row }) => (
        <div>{row.original.user?.email ?? "Tidak ditemukan"}</div>
      ),
    },
    {
      accessorKey: "id_letter_format",
      header: "ID Surat",
      cell: ({ getValue }) => <div>{getValue() as string}</div>,
    },
    {
      accessorKey: "subject",
      header: "Judul",
      cell: ({ getValue }) => <div>{getValue() as string}</div>,
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="text-center">
          <button className="hover:text-blue-600 transition-colors" title="Download">
            <Download size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="px-2 py-4 min-h-screen flex flex-col gap-4">
      <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
        <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
          <DataTableHeader
            title="Daftar Surat"
            hasSearch
            searchValue={filterText}
            onSearch={setFilterText}
            hasFilter={false}
            hasExport={false}
            hasDateFilter={false}
            hasImport={false}
            hasAdd={false}
          />
        </div>
        <DataTable columns={columns} data={filteredData} />
      </div>
    </main>
  );
}