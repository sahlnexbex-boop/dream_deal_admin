// src/components/dashboard/profileCardSkeleton.tsx
export default function ProfileCardSkeleton() {
    return (
      <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 relative overflow-hidden animate-pulse">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="md:w-32 md:h-32 w-28 h-28 rounded-full bg-gray-200" />
            </div>
            <div>
              <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          </div>
  
          <div className="flex md:flex-col gap-2 w-full md:w-auto">
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded-full" />
          </div>
        </div>
  
        <div className="grid grid-cols-3 md:gap-6 gap-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  