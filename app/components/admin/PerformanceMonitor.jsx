"use client";

import { useState, useEffect } from 'react';
import { FaBolt, FaClock, FaMobile, FaDesktop } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    performance: 85,
    seo: 92,
    accessibility: 88,
    mobile: 90
  });

  return (
    <div className="bg-[#1a1443] p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-6">Performance du Site</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-3">
            <CircularProgressbar
              value={metrics.performance}
              text={`${metrics.performance}%`}
              styles={buildStyles({
                pathColor: `rgb(219, 39, 119)`,
                textColor: '#fff',
                trailColor: '#1a1443',
              })}
            />
          </div>
          <p className="text-sm font-medium">Performance</p>
        </div>

        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-3">
            <CircularProgressbar
              value={metrics.seo}
              text={`${metrics.seo}%`}
              styles={buildStyles({
                pathColor: `rgb(139, 92, 246)`,
                textColor: '#fff',
                trailColor: '#1a1443',
              })}
            />
          </div>
          <p className="text-sm font-medium">SEO</p>
        </div>

        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-3">
            <CircularProgressbar
              value={metrics.accessibility}
              text={`${metrics.accessibility}%`}
              styles={buildStyles({
                pathColor: `rgb(34, 197, 94)`,
                textColor: '#fff',
                trailColor: '#1a1443',
              })}
            />
          </div>
          <p className="text-sm font-medium">Accessibilité</p>
        </div>

        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-3">
            <CircularProgressbar
              value={metrics.mobile}
              text={`${metrics.mobile}%`}
              styles={buildStyles({
                pathColor: `rgb(59, 130, 246)`,
                textColor: '#fff',
                trailColor: '#1a1443',
              })}
            />
          </div>
          <p className="text-sm font-medium">Mobile</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-[#0d1224] rounded-lg">
        <h4 className="font-medium mb-3">Suggestions d'amélioration</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center gap-2">
            <FaBolt className="text-yellow-400" />
            Optimiser les images pour améliorer le temps de chargement
          </li>
          <li className="flex items-center gap-2">
            <FaClock className="text-blue-400" />
            Mettre en cache les ressources statiques
          </li>
          <li className="flex items-center gap-2">
            <FaMobile className="text-green-400" />
            Améliorer la réactivité sur mobile
          </li>
        </ul>
      </div>
    </div>
  );
} 