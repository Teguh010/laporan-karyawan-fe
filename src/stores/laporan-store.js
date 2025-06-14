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
    async createLaporan(formData, isSubmitted = false) {
      try {
        this.loading = true;
        console.log(`Creating laporan with isSubmitted: ${isSubmitted}`);
        
        // Gunakan URL dengan parameter query yang benar
        const url = `/laporan${isSubmitted ? '?submit=true' : ''}`;
        console.log(`Request URL: ${url}`);
        
        const response = await api.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Create response:', response.data);
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

    /**
     * Update a laporan
     * @param {string} id - Laporan ID
     * @param {Object} formData - The updated laporan data
     * @returns {Promise<Object>} Updated laporan
     */
    async updateLaporan(id, formData) {
      try {
        this.loading = true;
        console.log(`Updating laporan ${id} with data:`, formData);
        
        const response = await api.put(`/laporan/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Update current laporan if it's the one being updated
        if (this.currentLaporan?.id === id) {
          this.currentLaporan = response.data;
        }
        
        // Update in laporan list if it exists there
        const index = this.laporanList.findIndex(item => item.id === id);
        if (index !== -1) {
          this.laporanList[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        console.error('Error updating laporan:', error);
        this.error = error.response?.data?.message || error.message;
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Approve a laporan
     * @param {string} id - Laporan ID
     * @param {string} role - User role (EM or USER)
     * @returns {Promise<Object>} Updated laporan
     */
    async approveLaporan(id, role) {
      try {
        this.loading = true;
        console.log(`Sending approval request for laporan ${id} as ${role}`);
        
        // Validate role (case-insensitive)
        const normalizedRole = role?.toUpperCase();
        
        // Map frontend role to backend field
        const roleFieldMap = {
          'EM': 'emApproved',
          'USER': 'userApproved'  // Sesuai dengan field di backend
        };
        
        if (!roleFieldMap[normalizedRole]) {
          throw new Error('Role tidak valid untuk approval');
        }
        
        const roleForApi = roleFieldMap[normalizedRole];
        
        const response = await api.put(`/laporan/${id}/approve`, { role: roleForApi });
        console.log('Approval response:', response.data);
        
        // Update current laporan if it's the one being approved
        if (this.currentLaporan?.id === id) {
          this.currentLaporan = response.data;
        }
        
        // Update in laporan list if it exists there
        const index = this.laporanList.findIndex(item => item.id === id);
        if (index !== -1) {
          this.laporanList[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        console.error('Error approving laporan:', error);
        this.error = error.response?.data?.message || error.message;
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Reject a laporan
     * @param {string} id - Laporan ID
     * @param {string} reason - Alasan penolakan
     * @returns {Promise<Object>} Updated laporan
     */
    async rejectLaporan(id, reason) {
      try {
        this.loading = true;
        console.log(`Rejecting laporan ${id} with reason:`, reason);
        
        const response = await api.put(`/laporan/${id}/reject`, { reason });
        console.log('Reject response:', response.data);
        
        // Update current laporan if it's the one being rejected
        if (this.currentLaporan?.id === id) {
          this.currentLaporan = response.data;
        }
        
        // Update in laporan list if it exists there
        const index = this.laporanList.findIndex(item => item.id === id);
        if (index !== -1) {
          this.laporanList[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        console.error('Error rejecting laporan:', error);
        this.error = error.response?.data?.message || error.message;
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Resubmit a rejected laporan for approval
     * @param {string} id - Laporan ID
     * @param {Object} formData - The updated laporan data
     * @returns {Promise<Object>} Updated laporan
     */
    async resubmitLaporan(id, formData) {
      try {
        this.loading = true;
        console.log(`Resubmitting laporan ${id} for approval with data:`, formData);
        
        // Send all data in a single request to /laporan/{id}/resubmit
        const response = await api.put(`/laporan/${id}/resubmit`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Resubmit response:', response.data);
        
        // Update current laporan if it's the one being resubmitted
        if (this.currentLaporan?.id === id) {
          this.currentLaporan = response.data;
        }
        
        // Update in laporan list if it exists there
        const index = this.laporanList.findIndex(item => item.id === id);
        if (index !== -1) {
          this.laporanList[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        console.error('Error resubmitting laporan:', error);
        this.error = error.response?.data?.message || error.message;
        throw new Error(this.error);
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
    },

    /**
     * Submit a laporan for final approval
     * @param {string} id - Laporan ID
     * @returns {Promise<Object>} Updated laporan
     */
    async submitLaporan(id) {
      try {
        this.loading = true;
        
        // First get the current laporan to check status
        const currentLaporan = this.currentLaporan?.id === id 
          ? this.currentLaporan 
          : await this.getLaporanDetail(id);
        
        // For resubmission, we don't need to check approvals again
        if (currentLaporan.status !== 'resubmitted') {
          // Check if both approvals are present for new submissions
          if (!currentLaporan.emApproved || !currentLaporan.userApproved) {
            throw new Error('Laporan belum disetujui oleh semua pihak yang berwenang');
          }
          
          // Check if already submitted
          if (currentLaporan.status === 'submitted') {
            throw new Error('Laporan sudah disubmit sebelumnya');
          }
          
          // Check if in entry status
          if (currentLaporan.status !== 'entry') {
            throw new Error('Hanya laporan dengan status Entry yang dapat disubmit');
          }
        }
        
        // Use the appropriate endpoint based on current status
        const endpoint = currentLaporan.status === 'resubmitted' 
          ? 'resubmit' 
          : 'submit';
          
        const response = await api.put(`/laporan/${id}/${endpoint}`);
        
        // Update current laporan
        if (this.currentLaporan?.id === id) {
          this.currentLaporan = response.data;
        }
        
        // Update in laporan list
        const index = this.laporanList.findIndex(item => item.id === id);
        if (index !== -1) {
          this.laporanList[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        console.error('Error submitting laporan:', error);
        this.error = error.response?.data?.message || error.message;
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Check if a laporan can be submitted (both approvals done and status is entry)
     * @param {string} id - Laporan ID
     * @returns {Promise<boolean>} True if can be submitted
     */
    async canSubmitLaporan(id) {
      try {
        const laporan = this.currentLaporan?.id === id 
          ? this.currentLaporan 
          : await this.getLaporanDetail(id);
          
        return laporan.emApproved && laporan.userApproved && laporan.status === 'entry';
      } catch (error) {
        console.error('Error checking if laporan can be submitted:', error);
        return false;
      }
    },

    async assignLaporan(id, userId) {
      try {
        this.loading = true;
        const response = await api.put(`/laporan/${id}/assign`, { userId });
        if (this.currentLaporan?.id === id) {
          this.currentLaporan = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getAssignedLaporan(userId) {
      try {
        this.loading = true;
        const response = await api.get(`/laporan/assigned/${userId}`);
        this.laporanList = response.data;
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
