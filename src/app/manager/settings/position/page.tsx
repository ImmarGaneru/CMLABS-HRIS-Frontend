"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import api from "@/lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTableHeader from '@/components/DatatableHeader';
import { DataTable } from '@/components/Datatable';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

// Types
interface Department {
  id: string;
  name: string;
  location?: string;
}

interface Position {
  id: string;
  name: string;
  level: string;
  gaji: string;
  department: { id: string; name: string } | null;
}

export default function PositionPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editPosition, setEditPosition] = useState<Position | null>(null);
  const [form, setForm] = useState({ name: "", level: "", gaji: "", id_department: "" });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('add');

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/positions");
      setPositions(res.data.data || []);
      setError("");
      toast.success("Berhasil mengambil data posisi");
    } catch (e: any) {
      setError("Gagal mengambil data posisi");
      toast.error("Gagal mengambil daftar posisi");
    } finally {
      setLoading(false);
    }
  };
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/admin/departments");
      setDepartments(res.data.data || []);
    } catch (e: any) {
      toast.error("Gagal mengambil daftar departemen");
    }
  };
  useEffect(() => {
    fetchPositions();
    fetchDepartments();
  }, []);

  const openView = (pos: Position) => {
    setEditPosition(pos);
    setForm({
      name: pos.name,
      level: pos.level,
      gaji: pos.gaji,
      id_department: pos.department?.id || ""
    });
    setModalMode('view');
    setShowModal(true);
  };
  const openAdd = () => {
    setEditPosition(null);
    setForm({ name: "", level: "", gaji: "", id_department: departments[0]?.id || "" });
    setModalMode('add');
    setShowModal(true);
  };
  const openEdit = (pos: Position) => {
    setEditPosition(pos);
    setForm({
      name: pos.name,
      level: pos.level,
      gaji: pos.gaji,
      id_department: pos.department?.id || ""
    });
    setModalMode('edit');
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditPosition(null);
    setForm({ name: "", level: "", gaji: "", id_department: departments[0]?.id || "" });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editPosition) {
        await api.put(`/admin/positions/${editPosition.id}`, form);
        toast.success("Posisi berhasil diubah");
      } else {
        await api.post("/admin/positions", form);
        toast.success("Posisi berhasil ditambahkan");
      }
      await fetchPositions();
      closeModal();
    } catch (e: any) {
      const message = e.response?.data?.message || "Terjadi kesalahan";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id: string) => {
    // if (!confirm("Hapus posisi ini?")) return;
    try {
      await api.delete(`/admin/positions/${id}`);
      toast.success("Posisi berhasil dihapus");
      await fetchPositions();
    } catch (e: any) {
      const message = e.response?.data?.message || "Gagal menghapus posisi";
      toast.error(message);
    }
  };

  // DataTable columns
  const columns = useMemo(() => [
    {
      id: "No",
      header: "No",
      cell: ({ row }: any) => (
        <div className="flex justify-center">{row.index + 1}</div>
      ),
      size: 20,
    },
    {
      accessorKey: "name",
      header: "Nama Posisi",
      cell: (info: any) => <span className="flex justify-center">{info.getValue()}</span>,
    },
    {
      accessorKey: "level",
      header: "Level Posisi",
      cell: (info: any) => <span className="flex justify-center">{info.getValue()}</span>,
    },
    {
      accessorKey: "gaji",
      header: "Gaji Posisi",
      cell: (info: any) => <span className="flex justify-center">{info.getValue()}</span>,
    },
    {
      id: "department",
      header: "Nama Departement",
      cell: ({ row }: any) => <span className="flex justify-center">{row.original.department?.name || '-'}</span>,
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }: any) => (
        <div className="flex gap-2 justify-center">
          <button onClick={() => openView(row.original)} className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"><FaEye /></button>
          <button onClick={() => openEdit(row.original)} className="border border-[#1E3A5F] px-3 py-1 rounded text-[#1E3A5F] bg-[#f8f8f8]"><FaEdit /></button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="border border-red-600 px-3 py-1 rounded text-red-600 bg-[#f8f8f8] hover:bg-red-100"> <FaTrash /> </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Posisi?</AlertDialogTitle>
                <AlertDialogDescription>
                  Data posisi yang dihapus tidak dapat dikembalikan. Lanjutkan?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(row.original.id)}
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ], [positions]);

  // Filtered data for search
  const filteredPositions = useMemo(() => {
    if (!search) return positions;
    return positions.filter(pos =>
      pos.name.toLowerCase().includes(search.toLowerCase()) ||
      pos.department?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [positions, search]);

  return (
    <div className="flex flex-col px-4 py-6 gap-6 w-full h-fit">

      <div className="bg-[#f8f8f8] rounded-xl p-4 md:p-8 shadow-md w-full overflow-x-auto">
        <ToastContainer position="top-right" autoClose={3000} />
        <DataTableHeader
          title="Positions"
          hasSearch
          hasAdd
          hasExport={false}
          hasImport={false}
          searchValue={search}
          onSearch={setSearch}
          onAdd={openAdd}
        />
        <div className="mt-4">
          <DataTable columns={columns} data={filteredPositions} loading={loading} emptyContent={<span>Tidak ada data posisi</span>} />
        </div>
        {showModal && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={closeModal}
            />
            {/* Sliding Modal */}
            <div
              className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 p-8 transition-transform duration-300 ${showModal ? 'translate-x-0' : 'translate-x-full'}`}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">{modalMode === 'add' ? 'Add' : modalMode === 'edit' ? 'Edit' : 'View'} Position</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1 font-semibold">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="border rounded w-full p-2" required readOnly={modalMode === 'view'} />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Level</label>
                  <input name="level" value={form.level} onChange={handleChange} className="border rounded w-full p-2" required readOnly={modalMode === 'view'} />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Salary</label>
                  <input name="gaji" value={form.gaji} onChange={handleChange} className="border rounded w-full p-2" required readOnly={modalMode === 'view'} />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Department</label>
                  <select name="id_department" value={form.id_department} onChange={handleChange} className="border rounded w-full p-2" required disabled={modalMode === 'view'}>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                {modalMode !== 'view' ? (
                  <div className="flex gap-4 justify-end mt-8">
                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button type="submit" disabled={saving} className="px-4 py-2 bg-[#1E3A5F] text-white rounded hover:bg-[#155A8A] transition-colors">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                  </div>
                ) : (
                  <div className="flex gap-4 justify-end mt-8">
                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Close</button>
                  </div>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 