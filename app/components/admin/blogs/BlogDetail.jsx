"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaEdit, FaTrash, FaClock, FaTags, FaEye } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BlogDetail({ id }) {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`);
      const data = await response.json();
      if (response.ok) {
        setBlog(data);
      } else {
        toast.error("Article non trouvé");
        router.push('/admin/blogs');
      }
    } catch (error) {
      toast.error("Erreur lors du chargement de l'article");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success("Article supprimé");
        router.push('/admin/blogs');
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!blog) {
    return <div>Article non trouvé</div>;
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <Link 
          href="/admin/blogs"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft />
          <span>Retour</span>
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/admin/blogs/${id}/edit`}
            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
          >
            <FaEdit size={20} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
          >
            <FaTrash size={20} />
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-[#1a1443]/50 p-6 rounded-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{blog.title}</h1>
            <p className="text-gray-400">{blog.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            blog.status === 'published' 
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {blog.status === 'published' ? 'Publié' : 'Brouillon'}
          </span>
        </div>

        <div className="flex gap-4 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <FaClock />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          {blog.views > 0 && (
            <div className="flex items-center gap-2">
              <FaEye />
              <span>{blog.views} vues</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-6">
          <FaTags className="text-gray-400" />
          <div className="flex gap-2">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          {blog.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
} 