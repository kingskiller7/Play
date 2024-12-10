import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

class api {
  static async register(data: { name: string; email: string; password: string }) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to register');
      }
      throw error;
    }
  }

  static async login(data: { email: string; password: string }) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to login');
      }
      throw error;
    }
  }

  static async getProfile(token: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }

  static async updateProfile(token: string, data: { name?: string; email?: string }) {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  static async changePassword(token: string, data: { currentPassword: string; newPassword: string }) {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/change-password`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }

  static async isAdmin(token: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/is-admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.isAdmin;
    } catch (error) {
      console.error("Error checking admin status:", error);
      throw error;
    }
  }

  static async getUsers(token: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  static async updateUser(token: string, userId: string, data: { name?: string; email?: string; role?: string }) {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  static async deleteUser(token: string, userId: string) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  static async getSecuritySettings(token: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/security-settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching security settings:", error);
      throw error;
    }
  }

  static async updateSecuritySettings(token: string, data: { passwordMinLength: number; requireSpecialChars: boolean }) {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/security-settings`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating security settings:", error);
      throw error;
    }
  }

  static async getActivityLogs(token: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/activity-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      throw error;
    }
  }

  static async requestPasswordReset(email: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      throw error;
    }
  }
}

export default api;

