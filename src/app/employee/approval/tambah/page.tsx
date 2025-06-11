"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ClientOnlySelect, { OptionType } from "@/components/ClientOnlySelect";
import { useApproval } from "@/contexts/ApprovalContext";
import {useEffect, useState} from "react";

const FormSchema = z.object({
    id_user: z
        .string({
            required_error: "User harus dipilih",
        })
        .min(1, "User harus dipilih"),
    request_type: z
        .string({
            required_error: "Tipe pengajuan harus dipilih",
        })
        .min(1, "Tipe pengajuan harus dipilih"),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    overtime_dates: z.string().optional(),
    reason: z
        .string({
            required_error: "Alasan harus diisi",
        })
        .min(1, "Alasan harus diisi"),

})

export default function TambahApproval(){
    const { submitApproval, isAdmin, getCurrentUser } = useApproval();
    const router = useRouter();
    const [hydrated, setHydrated] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        const fetchInitialData = async () => {
            const currentUser = await getCurrentUser();
            console.log("Current user:", currentUser);
            setCurrentUserId(currentUser?.id);
            form.setValue("id_user", currentUserId || "");
        };

        fetchInitialData();
    }, [hydrated, isAdmin, getCurrentUser]);


    const typeOptions: OptionType[] = [
        { value: "permit", label: "Izin" },
        { value: "sick", label: "Sakit" },
        { value: "leave", label: "Cuti" },
        { value: "overtime", label: "Lembur" },
    ];

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const startDateField = form.control.register("start_date");
    const endDateField = form.control.register("end_date");
    const startTimeField = form.control.register("start_time");
    const endTimeField = form.control.register("end_time");
    form.control.register("overtime_dates");

    const selectedType = form.watch("request_type");

    if (!hydrated) {
        return null; // Render nothing until the component is hydrated
    }
    function onSubmit(data: z.infer<typeof FormSchema>) {
        submitApproval(data).then(() => {
            router.back();
        });

    }

    return (
        <div className="px-2 py-4 min-h-screen flex flex-col gap-4">
            <div className="bg-[#f8f8f8] rounded-xl p-8 shadow-md mt-6">
                <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                    {/* Tambahkan komponen header atau tombol di sini jika diperlukan */}
                    <h3 className="text-xl font-bold text-[#1E3A5F]">Tambah Approval</h3>
                    <Button onClick={() => {router.back(); }} variant="redirectButton" className="flex items-center">
                        <FaArrowLeft size={16} />
                        <span className="font-medium">Kembali</span>
                    </Button>
                </div>
                <div className="space-y-4 w-full mt-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                            <FormField
                                control={form.control}
                                name="request_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipe Pengajuan</FormLabel>
                                        <ClientOnlySelect
                                            isClearable
                                            isMulti={false}
                                            options={typeOptions}
                                            placeholder="Pilih tipe pengajuan"
                                            onChange={(selectedOption) => {
                                                if (!Array.isArray(selectedOption)) {
                                                    field.onChange((selectedOption as OptionType)?.value)
                                                }
                                            }}
                                            value={typeOptions.find(option => option.value === field.value)}
                                        />
                                        <FormDescription>
                                            Pilih tipe pengajuan yang sesuai.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/*Date fields*/}
                            {["permit", "sick", "leave"].includes(selectedType) && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="start_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Date</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Pilih tanggal mulai pengajuan.
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="end_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date"
                                                           value={field.value || ""}
                                                           onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Pilih tanggal akhir pengajuan.
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                            {selectedType === "overtime" && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="start_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Time</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Masukkan jam mulai lembur.
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="end_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Time</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Masukkan jam berakhir lembur.
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="overtime_dates"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Overtime Dates</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Pilih hari lembur.
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alasan</FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                rows={3}
                                                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Masukkan alasan pengajuan.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" variant="redirectButton">Submit</Button>
                        </form>
                    </Form>
                </div>

            </div>
        </div>
    );
}