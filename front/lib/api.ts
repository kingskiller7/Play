import axios from 'axios';
import bcrypt from 'bcryptjs';

const API_BASE_URL = "http://localhost:5000/";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
)

interface RegisterData {
  name: string;
  email: string;
  password: string;
}
interface LoginData {
  email: string;
  password: string;
}
interface ProfileData {
  name?: string;
  email?: string;
}
interface SecuritySettings {
  passwordMinLength: number;
  requireSpecialChars: boolean;
}
interface PermissionData {
  permissions: string[];
}
interface NewPasswordData {
  currentPassword: string;
  newPassword: string;
}

class api {
  private static handleError(error: unknown): string {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data.message || 'An error occurred';
    }
    return 'An unexpected error occurred';
  }

  static async register(data: RegisterData) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const response = await axiosInstance.post('/auth/register', {
        ...data,
        password: hashedPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(api.handleError(error));
    }
  }

  static async login(data: LoginData) {
    try {
      const response = await axiosInstance.post('/auth/login', data);
      return response.data;
    } catch (error) {
      throw new Error(api.handleError(error));
    }
  }

  static async logout() {
    try {
      const response = await axiosInstance.post('/auth/logout', null);
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async getProfile(userId: string) {
    try {
      const response = await axiosInstance.get(`/auth/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async updateProfile(userId: string, data: ProfileData) {
    try {
      const response = await axiosInstance.put(`/auth/profile${userId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async changePassword(data: NewPasswordData) {
    try {
      const response = await axiosInstance.put('/auth/change-password', data);
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async getUsers() {
    try {
      const response = await axiosInstance.get('/admin/users',);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async updateUser(userId: string, data: ProfileData & { role?: string }) {
    try {
      const response = await axiosInstance.put(`/admin/users/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async deleteUser(userId: string) {
    try {
      const response = await axiosInstance.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async getSecuritySettings() {
    try {
      const response = await axiosInstance.get('/admin/security-settings',);
      return response.data;
    } catch (error) {
      console.error("Error fetching security settings:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async updateSecuritySettings(data: SecuritySettings) {
    try {
      const response = await axiosInstance.put('/admin/security-settings', data);
      return response.data;
    } catch (error) {
      console.error("Error updating security settings:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async getActivityLogs() {
    try {
      const response = await axiosInstance.get('/admin/activity-logs');
      return response.data;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async requestPasswordReset(email: string) {
    try {
      const response = await axiosInstance.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async grantPermissions(userId: string, permissions: PermissionData) {
    try {
      const response = await axiosInstance.post(`/admin/grant-permissions/${userId}`, {permissions});
      return response.data;
    } catch (error) {
      console.error("Error while granting permission:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async revokePermissions(userId: string, permissions: PermissionData) {
    try {
      const response = await axiosInstance.post(`/admin/revoke-permissions/${userId}`, {permissions});
      return response.data;
    } catch (error) {
      console.error("Error while revoking permission:", error);
      throw new Error(api.handleError(error));
    }
  }

  static async getUserPermissions(userId: string) {
    try {
      const response = await axiosInstance.post(`/admin/permissions/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error while requesting permission:", error);
      throw new Error(api.handleError(error));
    }
  }
}

export default api;