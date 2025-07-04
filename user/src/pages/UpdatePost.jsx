
import {
  Button,
  FileInput,
  Select,
  TextInput,
  Checkbox,
} from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import greenflag from '../assets/pin.png';
import redflag from '../assets/red-flag.png';
import L from 'leaflet';

const redFlagIcon = new L.Icon({
  iconUrl: redflag,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const greenFlagIcon = new L.Icon({
  iconUrl: greenflag,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const customInputTheme = {
  field: {
    input: {
      base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50',
      colors: {
        gray: 'bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white',
      },
    },
    select: {
      base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50',
      colors: {
        gray: 'bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white',
      },
    },
  },
};

export default function UpdatePost() {
  const [formData, setFormData] = useState(null);
  const [file, setFile] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [position, setPosition] = useState([27.7172, 85.324]);
  const [loading, setLoading] = useState(true);

  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          toast.error(data.message);
          setLoading(false);
          return;
        }
        setFormData(data.posts[0]);
        if (data.posts[0]?.geolocation) {
          setPosition([
            data.posts[0].geolocation.lat,
            data.posts[0].geolocation.lng,
          ]);
        }
        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setPublishError('Failed to fetch post data.');
        toast.error('Failed to fetch post data.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleImageUpload = () => {
    if (!file) {
      toast.error('Please select an image');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        images: reader.result, // base64 string
      }));
      toast.success('Image Uploaded Successfully!');
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            isAnonymous: formData.isAnonymous || false,
            geolocation: { lat: position[0], lng: position[1] },
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        toast.error(data.message);
        return;
      }
      toast.success('Post updated successfully!');
      navigate(`/post/${data.slug}`);
    } catch (err) {
      setPublishError('Something went wrong');
      toast.error('Something went wrong');
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
          .then((res) => res.json())
          .then((data) => {
            const address = data.display_name;
            setFormData((prevData) => ({
              ...prevData,
              location: address,
            }));
          })
          .catch((err) => {
            console.error('Reverse geocoding failed:', err);
          });
      },
    });

    const icon = formData?.flag === 'greenflag' ? greenFlagIcon : redFlagIcon;
    return <Marker position={position} icon={icon} />;
  }

  if (loading || !formData) {
    return <p className="text-center p-5">Loading post data...</p>;
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            theme={customInputTheme}
            required
            value={formData.title || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Select
            required
            theme={customInputTheme}
            value={formData.category || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="Suspicious & Criminal Activity">
              Suspicious & Criminal Activity
            </option>
            <option value="Lost & Found">Lost & Found</option>
            <option value="Accidents & Public Hazards">
              Accidents & Public Hazards
            </option>
          </Select>
        </div>

        <TextInput
          type="text"
          placeholder="Location"
          required
          value={formData.location || ''}
          theme={customInputTheme}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
        />

        <Select
          required
          theme={customInputTheme}
          value={formData.flag || ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, flag: e.target.value }))
          }
        >
          <option value="redflag">Red Flag</option>
          <option value="greenflag">Green Flag</option>
        </Select>

        <div className="flex gap-4 items-center justify-between border border-gray-400 dark:border-gray-600 p-3 rounded dark:bg-gray-800">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="dark:text-white"
          />
          <Button
            type="button"
            color="failure"
            outline
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleImageUpload}
          >
            Upload Image
          </Button>
        </div>

        {formData.images && (
          <div className="relative w-full h-72 mb-4">
            <img
              src={formData.images}
              alt="uploaded"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, images: '' }))
              }
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700"
              title="Remove image"
            >
              X
            </button>
          </div>
        )}

        <ReactQuill
          theme="snow"
          value={formData.content || ''}
          placeholder="Write something..."
          className="h-72 mb-12 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, content: value }))
          }
        />

        <div className="my-4">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
          <div className="text-center mt-2 dark:text-white">
            <p>Latitude: {position[0]}</p>
            <p>Longitude: {position[1]}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-start mt-4 mb-2">
          <Checkbox
            id="isAnonymous"
            checked={formData.isAnonymous || false}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isAnonymous: e.target.checked,
              }))
            }
            className="text-red-600 focus:ring-red-500 ring-offset-gray-800"
          />
          <label
            htmlFor="isAnonymous"
            className="text-sm font-medium text-gray-900 dark:text-white"
          >
            Post Anonymously
          </label>
        </div>

        <Button
          type="submit"
          color="failure"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Update Post
        </Button>
      </form>
    </div>
  );
}
