"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import api from "@/lib/axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  id_department: string;
}

export default function DepartmentPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editDepartment, setEditDepartment] = useState<Department | null>(null);
    const [form, setForm] = useState({ name: "", location: "" });
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const importInputRef = useRef<HTMLInputElement | null>(null);
    const [relatedPositions, setRelatedPositions] = useState<Position[]>([]);
    const [modalMode, setModalMode] = useState<"view" | "edit" | "add">("add");

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/departments");
            setDepartments(res.data.data || []);
            setError("");
            toast.success("Berhasil mengambil data departemen");
        } catch (e: unknown) {
            setError("Gagal mengambil data departemen");
            toast.error("Gagal mengambil daftar departemen");
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedPositions = async (departmentId: string) => {
      try {
        const res = await api.get(`/admin/positions/by-department/${departmentId}`);
        setRelatedPositions(res.data.data || []);
      } catch {
        setRelatedPositions([]);
      }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const openAdd = () => {
        setEditDepartment(null);
        setForm({ name: "", location: "" });
        setModalMode("add");
        setShowModal(true);
        setRelatedPositions([]);
    };

    const openView = (dept: Department) => {
        setEditDepartment(dept);
        setForm({ name: dept.name, location: dept.location || "" });
        setModalMode("view");
        setShowModal(true);
        fetchRelatedPositions(dept.id);
    };
    
    const openEdit = (dept: Department) => {
        setEditDepartment(dept);
        setForm({ name: dept.name, location: dept.location || "" });
        setModalMode("edit");
        setShowModal(true);
        fetchRelatedPositions(dept.id);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditDepartment(null);
        setForm({ name: "", location: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editDepartment) {
                await api.put(`/admin/departments/${editDepartment.id}`, form);
                toast.success("Departemen berhasil diubah");
            } else {
                await api.post("/admin/departments", form);
                toast.success("Departemen berhasil ditambahkan");
            }

            await fetchDepartments();
            closeModal();
        } catch (e: unknown) {
            let message = "Terjadi kesalahan";
            if (e && typeof e === "object" && "response" in e && (e as any).response?.data?.message) {
                message = (e as any).response.data.message;
            }
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        // if (!confirm("Hapus departemen ini?")) return;

        try {
            await api.delete(`/admin/departments/${id}`);
            toast.success("Departemen berhasil dihapus");
            await fetchDepartments();
        } catch (e: unknown) {
            let message = "Gagal menghapus departemen";
            if (e && typeof e === "object" && "response" in e && (e as any).response?.data?.message) {
                message = (e as any).response.data.message;
            }
            toast.error(message);
        }
    };

    // DataTable columns
    const columns = useMemo(() => [
        {
          id: "No",
          header: "No",
          cell: ({ row } : any) => (
            <div className="flex justify-center">{row.index + 1}</div>
          ),
          size: 20,
        },
        {
            accessorKey: "name",
            header: "Nama Departemen",
            cell: (info: any) => <span className="flex justify-center">{info.getValue()}</span>,
        },
        {
            accessorKey: "location",
            header: "Lokasi Departemen",
            cell: (info: any) => <span className="flex justify-center">{info.getValue() || '-'}</span>,
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
                          <AlertDialogTitle>Hapus Departement?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Data Departement yang dihapus tidak dapat dikembalikan, pastikan departemen ini tidak terkait dengan posisi apapun. Lanjutkan?
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
    ], [departments]);

    // Filtered data for search
    const filteredDepartments = useMemo(() => {
        if (!search) return departments;
        return departments.filter(dept =>
            dept.name.toLowerCase().includes(search.toLowerCase()) ||
            (dept.location || '').toLowerCase().includes(search.toLowerCase())
        );
    }, [departments, search]);

    return (
      <div className="flex flex-col px-4 py-6 gap-6 w-full h-fit">
        <div className="bg-[#f8f8f8] rounded-xl p-4 md:p-8 shadow-md w-full overflow-x-auto">
            <ToastContainer position="top-right" autoClose={3000} />
            <DataTableHeader
                title="Departments"
                hasSearch
                hasAdd
                hasExport={false}
                hasImport={false}
                searchValue={search}
                onSearch={setSearch}
                onAdd={openAdd}
            />
            <div className="mt-4">
                <DataTable columns={columns} data={filteredDepartments} loading={loading} emptyContent={<span>Tidak ada data departemen</span>} />
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
                        <h2 className="text-xl font-bold mb-4">
                            {modalMode === 'add' ? 'Add' : modalMode === 'edit' ? 'Edit' : 'View'} Department
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1 font-semibold">Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    required
                                    readOnly={modalMode === 'view'}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">Location</label>
                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    readOnly={modalMode === 'view'}
                                />
                            </div>
                            {modalMode !== 'view' ? (
                              <div className="flex gap-4 justify-end mt-8">
                                  <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                  <button
                                      type="submit"
                                      disabled={saving}
                                      className="px-4 py-2 bg-[#1E3A5F] text-white rounded hover:bg-[#155A8A] transition-colors"
                                  >
                                      {saving ? 'Menyimpan...' : 'Simpan'}
                                  </button>
                              </div>
                            ) : (
                              <div className="flex gap-4 justify-end mt-8">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Close</button>
                              </div>
                            )}
                        </form>
                        {modalMode !== "add" && (
                          <div className="mt-6">
                            <h3 className="font-bold mb-2">Related Positions</h3>
                            <table className="w-full text-sm border">
                              <thead>
                                <tr>
                                  <th className="py-2 px-4 border">No</th>
                                  <th className="py-2 px-4 border">Name</th>
                                  <th className="py-2 px-4 border">Level</th>
                                  <th className="py-2 px-4 border">Salary</th>
                                </tr>
                              </thead>
                              <tbody>
                                {relatedPositions.length === 0 ? (
                                  <tr>
                                    <td colSpan={4} className="text-center py-2">No positions</td>
                                  </tr>
                                ) : relatedPositions.map((pos, idx) => (
                                  <tr key={pos.id}>
                                    <td className="py-2 px-4 border text-center">{idx + 1}</td>
                                    <td className="py-2 px-4 border">{pos.name}</td>
                                    <td className="py-2 px-4 border">{pos.level}</td>
                                    <td className="py-2 px-4 border">{pos.gaji}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                    </div>
                </>
            )}
        </div>

      </div>
    );
}