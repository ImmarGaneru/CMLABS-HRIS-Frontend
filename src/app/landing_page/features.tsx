export default function Features() {
    const features = [
      {
        title: "Absensi",
        desc: "Absensi real-time dengan facial recognition, akurat 99.9%"
      },
      {
        title: "Payroll",
        desc: "Hitung gaji & pajak otomatis, tanpa risiko human error."
      },
      {
        title: "Self-Service",
        desc: "Beri karyawan akses mudah untuk klaim benefit, cuti, dan slip gaji."
      }
    ];
  
    return (
      <section className="px-8 py-16 bg-[#f8f8f8] text-center">
        <h2
          className="mb-6 font-bold leading-tight"
          style={{
            fontSize: "64px",
            color: "#1E3A5F",
            fontFamily: "Inter, sans-serif",
            lineHeight: "1.2"
          }}
        >
          <span className="block">Satu platform untuk</span>
          <span className="block">semua kebutuhan anda</span>
        </h2>
  
        <p className="text-gray-600 mb-12 max-w-xl mx-auto text-lg">
          Dari rekrutmen sampai pensiun, HRIS menyederhanakan proses SDM dengan teknologi terkini.
        </p>
  
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-[4px] rounded-[24px]"
              style={{
                background: "linear-gradient(to right, #7CA5BF, #1E3A5F)"
              }}
            >
              <div
                className="h-full rounded-[20px] p-6 text-left"
                style={{
                  backgroundColor: "#f8f8f8"
                }}
              >
                <h3 className="font-semibold text-[#1E3A5F] mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  