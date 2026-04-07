const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Tipos de datos del backend
export interface BackendUser {
  id: number;
  nombre: string;
  correo: string;
}

export interface BackendCategory {
  id: number;
  nombre: string;
  descripcion: string;
  idUsuario?: number;
}

export interface BackendTransaction {
  id: number;
  idUsuario: number;
  idCategoria: number;
  tipo: 'INGRESO' | 'GASTO';
  descripcion?: string;
  monto: string;
  fecha: string;
}

export interface BackendBudget {
  id: number;
  idUsuario: number;
  idCategoria?: number;
  montoLimite: number;
  montoGastado: number;
  mes: string;
}

// Helper para obtener el token almacenado
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper para crear headers con autenticación
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Helper para manejar respuestas
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 401 || response.status === 403) {
    // Token inválido o expirado - limpiar y redirigir
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Error ${response.status}`);
  }

  // Si es un texto plano (como el token), devolverlo directamente
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/plain')) {
    const text = await response.text();
    return text as T;
  }

  // Si no hay contenido, devolver null
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
};

// ===== USUARIOS =====

export const registerUser = async (
  nombre: string,
  correo: string,
  clave: string
): Promise<BackendUser> => {
  const response = await fetch(`${BASE_URL}/usuarios/registro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, correo, clave }),
  });

  return handleResponse<BackendUser>(response);
};

export const loginUser = async (
  correo: string,
  clave: string
): Promise<string> => {
  const response = await fetch(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo, clave }),
  });

  return handleResponse<string>(response);
};

export const logoutUser = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/usuarios/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  await handleResponse<void>(response);

  // Limpiar almacenamiento local
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// ===== CATEGORÍAS =====

export const createCategory = async (
  nombre: string,
  descripcion: string
): Promise<BackendCategory> => {
  const response = await fetch(`${BASE_URL}/categorias`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ nombre, descripcion }),
  });

  return handleResponse<BackendCategory>(response);
};

export const getUserCategories = async (
  idUsuario: number
): Promise<BackendCategory[]> => {
  const response = await fetch(`${BASE_URL}/categorias/usuario/${idUsuario}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<BackendCategory[]>(response);
};

// ===== TRANSACCIONES =====

export const createTransaction = async (
  idCategoria: number,
  tipo: 'INGRESO' | 'GASTO',
  monto: string,
  descripcion?: string
): Promise<BackendTransaction> => {
  const response = await fetch(`${BASE_URL}/transacciones`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      idCategoria,
      tipo,
      monto,
      descripcion
    }),
  });

  return handleResponse<BackendTransaction>(response);
};

export const getUserTransactions = async (
  idUsuario: number
): Promise<BackendTransaction[]> => {
  const response = await fetch(`${BASE_URL}/transacciones/usuario/${idUsuario}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<BackendTransaction[]>(response);
};

// ===== PRESUPUESTOS =====

export const createOrUpdateGlobalBudget = async (
  montoLimite: number
): Promise<BackendBudget> => {
  const response = await fetch(`${BASE_URL}/presupuestos/global`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ montoLimite }),
  });

  return handleResponse<BackendBudget>(response);
};

export const createOrUpdateCategoryBudget = async (
  idCategoria: number,
  montoLimite: number
): Promise<BackendBudget> => {
  const response = await fetch(`${BASE_URL}/presupuestos/categoria`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ idCategoria, montoLimite }),
  });

  return handleResponse<BackendBudget>(response);
};

export const getUserBudgets = async (
  idUsuario: number
): Promise<BackendBudget[]> => {
  const response = await fetch(`${BASE_URL}/presupuestos/usuario/${idUsuario}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<BackendBudget[]>(response);
};

// ===== HELPERS DE ALMACENAMIENTO =====

export const saveAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const saveUser = (user: BackendUser): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getStoredUser = (): BackendUser | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const clearAuth = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};
