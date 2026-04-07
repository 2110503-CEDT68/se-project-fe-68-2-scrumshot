"use client"

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getAllBookings, deleteBooking } from "@/libs/bookings";
import { getAllCampgrounds } from "@/libs/campgrounds";
import { Booking, Campground } from "@/libs/types";
import Link from "next/link";
import dayjs from "dayjs";

export default function BookingList() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!session?.user?.backendToken) return;
        setLoading(true);
        try {
            const [bookingsRes, campgroundsRes] = await Promise.all([
                getAllBookings(session.user.backendToken),
                getAllCampgrounds()
            ]);

            if (bookingsRes.success) setBookings(bookingsRes.data);
            if (campgroundsRes.success) setCampgrounds(campgroundsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [session]);

    const handleDelete = async (bookingId: string) => {
        if (!session?.user?.backendToken) return;
        
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                const res = await deleteBooking(bookingId, session.user.backendToken);
                if (res.success) {
                    setBookings(bookings.filter(b => b._id !== bookingId));
                } else {
                    alert("Failed to delete: " + res.message);
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    const campgroundMap = campgrounds.reduce((map, c) => {
        map[c._id] = c.name;
        return map;
    }, {} as Record<string, string>);

    const getCampgroundName = (item: Booking) => {
        if (typeof item.campground === 'object' && item.campground !== null) {
            return (item.campground as any).name || "Unknown Venue";
        }
        return campgroundMap[item.campground] || "Unknown Venue (" + item.campground.slice(-4) + ")";
    };

    if (loading) return <div className="text-center p-10 text-black">Loading bookings...</div>;

    if (bookings.length === 0) {
        return (
            <div className="text-center text-xl text-gray-500 mt-10 italic">
                No Venue Booking Found
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl space-y-6 mx-auto pb-10">
            
            <h1 className="text-4xl font-bold text-center mt-10 mb-10 text-black">
                {session?.user?.role === 'admin' ? 'User Bookings' : 'My Bookings'}
            </h1>

            {bookings.map((bookingItem) => (
                <div 
                    key={bookingItem._id}
                    className="relative bg-white rounded-2xl p-6 shadow-md border border-dotted border-blue-400"
                >
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Link href={`/bookings/${bookingItem._id}`}>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-300 size-10">
                                ✏️
                            </button>
                        </Link>
                        <button 
                            onClick={() => handleDelete(bookingItem._id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors border border-red-200 size-10"
                        >
                            🗑️
                        </button>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-black">
                            Booking For: <span className="font-semibold text-gray-700">
                                {getCampgroundName(bookingItem)}
                            </span>
                        </h2>
                        <p className="text-sm text-gray-400 italic">
                            User ID: {bookingItem.user}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4 ">
                        <div className="bg-[#FEF3C7] text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-orange-200 shadow-sm">
                            Start date: {dayjs(bookingItem.bookDate).format("DD-MM-YYYY")}
                        </div>

                        <div className="bg-[#CFFAFE] text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-cyan-200 shadow-sm">
                            End Date: {dayjs(bookingItem.bookEndDate).format("DD-MM-YYYY")}
                        </div>

                        <div className="bg-[#DCFCE7] text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200 shadow-sm">
                            Total Price: {bookingItem.totalPrice || 5000} 
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}