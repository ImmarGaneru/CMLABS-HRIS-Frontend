export default function KodePasswordPage() {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-white text-gray-800 px-4">
        {/* Card Content */}
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-12 w-full max-w-md max-h-[360px] text-center">
          {/* Icon Kode */}
          <img
            src="/logo-kode.svg"
            alt="Kode Icon"
            className="w-12 h-10 mx-auto mb-0"
          />
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Masukkan Kode
          </h1>
          <p className="text-xs text-gray-700 mb-2">
            Kami telah mengirimkan kode 6-digit melalui SMS. <br />
            <span className="font-semibold">08-- ---- ----</span> <br />
            Mohon cek pesan anda.
          </p>
  
          {/* Garis gradasi */}
          <div className="w-full h-[2px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />
  
          {/* Form Input */}
            <div className="text-left w-full mb-2">
            <label htmlFor="kode" className="block text-xs font-medium mb-1">
                Kode
            </label>
            <input
                type="text"
                id="kode"
                name="kode"
                placeholder="XXX XXX"
                className="w-full px-4 py-2 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#248BE2]"
            />
            </div>
  
          {/* Tombol */}
            <button className="w-full mt-2 bg-[#248BE2] hover:bg-[#1a6fc2] text-white font-semibold py-2 px-4 rounded-md text-sm">
            Masukkan Kode
            </button>

  
          {/* Link tambahan */}
          <div className="text-left w-full mt-2 text-xs">
            <p>
                Tidak menerima pesan?{" "}
                <a href="#" className="text-[#248BE2] font-medium text-xs">
                Tekan untuk kirim ulang
                </a>
            </p>
            <a
                href="/login"
                className="text-[#248BE2] text-xs mt-1 inline-block"
            >
                Kembali ke halaman Login
            </a>
        </div>
        </div>
      </div>
    );
  }
  