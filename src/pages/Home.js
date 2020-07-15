import React, { Component, useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Button
} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";

export default function Home({ navigation }) {

  _handleLogout = () => {
    AsyncStorage.removeItem('check_status')
    navigation.navigate('BACK')

  }
  _handlegoScan = (route) => {
    navigation.navigate(route)
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => { AsyncStorage.removeItem('check_status'); _handlegoScan('BACK')}}>
          <Image style={{ width: 170, height: 170 }}
            source={require('../assets/images/logo.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => _handlegoScan('Nfctag')}>
          <View style={styles.itemTextStyle}>
            <Text style={styles.textStyle}>SCAN</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => _handlegoScan('Nfctag')}>
          <Image style={styles.itemImageStyle}
            source={require('../assets/images/nfc.png')} />
        </TouchableOpacity>

      </View>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => _handlegoScan('Location')}>
          <Image style={styles.itemImageStyle}
            source={require('../assets/images/location.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => _handlegoScan('Location')}>
          <View style={styles.itemTextStyle}>
            <Text style={styles.textStyle}>LOCATION</Text>
          </View>
        </TouchableOpacity>
      </View>

    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#548235',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    // flexGrow: 1,
    marginTop: 20,
    justifyContent: 'flex-end',
    alignItems: "center",

  },
  itemImageStyle: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 25,
    backgroundColor: '#ffffff',
    marginBottom: 20
  },
  itemTextStyle: {

    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  backButton: {
    borderWidth: 2,
    borderColor: '#ffffff',
    // fontSize: 12
    // fontColor: '#ffffff',
    // color: '#ffffff',
    borderRadius: 20,
    marginLeft: 20,
    padding: 5


  }

});