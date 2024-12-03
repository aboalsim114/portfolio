"use client";

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaMagic, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tools: [],
    github: '',
    status: 'draft'
  });
  const [projectIdea, setProjectIdea] = useState('');

  // Charger les projets
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      const data = await response.json();
      if (response.ok) {
        setProjects(data);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProject 
        ? `/api/admin/projects/${editingProject._id}`
        : '/api/admin/projects';
      
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingProject ? "Projet mis à jour" : "Projet créé");
        fetchProjects();
        resetForm();
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  // Supprimer un projet
  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success("Projet supprimé");
        fetchProjects();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Éditer un projet
  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      tools: project.tools,
      github: project.github || '',
      status: project.status
    });
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      tools: [],
      github: '',
      status: 'draft'
    });
  };

  const generateProjectDescription = async () => {
    if (!projectIdea) return;
    setGenerating(true);
    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'project',
          topic: projectIdea,
          tools: formData.tools.join(', ') // Envoyer les outils actuels pour une meilleure génération
        })
      });

      const data = await response.json();
      if (response.ok) {
        // Parser le contenu généré
        const content = data.content;
        const nameMatch = content.match(/Nom du projet\s*:\s*(.+)/);
        const descriptionMatch = content.match(/Description\s*:\s*(.+)/);
        const toolsMatch = content.match(/Technologies utilisées\s*:\s*(.+)/);

        setFormData({
          ...formData,
          name: nameMatch ? nameMatch[1] : projectIdea,
          description: descriptionMatch ? descriptionMatch[1] : '',
          tools: toolsMatch ? toolsMatch[1].split(',').map(t => t.trim()) : formData.tools
        });

        toast.success("Description générée avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors de la génération");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-[#1a1443]/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-6">
          {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
        </h3>
        
        {/* Générateur IA */}
        <div className="mb-6 p-4 bg-[#0d1224] rounded-lg">
          <h4 className="text-lg font-medium mb-4">Générer avec l'IA</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value)}
              placeholder="Décrivez votre idée de projet..."
              className="flex-1 p-2 rounded-lg bg-[#1a1443] border border-gray-700"
            />
            <button
              type="button"
              onClick={generateProjectDescription}
              disabled={generating || !projectIdea}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-600 rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              {generating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <FaMagic />
                  Générer
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Technologies (séparées par des virgules)</label>
            <input
              type="text"
              value={formData.tools.join(', ')}
              onChange={(e) => setFormData({...formData, tools: e.target.value.split(',').map(t => t.trim())})}
              className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">GitHub</label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({...formData, github: e.target.value})}
              className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-600 rounded-lg hover:opacity-90"
            >
              {editingProject ? 'Mettre à jour' : 'Créer'}
            </button>
            {editingProject && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:opacity-90"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Liste des projets */}
      <div className="bg-[#1a1443]/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Projets</h3>
        <div className="space-y-4">
          {projects.map(project => (
            <div
              key={project._id}
              className="flex items-center justify-between p-4 bg-[#0d1224] rounded-lg"
            >
              <div>
                <h4 className="font-medium">{project.name}</h4>
                <p className="text-sm text-gray-400">{project.description}</p>
                <div className="flex gap-2 mt-2">
                  {project.tools.map((tool, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-violet-500/20 text-violet-300 rounded"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 