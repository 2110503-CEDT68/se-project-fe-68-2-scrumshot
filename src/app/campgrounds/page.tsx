import CampgroundCard from '../components/CampgroundCard';
import { getAllCampgrounds } from '@/libs/campgrounds';

export default async function CampgroundsPage() {
  const campgroundsResponse = await getAllCampgrounds();

  if (!campgroundsResponse.success) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Campgrounds</h1>
        <p>{campgroundsResponse.message}</p>
      </main>
    );
  }

  const campgrounds = campgroundsResponse.data;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Available Campgrounds</h1>
      
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
          />
        ))}
      </div>
    </main>
  );
}