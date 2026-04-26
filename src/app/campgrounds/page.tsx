import { getAllCampgrounds } from '@/libs/campgrounds';
import CampgroundsClient from '../components/CampgroundsClient';

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

  return <CampgroundsClient campgrounds={campgroundsResponse.data} />;
}
