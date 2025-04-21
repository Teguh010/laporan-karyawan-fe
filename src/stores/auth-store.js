import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role
  },

  actions: {
    async login(username, password) {
      try {
        this.loading = true;
        this.error = null;

        console.log('Attempting login to:', api.defaults.baseURL);

        const response = await api.post('/auth/login', {
          username,
          password
        });

        console.log('Login response:', response.data);

        const { access_token, user } = response.data;

        this.token = access_token;
        this.user = user;

        localStorage.setItem('token', access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        return response.data;
      } catch (error) {
        console.error('Login error:', error);
        console.error('Error response:', error.response);
        this.error = error.response?.data?.message || 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    },

    initializeAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  }
});
