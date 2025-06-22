"use client";
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import ImageExtension from "@tiptap/extension-image";
import {
  Bold,
  Underline as UnderlineIcon,
  Link2,
  Image as ImageIcon,
} from "lucide-react";
import api from "@/lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type LetterFormat = {
  id: string;
  name: string;
  template: string;
};

type Karyawan = {
  id: string;
  first_name: string;
  last_name: string;
};

export default function LetteringPage() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      BulletList,
      OrderedList,
      ListItem,
      ImageExtension,
    ],
    content: "",
  });

  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("");
  const [letterFormats, setLetterFormats] = useState<LetterFormat[]>([]);
  const [employees, setEmployees] = useState<Karyawan[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<LetterFormat | null>(
    null
  );
  // Tambahkan state untuk gambar
  // const [imagePreview, setImagePreview] = useState<string | null>(null);

  // // Fungsi upload gambar (tidak masuk ke editor, tapi disimpan di bawah)
  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const base64 = reader.result as string;
  //     setImagePreview(base64); // simpan ke state, bukan ke editor
  //   };
  //   reader.readAsDataURL(file);
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formatsRes, employeesRes] = await Promise.all([
          api.get("admin/employees/letter/formats"),
          api.get("admin/employees/comp-employees"),
        ]);
        setLetterFormats(formatsRes.data.data);
        setEmployees(employeesRes.data.data);
      } catch (err) {
        console.error("Gagal ambil data:", err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = editor?.getHTML() || "";

    if (!selectedFormat || !recipient || !subject || content.trim() === "") {
      toast.error("Pastikan semua field diisi.");
      return;
    }

    try {
      await api.post("/admin/employees/letter", {
        id_user: recipient,
        id_letter_format: selectedFormat.id,
        subject,
        body: content,
      });

      toast.success("Surat berhasil dikirim!");
      setSubject("");
      setRecipient("");
      setSelectedFormat(null);
      editor?.commands.clearContent();
    } catch (error: any) {
      console.error(
        "Gagal mengirim surat:",
        error.response?.data || error.message
      );
      toast.error("Gagal mengirim surat.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">Buat Surat</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Format Surat */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Jenis Surat
            </label>
            <select
              value={selectedFormat?.id || ""}
              onChange={(e) => {
                const format = letterFormats.find(
                  (f) => f.id === e.target.value
                );
                setSelectedFormat(format || null);
                editor?.commands.setContent(format?.template || "");
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            >
              <option value="">Pilih Format Surat</option>
              {letterFormats.map((format) => (
                <option key={format.id} value={format.id}>
                  {format.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pegawai */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Kepada
            </label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            >
              <option value="">Pilih Pegawai</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Subjek */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Subjek
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          {/* Editor */}
          <div className="p-4 w-full bg-white rounded-md shadow">
            {editor && (
              <>
                <div className="flex items-center gap-2 border-b pb-2 mb-2">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 cursor-pointer ${
                      editor.isActive("bold") ? "bg-gray-200 rounded" : ""
                    }`}
                  >
                    <Bold size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                    className={`p-2 cursor-pointer ${
                      editor.isActive("underline") ? "bg-gray-200 rounded" : ""
                    }`}
                  >
                    <UnderlineIcon size={18} />
                  </button>

                  {/* <label className="p-2 cursor-pointer">
  <ImageIcon size={18} />
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="hidden"
  />
</label> */}
                </div>

                <EditorContent
                  editor={editor}
                  className="border p-3 min-h-[200px] rounded-md w-full"
                />
              </>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#1E3A5F] hover:bg-[#155A8A] text-white px-6 py-2 rounded-lg shadow"
            >
              Kirim Surat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
