import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import UserDetailsContext from '@/hooks/UserDetailsContext';
import { ChevronLeft } from "lucide-react";
import Select from 'react-select';

interface VendorCategory {
  CategoryID: number;
  CategoryName: string;
  Description: string;
  IsActive: boolean;
}

const AddVendorPage = () => {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserDetailsContext);

  const [step, setStep] = useState(1);
  const [vendor, setVendor] = useState({
    name: '',
    categoryID: '',
    contactNumber: '',
    email: '',
    contactPerson: '',
    address: '',
    notes: '',
    status: 'Active',
  });
  const [inputValue, setInputValue] = useState('');
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const getVendorCategoriesURL = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_PORTNO}/purchases/GetVendorCategories`;
        const res = await axios.post<VendorCategory[]>(
          getVendorCategoriesURL,
          { BusinessID: userDetails?.BusinessID?.toString() },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const activeCategories = res.data.filter(cat => cat.IsActive);
        setCategories(activeCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
    setMissingFields((prev) => prev.filter((f) => f !== name));
  };
  const categoryOptions = categories?.map(cat => ({
    value: cat.CategoryID,
    label: cat.CategoryName,
  })) || [];

  // Step 1 validation
  const validateStep1 = () => {
    const missing: string[] = [];
    if (!vendor.name) missing.push('name');
    if (!vendor.contactNumber) missing.push('contactNumber');
    if (!vendor.email) missing.push('email');
    if (!vendor.contactPerson) missing.push('contactPerson');
    if (!vendor.address) missing.push('address');
    setMissingFields(missing);
    return missing.length === 0;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const missing: string[] = [];
    if (!vendor.categoryID) missing.push('categoryID');
    setMissingFields(missing);
    return missing.length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleBack = () => {
    setMissingFields([]);
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    const businessID = userDetails?.BusinessID;
    if (!businessID) {
      alert('Business ID missing. Cannot add vendor.');
      return;
    }
    const payload = {
      VendorName: vendor.name,
      CategoryID: vendor.categoryID,
      ContactNumber: vendor.contactNumber,
      EmailID: vendor.email,
      ContactPerson: vendor.contactPerson,
      Address: vendor.address,
      Notes: vendor.notes || '',
      Status: vendor.status,
      BusinessID: businessID.toString(),
    };
    try {
      const addVendorURL = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_PORTNO}/purchases/AddVendor`;
      await axios.post(
        addVendorURL,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      navigate('/vendors');
    } catch (err: any) {
      console.error('Error adding vendor:', err.response?.data || err.message);
      alert('Failed to add vendor: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="back-button ">
          <ChevronLeft onClick={() => navigate(-1)} className="rounded-circle" />
        </div>
        <h1 className="text-xl font-bold">Add Vendor</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{step === 1 ? 'Add Contact Information' : 'Add Vendor Details'}</CardTitle>
          {step === 1 ? (
            <p className="text-gray-500">Step 1 of 2: Basic contact details</p>
          ) : (
            <p className="text-gray-500">Step 2 of 2: Vendor-specific information</p>
          )}
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleNext} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name<span className="text-red-500 ml-1">*</span></Label>
                  <Input
                    name="name"
                    placeholder="Enter company name"
                    value={vendor.name}
                    onChange={handleChange}
                    className={missingFields.includes('name') ? 'border-red-500' : ''}
                    autoComplete="off"
                  />
                  {missingFields.includes('name') && (
                    <span className="text-xs text-red-500">This field is required.</span>
                  )}
                </div>
                <div>
                  <Label>Contact Person<span className="text-red-500 ml-1">*</span></Label>
                  <Input
                    name="contactPerson"
                    placeholder="Enter contact person name"
                    value={vendor.contactPerson}
                    onChange={handleChange}
                    className={missingFields.includes('contactPerson') ? 'border-red-500' : ''}
                    autoComplete="off"
                  />
                  {missingFields.includes('contactPerson') && (
                    <span className="text-xs text-red-500">This field is required.</span>
                  )}
                </div>
                <div>
                  <Label>Email Address<span className="text-red-500 ml-1">*</span></Label>
                  <Input
                    name="email"
                    placeholder="Enter email address"
                    type="email"
                    value={vendor.email}
                    onChange={handleChange}
                    className={missingFields.includes('email') ? 'border-red-500' : ''}
                    autoComplete="off"
                  />
                  {missingFields.includes('email') && (
                    <span className="text-xs text-red-500">This field is required.</span>
                  )}
                </div>
                <div>
                  <Label>Phone Number<span className="text-red-500 ml-1">*</span></Label>
                  <Input
                    name="contactNumber"
                    placeholder="(555) 123-4567"
                    value={vendor.contactNumber}
                    onChange={handleChange}
                    className={missingFields.includes('contactNumber') ? 'border-red-500' : ''}
                    autoComplete="off"
                  />
                  {missingFields.includes('contactNumber') && (
                    <span className="text-xs text-red-500">This field is required.</span>
                  )}
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  name="address"
                  placeholder="Enter full address"
                  value={vendor.address}
                  onChange={handleChange}
                  className={missingFields.includes('address') ? 'border-red-500' : ''}
                  autoComplete="off"
                />
                {missingFields.includes('address') && (
                  <span className="text-xs text-red-500">This field is required.</span>
                )}
              </div>
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Next: Vendor Details
                </Button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Contact Info Summary Card */}
              <div className="bg-gray-50 rounded-md p-4 mb-6">
                <div className="font-semibold mb-2">Contact Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><span className="font-semibold">Company:</span> {vendor.name}</div>
                  <div><span className="font-semibold">Contact:</span> {vendor.contactPerson}</div>
                  <div><span className="font-semibold">Email:</span> {vendor.email}</div>
                  <div><span className="font-semibold">Phone:</span> {vendor.contactNumber}</div>
                  <div className="md:col-span-2"><span className="font-semibold">Address:</span> {vendor.address}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Service Type<span className="text-red-500 ml-1">*</span></Label>
                  <Select
                    options={categoryOptions}
                    inputValue={inputValue}
                    onInputChange={(value) => setInputValue(value)}
                    menuIsOpen={inputValue.length > 0}
                    value={categoryOptions.find(option => option.value === Number(vendor.categoryID)) || null}
                    onChange={(selectedOption) => {
                      setVendor(prev => ({
                        ...prev,
                        categoryID: selectedOption?.value?.toString() || ''
                      }));
                      if (missingFields.includes('categoryID')) {
                        setMissingFields(prev => prev.filter(f => f !== 'categoryID'));
                      }
                    }}
                    placeholder="Select service type"
                    isClearable
                    classNamePrefix="react-select"
                    className="react-select-container"
                  />
                  {missingFields.includes('categoryID') && (
                    <span className="text-xs text-red-500">This field is required.</span>
                  )}
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    name="status"
                    value={vendor.status}
                    onChange={handleChange}
                    className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  name="notes"
                  placeholder="Additional notes about this vendor..."
                  value={vendor.notes}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleBack}
                >
                  &#8592; Back
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8">
                  &#10003; Complete Registration
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVendorPage;