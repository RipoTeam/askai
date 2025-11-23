import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from '../store/settingsStore'
import api from '../lib/api'

export default function Settings() {
  const navigate = useNavigate()
  const settings = useSettingsStore()
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.put('/settings', {
        theme: settings.theme,
        model: settings.model,
        temperature: settings.temperature,
        max_tokens: settings.max_tokens,
        agent_mode: settings.agent_mode,
        voice_enabled: settings.voice_enabled
      })
      alert('Settings saved!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Chat
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => settings.updateSettings({ theme: e.target.value as 'light' | 'dark' })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AI Model</label>
            <select
              value={settings.model}
              onChange={(e) => settings.updateSettings({ model: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Temperature: {settings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => settings.updateSettings({ temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Tokens</label>
            <input
              type="number"
              value={settings.max_tokens}
              onChange={(e) => settings.updateSettings({ max_tokens: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Agent Mode</label>
            <input
              type="checkbox"
              checked={settings.agent_mode}
              onChange={(e) => settings.updateSettings({ agent_mode: e.target.checked })}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Voice Enabled</label>
            <input
              type="checkbox"
              checked={settings.voice_enabled}
              onChange={(e) => settings.updateSettings({ voice_enabled: e.target.checked })}
              className="w-5 h-5"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
