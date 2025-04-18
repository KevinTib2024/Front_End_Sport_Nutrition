import { useState } from 'react';
import { message } from 'antd';
import myApi from '../assets/lib/axios/miApi';

interface IloginForm {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async (formLogin: IloginForm) => {
    setLoading(true);
    try {
      const response = await myApi.post("/Login", formLogin);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Guarda el token
        message.success('Inicio de sesión exitoso');
        return true; // Retorna true si el inicio de sesión es exitoso
      } else {
        message.error('Credenciales incorrectas');
        return false;
      }
    } catch (error) {
      message.error('Error al iniciar sesión');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
