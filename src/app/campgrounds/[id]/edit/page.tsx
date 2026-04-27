import Link from 'next/link';

export default async function CampgroundEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Campground</h1>
      <p className="text-gray-700 mb-6">This is the edit page for campground <span className="font-semibold">{id}</span>. Add the campground edit form here.</p>
      <Link href={`/campgrounds/${id}`} className="inline-block bg-[#6750A4] hover:bg-[#524082] text-white py-2 px-6 rounded-md transition-colors">
        Back to Campground
      </Link>
    </main>
  );
}
