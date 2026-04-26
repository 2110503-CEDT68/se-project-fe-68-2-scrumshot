"use client";

import { useState } from "react";
import { Slider, Rating, Checkbox, FormControlLabel } from "@mui/material";

export type FilterState = {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  locations: string[];
};

interface FilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
}

const LOCATIONS = ["Northern", "Northeastern", "Western", "Central", "Eastern", "South"];

const DEFAULT_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  locations: [],
};

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<"price" | "rating" | "location" | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const toggleDropdown = (dropdown: "price" | "rating" | "location") => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const buttonClass = (key: "price" | "rating" | "location") =>
    `flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
      openDropdown === key
        ? "bg-[#4a2f8a] text-white"
        : "bg-[#6750A4] text-white hover:bg-[#5a3f94]"
    }`;

  return (
    <div className="relative flex items-center gap-3">

      {/* Price Button */}
      <div className="relative">
        <button className={buttonClass("price")} onClick={() => toggleDropdown("price")}>
          Price
          {openDropdown === "price" ? "▲" : "▼"}
        </button>

        {openDropdown === "price" && (
          <div className="absolute top-11 left-0 z-50 bg-white rounded-xl shadow-lg p-5 w-64">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 text-center">
              Price Range
            </p>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              min={0}
              max={1000}
              step={100}
              onChange={(_, val) => {
                const [min, max] = val as number[];
                updateFilters({ minPrice: min, maxPrice: max });
              }}
              sx={{ color: "#6750A4" }}
            />
            <p className="text-sm text-gray-600 mt-1 text-center">
              THB {filters.minPrice.toLocaleString()} – {filters.maxPrice.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Rating Button */}
      <div className="relative">
        <button className={buttonClass("rating")} onClick={() => toggleDropdown("rating")}>
          Rating
          {openDropdown === "rating" ? "▲" : "▼"}
        </button>

        {openDropdown === "rating" && (
          <div className="absolute top-11 left-0 z-50 bg-white rounded-xl shadow-lg p-5 w-56">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-600 font-medium">Rating</p>
              <p className="text-sm text-gray-400">
                {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
              </p>
            </div>
            <Rating
              value={filters.minRating}
              onChange={(_, val) => updateFilters({ minRating: val ?? 0 })}
              sx={{
                "& .MuiRating-iconFilled": { color: "#f59e0b" },
                "& .MuiRating-iconEmpty": { color: "#d1d5db" },
                fontSize: "2rem",
              }}
            />
          </div>
        )}
      </div>

      {/* Location Button */}
      <div className="relative">
        <button className={buttonClass("location")} onClick={() => toggleDropdown("location")}>
          Location
          {openDropdown === "location" ? "▲" : "▼"}
        </button>

        {openDropdown === "location" && (
          <div className="absolute top-11 right-0 z-50 bg-white rounded-xl shadow-lg p-4 w-52">
            {LOCATIONS.map((loc) => (
              <FormControlLabel
                key={loc}
                label={loc}
                control={
                  <Checkbox
                    checked={filters.locations.includes(loc)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...filters.locations, loc]
                        : filters.locations.filter((l) => l !== loc);
                      updateFilters({ locations: updated });
                    }}
                    sx={{ color: "#6750A4", "&.Mui-checked": { color: "#6750A4" } }}
                  />
                }
                sx={{ display: "flex", margin: 0 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
