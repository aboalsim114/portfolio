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
      className="bg-gradient-to-r from-[#1a1443]/30 to-[#1a1443]/20 p-8 rounded-2xl border border-violet-500/10 hover:border-[#16f2b3]/30 transition-all duration-500 group relative overflow-hidden"
    >
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#16f2b3]/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>

      <div className="relative flex flex-col md:flex-row gap-8 items-start">
        {/* Logo et Titre */}
        <div className="flex items-center gap-6 md:w-1/3">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm border border-white/10 p-2 group-hover:border-[#16f2b3]/20 transition-colors duration-500">
            <Image
              src={cert.image}
              alt={cert.organization}
              fill
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#16f2b3] to-emerald-400">
              {cert.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <FaCertificate className="text-[#16f2b3]" />
              <span className="text-gray-400">{cert.organization}</span>
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="flex-1 grid md:grid-cols-2 gap-6">
          {/* Dates */}
          <div className="space-y-4">
            <div className="bg-[#1a1443]/40 rounded-xl p-4 hover:bg-[#1a1443]/50 transition-colors duration-300 border border-violet-500/5 group-hover:border-[#16f2b3]/20">
              <div className="flex items-center gap-2 text-[#16f2b3] mb-2">
                <FaCalendarAlt />
                <span className="font-medium">Date d'émission</span>
              </div>
              <p className="text-white text-lg">
                {cert.issueDate.month} {cert.issueDate.year}
              </p>
            </div>
            <div className="bg-[#1a1443]/40 rounded-xl p-4 hover:bg-[#1a1443]/50 transition-colors duration-300 border border-violet-500/5 group-hover:border-[#16f2b3]/20">
              <div className="flex items-center gap-2 text-[#16f2b3] mb-2">
                <FaCalendarAlt />
                <span className="font-medium">Date d'expiration</span>
              </div>
              <p className="text-white text-lg">
                {cert.expirationDate.month} {cert.expirationDate.year}
              </p>
            </div>
          </div>

          {/* ID et Lien */}
          <div className="space-y-4">
            <div className="bg-[#1a1443]/40 rounded-xl p-4 hover:bg-[#1a1443]/50 transition-colors duration-300 border border-violet-500/5 group-hover:border-[#16f2b3]/20">
              <div className="flex items-center gap-2 text-[#16f2b3] mb-2">
                <FaIdBadge />
                <span className="font-medium">ID du diplôme</span>
              </div>
              <p className="font-mono text-sm text-white/90 break-all tracking-wider">
                {cert.credentialId}
              </p>
            </div>
            <Link
              href={cert.credentialUrl}
              target="_blank"
              className="block"
            >
              <div className="bg-gradient-to-r from-[#16f2b3]/20 to-[#16f2b3]/10 hover:from-[#16f2b3]/30 hover:to-[#16f2b3]/20 rounded-xl p-4 text-[#16f2b3] transition-all duration-300 group/link border border-violet-500/5 group-hover:border-[#16f2b3]/20">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Voir le certificat</span>
                  <FaExternalLinkAlt className="transform group-hover/link:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Certifications() {
  return (
    <div id="certifications" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      {/* Effet de lumière d'ambiance */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#16f2b3]/5 via-transparent to-[#16f2b3]/5 blur-3xl"></div>
      
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#16f2b3] to-transparent w-full" />
        </div>
      </div>

      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-4 bg-[#1a1443]/50 px-8 py-4 rounded-2xl border border-violet-500/10"
        >
          <FaCertificate className="text-[#16f2b3] text-2xl" />
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#16f2b3] to-emerald-400">
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