import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const usePurchaseRequestStore = defineStore('purchaseRequest', {
  state: () => ({
    purchaseRequestList: [],
    currentPurchaseRequest: null,
    loading: false,
    error: null
  }),

  actions: {
    async createPurchaseRequest(formData, isSubmitted = false) {
      try {
        this.loading = true;
        console.log(`Creating purchase request with isSubmitted: ${isSubmitted}`);
        
        const url = `/purchase-request${isSubmitted ? '?submit=true' : ''}`;
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

    async getPurchaseRequestDetail(id) {
      try {
        this.loading = true;
        const response = await api.get(`/purchase-request/${id}`);
        this.currentPurchaseRequest = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getAllPurchaseRequests() {
      try {
        this.loading = true;
        const response = await api.get('/purchase-request');
        this.purchaseRequestList = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePurchaseRequest(id) {
      try {
        this.loading = true;
        const response = await api.delete(`/purchase-request/${id}`);
        this.purchaseRequestList = this.purchaseRequestList.filter(item => item.id !== id);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update a purchase request
     * @param {string} id - Purchase Request ID
     * @param {Object} formData - The updated purchase request data
     * @returns {Promise<Object>} Updated purchase request
     */
    async updatePurchaseRequest(id, formData) {
      try {
        this.loading = true;
        console.log(`Updating purchase request ${id} with data:`, formData);
        
        const response = await api.put(`/purchase-request/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Update current purchase request if it's the one being updated
        if (this.currentPurchaseRequest?.id === id) {
          this.currentPurchaseRequest = response.data;
        }
        
        // Update in purchase request list if it exists there
        const index = this.purchaseRequestList.findIndex(item => item.id === id);
        if (index !== -1) {
          this.purchaseRequestList[index] = response.data;
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
     * Approve a purchase request
     * @param {string} id - Purchase Request ID
     * @param {string} role - User role (EM or USER)
     * @returns {Promise<Object>} Updated purchase request
     */
    async approvePurchaseRequest(id, role) {
      try {
        this.loading = true;
        console.log(`Sending approval request for purchase request ${id} as ${role}`);
        
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
        
        const response = await api.put(`/purchase-request/${id}/approve`, { role: roleForApi });
        console.log('Approval response:', response.data);
        
        // Update current purchase request if it's the one being approved
        if (this.currentPurchaseRequest?.id === id) {
          this.currentPurchaseRequest = response.data;
        }
        
        // Update in purchase request list if it exists there
        const index = this.purchaseRequestList.findIndex(item => item.id === id);
        if (index !== -1) {
          this.purchaseRequestList[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        console.error('Error approving purchase request:', error);
        this.error = error.response?.data?.message || error.message;
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Reject a purchase request
     * @param {string} id - Purchase Request ID
     * @param {string} reason - Rejection reason
     * @returns {Promise<Object>} Updated purchase request
     */
    async rejectPurchaseRequest(id, reason) {
      try {
        this.loading = true;
        console.log(`Rejecting purchase request ${id} with reason:`, reason);
        
        const response = await api.put(`/purchase-request/${id}/reject`, { reason });
        console.log('Reject response:', response.data);
        
        // Update current purchase request if it's the one being rejected
        if (this.currentPurchaseRequest?.id === id) {
          this.currentPurchaseRequest = response.data;
        }
        
        // Update in purchase request list if it exists there
        const index = this.purchaseRequestList.findIndex(item => item.id === id);
        if (index !== -1) {
          this.purchaseRequestList[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        console.error('Error rejecting purchase request:', error);
        this.error = error.response?.data?.message || error.message;
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Resubmit a rejected purchase request for approval
     * @param {string} id - Purchase Request ID
     * @param {Object} formData - The updated purchase request data
     * @returns {Promise<Object>} Updated purchase request
     */
    async resubmitPurchaseRequest(id, formData) {
      try {
        this.loading = true;
        console.log(`Resubmitting purchase request ${id} for approval with data:`, formData);
        
        // Send all data in a single request to /purchase-request/{id}/resubmit
        const response = await api.put(`/purchase-request/${id}/resubmit`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Resubmit response:', response.data);
        
        // Update current purchase request if it's the one being resubmitted
        if (this.currentPurchaseRequest?.id === id) {
          this.currentPurchaseRequest = response.data;
        }
        
        // Update in purchase request list if it exists there
        const index = this.purchaseRequestList.findIndex(item => item.id === id);
        if (index !== -1) {
          this.purchaseRequestList[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        console.error('Error resubmitting purchase request:', error);
        this.error = error.response?.data?.message || error.message;
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async getPurchaseRequestByStatus(status) {
      try {
        this.loading = true;
        const response = await api.get(`/purchase-request/status/${status}`);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async filterPurchaseRequests(filters = {}) {
      try {
        this.loading = true;
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        
        const queryString = params.toString();
        // Pastikan menggunakan endpoint /purchase-request/filter
        const url = `/purchase-request/filter${queryString ? `?${queryString}` : ''}`;
        
        console.log('Filter URL:', url);
        
        const response = await api.get(url);
        console.log('Filter response:', response.data);
        this.purchaseRequestList = response.data;
        return response.data;
      } catch (error) {
        console.error('Error filtering purchase requests:', error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Submit a purchase request for final approval
     * @param {string} id - Purchase Request ID
     * @returns {Promise<Object>} Updated purchase request
     */
    async submitPurchaseRequest(id) {
      try {
        this.loading = true;
        
        // First get the current purchase request to check status
        const currentPurchaseRequest = this.currentPurchaseRequest?.id === id 
          ? this.currentPurchaseRequest 
          : await this.getPurchaseRequestDetail(id);
        
        // For resubmission, we don't need to check approvals again
        if (currentPurchaseRequest.status !== 'resubmitted') {
          // Check if both approvals are present for new submissions
          if (!currentPurchaseRequest.emApproved || !currentPurchaseRequest.userApproved) {
            throw new Error('Purchase request belum disetujui oleh semua pihak yang berwenang');
          }
          
          // Check if already submitted
          if (currentPurchaseRequest.status === 'submitted') {
            throw new Error('Purchase request sudah disubmit sebelumnya');
          }
          
          // Check if in entry status
          if (currentPurchaseRequest.status !== 'entry') {
            throw new Error('Hanya purchase request dengan status Entry yang dapat disubmit');
          }
        }
        
        // Use the appropriate endpoint based on current status
        const endpoint = currentPurchaseRequest.status === 'resubmitted' 
          ? 'resubmit' 
          : 'submit';
          
        const response = await api.put(`/purchase-request/${id}/${endpoint}`);
        
        // Update current purchase request
        if (this.currentPurchaseRequest?.id === id) {
          this.currentPurchaseRequest = response.data;
        }
        
        // Update in purchase request list
        const index = this.purchaseRequestList.findIndex(item => item.id === id);
        if (index !== -1) {
          this.purchaseRequestList[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        console.error('Error submitting purchase request:', error);
        this.error = error.response?.data?.message || error.message;
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Check if a purchase request can be submitted (both approvals done and status is entry)
     * @param {string} id - Purchase Request ID
     * @returns {Promise<boolean>} True if can be submitted
     */
    async canSubmitPurchaseRequest(id) {
      try {
        const purchaseRequest = this.currentPurchaseRequest?.id === id 
          ? this.currentPurchaseRequest 
          : await this.getPurchaseRequestDetail(id);
          
        return purchaseRequest.emApproved && purchaseRequest.userApproved && purchaseRequest.status === 'entry';
      } catch (error) {
        console.error('Error checking if laporan can be submitted:', error);
        return false;
      }
    }
  }
});
