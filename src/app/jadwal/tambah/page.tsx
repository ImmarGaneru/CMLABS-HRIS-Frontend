"use client";

import { useState } from "react";
import { Switch } from "@headlessui/react";
import { useRouter } from "next/navigation";

export default function Jadwal() {
  const [liburNasionalMasuk, setLiburNasionalMasuk] = useState(true);
  const [cutiBersamaMasuk, setCutiBersamaMasuk] = useState(true);
  const router = useRouter();
  const hariList = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];
  const [jadwal] = useState(
    hariList.map((hari) => ({
      hari,
      jenis: hari === "Sabtu" || hari === "Minggu" ? "Day Off" : "Hari Kerja",
      clockIn: hari === "Sabtu" || hari === "Minggu" ? "00:00" : "08:00",
      clockOut: hari === "Sabtu" || hari === "Minggu" ? "00:00" : "17:00",
    }))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Form Tambah Jadwal */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1 className="text-xl font-bold text-[#1E3A5F]">Tambah Jadwal</h1>
          <button
            onClick={() => router.push("/jadwal")}
            className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#155A8A] transition duration-200 ease-in-out shadow-md cursor-pointer"
          >
            Kembali
          </button>
        </div>

        {/* Input Nama Jadwal dan Tanggal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-1">Nama Jadwal</label>
            <input
              type="text"
              placeholder="Masukkan nama jadwal"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1"> Tanggal Efektif</label>
            <input
              className="w-full border rounded px-3 py-2 cursor-pointer"
              type="date"
            />
          </div>
        </div>

        {/* Tabel Jadwal */}
        <div className="overflow-x-auto border rounded mb-6">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2">Hari</th>
                <th className="px-4 py-2">Jenis</th>
                <th className="px-4 py-2">Clock In</th>
                <th className="px-4 py-2">Clock Out</th>
              </tr>
            </thead>
            <tbody>
              {jadwal.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{row.hari}</td>
                  <td className="px-4 py-2">
                    <select
                      defaultValue={row.jenis}
                      className="border rounded px-2 py-1 w-full cursor-pointer"
                    >
                      <option value="Hari Kerja">Hari Kerja</option>
                      <option value="Day Off">Day Off</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="time "
                      defaultValue={row.clockIn}
                      className="border rounded px-2 py-1 w-full  "
                    />
                  </td>
                  <td className="px-4 py-2 ">
                    <input
                      type="time"
                      defaultValue={row.clockOut}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Opsi Tambahan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
          <div>
            <label className="block font-medium mb-1">
              Toleransi Keterlambatan
            </label>
            <div className="flex items-center">
              <input
                type="number"
                placeholder="00"
                className="w-20 border rounded px-2 py-1 mr-2"
              />
              <span>Menit</span>
            </div>
          </div>
          <div className="flex flex-row gap-10">
            {/* Toggle Hari Libur Nasional */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <span>Hari Libur Nasional Tetap Masuk</span>
              <label
                style={{
                  display: "inline-block",
                  width: 60,
                  height: 20,
                  position: "relative",
                }}
              >
                <input
                  type="checkbox"
                  checked={liburNasionalMasuk}
                  onChange={() => setLiburNasionalMasuk(!liburNasionalMasuk)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <Switch
                  checked={liburNasionalMasuk}
                  onChange={setLiburNasionalMasuk}
                  className="group inline-flex h-6 w-11 items-center rounded-full bg-red-600 data-checked:bg-green-600 data-disabled:cursor-not-allowed data-disabled:opacity-50"
                >
                  <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
                </Switch>
              </label>
            </div>

            {/* Toggle Cuti Bersama */}
            <div className="flex items-center gap-2 ">
              <span>Cuti Bersama Tetap Masuk</span>
              <label
                style={{
                  display: "inline-block",
                  width: 60,
                  height: 20,
                  position: "relative",
                }}
              >
                <input
                  type="checkbox"
                  checked={cutiBersamaMasuk}
                  onChange={() => setCutiBersamaMasuk(!cutiBersamaMasuk)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <Switch
                  checked={cutiBersamaMasuk}
                  onChange={setCutiBersamaMasuk}
                  className="group inline-flex h-6 w-11 items-center rounded-full bg-red-600 data-checked:bg-green-600 data-disabled:cursor-not-allowed data-disabled:opacity-50"
                >
                  <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
                </Switch>
              </label>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-2">
          <button
          onClick={() => router.push("/jadwal")} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-md cursor-pointer">
            Batal
          </button>
          <button className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#155A8A] transition duration-200 ease-in-out shadow-md cursor-pointer">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
