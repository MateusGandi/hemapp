import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login';
import AppOriginal from './src/AppOriginal';
import { AuthProvider, AuthContext } from './src/auth/AuthContext';

const Stack = createNativeStackNavigator();

function Routes() {
  const [token, setToken] = React.useState(null);
  const { userToken, logout } = useContext(AuthContext);

  useEffect(() => {
    console.log('User Token in Routes:', userToken);
    setToken(userToken);
  }, [userToken]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="MainApp" component={AppOriginal} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}
