import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface VisitedState {
  visited: Record<string, number>; // noteId -> lastViewedAt
  markVisited: (id: string) => void;
  isVisited: (id: string) => boolean;
  clearVisited: () => void;
}

const MAX_ENTRIES = 500;

export const useVisitedStore = create<VisitedState>()(
  persist(
    (set, get) => ({
      visited: {},
      markVisited: (id: string) => {
        const now = Date.now();
        const next = { ...get().visited, [id]: now };
        // Trim if exceeds MAX_ENTRIES
        const ids = Object.keys(next);
        if (ids.length > MAX_ENTRIES) {
          // remove oldest entries
          const sorted = ids.sort((a, b) => next[a] - next[b]);
          const toRemove = sorted.slice(0, ids.length - MAX_ENTRIES);
          toRemove.forEach((rid) => delete next[rid]);
        }
        set({ visited: next });
      },
      isVisited: (id: string) => Boolean(get().visited[id]),
      clearVisited: () => set({ visited: {} }),
    }),
    {
      name: 'visited_notes_v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ visited: state.visited }),
    }
  )
);
