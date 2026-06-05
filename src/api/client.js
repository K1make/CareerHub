import { companies, candidates, pricingPlans, companyPricingPlans, pythonTestQuestions } from '../data/mockData';

const ACCESS_TOKEN_KEY = 'careerai_access_token';
const MOCK_DB_USERS = 'careerai_mock_users';

function getMockUsers() {
  try {
    return JSON.parse(localStorage.getItem(MOCK_DB_USERS) || '[]');
  } catch {
    return [];
  }
}

function saveMockUsers(users) {
  localStorage.setItem(MOCK_DB_USERS, JSON.stringify(users));
}

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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(path, options = {}) {
  await delay(500); // Simulate network latency

  const token = getAccessToken();
  const body = options.body;
  const method = options.method || 'GET';

  // --- MOCK BACKEND ROUTING ---

  if (path === '/register/' && method === 'POST') {
    const users = getMockUsers();
    if (users.find(u => u.email === body.email)) {
      throw new Error('Пользователь с таким email уже существует');
    }
    const newUser = {
      id: Date.now(),
      email: body.email,
      password: body.password,
      role: body.role || 'student',
      name: body.email.split('@')[0],
      first_name: body.first_name || '',
      last_name: body.last_name || '',
    };
    users.push(newUser);
    saveMockUsers(users);
    
    const fakeToken = `mock-token-${newUser.id}`;
    return { access: fakeToken, user: { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name, first_name: newUser.first_name, last_name: newUser.last_name } };
  }

  if (path === '/login/' && method === 'POST') {
    const users = getMockUsers();
    const user = users.find(u => u.email === body.email && u.password === body.password);
    if (!user) {
      throw new Error('Неверный email или пароль');
    }
    const fakeToken = `mock-token-${user.id}`;
    return { access: fakeToken, user: { id: user.id, email: user.email, role: user.role, name: user.name, first_name: user.first_name, last_name: user.last_name } };
  }

  if (path === '/me/' && method === 'GET') {
    if (!token) throw new Error('Unauthorized');
    const users = getMockUsers();
    const userId = parseInt(token.replace('mock-token-', ''));
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return { user: { id: user.id, email: user.email, role: user.role, name: user.name, first_name: user.first_name, last_name: user.last_name } };
  }

  if (path === '/logout/' && method === 'POST') {
    return { success: true };
  }

  if (path === '/companies/' && method === 'GET') {
    return companies;
  }

  if (path === '/candidates/' && method === 'GET') {
    return candidates;
  }

  if (path.startsWith('/pricing/') && method === 'GET') {
    const url = new URL(`http://localhost${path}`);
    const audience = url.searchParams.get('audience');
    if (audience === 'company') return companyPricingPlans;
    return pricingPlans;
  }

  if (path === '/tests/python/' && method === 'GET') {
    return pythonTestQuestions;
  }
  
  if (path === '/tests/python/submit/' && method === 'POST') {
     return { score: 80, passed: true };
  }
  
  if (path === '/invitations/' && method === 'POST') {
     return { success: true };
  }

  throw new Error(`404 Not Found: ${path}`);
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
