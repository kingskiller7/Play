import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api"; 

class api {
  static async register(data: {name: string, email: string, password: string}) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  }

  static async login(data: {name: string, password: string}) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  static async getProfile(token: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }
}

export default api;