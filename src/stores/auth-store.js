import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { androidLog } from 'boot/logger';
import { Capacitor } from '@capacitor/core';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    initializeAuth() {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken) {
        this.token = savedToken;
        this.user = savedUser ? JSON.parse(savedUser) : null;

        // Set token untuk semua platform
        if (Capacitor.isNativePlatform()) {
          if ('token' in api) {
            api.token = savedToken;
          }
        } else {
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
      }
    },

    async login(username, password) {
      try {
        this.loading = true;
        this.error = null;

        androidLog.log('Attempting login...');

        const response = await api.post('/auth/login', {
          username,
          password
        });

        androidLog.log('Login response:', response.data);

        const { access_token, user } = response.data;

        this.token = access_token;
        this.user = user;

        // Simpan di localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        // Set token untuk semua platform
        if (Capacitor.isNativePlatform()) {
          if ('token' in api) {
            api.token = access_token;
          }
        } else {
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        }

        return response.data;
      } catch (error) {
        androidLog.error('Login error:', error.message);
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (Capacitor.isNativePlatform()) {
        if ('token' in api) {
          api.token = null;
        }
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
    }
  }
});
