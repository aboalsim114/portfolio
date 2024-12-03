"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function PersonalInfoManager() {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    github: '',
    linkedIn: '',
    resume: ''
  });

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      const response = await fetch('/api/admin/portfolio');
      const data = await response.json();
      if (response.ok) {
        setFormData(data.personal);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des informations");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'personal',
          content: formData
        })
      });

      if (response.ok) {
        toast.success("Informations mises à jour");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="bg-[#1a1443]/50 p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-6">Informations Personnelles</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaUser />
              </span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 p-2 rounded-lg bg-[#0d1224] border border-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Titre</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({...formData, designation: e.target.value})}
              className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 p-2 rounded-lg bg-[#0d1224] border border-gray-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaPhone />
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-10 p-2 rounded-lg bg-[#0d1224] border border-gray-700"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Adresse</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaMapMarker />
            </span>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full pl-10 p-2 rounded-lg bg-[#0d1224] border border-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaGithub />
              </span>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({...formData, github: e.target.value})}
                className="w-full pl-10 p-2 rounded-lg bg-[#0d1224] border border-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaLinkedin />
              </span>
              <input
                type="url"
                value={formData.linkedIn}
                onChange={(e) => setFormData({...formData, linkedIn: e.target.value})}
                className="w-full pl-10 p-2 rounded-lg bg-[#0d1224] border border-gray-700"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">CV (URL)</label>
          <input
            type="url"
            value={formData.resume}
            onChange={(e) => setFormData({...formData, resume: e.target.value})}
            className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-600 rounded-lg hover:opacity-90"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
} 