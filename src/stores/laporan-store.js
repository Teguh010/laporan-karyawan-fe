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
    },

    async approveLaporan(id) {
      try {
        this.loading = true;
        console.log(`Sending approval request for laporan ${id}`);
        const response = await api.put(`/laporan/${id}/approve`);
        console.log('Approval response:', response.data);
        
        // Refresh laporan list after approval
        await this.getAllLaporan();
        
        return response.data;
      } catch (error) {
        console.error('Error approving laporan:', error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async rejectLaporan(id) {
      try {
        this.loading = true;
        const response = await api.put(`/laporan/${id}/reject`);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getLaporanByStatus(status) {
      try {
        this.loading = true;
        const response = await api.get(`/laporan/status/${status}`);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async filterLaporan(filters = {}) {
      try {
        this.loading = true;
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        
        const queryString = params.toString();
        // Pastikan menggunakan endpoint /laporan/filter
        const url = `/laporan/filter${queryString ? `?${queryString}` : ''}`;
        
        console.log('Filter URL:', url);
        
        const response = await api.get(url);
        console.log('Filter response:', response.data);
        this.laporanList = response.data;
        return response.data;
      } catch (error) {
        console.error('Error filtering laporan:', error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
