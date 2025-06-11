"use client";
import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { Bold, Underline as UnderlineIcon, Link2, Image, Smile } from "lucide-react";
import api from "@/lib/axios"; // pastikan ini benar

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
    extensions: [StarterKit, Underline, Link, BulletList, OrderedList, ListItem],
  });

  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("");
  const [letterType, setLetterType] = useState("");
  const [letterFormats, setLetterFormats] = useState<LetterFormat[]>([]);
  const [employees, setEmployees] = useState<Karyawan[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<LetterFormat | null>(null);

  // Ambil data format surat
  useEffect(() => {
    const fetchLetterFormats = async () => {
      try {
        const response = await api.get("/letterformat");
        setLetterFormats(response.data.data);
      } catch (err) {
        console.error("❌ Gagal ambil format surat:", err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employee");
        setEmployees(response.data.data); // Simpan ke state
      } catch (err) {
        console.error("❌ Gagal ambil data karyawan:", err);
      }
    };

    fetchLetterFormats();
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = editor?.getHTML() || "";

    if (!selectedFormat) {
      alert("Pilih jenis surat terlebih dahulu.");
      return;
    }

    try {
      const response = await api.post("/letter", {
        id_user: recipient,
        id_letter_format: selectedFormat.id,
        subject,
        body: content,
      });

      alert("Surat berhasil dikirim!");
      setSubject("");
      setRecipient("");
      setSelectedFormat(null);
      editor?.commands.clearContent();
    } catch (error: any) {
      console.error("Gagal mengirim surat:", error.response?.data || error.message);
      alert("Gagal mengirim surat.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">Buat Surat</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Jenis Surat */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Jenis Surat</label>
            <select
              value={selectedFormat?.id || ""}
              onChange={(e) => {
                const format = letterFormats.find((f) => f.id === e.target.value);
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

          {/* Penerima */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Kepada</label>
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

          {/* Subject */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Masukkan subject"
              required
            />
          </div>

          {/* Editor */}
          <div className="p-4 w-full bg-white rounded-md shadow">
            {editor && (
              <div className="flex items-center gap-2 border-b pb-2 mb-2">
                <button onClick={() => editor.chain().focus().toggleBold().run()} type="button" className="p-2">
                  <Bold size={18} />
                </button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()} type="button" className="p-2">
                  <UnderlineIcon size={18} />
                </button>
                <button onClick={() => editor.chain().focus().setLink({ href: "https://example.com" }).run()} type="button" className="p-2">
                  <Link2 size={18} />
                </button>
                <button className="p-2" type="button"><Smile size={18} /></button>
                <button className="p-2" type="button"><Image size={18} /></button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} type="button" className="p-2">•</button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} type="button" className="p-2">1.</button>
              </div>
            )}
            <EditorContent editor={editor} className="border p-3 min-h-[200px] rounded-md w-full" />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow">
              Kirim Surat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
