"use client";

import { useState, useEffect } from 'react';
import { FaTrash, FaEnvelope, FaEnvelopeOpen, FaArchive, FaReply } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (ids) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids,
          update: { 
            read: true,
            status: 'read',
            readAt: new Date()
          }
        })
      });

      if (response.ok) {
        toast.success("Messages marqués comme lus");
        fetchMessages();
        setSelectedMessages([]);
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleArchive = async (ids) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids,
          update: { status: 'archived' }
        })
      });

      if (response.ok) {
        toast.success("Messages archivés");
        fetchMessages();
        setSelectedMessages([]);
      }
    } catch (error) {
      toast.error("Erreur lors de l'archivage");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success("Message supprimé");
        fetchMessages();
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredMessages = messages.filter(message => {
    switch (filter) {
      case 'unread':
        return !message.read;
      case 'read':
        return message.read && message.status !== 'archived';
      case 'archived':
        return message.status === 'archived';
      default:
        return true;
    }
  });

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1a1443]/50 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Messages</h3>
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 rounded-lg bg-[#0d1224] border border-gray-700"
            >
              <option value="all">Tous</option>
              <option value="unread">Non lus</option>
              <option value="read">Lus</option>
              <option value="archived">Archivés</option>
            </select>
            {selectedMessages.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleMarkAsRead(selectedMessages)}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded"
                  title="Marquer comme lu"
                >
                  <FaEnvelopeOpen />
                </button>
                <button
                  onClick={() => handleArchive(selectedMessages)}
                  className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded"
                  title="Archiver"
                >
                  <FaArchive />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {filteredMessages.map(message => (
            <div
              key={message._id}
              className={`p-4 bg-[#0d1224] rounded-lg ${!message.read ? 'border-l-4 border-blue-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMessages([...selectedMessages, message._id]);
                        } else {
                          setSelectedMessages(selectedMessages.filter(id => id !== message._id));
                        }
                      }}
                      className="rounded border-gray-700 bg-[#0d1224]"
                    />
                    <h4 className="font-medium">{message.name}</h4>
                    <span className="text-sm text-gray-400">({message.email})</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{message.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{new Date(message.createdAt).toLocaleString()}</span>
                    {message.readAt && (
                      <span>Lu le {new Date(message.readAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.href = `mailto:${message.email}`}
                    className="p-2 text-green-400 hover:bg-green-500/20 rounded"
                    title="Répondre"
                  >
                    <FaReply />
                  </button>
                  <button
                    onClick={() => handleDelete(message._id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded"
                    title="Supprimer"
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