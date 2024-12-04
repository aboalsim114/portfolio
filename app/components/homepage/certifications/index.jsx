'use client';

import Image from "next/image";
import Link from "next/link";
import { certifications } from "@/utils/data/certifications";
import { FaExternalLinkAlt, FaCalendarAlt, FaIdBadge, FaCertificate } from "react-icons/fa";
import { motion } from "framer-motion";

function CertificationCard({ cert }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-[#10172d] rounded-xl overflow-hidden group relative border border-[#353a52] hover:border-[#16f2b3] transition-all duration-500"
    >
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#16f2b3]/0 via-[#16f2b3]/5 to-[#16f2b3]/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

      {/* En-tête avec image et titre */}
      <div className="relative p-8 border-b border-[#353a52] group-hover:border-[#16f2b3]/30">
        <div className="flex items-center gap-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm border border-[#353a52] group-hover:border-[#16f2b3] transition-all duration-300 p-2"
          >
            <Image
              src={cert.image}
              alt={cert.organization}
              fill
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#16f2b3] to-emerald-400 bg-clip-text text-transparent group-hover:text-white transition-colors duration-300">
              {cert.title}
            </h3>
            <div className="flex items-center gap-2 mt-3">
              <div className="p-1.5 bg-pink-500/10 rounded-lg">
                <FaCertificate className="text-pink-500" size={14} />
              </div>
              <p className="text-[#d3d8e8]">{cert.organization}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-8 bg-gradient-to-b from-[#1b2c68a0]/50 to-transparent">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Dates */}
          {['Émission', 'Expiration'].map((type, index) => (
            <motion.div 
              key={type}
              whileHover={{ scale: 1.02 }}
              className="bg-[#10172d]/50 rounded-xl p-4 border border-[#353a52] group-hover:border-[#16f2b3]/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 text-[#16f2b3] mb-3">
                <div className="p-2 bg-gradient-to-br from-[#16f2b3]/20 to-transparent rounded-lg group-hover:from-[#16f2b3]/30">
                  <FaCalendarAlt size={14} />
                </div>
                <span className="text-sm font-medium">{type}</span>
              </div>
              <p className="text-white text-lg pl-2">
                {index === 0 
                  ? `${cert.issueDate.month} ${cert.issueDate.year}`
                  : `${cert.expirationDate.month} ${cert.expirationDate.year}`
                }
              </p>
            </motion.div>
          ))}

          {/* ID */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#10172d]/50 rounded-xl p-4 border border-[#353a52] group-hover:border-[#16f2b3]/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 text-[#16f2b3] mb-3">
              <div className="p-2 bg-gradient-to-br from-[#16f2b3]/20 to-transparent rounded-lg group-hover:from-[#16f2b3]/30">
                <FaIdBadge size={14} />
              </div>
              <span className="text-sm font-medium">ID du diplôme</span>
            </div>
            <p className="font-mono text-white/90 text-sm pl-2 break-all">
              {cert.credentialId}
            </p>
          </motion.div>
        </div>

        {/* Bouton */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="mt-8"
        >
          <Link
            href={cert.credentialUrl}
            target="_blank"
            className="flex items-center justify-between text-[#16f2b3] hover:text-white transition-colors group/link bg-[#10172d]/50 p-4 rounded-xl border border-[#353a52] group-hover:border-[#16f2b3]/30"
          >
            <span className="font-medium">Voir le certificat</span>
            <FaExternalLinkAlt size={12} className="transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Certifications() {
  return (
    <div id="certifications" className="relative z-50 border-t my-12 lg:my-24 border-[#353951]">
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#16f2b3] to-transparent w-full" />
        </div>
      </div>

      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-4 bg-gradient-to-r from-[#1b2c68a0] to-[#10172d] px-8 py-4 rounded-xl border border-[#353a52]"
        >
          <FaCertificate className="text-[#16f2b3] text-2xl" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#16f2b3] to-emerald-400 bg-clip-text text-transparent">
            Certifications
          </h2>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {certifications.map((cert) => (
          <CertificationCard key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  );
}

export default Certifications; 