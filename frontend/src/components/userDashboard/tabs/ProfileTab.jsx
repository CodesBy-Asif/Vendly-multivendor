import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
} from "../../../redux/actions/user.js";
function ProfileTab() {
  const user = useSelector((state) => state.user?.user || {});
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setFormData({ ...user });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const handleChangeImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) dispatch(updateAvatar(file));
    };

    fileInput.click();
  };

  const handleRemoveImage = () => {
    dispatch(removeAvatar());
  };

  const handlePasswordSubmit = () => {
    if (passwords.new !== passwords.confirm) {
      return alert("New passwords do not match.");
    }
    dispatch(changePassword(passwords));
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="md:pl-10 sm:flex justify-around gap-10 pl-4 pr-4 pt-4 pb-10 space-y-8">
      {/* Profile Picture */}
      <div>
        <h1 className="text-2xl font-semibold mb-6">Public picture</h1>
        <div className="flex flex-wrap gap-10 items-start">
          <img
            src={user.avatar}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover"
          />
          <div className="flex flex-col gap-4">
            <button
              onClick={handleChangeImage}
              className="px-4 py-2 bg-accent border border-border hover:bg-muted rounded"
            >
              Change Image
            </button>
            <button
              onClick={handleRemoveImage}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded"
            >
              Remove Image
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="sm:max-w-[60%] w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Profile Information</h2>
          <div className="flex gap-4">
            <button
              onClick={toggleEdit}
              className="px-4 py-1 text-sm border border-border rounded hover:bg-muted"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            {isEditing && (
              <button
                onClick={handleSave}
                className="px-4 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {[
            { label: "Full Name", key: "full_name" },
            { label: "Email", key: "email" },
            { label: "Phone Number", key: "phone" },
            { label: "Zip Code", key: "zip" },
            { label: "Address Line 1", key: "address1" },
          ].map(({ label, key }) => (
            <div key={key} className="md:min-w-1/3 w-full max-w-64">
              <label className="block mb-1 text-sm font-medium">{label}</label>
              <input
                type="text"
                name={key}
                value={formData[key] || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-border rounded"
                readOnly={!isEditing}
              />
            </div>
          ))}
        </div>

        {/* Change Password */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <div className="flex flex-wrap gap-6">
            {[
              { label: "Current Password", key: "current" },
              { label: "New Password", key: "new" },
              { label: "Confirm New Password", key: "confirm" },
            ].map(({ label, key }) => (
              <div key={key} className="md:min-w-1/3 w-full max-w-64">
                <label className="block mb-1 text-sm font-medium">
                  {label}
                </label>
                <input
                  type="password"
                  name={key}
                  value={passwords[key]}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border border-border rounded"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handlePasswordSubmit}
            className="mt-4 px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark"
            disabled={loading}
          >
            {loading ? "Processing..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;
