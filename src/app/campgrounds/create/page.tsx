'use client';
import { Input, Button, CircularProgress, Backdrop, Select, MenuItem, FormControl, TextareaAutosize } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
{/*import { createCampground } from '@/libs/campgrounds';*/}

export default function CreateCampgroundPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    picture: '',
    name: '',
    description: '',
    province: '',
    district: '',
    region: '',
    postalcode: '',
    tel: '',
    pricePerNight: '',
    address: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const regions = ['Central', 'North', 'Northeast', 'Eastern', 'Western', 'South'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'picture' && value) setImagePreview(value);
  };

  const handleRegionChange = (e: any) => {
    setFormData(prev => ({ ...prev, region: e.target.value }));
  };

  const validate = (): [boolean, string | null] => {
    if (!formData.picture.trim()) return [false, 'Campground Picture Link is required'];
    if (!formData.name.trim()) return [false, 'Campground Name is required'];
    if (!formData.description.trim()) return [false, 'Description is required'];
    if (!formData.address.trim()) return [false, 'Address is required'];
    if (!formData.province.trim()) return [false, 'Province is required'];
    if (!formData.district.trim()) return [false, 'District is required'];
    if (!formData.region) return [false, 'Region is required'];
    if (!formData.postalcode.trim()) return [false, 'Postal Code is required'];
    if (formData.postalcode.length > 5) return [false, 'Postal Code cannot exceed 5 digits'];
    if (!formData.tel.trim()) return [false, 'Telephone Number is required'];
    if (isNaN(Number(formData.tel)) || formData.tel.length > 15) return [false, 'Telephone Number must be valid'];
    if (!formData.pricePerNight) return [false, 'Price Per Night is required'];
    if (isNaN(Number(formData.pricePerNight)) || Number(formData.pricePerNight) <= 0) {
      return [false, 'Price Per Night must be valid'];
    }
    return [true, null];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [valid, errorMsg] = validate();
    if (!valid) {
      setErrorMessage(errorMsg);
      return;
    }

    const confirmed = window.confirm('Are you sure you want to publish this campground?');
    if (!confirmed) {
      return;
    }

    setLoading(true);
    try {
      const submitData = { ...formData, pricePerNight: Number(formData.pricePerNight) };
      {/*createCampground is here*/}
      const result = await createCampground(submitData);
      if (!result.success) {
        setErrorMessage(result.message);
      } else {
        router.push('/campgrounds');
      }
    } catch (error) {
      setErrorMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '4px 12px',
    '& input': { padding: '8px 0', fontSize: '14px' }
  };

  return (
    <main className="w-full p-10 flex flex-col items-center">
      <Backdrop sx={{ color: '#fff', zIndex: 1000, flexDirection: 'column', gap: 2 }} open={loading}>
        <CircularProgress color="inherit" />
        <p>Creating campground...</p>
      </Backdrop>

      <h1 className="text-4xl font-bold mb-8">Create Campground</h1>

      <form className="w-full max-w-3xl flex flex-col gap-5" onSubmit={handleSubmit}>
        
        {/* Preview Section */}
        <div className="w-full aspect-[16/9] bg-[#e0e0e0] rounded-xl flex items-center justify-center mb-2 overflow-hidden">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreview('')} />
          ) : (
            <p className="text-gray-400 font-bold tracking-widest">PREVIEW IMAGE</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-lg">Campground Picture Link :</label>
            <Input name="picture" value={formData.picture} onChange={handleInputChange} fullWidth disableUnderline sx={inputStyle} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-lg">Campground Name :</label>
            <Input name="name" value={formData.name} onChange={handleInputChange} fullWidth disableUnderline sx={inputStyle} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-lg">Description :</label>
            <TextareaAutosize
              name="description"
              minRows={8}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none"
            />
          </div>

          {/* Address Data Grid */}
          <div className="grid grid-cols-[180px_1fr] items-center gap-y-4">
            <label className="font-bold text-lg">Address :</label>
            <Input name="address" value={formData.address} onChange={handleInputChange} disableUnderline sx={inputStyle} />

            <label className="font-bold text-lg">Province :</label>
            <Input name="province" value={formData.province} onChange={handleInputChange} disableUnderline sx={inputStyle} />

            <label className="font-bold text-lg">District :</label>
            <Input name="district" value={formData.district} onChange={handleInputChange} disableUnderline sx={inputStyle} />

            <label className="font-bold text-lg">Region :</label>
            <FormControl fullWidth size="small">
              <Select name="region" value={formData.region} onChange={handleRegionChange} sx={{ borderRadius: '6px' }}>
                {regions.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>

            <label className="font-bold text-lg">Postal Code :</label>
            <Input name="postalcode" value={formData.postalcode} onChange={handleInputChange} disableUnderline sx={inputStyle} />

            <label className="font-bold text-lg">Telephone Number :</label>
            <Input name="tel" value={formData.tel} onChange={handleInputChange} disableUnderline sx={inputStyle} />

            <label className="font-bold text-lg">Price Per Night (Baht) :</label>
            <Input name="pricePerNight" value={formData.pricePerNight} onChange={handleInputChange} disableUnderline sx={{ ...inputStyle, backgroundColor: '#fdecec' }} />
          </div>
        </div>

        {errorMessage && <p className="text-red-500 font-semibold">{errorMessage}</p>}

        <div className="flex justify-end mt-4">
            <Button
            type="submit"
            variant="contained"
            sx={{
                backgroundColor: '#44c754',
                padding: '10px 30px',
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#38a646' }
            }}
            >
            Finished This Campground
            </Button>
        </div>
      </form>
    </main>
  );
}