import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useLaporanStore = defineStore('laporan', {
  state: () => ({
    laporanList: [],
    currentLaporan: null,
    loading: false,
    error: null
  }),

  actions: {
    async createLaporan(formData) {
      try {
        this.loading = true;
        const response = await api.post('/laporan', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.currentLaporan = response.data;
        return response.data;
      } catch (error) {
        console.error('Store error:', error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getLaporanDetail(id) {
      try {
        this.loading = true;
        const response = await api.get(`/laporan/${id}`);
        this.currentLaporan = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getAllLaporan() {
      try {
        this.loading = true;
        const response = await api.get('/laporan');
        this.laporanList = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteLaporan(id) {
      try {
        this.loading = true;
        const response = await api.delete(`/laporan/${id}`);
        this.laporanList = this.laporanList.filter(item => item.id !== id);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
