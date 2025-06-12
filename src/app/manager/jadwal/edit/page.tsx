"use client";

import { useState } from "react";
import { Switch } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useAttendance, CheckClockSetting, CheckClockSettingTime } from "@/contexts/AttendanceContext";
export default function Jadwal() {
    const searchParams = useSearchParams();

    const id = searchParams.get('id') || "" ;

    const { completeUpdateCheckClockSetting, fetchSingleCheckClockSetting } = useAttendance();
    const [liburNasionalMasuk, setLiburNasionalMasuk] = useState(true);
    const [cutiBersamaMasuk, setCutiBersamaMasuk] = useState(true);
    const [checkClockSetting, setCheckClockSetting] = useState<CheckClockSetting | null>(null);
    const router = useRouter();

    // Fetch checkClockSetting when component mounts
    useState(() => {
        fetchSingleCheckClockSetting(id)
            .then((data) => {
                setCheckClockSetting(data);
                console.log("Fetched check clock setting:", data);
            })
            .catch((error) => {
                console.error("Error fetching check clock setting:", error);
            });
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Form Tambah Jadwal */}
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h1 className="text-xl font-bold text-[#1E3A5F]">Update Jadwal</h1>
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
                            name="ck_setting_name"
                            defaultValue={checkClockSetting?.name || ""}
                            placeholder="Masukkan nama jadwal"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Type</label>
                        <select className="w-full border rounded px-3 py-2" name="ck_setting_type" defaultValue={checkClockSetting?.type || "WFO"}>
                            <option value="WFO">WFO</option>
                            <option value="WFH">WFH</option>
                        </select>
                    </div>
                </div>

                {/* Tabel Jadwal */}
                <div className="overflow-x-auto border rounded mb-6">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                            <th className="px-4 py-2">Hari</th>
                            <th className="px-4 py-2">Clock In</th>
                            <th className="px-4 py-2">Break Start</th>
                            <th className="px-4 py-2">Break End</th>
                            <th className="px-4 py-2">Clock Out</th>
                        </tr>
                        </thead>
                        <tbody>
                        {checkClockSetting?.check_clock_setting_time.map((row, idx) => (
                            <tr key={idx} className="border-t">
                                <td className="px-4 py-2">{row.day}</td>
                                <td className="px-4 py-2">
                                    <input
                                        type="time "
                                        name={`ck_setting_clock_in_${idx}`}
                                        defaultValue={row.clock_in.split(":").slice(0, 2).join(":")}
                                        className="border rounded px-2 py-1 w-full  "
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="time "
                                        name={`ck_setting_break_start_${idx}`}
                                        defaultValue={row.break_start.split(":").slice(0, 2).join(":")}
                                        className="border rounded px-2 py-1 w-full  "
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        type="time "
                                        name={`ck_setting_break_end_${idx}`}
                                        defaultValue={row.break_end.split(":").slice(0, 2).join(":")}
                                        className="border rounded px-2 py-1 w-full  "
                                    />
                                </td>
                                <td className="px-4 py-2 ">
                                    <input
                                        type="time"
                                        name={`ck_setting_clock_out_${idx}`}
                                        defaultValue={row.clock_out.split(":").slice(0, 2).join(":")}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Tombol Aksi */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => router.push("/manager/jadwal")}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-md cursor-pointer">
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            if (checkClockSetting?.id) {
                                const updatedCKSetting: CheckClockSetting = {
                                    id: "",
                                    id_company: "",
                                    name: (document.querySelector(
                                        'input[name="ck_setting_name"]'
                                    ) as HTMLInputElement).value || "New Schedule",
                                    type: (document.querySelector(
                                        'select[name="ck_setting_type"]'
                                    ) as HTMLInputElement).value || "WFO",
                                    created_at: new Date(),
                                    updated_at: new Date(),
                                    deleted_at: null,
                                    check_clock_setting_time: [],
                                }

                                const check_clock_setting_time: CheckClockSettingTime[] = checkClockSetting!.check_clock_setting_time.map((row, idx) => ({
                                    id: "",
                                    id_ck_setting: "",
                                    day: row.day,
                                    clock_in: (document.querySelector(
                                        `input[name="ck_setting_clock_in_${idx}"]`
                                    ) as HTMLInputElement).value || row.clock_in,
                                    break_start: (document.querySelector(
                                        `input[name="ck_setting_break_start_${idx}"]`
                                    ) as HTMLInputElement).value || row.break_start,
                                    break_end: (document.querySelector(
                                        `input[name="ck_setting_break_end_${idx}"]`
                                    ) as HTMLInputElement).value || row.break_end,
                                    clock_out: (document.querySelector(
                                        `input[name="ck_setting_clock_out_${idx}"]`
                                    ) as HTMLInputElement).value || row.clock_out,
                                    created_at: new Date(),
                                    updated_at: new Date(),
                                }));

                                updatedCKSetting.check_clock_setting_time = check_clock_setting_time;


                                completeUpdateCheckClockSetting(checkClockSetting?.id, updatedCKSetting)
                                    .then(() => router.push("/jadwal"))
                                    .catch((error) => {
                                        console.error("Error saving schedule:", error);
                                    });
                            }
                        }
                        }
                        className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#155A8A] transition duration-200 ease-in-out shadow-md cursor-pointer">
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}

import { useSearchParams } from 'next/navigation'
