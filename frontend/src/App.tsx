import React, { useState, useEffect } from 'react';
import GestorMercadoLandingPage from './GestorMercadoLandingPage';
import Dashboard from './Dashboard';
import Login from './Login';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gestormercado_token'));

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setToken(localStorage.getItem('gestormercado_token'));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    setToken(localStorage.getItem('gestormercado_token'));
  };

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    navigateTo('/dashboard');
  };

  // Redirecionamento da rota /dashboard se não autenticado
  if (currentPath === '/dashboard') {
    if (!token) {
      // Redireciona para /login
      window.history.replaceState({}, '', '/login');
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    return <Dashboard />;
  }

  // Rota de login
  if (currentPath === '/login') {
    if (token) {
      // Se já estiver logado, redireciona para o dashboard
      window.history.replaceState({}, '', '/dashboard');
      return <Dashboard />;
    }
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Landing page principal (/)
  return <GestorMercadoLandingPage />;
}

