import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LocationPicker from '../components/map/LocationPicker';
import { Upload, MapPin, AlertCircle, CheckCircle2, Navigation } from 'lucide-react';

const SubmitReport = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [wardName, setWardName] = useState('Ward 04 - Central Municipal Zone');
  const [latitude, setLatitude] = useState(17.385);
  const [longitude, setLongitude] = useState(78.4744);
  const [roadWidth, setRoadWidth] = useState('7.5');
  const [roadCategory, setRoadCategory] = useState('Local Street');
  const [trafficDensity, setTrafficDensity] = useState('Medium');
  const [nearbySchool, setNearbySchool] = useState(false);
  const [nearbyHospital, setNearbyHospital] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    handleCaptureLocation();
  }, []);

  const handleCaptureLocation = () => {
    if (navigator.geolocation) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setAddress(`GPS Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`);
          setGeoLoading(false);
        },
        (err) => {
          console.warn('Geolocation failed or denied, using default map coords:', err);
          setGeoLoading(false);
        }
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (JPG, PNG, WEBP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB.');
        return;
      }
      setError('');
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please upload a road damage image.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title || 'Road Damage Report');
      formData.append('description', description);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('address', address);
      formData.append('wardName', wardName);
      formData.append('roadWidth', roadWidth);
      formData.append('roadCategory', roadCategory);
      formData.append('trafficDensity', trafficDensity);
      formData.append('nearbySchool', nearbySchool);
      formData.append('nearbyHospital', nearbyHospital);
      formData.append('image', imageFile);

      const res = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        navigate(`/reports/${res.data.report._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit road damage report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Report Road Damage</h1>
          <p className="text-slate-500 text-sm mt-1">
            Upload an image of pavement distress. Our AI system will detect the defect and calculate municipal repair priority.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-md flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
            {previewUrl ? (
              <div className="space-y-3">
                <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm border border-slate-200" />
                <label className="inline-block px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-md cursor-pointer hover:bg-slate-50">
                  Change Uploaded Photo
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            ) : (
              <div>
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">Upload Damage Photo</p>
                <p className="text-xs text-slate-400 mt-1 mb-3">PNG, JPG or WEBP up to 10MB</p>
                <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md cursor-pointer shadow-sm">
                  Select Image File
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
                </label>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Report Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep Pothole on Main Street"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Municipal Ward</label>
              <input
                type="text"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                placeholder="e.g. Ward 04 - Central Zone"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description / Location Landmark</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe road damage depth, hazards to vehicles, or landmark near the site..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">GPS Location Coordinates</label>
              <button
                type="button"
                onClick={handleCaptureLocation}
                className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{geoLoading ? 'Acquiring GPS...' : 'Auto Detect GPS'}</span>
              </button>
            </div>

            <div className="h-64 rounded-lg overflow-hidden border border-slate-300 mb-2">
              <LocationPicker
                lat={latitude}
                lng={longitude}
                onChange={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  setAddress(`Selected Map Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
                }}
              />
            </div>
            <p className="text-xs text-slate-500">Click anywhere on the map to pinpoint exact damage location.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Road Category</label>
              <select
                value={roadCategory}
                onChange={(e) => setRoadCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs bg-white"
              >
                <option value="Highway">Highway (High Speed)</option>
                <option value="Arterial Road">Arterial Road</option>
                <option value="Local Street">Local Street</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Traffic Density</label>
              <select
                value={trafficDensity}
                onChange={(e) => setTrafficDensity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs bg-white"
              >
                <option value="High">High Traffic</option>
                <option value="Medium">Medium Traffic</option>
                <option value="Low">Low Traffic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Est. Road Width (Meters)</label>
              <input
                type="number"
                step="0.5"
                value={roadWidth}
                onChange={(e) => setRoadWidth(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs bg-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 pt-1">
            <label className="flex items-center space-x-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={nearbySchool}
                onChange={(e) => setNearbySchool(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Near School Zone</span>
            </label>

            <label className="flex items-center space-x-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={nearbyHospital}
                onChange={(e) => setNearbyHospital(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>Near Hospital Route</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Analyzing AI Prediction & Submitting Report...' : 'Submit Damage Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport;
