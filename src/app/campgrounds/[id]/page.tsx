import Image from 'next/image';
import Link from 'next/link';
import { getCampground } from '@/libs/campgrounds';

export default async function CampgroundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 

  const response = await getCampground(id);

  if (!response.success) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Campground Not Found</h1>
        <p>{response.message}</p>
        <Link href="/campgrounds" className="text-indigo-600 hover:underline mt-4 block">
          Return to Campgrounds
        </Link>
      </main>
    );
  }

  const campground = response.data;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">{campground.name}</h1>
      
      <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden shadow-md bg-gray-200">
        <Image 
          src={campground.picture || '/img/banner.jpg'} 
          alt={campground.name || 'Campground Image'} 
          fill 
          className="object-cover"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <ul className="text-sm space-y-2">
            <li><strong>District:</strong> {campground.district}</li>
            <li><strong>Province:</strong> {campground.province}</li>
            <li><strong>Postalcode:</strong> {campground.postalcode}</li>
            <li><strong>Tel:</strong> {campground.tel}</li>
            <li><strong>Region:</strong> {campground.region}</li>
            <li><strong>Price Per Night:</strong> {campground.pricePerNight}</li>
          </ul>
        </div>

        <div className="w-full md:w-2/3 flex flex-col items-center justify-center text-center">
          <p className="text-gray-700 mb-6 px-4">
            {campground.description}
          </p>
          
          <Link href={`/campgrounds/${campground._id}/booking`}>
            <button className="bg-[#6750A4] hover:bg-[#524082] text-white text-sm py-2 px-6 rounded shadow flex items-center transition-colors">
              Book for {campground.pricePerNight} baht / night
              <span className="ml-2">✏️</span>
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}