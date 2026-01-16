// import React from "react";

export default function StatsRow() {
  return (
    <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
      <div>
        <p className="text-lime-500 text-md font-medium">Passive Income</p>
        <p className="text-2xl md:font-bold font-semibold text-gray-800">₹0.00</p>
      </div>
      <div className="md:border-l border-gray-100 md:pl-6">
        <p className="text-lime-500 text-md font-medium">Collections</p>
        <p className="text-2xl md:font-bold font-semibold text-gray-800">#13</p>
      </div>
      <div className="md:border-l border-gray-100 md:pl-6">
        <p className="text-lime-500 text-md font-medium">New Registration</p>
        <p className="text-2xl md:font-bold font-semibold text-gray-800">94</p>
      </div>
      <div className="md:border-l border-gray-100 md:pl-6">
        <p className="text-lime-500 text-md font-medium">Activities</p>
        <p className="text-2xl md:font-bold font-semibold text-gray-800">8</p>
      </div>
    </div>
  );
}
