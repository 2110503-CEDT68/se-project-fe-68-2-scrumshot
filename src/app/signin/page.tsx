'use client'
import { Input, Button, CircularProgress, Backdrop } from "@mui/material"
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@mui/material";
import Link from "next/link";

function SigninForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    if (email.length === 0) {
      setErrorMessage("Email is required");
      setLoading(false);
      return;
    }

    if (password.length === 0) {
      setErrorMessage("Password is required");
      setLoading(false);
      return;
    }

    setErrorMessage(null);
    
    // sign in with next auth
    const signInResponse = await signIn("credentials", {
      email: email,
      password: password,
      redirect: true,
      callbackUrl: callbackUrl
    });
    
    if (signInResponse?.error) {
      setErrorMessage(signInResponse.error);
      setLoading(false);
    }
  };
  
  return (
    <main className="w-full m-8 flex flex-col gap-8 justify-center">
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={loading}
      >
        <CircularProgress color="inherit" size={60} />
        <p className="text-xl font-semibold tracking-wider animate-pulse">
          Signing in
        </p>
      </Backdrop>
      <h1 className='text-3xl font-bold w-full flex justify-center items-center'>Signin</h1>
      <form className='w-full flex flex-col max-w-xl m-auto gap-5' onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Email</p>
          <Input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Password</p>
          <Input type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        
        <div className="flex flex-col gap-2 items-center w-full">
          <Button type="submit" variant="contained" className="w-fit" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </div>
      </form>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full text-center mt-10">Loading...</div>}>
      <SigninForm />
    </Suspense>
  )
}