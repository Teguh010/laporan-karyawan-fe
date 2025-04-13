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
        // Mock API call
        console.log('Sending data:', formData);
        // const response = await api.post('/laporan', formData);
        // return response.data;
        return { success: true, id: 'mock-id-123' };
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getLaporanDetail(id) {
      try {
        this.loading = true;
        // Mock API call
        // const response = await api.get(`/laporan/${id}`);
        // return response.data;
        return {
          id: id,
          namaBarang: 'Contoh Barang',
          nomorBarang: 'BRG-001',
          noSurat: 'SRT-001',
          files: {
            needApprove: [
              { name: 'dokumen1.pdf', url: '#' },
              { name: 'dokumen2.pdf', url: '#' }
            ],
            noNeedApprove: [
              { name: 'lampiran1.pdf', url: '#' }
            ]
          }
        };
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});