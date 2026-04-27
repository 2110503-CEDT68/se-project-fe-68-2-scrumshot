"use client";

import { useState, useEffect, useCallback } from "react";
import CampgroundCard from "../components/CampgroundCard";
import FilterBar, { FilterState } from "../components/FilterBar";
import { Campground } from "@/libs/types";
import { getAllCampgrounds } from "@/libs/campgrounds";

export default function CampgroundsClient({ campgrounds: initialCampgrounds }: { campgrounds: Campground[] }) {
  const [searchText, setSearchText] = useState("");
  const [campgrounds, setCampgrounds] = useState<Campground[]>(initialCampgrounds);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    locations: [],
  });

  const fetchFiltered = useCallback(async (f: FilterState) => {
    setLoading(true);
    try {
      const res = await getAllCampgrounds({
  minPrice: f.minPrice > 0 ? f.minPrice : undefined,
  maxPrice: f.maxPrice < 1000 ? f.maxPrice : undefined,
  minRating: f.minRating > 0 ? f.minRating : undefined,
  regions: f.locations.length > 0 ? f.locations : undefined,
});
      if (res.success) setCampgrounds(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiltered(filters);
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // search ยังทำใน frontend รอเพื่อนทำ backend search
  const filtered = campgrounds.filter((camp) =>
    camp.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Available Campgrounds</h1>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        {/* Search box — UI only, logic เป็นงานเพื่อน */}
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
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      {/* Campground List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-center text-gray-400 italic mt-10">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 italic mt-10">No campgrounds found</p>
        ) : (
          filtered.map((camp) => (
            <CampgroundCard
              key={camp._id}
              _id={camp._id}
              name={camp.name}
              address={camp.address}
              description={camp.description}
              pricePerNight={camp.pricePerNight}
              picture={camp.picture}
              avgRating={camp.avgRating}
              totalReviews={camp.totalReviews}
            />
          ))
        )}
      </div>
    </main>
  );
}
