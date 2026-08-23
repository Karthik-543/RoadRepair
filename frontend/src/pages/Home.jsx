import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Camera, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Municipal Road Infrastructure Management System</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                RoadSense AI — Intelligent Pavement Distress Detection & Priority Repair Operations
              </h1>
              <p className="text-slate-600 text-base leading-relaxed">
                Empowering citizens to report road hazards instantly. Utilizing deep learning vision models to detect pavement damage, calculate severity scores, link duplicate spatial incidents, and optimize municipal dispatch workflows.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/submit-report"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition-colors shadow-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>Report Road Damage</span>
                </Link>

                <Link
                  to="/map"
                  className="inline-flex items-center space-x-2 px-6 py-3 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-md transition-colors shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Explore Damage Map</span>
                </Link>
              </div>
            </div>

            <div className="bg-slate-100 rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">System Status</span>
                  <h4 className="text-base font-bold text-slate-900">Municipal Gateway Active</h4>
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">AI Damage Classes</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">5 Types</p>
                  <p className="text-[11px] text-slate-400">Pothole, Cracks, Patches</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Spatial Clustering</span>
                  <p className="text-2xl font-extrabold text-blue-600 mt-1">50m Radius</p>
                  <p className="text-[11px] text-slate-400">Haversine GPS Engine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900">How RoadSense AI Operates</h2>
          <p className="text-slate-600 text-sm mt-2">End-to-End Workflow from Citizen Image Upload to Municipal Repair Completion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Citizen Report Upload</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Citizens capture road defect photos. GPS coordinates are automatically recorded along with road category and environmental context.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">AI Classification & Priority Calculation</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              YOLOv8 microservice predicts bounding boxes and damage class. Priority algorithm calculates deterministic score P_score (Very Low to Critical).
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Municipal Dispatch & Closure</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Engineers assign work orders, upload completed repair photos, and close reports with before/after comparison records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
