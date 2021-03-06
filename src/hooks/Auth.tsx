import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface AuthState {
  token: string;
  userWithoutPassword: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  userWithoutPassword: object;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, userWithoutPassword] = await AsyncStorage.multiGet([
        '@GoBarber:token','@GoBarber:user'
      ]);


      if(token[1] && userWithoutPassword[1]){
        setData({
          token: token[1], 
          userWithoutPassword: JSON.parse(userWithoutPassword[1])})
      }
     setLoading(false);
         
    }

    loadStorageData();
  },[]);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, userWithoutPassword } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(userWithoutPassword)]
    ]);
   

    setData({ token, userWithoutPassword });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token','@GoBarber:user']);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{ userWithoutPassword: data.userWithoutPassword, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
export { AuthProvider, useAuth };
