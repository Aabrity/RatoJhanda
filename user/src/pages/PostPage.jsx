
import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import redflag from '../assets/red-flag.png';
import greenflag from '../assets/pin.png';

const redFlagIcon = new L.Icon({
  iconUrl: redflag,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const greenFlagIcon = new L.Icon({
  iconUrl: greenflag,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok || !data.posts || data.posts.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }
        setPost(data.posts[0]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white text-black dark:bg-gray-900 dark:text-gray-100">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center space-y-4 bg-white text-black dark:bg-gray-900 dark:text-gray-100">
        <p className="text-red-500 text-lg">⚠️ Unable to load the post.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
        <Link to="/" className="text-blue-600 dark:text-blue-400 underline">
          ← Back to homepage
        </Link>
      </div>
    );
  }

  const markerIcon = post.flag === 'greenflag' ? greenFlagIcon : redFlagIcon;

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-gray-100 py-6 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to Blog
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3 font-serif">{post.title}</h1>

          <div className="mb-2">
            <Link
              to={`/search?category=${post.category}`}
              className="inline-block text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 mr-2 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {post.category}
            </Link>
            {post.otherCategories &&
              post.otherCategories.map((cat) => (
                <Link
                  key={cat}
                  to={`/search?category=${cat}`}
                  className="inline-block text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 mr-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {cat}
                </Link>
              ))}
          </div>

          <div className="flex justify-center items-center text-gray-500 dark:text-gray-400 text-sm mb-4 space-x-2">
            <div className="rounded-full bg-gray-300 dark:bg-gray-700 w-6 h-6 flex items-center justify-center text-black dark:text-white">
              {post.isAnonymous ? 'A' : (post.userName?.charAt(0).toUpperCase() || 'U')}
            </div>
            <span>{post.isAnonymous ? 'Anonymous' : post.userName}</span>
            <span>•</span>
            {post.flag === 'redflag' && <span>🚩 Red Flag</span>}
            {post.flag === 'greenflag' && <span>🏳️💚 Green Flag</span>}
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{(post.content.split(/\s+/).length / 200).toFixed(0)} min read</span>
          </div>
        </div>

        {post.images && (
          <img
            src={post.images}
            alt={post.title}
            className="w-full rounded-lg shadow-md mb-6"
          />
        )}

        <div
          className="prose dark:prose-invert max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.geolocation?.lat && post.geolocation?.lng && (
          <div className="rounded-lg shadow-md overflow-hidden mb-6">
            <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
              📍 Location <br /> {post.location}
            </h2>
            <div className="relative">
              <MapContainer
                center={[post.geolocation.lat, post.geolocation.lng]}
                zoom={14}
                scrollWheelZoom={false}
                className="h-64 w-full"
                dragging={false}
                doubleClickZoom={false}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={[post.geolocation.lat, post.geolocation.lng]}
                  icon={markerIcon}
                >
                  <Popup>{post.location || 'Location'}</Popup>
                </Marker>
              </MapContainer>
              <div className="absolute bottom-2 right-2 bg-gray-100 dark:bg-gray-700 bg-opacity-75 rounded p-1 text-xs">
                <a
                  href={`https://www.google.com/maps?q=${post.geolocation.lat},${post.geolocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <CommentSection postId={post._id} />
        </div>
      </div>
    </div>
  );
}

// import { Button, Spinner } from 'flowbite-react';
// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import CommentSection from '../components/CommentSection';
// import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
// });

// export default function PostPage() {
//   const { postSlug } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [post, setPost] = useState(null);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
//         const data = await res.json();
//         if (!res.ok || !data.posts || data.posts.length === 0) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         setPost(data.posts[0]);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError(true);
//         setLoading(false);
//       }
//     };
//     fetchPost();
//   }, [postSlug]);

//   if (loading) {
//     return (
//       <div className='flex justify-center items-center min-h-screen'>
//         <Spinner size='xl' />
//       </div>
//     );
//   }

//   if (error || !post) {
//     return (
//       <div className='flex flex-col justify-center items-center min-h-screen text-center space-y-4'>
//         <p className='text-red-500 text-lg'>⚠️ Unable to load the post.</p>
//         <Button onClick={() => window.location.reload()}>Retry</Button>
//         <Link to='/' className='text-blue-500 underline'>← Back to homepage</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white py-6">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Back to Blog Link */}
//         <div className="mb-4">
//           <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
//             ← Back to Blog
//           </Link>
//         </div>

//       <div className="text-center">
 

//   {/* Post Title */}
//   <h1 className="text-4xl font-bold text-gray-900 mb-3 font-serif">
//     {post.title}
//   </h1>

//    {/* Categories */}
//   <div className="mb-2">
//     <Link
//       to={`/search?category=${post.category}`}
//       className="inline-block text-xs font-semibold text-gray-700 bg-gray-100 rounded-full px-2 py-1 mr-2 hover:bg-gray-200"
//     >
//       {post.category}
//     </Link>
//     {post.otherCategories &&
//       post.otherCategories.map((cat) => (
//         <Link
//           key={cat}
//           to={`/search?category=${cat}`}
//           className="inline-block text-xs font-semibold text-gray-700 bg-gray-100 rounded-full px-2 py-1 mr-2 hover:bg-gray-200"
//         >
//           {cat}
//         </Link>
//       ))}
//   </div>

//   {/* Author and Date */}
//   <div className="flex justify-center items-center text-gray-500 text-sm mb-4 space-x-2">
//     <div className="rounded-full bg-gray-200 w-6 h-6 flex items-center justify-center">
//       {post.userName ? post.userName.charAt(0).toUpperCase() : 'U'}
//     </div>
//     <span>{post.userName || 'Anonymous'}</span>
//     <span>•</span>
//     {post.flag === 'redflag' && <span>🚩 RedFlag</span>}
//     {post.flag === 'greenflag' && <span>🏳️💚 Green Flag</span>}
//     <span>•</span>
//     <span>{new Date(post.createdAt).toLocaleDateString()}</span>
//     <span>•</span>
//     <span>{(post.content.split(/\s+/).length / 200).toFixed(0)} min read</span>
//   </div>
// </div>


//         {/* Post Image */}
//         {post.images && post.images && (
//           <img
//             src={post.images}
//             alt={post.title}
//             className="w-full rounded-lg shadow-md mb-6"
//           />
//         )}

//         {/* Post Content */}
//         <div
//           className="prose max-w-none mb-6"
//           dangerouslySetInnerHTML={{ __html: post.content }}
//         />

//         {/* Location Map */}
//         {post.geolocation && post.geolocation.lat && post.geolocation.lng && (
//           <div className="rounded-lg shadow-md overflow-hidden mb-6">
//             <h2 className="text-md font-semibold text-gray-800 px-4 py-2 bg-gray-50 border-b">📍 Location <br></br>  {post.location} </h2>
//             <div className="relative">
//               <MapContainer
//                 center={[post.geolocation.lat, post.geolocation.lng]}
//                 zoom={14}
//                 scrollWheelZoom={false}
//                 className="h-64 w-full"
//                 dragging={false}
//                 doubleClickZoom={false}
//                 zoomControl={false}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 />
               
//                 <Marker position={[post.geolocation.lat, post.geolocation.lng]}>
//                   <Popup>{post.location || 'Location'}</Popup>
//                 </Marker>
//               </MapContainer>
//               <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 rounded p-1 text-xs">
//                 <a
//                   href={`https://www.google.com/maps?q=${post.geolocation.lat},${post.geolocation.lng}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:underline"
//                 >
//                   View on Google Maps
//                 </a>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Comment Section */}
//         <div className="mt-4 ">
//           <CommentSection postId={post._id} />
//         </div>
//       </div>
//     </div>
//   );
// }
// import { Button, Spinner } from 'flowbite-react';
// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// // import CallToAction from '../components/CallToAction';
// import CommentSection from '../components/CommentSection';
// import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix default marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
// });

// export default function PostPage() {
//   const { postSlug } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [post, setPost] = useState(null);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
//         const data = await res.json();
//         if (!res.ok || !data.posts || data.posts.length === 0) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         setPost(data.posts[0]);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError(true);
//         setLoading(false);
//       }
//     };
//     fetchPost();
//   }, [postSlug]);

//   if (loading) {
//     return (
//       <div className='flex justify-center items-center min-h-screen'>
//         <Spinner size='xl' />
//       </div>
//     );
//   }

//   if (error || !post) {
//     return (
//       <div className='flex flex-col justify-center items-center min-h-screen text-center space-y-4'>
//         <p className='text-red-500 text-lg'>⚠️ Unable to load the post.</p>
//         <Button onClick={() => window.location.reload()}>Retry</Button>
//         <Link to='/' className='text-blue-500 underline'>← Back to homepage</Link>
//       </div>
//     );
//   }

//   return (
//     <main className='p-4 flex flex-col max-w-5xl mx-auto min-h-screen space-y-6'>
//       {/* Back Button */}
//       <Link to='/' className='text-blue-600 hover:underline text-sm self-start'>
//         ← Back to Feed
//       </Link>

//       {/* Post Title */}
//       <h1 className='text-3xl lg:text-4xl font-serif text-center'>
//         {post.title}
//       </h1>

//       {/* Category Tag */}
//       <Link to={`/search?category=${post.category}`} className='self-center'>
//         <Button color='gray' pill size='xs'>
//           {post.category}
//         </Button>
//       </Link>

//       {/* Post Image */}
//       <img
//         src={post.images[0]}
//         alt={post.title}
//         className='rounded-lg shadow-md w-full max-h-[500px] object-cover'
//       />

//       {/* Meta Info */}
//       <div className='flex justify-between text-xs text-gray-600 border-b pb-2 max-w-2xl mx-auto'>
//         <span>{new Date(post.createdAt).toLocaleDateString()}</span>
//         <span className='italic'>{(post.content.length / 1000).toFixed(0)} mins read</span>
//       </div>

//       {/* Author Info */}
//       <div className='text-sm text-gray-800 text-center'>
//         Posted by{' '}
//         <span className='font-medium'>
//           {post.anonymous ? 'Anonymous' : post.userName || 'User'}
//         </span>
//       </div>

//       {/* Post Content */}
//       <div
//         className='prose max-w-2xl mx-auto'
//         dangerouslySetInnerHTML={{ __html: post.content }}
//       />

//       {/* Location Map */}
//       {post.geolocation && post.geolocation.lat && post.geolocation.lng && (
//         <div className='w-full max-w-4xl mx-auto mt-6 space-y-2'>
//           <h2 className='text-xl font-semibold'>Flagged Location</h2>
//           <MapContainer
//             center={[post.geolocation.lat, post.geolocation.lng]}
//             zoom={15}
//             scrollWheelZoom={false}
//             dragging={false}
//             doubleClickZoom={false}
//             zoomControl={false}
//             className='h-80 rounded-lg shadow-md'
//           >
//             <TileLayer
//               url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//               attribution='© OpenStreetMap'
//             />
//             <Marker position={[post.geolocation.lat, post.geolocation.lng]}>
//               <Popup>{post.title}</Popup>
//             </Marker>
//           </MapContainer>
//           <a
//             href={`https://www.google.com/maps/search/?api=1&query=${post.geolocation.lat},${post.geolocation.lng}`}
//             target='_blank'
//             rel='noopener noreferrer'
//             className='text-blue-600 underline text-sm'
//           >
//             View in Google Maps
//           </a>
//         </div>
//       )}

     

//       {/* Comments */}
//       <CommentSection postId={post._id} />
//     </main>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { ArrowLeft, Calendar, Clock, MapPin, User, AlertCircle, RotateCcw, Flag } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import dynamic from "next/dynamic";

// const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
// const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
// const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// const markerIcon = new L.Icon({
//   iconUrl: "/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// export default function PostPage() {
//   const { postSlug } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [post, setPost] = useState(null);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
//         const data = await res.json();
//         if (!res.ok) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         setPost(data.posts[0]);
//         setLoading(false);
//         setError(false);
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//       }
//     };
//     fetchPost();
//   }, [postSlug]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//         <div className="max-w-4xl mx-auto px-4 py-8">
//           <div className="space-y-8">
//             <Skeleton className="h-8 w-32" />
//             <Skeleton className="h-12 w-3/4 mx-auto" />
//             <Skeleton className="h-6 w-24 mx-auto" />
//             <Skeleton className="h-64 w-full rounded-xl" />
//             <div className="space-y-4">
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-5/6" />
//               <Skeleton className="h-4 w-4/6" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !post) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <Card className="max-w-md mx-4 shadow-lg">
//           <CardContent className="p-8 text-center space-y-6">
//             <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
//               <AlertCircle className="w-8 h-8 text-red-600" />
//             </div>
//             <div className="space-y-2">
//               <h2 className="text-xl font-semibold text-gray-900">Unable to Load Post</h2>
//               <p className="text-gray-600">We encountered an error while loading this post. Please try again.</p>
//             </div>
//             <div className="space-y-3">
//               <Button onClick={() => window.location.reload()} className="w-full">
//                 <RotateCcw className="w-4 h-4 mr-2" />
//                 Try Again
//               </Button>
//               <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Go Back
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <article className="space-y-8">
//           <Button variant="ghost" className="group hover:bg-white/80 transition-all duration-200" onClick={() => window.history.back()}>
//             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
//             Back to Feed
//           </Button>

//           <div className="text-center space-y-6">
//             <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
//               {post.category}
//             </Badge>

//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">{post.title}</h1>

//             <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
//               <div className="flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 <span className="font-medium">{post.anonymous ? "Anonymous" : post.userName || "User"}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4" />
//                 <span>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="w-4 h-4" />
//                 <span>{Math.max(1, Math.ceil(post.content.length / 1000))} min read</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Flag className="w-4 h-4 text-red-600" />
//                 <span className="capitalize">{post.flagType || "General"}</span>
//               </div>
//             </div>
//           </div>

//           <div className="relative group">
//             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//             <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]" />
//           </div>

//           <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-8 md:p-12">
//               <div
//                 className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-ul:my-6 prose-li:my-2 prose-strong:text-gray-900"
//                 dangerouslySetInnerHTML={{ __html: post.content }}
//               />
//             </CardContent>
//           </Card>

//           {post.geolocation && post.geolocation.lat && post.geolocation.lng && (
//             <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
//               <CardContent className="p-8">
//                 <div className="space-y-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                       <MapPin className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-semibold text-gray-900">Location</h2>
//                       <p className="text-gray-600">Where this story takes place</p>
//                     </div>
//                   </div>

//                   <div className="w-full h-80 rounded-xl overflow-hidden">
//                     <MapContainer
//                       center={[post.geolocation.lat, post.geolocation.lng]}
//                       zoom={15}
//                       scrollWheelZoom={false}
//                       dragging={false}
//                       doubleClickZoom={false}
//                       className="w-full h-full z-0"
//                     >
//                       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                       <Marker position={[post.geolocation.lat, post.geolocation.lng]} icon={markerIcon} />
//                     </MapContainer>
//                   </div>

//                   <Button
//                     variant="outline"
//                     className="w-full group hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
//                     onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${post.geolocation.lat},${post.geolocation.lng}`, "_blank")}
//                   >
//                     <MapPin className="w-4 h-4 mr-2 group-hover:text-blue-600 transition-colors duration-200" />
//                     View in Google Maps
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </article>
//       </div>
//     </div>
//   );
// }
