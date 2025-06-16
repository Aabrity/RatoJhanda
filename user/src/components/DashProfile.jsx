// import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
// import { useEffect, useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from 'firebase/storage';
// import { app } from '../firebase';
// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import {
//   updateStart,
//   updateSuccess,
//   updateFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   deleteUserFailure,
//   signoutSuccess,
// } from '../redux/user/userSlice';
// import { useDispatch } from 'react-redux';
// import { HiOutlineExclamationCircle } from 'react-icons/hi';
// import { Link } from 'react-router-dom';

// export default function DashProfile() {
//   const { currentUser, error, loading } = useSelector((state) => state.user);
//   const [imageFile, setImageFile] = useState(null);
//   const [imageFileUrl, setImageFileUrl] = useState(null);
//   const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
//   const [imageFileUploadError, setImageFileUploadError] = useState(null);
//   const [imageFileUploading, setImageFileUploading] = useState(false);
//   const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
//   const [updateUserError, setUpdateUserError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({});
//   const filePickerRef = useRef();
//   const dispatch = useDispatch();
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImageFileUrl(URL.createObjectURL(file));
//     }
//   };
//   useEffect(() => {
//     if (imageFile) {
//       uploadImage();
//     }
//   }, [imageFile]);

//   const uploadImage = async () => {
//     // service firebase.storage {
//     //   match /b/{bucket}/o {
//     //     match /{allPaths=**} {
//     //       allow read;
//     //       allow write: if
//     //       request.resource.size < 2 * 1024 * 1024 &&
//     //       request.resource.contentType.matches('image/.*')
//     //     }
//     //   }
//     // }
//     setImageFileUploading(true);
//     setImageFileUploadError(null);
//     const storage = getStorage(app);
//     const fileName = new Date().getTime() + imageFile.name;
//     const storageRef = ref(storage, fileName);
//     const uploadTask = uploadBytesResumable(storageRef, imageFile);
//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

//         setImageFileUploadProgress(progress.toFixed(0));
//       },
//       (error) => {
//         setImageFileUploadError(
//           'Could not upload image (File must be less than 2MB)'
//         );
//         setImageFileUploadProgress(null);
//         setImageFile(null);
//         setImageFileUrl(null);
//         setImageFileUploading(false);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           setImageFileUrl(downloadURL);
//           setFormData({ ...formData, profilePicture: downloadURL });
//           setImageFileUploading(false);
//         });
//       }
//     );
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUpdateUserError(null);
//     setUpdateUserSuccess(null);
//     if (Object.keys(formData).length === 0) {
//       setUpdateUserError('No changes made');
//       return;
//     }
//     if (imageFileUploading) {
//       setUpdateUserError('Please wait for image to upload');
//       return;
//     }
//     try {
//       dispatch(updateStart());
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         dispatch(updateFailure(data.message));
//         setUpdateUserError(data.message);
//       } else {
//         dispatch(updateSuccess(data));
//         setUpdateUserSuccess("User's profile updated successfully");
//       }
//     } catch (error) {
//       dispatch(updateFailure(error.message));
//       setUpdateUserError(error.message);
//     }
//   };
//   const handleDeleteUser = async () => {
//     setShowModal(false);
//     try {
//       dispatch(deleteUserStart());
//       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//         method: 'DELETE',
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         dispatch(deleteUserFailure(data.message));
//       } else {
//         dispatch(deleteUserSuccess(data));
//       }
//     } catch (error) {
//       dispatch(deleteUserFailure(error.message));
//     }
//   };

//   const handleSignout = async () => {
//     try {
//       const res = await fetch('/api/user/signout', {
//         method: 'POST',
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         console.log(data.message);
//       } else {
//         dispatch(signoutSuccess());
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
//   return (
//     <div className='max-w-lg mx-auto p-3 w-full'>
//       <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//         <input
//           type='file'
//           accept='image/*'
//           onChange={handleImageChange}
//           ref={filePickerRef}
//           hidden
//         />
//         <div
//           className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
//           onClick={() => filePickerRef.current.click()}
//         >
//           {imageFileUploadProgress && (
//             <CircularProgressbar
//               value={imageFileUploadProgress || 0}
//               text={`${imageFileUploadProgress}%`}
//               strokeWidth={5}
//               styles={{
//                 root: {
//                   width: '100%',
//                   height: '100%',
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                 },
//                 path: {
//                   stroke: `rgba(62, 152, 199, ${
//                     imageFileUploadProgress / 100
//                   })`,
//                 },
//               }}
//             />
//           )}
//           <img
//             src={imageFileUrl || currentUser.profilePicture}
//             alt='user'
//             className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
//               imageFileUploadProgress &&
//               imageFileUploadProgress < 100 &&
//               'opacity-60'
//             }`}
//           />
//         </div>
//         {imageFileUploadError && (
//           <Alert color='failure'>{imageFileUploadError}</Alert>
//         )}
//         <TextInput
//           type='text'
//           id='username'
//           placeholder='username'
//           defaultValue={currentUser.username}
//           onChange={handleChange}
//         />
//         <TextInput
//           type='email'
//           id='email'
//           placeholder='email'
//           defaultValue={currentUser.email}
//           onChange={handleChange}
//         />
//         <TextInput
//           type='password'
//           id='password'
//           placeholder='password'
//           onChange={handleChange}
//         />
//         <Button
//           type='submit'
//           gradientDuoTone='purpleToBlue'
//           outline
//           disabled={loading || imageFileUploading}
//         >
//           {loading ? 'Loading...' : 'Update'}
//         </Button>
//         {currentUser.isAdmin && (
//           <Link to={'/create-post'}>
//             <Button
//               type='button'
//               gradientDuoTone='purpleToPink'
//               className='w-full'
//             >
//               Create a post
//             </Button>
//           </Link>
//         )}
//       </form>
//       <div className='text-red-500 flex justify-between mt-5'>
//         <span onClick={() => setShowModal(true)} className='cursor-pointer'>
//           Delete Account
//         </span>
//         <span onClick={handleSignout} className='cursor-pointer'>
//           Sign Out
//         </span>
//       </div>
//       {updateUserSuccess && (
//         <Alert color='success' className='mt-5'>
//           {updateUserSuccess}
//         </Alert>
//       )}
//       {updateUserError && (
//         <Alert color='failure' className='mt-5'>
//           {updateUserError}
//         </Alert>
//       )}
//       {error && (
//         <Alert color='failure' className='mt-5'>
//           {error}
//         </Alert>
//       )}
//       <Modal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         popup
//         size='md'
//       >
//         <Modal.Header />
//         <Modal.Body>
//           <div className='text-center'>
//             <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
//             <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
//               Are you sure you want to delete your account?
//             </h3>
//             <div className='flex justify-center gap-4'>
//               <Button color='failure' onClick={handleDeleteUser}>
//                 Yes, I'm sure
//               </Button>
//               <Button color='gray' onClick={() => setShowModal(false)}>
//                 No, cancel
//               </Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }
// "use client"

