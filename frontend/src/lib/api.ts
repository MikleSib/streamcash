import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    
    return api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  register: (data: any) => api.post('/auth/register', data),
  testToken: () => api.post('/auth/test-token'),
};

export const userAPI = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: any) => api.put('/users/me', data),
};

export const streamerAPI = {
  getAll: () => api.get('/streamers/'),
  getFeatured: () => api.get('/streamers/featured'),
  getMe: () => api.get('/streamers/me'),
  create: (data: any) => api.post('/streamers/', data),
  update: (data: any) => api.put('/streamers/me', data),
  getByUrl: (url: string) => api.get(`/streamers/url/${url}`),
};

export const donationAPI = {
  create: (data: any) => api.post('/donations/', data),
  getStats: (userId: number) => api.get(`/donations/stats/${userId}`),
  getMy: (params?: any) => api.get('/donations/my', { params }),
  getAll: (params?: any) => api.get('/donations/', { params }),
  getByRecipient: (recipientId: number) => api.get(`/donations/?recipient_id=${recipientId}`),
  getById: (donationId: number) => api.get(`/donations/${donationId}`),
};

export const alertAPI = {
  getSettings: () => api.get('/alerts/'),
  updateSettings: (data: any) => api.put('/alerts/', data),
  updateTier: (tierId: string, data: any) => api.put(`/alerts/tier/${tierId}`, data),
  createTier: () => api.post('/alerts/tier'),
  deleteTier: (tierId: string) => api.delete(`/alerts/tier/${tierId}`),
  testAlert: (amount: number) => api.post(`/alerts/test/${amount}`),
  uploadAudio: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/alerts/upload/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/alerts/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteFile: (fileUrl: string) => api.delete(`/alerts/upload/file?file_url=${encodeURIComponent(fileUrl)}`),
  getUserFiles: () => api.get('/alerts/upload/files')
};

export const paymentAPI = {
  checkStatus: (paymentId: string) => api.get(`/payments/status/${paymentId}`),
}; 