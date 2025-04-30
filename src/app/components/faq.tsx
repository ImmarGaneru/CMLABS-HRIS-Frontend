export default function FAQ() {
  return (
    <section className="px-8 py-16 text-center">
      <h2
        className="font-bold leading-tight mb-2"
        style={{
          fontSize: "64px",
          fontFamily: "Inter, sans-serif",
          color: "#1E3A5F"
        }}
      >
        Pertanyaan yang<br />Sering Diajukan
      </h2>
      <p className="text-[#1E3A5F] mb-10 text-base">
        Kami tahu anda punya pertanyaan, ini jawabannya:
      </p>

      <div className="max-w-2xl mx-auto text-left space-y-6">
        {/* FAQ 1 */}
        <div className="pl-8">
          <hr className="border-t-[3px] border-[#1E3A5F] mb-4" />
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer font-semibold text-[#1E3A5F] text-lg">
              <span className="transform group-open:rotate-180 transition-transform duration-300">
                ▼
              </span>
              <span>Apakah data kami aman?</span>
            </summary>
            <p className="text-gray-600 mt-2 text-base ml-8">
              Data dienkripsi dengan standar bank dan disimpan di server lokal.
            </p>
          </details>
          <hr className="border-t-[3px] border-[#7CA5BF] mt-4" />
        </div>

        {/* FAQ 2 */}
        <div className="pl-8">
          <hr className="border-t-[3px] border-[#1E3A5F] mb-4" />
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer font-semibold text-[#1E3A5F] text-lg">
              <span className="transform group-open:rotate-180 transition-transform duration-300">
                ▼
              </span>
              <span>Bisa demo gratis?</span>
            </summary>
            <p className="text-gray-600 mt-2 text-base ml-8">
              Ya, Anda bisa mencoba HRIS gratis selama 14 hari tanpa kartu kredit.
            </p>
          </details>
          <hr className="border-t-[3px] border-[#7CA5BF] mt-4" />
        </div>
      </div>
    </section>
  );
}
