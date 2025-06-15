// import { Alert, Button, Modal, TextInput, Textarea } from 'flowbite-react';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import Comment from './Comment';
// import { HiOutlineExclamationCircle } from 'react-icons/hi';

// export default function CommentSection({ postId }) {
//   const { currentUser } = useSelector((state) => state.user);
//   const [comment, setComment] = useState('');
//   const [commentError, setCommentError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [commentToDelete, setCommentToDelete] = useState(null);
//   const navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (comment.length > 200) {
//       return;
//     }
//     try {
//       const res = await fetch('/api/comment/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           content: comment,
//           postId,
//           userId: currentUser._id,
//         }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setComment('');
//         setCommentError(null);
//         setComments([data, ...comments]);
//       }
//     } catch (error) {
//       setCommentError(error.message);
//     }
//   };

//   useEffect(() => {
//     const getComments = async () => {
//       try {
//         const res = await fetch(`/api/comment/getPostComments/${postId}`);
//         if (res.ok) {
//           const data = await res.json();
//           setComments(data);
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };
//     getComments();
//   }, [postId]);

//   const handleLike = async (commentId) => {
//     try {
//       if (!currentUser) {
//         navigate('/sign-in');
//         return;
//       }
//       const res = await fetch(`/api/comment/likeComment/${commentId}`, {
//         method: 'PUT',
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setComments(
//           comments.map((comment) =>
//             comment._id === commentId
//               ? {
//                   ...comment,
//                   likes: data.likes,
//                   numberOfLikes: data.likes.length,
//                 }
//               : comment
//           )
//         );
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
//   const redTextareaTheme = {
//   base: "block w-full rounded-lg border text-sm disabled:cursor-not-allowed disabled:opacity-50",
//   colors: {
//     gray: "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-500",
//   },
// };


//   const handleEdit = async (comment, editedContent) => {
//     setComments(
//       comments.map((c) =>
//         c._id === comment._id ? { ...c, content: editedContent } : c
//       )
//     );
//   };

//   const handleDelete = async (commentId) => {
//     setShowModal(false);
//     try {
//       if (!currentUser) {
//         navigate('/sign-in');
//         return;
//       }
//       const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
//         method: 'DELETE',
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setComments(comments.filter((comment) => comment._id !== commentId));
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
//   return (
//     <div className='max-w-5xl mx-auto w-full p-3'>
//       {currentUser ? (
//         <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
//           <p>Signed in as:</p>
//           <img
//             className='h-5 w-5 object-cover rounded-full'
//             src={currentUser.profilePicture}
//             alt=''
//           />
//           <Link
//             to={'/dashboard?tab=profile'}
//             className='text-xs text-cyan-600 hover:underline'
//           >
//             @{currentUser.username}
//           </Link>
//         </div>
//       ) : (
//         <div className='text-sm text-teal-500 my-5 flex gap-1'>
//           You must be signed in to comment.
//           <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
//             Sign In
//           </Link>
//         </div>
//       )}
//       {currentUser && (
//         <form
//           onSubmit={handleSubmit}
//           className='border border-red-500 rounded-md p-3'
//         >
//          <Textarea
//   placeholder="Add a comment..."
//   rows={3}
//   maxLength={200}
//   onChange={(e) => setComment(e.target.value)}
//   value={comment}
//   theme={redTextareaTheme}
//   className='mb-2 dark:text-white dark:bg-gray-700 !border-red-300 !focus:ring-red-500 !focus:border-red-500'
//   color="gray"
// />
//           <div className='flex justify-between items-center mt-5'>
//             <p className='text-gray-500 text-xs'>
//               {200 - comment.length} characters remaining
//             </p>
//             <Button outline color='failure' type='submit'>
//               Submit
//             </Button>
//           </div>
//           {commentError && (
//             <Alert color='failure' className='mt-5'>
//               {commentError}
//             </Alert>
//           )}
//         </form>
//       )}
//       {comments.length === 0 ? (
//         <p className='text-sm my-5'>No comments yet!</p>
//       ) : (
//         <>
//           <div className='text-sm my-5 flex items-center gap-1'>
//             <p>Comments</p>
//             <div className='border border-gray-400 py-1 px-2 rounded-sm'>
//               <p>{comments.length}</p>
//             </div>
//           </div>
//           {comments.map((comment) => (
//             <Comment
//               key={comment._id}
//               comment={comment}
//               onLike={handleLike}
//               onEdit={handleEdit}
//               onDelete={(commentId) => {
//                 setShowModal(true);
//                 setCommentToDelete(commentId);
//               }}
//             />
//           ))}
//         </>
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
//               Are you sure you want to delete this comment?
//             </h3>
//             <div className='flex justify-center gap-4'>
//               <Button
//                 color='failure'
//                 onClick={() => handleDelete(commentToDelete)}
//               >
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
import { Button, Modal, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast, Toaster } from 'react-hot-toast';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const redTextareaTheme = {
    base: "block w-full rounded-lg border text-sm disabled:cursor-not-allowed disabled:opacity-50",
    colors: {
      gray: "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-500",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      toast.error('Comment must be 200 characters or less.');
      return;
    }
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setComments([data, ...comments]);
        toast.success('Comment added!');
      } else {
        toast.error(data.message || 'Failed to add comment.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add comment.');
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        toast.error('Failed to load comments.');
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      toast.error('Failed to like comment.');
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
        toast.success('Comment deleted!');
      } else {
        toast.error('Failed to delete comment.');
      }
    } catch (error) {
      toast.error('Failed to delete comment.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-3">
      {/* React Hot Toast container */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={'/dashboard?tab=profile'}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-red-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            theme={redTextareaTheme}
            className="mb-2 dark:text-white dark:bg-gray-700 !border-red-300 !focus:ring-red-500 !focus:border-red-500"
            color="gray"
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline color="failure" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete(commentToDelete)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
