import CampgroundCard from "../components/CampgroundCard";
import { getAllCampgrounds } from "@/libs/campgrounds";
import { CampgroundQueryParams } from "@/libs/types";

interface CampgroundsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CampgroundsPage({
  searchParams,
}: CampgroundsPageProps) {
  // Build query params from search params
  const queryParams: CampgroundQueryParams = {};
  
  // if (searchParams.name)
  //   queryParams.name = Array.isArray(searchParams.name)
  //     ? searchParams.name[0]
  //     : searchParams.name;
  // if (searchParams.region)
  //   queryParams.region = Array.isArray(searchParams.region)
  //     ? searchParams.region[0]
  //     : searchParams.region;
  // if (searchParams.minPrice)
  //   queryParams.minPrice = parseFloat(
  //     Array.isArray(searchParams.minPrice)
  //       ? searchParams.minPrice[0]
  //       : searchParams.minPrice,
  //   );
  // if (searchParams.maxPrice)
  //   queryParams.maxPrice = parseFloat(
  //     Array.isArray(searchParams.maxPrice)
  //       ? searchParams.maxPrice[0]
  //       : searchParams.maxPrice,
  //   );
  // if (searchParams.minRating)
  //   queryParams.minRating = parseFloat(
  //     Array.isArray(searchParams.minRating)
  //       ? searchParams.minRating[0]
  //       : searchParams.minRating,
  //   );

  const campgroundsResponse = await getAllCampgrounds(queryParams);

  if (!campgroundsResponse.success) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Campgrounds
        </h1>
        <p>{campgroundsResponse.message}</p>
      </main>
    );
  }

  const campgrounds = campgroundsResponse.data;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Available Campgrounds
      </h1>

      <div className="flex flex-col">
        {campgrounds.map((camp) => (
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
        ))}
      </div>
    </main>
  );
}
