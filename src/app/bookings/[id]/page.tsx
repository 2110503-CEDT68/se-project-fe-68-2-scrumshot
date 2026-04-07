"use client"

import { useState, useEffect, use, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Link from "next/link";
import { TextField, Button, MenuItem, Select, FormControl, CircularProgress, Switch, FormControlLabel } from "@mui/material";
import DateReserve from "@/app/components/DateReserve"; 
import { getBooking, updateBooking } from "@/libs/bookings";
import { getAllCampgrounds } from "@/libs/campgrounds";
import { Booking, Campground } from "@/libs/types";

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: bookingId } = use(params);
    const { data: session } = useSession();
    const router = useRouter();
    const isAdmin = session?.user?.role === 'admin';

    const [originalBooking, setOriginalBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false); 
    const [isManualPrice, setIsManualPrice] = useState(false);

    const [selectedCampgroundId, setSelectedCampgroundId] = useState("");
    const [userId, setUserId] = useState(""); 
    const [bookDate, setBookDate] = useState<Dayjs | null>(null);
    const [bookEndDate, setBookEndDate] = useState<Dayjs | null>(null);
    const [manualTotalCost, setManualTotalCost] = useState(""); 
    const [campgrounds, setCampgrounds] = useState<Campground[]>([]);

    const fetchData = useCallback(async () => {
        if (!session?.user?.backendToken) return;
        try {
            const [bookingRes, campgroundsRes] = await Promise.all([
                getBooking(bookingId, session.user.backendToken),
                getAllCampgrounds()
            ]);
            if (bookingRes.success) {
                const data = bookingRes.data;
                setOriginalBooking(data);
                if (!isEditMode) {
                    setSelectedCampgroundId(typeof data.campground === 'object' ? (data.campground as any)._id : data.campground);
                    setUserId(data.user);
                    setBookDate(dayjs(data.bookDate));
                    setBookEndDate(dayjs(data.bookEndDate));
                    setManualTotalCost(data.totalPrice?.toString() || "0");
                }
            }
            if (campgroundsRes.success) setCampgrounds(campgroundsRes.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }, [bookingId, session?.user?.backendToken, isEditMode]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const campgroundPricePerNight = campgrounds.find((c: Campground) => c._id === selectedCampgroundId)?.pricePerNight || 0;

    useEffect(() => {
        if (isAdmin && isManualPrice) return;
        if (isEditMode && bookDate && bookEndDate && campgroundPricePerNight) {
            const nights = bookEndDate.diff(bookDate, 'day');
            const calculated = nights > 0 ? (nights * campgroundPricePerNight).toString() : "0";
            if (manualTotalCost !== calculated) setManualTotalCost(calculated);
        }
    }, [isEditMode, isAdmin, isManualPrice, bookDate, bookEndDate, campgroundPricePerNight, manualTotalCost]);

    const toggleEditMode = () => {
        if (isEditMode && originalBooking) {
            setSelectedCampgroundId(typeof originalBooking.campground === 'object' ? (originalBooking.campground as any)._id : originalBooking.campground);
            setUserId(originalBooking.user);
            setBookDate(dayjs(originalBooking.bookDate));
            setBookEndDate(dayjs(originalBooking.bookEndDate));
            setManualTotalCost(originalBooking.totalPrice?.toString() || "0");
            setIsManualPrice(false);
        }
        setIsEditMode(!isEditMode);
    };

    const handleSubmit = async () => {
        if (!session?.user?.backendToken || !bookDate || !bookEndDate) return;
        setIsUpdating(true);

        try {
            if (isAdmin && isManualPrice) {
                const resDate = await updateBooking(bookingId, session.user.backendToken, {
                    bookDate: bookDate.format("YYYY-MM-DD"),
                    bookEndDate: bookEndDate.format("YYYY-MM-DD"),
                    campground: selectedCampgroundId,
                    user: userId
                });
                if (!resDate.success) throw new Error(resDate.message);

                const resPrice = await updateBooking(bookingId, session.user.backendToken, {
                    totalPrice: Number(manualTotalCost),
                    user: userId
                });
                if (!resPrice.success) throw new Error(resPrice.message);

            } else {
                const res = await updateBooking(bookingId, session.user.backendToken, {
                    bookDate: bookDate.format("YYYY-MM-DD"),
                    bookEndDate: bookEndDate.format("YYYY-MM-DD"),
                    campground: selectedCampgroundId,
                    user: isAdmin ? userId : undefined
                });
                if (!res.success) throw new Error(res.message);
            }

            alert("Booking Updated Successfully!");
            setIsEditMode(false);
            await fetchData();
            router.refresh();
        } catch (error: any) {
            alert("Update Failed: " + error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="text-center pt-20"><CircularProgress /></div>;

    return (
        <main className="w-full flex justify-center pt-10 font-sans text-black min-h-screen bg-gray-50 pb-20">
            <div className={`w-[850px] bg-white p-10 rounded-2xl shadow-xl border ${isEditMode ? 'border-blue-400' : 'border-gray-100'} relative`}>
                
                {isUpdating && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-2xl">
                        <CircularProgress color="secondary" />
                    </div>
                )}

                <h1 className="text-4xl font-bold text-center mb-1 text-black">Booking Details</h1>
                
                {!isEditMode && isAdmin && (
                    <p className="text-sm text-gray-500 text-center mb-6 italic">user: {userId}</p>
                )}
                
                {isAdmin && isEditMode && (
                    <div className="flex flex-col items-center mb-10 gap-2">
                        <FormControlLabel
                            control={<Switch checked={isManualPrice} onChange={(e) => setIsManualPrice(e.target.checked)} color="secondary" />}
                            label={<span className="font-bold text-purple-700">Manual Price Edit Mode</span>}
                        />
                    </div>
                )}

                <div className="space-y-6 max-w-2xl mx-auto">
                    {isAdmin && isEditMode && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="font-semibold text-lg text-red-600">Owner User ID:</label>
                            <div className="col-span-3">
                                <TextField 
                                    fullWidth size="small" value={userId} 
                                    onChange={(e) => setUserId(e.target.value)} 
                                    className="bg-white" variant="outlined"
                                    helperText="Enter target User ID to transfer this booking"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="font-semibold text-lg">Selected Campground:</label>
                        <div className="col-span-3">
                            {isEditMode ? (
                                <FormControl fullWidth size="small">
                                    <Select value={selectedCampgroundId} onChange={(e) => setSelectedCampgroundId(e.target.value)} className="bg-white">
                                        {campgrounds.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            ) : (campgrounds.find(c => c._id === selectedCampgroundId)?.name || "Loading...")}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="font-semibold text-lg">Start Date:</label>
                        <div className="col-span-3">
                            {isEditMode ? <DateReserve value={bookDate} onDateChange={(val) => setBookDate(val)} /> : bookDate?.format("DD-MM-YYYY")}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="font-semibold text-lg">End Date:</label>
                        <div className="col-span-3">
                            {isEditMode ? <DateReserve value={bookEndDate} onDateChange={(val) => setBookEndDate(val)} /> : bookEndDate?.format("DD-MM-YYYY")}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label className="font-semibold text-lg">Total Cost:</label>
                        <div className="col-span-3">
                            {isAdmin && isEditMode && isManualPrice ? (
                                <TextField 
                                    type="number" value={manualTotalCost} onChange={(e) => setManualTotalCost(e.target.value)}
                                    size="small" variant="outlined" className="bg-white w-40"
                                />
                            ) : (
                                <span className={`text-xl font-bold ${isManualPrice ? 'text-purple-600' : 'text-black'}`}>
                                    {Number(manualTotalCost).toLocaleString()} THB 
                                    {isEditMode && !isManualPrice && <span className="text-sm font-normal text-gray-400 ml-2">(Auto)</span>}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-16 max-w-2xl mx-auto">
                    {!isEditMode ? (
                        <>
                            <Link href={`/bookings`}><Button variant="text" className="text-purple-600 font-semibold text-lg">Back</Button></Link>
                            <Button onClick={toggleEditMode} variant="contained" className="bg-[#6750A4] text-white px-6 py-2 rounded-md font-semibold text-lg">EDIT</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={toggleEditMode} variant="contained" color="warning" className="px-6 py-2 rounded-md font-semibold text-lg">CANCEL</Button>
                            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={Number(manualTotalCost) < 0 || isUpdating} className="px-6 py-2 rounded-md font-semibold text-lg">
                                {isUpdating ? "SAVING..." : "SUBMIT"}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}