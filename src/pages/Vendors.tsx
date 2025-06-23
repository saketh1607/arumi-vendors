import React, { useEffect, useState, useContext, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Building2, Mail, Phone, MapPin, FileText, Search, Plus } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import UserDetailsContext from "@/hooks/UserDetailsContext";
import { Edit, Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import axios from "axios";

interface Vendor {
  VendorID: number;
  Name: string;
  CategoryID: string;
  VendorCategory: string;
  ContactNumber: string;
  Email: string;
  ContactPerson: string;
  Address: string;
  Notes: string;
  Status?: string;
}

interface Category {
  CategoryID: string;
  CategoryName: string;
}

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deletingVendorId, setDeletingVendorId] = useState<number | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { users } = useAppContext();
  const userDetails = useContext(UserDetailsContext);

  const API_BASE = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_PORTNO}`;

  // Fetch vendors
  const fetchVendors = async () => {
    if (!userDetails?.userDetails.BusinessID) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/purchases/GetVendorsList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          BusinessID: String(userDetails?.userDetails.BusinessID),
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const json = await res.json();
      const data: Vendor[] = Array.isArray(json) ? json : json.vendors || json.data || [];
      setVendors(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    if (!userDetails?.userDetails.BusinessID) return;
    try {
      const res = await fetch(`${API_BASE}/purchases/GetVendorCategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          BusinessID: String(userDetails?.userDetails.BusinessID),
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const json = await res.json();
      const data: Category[] = Array.isArray(json) ? json : json.categories || json.data || [];
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    if (userDetails?.userDetails?.BusinessID) {
      fetchVendors();
      fetchCategories();
    }
  }, [userDetails?.userDetails?.BusinessID]);

  const handleDeleteVendor = async (vendorID: number) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    setDeletingVendorId(vendorID);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_PORTNO}/purchases/DeleteVendor`,
        { VendorID: String(vendorID) }
      );

      if (res.data?.RetString === '1') {
        alert("Vendor deleted successfully.");
        fetchVendors();
      } else {
        alert("Vendor is already in use. You can't delete it.");
      }
    } catch (error: any) {
      console.error("Error deleting vendor:", error?.response?.data || error.message);
      alert("Failed to delete vendor due to a server error.");
    } finally {
      setDeletingVendorId(null);
    }
  };

  // Open edit dialog with all fields always defined as strings
  const openEditDialog = (vendor: Vendor) => {
    // Map VendorCategory (name) to CategoryID
    const foundCategory = categories.find(
      (cat) => cat.CategoryName === vendor.VendorCategory
    );
    setEditingVendor({
      VendorID: vendor.VendorID,
      Name: vendor.Name ?? "",
      CategoryID: foundCategory ? foundCategory.CategoryID : (vendor.CategoryID ?? ""),
      VendorCategory: vendor.VendorCategory ?? "",
      ContactNumber: vendor.ContactNumber ?? "",
      Email: vendor.Email ?? "",
      ContactPerson: vendor.ContactPerson ?? "",
      Address: vendor.Address ?? "",
      Notes: vendor.Notes ?? "",
      Status: vendor.Status,
    });
    setMissingFields([]);
  };

  const closeEditDialog = () => {
    setEditingVendor(null);
    setMissingFields([]);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editingVendor) return;
    const { name, value } = e.target;
    setEditingVendor({
      ...editingVendor,
      [name]: value,
    });
    setMissingFields((prev) => prev.filter((f) => f !== name));
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingVendor || !userDetails?.userDetails.BusinessID) return;

    // Custom validation for required fields
    const missing: string[] = [];
    if (!editingVendor.Name) missing.push("Name");
    if (!editingVendor.CategoryID) missing.push("CategoryID");
    if (!editingVendor.ContactNumber) missing.push("ContactNumber");
    if (!editingVendor.Email) missing.push("Email");
    if (!editingVendor.ContactPerson) missing.push("ContactPerson");
    if (!editingVendor.Address) missing.push("Address");
    setMissingFields(missing);

    if (missing.length > 0) {
      alert("Please fill all required fields: " + missing.join(", "));
      return;
    }

    setUpdateLoading(true);

    const payload = {
      VendorID: editingVendor.VendorID.toString(),
      VendorName: editingVendor.Name,
      CategoryID: editingVendor.CategoryID.toString(),
      ContactNumber: editingVendor.ContactNumber,
      EmailID: editingVendor.Email,
      ContactPerson: editingVendor.ContactPerson,
      Address: editingVendor.Address,
      Notes: editingVendor.Notes,
      BusinessID: userDetails.userDetails.BusinessID.toString(),
      Status: editingVendor.Status,
    };

    // Debug log
    console.log('Update payload:', payload);

    try {
      const res = await fetch(`${API_BASE}/purchases/UpdateVendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      if (res.status !== 204) {
        try {
          data = await res.json();
        } catch {}
      }

      if (!res.ok) {
        throw new Error((data && data.message) || `Failed to update vendor: ${res.statusText}`);
      }

      alert("Vendor updated successfully.");
      closeEditDialog();
      fetchVendors();
    } catch (err: any) {
      alert("Error updating vendor: " + (err.message || "Unknown error"));
    } finally {
      setUpdateLoading(false);
    }
  };

  // Find the current category name for autofill
  const getCategoryNameById = (categoryId: string) => {
    const found = categories.find((cat) => cat.CategoryID === categoryId);
    return found ? found.CategoryName : "";
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.VendorCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.ContactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.Email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-2 sm:p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold flex items-center mb-1 sm:mb-0">
            <Building2 className="mr-2 h-6 sm:h-8 w-6 sm:w-8" /> Vendor Management
          </h1>
          <p className="text-muted-foreground text-xs sm:text-base">Manage your business vendors and suppliers</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button onClick={() => navigate("/add-vendor")} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base py-2 sm:py-0">
            <Plus className="mr-2 h-4 w-4" /> Add Vendor
          </Button>
          <Button onClick={() => navigate("/vendor-categories")} className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-0">Manage Categories</Button>
        </div>
      </div>
      <div className="mb-3 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vendors by name, service, or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm sm:text-base"
          />
        </div>
      </div>

      {loading && <div className="text-center text-muted-foreground mt-8">Loading vendors...</div>}
      {error && <div className="text-center text-red-600 mt-8">{error}</div>}

      {!loading && !error && (
        <>
          {filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.VendorID} className="bg-white shadow-sm sm:shadow rounded-lg sm:rounded-xl border border-gray-200 px-4 py-3 sm:p-6 flex flex-col justify-between min-h-[340px] w-full mb-2 sm:mb-0">
                  <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="flex flex-row justify-between items-start mb-1 sm:mb-2">
                      <div>
                        <h3 className="text-base sm:text-2xl font-bold sm:font-extrabold mb-1 text-gray-900">{vendor.Name}</h3>
                        <div className="text-xs text-gray-400 mb-1">ID: {vendor.VendorID}</div>
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full mb-2 border border-gray-200">{vendor.VendorCategory}</span>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full border border-green-200 mt-2 sm:mt-0">active</span>
                    </div>
                    <div className="space-y-1 sm:space-y-3 text-xs sm:text-base text-gray-700 mb-2 sm:mb-4">
                      <div className="flex items-center">
                        <Building2 className="h-4 sm:h-5 w-4 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                        <span>{vendor.ContactPerson}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 sm:h-5 w-4 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                        <span>{vendor.Email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 sm:h-5 w-4 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                        <span>{vendor.ContactNumber}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 sm:h-5 w-4 sm:w-5 mr-2 sm:mr-3 text-gray-400" />
                        <span>{vendor.Address}</span>
                      </div>
                    </div>
                    <hr className="my-1 sm:my-3 border-gray-200" />
                    {vendor.Notes && (
                      <div className="mb-1 sm:mb-4">
                        <span className="italic text-gray-500 text-xs sm:text-sm">"{vendor.Notes}"</span>
                      </div>
                    )}
                    <div className="flex flex-row gap-2 mt-auto">
                      <button
                        className="w-full py-2 border border-gray-300 rounded-lg bg-white text-sm sm:text-base font-semibold text-gray-900 hover:bg-gray-50 transition"
                        onClick={() => openEditDialog(vendor)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full py-2 border border-gray-300 rounded-lg bg-white text-sm sm:text-base font-semibold text-red-600 hover:bg-red-50 transition"
                        onClick={() => handleDeleteVendor(vendor.VendorID)}
                      >
                        Delete
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground mt-8">
              No vendors found.
            </div>
          )}
        </>
      )}

      {/* Edit Dialog - mobile responsive */}
      {editingVendor && (
        <div
          className="z-[9999] fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4 overflow-auto"
          onClick={closeEditDialog}
        >
          <div
            className="bg-white rounded-md p-2 sm:p-6 w-full max-w-lg sm:max-w-2xl max-h-full overflow-auto shadow-lg sm:mx-auto sm:my-auto relative"
            onClick={(e) => e.stopPropagation()}
            style={{ minWidth: "0", maxWidth: "100vw" }}
          >
            <button
              className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-600 hover:text-gray-900"
              onClick={closeEditDialog}
              aria-label="Close edit vendor dialog"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h2 className="text-lg sm:text-2xl font-bold mb-1">Edit Vendor Details</h2>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">Update vendor-specific information</p>
            {/* Editable Contact Information Card */}
            <div className="bg-gray-50 rounded-md p-2 sm:p-4 mb-4 sm:mb-6">
              <div className="font-semibold mb-2 text-sm sm:text-base">Contact Information</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-4 text-xs sm:text-sm">
                <div>
                  <label htmlFor="Name" className="block font-medium mb-1">Company<span className="text-red-500 ml-1">*</span></label>
                  <input
                    type="text"
                    id="Name"
                    name="Name"
                    value={editingVendor.Name}
                    onChange={handleInputChange}
                    className={`w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${missingFields.includes("Name") ? "border-red-500" : "border-gray-300"}`}
                    autoComplete="off"
                  />
                  {missingFields.includes("Name") && (
                    <span className="text-xs text-red-500">This field is required.</span>
                  )}
                </div>
                <div>
                  <label htmlFor="ContactPerson" className="block font-medium mb-1">Contact<span className="text-red-500 ml-1">*</span></label>
                  <input
                    type="text"
                    id="ContactPerson"
                    name="ContactPerson"
                    value={editingVendor.ContactPerson}
                    onChange={handleInputChange}
                    className={`w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${missingFields.includes("ContactPerson") ? "border-red-500" : "border-gray-300"}`}
                    autoComplete="off"
                  />
                  {missingFields.includes("ContactPerson") && (
                    <span className="text-xs text-red-500">This field is required.</span>
                  )}
                </div>
                <div>
                  <label htmlFor="Email" className="block font-medium mb-1">Email<span className="text-red-500 ml-1">*</span></label>
                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    value={editingVendor.Email}
                    onChange={handleInputChange}
                    className={`w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${missingFields.includes("Email") ? "border-red-500" : "border-gray-300"}`}
                    autoComplete="off"
                  />
                  {missingFields.includes("Email") && (
                    <span className="text-xs text-red-500">This field is required.</span>
                  )}
                </div>
                <div>
                  <label htmlFor="ContactNumber" className="block font-medium mb-1">Phone<span className="text-red-500 ml-1">*</span></label>
                  <input
                    type="tel"
                    id="ContactNumber"
                    name="ContactNumber"
                    value={editingVendor.ContactNumber}
                    onChange={handleInputChange}
                    className={`w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${missingFields.includes("ContactNumber") ? "border-red-500" : "border-gray-300"}`}
                    autoComplete="off"
                  />
                  {missingFields.includes("ContactNumber") && (
                    <span className="text-xs text-red-500">This field is required.</span>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="Address" className="block font-medium mb-1">
                    Address<span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    id="Address"
                    name="Address"
                    value={editingVendor.Address}
                    onChange={handleInputChange}
                    rows={2}
                    className={`w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${missingFields.includes("Address") ? "border-red-500" : "border-gray-300"}`}
                    autoComplete="off"
                  />
                  {missingFields.includes("Address") && (
                    <span className="text-xs text-red-500">This field is required.</span>
                  )}
                </div>
              </div>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Service Type */}
                <div>
                  <label htmlFor="CategoryID" className="block font-medium mb-1">
                    Service Type<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="CategoryID"
                    name="CategoryID"
                    value={editingVendor.CategoryID}
                    onChange={handleInputChange}
                    className={`w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${missingFields.includes("CategoryID") ? "border-red-500" : "border-gray-300"}`}
                    autoComplete="off"
                  >
                    <option value="">
                      {editingVendor.CategoryID
                        ? getCategoryNameById(editingVendor.CategoryID) || "Select Service Type"
                        : "Select Service Type"}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.CategoryID} value={cat.CategoryID}>
                        {cat.CategoryName}
                      </option>
                    ))}
                  </select>
                  {missingFields.includes("CategoryID") && (
                    <span className="text-xs text-red-500">This field is required.</span>
                  )}
                </div>
                {/* Status */}
                <div>
                  <label htmlFor="Status" className="block font-medium mb-1">
                    Status
                  </label>
                  <select
                    id="Status"
                    name="Status"
                    value={editingVendor.Status || "Active"}
                    onChange={handleInputChange}
                    className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              {/* Notes */}
              <div>
                <label htmlFor="Notes" className="block font-medium mb-1">
                  Notes
                </label>
                <textarea
                  id="Notes"
                  name="Notes"
                  value={editingVendor.Notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
                <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8" disabled={updateLoading}>
                  {updateLoading ? "Updating..." : (
                    <span className="flex items-center"><span className="mr-2">&#10003;</span>Update Vendor</span>
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full sm:w-auto px-8" onClick={closeEditDialog} disabled={updateLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;