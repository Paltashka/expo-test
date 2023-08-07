import React from 'react';
import AppNavigator from './src/navigators/app.navigator';
import { AuthProvider } from './src/utils/context';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

