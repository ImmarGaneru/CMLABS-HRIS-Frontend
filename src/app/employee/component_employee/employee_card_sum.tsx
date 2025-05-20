'use client';

export default function EmployeeCardSum(){
    return(
        <div className="bg-[#f8f8f8] p-6 rounded-xl shadow-md">
        <div className="flex justify-between gap-4">
          {[{ label: "Periode", value: "Aug/2025" },
            { label: "Total Employee", value: "234 Employee" },
            { label: "Total New Hire", value: "12 Person" },
            { label: "Full Time Employee", value: "212 Full Time" }].map((info, idx) => (
              <div key={idx} className="flex-1 text-center">
                <strong className="text-xl">{info.value}</strong>
                <p className="text-sm text-gray-500">{info.label}</p>
              </div>
          ))}
        </div>
      </div>
    );
}