import Image from 'next/image';
import Link from 'next/link';
import { Campground } from '@/libs/types';

type CampgroundProps = Pick<Campground, '_id' | 'name' | 'address' | 'description' | 'pricePerNight' | 'picture'>;

export default function CampgroundCard({ _id, name, address, description, pricePerNight, picture }: CampgroundProps) {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-[20px] shadow-lg border border-gray-100 overflow-hidden mb-6 p-5 gap-6">
      <div className="relative w-full md:w-[50%] h-56 md:h-64 flex-shrink-0">
        <Image
          src={picture || '/img/banner.jpg'} 
          alt={name || 'Campground Image'} 
          fill 
          className="object-cover rounded-[15px]"
          unoptimized
        />
      </div>

      <div className="w-full md:w-[50%] flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-right mb-2">{name}</h2>
          <p className="text-xs text-gray-500 text-right mb-4">{address}</p>
          <p className="text-sm text-gray-700 text-right leading-relaxed">{description}</p>
        </div>
        
        <div className="flex justify-end mt-6">
          <Link href={`/campgrounds/${_id}`}>
            <button className="bg-[#6750A4] hover:bg-[#524082] text-white text-sm py-2 px-5 rounded-lg flex items-center shadow-md transition-colors">
              Book for {pricePerNight} baht / night
              <span className="ml-2">✏️</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}