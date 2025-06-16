// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import {
//   HiAnnotation,
//   HiArrowNarrowUp,
//   HiDocumentText,
//   HiOutlineUserGroup,
// } from 'react-icons/hi';
// import { Button, Table } from 'flowbite-react';
// import { Link } from 'react-router-dom';

// export default function DashboardComp() {
//   const [users, setUsers] = useState([]);
//   const [comments, setComments] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalPosts, setTotalPosts] = useState(0);
//   const [totalComments, setTotalComments] = useState(0);
//   const [lastMonthUsers, setLastMonthUsers] = useState(0);
//   const [lastMonthPosts, setLastMonthPosts] = useState(0);
//   const [lastMonthComments, setLastMonthComments] = useState(0);
//   const { currentUser } = useSelector((state) => state.user);
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch('/api/user/getusers?limit=5');
//         const data = await res.json();
//         if (res.ok) {
//           setUsers(data.users);
//           setTotalUsers(data.totalUsers);
//           setLastMonthUsers(data.lastMonthUsers);
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };
//     const fetchPosts = async () => {
//       try {
//         const res = await fetch('/api/post/getposts?limit=5');
//         const data = await res.json();
//         if (res.ok) {
//           setPosts(data.posts);
//           setTotalPosts(data.totalPosts);
//           setLastMonthPosts(data.lastMonthPosts);
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };
//     const fetchComments = async () => {
//       try {
//         const res = await fetch('/api/comment/getcomments?limit=5');
//         const data = await res.json();
//         if (res.ok) {
//           setComments(data.comments);
//           setTotalComments(data.totalComments);
//           setLastMonthComments(data.lastMonthComments);
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };
//     if (currentUser.isAdmin) {
//       fetchUsers();
//       fetchPosts();
//       fetchComments();
//     }
//   }, [currentUser]);
//   return (
//     <div className='p-3 md:mx-auto'>
//       <div className='flex-wrap flex gap-4 justify-center'>
//         <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
//           <div className='flex justify-between'>
//             <div className=''>
//               <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
//               <p className='text-2xl'>{totalUsers}</p>
//             </div>
//             <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
//           </div>
//           <div className='flex  gap-2 text-sm'>
//             <span className='text-green-500 flex items-center'>
//               <HiArrowNarrowUp />
//               {lastMonthUsers}
//             </span>
//             <div className='text-gray-500'>Last month</div>
//           </div>
//         </div>
//         <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
//           <div className='flex justify-between'>
//             <div className=''>
//               <h3 className='text-gray-500 text-md uppercase'>
//                 Total Comments
//               </h3>
//               <p className='text-2xl'>{totalComments}</p>
//             </div>
//             <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
//           </div>
//           <div className='flex  gap-2 text-sm'>
//             <span className='text-green-500 flex items-center'>
//               <HiArrowNarrowUp />
//               {lastMonthComments}
//             </span>
//             <div className='text-gray-500'>Last month</div>
//           </div>
//         </div>
//         <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
//           <div className='flex justify-between'>
//             <div className=''>
//               <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
//               <p className='text-2xl'>{totalPosts}</p>
//             </div>
//             <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
//           </div>
//           <div className='flex  gap-2 text-sm'>
//             <span className='text-green-500 flex items-center'>
//               <HiArrowNarrowUp />
//               {lastMonthPosts}
//             </span>
//             <div className='text-gray-500'>Last month</div>
//           </div>
//         </div>
//       </div>
//       <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
//         <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
//           <div className='flex justify-between  p-3 text-sm font-semibold'>
//             <h1 className='text-center p-2'>Recent users</h1>
//             <Button outline gradientDuoTone='purpleToPink'>
//               <Link to={'/dashboard?tab=users'}>See all</Link>
//             </Button>
//           </div>
//           <Table hoverable>
//             <Table.Head>
//               <Table.HeadCell>User image</Table.HeadCell>
//               <Table.HeadCell>Username</Table.HeadCell>
//             </Table.Head>
//             {users &&
//               users.map((user) => (
//                 <Table.Body key={user._id} className='divide-y'>
//                   <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
//                     <Table.Cell>
//                       <img
//                         src={user.profilePicture}
//                         alt='user'
//                         className='w-10 h-10 rounded-full bg-gray-500'
//                       />
//                     </Table.Cell>
//                     <Table.Cell>{user.username}</Table.Cell>
//                   </Table.Row>
//                 </Table.Body>
//               ))}
//           </Table>
//         </div>
//         <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
//           <div className='flex justify-between  p-3 text-sm font-semibold'>
//             <h1 className='text-center p-2'>Recent comments</h1>
//             <Button outline gradientDuoTone='purpleToPink'>
//               <Link to={'/dashboard?tab=comments'}>See all</Link>
//             </Button>
//           </div>
//           <Table hoverable>
//             <Table.Head>
//               <Table.HeadCell>Comment content</Table.HeadCell>
//               <Table.HeadCell>Likes</Table.HeadCell>
//             </Table.Head>
//             {comments &&
//               comments.map((comment) => (
//                 <Table.Body key={comment._id} className='divide-y'>
//                   <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
//                     <Table.Cell className='w-96'>
//                         <p className='line-clamp-2'>{comment.content}</p>
//                     </Table.Cell>
//                     <Table.Cell>{comment.numberOfLikes}</Table.Cell>
//                   </Table.Row>
//                 </Table.Body>
//               ))}
//           </Table>
//         </div>
//         <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
//           <div className='flex justify-between  p-3 text-sm font-semibold'>
//             <h1 className='text-center p-2'>Recent posts</h1>
//             <Button outline gradientDuoTone='purpleToPink'>
//               <Link to={'/dashboard?tab=posts'}>See all</Link>
//             </Button>
//           </div>
//           <Table hoverable>
//             <Table.Head>
//               <Table.HeadCell>Post image</Table.HeadCell>
//               <Table.HeadCell>Post Title</Table.HeadCell>
//               <Table.HeadCell>Category</Table.HeadCell>
//             </Table.Head>
//             {posts &&
//               posts.map((post) => (
//                 <Table.Body key={post._id} className='divide-y'>
//                   <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
//                     <Table.Cell>
//                       <img
//                         src={post.image}
//                         alt='user'
//                         className='w-14 h-10 rounded-md bg-gray-500'
//                       />
//                     </Table.Cell>
//                     <Table.Cell className='w-96'>{post.title}</Table.Cell>
//                     <Table.Cell className='w-5'>{post.category}</Table.Cell>
//                   </Table.Row>
//                 </Table.Body>
//               ))}
//           </Table>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser?.isAdmin) return;

    const fetchDash = async () => {
      try {
        const [uRes, pRes, cRes] = await Promise.all([
          fetch('/api/user/getusers?limit=5'),
          fetch('/api/post/getposts?limit=5'),
          fetch('/api/comment/getcomments?limit=5'),
        ]);
        const [uData, pData, cData] = await Promise.all([
          uRes.json(),
          pRes.json(),
          cRes.json(),
        ]);

        if (uRes.ok) {
          setUsers(uData.users);
          setTotalUsers(uData.totalUsers);
          setLastMonthUsers(uData.lastMonthUsers);
        }
        if (pRes.ok) {
          setPosts(pData.posts);
          setTotalPosts(pData.totalPosts);
          setLastMonthPosts(pData.lastMonthPosts);
        }
        if (cRes.ok) {
          setComments(cData.comments);
          setTotalComments(cData.totalComments);
          setLastMonthComments(cData.lastMonthComments);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDash();
  }, [currentUser]);

  // ――― tiny helper for the three KPI cards ―――
  const StatCard = ({ label, total, change, Icon, bg }) => (
    <div className="flex flex-col rounded-lg shadow hover:shadow-lg transition p-4 bg-white dark:bg-slate-800">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase">{label}</h3>
          <p className="text-3xl font-semibold mt-1">{total}</p>
        </div>
        <Icon className={`${bg} text-white rounded-full text-5xl p-3`} />
      </div>
      <div className="flex items-center gap-2 text-sm mt-4">
        <span className="text-green-500 flex items-center">
          <HiArrowNarrowUp />
          {change}
        </span>
        <span className="text-gray-500">Last month</span>
      </div>
    </div>
  );

  return (
    // <div className="max-w-7xl mx-auto p-4">
    <div className="max-w-7xl mx-auto px-4 py-6 w-full overflow-x-hidden">

      {/* KPI SECTION */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard
          label="Total Users"
          total={totalUsers}
          change={lastMonthUsers}
          Icon={HiOutlineUserGroup}
          bg="bg-teal-600"
        />
        <StatCard
          label="Total Comments"
          total={totalComments}
          change={lastMonthComments}
          Icon={HiAnnotation}
          bg="bg-indigo-600"
        />
        <StatCard
          label="Total Posts"
          total={totalPosts}
          change={lastMonthPosts}
          Icon={HiDocumentText}
          bg="bg-lime-600"
        />
      </section>

      {/* RECENT ITEMS SECTION */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* USERS */}
        <div className="rounded-lg shadow dark:bg-gray-800 bg-white">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="font-semibold">Recent Users</h2>
            <Button color="failure" size="xs">
              <Link to="/dashboard?tab=users">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users.map((u) => (
              <Table.Body key={u._id}>
                <Table.Row className="bg-white dark:bg-gray-800">
                  <Table.Cell>
                    <img
                      src={u.profilePicture}
                      alt={u.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell>{u.username}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>

        {/* COMMENTS */}
        <div className="rounded-lg shadow dark:bg-gray-800 bg-white">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="font-semibold">Recent Comments</h2>
            <Button color="failure" size="xs">
              <Link to="/dashboard?tab=comments">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments.map((c) => (
              <Table.Body key={c._id}>
                <Table.Row className="bg-white dark:bg-gray-800">
                  <Table.Cell className="max-w-xs">
                    <p className="line-clamp-2">{c.content}</p>
                  </Table.Cell>
                  <Table.Cell>{c.numberOfLikes}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>

        {/* POSTS */}
        <div className="rounded-lg shadow dark:bg-gray-800 bg-white">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="font-semibold">Recent Posts</h2>
            <Button color="failure" size="xs">
              <Link to="/dashboard?tab=posts">See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts.map((p) => (
              <Table.Body key={p._id}>
                <Table.Row className="bg-white dark:bg-gray-800">
                  <Table.Cell>
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-14 h-10 rounded-md object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell className="max-w-xs">{p.title}</Table.Cell>
                  <Table.Cell>{p.category}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
      </section>
    </div>
  );
}