// import { Alert, Button, Modal, TextInput } from "flowbite-react"
// import { useEffect, useRef, useState } from "react"
// import { useSelector, useDispatch } from "react-redux"
// import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
// import { app } from "../firebase"
// import { CircularProgressbar } from "react-circular-progressbar"
// import "react-circular-progressbar/dist/styles.css"
// import {
//   updateStart,
//   updateSuccess,
//   updateFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   deleteUserFailure,
//   signoutSuccess,
// } from "../redux/user/userSlice"
// import { HiOutlineExclamationCircle, HiCamera, HiUser, HiMail, HiLockClosed } from "react-icons/hi"
// import { Link } from "react-router-dom"

// export default function DashProfile() {
//   const { currentUser, error, loading } = useSelector((state) => state.user)
//   const dispatch = useDispatch()
//   const filePickerRef = useRef()

//   // Image upload states
//   const [imageFile, setImageFile] = useState(null)
//   const [imageFileUrl, setImageFileUrl] = useState(null)
//   const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
//   const [imageFileUploadError, setImageFileUploadError] = useState(null)
//   const [imageFileUploading, setImageFileUploading] = useState(false)

//   // Form states
//   const [formData, setFormData] = useState({})
//   const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
//   const [updateUserError, setUpdateUserError] = useState(null)
//   const [showModal, setShowModal] = useState(false)

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setImageFile(file)
//       setImageFileUrl(URL.createObjectURL(file))
//     }
//   }

//   useEffect(() => {
//     if (imageFile) {
//       uploadImage()
//     }
//   }, [imageFile])

//   const uploadImage = async () => {
//     setImageFileUploading(true)
//     setImageFileUploadError(null)
//     const storage = getStorage(app)
//     const fileName = new Date().getTime() + imageFile.name
//     const storageRef = ref(storage, fileName)
//     const uploadTask = uploadBytesResumable(storageRef, imageFile)

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//         setImageFileUploadProgress(progress.toFixed(0))
//       },
//       (error) => {
//         setImageFileUploadError("Could not upload image (File must be less than 2MB)")
//         setImageFileUploadProgress(null)
//         setImageFile(null)
//         setImageFileUrl(null)
//         setImageFileUploading(false)
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           setImageFileUrl(downloadURL)
//           setFormData({ ...formData, profilePicture: downloadURL })
//           setImageFileUploading(false)
//         })
//       },
//     )
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setUpdateUserError(null)
//     setUpdateUserSuccess(null)

//     if (Object.keys(formData).length === 0) {
//       setUpdateUserError("No changes made")
//       return
//     }
//     if (imageFileUploading) {
//       setUpdateUserError("Please wait for image to upload")
//       return
//     }

//     try {
//       dispatch(updateStart())
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })
//       const data = await res.json()

//       if (!res.ok) {
//         dispatch(updateFailure(data.message))
//         setUpdateUserError(data.message)
//       } else {
//         dispatch(updateSuccess(data))
//         setUpdateUserSuccess("Profile updated successfully")
//       }
//     } catch (error) {
//       dispatch(updateFailure(error.message))
//       setUpdateUserError(error.message)
//     }
//   }

//   const handleDeleteUser = async () => {
//     setShowModal(false)
//     try {
//       dispatch(deleteUserStart())
//       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//         method: "DELETE",
//       })
//       const data = await res.json()

//       if (!res.ok) {
//         dispatch(deleteUserFailure(data.message))
//       } else {
//         dispatch(deleteUserSuccess(data))
//       }
//     } catch (error) {
//       dispatch(deleteUserFailure(error.message))
//     }
//   }

//   const handleSignout = async () => {
//     try {
//       const res = await fetch("/api/user/signout", { method: "POST" })
//       const data = await res.json()

//       if (!res.ok) {
//         console.log(data.message)
//       } else {
//         dispatch(signoutSuccess())
//       }
//     } catch (error) {
//       console.log(error.message)
//     }
//   }

//   return (
//    <div className='max-w-lg mx-auto p-3 w-full'>
//   <div className="mx-auto w-full max-w-4xl px-6">
//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
//           <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
//         </div>

//         {/* Main Profile Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
//           {/* Profile Picture Section */}
//           <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-12">
//             <div className="flex flex-col items-center">
//               <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />

//               <div className="relative group">
//                 <div
//                   className="relative w-32 h-32 cursor-pointer overflow-hidden rounded-full ring-4 ring-white shadow-xl transition-transform duration-300 group-hover:scale-105"
//                   onClick={() => filePickerRef.current.click()}
//                 >
//                   {imageFileUploadProgress && (
//                     <CircularProgressbar
//                       value={imageFileUploadProgress || 0}
//                       text={`${imageFileUploadProgress}%`}
//                       strokeWidth={5}
//                       styles={{
//                         root: {
//                           width: "100%",
//                           height: "100%",
//                           position: "absolute",
//                           top: 0,
//                           left: 0,
//                           zIndex: 10,
//                         },
//                         path: {
//                           stroke: `rgba(255, 255, 255, ${imageFileUploadProgress / 100})`,
//                         },
//                         text: {
//                           fill: "white",
//                           fontSize: "16px",
//                           fontWeight: "bold",
//                         },
//                       }}
//                     />
//                   )}
//                   <img
//                     src={imageFileUrl || currentUser.profilePicture}
//                     alt="Profile"
//                     className={`w-full h-full object-cover ${
//                       imageFileUploadProgress && imageFileUploadProgress < 100 && "opacity-60"
//                     }`}
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
//                     <HiCamera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-4 text-center">
//                 <h2 className="text-xl font-semibold text-white">{currentUser.username}</h2>
//                 <p className="text-blue-100">{currentUser.email}</p>
//                 {currentUser.isAdmin && (
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white mt-2">
//                     Administrator
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Form Section */}
//           <div className="p-8">
//             {imageFileUploadError && (
//               <Alert color="failure" className="mb-6">
//                 {imageFileUploadError}
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid gap-6">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                     <HiUser className="w-4 h-4" />
//                     Username
//                   </label>
//                   <TextInput
//                     type="text"
//                     id="username"
//                     placeholder="Enter your username"
//                     defaultValue={currentUser.username}
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                     <HiMail className="w-4 h-4" />
//                     Email Address
//                   </label>
//                   <TextInput
//                     type="email"
//                     id="email"
//                     placeholder="Enter your email"
//                     defaultValue={currentUser.email}
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                     <HiLockClosed className="w-4 h-4" />
//                     New Password
//                   </label>
//                   <TextInput
//                     type="password"
//                     id="password"
//                     placeholder="Enter new password (optional)"
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-4 pt-4">
//                 <Button
//                   type="submit"
//                   gradientDuoTone="purpleToBlue"
//                   size="lg"
//                   disabled={loading || imageFileUploading}
//                   className="w-full"
//                 >
//                   {loading ? "Updating..." : "Update Profile"}
//                 </Button>

