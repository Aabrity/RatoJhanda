
import { Button, Modal, Select, Spinner, Textarea } from 'flowbite-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { FaFlag, FaShare } from 'react-icons/fa';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';

import greenflag from '../assets/pin.png';
import redflag from '../assets/red-flag.png';

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
  const { currentUser } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportComment, setReportComment] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState('');

  const [copied, setCopied] = useState(false); // NEW: Share copy state

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok || !data.posts?.length) throw new Error();
        setPost(data.posts[0]);
        setError(false);
      } catch (_) {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [postSlug]);

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      setReportError('Please provide a reason.');
      return;
    }
    setReportLoading(true);
    setReportError('');
    try {
      const res = await fetch(`/api/report/report/${post._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          postId: post._id,
          reason: reportReason.trim(),
          comment: reportComment.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to report post');
      setReportSuccess(true);
      setReportReason('');
      setReportComment('');
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
      }, 2000);
    } catch (err) {
      setReportError(err.message);
    } finally {
      setReportLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white text-black dark:bg-gray-900 dark:text-gray-100">
        <Spinner size="xl" />
      </div>
    );

  if (error || !post)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center space-y-4 bg-white text-black dark:bg-gray-900 dark:text-gray-100">
        <p className="text-red-500 text-lg">⚠️ Unable to load the post.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
        <Link to="/" className="text-blue-600 dark:text-blue-400 underline">
          ← Back to homepage
        </Link>
      </div>
    );

  const markerIcon = post.flag === 'greenflag' ? greenFlagIcon : redFlagIcon;

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-gray-100 py-6 min-h-screen">
      {/* Share and Report Buttons */}
      <div className="fixed top-[13%] right-[3%] z-50 flex space-x-3">
        {/* Share button */}
        <button
          aria-label="Share link"
          className="border rounded-full w-12 h-12 flex justify-center items-center bg-red-100 cursor-pointer hover:bg-red-200 dark:bg-red-700 dark:hover:bg-red-600 transition"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <FaShare className="text-red-600 dark:text-red-300" />
        </button>

        {/* Report button */}
        <button
          aria-label="Report post"
          className="border rounded-full w-12 h-12 flex justify-center items-center bg-red-100 cursor-pointer hover:bg-red-200 dark:bg-red-700 dark:hover:bg-red-600 transition"
          onClick={() => setShowReportModal(true)}
        >
          <FaFlag className="text-red-600 dark:text-red-300" />
        </button>
      </div>

      {copied && (
        <p className="fixed top-[23%] right-[5%] z-50 rounded-md bg-red-100 px-3 py-1 text-sm shadow dark:bg-red-200 dark:text-gray-100">
          Link copied!
        </p>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-white-200 dark:hover:text-white"
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
            {post.otherCategories?.map((cat) => (
              <Link
                key={cat}
                to={`/search?category=${cat}`}
                className="inline-block text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 mr-2 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {cat}
              </Link>
            ))}
          </div>
          <div className="flex justify-center items-center text-gray-500 dark:text-white text-sm mb-4 space-x-2">
            <div className="rounded-full bg-gray-300 dark:bg-gray-700 w-6 h-6 flex items-center justify-center text-black dark:text-white">
              {post.isAnonymous
                ? 'A'
                : post.userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span>{post.isAnonymous ? 'Anonymous' : post.userName}</span>
            <span>•</span>
            {post.flag === 'redflag' && <span>🚩 Red Flag</span>}
            {post.flag === 'greenflag' && <span>🏳️💚 Green Flag</span>}
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>
              {(post.content.split(/\s+/).length / 200).toFixed(0)} min read
            </span>
          </div>
        </div>

        {post.images && (
          <img
            src={`/uploads/${post.images}`}
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
            <div className="relative z-0">
            <div className="relative group">
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

  {/* Full map clickable overlay */}
  <a
    href={`https://www.google.com/maps?q=${post.geolocation.lat},${post.geolocation.lng}`}
    target="_blank"
    rel="noopener noreferrer"
    title="Open in Google Maps"
    className="absolute inset-0 z-10"
  >
    {/* Optional hover overlay */}
    <div className="hidden group-hover:flex items-center justify-center absolute inset-0 bg-black bg-opacity-30 text-white font-semibold">
      Click to open in Google Maps
    </div>
  </a>
</div>

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

      {/* <Modal
        show={showReportModal}
        onClose={() => setShowReportModal(false)}
        size="md"
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
              Report this post
            </h3>

            {reportError && (
              <p className="text-red-600 text-center">{reportError}</p>
            )}

            {reportSuccess ? (
              <p className="text-green-600 text-center">
                Report submitted successfully!
              </p>
            ) : (
              <>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Reason <span className="text-red-500">*</span>
                </label>
                <Select
                  id="reason"
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option value="" disabled>
                    -- Select a reason --
                  </option>
                  <option value="Spam">Spam</option>
                  <option value="Abusive Content">Abusive Content</option>
                  <option value="False Information">False Information</option>
                  <option value="Other">Other</option>
                </Select>

                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Additional comments (optional)
                </label>
                <Textarea
                  id="comment"
                  placeholder="Add any details here"
                  rows={3}
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                />

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    color="gray"
                    onClick={() => setShowReportModal(false)}
                    disabled={reportLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="failure"
                    onClick={handleReportSubmit}
                    disabled={reportLoading}
                  >
                    {reportLoading ? <Spinner size="sm" /> : 'Submit Report'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal> */}
      <Modal
  show={showReportModal}
  onClose={() => setShowReportModal(false)}
  size="md"
  popup
>
  <Modal.Header />
  <Modal.Body>
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
        Report this post
      </h3>

      {reportError && (
        <p className="text-red-600 text-center">{reportError}</p>
      )}

      {reportSuccess ? (
        <p className="text-green-600 text-center">
          Report submitted successfully!
        </p>
      ) : (
        <>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Reason <span className="text-red-500">*</span>
          </label>
         <Select
  id="reason"
  required
  value={reportReason}
  onChange={(e) => setReportReason(e.target.value)}
  className="border-red-300 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400 text-sm text-gray-900 dark:text-gray-100"
  color="failure"
>
  <option value="" disabled>
    -- Select a reason --
  </option>
  <option value="Spam">Spam</option>
  <option value="Abusive Content">Abusive Content</option>
  <option value="False Information">False Information</option>
  <option value="Other">Other</option>
</Select>

          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Additional comments (optional)
          </label>
          <Textarea
            id="comment"
            placeholder="Add any details here"
            rows={3}
            value={reportComment}
            onChange={(e) => setReportComment(e.target.value)}
            className="focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400"
          />

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              color="gray"
              onClick={() => setShowReportModal(false)}
              disabled={reportLoading}
            >
              Cancel
            </Button>
            <Button
              color="failure"
              onClick={handleReportSubmit}
              disabled={reportLoading}
            >
              {reportLoading ? <Spinner size="sm" /> : 'Submit Report'}
            </Button>
          </div>
        </>
      )}
    </div>
  </Modal.Body>
</Modal>

    </div>
  );
}

