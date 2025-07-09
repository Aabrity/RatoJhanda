
// import { Button, Select, TextInput } from 'flowbite-react';
// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import PostCard from '../components/PostCard';
// import { toast } from 'react-hot-toast';

// export default function Search() {
//   const [sidebarData, setSidebarData] = useState({
//     searchTerm: '',
//     sort: 'desc',
//     category: 'uncategorized',
//   });

//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showMore, setShowMore] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search);
//     const searchTermFromUrl = urlParams.get('searchTerm');
//     const sortFromUrl = urlParams.get('sort');
//     const categoryFromUrl = urlParams.get('category');

//     if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
//       setSidebarData({
//         ...sidebarData,
//         searchTerm: searchTermFromUrl,
//         sort: sortFromUrl,
//         category: categoryFromUrl,
//       });
//     }

//     const fetchPosts = async () => {
//       setLoading(true);
//       const searchQuery = urlParams.toString();
//       try {
//         const res = await fetch(`/api/post/getposts?${searchQuery}`);
//         if (!res.ok) {
//           toast.error('Failed to fetch posts');
//           setLoading(false);
//           return;
//         }
//         const data = await res.json();
//         setPosts(data.posts);
//         setLoading(false);

//         if (data.posts.length === 0) {
//           toast('No posts found', { icon: '🔍' });
//         }

//         setShowMore(data.posts.length === 9);
//       } catch (error) {
//         setLoading(false);
//         toast.error('An unexpected error occurred');
//       }
//     };

//     fetchPosts();
//   }, [location.search]);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setSidebarData({ ...sidebarData, [id]: value || (id === 'sort' ? 'desc' : 'uncategorized') });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const urlParams = new URLSearchParams();
//     urlParams.set('searchTerm', sidebarData.searchTerm);
//     urlParams.set('sort', sidebarData.sort);
//     urlParams.set('category', sidebarData.category);
//     const searchQuery = urlParams.toString();
//     navigate(`/search?${searchQuery}`);
//     toast.success('Filters applied!');
//   };

//   const handleShowMore = async () => {
//     const startIndex = posts.length;
//     const urlParams = new URLSearchParams(location.search);
//     urlParams.set('startIndex', startIndex);
//     const searchQuery = urlParams.toString();

//     try {
//       const res = await fetch(`/api/post/getposts?${searchQuery}`);
//       if (!res.ok) {
//         toast.error('Failed to load more posts');
//         return;
//       }
//       const data = await res.json();
//       setPosts((prev) => [...prev, ...data.posts]);

//       if (data.posts.length < 9) {
//         setShowMore(false);
//         toast('No more posts to load', { icon: '✅' });
//       } else {
//         setShowMore(true);
//       }
//     } catch (error) {
//       toast.error('Something went wrong while loading more posts');
//     }
//   };

//   const customInputTheme = {
//     field: {
//       input: {
//         base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:border-gray-600",
//         colors: {
//           gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-500",
//         },
//       },
//       select: {
//         base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:border-gray-600",
//         colors: {
//           gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-500",
//         },
//       },
//     },
//   };

