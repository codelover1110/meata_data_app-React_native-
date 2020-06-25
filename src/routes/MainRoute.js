import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle, HeaderBackButton } from '@react-navigation/stack';
import { browserHistory } from 'react-router'

import Logroute from '../routes/LogRoute';
import Shopvote from '../pages/Shopvote';


const Stack = createStackNavigator();



function App() {
  const handleLogout = (navigation) => {
    navigation.Screen('BACK')
    
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogOut">
        <Stack.Screen
          name="BACK"
          component={Logroute}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Shopvote"
          component={Shopvote}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: 'white'
            },
            // headerLeft: () => (
            //   <Button
            //     onPress={(navigation) => handleLogout(navigation)}
            //     title="LOGOUT"
            //     color="red"
            //   />
            // ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