//                 {currentUser.isAdmin && (
//                   <Link to="/create-post" className="w-full">
//                     <Button type="button" gradientDuoTone="purpleToPink" size="lg" className="w-full">
//                       Create New Post
//                     </Button>
//                   </Link>
//                 )}
//               </div>
//             </form>

//             {/* Action Links */}
//             <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors duration-200"
//               >
//                 Delete Account
//               </button>
//               <button
//                 onClick={handleSignout}
//                 className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium transition-colors duration-200"
//               >
//                 Sign Out
//               </button>
//             </div>

//             {/* Status Messages */}
//             <div className="mt-6 space-y-4">
//               {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}
//               {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
//               {error && <Alert color="failure">{error}</Alert>}
//             </div>
//           </div>
//         </div>

//         {/* Delete Confirmation Modal */}
//         <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
//           <Modal.Header />
//           <Modal.Body>
//             <div className="text-center p-6">
//               <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-6">
//                 <HiOutlineExclamationCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
//               </div>
//               <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Delete Account</h3>
//               <p className="mb-6 text-gray-600 dark:text-gray-400">
//                 Are you sure you want to delete your account? This action cannot be undone and all your data will be
//                 permanently removed.
//               </p>
//               <div className="flex justify-center gap-4">
//                 <Button color="failure" onClick={handleDeleteUser}>
//                   Yes, Delete Account
//                 </Button>
//                 <Button color="gray" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </Modal.Body>
//         </Modal>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { Alert, Button, Modal, TextInput } from "flowbite-react"
// import { useEffect, useRef, useState } from "react"
// import { useSelector, useDispatch } from "react-redux"
// import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
// import { app } from "../firebase"
// import { CircularProgressbar } from "react-circular-progressbar"
// import "react-circular-progressbar/dist/styles.css"
// import {
//   updateStart,
//   updateSuccess,
//   updateFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   deleteUserFailure,
//   signoutSuccess,
// } from "../redux/user/userSlice"
// import { HiOutlineExclamationCircle, HiCamera, HiUser, HiMail, HiLockClosed } from "react-icons/hi"
// import { Link } from "react-router-dom"

// const customStyles = `
//   .flowbite-button[data-testid="flowbite-button"] {
//     background: linear-gradient(45deg, #ef4444, #dc2626) !important;
//     border: none !important;
//   }
//   .flowbite-button[data-testid="flowbite-button"]:hover {
//     background: linear-gradient(45deg, #dc2626, #b91c1c) !important;
//   }
//   .flowbite-textinput input:focus {
//     border-color: #ef4444 !important;
//     box-shadow: 0 0 0 1px #ef4444 !important;
//   }
//   .flowbite-alert[data-testid="flowbite-alert"] {
//     background-color: #fef2f2 !important;
//     border-color: #fecaca !important;
//     color: #991b1b !important;
//   }
// `

// export default function DashProfile() {
//   const { currentUser, error, loading } = useSelector((state) => state.user)
//   const dispatch = useDispatch()
//   const filePickerRef = useRef()

//   // Image upload states
//   const [imageFile, setImageFile] = useState(null)
//   const [imageFileUrl, setImageFileUrl] = useState(null)
//   const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
//   const [imageFileUploadError, setImageFileUploadError] = useState(null)
//   const [imageFileUploading, setImageFileUploading] = useState(false)

//   // Form states
//   const [formData, setFormData] = useState({})
//   const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
//   const [updateUserError, setUpdateUserError] = useState(null)
//   const [showModal, setShowModal] = useState(false)

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setImageFile(file)
//       setImageFileUrl(URL.createObjectURL(file))
//     }
//   }

//   useEffect(() => {
//     if (imageFile) {
//       uploadImage()
//     }
//   }, [imageFile])

//   const uploadImage = async () => {
//     setImageFileUploading(true)
//     setImageFileUploadError(null)
//     const storage = getStorage(app)
//     const fileName = new Date().getTime() + imageFile.name
//     const storageRef = ref(storage, fileName)
//     const uploadTask = uploadBytesResumable(storageRef, imageFile)

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//         setImageFileUploadProgress(progress.toFixed(0))
//       },
//       (error) => {
//         setImageFileUploadError("Could not upload image (File must be less than 2MB)")
//         setImageFileUploadProgress(null)
//         setImageFile(null)
//         setImageFileUrl(null)
//         setImageFileUploading(false)
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           setImageFileUrl(downloadURL)
//           setFormData({ ...formData, profilePicture: downloadURL })
//           setImageFileUploading(false)
//         })
//       },
//     )
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setUpdateUserError(null)
//     setUpdateUserSuccess(null)

//     if (Object.keys(formData).length === 0) {
//       setUpdateUserError("No changes made")
//       return
//     }
//     if (imageFileUploading) {
//       setUpdateUserError("Please wait for image to upload")
//       return
//     }

//     try {
//       dispatch(updateStart())
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })
//       const data = await res.json()

//       if (!res.ok) {
//         dispatch(updateFailure(data.message))
//         setUpdateUserError(data.message)
//       } else {
//         dispatch(updateSuccess(data))
//         setUpdateUserSuccess("Profile updated successfully")
//       }
//     } catch (error) {
//       dispatch(updateFailure(error.message))
//       setUpdateUserError(error.message)
//     }
//   }

