import { Crown, Users } from "lucide-react";

export default function Levels() {
  const levels = [
    { title: "Promoter", sub: "100 Customers", active: true },
    { title: "Main Promoter", sub: "500+ Customers", active: true },
    { title: "Promoter Lead", sub: "1000 Customers", active: false },
    { title: "Promoter Director", sub: "2000 Customers", active: false },
  ];

  return (
    <div className="bg-gradient-to-b from-[#fffffe] to-[#fcfff0d2] rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-lg text-gray-800 mb-6">Level</h3>

      <div className="relative pl-2">
        <div className="absolute left-[14px] top-2 bottom-10 w-[2px] bg-lime-100 z-0"></div>
        <div className="absolute left-[14px] top-2 h-[75px] w-[2px] bg-lime-500 z-0"></div>

        <div className="space-y-6 relative z-10">
          {levels.map((lvl, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-sm mt-1 shrink-0 ${
                  lvl.active
                    ? "bg-lime-500"
                    : idx === 3
                    ? "bg-transparent text-lime-500"
                    : "bg-lime-100"
                }`}
              >
                {idx === 3 && (
                  <div className="text-[10px] -mt-1 -ml-0.5">
                    <Crown size={12} />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{lvl.title}</p>
                <span className="inline-flex items-center gap-1 bg-lime-50 text-lime-700 text-[10px] px-2 py-0.5 rounded-full border border-lime-100 mt-1">
                  <Users size={8} /> {lvl.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};