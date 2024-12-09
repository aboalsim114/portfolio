// @flow strict

import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCode, FaRocket } from "react-icons/fa";

function AboutSection() {
  return (
    <div id="about" className="relative py-24">
      {/* Fond dynamique */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(219,39,119,0.1),transparent_50%)]"></div>
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent top-0"></div>
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent bottom-0"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carte de profil */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-pink-500/20 relative overflow-hidden group"
          >
            {/* Effet de brillance */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur"></div>
            
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <Image
                    src={personalData.profile}
                    width={150}
                    height={150}
                    alt="Profile"
                    className="rounded-full border-4 border-pink-500/20 relative z-10"
                  />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Sami Abdulhalim</h2>
                <p className="text-pink-500 mb-6">{personalData.designation}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 w-full gap-4">
                  <div className="bg-black/30 rounded-xl p-4 text-center border border-pink-500/20">
                    <div className="text-2xl font-bold text-pink-500">1+</div>
                    <div className="text-sm text-gray-400">Années d'exp.</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 text-center border border-violet-500/20">
                    <div className="text-2xl font-bold text-violet-500">10+</div>
                    <div className="text-sm text-gray-400">Projets</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section description */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* En-tête */}
            <div className="flex items-center gap-4 mb-8">
              <FaRocket className="text-3xl text-pink-500" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                À Propos de Moi
              </h2>
            </div>

            {/* Description */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-pink-500/20 hover:border-violet-500/20 transition-colors duration-300">
              <p className="text-gray-300 leading-relaxed text-lg">
                {personalData.description}
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;