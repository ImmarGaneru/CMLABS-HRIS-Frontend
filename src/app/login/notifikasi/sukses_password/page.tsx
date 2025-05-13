export default function SuksesPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white text-gray-800 px-4">
      {/* Card Content */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-8 w-full max-w-md text-center">
        <img
          src="/logo-sukses.svg"
          alt="Success Icon"
          className="w-12 h-12 mx-auto mb-4"
        />
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Password berhasil diubah
        </h1>
        <p className="text-sm text-gray-700 mb-4">
          Kamu bisa masuk dengan password barumu. <br />
          Jika kamu menemukan masalah, tolong beritahu <br />
          kontak bantuan!
        </p>

        {/* Garis gradasi */}
        <div className="w-full h-[2px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />

        {/* Tombol ke Halaman Login */}
        <a
          href="/login/email"
          className="hover:bg-[#248BE2] bg-[#1a6fc2] text-blue-600 text-white font-semibold py-2 px-4 rounded-md block"
        >
          Ke Halaman Login
        </a>
      </div>
    </div>
  );
}