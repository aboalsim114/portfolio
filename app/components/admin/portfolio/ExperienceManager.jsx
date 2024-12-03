"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    duration: '',
    description: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/admin/portfolio');
      const data = await response.json();
      if (response.ok) {
        setExperiences(data.experience);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des expériences");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedExperiences = editingExp
        ? experiences.map(exp => exp.id === editingExp.id ? { ...formData, id: exp.id } : exp)
        : [...experiences, { ...formData, id: Date.now() }];

      const response = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'experience',
          content: updatedExperiences
        })
      });

      if (response.ok) {
        toast.success(editingExp ? "Expérience mise à jour" : "Expérience ajoutée");
        setExperiences(updatedExperiences);
        resetForm();
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (exp) => {
    setEditingExp(exp);
    setFormData({
      title: exp.title,
      company: exp.company,
      duration: exp.duration,
      description: exp.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette expérience ?")) return;

    try {
      const updatedExperiences = experiences.filter(exp => exp.id !== id);
      const response = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'experience',
          content: updatedExperiences
        })
      });

      if (response.ok) {
        toast.success("Expérience supprimée");
        setExperiences(updatedExperiences);
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setEditingExp(null);
    setFormData({
      title: '',
      company: '',
      duration: '',
      description: ''
    });
  };

  return (
    <div className="bg-[#1a1443]/50 p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-6">Expérience Professionnelle</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Poste</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Entreprise</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
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
            placeholder="ex: Janvier 2023 - Présent"
            className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          {editingExp && (
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
            {editingExp ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {experiences.map(exp => (
          <div
            key={exp.id}
            className="p-4 bg-[#0d1224] rounded-lg flex justify-between items-start"
          >
            <div>
              <h4 className="font-medium">{exp.title}</h4>
              <p className="text-sm text-gray-400">{exp.company}</p>
              <p className="text-xs text-gray-500">{exp.duration}</p>
              {exp.description && (
                <p className="text-sm text-gray-400 mt-2">{exp.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(exp)}
                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
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