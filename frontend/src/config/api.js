const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const APPOINTMENTS_URL = process.env.REACT_APP_APPOINTMENTS_URL || 'http://localhost:3002';
const CHAT_URL = process.env.REACT_APP_CHAT_URL || 'http://localhost:3003';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/api/auth/login`,
    REGISTER: `${API_URL}/api/auth/register`,
    PROFILE: `${API_URL}/api/auth/profile`,
  },
  APPOINTMENTS: {
    BASE: `${APPOINTMENTS_URL}/appointments`,
    CREATE: `${APPOINTMENTS_URL}/appointments`,
    LIST: `${APPOINTMENTS_URL}/appointments`,
    UPDATE: (id) => `${APPOINTMENTS_URL}/appointments/${id}`,
    DELETE: (id) => `${APPOINTMENTS_URL}/appointments/${id}`,
  },
  CHAT: {
    MESSAGES: `${CHAT_URL}/messages`,
    SEND: `${CHAT_URL}/messages/send`,
  },
};

export default API_ENDPOINTS; 