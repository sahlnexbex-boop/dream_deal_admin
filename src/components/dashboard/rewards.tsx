import {
  Check,
  Crown,
  Gift,
  Headphones,
  Laptop,
  Smartphone,
  Users,
  Watch,
} from "lucide-react";

export default function Rewards() {
  const steps = [
    {
      image: "/Images/headphone.png",
      title: "headphone",
      sub: "100 Customers",
      active: true,
      color: "bg-orange-400",
    },
    {
      image: "/Images/watch.png",
      title: "Smart Watch",
      sub: "500 Customers",
      active: true,
      color: "bg-orange-400",
    },
    {
      image: "/Images/airpod.png",
      title: "AirPod",
      sub: "1000 Customers",
      active: false,
      color: "bg-gray-100",
    }, // Using Gift for generic box
    {
      image: "/Images/phone.png",
      title: "Android Phone",
      sub: "2000 Customers",
      active: false,
      color: "bg-orange-100",
    },
    {
      image: "/Images/laptop.png",
      title: "Laptop",
      sub: "10000 Customers",
      active: false,
      color: "bg-orange-100",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#fffbf5] to-[#fff9ee] rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-6 text-lg">Rewards</h3>

      <div className="relative pl-2">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-2 bottom-6 w-[2px] bg-orange-100 z-0"></div>
        {/* Active Line Segment overlay */}
        <div className="absolute left-[19px] top-2 h-[100px] w-[2px] bg-orange-400 z-0"></div>

        <div className="space-y-4 relative z-10">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ${
                  step.active
                    ? "bg-orange-400 text-white"
                    : "bg-orange-100 text-orange-300"
                }`}
              >
                {idx < 2 && <Check size={16} className="absolute text-white" />}
                {idx === 4 && (
                  <div className="absolute text-yellow-400">
                    {" "}
                    <Crown size={16} />
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div
                className={`flex-1 flex items-center justify-between p-3 rounded-xl ${
                  step.active
                    ? "bg-gradient-to-r from-orange-300 to-orange-200"
                    : "bg-orange-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-800 opacity-80">
                    <img src={step.image} alt="" className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {step.title}
                    </p>
                    <p
                      className={`text-[10px] mt-1 text-gray-600 flex items-center gap-1  rounded-full px-1.5 py-0.5 ${
                        step.active
                          ? "bg-orange-50/40"
                          : "bg-orange-200/60"
                      }`}
                    >
                      <Users size={8} /> {step.sub}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center bg-white ${
                    step.active ? "text-orange-400" : "hidden"
                  }`}
                >
                  <Check size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
