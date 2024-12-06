'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(4);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tools: [],
    myRole: '',
    code: '',
    demo: '',
    image: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des projets');
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const PaginationButtons = () => {
    return (
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 rounded-xl ${
              currentPage === index + 1
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {index + 1}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingProject 
        ? `/api/projects?id=${editingProject.id}`
        : '/api/projects';
      
      const method = editingProject ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      
      toast.success(editingProject ? 'Projet mis à jour' : 'Projet créé');
      fetchProjects();
      resetForm();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    
    try {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      toast.success('Projet supprimé');
      fetchProjects();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      tools: [],
      myRole: '',
      code: '',
      demo: '',
      image: ''
    });
    setEditingProject(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Projets</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingProject(null);
            setFormData({
              name: '',
              description: '',
              tools: [],
              myRole: '',
              code: '',
              demo: '',
              image: ''
            });
            setShowForm(true);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600"
        >
          <FiPlus className="inline-block mr-2" />
          Nouveau Projet
        </motion.button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom du projet"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-white/5 rounded-xl p-3 border border-white/10"
              required
            />
            <input
              type="text"
              placeholder="Mon rôle"
              value={formData.myRole}
              onChange={(e) => setFormData({...formData, myRole: e.target.value})}
              className="bg-white/5 rounded-xl p-3 border border-white/10"
              required
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-white/5 rounded-xl p-3 border border-white/10 min-h-[150px]"
            rows={6}
            required
          />
          <div>
            <label className="block text-sm text-gray-400 mb-2">Technologies utilisées</label>
            <input
              type="text"
              placeholder="Technologies (séparées par des virgules)"
              value={formData.tools.join(', ')}
              onChange={(e) => setFormData({...formData, tools: e.target.value.split(',').map(t => t.trim())})}
              className="w-full bg-white/5 rounded-xl p-3 border border-white/10"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <motion.button
              type="button"
              onClick={resetForm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
            >
              Annuler
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600"
              disabled={isLoading}
            >
              {isLoading ? 'Chargement...' : 'Enregistrer'}
            </motion.button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentProjects.map((project) => (
          <motion.div
            key={project.id}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{project.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormData(project);
                    setEditingProject(project);
                    setShowForm(true);
                  }}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 rounded-lg hover:bg-white/10 text-red-500"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            <p className="text-sm text-violet-400 mb-2">{project.myRole}</p>
            <p className="text-gray-400 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-white/5 text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <PaginationButtons />
    </div>
  );
} 