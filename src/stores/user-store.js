import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null
  }),

  actions: {
    async getAllUsers() {
      try {
        this.loading = true;
        const response = await api.get('/users');
        this.users = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData) {
      try {
        this.loading = true;
        const response = await api.post('/users', userData);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id, userData) {
      try {
        this.loading = true;
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id) {
      try {
        this.loading = true;
        await api.delete(`/users/${id}`);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});