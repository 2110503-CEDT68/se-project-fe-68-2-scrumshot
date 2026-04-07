'use client'
import Image from "next/image"
import { Button } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Banner() {
  const router = useRouter();
  return (<div>
    <div className="relative w-full flex justify-center items-center gap-8 h-128 flex-col overflow-y-visible">
      <Image src="/img/banner.jpg" alt="banner" width="1920" height="1080" className="absolute bottom-0 left-0 -z-1 w-full" />
      <div className="text-5xl font-black text-amber-200 text-stroke"> Campground Booking App </div>
      <div className="text-xl text-white font-semibold">Connecting you to the perfect campground</div>
      <div className="flex justify-center items-center gap-4">
        <Button variant="contained" color="warning" onClick={() => router.push('/campgrounds')}>
          Find Your Next Campground
        </Button>
      </div>
    </div>
  </div>)
}