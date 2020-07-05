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
  const [serviceBad, setServiceBad] = useState(false)
  const [serviceMiddle, setServiceMiddle] = useState(false)
  const [serviceGood, setServiceGood] = useState(false)
  const [availabilityBad, setAvailabilityBad] = useState(false)
  const [availabilityMiddle, setAvailabilityMiddle] = useState(false)
  const [availabilityGood, setAvailabilityGood] = useState(false)
  const [sectionBad, setSectionBad] = useState(false)
  const [sectionMiddle, setSectionMiddle] = useState(false)
  const [sectionGood, setSectionGood] = useState(false)
  const [connectNfc, setConnectNfc] = useState(true)
  const [conntectStatus, setConnectStatus] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(false)


  const [shopImage, setShopImage] = useState()
  const [shopName, setShopName] = useState()
  const [longtitude, setLongtitude] = useState()
  const [latitude, setLatitude] = useState()
  const [shopID, setShopID] = useState()
  const [customerID, setCustomerID] = useState()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.backButton}>
          {/* <Button onPress={() => _handleLogout()} title="Tilbage til Kort"  fontColor={'red'} /> */}
          <Text onPress={() => _handleLogout()} style={{color: 'white'}} >Tilbage til Kort</Text>
        </View>
      ),
    });
  }, [navigation]);


  useEffect(() => {
    NfcManager.start();
    return function cleanup() {
      this._cleanUp();
    }

    // _cleanSuccess('123')
  });

  _handleLogout = () => {
    AsyncStorage.removeItem('check_status')
    navigation.navigate('BACK')

  }

  _cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  }

  _cleanSuccess = (shop_ID) => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
    // setConnectNfc(false);
    let api_url = 'http://3dc37ec44ae6.ngrok.io/customershopdata/' + shop_ID;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        let shopUrl = 'http://3dc37ec44ae6.ngrok.io/media/' + responseJson.store_picture
        setShopImage({ uri: shopUrl })
        setLatitude(responseJson.latitude)
        setLongtitude(responseJson.longtitude)
        setShopID(responseJson.nfc_store_id)
        setShopName(responseJson.store_name)

        setConnectNfc(false);
        setConnectStatus(false);
      })
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
      await NfcManager.setAlertMessageIOS('Welcome to ShopVote!')
      let tag = await NfcManager.getTag();
      let nfc_shop_id = Ndef.text.decodePayload(tag.ndefMessage[0].payload)
      if (nfc_shop_id != '') {

        this._cleanSuccess(nfc_shop_id);
      }
      // console.warn(Ndef.text.decodePayload(tag.ndefMessage[0].payload))
      // console.warn((NfcManager.getTag()))
    } catch (ex) {
      // console.warn('ex', ex);
      this._cleanUp();
    }
  }



  _handleServiceButton = (serviceStatus) => {
    let serviceFontColor = "#ffffff"
    if (serviceStatus == true) {
      serviceFontColor = "#3e2723"
    }
    return {
      fontSize: 16,
      fontWeight: '500',
      color: serviceFontColor,
      textAlign: "center",
    }
  }
  _handleAvailabilityButton = (status) => {
    let fontColor = "#ffffff"
    if (status == true) {
      fontColor = "#3e2723"
    }
    return {
      fontSize: 16,
      fontWeight: '500',
      color: fontColor,
      textAlign: "center",
    }
  }
  _handleSectionButton = (status) => {
    let fontColor = "#ffffff"
    if (status == true) {
      fontColor = "#3e2723"
    }
    return {
      fontSize: 16,
      fontWeight: '500',
      color: fontColor,
      textAlign: "center",
    }
  }

  saveVoteData = (serviceStatus, availabilityStatus, selectionStatus) => {
    setSubmitStatus(true)
    let formData = new FormData();
    formData.append("cutomerID", customerID)
    formData.append("serviceStatus", serviceStatus)
    formData.append("availabilityStatus", availabilityStatus)
    formData.append("selectionStatus", selectionStatus)
    formData.append("shopName", shopName)
    formData.append("nfc_store_id", shopID)
    formData.append("longtitude", longtitude)
    formData.append("latitude", latitude)


    fetch('http://3dc37ec44ae6.ngrok.io/manageVoteData/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })
      .then((response) => response.json())
      .then(response => {
        if (response.success == "true") {
          setSubmitStatus(false)
          Alert.alert("Congratulations!", "Your successful voted!")

        } else {
          alert("Vote error")
          setSubmitStatus(false)
        }
      }).catch(err => {
        console.log(err)
      })
  }

  _handleFormSubmit = () => {
    let serviceStatus, availabilityStatus, selectionStatus
    AsyncStorage.getItem('customerID').then(value => {
      setCustomerID(value)
    }
    );
    if (serviceBad)
      serviceStatus = "Bad"
    else if (serviceMiddle)
      serviceStatus = "Middle"
    else
      serviceStatus = "Good"
    if (availabilityBad)
      availabilityStatus = "Bad"
    else if (availabilityMiddle)
      availabilityStatus = "Middle"
    else
      availabilityStatus = "Good"
    if (sectionBad)
      selectionStatus = "Bad"
    else if (sectionMiddle)
      selectionStatus = "Middle"
    else
      selectionStatus = "Good"
    let alertData = "Service :" + serviceStatus + " Availablity: " + availabilityStatus + " Selction: " + selectionStatus

    Alert.alert(
      'Do you really vote like that?',
      alertData,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => saveVoteData(serviceStatus, availabilityStatus, selectionStatus) },
      ],
      { cancelable: false },
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {connectNfc == true ? <Image style={{ width: 100, height: 100 }}
          source={require('../assets/images/logo.png')} />
          : <Image style={{ width: 300, height: 200 }}
            source={shopImage} />
        }

        {connectNfc == false ? <Text style={styles.shopNameText}>{shopName}</Text>
          : <View style={styles.textContainer}>
            <Text style={styles.logoText}>
              LIGHTUS
        </Text></View>
        }

      </View>
      <View style={[connectNfc == false ? styles.showVoteButtons : styles.hiddenVoteButtons]}>
        <View style={{ paddingBottom: 30 }}>
          {/* <Text
            style={{ height: 50, borderColor: 'gray', borderWidth: 2, width: 300, textAlign: "center" }}
          >{shopName} is a shoping centre located on latitude: {latitude}, longtitude: {longtitude}</Text> */}
        </View>
      </View>
      <View style={[connectNfc == false ? styles.showVoteButtons : styles.hiddenVoteButtons]}>
        <View style={styles.buttonGroup}>
          <Text style={styles.buttonTitle}>Service :</Text>
          <TouchableOpacity style={styles.badButton}
            onPress={() => {
              setServiceBad(true);
              setServiceMiddle(false);
              setServiceGood(false);
            }}
          >
            <Text style={this._handleServiceButton(serviceBad)}>Dårlig</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.middelButton}
            onPress={() => {
              setServiceBad(false);
              setServiceMiddle(true);
              setServiceGood(false);
            }}
          >
            <Text style={this._handleServiceButton(serviceMiddle)}>Middel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goodButton}
            onPress={() => {
              setServiceBad(false);
              setServiceMiddle(false);
              setServiceGood(true);
            }}
          >
            <Text style={this._handleServiceButton(serviceGood)}>Good</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonGroup}>
          <Text style={styles.buttonTitle}>Tilgængelighed :</Text>
          <TouchableOpacity style={styles.badButton}
            onPress={() => {
              setAvailabilityBad(true);
              setAvailabilityMiddle(false);
              setAvailabilityGood(false);
            }}
          >
            <Text style={this._handleAvailabilityButton(availabilityBad)}>Dårlig</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.middelButton}
            onPress={() => {
              setAvailabilityBad(false);
              setAvailabilityMiddle(true);
              setAvailabilityGood(false);
            }}
          >
            <Text style={this._handleAvailabilityButton(availabilityMiddle)}>Middel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goodButton}
            onPress={() => {
              setAvailabilityBad(false);
              setAvailabilityMiddle(false);
              setAvailabilityGood(true);
            }}
          >
            <Text style={this._handleAvailabilityButton(availabilityGood)}>Good</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonGroup}>
          <Text style={styles.buttonTitle}>Udvalg :</Text>
          <TouchableOpacity style={styles.badButton}
            onPress={() => {
              setSectionBad(true);
              setSectionMiddle(false);
              setSectionGood(false);
            }}
          >
            <Text style={this._handleSectionButton(sectionBad)}>Dårlig</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.middelButton}
            onPress={() => {
              setSectionBad(false);
              setSectionMiddle(true);
              setSectionGood(false);
            }}
          >
            <Text style={this._handleSectionButton(sectionMiddle)}>Middel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goodButton}
            onPress={() => {
              setSectionBad(false);
              setSectionMiddle(false);
              setSectionGood(true);
            }}
          >
            <Text style={this._handleSectionButton(sectionGood)}>Good</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[connectNfc == false ? styles.button : styles.hiddenVoteButtons]}>
        {submitStatus == true ? <ActivityIndicator size="large" color="#00ff00" />
          : <TouchableOpacity
            onPress={() => this._handleFormSubmit()} style={styles.votesendButton}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>}
      </View>

      {conntectStatus == true ? <ActivityIndicator size="large" color="#00ff00" />
        : <TouchableOpacity style={[connectNfc == false ? styles.hiddenVoteButtons : styles.nfctagButton]}
          onPress={() => this._connectNfctag()}
        >
          <Text style={styles.buttonText}>Connect Nfctag</Text>
        </TouchableOpacity>
      }

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#585858',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonGroup: {
    // flex: 1, 
    flexDirection: 'row',
    alignItems: "center"
  },

  shopNameText: {
    marginVertical: 30,
    fontSize: 25,
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: "center"
  },
  logoText: {
    marginVertical: 15,
    fontSize: 50,
    letterSpacing: 2,
    color: 'rgba(0, 0, 0, 0.7)',

  },

  buttonTitle: {
    marginVertical: 15,
    fontSize: 18,
    fontWeight: '500',
    paddingRight: 10,
    width: 100,
    textAlign: "center",
    color: "white"
  },

  logoContainer: {
    // flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: "center",

  },

  button: {
    backgroundColor: '#585858',
    width: 300,
    borderRadius: 25,
    marginVertical: 20,
    paddingVertical: 10
  },
  nfctagButton: {
    // flexGrow: 1,

    backgroundColor: '#585858',
    width: 300,
    borderRadius: 25,
    marginVertical: 150,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#000000'
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
    borderColor: '#000000',
    // fontSize: 12
    // fontColor: '#ffffff',
    // color: '#ffffff',
    borderRadius: 20,
    marginLeft: 20,
    padding: 5


  }

});