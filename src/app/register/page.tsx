export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-white flex-col md:flex-row">
      {/* KIRI: Section HRIS */}
      <div className="md:w-1/2 w-full flex flex-col items-center justify-start text-white pt-8 p-10 bg-white">
        <img
          src="/icon.jpg"
          alt="HRIS Icon"
          className="max-w-lg mb-6 object-contain"
        />
        <h1
          className="text-5xl font-bold text-transparent bg-clip-text"
          style={{
            backgroundImage: 'linear-gradient(to right, #7CA5BF, #1E3A5F)',
          }}
        >
          HRIS
        </h1>
        <p className="mt-4 text-center max-w-md text-gray-700 text-lg">
          Platform HRIS all-in-one untuk otomatisasi payroll, absensi, dan
          analitik SDM — bantu tim HR fokus pada strategi, bukan administrasi.
        </p>
      </div>

      {/* KANAN: Kotak Form HRIS */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6">
        <div className="bg-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
          <h2 className="text-[32px] font-bold text-gray-800 mb-2 leading-tight">
            Daftar HRIS
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Daftarkan akunmu dan manage karyawan dengan mudah dengan HRIS
          </p>
          <div className="w-full h-[3px] bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-full mb-4" />

          <form className="space-y-4">
            {[
              'Nama Lengkap',
              'Nama Perusahaan',
              'Email',
              'Nomor Telepon',
              'Password',
              'Konfirmasi Password',
            ].map((label, i) => (
              <div key={i} className="space-y-1">
                <label className="text-sm text-gray-600">{label}</label>
                <input
                  type={label.toLowerCase().includes('password') ? 'password' : 'text'}
                  placeholder={label}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="text-sm text-gray-600">Paket Premium</label>
                <select className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 text-sm">
                  <option>Paket Premium</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="text-sm text-gray-600">Jumlah Seat</label>
                <select className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 text-sm">
                  <option>51 - 100 Seat</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md mt-4 mb-3"
            >
              Daftar Sekarang
            </button>

            {/* Divider Metode Lain */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-grow h-px bg-blue-300" />
              <span className="text-sm font-semibold text-blue-400 whitespace-nowrap">
                Metode Lain
              </span>
              <div className="flex-grow h-px bg-blue-300" />
            </div>

            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md bg-white font-semibold mt-2">
              <span>Gunakan akun Google</span>
              <img src="/icon-google.svg" alt="Google" className="w-5 h-5" />
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Sudah pernah daftar?{' '}
            <a href="#" className="text-blue-600 font-medium">
              Masuk disini
            </a>
          </p>
          <p className="text-xs text-center text-gray-500 mt-2">
            Dengan menekan tombol daftar, saya telah membaca dan menyetujui serta patuh kepada{' '}
            <a href="#" className="text-blue-600">
              Syarat & Ketentuan HRIS
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
