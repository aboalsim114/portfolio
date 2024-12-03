"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaGraduationCap } from 'react-icons/fa';

export default function EducationManager() {
  const [educations, setEducations] = useState([]);
  const [editingEdu, setEditingEdu] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    duration: '',
    description: ''
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const response = await fetch('/api/admin/portfolio');
      const data = await response.json();
      if (response.ok) {
        setEducations(data.education);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des formations");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEducations = editingEdu
        ? educations.map(edu => edu.id === editingEdu.id ? { ...formData, id: edu.id } : edu)
        : [...educations, { ...formData, id: Date.now() }];

      const response = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'education',
          content: updatedEducations
        })
      });

      if (response.ok) {
        toast.success(editingEdu ? "Formation mise à jour" : "Formation ajoutée");
        setEducations(updatedEducations);
        resetForm();
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (edu) => {
    setEditingEdu(edu);
    setFormData({
      title: edu.title,
      institution: edu.institution,
      duration: edu.duration,
      description: edu.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) return;

    try {
      const updatedEducations = educations.filter(edu => edu.id !== id);
      const response = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'education',
          content: updatedEducations
        })
      });

      if (response.ok) {
        toast.success("Formation supprimée");
        setEducations(updatedEducations);
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setEditingEdu(null);
    setFormData({
      title: '',
      institution: '',
      duration: '',
      description: ''
    });
  };

  return (
    <div className="bg-[#1a1443]/50 p-6 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <FaGraduationCap className="text-2xl text-violet-500" />
        <h3 className="text-xl font-bold">Formation</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Diplôme/Formation</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Institution</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({...formData, institution: e.target.value})}
              className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Période</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            placeholder="ex: 2020 - 2023"
            className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description (optionnel)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          {editingEdu && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:opacity-90"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-600 rounded-lg hover:opacity-90"
          >
            {editingEdu ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {educations.map(edu => (
          <div
            key={edu.id}
            className="p-4 bg-[#0d1224] rounded-lg flex justify-between items-start group hover:bg-[#0d1224]/80 transition-colors"
          >
            <div>
              <h4 className="font-medium">{edu.title}</h4>
              <p className="text-sm text-gray-400">{edu.institution}</p>
              <p className="text-xs text-gray-500">{edu.duration}</p>
              {edu.description && (
                <p className="text-sm text-gray-400 mt-2">{edu.description}</p>
              )}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(edu)}
                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
                className="p-2 text-red-400 hover:bg-red-500/20 rounded"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 