import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Settings {
  theme: 'light' | 'dark'
  model: string
  temperature: number
  max_tokens: number
  agent_mode: boolean
  voice_enabled: boolean
}

interface SettingsState extends Settings {
  updateSettings: (settings: Partial<Settings>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 2000,
      agent_mode: false,
      voice_enabled: true,
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'settings-storage',
    }
  )
)
