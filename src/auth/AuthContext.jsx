import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('userToken').then(t => {
      if (t) setUserToken(t);
    });
  }, []);

  const login = async params => {
    const { username, password } = params;
    if (!username || !password) {
      Alert.alert('Dados incompletos', 'Preencha todos os campos para logar');
      return;
    }
    await axios
      .post(`${'https://91f4b7ce10ac.ngrok-free.app'}/auth/login`, {
        username,
        password,
      })
      .then(async ({ data: { token } }) => {
        console.log(token);
        await AsyncStorage.setItem('userToken', token);
        setUserToken(token);
      })
      .catch(error => {
        Alert.alert('Credenciais erradas', 'Verifique seu usuário e senha');
        console.log('erro ao logar usuario', error);
      });
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
  };

  const create = async params => {
    const { username, password, uf } = params;
    if (!username || !password || !uf) {
      Alert.alert(
        'Dados incompletos',
        'Preencha todos os campos para criar a conta',
      );
      return;
    }
    await axios
      .post(`${'https://91f4b7ce10ac.ngrok-free.app'}/auth/register`, {
        nome: username,
        username: username,
        password: password,
        uf: uf,
      })
      .then(() => login({ password, username }))
      .catch(error => {
        Alert.alert(
          'Erro interno',
          'Não foi possível criar a conta nesse momento, tente novamente mais tarde',
        );
        console.log('erro ao criar usuario', error);
      });
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, create }}>
      {children}
    </AuthContext.Provider>
  );
}
