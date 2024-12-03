"use client";

import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, title, value, trend, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#1a1443]/80 to-[#1a1443]/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-800/50 hover:border-gray-700/50 transition-colors shadow-lg"
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-3xl" />
      
      <div className="relative flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} shadow-lg backdrop-blur-xl`}>
          <Icon className="text-2xl" />
        </div>
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {value}
            </h3>
            {trend && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                trend > 0 
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 