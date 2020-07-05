import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar
} from 'react-native';

import Routes from './src/routes/MainRoute';
import Shopvote from './src/pages/Shopvote';

function App() {
  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor="#1c313a"
        barStyle="light-content"
      />
      <Routes />
      {/* <Shopvote /> */}
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});