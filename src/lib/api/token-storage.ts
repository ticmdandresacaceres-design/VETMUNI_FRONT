import Cookies from 'js-cookie';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

export const tokenStorage = {
  // Guardar tokens
  setTokens: (token: string) => {
    // Guardar en localStorage como respaldo
    localStorage.setItem(TOKEN_KEY, token);

    // Guardar en cookies (más seguro para SSR)
    Cookies.set(TOKEN_KEY, token, { 
      expires: 1, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  // Obtener token
  getToken: (): string | null => {
    return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  },

  // Guardar usuario
  setUser: (user: unknown) => {
    const userString = JSON.stringify(user);
    localStorage.setItem(USER_KEY, userString);
    Cookies.set(USER_KEY, userString, {
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  // Obtener usuario
  getUser: () => {
    const userString = Cookies.get(USER_KEY) || localStorage.getItem(USER_KEY);
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Limpiar todo
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  }
};