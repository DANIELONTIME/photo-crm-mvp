// src/services/authService.js

// A URL do seu backend. Lembre-se que vamos configurar isso com variáveis de ambiente depois.
// Por enquanto, use a URL direta do seu Render.
const API_URL = process.env.REACT_APP_API_URL || 'https://photo-crm-api.onrender.com';

const register = async (name, email, password ) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    // Se o registro for bem-sucedido, você pode querer logar o usuário automaticamente
    // ou apenas retornar uma mensagem de sucesso.
    // Para o MVP, vamos apenas retornar a resposta.
    return data;
  } else {
    throw new Error(data.message || 'Erro no registro');
  }
};

const login = async (email, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    // Se o login for bem-sucedido, armazene o token JWT
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } else {
    throw new Error(data.message || 'Erro no login');
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
