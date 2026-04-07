import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import Image from "next/image";
import Link from "next/link";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const linkClass = "text-yellow-600 font-bold text-xl underline"
  
  return (<nav className="flex justify-between items-center w-full fixed top-0 left-0 p-4 shadow-md z-30 bg-white">
    <div className="flex justify-center items-center gap-8">
      <Link href="/account" className={linkClass}>{session?.user ? session.user.name: "Account"}</Link>
      <Link href="/bookings" className={linkClass}>Bookings</Link>
      <Link href="/campgrounds" className={linkClass}>Campgrounds</Link>
    </div>
    
    <Link href="/">
      <Image src="/img/icon.png" alt="icon" className="size-8" width={20} height={20} />
    </Link>
  </nav>)
  
  
  
}