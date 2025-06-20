"use client";

import { useEffect, useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import api from "@/lib/axios";
import { DataTable } from "@/components/Datatable";
import DataTableHeader from "@/components/DatatableHeader";
import { FaEye, FaDownload } from "react-icons/fa";

interface Letter {
  body: string | TrustedHTML;
  id: string;
  id_user: string;
  id_letter_format: string;
  subject: string;
  user?: {
    email: string;  // ganti dari name ke email
  };
  format?: {
    name: string;
  };
}

export default function LetteringTable() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [filterText, setFilterText] = useState("");
 const [loading, setLoading] = useState(true);
const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
const [showModal, setShowModal] = useState(false);

const handleDownload = async (letter: Letter) => {
  try {
    const response = await api.get(`/letter/${letter.id}/download-pdf`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${letter.subject || "surat"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Gagal download PDF:", error);
  }
};

const handlePreview = async (letter: Letter) => {
  try {
    const response = await api.get(`/letter/${letter.id}/download-pdf`, {
      responseType: "blob",
    });
    const fileURL = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    window.open(fileURL, "_blank");
  } catch (error) {
    console.error("Gagal preview PDF:", error);
  }
};



useEffect(() => {
  setLoading(true);

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
    })
    .finally(() => {
      setLoading(false); // ✅ Baru di sini
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
    accessorKey: "user.email",
    header: "Email Manager",
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.user?.email ?? "Tidak ditemukan"}
      </div>
    ),
  },
  {
    accessorKey: "format.name",
    header: "Nama Surat",
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.format?.name ?? "Tidak ditemukan"}
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Judul",
    cell: ({ getValue }) => (
      <div className="text-center">
        {getValue() as string}
      </div>
    ),
  },
 {
  id: "actions",
  header: "Aksi",
  cell: ({ row }) => (
    <div className="text-center flex items-center justify-center gap-3">
      <button
        onClick={() => handlePreview(row.original)}
        className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
        title="Lihat"
      >
        <FaEye size={18} />
      </button>
      <button
        onClick={() => handleDownload(row.original)}
     className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"
        title="Download"
      >
        <FaDownload size={18} />
      </button>
    </div>
  ),
}


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
            hasExport={true}
            hasDateFilter={false}
            hasImport={false}
            hasAdd={false}
              emptyContent={
              loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Employee not found
                </div>
              )
            }
          />
        </div>
        
        <DataTable columns={columns} data={filteredData} loading={loading} />
      </div>
      {showModal && selectedLetter && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
      <h2 className="text-xl font-bold mb-4">Preview Surat</h2>
      <p><strong>Judul:</strong> {selectedLetter.subject}</p>
      <p><strong>Email:</strong> {selectedLetter.user?.email}</p>
      <p><strong>Format Surat:</strong> {selectedLetter.format?.name}</p>
      <div className="mt-4 border-t pt-3">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: selectedLetter.body }}
        />
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
)}

    </main>
  );
}