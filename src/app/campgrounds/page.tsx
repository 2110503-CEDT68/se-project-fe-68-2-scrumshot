'use client';

import CampgroundCard from "../components/CampgroundCard";
import { deleteCampground, getAllCampgrounds } from "@/libs/campgrounds";
import FilterBar, { FilterState } from "../components/FilterBar";
import { Campground } from "@/libs/types";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CampgroundsPage() {
  const { data: session } = useSession();

  const [campgrounds, setCampgrounds] = useState<Campground[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    regions: [],
  });
  
  const fetchCampgrounds = async () => {
    const campgroundsResponse = await getAllCampgrounds({
      name: searchText || undefined, // empty string -> undefined
      region: filters.regions || undefined, // empty list -> undefined
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      // maxRating: filters.maxRating,
    })
    
    if (!campgroundsResponse.success) {
      setErrorMsg(campgroundsResponse.message);
      return;
    }
    
    setCampgrounds(campgroundsResponse.data);
  };
  
  useEffect(() => { fetchCampgrounds(); }, [filters, searchText])
  
  const handleDelete = async (_id: string) => {
    if (!(session?.user as any)?.backendToken) return;

    const result = await deleteCampground(_id, (session?.user as any).backendToken as string);

    if (result.success) fetchCampgrounds(); 
    else alert(result.message);
  };

  if (errorMsg) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Campgrounds
        </h1>
        <p>{errorMsg}</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Available Campgrounds</h1>

      {/* Create Campground Button (Admin Only) */}
      {(session?.user as any)?.role === 'admin' && (
        <div className="flex justify-end mb-6">
          <Link
            href="/campgrounds/create"
            className="bg-[#6750A4] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#5a458c] transition-colors"
          >
            + Create Campground
          </Link>
        </div>
      )}

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <div className="relative flex-1 w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search for your campgrounds"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
          />
        </div>

        {/* Filter Dropdowns */}
        <FilterBar onFilterChange={setFilters} />
      </div>

      {/* Campground List */}
      <div className="flex flex-col gap-4">
        {campgrounds.length === 0 ? (
          <p className="text-center text-gray-500 italic mt-10">No campgrounds found</p>
        ) : (
          campgrounds.map((camp) => (
            <CampgroundCard
              key={camp._id}
              handleDelete={handleDelete}
              campground={camp}
            />
          ))
        )}
      </div>
    </main>
  );
}