//   const handleDeleteUser = async () => {
//     setShowModal(false)
//     try {
//       dispatch(deleteUserStart())
//       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//         method: "DELETE",
//       })
//       const data = await res.json()

//       if (!res.ok) {
//         dispatch(deleteUserFailure(data.message))
//       } else {
//         dispatch(deleteUserSuccess(data))
//       }
//     } catch (error) {
//       dispatch(deleteUserFailure(error.message))
//     }
//   }

//   const handleSignout = async () => {
//     try {
//       const res = await fetch("/api/user/signout", { method: "POST" })
//       const data = await res.json()

//       if (!res.ok) {
//         console.log(data.message)
//       } else {
//         dispatch(signoutSuccess())
//       }
//     } catch (error) {
//       console.log(error.message)
//     }
//   }

//   return (
//     <div className='h-25 max-w-lg mx-auto p-3 w-full'>  
//       <style dangerouslySetInnerHTML={{ __html: customStyles }} />
//      <div className="mx-auto w-full  max-w-4xl px-6 h-full">
//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
//           <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
//         </div>

//         {/* Main Profile Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
//           {/* Profile Picture Section */}
//           <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-12">
//             <div className="flex flex-col items-center">
//               <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />

//               <div className="relative group">
//                 <div
//                   className="relative w-32 h-32 cursor-pointer overflow-hidden rounded-full ring-4 ring-white shadow-xl transition-transform duration-300 group-hover:scale-105"
//                   onClick={() => filePickerRef.current.click()}
//                 >
//                   {imageFileUploadProgress && (
//                     <CircularProgressbar
//                       value={imageFileUploadProgress || 0}
//                       text={`${imageFileUploadProgress}%`}
//                       strokeWidth={5}
//                       styles={{
//                         root: {
//                           width: "100%",
//                           height: "100%",
//                           position: "absolute",
//                           top: 0,
//                           left: 0,
//                           zIndex: 10,
//                         },
//                         path: {
//                           stroke: `rgba(239, 68, 68, ${imageFileUploadProgress / 100})`,
//                         },
//                         text: {
//                           fill: "white",
//                           fontSize: "16px",
//                           fontWeight: "bold",
//                         },
//                       }}
//                     />
//                   )}
//                   <img
//                     src={imageFileUrl || currentUser.profilePicture}
//                     alt="Profile"
//                     className={`w-full h-full object-cover ${
//                       imageFileUploadProgress && imageFileUploadProgress < 100 && "opacity-60"
//                     }`}
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
//                     <HiCamera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-4 text-center">
//                 <h2 className="text-xl font-semibold text-white">{currentUser.username}</h2>
//                 <p className="text-red-100">{currentUser.email}</p>
//                 {currentUser.isAdmin && (
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 bg-opacity-90 text-red-800 mt-2">
//                     Administrator
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Form Section */}
//           <div className="p-8">
//             {imageFileUploadError && (
//               <Alert color="failure" className="mb-6">
//                 {imageFileUploadError}
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid gap-6">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                     <HiUser className="w-4 h-4" />
//                     Username
//                   </label>
//                   <TextInput
//                     type="text"
//                     id="username"
//                     placeholder="Enter your username"
//                     defaultValue={currentUser.username}
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                     <HiMail className="w-4 h-4" />
//                     Email Address
//                   </label>
//                   <TextInput
//                     type="email"
//                     id="email"
//                     placeholder="Enter your email"
//                     defaultValue={currentUser.email}
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                     <HiLockClosed className="w-4 h-4" />
//                     New Password
//                   </label>
//                   <TextInput
//                     type="password"
//                     id="password"
//                     placeholder="Enter new password (optional)"
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-4 pt-4">
//                 <Button
//                   type="submit"
//                   gradientDuoTone="pinkToOrange"
//                   size="lg"
//                   disabled={loading || imageFileUploading}
//                   className="w-full"
//                 >
//                   {loading ? "Updating..." : "Update Profile"}
//                 </Button>

//                 {currentUser.isAdmin && (
//                   <Link to="/create-post" className="w-full">
//                     <Button type="button" gradientDuoTone="redToYellow" size="lg" className="w-full">
//                       Create New Post
//                     </Button>
//                   </Link>
//                 )}
//               </div>
//             </form>

//             {/* Action Links */}
//             <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors duration-200"
//               >
//                 Delete Account
//               </button>
//               <button
//                 onClick={handleSignout}
//                 className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium transition-colors duration-200"
//               >
//                 Sign Out
//               </button>
//             </div>

//             {/* Status Messages */}
//             <div className="mt-6 space-y-4">
//               {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}
//               {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
//               {error && <Alert color="failure">{error}</Alert>}
//             </div>
//           </div>
//         </div>

//         {/* Delete Confirmation Modal */}
//         <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
//           <Modal.Header />
//           <Modal.Body>
//             <div className="text-center p-6">
//               <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-6">
//                 <HiOutlineExclamationCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
//               </div>
//               <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Delete Account</h3>
//               <p className="mb-6 text-gray-600 dark:text-gray-400">
//                 Are you sure you want to delete your account? This action cannot be undone and all your data will be
//                 permanently removed.
//               </p>
//               <div className="flex justify-center gap-4">
//                 <Button color="failure" onClick={handleDeleteUser}>
//                   Yes, Delete Account
//                 </Button>
//                 <Button color="gray" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </Modal.Body>
//         </Modal>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { Alert, Button, Modal, TextInput } from "flowbite-react"
// import { useEffect, useRef, useState } from "react"
// import { useSelector, useDispatch } from "react-redux"
// import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
// import { app } from "../firebase"
// import { CircularProgressbar } from "react-circular-progressbar"
// import "react-circular-progressbar/dist/styles.css"
// import {
//   updateStart,
//   updateSuccess,
//   updateFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   deleteUserFailure,
//   signoutSuccess,
// } from "../redux/user/userSlice"
// import { HiOutlineExclamationCircle, HiCamera, HiUser, HiMail, HiLockClosed } from "react-icons/hi"
// import { Link } from "react-router-dom"

