import { Campground, CampgroundModifiable, REGIONS } from "@/libs/types";
import { Button, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { HTMLInputTypeAttribute, useState } from "react";

function CampgroundInput({ name, type, campground, onChange, errorInputName, errorMessage }: {
  name: keyof CampgroundModifiable;
  type: HTMLInputTypeAttribute;
  campground: CampgroundModifiable;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errorInputName: keyof CampgroundModifiable | null;
  errorMessage: string | null;
}) {
  return (
    <TextField
      name={name}
      type={type}
      value={campground[name]}
      onChange={onChange}
      error={errorInputName === name}
      variant="outlined"
      size="small"
    />
  );
}

export default function CampgroundForm({
  campground,
  setCampground,
  onSubmit,
  errorInputName,
  errorMessage,
}: {
  campground: CampgroundModifiable;
  setCampground: React.Dispatch<React.SetStateAction<CampgroundModifiable>>;
  errorInputName: keyof CampgroundModifiable | null;
  errorMessage: string | null;
  onSubmit: () => void;
}) {
  
  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string> ) => {
    const { name, value } = e.target;
    setCampground((prev) => ({ ...prev, [name]: value }));
  };
  
  const constVals = {
    campground,
    onChange: handleInputChange,
    errorInputName,
    errorMessage,
  }

  return (
    <div className="w-full max-w-3xl flex flex-col gap-5">
      {/* Preview Section */}
      <div className="w-full aspect-video bg-[#e0e0e0] rounded-xl flex items-center justify-center mb-2 overflow-hidden">
        {campground.picture ? (
          <img
            src={campground.picture}
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-gray-400 font-bold tracking-widest">
            PREVIEW IMAGE
          </p>
        )}
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-bold text-lg">Picture Link :</label>
          <CampgroundInput name="picture" type="text" {...constVals} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-lg">Campground Name :</label>
          <CampgroundInput name="name" type="text" {...constVals} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-lg">Description :</label>
          <TextField
            name="description"
            minRows={8}
            value={campground.description}
            onChange={handleInputChange}
            error={errorInputName === "description"}
            multiline
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none"
          />
        </div>

        {/* Address Data Grid */}
        <div className="grid grid-cols-[220px_1fr] items-center gap-y-4">
          <label className="font-bold text-lg">Address :</label>
          <CampgroundInput name="address" type="text" {...constVals} />

          <label className="font-bold text-lg">Province :</label>
          <CampgroundInput name="province" type="text" {...constVals} />
          
          <label className="font-bold text-lg">District :</label>
          <CampgroundInput name="district" type="text" {...constVals} />

          <label className="font-bold text-lg">Region :</label>
          <Select name="region" value={campground.region} onChange={handleInputChange} className="h-10">
            {REGIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>

          <label className="font-bold text-lg">Postal Code :</label>
          <CampgroundInput name="postalcode" type="text" {...constVals} />

          <label className="font-bold text-lg">Telephone Number :</label>
          <CampgroundInput name="tel" type="tel" {...constVals} />

          <label className="font-bold text-lg">Price Per Night (Baht) :</label>
          <CampgroundInput name="pricePerNight" type="number" {...constVals} />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-red-500 font-semibold">{errorMessage}</p>
        <Button onClick={onSubmit} variant="contained" color="success">
          Finished This Campground
        </Button>
      </div>
    </div>
  );
}
