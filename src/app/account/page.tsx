'use client'
import { useSession, signOut } from "next-auth/react";
import { Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AccountContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const signInUrl = callbackUrl ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/signin';
  const registerUrl = callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/register';

  return (
    <main className="w-full m-2 flex justify-center">
      <div className="bg-neutral-50 w-full flex flex-col gap-8 max-w-3xl mt-5 p-5 rounded-md shadow-md">
        <div className="flex flex-col">
          {session?.user?.role === "admin" ? (
            <h3 className="text-xl font-semibold text-red-900">
              {session?.user?.name} [Administrator]
            </h3>
          ) : (
            <h3 className="text-xl font-semibold">
              {session?.user?.name || 'Guest'}
            </h3>
          )}

          <p className="text-xs text-gray-400">{session?.user?.email || 'Please login to use the website'}</p>
        </div>
        <div className="flex flex-col gap-2 text-gray-600">
          <div className="flex justify-between items-center">
            <p>Name</p>
            <p>{session?.user?.name || '-'}</p>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center">
            <p>Email</p>
            <p>{session?.user?.email || '-'}</p>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center">
            <p>Phone Number</p>
            <p>{session?.user?.tel || '-'}</p>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center">
            <p>Id</p>
            <p>{session?.user?._id || '-'}</p>
          </div>
        </div>
        
        <div>
          {
            session?.user ? 
              <Button variant="contained" color="error" size="small" onClick={() => signOut({ callbackUrl: '/' })} sx={{ borderRadius: '24px' }}>
                <p className="font-bold mt-1">
                  Sign out
                </p>
              </Button>
            :  
            <div className="flex gap-5 items-center">
              <Button variant="contained" color="success" size="small" onClick={() => router.push(signInUrl)} sx={{ borderRadius: '24px' }}>
                <p className="font-bold mt-1">
                  Sign in 
                </p>
              </Button>
              <Button variant="contained" color="primary" size="small" onClick={() => router.push(registerUrl)} sx={{ borderRadius: '24px' }}>
                <p className="font-bold mt-1">
                  Register 
                </p>
              </Button>
            </div>
          }
        </div>
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="w-full text-center mt-10">Loading account...</div>}>
      <AccountContent />
    </Suspense>
  );
}