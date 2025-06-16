// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// // import toast from 'react-hot-toast';

// export default function ShowPosts() {
//   const { currentUser } = useSelector((state) => state.user);
//   const [userPosts, setUserPosts] = useState([]);

//   useEffect(() => {
//     const fetchUserPosts = async () => {
//       try {
//         const res = await fetch(`/api/user/posts/${currentUser._id}`);
//         const data = await res.json();
//         if (data.success === false) {
//           toast.error('Failed to fetch posts.');
//           return;
//         }
//         setUserPosts(data);
//       } catch (err) {
//         toast.error('Something went wrong.');
//       }
//     };

//     fetchUserPosts();
//   }, [currentUser._id]);

//   const handlePostDelete = async (postId) => {
//     try {
//       const res = await fetch(`/api/post/delete/${postId}`, {
//         method: 'DELETE',
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         toast.error(data.message);
//         return;
//       }
//       setUserPosts((prev) => prev.filter((post) => post._id !== postId));
//       toast.success('Post deleted successfully!');
//     } catch (err) {
//       toast.error('Failed to delete post.');
//     }
//   };

//   return (
//     <div className="p-0 w-[600px] mx-auto">
//       <h1 className="text-center text-2xl font-semibold my-4">Your Posts</h1>

//       {userPosts.length > 0 ? (
//         userPosts.map((post) => (
//           <div
//             key={post._id}
//             className="border rounded-lg p-3 flex justify-between items-center gap-4"
//           >
//             <Link to={`/post/${post._id}`}>
//               <img
//                 src={post.imageUrls?.[0] || '/placeholder.jpg'}
//                 alt="Post cover"
//                 className="h-16 w-16 object-contain"
//               />
//             </Link>
//             <Link
//               to={`/post/${post._id}`}
//               className="text-slate-700 font-semibold hover:underline truncate flex-1"
//             >
//               <p>{post.title}</p>
//             </Link>
//             <div className="flex flex-col items-center">
//               <button
//                 onClick={() => handlePostDelete(post._id)}
//                 className="text-red-700 uppercase mb-1"
//               >
//                 Delete
//               </button>
//               <Link to={`/update-post/${post._id}`}>
//                 <button className="text-green-700 uppercase">Edit</button>
//               </Link>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-center">No posts available.</p>
//       )}
//     </div>
//   );
// }
// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';

// export default function ShowPosts() {
//   const { currentUser } = useSelector((state) => state.user);
//   const [userPosts, setUserPosts] = useState([]);

//   useEffect(() => {
//     const fetchUserPosts = async () => {
//       try {
//         const res = await fetch(`/api/post/posts/${currentUser._id}`);
//         const data = await res.json();
//         if (data.success === false) {
//           console.error('Failed to fetch posts.');
//           return;
//         }
//         setUserPosts(data);
//       } catch (err) {
//         console.error('Something went wrong while fetching posts.');
//       }
//     };

//     fetchUserPosts();
//   }, [currentUser._id]);

//   const handlePostDelete = async (postId) => {
//     try {
//       const res = await fetch(`/api/post/deletepost/${postId}/${currentUser._id}`, {

//         method: 'DELETE',
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         console.error(data.message);
//         return;
//       }
//       setUserPosts((prev) => prev.filter((post) => post._id !== postId));
//       console.log('Post deleted successfully!');
//     } catch (err) {
//       console.error('Failed to delete post.');
//     }
//   };

//   return (
//     <div className="p-0 w-[600px] mx-auto">
//       <h1 className="text-center text-2xl font-semibold my-4">Your Posts</h1>

//       {userPosts.length > 0 ? (
//         userPosts.map((post) => (
//           <div
//             key={post._id}
//             className="border rounded-lg p-3 flex justify-between items-center gap-4"
//           >
//             <Link to={`/post/${post._id}`}>
//               <img
//                 src={post.images || '/placeholder.jpg'}
//                 alt="Post cover"
//                 className="h-16 w-16 object-contain"
//               />
//             </Link>
//             <Link
//               to={`/post/${post._id}`}
//               className="text-slate-700 font-semibold hover:underline truncate flex-1"
//             >
//               <p>{post.title}</p>
//             </Link>
//             <div className="flex flex-col items-center">
//               <button
//                 onClick={() => handlePostDelete(post._id)}
//                 className="text-red-700 uppercase mb-1"
//               >
//                 Delete
//               </button>
//               <Link to={`/update-post/${post._id}`}>
//                 <button className="text-green-700 uppercase">Edit</button>
//               </Link>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-center">No posts available.</p>
//       )}
//     </div>
//   );
// }
// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { Modal, Button } from 'flowbite-react';
// import { HiOutlineExclamationCircle } from 'react-icons/hi';

