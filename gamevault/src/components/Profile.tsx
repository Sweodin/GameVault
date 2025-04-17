import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { updateProfile } from "firebase/auth";
import StatusSelector, { getStatusColor } from "./status/StatusSelector";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export default function Profile() {
  const { currentUser, username, userStatus } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username || "");
  const [bio, setBio] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  /*----- Fetch user profile data from Firestore when component mounts -----*/

  useEffect(() => {
    async function fetchUserProfile() {
      if (!currentUser) return;

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.bio) setBio(userData.bio);
          if (userData.showEmail !== undefined)
            setShowEmail(userData.showEmail);
          if (userData.profileImageUrl) setImageUrl(userData.profileImageUrl);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    fetchUserProfile();
  }, [currentUser]);

  /*----- Profile state and handlers -----*/

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleProfileUpdate(e: FormEvent) {
    e.preventDefault();

    if (!currentUser) return;

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });
      let profileImageUrl = imageUrl;

      // Upload image if a new one was selected
      if (imageFile) {
        try {
          // Create a storage reference
          const filePath = `profile-images/${currentUser.uid}`;
          const storageRef = ref(storage, filePath);

          // Upload the file
          await uploadBytes(storageRef, imageFile);
          console.log("Uploaded a profile image!");

          // Get the download URL
          profileImageUrl = await getDownloadURL(storageRef);
        } catch (error) {
          console.error("Error uploading image:", error);
          throw new Error("Failed to upload image");
        }
      }

      /*----- Update Firestore document -----*/
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        username: newUsername,
        bio: bio,
        showEmail: showEmail,
        profileImageUrl: profileImageUrl,
      });

      /*----- Update Firebase Auth profile -----*/
      await updateProfile(currentUser, {
        displayName: newUsername,
        photoURL: profileImageUrl || undefined,
      });

      setMessage({
        text: "Profile updated successfully!",
        type: "success",
      });
      setIsEditing(false);
      setImageFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        text: "Failed to update profile. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-900 to-cyan-800 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden border border-purple-900/30">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                      {username?.substring(0, 2).toUpperCase() || "GV"}
                    </div>
                  )}
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-gray-800 ${getStatusColor(
                    userStatus
                  )}`}
                ></div>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">
                  {username || "Guest"}
                </h1>
                <p className="text-cyan-300">
                  <span className="inline-flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(
                        userStatus
                      )}`}
                    ></span>
                    {userStatus}
                  </span>
                </p>
                <p className="text-gray-300 mt-1 flex items-center">
                  {currentUser?.email}
                  {showEmail ? (
                    <span className="ml-2 text-xs text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded">
                      Public
                    </span>
                  ) : (
                    <span className="ml-2 text-xs text-gray-400 bg-gray-700/50 px-1.5 py-0.5 rounded">
                      Private
                    </span>
                  )}
                </p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="ml-auto mt-4 md:mt-0 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {message.text && (
              <div
                className={`mb-4 p-3 rounded ${
                  message.type === "success"
                    ? "bg-green-900/50 text-green-300"
                    : "bg-red-900/50 text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 h-32"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Profile Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 rounded-full bg-gray-800 overflow-hidden border border-gray-700">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500 bg-gradient-to-br from-cyan-500/20 to-purple-600/20">
                            {username?.substring(0, 2).toUpperCase() || "GV"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          id="profile-image"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <label
                          htmlFor="profile-image"
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition-colors inline-block"
                        >
                          Choose Image
                        </label>
                        {imageFile && (
                          <div className="mt-2 text-xs text-gray-400">
                            Image ready to upload
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Status</label>
                    <StatusSelector variant="buttons" />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Privacy Settings
                    </label>
                    <div className="bg-gray-700/50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">
                            Email Visibility
                          </div>
                          <div className="text-sm text-gray-400">
                            Allow other users to see your email address
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={showEmail}
                            onChange={() => setShowEmail(!showEmail)}
                          />
                          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    About Me
                  </h2>
                  <p className="text-gray-300">
                    {bio ||
                      "No bio provided yet. Click 'Edit Profile' to add one!"}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Game Stats
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-400">0</div>
                      <div className="text-gray-400 text-sm">Games Played</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-400">0</div>
                      <div className="text-gray-400 text-sm">Achievements</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-400">0</div>
                      <div className="text-gray-400 text-sm">Friends</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-400">0</div>
                      <div className="text-gray-400 text-sm">Servers</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Recent Activity
                  </h2>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400">
                      No recent activity to display.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
