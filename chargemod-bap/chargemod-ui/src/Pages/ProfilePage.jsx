import React, { useEffect, useState } from "react";
import { useBooking } from "../contexts/BookingContext";
import { apiService, mockService } from "../services/apiService";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiSave,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useBooking();
  const [profile, setProfile] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiService
          .getUserProfile(currentUser.userId)
          .catch(() => mockService.getUserProfile(currentUser.userId));
        if (res && res.success) {
          setProfile(res.data);
          setCurrentUser(res.data);
        }
      } catch {}
    };
    fetchProfile();
  }, []);

  const save = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await apiService
        .saveUserProfile(profile.userId, profile)
        .catch(() => mockService.saveUserProfile(profile.userId, profile));
      if (res && res.success) {
        setCurrentUser(res.data);
        setMessage("Profile saved successfully");
        setIsEditing(false);
      }
    } catch (e) {
      setMessage("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await apiService.deleteUserProfile(profile.userId);
      if (res && res.success) {
        setMessage("Profile deleted successfully");
        const fallback = {
          userId: profile.userId,
          name: "EV User",
          email: `${profile.userId}@example.com`,
          phone: "",
        };
        setCurrentUser(fallback);
        setProfile(fallback);
        setIsEditing(true);
      }
    } catch (e) {
      setMessage("Failed to delete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-gray-600 mt-2">Manage your account details</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/60">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold text-gray-900">
            Profile Details
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600"
            >
              <FiEdit2 className="w-4 h-4 mr-1" />{" "}
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              onClick={remove}
              className="inline-flex items-center px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
            >
              <FiTrash2 className="w-4 h-4 mr-1" /> Delete
            </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <div className="mt-1 flex items-center border border-gray-200 rounded-xl px-3">
              <FiUser className="w-4 h-4 text-gray-400" />
              <input
                disabled={!isEditing}
                className={`w-full p-3 outline-none ${
                  isEditing ? "bg-white" : "bg-transparent"
                } text-gray-900 placeholder:text-gray-500`}
                value={profile.name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="mt-1 flex items-center border border-gray-200 rounded-xl px-3">
              <FiMail className="w-4 h-4 text-gray-400" />
              <input
                disabled={!isEditing}
                className={`w-full p-3 outline-none ${
                  isEditing ? "bg-white" : "bg-transparent"
                } text-gray-900 placeholder:text-gray-500`}
                value={profile.email || ""}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <div className="mt-1 flex items-center border border-gray-200 rounded-xl px-3">
              <FiPhone className="w-4 h-4 text-gray-400" />
              <input
                disabled={!isEditing}
                className={`w-full p-3 outline-none ${
                  isEditing ? "bg-white" : "bg-transparent"
                } text-gray-900 placeholder:text-gray-500`}
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Avatar URL</label>
            <div className="mt-1 flex items-center border border-gray-200 rounded-xl px-3">
              <span className="text-gray-400 text-xs mr-2">img</span>
              <input
                disabled={!isEditing}
                className={`w-full p-3 outline-none ${
                  isEditing ? "bg-white" : "bg-transparent"
                } text-gray-900 placeholder:text-gray-500`}
                value={profile.avatarUrl || ""}
                onChange={(e) =>
                  setProfile({ ...profile, avatarUrl: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm text-gray-600">Street</label>
            <input
              disabled={!isEditing}
              className={`w-full mt-1 p-3 border border-gray-200 rounded-xl ${
                isEditing ? "bg-white" : "bg-transparent"
              } text-gray-900 placeholder:text-gray-500`}
              value={profile.address?.street || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: { ...profile.address, street: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">City</label>
            <input
              disabled={!isEditing}
              className={`w-full mt-1 p-3 border border-gray-200 rounded-xl ${
                isEditing ? "bg-white" : "bg-transparent"
              } text-gray-900 placeholder:text-gray-500`}
              value={profile.address?.city || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: { ...profile.address, city: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">State</label>
            <input
              disabled={!isEditing}
              className={`w-full mt-1 p-3 border border-gray-200 rounded-xl ${
                isEditing ? "bg-white" : "bg-transparent"
              } text-gray-900 placeholder:text-gray-500`}
              value={profile.address?.state || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: { ...profile.address, state: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">PIN Code</label>
            <input
              disabled={!isEditing}
              className={`w-full mt-1 p-3 border border-gray-200 rounded-xl ${
                isEditing ? "bg-white" : "bg-transparent"
              } text-gray-900 placeholder:text-gray-500`}
              value={profile.address?.pinCode || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: { ...profile.address, pinCode: e.target.value },
                })
              }
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div
            className={`text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
          {isEditing && (
            <button
              onClick={save}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-green-500 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <FiSave className="w-5 h-5 mr-2" />
              {loading ? "Saving..." : "Save Profile"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
