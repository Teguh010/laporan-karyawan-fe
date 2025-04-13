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
        console.log('Store received FormData:');

        // Extract file names and create URLs for mock response
        const needApproveFiles = [];
        const noNeedApproveFiles = [];

        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);

          if (pair[0] === 'needApproveFiles') {
            needApproveFiles.push({
              name: pair[1].name,
              url: URL.createObjectURL(pair[1])
            });
          }

          if (pair[0] === 'noNeedApproveFiles') {
            noNeedApproveFiles.push({
              name: pair[1].name,
              url: URL.createObjectURL(pair[1])
            });
          }
        }

        // Mock API call
        const mockResponse = {
          success: true,
          id: 'mock-id-' + Date.now(),
          data: {
            namaBarang: formData.get('namaBarang'),
            nomorBarang: formData.get('nomorBarang'),
            noSurat: formData.get('noSurat'),
            files: {
              needApprove: needApproveFiles,
              noNeedApprove: noNeedApproveFiles
            }
          }
        };

        // Store the current laporan
        this.currentLaporan = mockResponse.data;

        return mockResponse;
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

        // If we have currentLaporan and it matches the ID, return it
        if (this.currentLaporan && this.currentLaporan.id === id) {
          return this.currentLaporan;
        }

        // Mock API call
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
