import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criando a instância do Axios
const api = axios.create({
  baseURL: 'http://192.168.0.16:5000', // Endereço do seu backend
});

// Adicionando interceptor de requisição
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho
  }
  return config;
});

// Adicionando interceptor de resposta
api.interceptors.response.use(
  (response) => response, // Se a resposta for bem-sucedida
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Token expirado ou inválido');
      AsyncStorage.removeItem('userToken'); // Limpa o token se ele for inválido ou expirado
    }
    return Promise.reject(error); // Passa o erro para o código de tratamento da chamada
  }
);

export default api;
