/* eslint-disable @next/next/no-img-element */
  "use client";

  import { useState, useEffect } from "react";
  import { useRouter, useParams } from "next/navigation"; // tambahkan useParams

  import { getEmployee } from "../../../../../utils/employee"; // import fungsi fetch
  type Dokumen = {
    name: string;
    file: string;
    uploaded_at?: string;
  };
  type Karyawan = {
    id: string;
  name: string;
  avatar: string | Blob | undefined;
  first_name: string;
  last_name: string;
  jabatan: string;
  nik: string;
  address: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  pendidikan: string;
  email: string;
  notelp: string;
  documents: Dokumen[];
  startDate: string;
  tenure: string;
  endDate: string;
  jadwal: string;
  tipeKontrak: string;
  cabang: string;
  employment_status: string;
  tanggalEfektif: string;
  bank: string;
  norek: string;
  gaji: string;
  uangLembur: string;
  dendaTerlambat: string;
  TotalGaji: string;
    
  };

  export default function DetailKaryawan() {
    const router = useRouter();
      const params = useParams();
      const [karyawan, setKaryawan] = useState<Karyawan | null>(null);
      const [loading, setLoading] = useState<boolean>(false);
      const [error, setError] = useState<string | null>(null);
      
      useEffect(() => {
      const id = params?.id as string; // ambil id dari URL
    if (!id) {
      setError("ID karyawan tidak tersedia");
      return;
    }

    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);

      try {
        const rawData = await getEmployee(id);

        const mappedData: Karyawan = {
          id: rawData.id_user,
          name: `${rawData.first_name} ${rawData.last_name}`,
          avatar: rawData.avatar ? `http://localhost:8000/storage/${rawData.avatar}` : '/default.jpg',
          jabatan: rawData.jabatan,
          nik: rawData.nik || '-',
          address: rawData.address,
          tempatLahir: rawData.tempatLahir,
          tanggalLahir: rawData.tanggalLahir,
          jenisKelamin: rawData.jenisKelamin,
          pendidikan: rawData.pendidikan,
          email: rawData.email || '-',
          notelp: rawData.notelp,
          documents: rawData.documents || [],
          startDate: rawData.startDate || '-',
          tenure: rawData.tenure || '-',
          endDate: rawData.endDate || '-',
          jadwal: rawData.jadwal,
          tipeKontrak: rawData.tipeKontrak,
          cabang: rawData.cabang,
          employment_status: rawData.employment_status || '-',
          tanggalEfektif: rawData.tanggalEfektif || '-',
          bank: rawData.bank,
          norek: rawData.norek,
          gaji: rawData.gaji || '0',
          uangLembur: rawData.uangLembur || '0',
          dendaTerlambat: rawData.dendaTerlambat || '0',
          TotalGaji: rawData.TotalGaji || '0',
          first_name: "",
          last_name: ""
        };

        setKaryawan(mappedData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data karyawan");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  },  [params?.id]); 

    const formatRupiah = (value: string | number | undefined) =>
      value ? `Rp ${Number(value).toLocaleString("id-ID")}` : "-";

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
    if (!karyawan) return <div className="p-6">Tidak ada data karyawan</div>;


    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
    if (!karyawan) return <div className="p-6">Data karyawan tidak ditemukan.</div>;

    return (
      <div className= " px-6 py-4 bg-white rounded shadow w-full mt-2 min-h-screen font-sans">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#141414]">Detail Karyawan</h1>
          <button
            onClick={() => router.push("/employee")}
            className="flex items-center bg-[#1E3A5F] text-white px-4 py-2 rounded-md hover:bg-[#155A8A] transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-20 items-start">
          {/* Foto dan Identitas */}
          <div className="flex flex-col items-start mb-6">
            <div className="w-40 h-50 overflow-hidden mb-3 bg-gray-200 rectangle">
              <img
                src={karyawan.avatar || "/default.jpg"}
                alt={karyawan.name}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-bold text-lg">{karyawan.name}</p>
            <p className="text-sm text-gray-500">{karyawan.jabatan}</p>
          </div>

          {/* Detail Info */}
          <div className="flex-1 flex flex-col gap-y-10">
            <Section title="Informasi Pribadi">
              <FieldRow label="NIK" value={karyawan.nik} />
              <FieldRow label="Alamat" value={karyawan.address} />
              <FieldRow
                label="Tempat, Tgl Lahir"
                value={`${karyawan.tempatLahir}, ${karyawan.tanggalLahir}`}
              />
              <FieldRow label="Jenis Kelamin" value={karyawan.jenisKelamin} />
              <FieldRow label="Pendidikan Terakhir" value={karyawan.pendidikan} />
              <FieldRow label="Email" value={karyawan.email} />
              <FieldRow label="No Telp" value={karyawan.notelp} />
            </Section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Section title="Informasi Kepegawaian">
                <FieldRow label="Mulai Kerja" value={karyawan.startDate} />
                <FieldRow label="Masa Kerja" value={karyawan.tenure} />
                <FieldRow label="Akhir Kerja" value={karyawan.endDate} />
                <FieldRow label="Jadwal Kerja" value={karyawan.jadwal} />
                <FieldRow label="Tipe Kontrak" value={karyawan.tipeKontrak} />
                <FieldRow label="Jabatan" value={karyawan.jabatan} />
                <FieldRow label="Cabang" value={karyawan.cabang} />
                <FieldRow label="Status Kerja" value={karyawan.employment_status} />
              </Section>

              <Section title="Payroll">
                <FieldRow label="Tanggal Efektif" value={karyawan.tanggalEfektif} />
                <FieldRow label="Bank" value={karyawan.bank} />
                <FieldRow label="Nomer Rekening" value={karyawan.norek} />
                <FieldRow
                  label="Gaji Pokok"
                  value={formatRupiah(karyawan.gaji)}
                />
                <FieldRow
                  label="Uang Lembur"
                  value={formatRupiah(karyawan.uangLembur)}
                />
                <FieldRow
                  label="Denda Terlambat"
                  value={formatRupiah(karyawan.dendaTerlambat)}
                />
                <FieldRow
                  label="Total Gaji"
                  value={
                    <span className="font-bold">
                      {formatRupiah(karyawan.TotalGaji)}
                    </span>
                  }
                />
              </Section>
            </div>

  <Section title="Dokumen Karyawan">
  { karyawan.documents && karyawan.documents.length > 0 ? (
    <div className="space-y-3">
      {karyawan.documents.map((doc, index) => (
        <div key={index} className="max-w-[480px] w-full p-2 rounded-lg bg-[#7CA5BF]/60">
          <div className="flex justify-between items-center">
            <a
              href={`http://localhost:8000/storage/${doc.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[18px] text-[#141414] font-medium hover:underline"
            >
              {doc.name}
            </a>
            <p className="text-[14px] text-[#141414] opacity-60 font-normal">
              uploaded at - {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-600 italic">Tidak ada dokumen</p>
  )}

  </Section>




          </div>
        </div>
      </div>
    );
  }

  function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
      <div className="flex text-[16px]">
        <div className="w-48 font-normal">{label}</div>
        <div className="font-bold">:</div>
        <div className="ml-2">{value}</div>
      </div>
    );
  }

  function Section({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-[#141414] mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          {children}
        </div>
      </div>
    );
  }
