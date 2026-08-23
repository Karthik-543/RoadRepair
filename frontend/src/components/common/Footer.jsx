import React from 'react';
import { Shield, Phone, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-base mb-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>RoadSense AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Intelligent Road Damage Detection and Repair Prioritization Platform for Municipal Engineering & Citizen Safety.
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Damage Categories</h4>
            <ul className="space-y-1.5">
              <li>Potholes & Deep Cavities</li>
              <li>Longitudinal & Transverse Cracks</li>
              <li>Alligator Cracking Networks</li>
              <li>Road Patches & Sub-surface Wear</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Municipal Portal</h4>
            <ul className="space-y-1.5">
              <li>Priority Score Calculation</li>
              <li>Haversine Duplicate Detection</li>
              <li>GIS Leaflet Mapping</li>
              <li>Work Order Allocation</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Public Services</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Municipal Hotline: 1800-ROADSENSE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@roadsense.gov</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Public Works Department</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-slate-500">
          <p>© {new Date().getFullYear()} RoadSense AI. Municipal Operations System. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
