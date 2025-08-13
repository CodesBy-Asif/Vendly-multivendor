import { useState } from "react";
import {
  Plus,
  MapPin,
  Edit,
  Trash2,
  Home,
  Building,
  Star,
  X,
} from "lucide-react";
import { Country, State, City } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrUpdateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../../redux/actions/user";

function AddressTab() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const addresses = user?.addresses || [];

  const [showForm, setShowForm] = useState(false);
  const [countrycode, setcountrycode] = useState("");
  const [StateCode, setStatecode] = useState("");

  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: "home",
    label: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });

  const addressTypes = [
    { value: "home", label: "Home", icon: Home },
    { value: "work", label: "Work", icon: Building },
    { value: "other", label: "Other", icon: MapPin },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.address ||
      !formData.city ||
      !formData.zipCode
    ) {
      toast("Please fill in all required fields");
      return;
    }

    const dataToSend = { ...formData };
    if (editingAddress?._id) {
      dataToSend._id = editingAddress._id;
    }

    await dispatch(addOrUpdateAddress(dataToSend));
    resetForm();
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await dispatch(deleteAddress(id));
    }
  };

  const handleSetDefault = async (id) => {
    await dispatch(setDefaultAddress(id));
  };

  const resetForm = () => {
    setFormData({
      type: "home",
      label: "",
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: false,
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const getAddressTypeIcon = (type) => {
    const addressType = addressTypes.find((t) => t.value === type);
    const IconComponent = addressType?.icon || MapPin;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              My Addresses
            </h1>
            <p className="text-muted-foreground">
              Manage your saved addresses for faster checkout
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address</span>
          </button>
        </div>
      </div>

      {/* Address Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {addressTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange("type", type.value)}
                      className={`flex items-center space-x-2 p-3 border rounded-md transition-colors ${
                        formData.type === type.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <type.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Address Label
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => handleInputChange("label", e.target.value)}
                  placeholder="e.g., Home, Office, Mom's House"
                  className="w-full p-3 border border-border rounded-md bg-background text-primary"
                />
              </div>

              {/* Name and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter full name"
                    className="w-full p-3 border border-border rounded-md bg-background text-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-3 border border-border rounded-md bg-background text-primary"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main Street, Apt 4B"
                  className="w-full p-3 border border-border rounded-md bg-background text-primary"
                  required
                />
              </div>
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Country
                </label>
                <select
                  value={countrycode}
                  name="country"
                  className="w-full p-3 border border-border rounded-md bg-background text-primary"
                  onChange={(e) => {
                    const selectedCountry = Country.getCountryByCode(
                      e.target.value
                    );
                    handleInputChange("country", selectedCountry.name);
                    setcountrycode(selectedCountry.isoCode);
                    setStatecode(""); // Reset state when country changes
                  }}
                >
                  <option value="">Select country</option>
                  {Country.getAllCountries().map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* City, State, ZIP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    State
                  </label>
                  <select
                    value={StateCode}
                    className="w-full p-3 border border-border rounded-md bg-background text-primary"
                    onChange={(e) => {
                      const selectedState = State.getStatesOfCountry(
                        countrycode
                      ).find((state) => state.isoCode === e.target.value);
                      handleInputChange("state", selectedState.name);
                      setStatecode(selectedState.isoCode);
                    }}
                  >
                    <option value="">Select your state</option>
                    {State.getStatesOfCountry(countrycode).map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    City *
                  </label>
                  <select
                    value={formData.city}
                    className="w-full p-3 border border-border rounded-md bg-background text-primary"
                    onChange={(e) => {
                      handleInputChange("city", e.target.value);
                    }}
                  >
                    <option value="">Select your city</option>
                    {City.getCitiesOfState(countrycode, StateCode).map(
                      (city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    placeholder="10001"
                    className="w-full p-3 border border-border rounded-md bg-background text-primary"
                    required
                  />
                </div>
              </div>

              {/* Default Address */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    handleInputChange("isDefault", e.target.checked)
                  }
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <label htmlFor="isDefault" className="text-sm text-primary">
                  Set as default address
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-border">
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  {editingAddress ? "Update Address" : "Save Address"}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-border text-primary rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary mb-2">
              No addresses saved
            </h3>
            <p className="text-muted-foreground">
              Add your first address to get started
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-2 text-primary">
                      {getAddressTypeIcon(address.type)}
                      <span className="font-semibold">
                        {address.label ||
                          address.type.charAt(0).toUpperCase() +
                            address.type.slice(1)}
                      </span>
                    </div>
                    {address.isDefault && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        <Star className="w-3 h-3" />
                        <span>Default</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-primary">{address.name}</p>
                    {address.phone && (
                      <p className="text-muted-foreground">{address.phone}</p>
                    )}
                    <p className="text-primary">{address.address}</p>
                    <p className="text-primary">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-muted-foreground">{address.country}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                      title="Set as default"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                    title="Edit address"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AddressTab;
