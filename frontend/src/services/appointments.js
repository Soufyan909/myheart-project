import axios from 'axios';

const API_URL = process.env.REACT_APP_APPOINTMENTS_URL || 'http://localhost:3002';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No token found in localStorage');
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

const handleError = (error) => {
  console.error('Appointment service error:', {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
    headers: error.response?.headers
  });
  throw error;
};

export const appointmentsService = {
  // Get all appointments for the current user
  getAppointments: async () => {
    try {
      console.log('Fetching appointments from:', `${API_URL}/api/appointments`);
      console.log('Headers:', getAuthHeader());
      
      const response = await axios.get(`${API_URL}/api/appointments`, {
        headers: getAuthHeader()
      });
      
      console.log('Appointments response:', response.data);
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  // Create a new appointment
  createAppointment: async (appointmentData) => {
    try {
      console.log('Creating appointment with data:', appointmentData);
      const response = await axios.post(`${API_URL}/api/appointments`, appointmentData, {
        headers: getAuthHeader()
      });
      console.log('Create appointment response:', response.data);
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  // Get a specific appointment by ID
  getAppointment: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments/${id}`, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update an appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await axios.put(`${API_URL}/api/appointments/${id}`, appointmentData, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cancel an appointment
  cancelAppointment: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/api/appointments/${id}/cancel`, {}, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Complete an appointment
  completeAppointment: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/api/appointments/${id}/complete`, {}, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get appointments by date range
  getAppointmentsByDateRange: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments/range`, {
        params: { startDate, endDate },
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get appointments by status
  getAppointmentsByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments/status/${status}`, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 