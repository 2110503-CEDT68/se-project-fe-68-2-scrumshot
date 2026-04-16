import Image from 'next/image';
import Link from 'next/link';
import { Campground } from '@/libs/types';

type CampgroundProps = Pick<Campground, '_id' | 'name' | 'address' | 'description' | 'pricePerNight' | 'picture' | 'avgRating' | 'totalReviews'>;

export default function CampgroundCard({ _id, name, address, description, pricePerNight, picture, avgRating, totalReviews }: CampgroundProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.round(rating)) {
        stars.push(<span key={i} className="text-yellow-400 text-2xl">★</span>);
      } else {
        stars.push(<span key={i} className="text-yellow-300 text-2xl">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-[20px] shadow-lg border border-blue-200 overflow-hidden mb-6 p-6 gap-6">
      <div className="relative w-full md:w-1/2 h-64 flex-shrink-0">
        <Image
          src={picture || '/img/banner.jpg'} 
          alt={name || 'Campground Image'} 
          fill 
          className="object-cover rounded-[15px]"
          unoptimized
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-center mb-2">{name}</h2>
          <p className="text-xs text-gray-500 text-center mb-4">{address}</p>
          <p className="text-sm text-gray-700 text-left leading-relaxed mb-4">{description}</p>
          
          <div className="flex justify-start gap-1 mb-4">
            {renderStars(avgRating || 0)}
          </div>
        </div>
        
        <div className="flex justify-endente">
          <Link href={`/campgrounds/${_id}`} className="w-full">
            <button className="w-full bg-[#6750A4] hover:bg-[#524082] text-white text-sm py-2 px-8 rounded-lg flex items-center justify-center shadow-md transition-colors">
              Book for {pricePerNight} Baht / Night
              <span className="ml-2">✏️</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}