"use client";
import {
  Input,
  Button,
  CircularProgress,
  Backdrop,
  Select,
  MenuItem,
  FormControl,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCampground, validateCampground } from "@/libs/campgrounds";
import CampgroundForm from "@/app/components/CampgroundForm";
import { CampgroundModifiable } from "@/libs/types";

export default function CreateCampgroundPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [campground, setCampground] = useState<CampgroundModifiable>({
    name: "",
    description: "",
    address: "",
    district: "",
    province: "",
    postalcode: "",
    tel: "",
    region: "Central",
    pricePerNight: 0,
    picture: "",
  });

  const [validationError, setValidationError] = useState<
    [keyof CampgroundModifiable, string] | [null, null]
  >([null, null]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const validationResult = validateCampground(campground);
    setValidationError(validationResult);

    if (validationResult[0] !== null) return;

    const confirmed = window.confirm( "Are you sure you want to publish this campground?" );
    if (!confirmed) return;

    setLoading(true);
    const result = await createCampground(
      campground,
      session?.user?.backendToken ?? "",
    );
    if (!result.success) {
      alert(result.message);
    } else {
      router.push("/campgrounds");
    }
    setLoading(false);
  };

  return (
    <main className="w-full p-10 flex flex-col items-center">
      <Backdrop
        sx={{ color: "#fff", zIndex: 1000, flexDirection: "column", gap: 2 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <p>Creating campground...</p>
      </Backdrop>

      <h1 className="text-4xl font-bold mb-8">Create Campground</h1>

      <CampgroundForm
        campground={campground}
        setCampground={setCampground}
        errorInputName={validationError[0]}
        errorMessage={validationError[1]}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
