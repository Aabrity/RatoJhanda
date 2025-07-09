
"use client"

import { Button, Modal, TextInput } from "flowbite-react"
import { useRef, useState } from "react"
import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { toast, Toaster } from "react-hot-toast"
import { HiCamera, HiLockClosed, HiMail, HiUser } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice"

const customStyles = `
  .flowbite-button[data-testid="flowbite-button"] {
    border: none !important;
    padding: 0.375rem 0.75rem !important;
    font-size: 0.875rem !important;
  }
  .flowbite-textinput input {
    padding: 0.375rem 0.75rem !important;
    font-size: 0.875rem !important;
  }
  .flowbite-textinput input:focus {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 1px #ef4444 !important;
  }
`

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const filePickerRef = useRef()

  const [imageBase64, setImageBase64] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [formData, setFormData] = useState({})
  const [showModal, setShowModal] = useState(false)

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0]
  //   if (file) {
  //     if (file.size > 2 * 1024 * 1024) {
  //       toast.error("Image must be less than 2MB")
  //       return
  //     }

  //     setImageFileUploading(true)
  //     setImageFileUploadProgress(0)

  //     const reader = new FileReader()
  //     reader.onloadstart = () => setImageFileUploadProgress(10)
  //     reader.onprogress = (event) => {
  //       if (event.lengthComputable) {
  //         const progress = Math.round((event.loaded / event.total) * 100)
  //         setImageFileUploadProgress(progress)
  //       }
  //     }
  //     reader.onload = () => {
  //       const base64String = reader.result
  //       setImageBase64(base64String)
  //       setFormData({ ...formData, profilePicture: base64String })
  //       setImageFileUploadProgress(100)
  //       setImageFileUploading(false)
  //     }
  //     reader.onerror = () => {
  //       toast.error("Failed to read image file")
  //       setImageFileUploading(false)
  //       setImageFileUploadProgress(null)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }
const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    toast.error("Image must be less than 2MB");
    return;
  }

  setImageFileUploading(true);
  setImageFileUploadProgress(10);

  const formData = new FormData();
  formData.append("profilePicture", file);

  try {
    const res = await fetch(`/api/user/profile-picture/${currentUser._id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    setImageFileUploadProgress(100);
    setImageFileUploading(false);

    if (!res.ok) {
      toast.error(data.message || "Failed to upload image");
    } else {
      toast.success("Profile picture uploaded!");
      // update Redux state
      dispatch(updateSuccess(data.user)); // ⬅️ use `data.user` from response
    }
  } catch (error) {
    toast.error("Upload failed: " + error.message);
    setImageFileUploading(false);
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (Object.keys(formData).length === 0) {
      toast.error("No changes made")
      return
    }
    if (imageFileUploading) {
      toast.error("Wait for image upload to complete")
      return
    }

    try {
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        dispatch(updateFailure(data.message))
        toast.error(data.message || "Failed to update profile")
      } else {
        dispatch(updateSuccess(data))
        toast.success("Profile updated successfully")
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
      toast.error("Update failed: " + error.message)
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message))
        toast.error(data.message || "Failed to delete account")
      } else {
        dispatch(deleteUserSuccess(data))
        toast.success("Account deleted successfully")
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
      toast.error("Deletion failed: " + error.message)
    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" })
      const data = await res.json()

      if (!res.ok) {
        console.log(data.message)
      } else {
        dispatch(signoutSuccess())
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="max-w-md mx-auto px-3">
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Profile</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-400 px-4 py-3">
            <div className="flex flex-col items-center">
              <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
              <div className="relative group">
                <div
                  className="relative w-16 h-16 cursor-pointer overflow-hidden rounded-full ring-2 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                  onClick={() => filePickerRef.current.click()}
                >
                  {imageFileUploadProgress && (
                    <CircularProgressbar
                      value={imageFileUploadProgress || 0}
                      text={`${imageFileUploadProgress}%`}
                      strokeWidth={6}
                      styles={{
                        root: { width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 10 },
                        path: { stroke: `rgba(239, 68, 68, ${imageFileUploadProgress / 100})` },
                        text: { fill: "white", fontSize: "14px", fontWeight: "bold" },
                      }}
                    />
                  )}
                  <img
                    src={imageBase64 || `/uploads/${currentUser.profilePicture}`}
                    alt="Profile"
                    className={`w-full h-full object-cover ${imageFileUploadProgress && imageFileUploadProgress < 100 && "opacity-60"}`}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <HiCamera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <h2 className="text-lg font-semibold text-white">{currentUser.username}</h2>
                <p className="text-sm text-red-100">{currentUser.email}</p>
                {currentUser.isAdmin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 bg-opacity-90 text-red-800 mt-1">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-3">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <HiUser className="w-3 h-3" />
                    Username
                  </label>
                  <TextInput
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    size="sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <HiMail className="w-3 h-3" />
                    Email
                  </label>
                  <TextInput
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                    size="sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <HiLockClosed className="w-3 h-3" />
                    Password
                  </label>
                  <TextInput
                    type="password"
                    id="password"
                    placeholder="New password (optional)"
                    onChange={handleChange}
                    size="sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  type="submit"
                  color="failure"
                  size="sm"
                  disabled={loading || imageFileUploading}
                  className="w-full"
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowModal(true)}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors duration-200"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Confirm Delete</Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button color="failure" onClick={handleDeleteUser}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}
