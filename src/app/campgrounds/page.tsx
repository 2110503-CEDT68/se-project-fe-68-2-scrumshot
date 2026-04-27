'use client';

import CampgroundCard from "../components/CampgroundCard";
import { deleteCampground, getAllCampgrounds } from "@/libs/campgrounds";
import FilterBar, { FilterState } from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import { Campground } from "@/libs/types";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function CampgroundCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row rounded-[20px] shadow-lg overflow-hidden bg-white">
      <div className="w-full sm:w-1/2 h-64 bg-gray-200 animate-pulse" />
      <div className="flex-1 p-6 flex flex-col gap-3">
        <div className="h-7 bg-gray-200 rounded-md animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/2" />
        <div className="space-y-2 mt-1">
          <div className="h-3 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-3 bg-gray-200 rounded-md animate-pulse w-5/6" />
          <div className="h-3 bg-gray-200 rounded-md animate-pulse w-4/5" />
        </div>
        <div className="mt-auto flex justify-between items-center pt-4">
          <div className="h-5 bg-gray-200 rounded-md animate-pulse w-24" />
          <div className="h-10 bg-gray-200 rounded-[15px] animate-pulse w-32" />
        </div>
      </div>
    </div>
  );
}

const DEFAULT_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  regions: [],
};

export default function CampgroundsPage() {
  const { data: session } = useSession();

  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchCampgrounds = async () => {
    setIsLoading(true);
    const campgroundsResponse = await getAllCampgrounds({
      name: debouncedSearch || undefined,
      region: filters.regions.length ? filters.regions : undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
    });

    if (!campgroundsResponse.success) {
      setErrorMsg(campgroundsResponse.message);
      setIsLoading(false);
      return;
    }

    setCampgrounds(campgroundsResponse.data);
    setIsLoading(false);
  };

  useEffect(() => { fetchCampgrounds(); }, [filters, debouncedSearch]);

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

  const isFiltered =
    !!debouncedSearch ||
    filters.regions.length > 0 ||
    filters.minPrice > DEFAULT_FILTERS.minPrice ||
    filters.maxPrice < DEFAULT_FILTERS.maxPrice ||
    filters.minRating > DEFAULT_FILTERS.minRating;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Available Campgrounds</h1>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <SearchBar value={searchText} onChange={setSearchText} />
        <FilterBar onFilterChange={setFilters} />
      </div>

      {/* Campground List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <CampgroundCardSkeleton key={i} />
          ))
        ) : campgrounds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-gray-700 mb-1">
              {isFiltered ? "No campgrounds found" : "No campgrounds available"}
            </p>
            <p className="text-sm text-gray-500">
              {isFiltered
                ? "Try adjusting your search or filters."
                : "Check back later for new campgrounds."}
            </p>
          </div>
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
