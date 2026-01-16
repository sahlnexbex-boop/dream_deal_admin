export default function ProfileCard() {
  return (
    <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/80"
          className="rounded-full"
        />
        <div>
          <h2 className="font-bold text-lg">William John</h2>
          <p className="text-sm text-gray-500">Promoting Partner</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-gray-500 text-sm">Balance</p>
        <h2 className="text-2xl font-bold text-green-600">₹3,885.50</h2>
        <button className="mt-2 px-4 py-2 bg-lime-400 rounded-full">
          Withdraw
        </button>
      </div>
    </div>
  );
}
