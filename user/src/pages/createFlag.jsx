
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  Button,
  FileInput,
  Select,
  TextInput,
} from 'flowbite-react';
import L from 'leaflet';
import 'leaflet.awesome-markers';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';
import greenflag from '../assets/pin.png';
import redflag from '../assets/red-flag.png';

export default function CreateFlag() {
  const [formData, setFormData] = useState({
    images: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [position, setPosition] = useState([27.7172, 85.324]); // Kathmandu default
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    toast.dismiss();

    const reader = new FileReader();

    reader.onloadstart = () => {
      setUploadProgress(10);
      toast.loading(`Uploading image: 10%`, { id: 'upload-progress' });
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 90) + 10;
        setUploadProgress(progress);
        toast.loading(`Uploading image: ${progress}%`, { id: 'upload-progress' });
      }
    };

    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        images: reader.result,
      }));
      setUploading(false);
      setUploadProgress(null);
      toast.dismiss('upload-progress');
      toast.success('Image uploaded successfully!');
    };

    reader.onerror = () => {
      setUploading(false);
      setUploadProgress(null);
      toast.dismiss('upload-progress');
      toast.error('Image upload failed. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!formData.images) {
      toast.error('Please upload an image before publishing');
      return;
    }

    try {
      const slug = slugify(formData.title || '', {
        lower: true,
        strict: true,
      });

      const dataToSend = {
        ...formData,
        slug,
        geolocation: {
          lat: position[0],
          lng: position[1],
        },
      };

      const res = await fetch('/api/post/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to create post');
        return;
      }

      toast.success('Post created successfully!');
      navigate(`/post/${data.slug}`);
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  };

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
            toast.error('Failed to retrieve location name');
          });
      },
    });

    const icon = formData.flag === 'greenflag' ? greenFlagIcon : redFlagIcon;

    return <Marker position={position} icon={icon} />;
  }

  const customInputTheme = {
    field: {
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 ",
        colors: {
          gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
        },
      },
      select: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
        colors: {
          gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white",
        },
      },
    },
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title & Category */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            theme={customInputTheme}
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            required
            theme={customInputTheme}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="Suspicious & Criminal Activity">Suspicious & Criminal Activity</option>
            <option value="Lost & Found">Lost & Found</option>
            <option value="Accidents & Public Hazards">Accidents & Public Hazards</option>
          </Select>
        </div>

        {/* Location Input */}
        <TextInput
          type="text"
          theme={customInputTheme}
          placeholder="Location (e.g., Kathmandu, Nepal)"
          required
          value={formData.location || ''}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
        <p className="text-sm text-gray-500 italic mt-1">
  Location Auto-fills after you select on the map below.
</p>


        {/* Flag Selector */}
        <Select
          required
          theme={customInputTheme}
          onChange={(e) =>
            setFormData({ ...formData, flag: e.target.value })
          }
        >
          <option value="redflag">Red Flag</option>
          <option value="greenflag">Green Flag</option>
        </Select>

        {/* Image Upload */}
        <div className="flex gap-4 items-center justify-between border border-gray-400 p-3 rounded">
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
          />
          <Button
            type="button"
            color="failure"
            outline
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={uploading}
          >
            {uploading ? `${uploadProgress ?? 0}%` : 'Upload Image'}
          </Button>
        </div>

        {/* Uploaded Image with Remove Button */}
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

        {/* Rich Text Editor */}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        {/* Map Component */}
        <div className="my-4">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
          <div className="text-center mt-2">
            <p>Latitude: {position[0]}</p>
            <p>Longitude: {position[1]}</p>
          </div>
        </div>

        {/* Anonymous Checkbox */}
        <div className="flex items-center gap-3">
          {/* <input
            type="checkbox"
            id="anonymous"
            onChange={(e) =>
              setFormData({ ...formData, isAnonymous: e.target.checked })
            }
          /> */}
          <input
  type="checkbox"
  id="anonymous"
  onChange={(e) => {
    setFormData({ ...formData, isAnonymous: e.target.checked });
    console.log('Anonymous checked:', e.target.checked);
  }}
/>
          <label htmlFor="anonymous" className="cursor-pointer">
            Post anonymously
          </label>
        </div>

        <Button type="submit" color="failure" className="mb-12">
          Publish
        </Button>
      </form>
    </div>
  );
}