// const customStyles = `
//   .flowbite-button[data-testid="flowbite-button"] {
//     border: none !important;
//     padding: 0.375rem 0.75rem !important;
//     font-size: 0.875rem !important;
//   }
//   .flowbite-textinput input {
//     padding: 0.375rem 0.75rem !important;
//     font-size: 0.875rem !important;
//   }
//   .flowbite-textinput input:focus {
//     border-color: #ef4444 !important;
//     box-shadow: 0 0 0 1px #ef4444 !important;
//   }
//   .flowbite-alert[data-testid="flowbite-alert"] {
//     background-color: #fef2f2 !important;
//     border-color: #fecaca !important;
//     color: #991b1b !important;
//     padding: 0.5rem !important;
//     font-size: 0.875rem !important;
//   }
// `

// export default function DashProfile() {
//   const { currentUser, error, loading } = useSelector((state) => state.user)
//   const dispatch = useDispatch()
//   const filePickerRef = useRef()

//   // Image upload states
//   const [imageFile, setImageFile] = useState(null)
//   const [imageFileUrl, setImageFileUrl] = useState(null)
//   const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
//   const [imageFileUploadError, setImageFileUploadError] = useState(null)
//   const [imageFileUploading, setImageFileUploading] = useState(false)

//   // Form states
//   const [formData, setFormData] = useState({})
//   const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
//   const [updateUserError, setUpdateUserError] = useState(null)
//   const [showModal, setShowModal] = useState(false)

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setImageFile(file)
//       setImageFileUrl(URL.createObjectURL(file))
//     }
//   }

//   useEffect(() => {
//     if (imageFile) {
//       uploadImage()
//     }
//   }, [imageFile])

//   const uploadImage = async () => {
//     setImageFileUploading(true)
//     setImageFileUploadError(null)
//     const storage = getStorage(app)
//     const fileName = new Date().getTime() + imageFile.name
//     const storageRef = ref(storage, fileName)
//     const uploadTask = uploadBytesResumable(storageRef, imageFile)

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//         setImageFileUploadProgress(progress.toFixed(0))
//       },
//       (error) => {
//         setImageFileUploadError("Could not upload image (File must be less than 2MB)")
//         setImageFileUploadProgress(null)
//         setImageFile(null)
//         setImageFileUrl(null)
//         setImageFileUploading(false)
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           setImageFileUrl(downloadURL)
//           setFormData({ ...formData, profilePicture: downloadURL })
//           setImageFileUploading(false)
//         })
//       },
//     )
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setUpdateUserError(null)
//     setUpdateUserSuccess(null)

//     if (Object.keys(formData).length === 0) {
//       setUpdateUserError("No changes made")
//       return
//     }
//     if (imageFileUploading) {
//       setUpdateUserError("Please wait for image to upload")
//       return
//     }

//     try {
//       dispatch(updateStart())
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })
//       const data = await res.json()

//       if (!res.ok) {
//         dispatch(updateFailure(data.message))
//         setUpdateUserError(data.message)
//       } else {
//         dispatch(updateSuccess(data))
//         setUpdateUserSuccess("Profile updated successfully")
//       }
//     } catch (error) {
//       dispatch(updateFailure(error.message))
//       setUpdateUserError(error.message)
//     }
//   }

//   const handleDeleteUser = async () => {
//     setShowModal(false)
//     try {
//       dispatch(deleteUserStart())
//       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//         method: "DELETE",
//       })
//       const data = await res.json()

//       if (!res.ok) {
//         dispatch(deleteUserFailure(data.message))
//       } else {
//         dispatch(deleteUserSuccess(data))
//       }
//     } catch (error) {
//       dispatch(deleteUserFailure(error.message))
//     }
//   }

//   const handleSignout = async () => {
//     try {
//       const res = await fetch("/api/user/signout", { method: "POST" })
//       const data = await res.json()

//       if (!res.ok) {
//         console.log(data.message)
//       } else {
//         dispatch(signoutSuccess())
//       }
//     } catch (error) {
//       console.log(error.message)
//     }
//   }

//   return (
//      <div className='max-w-lg mx-auto p-3 w-full'>
//       <style dangerouslySetInnerHTML={{ __html: customStyles }} />
//       <div className="max-w-md mx-auto px-3">
//         {/* Header Section */}
//         <div className="text-center mb-3">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Profile</h1>
//           <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account</p>
//         </div>

//         {/* Main Profile Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
//           {/* Profile Picture Section */}
//           <div className="bg-gray-400 px-4 py-3">
//             <div className="flex flex-col items-center">
//               <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />

//               <div className="relative group">
//                 <div
//                   className="relative w-16 h-16 cursor-pointer overflow-hidden rounded-full ring-2 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105"
//                   onClick={() => filePickerRef.current.click()}
//                 >
//                   {imageFileUploadProgress && (
//                     <CircularProgressbar
//                       value={imageFileUploadProgress || 0}
//                       text={`${imageFileUploadProgress}%`}
//                       strokeWidth={6}
//                       styles={{
//                         root: {
//                           width: "100%",
//                           height: "100%",
//                           position: "absolute",
//                           top: 0,
//                           left: 0,
//                           zIndex: 10,
//                         },
//                         path: {
//                           stroke: `rgba(239, 68, 68, ${imageFileUploadProgress / 100})`,
//                         },
//                         text: {
//                           fill: "white",
//                           fontSize: "14px",
//                           fontWeight: "bold",
//                         },
//                       }}
//                     />
//                   )}
//                   <img
//                     src={imageFileUrl || currentUser.profilePicture}
//                     alt="Profile"
//                     className={`w-full h-full object-cover ${
//                       imageFileUploadProgress && imageFileUploadProgress < 100 && "opacity-60"
//                     }`}
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
//                     <HiCamera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-2 text-center">
//                 <h2 className="text-lg font-semibold text-white">{currentUser.username}</h2>
//                 <p className="text-sm text-red-100">{currentUser.email}</p>
//                 {currentUser.isAdmin && (
//                   <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 bg-opacity-90 text-red-800 mt-1">
//                     Admin
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Form Section */}
//           <div className="p-3">
//             {imageFileUploadError && (
//               <Alert color="failure" className="mb-3">
//                 {imageFileUploadError}
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-2">
//               <div className="grid gap-3">
//                 <div className="space-y-1">
//                   <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
//                     <HiUser className="w-3 h-3" />
//                     Username
//                   </label>
//                   <TextInput
//                     type="text"
//                     id="username"
//                     placeholder="Enter your username"
//                     defaultValue={currentUser.username}
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                     size="sm"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
//                     <HiMail className="w-3 h-3" />
//                     Email
//                   </label>
//                   <TextInput
//                     type="email"
//                     id="email"
//                     placeholder="Enter your email"
//                     defaultValue={currentUser.email}
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                     size="sm"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
//                     <HiLockClosed className="w-3 h-3" />
//                     Password
//                   </label>
//                   <TextInput
//                     type="password"
//                     id="password"
//                     placeholder="New password (optional)"
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                     size="sm"
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2 pt-2">
//                 <Button
//                   type="submit"
//                   color="failure"
//                   size="sm"
//                   disabled={loading || imageFileUploading}
//                   className="w-full"
//                 >
//                   {loading ? "Updating..." : "Update"}
//                 </Button>

                
//               </div>
//             </form>