// export default function ShowPosts() {
//   const { currentUser } = useSelector((state) => state.user);
//   const [userPosts, setUserPosts] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [postIdToDelete, setPostIdToDelete] = useState(null);

//   useEffect(() => {
//     const fetchUserPosts = async () => {
//       try {
//         const res = await fetch(`/api/post/posts/${currentUser._id}`);
//         const data = await res.json();
//         if (data.success === false) {
//           console.error('Failed to fetch posts.');
//           return;
//         }
//         setUserPosts(data);
//       } catch (err) {
//         console.error('Something went wrong while fetching posts.');
//       }
//     };

//     fetchUserPosts();
//   }, [currentUser._id]);

//   const handleDeleteConfirm = async () => {
//     try {
//       setShowModal(false);
//       const res = await fetch(
//         `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
//         {
//           method: 'DELETE',
//         }
//       );
//       const data = await res.json();
//       if (data.success === false) {
//         console.error(data.message);
//         return;
//       }
//       setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
//       console.log('Post deleted successfully!');
//     } catch (err) {
//       console.error('Failed to delete post.');
//     }
//   };

//   return (
//     <div className="p-0 w-[600px] mx-auto">
//       <h1 className="text-center text-2xl font-semibold my-4">Your Posts</h1>

//       {userPosts.length > 0 ? (
//         userPosts.map((post) => (
//           <div
//             key={post._id}
//             className="border rounded-lg p-3 flex justify-between items-center gap-4 mb-2"
//           >
//             <Link to={`/post/${post._id}`}>
//               <img
//                 src={post.images || '/placeholder.jpg'}
//                 alt="Post cover"
//                 className="h-16 w-16 object-contain"
//               />
//             </Link>
//             <Link
//               to={`/post/${post._id}`}
//               className="text-slate-700 font-semibold hover:underline truncate flex-1"
//             >
//               <p>{post.title}</p>
//             </Link>
//             <div className="flex flex-col items-center">
//               <button
//                 onClick={() => {
//                   setShowModal(true);
//                   setPostIdToDelete(post._id);
//                 }}
//                 className="text-red-700 uppercase mb-1"
//               >
//                 Delete
//               </button>
//               <Link to={`/update-post/${post._id}`}>
//                 <button className="text-green-700 uppercase">Edit</button>
//               </Link>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-center">No posts available.</p>
//       )}

//       {/* Delete Confirmation Modal */}
//       <Modal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         popup
//         size="md"
//       >
//         <Modal.Header />
//         <Modal.Body>
//           <div className="text-center">
//             <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
//             <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
//               Are you sure you want to delete this post?
//             </h3>
//             <div className="flex justify-center gap-4">
//               <Button color="failure" onClick={handleDeleteConfirm}>
//                 Yes, delete it
//               </Button>
//               <Button color="gray" onClick={() => setShowModal(false)}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

export default function ShowPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await fetch(`/api/post/posts/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          toast.error('Failed to fetch posts.');
          return;
        }
        setUserPosts(data);
      } catch (err) {
        toast.error('Something went wrong while fetching posts.');
      }
    };

    if (currentUser?._id) {
      fetchUserPosts();
    }
  }, [currentUser?._id]);

  const handleDeleteConfirm = async () => {
    try {
      setShowModal(false);
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message || 'Failed to delete post.');
        return;
      }
      setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      toast.success('Post deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete post.');
    }
  };

  return (
    <div className="p-0 w-[600px] mx-auto">
      {/* React Hot Toast container */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <h1 className="text-center text-2xl font-semibold my-4">Your Posts</h1>

      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <div
            key={post._id}
            className="border rounded-lg p-3 flex justify-between items-center gap-4 mb-2"
          >
            <Link to={`/post/${post._id}`}>
              <img
                src={post.images || '/placeholder.jpg'}
                alt="Post cover"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link
              to={`/post/${post._id}`}
              className="text-slate-700 font-semibold hover:underline truncate flex-1"
            >
              <p>{post.title}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  setShowModal(true);
                  setPostIdToDelete(post._id);
                }}
                className="text-red-700 uppercase mb-1"
              >
                Delete
              </button>
              <Link to={`/update-post/${post._id}`}>
                <button className="text-green-700 uppercase">Edit</button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No posts available.</p>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteConfirm}>
                Yes, delete it
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
