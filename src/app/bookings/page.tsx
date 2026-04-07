import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"; 
import { redirect } from "next/navigation";
import BookingList from "@/app/components/BookingList";

export default async function MyBookingsPage() {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        redirect('/account?callbackUrl=/bookings');
    }

    return (
        <main className="w-full pt-2 font-sans min-h-screen bg-gray-50">
            <div className="w-full px-4">
                <BookingList />
            </div>
        </main>
    );
}