//             {/* Action Links */}
//             <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors duration-200"
//               >
//                 Delete Account
//               </button>
              
//             </div>

//             {/* Status Messages */}
//             <div className="mt-3 space-y-2">
//               {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}
//               {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
//               {error && <Alert color="failure">{error}</Alert>}
//             </div>
//           </div>
//         </div>

//         {/* Delete Confirmation Modal */}
//         <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
//           <Modal.Header />
//           <Modal.Body>
//             <div className="text-center p-4">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
//                 <HiOutlineExclamationCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
//               </div>
//               <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Delete Account</h3>
//               <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
//                 Are you sure you want to delete your account? This action cannot be undone.
//               </p>
//               <div className="flex justify-center gap-3">
//                 <Button color="failure" size="sm" onClick={handleDeleteUser}>
//                   Yes, Delete
//                 </Button>
//                 <Button color="gray" size="sm" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </Modal.Body>
//         </Modal>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { Alert, Button, Modal, TextInput } from "flowbite-react"
// import { useState, useRef } from "react"
// import { useSelector, useDispatch } from "react-redux"
// import {
//   updateStart,
//   updateSuccess,
//   updateFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   deleteUserFailure,
//   signoutSuccess,
// } from "../redux/user/userSlice"
// import {
//   HiOutlineExclamationCircle,
//   HiCamera,
//   HiUser,
//   HiMail,
//   HiLockClosed,
// } from "react-icons/hi"
// import { Toaster, toast } from "react-hot-toast"

// const customStyles = `
//   /* your existing styles here */
// `

// export default function DashProfile() {
//   const { currentUser, error, loading } = useSelector((state) => state.user)
//   const dispatch = useDispatch()
//   const filePickerRef = useRef()

//   // States for base64 image
//   const [imageBase64, setImageBase64] = useState(currentUser.profilePicture || "")
//   const [imageLoading, setImageLoading] = useState(false)
//   const [imageError, setImageError] = useState(null)

//   const [formData, setFormData] = useState({})
//   const [showModal, setShowModal] = useState(false)

//   // Convert file to base64 string
//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         const errMsg = "File too large! Max size is 2MB."
//         setImageError(errMsg)
//         toast.error(errMsg)
//         return
//       }

//       const reader = new FileReader()
//       reader.onloadstart = () => {
//         setImageLoading(true)
//         setImageError(null)
//       }
//       reader.onload = () => {
//         setImageBase64(reader.result)
//         setFormData({ ...formData, profilePicture: reader.result })
//         setImageLoading(false)
//         toast.success("Image ready for upload")
//       }
//       reader.onerror = () => {
//         const errMsg = "Failed to read file!"
//         setImageError(errMsg)
//         setImageLoading(false)
//         toast.error(errMsg)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     // If no changes, show error
//     if (Object.keys(formData).length === 0) {
//       toast.error("No changes made")
//       return
//     }

//     if (imageLoading) {
//       toast.error("Please wait for the image to finish loading")
//       return
//     }

//     try {
//       dispatch(updateStart())
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })

//       const data = await res.json()
//       if (!res.ok) {
//         dispatch(updateFailure(data.message))
//         toast.error(data.message)
//       } else {
//         dispatch(updateSuccess(data))
//         toast.success("Profile updated successfully")
//       }
//     } catch (error) {
//       dispatch(updateFailure(error.message))
//       toast.error(error.message)
//     }
//   }

//   const handleDeleteUser = async () => {
//     setShowModal(false)
//     try {
//       dispatch(deleteUserStart())
//       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//         method: "DELETE",
//       })
//       const data = await res.json()
//       if (!res.ok) {
//         dispatch(deleteUserFailure(data.message))
//         toast.error(data.message)
//       } else {
//         dispatch(deleteUserSuccess(data))
//         toast.success("Account deleted successfully")
//       }
//     } catch (error) {
//       dispatch(deleteUserFailure(error.message))
//       toast.error(error.message)
//     }
//   }

//   const handleSignout = async () => {
//     try {
//       const res = await fetch("/api/user/signout", { method: "POST" })
//       const data = await res.json()
//       if (!res.ok) {
//         toast.error(data.message)
//       } else {
//         dispatch(signoutSuccess())
//         toast.success("Signed out successfully")
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   return (
//     <div className="max-w-lg mx-auto p-3 w-full">
//       <style dangerouslySetInnerHTML={{ __html: customStyles }} />
//       <Toaster position="top-right" />
//       <div className="max-w-md mx-auto px-3">
//         {/* Profile Picture Section */}
//         <div className="bg-gray-400 px-4 py-3">
//           <div className="flex flex-col items-center">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               ref={filePickerRef}
//               hidden
//             />

//             <div
//               className="relative group cursor-pointer"
//               onClick={() => filePickerRef.current.click()}
//             >
//               <div className="relative w-16 h-16 overflow-hidden rounded-full ring-2 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105">
//                 {imageLoading && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10 text-white font-bold">
//                     Loading...
//                   </div>
//                 )}
//                 <img
//                   src={imageBase64 || currentUser.profilePicture}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
//                   <HiCamera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </div>
//               </div>
//             </div>

//             {imageError && (
//               <Alert color="failure" className="mt-2">
//                 {imageError}
//               </Alert>
//             )}

//             <div className="mt-2 text-center">
//               <h2 className="text-lg font-semibold text-white">{currentUser.username}</h2>
//               <p className="text-sm text-red-100">{currentUser.email}</p>
//               {currentUser.isAdmin && (
//                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 bg-opacity-90 text-red-800 mt-1">
//                   Admin
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Form Section */}
//         <form onSubmit={handleSubmit} className="space-y-2 p-3 bg-white rounded-xl shadow-lg">
//           <div className="grid gap-3">
//             <div className="space-y-1">
//               <label
//                 htmlFor="username"
//                 className="text-xs font-medium text-gray-700 flex items-center gap-1"
//               >
//                 <HiUser className="w-3 h-3" />
//                 Username
//               </label>
//               <TextInput
//                 type="text"
//                 id="username"
//                 placeholder="Enter your username"
//                 defaultValue={currentUser.username}
//                 onChange={handleChange}
//                 size="sm"
//               />
//             </div>

