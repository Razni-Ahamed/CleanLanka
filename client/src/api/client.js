import axios from 'axios';

const TOKEN_KEY = 'cleanlk_token';

// The token lives in localStorage because the API is deployed on a different
// origin to the client, where a session cookie would need third-party cookie
// support to survive.
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // A browser with storage blocked still works for the current page load.
  }
}

let onUnauthorized = null;

// Lets AuthContext hook into rejected tokens so an expired session clears the
// signed-in user everywhere instead of only failing the request that noticed.
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 on the sign-in call itself is just a wrong password, not a dead session.
    const isAuthAttempt = error.config?.url?.includes('/api/auth/');

    if (error.response?.status === 401 && !isAuthAttempt && onUnauthorized) {
      onUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default api;
