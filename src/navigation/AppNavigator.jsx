// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';

import AuthStack from './AuthStack';
import BottomTabNavigator from './BottomTabNavigator';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <NavigationContainer>
      {user ? <BottomTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;