export default function RewardsCard() {
  return (
    <div className="bg-white rounded-xl p-5">
      <h3 className="font-semibold mb-4">Rewards</h3>

      {["Headphone", "Smart Watch", "Laptop"].map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center p-3 bg-orange-50 rounded-lg mb-2"
        >
          <span>{item}</span>
          <span className="text-sm text-gray-500">✔</span>
        </div>
      ))}
    </div>
  );
}
