"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApproval } from "@/contexts/ApprovalContext";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import ClientOnlySelect, {OptionType} from "@/components/ClientOnlySelect";
import {Input} from "@/components/ui/input";
import Button from "@/components/Button";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {FaArrowLeft} from "react-icons/fa";

const FormSchema = z.object({
    request_type: z
        .string({
            required_error: "Tipe pengajuan harus dipilih",
        })
        .min(1),
    start_date: z
        .string({
            required_error: "Tanggal mulai harus diisi",
        })
        .min(1),
    end_date: z
        .string({
            required_error: "Tanggal akhir harus diisi",
        })
        .min(1),
    reason: z
        .string({
            required_error: "Alasan harus diisi",
        })
        .min(1),
})

export default function ApprovalEdit({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const { updateApproval, fetchApproval } = useApproval();
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),

        defaultValues: {
            request_type: "",
            start_date: "",
            end_date: "",
            reason: "",
        },
    });

    useEffect(() => {
        const loadApprovalData = async () => {
            if (id) {
                try {
                    const approval = await fetchApproval(id);
                    if (approval) {
                        form.reset({
                            request_type: approval.request_type,
                            start_date: approval.start_date.split(" ")[0],
                            end_date: approval.end_date.split(" ")[0],
                            reason: approval.reason,
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch approval data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadApprovalData();
    }, [id, fetchApproval, form]);



    const typeOptions: OptionType[] = [
        { value: "permit", label: "Izin" },
        { value: "sick", label: "Sakit" },
        { value: "leave", label: "Cuti" },
    ];

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (!id) return;
        try {
            await updateApproval(id, data);
            router.back();
        } catch (error) {
            console.error("Error updating approval:", error);
        }
    };

    if (isLoading) {
        return <div className="px-2 py-4 min-h-screen flex justify-center items-center">Loading...</div>;
    }

    return (
        <div className="px-2 py-4 min-h-screen flex flex-col gap-4">
            {/* Form Tambah Jadwal */}
            <div className="bg-[#f8f8f8] p-8 rounded-xl shadow-md mt-6">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h1 className="text-xl font-bold text-[#1E3A5F]">Edit Approval</h1>
                    <Button onClick={() => {router.back(); }} variant="redirectButton" className="flex items-center">
                        <FaArrowLeft size={16} />
                        <span className="font-medium">Kembali</span>
                    </Button>
                </div>

                {/* Input Nama Jadwal dan Tanggal */}
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
                                                    field.onChange((selectedOption as OptionType)?.value || "");
                                                }
                                            }}
                                            value={typeOptions.find((option) => option.value === field.value)}
                                        />
                                        <FormDescription>Pilih tipe pengajuan yang sesuai.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Pilih tanggal mulai pengajuan.</FormDescription>
                                        <FormMessage />
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
                                            <Input
                                                type="date"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Pilih tanggal akhir pengajuan.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                        <FormDescription>Masukkan alasan pengajuan.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" variant="redirectButton">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}