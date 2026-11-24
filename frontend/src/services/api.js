import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const employeeService = {
  // Fetch paginated & filtered employees
  async getEmployees(params = {}) {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  // Fetch single employee
  async getEmployee(id) {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create new employee
  async createEmployee(data) {
    const response = await api.post('/employees', data);
    return response.data;
  },

  // Update existing employee
  async updateEmployee(id, data) {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  // Delete employee
  async deleteEmployee(id) {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Fetch dashboard summary stats
  async getStats() {
    const response = await api.get('/stats');
    return response.data;
  },
};

export default api;