//             <div className="space-y-1">
//               <label
//                 htmlFor="email"
//                 className="text-xs font-medium text-gray-700 flex items-center gap-1"
//               >
//                 <HiMail className="w-3 h-3" />
//                 Email
//               </label>
//               <TextInput
//                 type="email"
//                 id="email"
//                 placeholder="Enter your email"
//                 defaultValue={currentUser.email}
//                 onChange={handleChange}
//                 size="sm"
//               />
//             </div>

//             <div className="space-y-1">
//               <label
//                 htmlFor="password"
//                 className="text-xs font-medium text-gray-700 flex items-center gap-1"
//               >
//                 <HiLockClosed className="w-3 h-3" />
//                 Password
//               </label>
//               <TextInput
//                 type="password"
//                 id="password"
//                 placeholder="New password (optional)"
//                 onChange={handleChange}
//                 size="sm"
//               />
//             </div>
//           </div>

//           <Button
//             type="submit"
//             color="failure"
//             size="sm"
//             disabled={loading || imageLoading}
//             className="w-full mt-3"
//           >
//             {loading ? "Updating..." : "Update"}
//           </Button>
//         </form>

//         {/* Delete account */}
//         <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
//           <button
//             onClick={() => setShowModal(true)}
//             className="text-xs text-red-600 hover:text-red-700 font-medium"
//           >
//             Delete Account
//           </button>
//         </div>

//         {/* Delete confirmation modal */}
//         <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
//           <Modal.Header />
//           <Modal.Body>
//             <div className="text-center p-4">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//                 <HiOutlineExclamationCircle className="h-6 w-6 text-red-600" />
//               </div>
//               <h3 className="mb-4 text-base font-semibold text-gray-900">Delete Account</h3>
//               <p className="mb-4 text-sm text-gray-600">
//                 Are you sure you want to delete your account? This action cannot be undone.
//               </p>
//               <div className="flex justify-center gap-3">
//                 <Button color="failure" size="sm" onClick={handleDeleteUser}>
//                   Yes, Delete
//                 </Button>
//                 <Button color="gray" size="sm" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </Modal.Body>
//         </Modal>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { Alert, Button, Modal, TextInput } from "flowbite-react"
// import { useEffect, useRef, useState } from "react"
// import { useSelector, useDispatch } from "react-redux"
// import {
//   updateStart,
//   updateSuccess,
//   updateFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   deleteUserFailure,
//   signoutSuccess,
// } from "../redux/user/userSlice"
// import { CircularProgressbar } from "react-circular-progressbar"
// import "react-circular-progressbar/dist/styles.css"
// import { HiOutlineExclamationCircle, HiCamera, HiUser, HiMail, HiLockClosed } from "react-icons/hi"
// import { Link } from "react-router-dom"

// const customStyles = `
//   .flowbite-button[data-testid="flowbite-button"] {
//     border: none !important;
//     padding: 0.375rem 0.75rem !important;
//     font-size: 0.875rem !important;
//   }
//   .flowbite-textinput input {
//     padding: 0.375rem 0.75rem !important;
//     font-size: 0.875rem !important;
//   }
//   .flowbite-textinput input:focus {
//     border-color: #ef4444 !important;
//     box-shadow: 0 0 0 1px #ef4444 !important;
//   }
//   .flowbite-alert[data-testid="flowbite-alert"] {
//     background-color: #fef2f2 !important;
//     border-color: #fecaca !important;
//     color: #991b1b !important;
//     padding: 0.5rem !important;
//     font-size: 0.875rem !important;
//   }
// `

// export default function DashProfile() {
//   const { currentUser, error, loading } = useSelector((state) => state.user)
//   const dispatch = useDispatch()
//   const filePickerRef = useRef()

//   // States for base64 image preview & upload progress simulation
//   const [imageBase64, setImageBase64] = useState(null)
//   const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
//   const [imageFileUploading, setImageFileUploading] = useState(false)
//   const [imageFileUploadError, setImageFileUploadError] = useState(null)

//   // Form data and status messages
//   const [formData, setFormData] = useState({})
//   const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
//   const [updateUserError, setUpdateUserError] = useState(null)
//   const [showModal, setShowModal] = useState(false)

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       // Reset previous errors
//       setImageFileUploadError(null)
//       // Check file size (optional) - example: 2MB limit
//       if (file.size > 2 * 1024 * 1024) {
//         setImageFileUploadError("Could not upload image (File must be less than 2MB)")
//         return
//       }
//       setImageFileUploading(true)
//       setImageFileUploadProgress(0)

//       const reader = new FileReader()
//       reader.onloadstart = () => {
//         setImageFileUploadProgress(10)
//       }
//       reader.onprogress = (event) => {
//         if (event.lengthComputable) {
//           const progress = Math.round((event.loaded / event.total) * 100)
//           setImageFileUploadProgress(progress)
//         }
//       }
//       reader.onload = () => {
//         const base64String = reader.result // This is your base64 string with prefix
//         setImageBase64(base64String)
//         setFormData({ ...formData, profilePicture: base64String })
//         setImageFileUploadProgress(100)
//         setImageFileUploading(false)
//       }
//       reader.onerror = () => {
//         setImageFileUploadError("Failed to read file")
//         setImageFileUploading(false)
//         setImageFileUploadProgress(null)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setUpdateUserError(null)
//     setUpdateUserSuccess(null)

//     if (Object.keys(formData).length === 0) {
//       setUpdateUserError("No changes made")
//       return
//     }
//     if (imageFileUploading) {
//       setUpdateUserError("Please wait for image to finish uploading")
//       return
//     }

//     try {
//       dispatch(updateStart())
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })
//       const data = await res.json()

