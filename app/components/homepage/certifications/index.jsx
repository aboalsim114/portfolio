'use client';

import Image from "next/image";
import Link from "next/link";
import { certifications } from "@/utils/data/certifications";
import { FaExternalLinkAlt, FaCalendarAlt, FaIdCard, FaLink, FaCertificate } from "react-icons/fa";
import { motion } from "framer-motion";

function CertificationCard({ cert }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      {/* Carte principale */}
      <div className="bg-[#1a1443]/30 p-8 rounded-2xl border border-violet-500/10 backdrop-blur-sm">
        {/* En-tête */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5">
            <Image
              src={cert.image}
              alt={cert.organization}
              fill
              className="object-contain p-2"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#16f2b3] mb-2">{cert.title}</h3>
            <p className="text-gray-400">{cert.organization}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1a1443]/50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-[#16f2b3] mb-2">
              <FaCalendarAlt />
              <span className="text-sm font-medium">Date d'émission</span>
            </div>
            <p className="text-white text-lg">{cert.issueDate.month} {cert.issueDate.year}</p>
          </div>
          <div className="bg-[#1a1443]/50 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-[#16f2b3] mb-2">
              <FaCalendarAlt />
              <span className="text-sm font-medium">Date d'expiration</span>
            </div>
            <p className="text-white text-lg">{cert.expirationDate.month} {cert.expirationDate.year}</p>
          </div>
        </div>

        {/* ID du diplôme */}
        <div className="bg-[#1a1443]/50 p-4 rounded-xl mb-6">
          <div className="flex items-center gap-2 text-[#16f2b3] mb-2">
            <FaIdCard />
            <span className="text-sm font-medium">ID du diplôme</span>
          </div>
          <p className="text-white font-mono text-sm break-all">{cert.credentialId}</p>
        </div>

        {/* Bouton */}
        <Link
          href={cert.credentialUrl}
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-[#16f2b3]/20 to-[#16f2b3]/10 hover:from-[#16f2b3]/30 hover:to-[#16f2b3]/20 text-[#16f2b3] transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#16f2b3]/5"
        >
          <FaExternalLinkAlt size={16} />
          <span className="font-medium">Voir le certificat</span>
        </Link>
      </div>
    </motion.div>
  );
}

function Certifications() {
  return (
    <div id="certifications" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      {/* Effet de lumière d'ambiance */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-violet-500/5 blur-3xl"></div>
      
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#16f2b3] to-transparent w-full" />
        </div>
      </div>

      {/* Titre de la section */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <span className="w-12 h-[2px] bg-[#16f2b3]"></span>
          <h2 className="text-3xl font-bold text-white">Certifications</h2>
          <span className="w-12 h-[2px] bg-[#16f2b3]"></span>
        </motion.div>
      </div>

      {/* Grille des certifications */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {certifications.map((cert) => (
            <CertificationCard key={cert.id} cert={cert} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Certifications; 