"use client";

import { useState } from "react";
import CampgroundCard from "../components/CampgroundCard";
import FilterBar, { FilterState } from "../components/FilterBar";
import { Campground } from "@/libs/types";

interface CampgroundsClientProps {
  campgrounds: Campground[];
}

export default function CampgroundsClient({ campgrounds }: CampgroundsClientProps) {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    locations: [],
  });

  // Filter logic — จะทำงานเต็มที่เมื่อ backend รองรับ query params
  const filtered = campgrounds.filter((camp) => {
    const matchSearch = camp.name.toLowerCase().includes(searchText.toLowerCase());
    const matchPrice =
      camp.pricePerNight >= filters.minPrice && camp.pricePerNight <= filters.maxPrice;
    const matchRating =
      filters.minRating === 0 || (camp.avgRating ?? 0) >= filters.minRating;
    const matchLocation =
      filters.locations.length === 0 || filters.locations.includes(camp.region ?? "");
    return matchSearch && matchPrice && matchRating && matchLocation;
  });

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
        <FilterBar onFilterChange={setFilters} />
      </div>

      {/* Campground List */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
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
