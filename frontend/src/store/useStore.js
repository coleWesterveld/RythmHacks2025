import { create } from 'zustand';

const useStore = create((set) => ({

  // Privacy budget state
  privacyBudget: { spent: 1.2, total: 3.0 },
  updateBudget: (spent) => set((state) => ({
    privacyBudget: { ...state.privacyBudget, spent }
  })),

  // Query history
  queryHistory: [],
  addQuery: (query) => set((state) => ({
    queryHistory: [...state.queryHistory, query]
  })),
  clearQueryHistory: () => set({ queryHistory: [] }),

  // Current result
  currentResult: null,
  setCurrentResult: (result) => set({ currentResult: result }),

  // Notifications
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { ...notification, id: Date.now() }]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}));

export default useStore;

