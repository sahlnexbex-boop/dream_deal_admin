import { Trophy } from "lucide-react";

export default function TopEarnersList() {
  const earners = [
    {
      name: "William John",
      id: "#14548",
      rank: 1,
      color: "bg-lime-500",
      img: "/Images/user_01.png",
    },
    {
      name: "Alice",
      id: "#24248",
      rank: 2,
      color: "bg-lime-400",
      img: "/Images/user_02.png",
    },
    {
      name: "John George",
      id: "#96548",
      rank: 3,
      color: "bg-lime-300",
      img: "/Images/user_03.png",
    },
  ];

  return (
    <div className="md:col-span-3 bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={16} className="text-lime-500" />
        <h3 className="font-semibold text-gray-700">
          Highest Earners of the month
        </h3>
      </div>

      <div className="flex justify-between items-center px-2 gap-x-2">
        {earners.map((earner) => (
          <div key={earner.id} className="flex flex-col items-center">
            <div className="relative mb-2">
              <img
                src={earner.img}
                alt={earner.name}
                className={`rounded-full object-cover border border-white shadow-md md:w-28 md:h-28`}
              />
              <div
                className={`absolute bottom-1 right-1 w-fit h-fit px-1 py-0.5 ${earner.color} text-white text-xs font-semibold flex items-center justify-center rounded-full border-2 border-white`}
              >
                {earner.rank === 1 ? "1st" : earner.rank === 2 ? "2nd" : "3rd"}
              </div>
            </div>
            <p className="text-sm md:font-bold font-semibold text-gray-800 mt-1">
              {earner.name}
            </p>
            <p className="text-[10px] text-gray-500">{earner.id}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1 mt-6">
        <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};