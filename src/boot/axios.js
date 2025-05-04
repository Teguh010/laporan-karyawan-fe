import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { CapacitorHttp } from '@capacitor/core';
import { androidLog } from './logger';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();
// const BASE_URL = 'http://p4sksg888k4s0okcgcwg4wks.152.53.231.3.sslip.io';
const BASE_URL = 'http://localhost:3000';


// Buat custom axios-like client menggunakan CapacitorHttp
export const capacitorClient = {
  token: null, // Tambahkan property token

  async post(url, data, config = {}) {
    const options = {
      url: BASE_URL + url,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
        ...config.headers
      }
    };
    androidLog.log('Making Capacitor request:', options);
    const response = await CapacitorHttp.post(options);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  },

  async get(url, config = {}) {
    const options = {
      url: BASE_URL + url,
      headers: {
        'Accept': 'application/json',
        ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
        ...config.headers
      }
    };
    androidLog.log('Making Capacitor GET request:', options);
    const response = await CapacitorHttp.get(options);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  },

  // Tambahkan method DELETE
  async delete(url, config = {}) {
    const options = {
      url: BASE_URL + url,
      headers: {
        'Accept': 'application/json',
        ...config.headers
      }
    };
    androidLog.log('Making Capacitor DELETE request:', options);
    const response = await CapacitorHttp.delete(options);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  }
};

// Gunakan Capacitor HTTP untuk native platform, axios untuk web
const api = isNative ? capacitorClient : axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = api;
});

export { api };
