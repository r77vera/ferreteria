import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getDashboardStats = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get(`${API_URL}/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error.response ? error.response.data : new Error('Error fetching dashboard stats');
  }
};
