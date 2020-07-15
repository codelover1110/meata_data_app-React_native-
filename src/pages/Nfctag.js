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
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import AsyncStorage from "@react-native-community/async-storage";

export default function ShopScreen({ navigation }) {
  const [content, setContent] = useState('Please connect Nfc tag')
  const [connectNfc, setConnectNfc] = useState(true)
  const [conntectStatus, setConnectStatus] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.backButton}>
          {/* <Button onPress={() => _handleLogout()} title="Tilbage til Kort"  fontColor={'red'} /> */}
          <Text onPress={() => _handleLogout()} style={{ color: 'white' }} >Tilbage til Kort</Text>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    NfcManager.start();
    return function cleanup() {
      this._cleanUp();
    }

    // _cleanSuccess('7')
  });

  _handleLogout = () => {
    AsyncStorage.removeItem('check_status')
    navigation.navigate('Home')

  }

  _cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  }

  buildUrlPayload = (valueToWrite) => {
    return Ndef.encodeMessage([
      Ndef.uriRecord(valueToWrite),
    ]);
  }

  _connectNfctag = async () => {
    try {
      let resp = await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to Read your NFC tags!'
      });
      let ndef = await NfcManager.getNdefMessage();
      await NfcManager.setAlertMessageIOS('Welcome to MetaData!')
      let tag = await NfcManager.getTag();
      let nfc_id = Ndef.text.decodePayload(tag.ndefMessage[0].payload)
      if (nfc_id != '') {

        this._cleanSuccess(nfc_id);
      }
    } catch (ex) {
      this._cleanUp();
    }
  }

  _cleanSuccess = (nfc_id) => {
    navigation.navigate('Metadata',  { 
      nfc_id:  nfc_id});
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={{ width: 170, height: 170 }}
          source={require('../assets/images/logo.png')} />
      </View>
      <TouchableOpacity style={[connectNfc == false ? styles.hiddenVoteButtons : styles.nfctagButton]}
        onPress={() => this._connectNfctag()}
      >
        <Text style={styles.buttonText}>Connect Nfctag</Text>
      </TouchableOpacity>
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
    justifyContent: 'flex-end',
    alignItems: "center",

  },

  button: {
    backgroundColor: '#548235',
    width: 300,
    borderRadius: 25,
    marginVertical: 20,
    paddingVertical: 10
  },
  nfctagButton: {
    // flexGrow: 1,

    backgroundColor: '#548235',
    width: 300,
    borderRadius: 25,
    marginVertical: 150,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#ffffff'
  },

  votesendButton: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 10,

  },

  badButton: {
    backgroundColor: '#ff1744',
    width: 80,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 10,
    marginRight: 10,
  },
  middelButton: {
    backgroundColor: '#ffc107',
    width: 80,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 10,
    marginRight: 10

  },
  goodButton: {
    backgroundColor: '#558b2f',
    width: 80,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 10,
    marginRight: 10

  },

  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: "center",
  },
  showVoteButtons: {
    display: 'flex'
  },
  hiddenVoteButtons: {
    display: 'none'
  },
  textContainer: {
    // width: 300,
    borderWidth: 3,
    color: 'rgba(0, 0, 0, 0.7)',
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  backButton: {
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 20,
    marginLeft: 20,
    padding: 5
  }

});