//       if (!res.ok) {
//         dispatch(updateFailure(data.message))
//         setUpdateUserError(data.message)
//       } else {
//         dispatch(updateSuccess(data))
//         setUpdateUserSuccess("Profile updated successfully")
//       }
//     } catch (error) {
//       dispatch(updateFailure(error.message))
//       setUpdateUserError(error.message)
//     }
//   }

//   const handleDeleteUser = async () => {
//     setShowModal(false)
//     try {
//       dispatch(deleteUserStart())
//       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//         method: "DELETE",
//       })
//       const data = await res.json()

//       if (!res.ok) {
//         dispatch(deleteUserFailure(data.message))
//       } else {
//         dispatch(deleteUserSuccess(data))
//       }
//     } catch (error) {
//       dispatch(deleteUserFailure(error.message))
//     }
//   }

//   const handleSignout = async () => {
//     try {
//       const res = await fetch("/api/user/signout", { method: "POST" })
//       const data = await res.json()

//       if (!res.ok) {
//         console.log(data.message)
//       } else {
//         dispatch(signoutSuccess())
//       }
//     } catch (error) {
//       console.log(error.message)
//     }
//   }

//   return (
//     <div className="max-w-lg mx-auto p-3 w-full">
//       <style dangerouslySetInnerHTML={{ __html: customStyles }} />
//       <div className="max-w-md mx-auto px-3">
//         {/* Header Section */}
//         <div className="text-center mb-3">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Profile</h1>
//           <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account</p>
//         </div>

//         {/* Main Profile Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
//           {/* Profile Picture Section */}
//           <div className="bg-gray-400 px-4 py-3">
//             <div className="flex flex-col items-center">
//               <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />

//               <div className="relative group">
//                 <div
//                   className="relative w-16 h-16 cursor-pointer overflow-hidden rounded-full ring-2 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105"
//                   onClick={() => filePickerRef.current.click()}
//                 >
//                   {imageFileUploadProgress && (
//                     <CircularProgressbar
//                       value={imageFileUploadProgress || 0}
//                       text={`${imageFileUploadProgress}%`}
//                       strokeWidth={6}
//                       styles={{
//                         root: {
//                           width: "100%",
//                           height: "100%",
//                           position: "absolute",
//                           top: 0,
//                           left: 0,
//                           zIndex: 10,
//                         },
//                         path: {
//                           stroke: `rgba(239, 68, 68, ${imageFileUploadProgress / 100})`,
//                         },
//                         text: {
//                           fill: "white",
//                           fontSize: "14px",
//                           fontWeight: "bold",
//                         },
//                       }}
//                     />
//                   )}
//                   <img
//                     src={imageBase64 || currentUser.profilePicture}
//                     alt="Profile"
//                     className={`w-full h-full object-cover ${
//                       imageFileUploadProgress && imageFileUploadProgress < 100 && "opacity-60"
//                     }`}
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
//                     <HiCamera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-2 text-center">
//                 <h2 className="text-lg font-semibold text-white">{currentUser.username}</h2>
//                 <p className="text-sm text-red-100">{currentUser.email}</p>
//                 {currentUser.isAdmin && (
//                   <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 bg-opacity-90 text-red-800 mt-1">
//                     Admin
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Form Section */}
//           <div className="p-3">
//             {imageFileUploadError && (
//               <Alert color="failure" className="mb-3">
//                 {imageFileUploadError}
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-2">
//               <div className="grid gap-3">
//                 <div className="space-y-1">
//                   <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
//                     <HiUser className="w-3 h-3" />
//                     Username
//                   </label>
//                   <TextInput
//                     type="text"
//                     id="username"
//                     placeholder="Enter your username"
//                     defaultValue={currentUser.username}
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                     size="sm"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
//                     <HiMail className="w-3 h-3" />
//                     Email
//                   </label>
//                   <TextInput
//                     type="email"
//                     id="email"
//                     placeholder="Enter your email"
//                     defaultValue={currentUser.email}
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                     size="sm"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
//                     <HiLockClosed className="w-3 h-3" />
//                     Password
//                   </label>
//                   <TextInput
//                     type="password"
//                     id="password"
//                     placeholder="New password (optional)"
//                     onChange={handleChange}
//                     className="transition-all duration-200"
//                     size="sm"
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2 pt-2">
//                 <Button
//                   type="submit"
//                   color="failure"
//                   size="sm"
//                   disabled={loading || imageFileUploading}
//                   className="w-full"
//                 >
//                   {loading ? "Updating..." : "Update"}
//                 </Button>
//               </div>
//             </form>

//             {/* Action Links */}
//             <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors duration-200"
//               >
//                 Delete Account
//               </button>
//             </div>

//             {/* Status Messages */}
//             <div className="mt-3 space-y-2">
//               {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}
//               {updateUserError && <Alert color="failure">{updateUserError}</Alert>}
//             </div>
//           </div>
//         </div>

//         {/* Delete Confirmation Modal */}
//         <Modal show={showModal} onClose={() => setShowModal(false)}>
//           <Modal.Header>Confirm Delete</Modal.Header>
//           <Modal.Body>
//             <p>Are you sure you want to delete your account? This action cannot be undone.</p>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button color="gray" onClick={() => setShowModal(false)}>
//               Cancel
//             </Button>
//             <Button color="failure" onClick={handleDeleteUser}>
//               Delete
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </div>
//     </div>
//   )
// }
"use client"

import { Button, Modal, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice"
import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { HiOutlineExclamationCircle, HiCamera, HiUser, HiMail, HiLockClosed } from "react-icons/hi"
import { Link } from "react-router-dom"
import { toast, Toaster } from "react-hot-toast"

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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB")
        return
      }

      setImageFileUploading(true)
      setImageFileUploadProgress(0)

      const reader = new FileReader()
      reader.onloadstart = () => setImageFileUploadProgress(10)
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setImageFileUploadProgress(progress)
        }
      }
      reader.onload = () => {
        const base64String = reader.result
        setImageBase64(base64String)
        setFormData({ ...formData, profilePicture: base64String })
        setImageFileUploadProgress(100)
        setImageFileUploading(false)
      }
      reader.onerror = () => {
        toast.error("Failed to read image file")
        setImageFileUploading(false)
        setImageFileUploadProgress(null)
      }
      reader.readAsDataURL(file)
    }
  }

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
                    src={imageBase64 || currentUser.profilePicture}
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
