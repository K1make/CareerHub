import { pricingPlans, companyPricingPlans, pythonTestQuestions } from '../data/mockData';

const ACCESS_TOKEN_KEY = 'careerhub_access_token';
const REFRESH_TOKEN_KEY = 'careerhub_refresh_token';
const API_URL = 'http://localhost:8000/api/auth';

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

function setRefreshToken(token) {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

async function request(path, options = {}) {
  const token = getAccessToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body instanceof FormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
  });

  if (!response.ok) {
    let errorMsg = 'Ошибка запроса';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.error || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getAccessToken,
  setAccessToken,
  async login(payload) {
    const data = await request('/login/', { method: 'POST', body: payload });
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    return data;
  },
  async register(payload) {
    const data = await request('/register/', { method: 'POST', body: payload });
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    return data;
  },
  logout() {
    setAccessToken(null);
    setRefreshToken(null);
    return Promise.resolve(null);
  },
  me() {
    return request('/me/');
  },
  updateProfile(data) {
    return request('/me/', { method: 'PATCH', body: data });
  },
  deleteProfile() {
    return request('/me/', { method: 'DELETE' });
  },
  companies() {
    return request('/companies/');
  },
  candidates() {
    return request('/candidates/');
  },
  candidateProfile(id) {
    return request(`/candidates/${id}/`);
  },
  pricing(audience) {
    // Keep mock for pricing
    if (audience === 'company') return Promise.resolve(companyPricingPlans);
    return Promise.resolve(pricingPlans);
  },
  pythonTest() {
    // Keep mock for tests
    return Promise.resolve(pythonTestQuestions);
  },
  submitPythonTest(answers) {
    return Promise.resolve({ score: 80, passed: true });
  },
  inviteCandidate(candidate) {
    return Promise.resolve({ success: true });
  },
  myVacancies() {
    return request('/my-vacancies/');
  },
  createVacancy(payload) {
    return request('/my-vacancies/', { method: 'POST', body: payload });
  },
  allVacancies() {
    return request('/vacancies/');
  },
  companyProfile(id) {
    return request(`/companies/${id}/`);
  },
};
