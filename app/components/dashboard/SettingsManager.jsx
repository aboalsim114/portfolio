import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiSave, FiSlack, FiMail, FiGlobe, FiSun, FiMoon, FiBell, FiSettings, FiUser } from 'react-icons/fi';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'fr',
    notifications: {
      email: true,
      slack: false
    },
    emailIntegration: {
      enabled: true,
      address: ''
    },
    slackIntegration: {
      enabled: false,
      webhook: ''
    }
  });
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (response.ok) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        toast.error('Erreur lors du chargement des paramètres');
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      
      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const settingsTabs = [
    { id: 'general', label: 'Général', icon: FiSettings },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'integrations', label: 'Intégrations', icon: FiGlobe }
  ];

  return (
    <div className="p-6 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          Paramètres
        </h2>
      </div>

      <div className="flex gap-8">
        {/* Sidebar de navigation */}
        <div className="w-64 shrink-0">
          <nav className="space-y-2">
            {settingsTabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                    : 'hover:bg-white/5 text-gray-400'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="text-xl" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Contenu principal */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-8">
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Apparence</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, theme: 'light' })}
                    className={`p-4 rounded-xl border transition-all ${
                      settings.theme === 'light'
                        ? 'border-violet-500 bg-violet-500/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <FiSun className="text-2xl mb-2" />
                    <span>Clair</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, theme: 'dark' })}
                    className={`p-4 rounded-xl border transition-all ${
                      settings.theme === 'dark'
                        ? 'border-violet-500 bg-violet-500/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <FiMoon className="text-2xl mb-2" />
                    <span>Sombre</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Langue</h3>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full bg-white/5 rounded-xl p-3 border border-white/10"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Préférences de notification</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <FiMail className="text-xl" />
                      <span>Notifications par email</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            email: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <FiSlack className="text-xl" />
                      <span>Notifications Slack</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.slack}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            slack: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Email</h3>
                <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiMail className="text-xl" />
                      <span>Intégration Email</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailIntegration.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          emailIntegration: {
                            ...settings.emailIntegration,
                            enabled: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>
                  {settings.emailIntegration.enabled && (
                    <input
                      type="email"
                      placeholder="Adresse email"
                      value={settings.emailIntegration.address}
                      onChange={(e) => setSettings({
                        ...settings,
                        emailIntegration: {
                          ...settings.emailIntegration,
                          address: e.target.value
                        }
                      })}
                      className="w-full bg-white/5 rounded-xl p-3 border border-white/10 mt-4"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Slack</h3>
                <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiSlack className="text-xl" />
                      <span>Intégration Slack</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.slackIntegration.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          slackIntegration: {
                            ...settings.slackIntegration,
                            enabled: e.target.checked
                          }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>
                  {settings.slackIntegration.enabled && (
                    <input
                      type="text"
                      placeholder="URL Webhook Slack"
                      value={settings.slackIntegration.webhook}
                      onChange={(e) => setSettings({
                        ...settings,
                        slackIntegration: {
                          ...settings.slackIntegration,
                          webhook: e.target.value
                        }
                      })}
                      className="w-full bg-white/5 rounded-xl p-3 border border-white/10 mt-4"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div 
            className="flex justify-end pt-6 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center gap-2 hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiSave className="text-lg" />
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
} 