"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaMagic, FaSpinner } from 'react-icons/fa';

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: [],
    status: 'draft'
  });
  const [topic, setTopic] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blogs');
      const data = await response.json();
      if (response.ok) {
        setBlogs(data);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (!topic) return;
    setGenerating(true);
    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'blog', topic })
      });

      const data = await response.json();
      if (response.ok) {
        // Parser le contenu généré
        const content = data.content;
        const titleMatch = content.match(/Titre\s*:\s*(.+)/);
        const descriptionMatch = content.match(/Introduction\s*:\s*(.+)/);
        const tagsMatch = content.match(/Mots-clés\s*:\s*(.+)/);

        setFormData({
          ...formData,
          title: titleMatch ? titleMatch[1] : topic,
          description: descriptionMatch ? descriptionMatch[1] : '',
          content: content,
          tags: tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : []
        });

        toast.success("Contenu généré avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors de la génération");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBlog 
        ? `/api/admin/blogs/${editingBlog._id}`
        : '/api/admin/blogs';
      
      const method = editingBlog ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingBlog ? "Article mis à jour" : "Article créé");
        fetchBlogs();
        resetForm();
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success("Article supprimé");
        fetchBlogs();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      tags: blog.tags,
      status: blog.status
    });
  };

  const resetForm = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      description: '',
      content: '',
      tags: [],
      status: 'draft'
    });
    setTopic('');
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-[#1a1443]/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-6">
          {editingBlog ? 'Modifier l\'article' : 'Nouvel article'}
        </h3>

        {/* Générateur IA */}
        <div className="mb-6 p-4 bg-[#0d1224] rounded-lg">
          <h4 className="text-lg font-medium mb-4">Générer avec l'IA</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Sujet de l'article..."
              className="flex-1 p-2 rounded-lg bg-[#1a1443] border border-gray-700"
            />
            <button
              type="button"
              onClick={generateContent}
              disabled={generating || !topic}
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
            <label className="block text-sm font-medium mb-2">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
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
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contenu</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
              rows={10}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
              className="w-full p-2 rounded-lg bg-[#0d1224] border border-gray-700"
              placeholder="Séparez les tags par des virgules"
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

          <div className="flex justify-end gap-2">
            {editingBlog && (
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
              {editingBlog ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </div>
      </form>

      {/* Liste des articles */}
      <div className="bg-[#1a1443]/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Articles</h3>
        <div className="space-y-4">
          {blogs.map(blog => (
            <div
              key={blog._id}
              className="p-4 bg-[#0d1224] rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{blog.title}</h4>
                  <p className="text-sm text-gray-400">{blog.description}</p>
                  <div className="flex gap-2 mt-2">
                    {blog.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-violet-500/20 text-violet-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 