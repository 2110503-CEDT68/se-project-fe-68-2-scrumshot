import Image from 'next/image';
import Link from 'next/link';
import { getCampground } from '@/libs/campgrounds';
import { getCampgroundReviews } from '@/libs/reviews';
import { Rating } from '@mui/material';
import ReviewCard from '@/app/components/ReviewCard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import ReviewList from '@/app/components/ReviewList';
import { getAllBookings } from '@/libs/bookings';

export default async function CampgroundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?._id;

  const response = await getCampground(id);
  const reviewResponse = await getCampgroundReviews(id);
  const reviews = reviewResponse.success ? reviewResponse.data : [];
  const reviewCount = reviews.length;
  
  const booking = await getAllBookings(session?.user.backendToken || '');
  console.log('Bookings data:', booking, session?.user.backendToken );
  const sameCampgroundBooking = booking.success ? booking.data.find((b) => b.campground._id === id) : null;
  const hasBooked = !!sameCampgroundBooking;

  const canCreateReview = currentUserId && !reviews.some((review) => review.user._id === currentUserId);

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

      <div className="relative w-full h-[300px] mb-8 rounded-3xl overflow-hidden shadow-lg bg-gray-200">
        <Image
          src={campground.picture || '/img/banner.jpg'}
          alt={campground.name || 'Campground Image'}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-black">
          Rating :
        </span>
        <Rating
          defaultValue={campground.avgRating || 0} precision={0.5} readOnly
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/3 py-6">
          <ul className="space-y-3 text-m text-gray-700">
            <li><span className="font-semibold">District:</span> {campground.district}</li>
            <li><span className="font-semibold">Province:</span> {campground.province}</li>
            <li><span className="font-semibold">Postal Code:</span> {campground.postalcode}</li>
            <li><span className="font-semibold">Tel:</span> {campground.tel}</li>
            <li><span className="font-semibold">Region:</span> {campground.region}</li>
            <li><span className="font-semibold">Price Per Night:</span> {campground.pricePerNight} baht</li>
          </ul>
        </div>

        <div className="w-full md:w-2/3 py-6">
          <p className="text-lg leading-7 text-black-700">{campground.description}</p>
        </div>
      </div>

      <div className="flex justify-start mb-10">
        <Link href={`/campgrounds/${campground._id}/booking`}>
          <button className="bg-[#6750A4] hover:bg-[#524082] text-white text-sm py-3 px-8 rounded-md shadow-lg transition-colors flex items-center gap-2">
            Book for {campground.pricePerNight} Baht / Night
            <span>✏️</span>
          </button>
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-black">
              Review :
            </h2>

            <div className="bg-[#a865a8] text-white text-l rounded-full flex items-center justify-center min-w-[35px]">
              {reviewCount}
            </div>
          </div>
        </div>

        <ReviewList reviews={reviews} currentUserId={currentUserId} canCreateReview={hasBooked} />
      </div>
    </main>
  );
}