//   return (
//     <div className='flex flex-col md:flex-row'>
//       <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
//         <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
//           <div className='flex items-center gap-2'>
//             <label className='whitespace-nowrap font-semibold'>Search Term:</label>
//             <TextInput
//               placeholder='Search...'
//               id='searchTerm'
//               type='text'
//               theme={customInputTheme}
//               value={sidebarData.searchTerm}
//               onChange={handleChange}
//             />
//           </div>
//           <div className='flex items-center gap-2'>
//             <label className='font-semibold'>Sort:</label>
//             <Select
//               onChange={handleChange}
//               value={sidebarData.sort}
//               id='sort'
//               theme={customInputTheme}
//             >
//               <option value='desc'>Latest</option>
//               <option value='asc'>Oldest</option>
//             </Select>
//           </div>
//           <div className='flex items-center gap-2'>
//             <label className='font-semibold'>Category:</label>
//             <Select
//               onChange={handleChange}
//               value={sidebarData.category}
//               id='category'
//               theme={customInputTheme}
//             >
//               <option value='uncategorized'>Select a category</option>
//               <option value='Suspicious & Criminal Activity'>Suspicious & Criminal Activity</option>
//               <option value='Lost & Found'>Lost & Found</option>
//               <option value='Accidents & Public Hazards'>Accidents & Public Hazards</option>
//             </Select>
//           </div>
//           <Button type='submit' outline color='failure'>
//             Apply Filters
//           </Button>
//         </form>
//       </div>
//       <div className='w-full'>
//         <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
//           Posts results:
//         </h1>
//         <div className='p-7 flex flex-wrap gap-4'>
//           {!loading &&
//             posts.map((post) => <PostCard key={post._id} post={post} />)}
//           {showMore && (
//             <button
//               onClick={handleShowMore}
//               className='text-red-500 text-lg hover:underline p-7 w-full'
//             >
//               Show More
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { toast } from 'react-hot-toast';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: '',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Sync URL query params with state on load
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const sortFromUrl = urlParams.get('sort') || 'desc';
    const categoryFromUrl = urlParams.get('category') || '';

    setSidebarData({
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      category: categoryFromUrl,
    });

    fetchPosts(urlParams);
  }, [location.search]);

  // ✅ Fetch Posts
  const fetchPosts = async (params) => {
    setLoading(true);
    const searchQuery = params.toString();
    try {
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();

      setPosts(data.posts);
      setShowMore(data.posts.length === 9);
      if (data.posts.length === 0) {
        toast('No posts found', { icon: '🔍' });
      }
    } catch (err) {
      toast.error('Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ✅ Apply filters
  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (sidebarData.searchTerm.trim()) {
      params.set('searchTerm', sidebarData.searchTerm.trim());
    }

    if (sidebarData.sort) {
      params.set('sort', sidebarData.sort);
    }

    if (sidebarData.category && sidebarData.category !== 'uncategorized') {
      params.set('category', sidebarData.category);
    }

    navigate(`/search?${params.toString()}`);
    toast.success('Filters applied!');
  };

  // ✅ Show More Pagination
  const handleShowMore = async () => {
    const startIndex = posts.length;
    const params = new URLSearchParams(location.search);
    params.set('startIndex', startIndex);

    try {
      const res = await fetch(`/api/post/getposts?${params.toString()}`);
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);

      if (data.posts.length < 9) {
        setShowMore(false);
        toast('No more posts to load', { icon: '✅' });
      }
    } catch (err) {
      toast.error('Failed to load more posts');
    }
  };

  // ✅ Styling for Inputs
  const customInputTheme = {
    field: {
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:border-gray-600",
        colors: {
          gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-500",
        },
      },
      select: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:border-gray-600",
        colors: {
          gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-500",
        },
      },
    },
  };

  return (
    <div className='flex flex-col md:flex-row'>
      {/* Sidebar Filters */}
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              theme={customInputTheme}
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select
              id='sort'
              value={sidebarData.sort}
              onChange={handleChange}
              theme={customInputTheme}
            >
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select
              id='category'
              value={sidebarData.category}
              onChange={handleChange}
              theme={customInputTheme}
            >
              <option value=''>Select a category</option>
              <option value='Suspicious & Criminal Activity'>Suspicious & Criminal Activity</option>
              <option value='Lost & Found'>Lost & Found</option>
              <option value='Accidents & Public Hazards'>Accidents & Public Hazards</option>
            </Select>
          </div>

          <Button type='submit' outline color='failure'>
            Apply Filters
          </Button>
        </form>
      </div>

      {/* Posts Result Section */}
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
          Posts results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-red-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// import { Button, Select, TextInput } from 'flowbite-react';
// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import PostCard from '../components/PostCard';
// import { toast } from 'react-hot-toast';

// export default function Search() {
//   const [sidebarData, setSidebarData] = useState({
//     searchTerm: '',
//     sort: 'desc',
//     category: 'uncategorized',
//   });

//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showMore, setShowMore] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();

//   // Sanitize input before updating state or using in query
//   const sanitizeInput = (input) => {
//     const safe = input.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
//     return safe.length > 100 ? safe.slice(0, 100) : safe;
//   };

//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search);
//     const searchTermFromUrl = urlParams.get('searchTerm') || '';
//     const sortFromUrl = urlParams.get('sort') || 'desc';
//     const categoryFromUrl = urlParams.get('category') || 'uncategorized';

//     setSidebarData({
//       searchTerm: sanitizeInput(searchTermFromUrl),
//       sort: sortFromUrl,
//       category: categoryFromUrl,
//     });

//     const fetchPosts = async () => {
//       setLoading(true);
//       try {
//         const queryString = new URLSearchParams({
//           searchTerm: sanitizeInput(searchTermFromUrl),
//           sort: sortFromUrl,
//           category: categoryFromUrl,
//         }).toString();

//         const res = await fetch(`/api/post/getposts?${queryString}`);
//         if (!res.ok) throw new Error('Failed to fetch posts');
//         const data = await res.json();
//         setPosts(data.posts);
//         setShowMore(data.posts.length === 9);
//         if (data.posts.length === 0) toast('No posts found', { icon: '🔍' });
//       } catch (error) {
//         toast.error('An unexpected error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, [location.search]);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     const safeValue = sanitizeInput(value);
//     setSidebarData((prev) => ({ ...prev, [id]: safeValue }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const query = new URLSearchParams();

//     if (sidebarData.searchTerm.trim()) {
//       query.set('searchTerm', sanitizeInput(sidebarData.searchTerm));
//     }
//     query.set('sort', sidebarData.sort || 'desc');
//     query.set('category', sidebarData.category || 'uncategorized');

//     navigate(`/search?${query.toString()}`);
//     toast.success('Filters applied!');
//   };

//   const handleShowMore = async () => {
//     const startIndex = posts.length;
//     const urlParams = new URLSearchParams(location.search);
//     urlParams.set('startIndex', startIndex);

//     try {
//       const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
//       if (!res.ok) throw new Error();
//       const data = await res.json();
//       setPosts((prev) => [...prev, ...data.posts]);
//       setShowMore(data.posts.length === 9);
//       if (data.posts.length < 9) toast('No more posts to load', { icon: '✅' });
//     } catch {
//       toast.error('Something went wrong while loading more posts');
//     }
//   };

//   const customInputTheme = {
//     field: {
//       input: {
//         base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:border-gray-600',
//         colors: {
//           gray: 'bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-500',
//         },
//       },
//       select: {
//         base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:border-gray-600',
//         colors: {
//           gray: 'bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-500',
//         },
//       },
//     },
//   };

//   return (
//     <div className='flex flex-col md:flex-row'>
//       <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
//         <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
//           <div className='flex items-center gap-2'>
//             <label className='whitespace-nowrap font-semibold'>Search Term:</label>
//             <TextInput
//               placeholder='Search...'
//               id='searchTerm'
//               type='text'
//               theme={customInputTheme}
//               value={sidebarData.searchTerm}
//               onChange={handleChange}
//               autoComplete='off'
//             />
//           </div>
//           <div className='flex items-center gap-2'>
//             <label className='font-semibold'>Sort:</label>
//             <Select
//               onChange={handleChange}
//               value={sidebarData.sort}
//               id='sort'
//               theme={customInputTheme}
//             >
//               <option value='desc'>Latest</option>
//               <option value='asc'>Oldest</option>
//             </Select>
//           </div>
//           <div className='flex items-center gap-2'>
//             <label className='font-semibold'>Category:</label>
//             <Select
//               onChange={handleChange}
//               value={sidebarData.category}
//               id='category'
//               theme={customInputTheme}
//             >
//               <option value='uncategorized'>Select a category</option>
//               <option value='Suspicious & Criminal Activity'>Suspicious & Criminal Activity</option>
//               <option value='Lost & Found'>Lost & Found</option>
//               <option value='Accidents & Public Hazards'>Accidents & Public Hazards</option>
//             </Select>
//           </div>
//           <Button type='submit' outline color='failure'>
//             Apply Filters
//           </Button>
//         </form>
//       </div>
//       <div className='w-full'>
//         <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
//           Posts results:
//         </h1>
//         <div className='p-7 flex flex-wrap gap-4'>
//           {!loading &&
//             posts.map((post) => <PostCard key={post._id} post={post} />)}
//           {showMore && (
//             <button
//               onClick={handleShowMore}
//               className='text-red-500 text-lg hover:underline p-7 w-full'
//             >
//               Show More
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
