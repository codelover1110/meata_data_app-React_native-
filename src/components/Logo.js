import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

function Logo() {
  return (
    <View style={styles.container}>
      {/* <Image
        style={styles.logoImage}
        source={require('../assets/images/logo.png')}
      /> */}
      <Text style={styles.logoText}>
        ShopVote
      </Text>
    </View>
  );
}

export default Logo;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: "center"
  },
  logoText: {
    marginVertical: 15,
    fontSize: 25,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  logoImage: {
    width: 100,
    height: 100
  }

});