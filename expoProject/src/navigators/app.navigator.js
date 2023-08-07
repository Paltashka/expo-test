import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/LoginScreen';
import Profile from '../screens/ProfileScreen';
import { useAuth } from '../utils/context';

const Stack = createStackNavigator();

export default function AppNavigator() {
    const { authData } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName={authData ? Profile : Login}>
                {authData ?
                    <Stack.Screen name={'Profile'} component={Profile} /> :
                    <Stack.Screen name={'Login'} component={Login} />
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
}
