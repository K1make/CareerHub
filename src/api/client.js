const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/auth';
const ACCESS_TOKEN_KEY = 'careerai_access_token';

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(token) {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAccessToken();

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
    body: options.body && !(options.body instanceof FormData)
      ? JSON.stringify(options.body)
      : options.body,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message = data?.detail || data?.non_field_errors?.[0] || 'API request failed';
    throw new Error(message);
  }

  return data;
}

export const api = {
  getAccessToken,
  setAccessToken,
  login(payload) {
    return request('/login/', { method: 'POST', body: payload });
  },
  register(payload) {
    return request('/register/', { method: 'POST', body: payload });
  },
  logout() {
    return request('/logout/', { method: 'POST' }).catch(() => null);
  },
  me() {
    return request('/me/');
  },
  companies() {
    return request('/companies/');
  },
  candidates() {
    return request('/candidates/');
  },
  pricing(audience) {
    return request(`/pricing/?audience=${encodeURIComponent(audience)}`);
  },
  pythonTest() {
    return request('/tests/python/');
  },
  submitPythonTest(answers) {
    return request('/tests/python/submit/', { method: 'POST', body: { answers } });
  },
  inviteCandidate(candidate) {
    return request('/invitations/', { method: 'POST', body: { candidate } });
  },
};
