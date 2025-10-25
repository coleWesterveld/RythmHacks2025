import { create } from 'zustand';

// Get initial role from localStorage or default to 'admin'
const getInitialRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole') || 'admin';
  }
  return 'admin';
};

const useStore = create((set) => ({
  // User state
  userRole: getInitialRole(),
  setUserRole: (role) => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', role);
    }
    set({ userRole: role });
  },

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

