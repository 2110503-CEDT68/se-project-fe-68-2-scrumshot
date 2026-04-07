'use client'
import { register } from "@/libs/auth";
import { Input, Button, CircularProgress, Backdrop } from "@mui/material"
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation";

function RegisterForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // validate form data
    if (password !== confirm) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }
    
    if (name.length === 0) {
      setErrorMessage("Name is required");
      setLoading(false);
      return;
    }
    
    if (email.length === 0) {
      setErrorMessage("Email is required");
      setLoading(false);
      return;
    }
    
    if (phone.length === 0) {
      setErrorMessage("Phone is required");
      setLoading(false);
      return;
    }
    
    setErrorMessage(null);
    
    // Submit
    const result = await register(name, email, password, phone, "user");
    if (!result.success) {
      setErrorMessage(result.message);
      setLoading(false);
      return;
    }

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
          Creating your account...
        </p>
      </Backdrop>
      <h1 className='text-3xl font-bold w-full flex justify-center items-center'>Register</h1>
      <form className='w-full flex flex-col max-w-xl m-auto gap-5' onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Name</p>
          <Input type="text" placeholder="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Email</p>
          <Input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Phone Number</p>
          <Input type="tel" placeholder="Phone Number" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Password</p>
          <Input type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex justify-between items-center">
          <p className="font-medium text-xl">Confirm Password</p>
          <Input type="password" placeholder="Confirm Password" name="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2 items-center w-full">
          <Button type="submit" variant="contained" className="w-fit" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Signing Up..." : "Sign Up"}
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
      <RegisterForm />
    </Suspense>
  )
}