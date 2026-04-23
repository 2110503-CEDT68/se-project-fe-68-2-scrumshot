'use client';
import { Input, Button, CircularProgress, Backdrop, Select, MenuItem, FormControl, InputLabel, TextareaAutosize } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const regions = ['Central', 'North', 'Northeast', 'Eastern', 'Western', 'Southern'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update image preview when picture URL changes
    if (name === 'picture' && value) {
      setImagePreview(value);
    }
  };

  const handleRegionChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      region: e.target.value
    }));
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
    if (!formData.pricePerNight) return [false, 'Price Per Night is required'];
    if (Number(formData.pricePerNight) <= 0) return [false, 'Price must be greater than 0'];

    return [true, null];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const [valid, errorMsg] = validate();
      if (!valid) {
        setErrorMessage(errorMsg);
        return;
      }

      const token = session?.user?.token || (session as any)?.accessToken;
      if (!token) {
        setErrorMessage('Authentication required');
        return;
      }

      const submitData = {
        picture: formData.picture,
        name: formData.name,
        description: formData.description,
        province: formData.province,
        district: formData.district,
        region: formData.region,
        postalcode: formData.postalcode,
        tel: formData.tel,
        pricePerNight: Number(formData.pricePerNight),
        address: formData.address,
      };

      {/* Please Speed I need this */}
      const result = await createCampground(submitData, token);

      if (!result.success) {
        setErrorMessage(result.message || 'Failed to create campground');
        return;
      }

      router.push('/campgrounds');
    } catch (error) {
      setErrorMessage('An error occurred while creating the campground');
      console.error(error);
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
          Creating campground...
        </p>
      </Backdrop>

      <h1 className="text-4xl font-bold text-center">Create Campground</h1>

      <form className="w-full flex flex-col max-w-2xl m-auto gap-4" onSubmit={handleSubmit}>

        <div className="w-full">
          <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => {
                  setImagePreview('');
                }}
              />
            ) : (
              <p className="text-gray-400 text-lg">PREVIEW IMAGE</p>
            )}
          </div>
        </div>

        {/* Fields Grid */}
        <div className="flex flex-col gap-4">
          {/* Campground Picture Link */}
          <div className="flex items-center gap-4">
            <label className="w-96 text-lg font-semibold">Campground Picture Link :</label>
            <Input
              type="url"
              name="picture"
              placeholder="https://example.com/image.jpg"
              value={formData.picture}
              onChange={handleInputChange}
              fullWidth
              disableUnderline
              sx={{
                border: '1px solid #999',
                borderRadius: '8px',
                paddingLeft: '8px',
                paddingRight: '8px',
                '& input': {
                  padding: '10px',
                  fontSize: '14px'
                }
              }}
            />
          </div>

          {/* Campground Name */}
          <div className="flex items-center gap-4">
            <label className="w-96 text-lg font-semibold">Campground Name :</label>
            <Input
              type="text"
              name="name"
              placeholder="Enter campground name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              disableUnderline
              sx={{
                border: '1px solid #999',
                borderRadius: '8px',
                paddingLeft: '8px',
                paddingRight: '8px',
                '& input': {
                  padding: '10px',
                  fontSize: '14px'
                }
              }}
            />
          </div>

          {/* Description */}
          <div className="flex gap-4">
            <label className="w-59 text-lg font-semibold pt-3">Description :</label>
            <TextareaAutosize
              name="description"
              placeholder="Enter campground description"
              value={formData.description}
              onChange={handleInputChange}
              minRows={5}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                fontFamily: 'Roboto, sans-serif',
                border: '1px solid #999',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Address */}
          <div className="flex items-center gap-4">
            <label className="w-96 text-lg font-semibold">Address :</label>
            <Input
              type="text"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              disableUnderline
              sx={{
                border: '1px solid #999',
                borderRadius: '8px',
                paddingLeft: '8px',
                paddingRight: '8px',
                '& input': {
                  padding: '10px',
                  fontSize: '14px'
                }
              }}
            />
          </div>

          {/* Province */}
          <div className="flex items-center gap-4">
            <label className="w-96 text-lg font-semibold">Province :</label>
            <Input
              type="text"
              name="province"
              placeholder="Enter province"
              value={formData.province}
              onChange={handleInputChange}
              fullWidth
              disableUnderline
              sx={{
                border: '1px solid #999',
                borderRadius: '8px',
                paddingLeft: '8px',
                paddingRight: '8px',
                '& input': {
                  padding: '10px',
                  fontSize: '14px'
                }
              }}
            />
          </div>

          {/* District */}
          <div className="flex items-center gap-4">
            <label className="w-96 text-lg font-semibold">District :</label>
            <Input
              type="text"
              name="district"
              placeholder="Enter district"
              value={formData.district}
              onChange={handleInputChange}
              fullWidth
              disableUnderline
              sx={{
                border: '1px solid #999',
                borderRadius: '8px',
                paddingLeft: '8px',
                paddingRight: '8px',
                '& input': {
                  padding: '10px',
                  fontSize: '14px'
                }
              }}
            />
          </div>

          {/* Region */}
          <div className="flex items-center gap-4">
            <label className="w-96 text-lg font-semibold">Region :</label>
            <FormControl fullWidth>
              <Select
                name="region"
                value={formData.region}
                onChange={handleRegionChange}
              >
                <MenuItem value="">
                  <em>Select a region</em>
                </MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Postal Code */}
          <div className="flex items-center gap-4">
            <label className="w-96 text-lg font-semibold">Postal Code :</label>
            <Input
              type="text"
              name="postalcode"
              placeholder="Enter postal code"
              value={formData.postalcode}
              onChange={handleInputChange}
              fullWidth
              disableUnderline
              sx={{
                border: '1px solid #999',
                borderRadius: '8px',
                paddingLeft: '8px',
                paddingRight: '8px',
                '& input': {
                  padding: '10px',
                  fontSize: '14px'
                }
              }}
            />
          </div>

          {/* Telephone Number */}
          <div className="flex items-center gap-4">
            <label className="w-96 text-lg font-semibold">Telephone Number :</label>
            <Input
              type="text"
              name="tel"
              placeholder="Enter telephone number"
              value={formData.tel}
              onChange={handleInputChange}
              fullWidth
              disableUnderline
              sx={{
                border: '1px solid #999',
                borderRadius: '8px',
                paddingLeft: '8px',
                paddingRight: '8px',
                '& input': {
                  padding: '10px',
                  fontSize: '14px'
                }
              }}
            />
          </div>

          {/* Price Per Night */}
          <div className="flex items-center gap-4">
            <label className="w-96 text-lg font-semibold">Price Per Night (Baht) :</label>
            <Input
              type="text"
              name="pricePerNight"
              placeholder="Enter price"
              value={formData.pricePerNight}
              onChange={handleInputChange}
              fullWidth
              disableUnderline
              sx={{
                border: '1px solid #999',
                borderRadius: '8px',
                paddingLeft: '8px',
                paddingRight: '8px',
                '& input': {
                  padding: '10px',
                  fontSize: '14px',
                  backgroundColor: '#fce4ec'
                }
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#22c55e',
            color: 'white',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: '#16a34a'
            }
          }}
        >
          Finished This Campground
        </Button>
      </form>
    </main>
  );
}
