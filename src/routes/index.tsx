import React from 'react';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes'

import { useAuth } from '../hooks/Auth'

const Routes: React.FC = () => {
  const {userWithoutPassword } =  useAuth();

  return userWithoutPassword ? <AppRoutes/> : <AuthRoutes />
}

export default Routes;
