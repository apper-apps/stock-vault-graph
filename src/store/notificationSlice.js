import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.error = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    updateNotificationStatus: (state, action) => {
      const { notificationId, status } = action.payload;
      const notification = state.notifications.find(n => n.Id === notificationId);
      if (notification) {
        notification.status_c = status;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setNotifications,
  addNotification,
  updateNotificationStatus,
  setError,
  clearError,
} = notificationSlice.actions;

// Selectors
export const selectNotifications = (state) => state.notifications.notifications;
export const selectNotificationsLoading = (state) => state.notifications.loading;
export const selectNotificationsError = (state) => state.notifications.error;
export const selectUnreadNotifications = (state) => 
  state.notifications.notifications.filter(n => n.status_c === 'Unread');
export const selectReadNotifications = (state) => 
  state.notifications.notifications.filter(n => n.status_c === 'Read');
export const selectUnreadCount = (state) => 
  state.notifications.notifications.filter(n => n.status_c === 'Unread').length;
export default notificationSlice.reducer;