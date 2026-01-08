const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name: string, email: string, password: string) => {
    return fetchWithAuth('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  getProfile: async () => {
    return fetchWithAuth('/api/auth/profile');
  },
};

// Surveys API
export const surveysApi = {
  getAll: async () => {
    return fetchWithAuth('/api/surveys');
  },

  getById: async (id: number) => {
    return fetchWithAuth(`/api/surveys/${id}`);
  },

  create: async (data: { title: string; description?: string }) => {
    return fetchWithAuth('/api/surveys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: { title?: string; description?: string }) => {
    return fetchWithAuth(`/api/surveys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return fetchWithAuth(`/api/surveys/${id}`, {
      method: 'DELETE',
    });
  },

  addQuestion: async (surveyId: number, data: {
    question_text: string;
    question_type: string;
    options?: string[];
    required?: boolean;
  }) => {
    return fetchWithAuth(`/api/surveys/${surveyId}/questions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getQuestions: async (surveyId: number) => {
    return fetchWithAuth(`/api/surveys/${surveyId}/questions`);
  },
};

// Responses API
export const responsesApi = {
  submit: async (data: {
    survey_id: number;
    question_id: number;
    answer_text: string;
  }) => {
    return fetchWithAuth('/api/responses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getBySurvey: async (surveyId: number) => {
    return fetchWithAuth(`/api/surveys/${surveyId}/responses`);
  },

  getByQuestion: async (questionId: number) => {
    return fetchWithAuth(`/api/questions/${questionId}/responses`);
  },
};

// Users API
export const usersApi = {
  getAll: async () => {
    return fetchWithAuth('/api/users');
  },

  getById: async (id: number) => {
    return fetchWithAuth(`/api/users/${id}`);
  },

  update: async (id: number, data: { name?: string; email?: string }) => {
    return fetchWithAuth(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return fetchWithAuth(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  auth: authApi,
  surveys: surveysApi,
  responses: responsesApi,
  users: usersApi,
};
