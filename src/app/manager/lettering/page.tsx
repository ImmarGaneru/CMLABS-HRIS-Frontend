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
import api from "@/lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LetterFormat = {
  id: string;
  name: string;
  template: string;
};

type Karyawan = {
  id: string;
  id_user: string;
  first_name: string;
  last_name: string;
};

export default function LetteringPage() {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link, BulletList, OrderedList, ListItem],
    content: "",
  });

  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("");
  const [letterFormats, setLetterFormats] = useState<LetterFormat[]>([]);
  const [employees, setEmployees] = useState<Karyawan[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<LetterFormat | null>(null);

  useEffect(() => {
    const fetchLetterFormats = async () => {
      try {
        const res = await api.get("admin/employees/letter/formats");
        setLetterFormats(res.data.data);
      } catch (err) {
        console.error("Gagal ambil format surat:", err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await api.get("admin/employees/comp-employees");
        setEmployees(res.data.data);
      } catch (err) {
        console.error("Gagal ambil data karyawan:", err);
      }
    };

    fetchLetterFormats();
    fetchEmployees();
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
    console.error("Gagal mengirim surat:", error.response?.data || error.message);
    toast.error("Gagal mengirim surat.");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">Buat Surat</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Select
              value={selectedFormat?.id || ""}
              onValueChange={(val) => {
                const format = letterFormats.find((f) => f.id === val);
                setSelectedFormat(format || null);
                if (format?.template) {
                  editor?.commands.setContent(format.template);
                } else {
                  editor?.commands.clearContent();
                }
              }}
            >
              <label className="block text-gray-700 font-medium mb-1">Jenis Surat</label>
              <SelectTrigger className="w-full border border-gray-300 rounded-lg p-2">
                <SelectValue placeholder="Pilih Format Surat" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {letterFormats.map((format) => (
                  <SelectItem key={format.id} value={format.id}>
                    {format.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Kepada</label>
          <Select onValueChange={(val) => setRecipient(val)}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Pilih Pegawai" />
  </SelectTrigger>
  <SelectContent className="max-h-60 overflow-y-auto">
    {employees.map((emp) => (
      <SelectItem key={emp.id_user} value={emp.id_user}>
        {emp.first_name} {emp.last_name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div className="p-4 w-full bg-white rounded-md shadow">
            {editor && (
              <div className="flex items-center gap-2 border-b pb-2 mb-2">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="p-2"><Bold size={18} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="p-2"><UnderlineIcon size={18} /></button>
                <button type="button" onClick={() => editor.chain().focus().setLink({ href: "https://example.com" }).run()} className="p-2"><Link2 size={18} /></button>
                <button className="p-2" type="button"><Smile size={18} /></button>
                <button className="p-2" type="button"><Image size={18} /></button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} type="button" className="p-2">•</button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} type="button" className="p-2">1.</button>
              </div>
            )}
            <EditorContent editor={editor} className="border p-3 min-h-[200px] rounded-md w-full" />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-[#1E3A5F] hover:bg-[#155A8A]  text-white px-6 py-2 rounded-lg shadow">Kirim Surat</button>
          </div>
        </form>
      </div>
    </div>
  );
}