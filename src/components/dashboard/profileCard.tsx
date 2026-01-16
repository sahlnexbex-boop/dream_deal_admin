import { ArrowUpRight, CheckCircle2, MapPin, Star } from "lucide-react";

export default function ProfileCard() {
  return (
    <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="/Images/main_user.png"
              alt="Profile"
              className="md:w-32 md:h-32 w-28 h-28 rounded-full object-cover border border-white shadow-md"
            />
            <span className="absolute bottom-0 right-0 bg-lime-500 text-white md:text-[10px] text-[8px] md:px-2 px-1 py-0.5 rounded-full font-bold border-2 border-white">
              Active
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs mb-1 text-lime-500">
              <MapPin size={12} />
              <span>Malappuram</span>
            </div>
            <h2 className="md:text-2xl text-xl font-bold text-gray-800">William John</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-gray-400 text-xs">#124KL2</span>
              <span className="flex items-center gap-1 bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full text-[10px] font-medium border border-green-100">
                <CheckCircle2 size={10} /> Agreement Verified
              </span>
              <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full text-[10px] font-medium border border-blue-100">
                <CheckCircle2 size={10} /> KYC Verified
              </span>
            </div>
            <div className="mt-2">
              <span className=" flex items-center gap-1 bg-yellow-50 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full border border-yellow-100 font-medium w-fit">
                <Star size={10} />
                <span>Promoting Partner</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex md:flex-col flex-wrap md:items-end gap-2 w-full md:w-auto">
          <button className="flex items-center gap-1 text-lime-600 text-xs font-semibold bg-lime-50 px-3 py-1.5 rounded-full hover:bg-lime-100 transition hover:border-lime-500">
            View ID Card <ArrowUpRight size={12} />
          </button>
          <div className="text-right">
            <div className="text-3xl font-medium text-gray-800">₹3,885.50</div>
          </div>
          <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium text-sm px-10 tracking-wide py-2 mt-2 rounded-full shadow-sm transition w-full md:w-auto hover:border-lime-600">
            Withdraw
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 md:gap-6 gap-2 pt-2 ">
        <div className="flex flex-col items-center">
          <p className="text-lime-500 md:text-md text-xs font-medium mb-1 text-start">
            Total Income
          </p>
          <p className="md:text-3xl text-lg font-semibold text-gray-800">₹3,885.50</p>
        </div>
        <div className="border-l border-gray-100 md:pl-6 pl-2  flex flex-col items-center">
          <p className="text-lime-500 md:text-md text-xs font-medium mb-1">
            Direct Income
          </p>
          <p className="md:text-3xl text-lg font-semibold text-gray-800">₹3,885.50</p>
        </div>
        <div className="border-l border-gray-100 md:pl-6 pl-2 flex flex-col items-center">
          <p className="text-lime-500 md:text-md text-xs font-medium mb-1">Customers</p>
          <p className="md:text-3xl text-lg font-semibold text-gray-800">520</p>
        </div>
      </div>
    </div>
  );
};