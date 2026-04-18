'use client'
import { register } from "@/libs/auth";
import { Input, Button, CircularProgress, Backdrop, Checkbox } from "@mui/material"
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const validate = (): [boolean, string | null] => {
    
    if (name.length === 0) return [false, "Name is required"];
    if (email.length === 0) return [false, "Email is required"];
    if (phone.length === 0) return [false, "Phone is required"];
    if (password.length === 0) return [false, "Password is required"];
    if (password !== confirm) return [false, "Passwords do not match"];
    if (!agreeToTerms) return [false, "You must agree to the terms and conditions"];
    
    return [true, null];
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const [valid, errorMsg] = validate();
      if (!valid) {
        setErrorMessage(errorMsg); // validation errors
        return;
      }
      
      setErrorMessage(null);
      
      // Submit
      const result = await register(name, email, password, phone, "user");
      if (!result.success) {
        setErrorMessage(result.message); // registration errors
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
        setErrorMessage(signInResponse.error); // signin errors
      }
    } finally {
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
        <label htmlFor="agreeToTerms" className="flex justify-center items-center">
          <p className="font-light text-gray-500 text-sm">By checking this box you agree to the <Link href="/privacy" className="underline">Privacy Policy</Link></p>
          <Checkbox checked={agreeToTerms} name="agreeToTerms" onChange={(e) => setAgreeToTerms(e.target.checked)} />
        </label>
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