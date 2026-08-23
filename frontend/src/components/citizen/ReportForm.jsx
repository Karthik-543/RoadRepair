import React, { useState } from 'react';
import LocationPicker from '../map/LocationPicker';
import { Upload, X, ShieldAlert, CheckCircle2, MapPin } from 'lucide-react';
import { ROAD_CATEGORIES, TRAFFIC_DENSITIES } from '../../utils/constants';

const ReportForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.2090);
  const [roadCategory, setRoadCategory] = useState('Local Street');
  const [trafficDensity, setTrafficDensity] = useState('Medium');
  const [nearbySchool, setNearbySchool] = useState(false);
  const [nearbyHospital, setNearbyHospital] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleLocationChange = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please upload a clear photo of the damaged road surface.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title || 'Road Damage Incident');
    formData.append('description', description);
    formData.append('address', address || `Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('roadCategory', roadCategory);
    formData.append('trafficDensity', trafficDensity);
    formData.append('nearbySchool', nearbySchool);
    formData.append('nearbyHospital', nearbyHospital);
    formData.append('image', imageFile);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
      
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-blue-700" />
          <span>Report Damaged Road Surface</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Upload an image of the pothole or road crack. Our AI will analyze damage severity, bounding box coordinates, and notify municipal authorities.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md font-medium">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Road Damage Image *</label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
            {imagePreview ? (
              <div className="relative h-48 w-full max-w-md mx-auto rounded overflow-hidden border border-slate-200">
                <img src={imagePreview} alt="Damage preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-full text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <Upload className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <span className="block text-sm font-semibold text-slate-900">Click to upload road image</span>
                <span className="block text-xs text-slate-500 mt-1">JPG, JPEG, PNG formats (Max 10MB)</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Report Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Severe Pothole near Main Market Intersection"
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Street Address / Landmark</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 14th Avenue, Block C, Municipal District 4"
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Description (Optional)</label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide any additional details (e.g. depth of pothole, water accumulation, vehicle hazard)."
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
          ></textarea>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <label className="block text-xs font-bold text-slate-800 mb-2">GPS Location Mapping</label>
          <LocationPicker latitude={latitude} longitude={longitude} onLocationChange={handleLocationChange} />
        </div>

        <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Road Category</label>
            <select
              value={roadCategory}
              onChange={(e) => setRoadCategory(e.target.value)}
              className="w-full px-2.5 py-2 border border-slate-300 rounded-md bg-white font-medium text-slate-800 outline-none"
            >
              {ROAD_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Traffic Density</label>
            <select
              value={trafficDensity}
              onChange={(e) => setTrafficDensity(e.target.value)}
              className="w-full px-2.5 py-2 border border-slate-300 rounded-md bg-white font-medium text-slate-800 outline-none"
            >
              {TRAFFIC_DENSITIES.map((den) => (
                <option key={den} value={den}>{den}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="school"
              checked={nearbySchool}
              onChange={(e) => setNearbySchool(e.target.checked)}
              className="rounded border-slate-300 text-blue-700 focus:ring-blue-600 h-4 w-4"
            />
            <label htmlFor="school" className="font-semibold text-slate-700">Nearby School (&lt; 200m)</label>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="hospital"
              checked={nearbyHospital}
              onChange={(e) => setNearbyHospital(e.target.checked)}
              className="rounded border-slate-300 text-blue-700 focus:ring-blue-600 h-4 w-4"
            />
            <label htmlFor="hospital" className="font-semibold text-slate-700">Nearby Hospital (&lt; 500m)</label>
          </div>
        </div>

      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-md shadow-sm flex items-center space-x-2 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{loading ? 'Analyzing with AI...' : 'Submit Damage Report'}</span>
        </button>
      </div>

    </form>
  );
};

export default ReportForm;
