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
  Button,
  FlatList,
  Modal,
  TouchableHighlight
} from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import AsyncStorage from "@react-native-community/async-storage";


export default function Metadata({ route, navigation }) {


  const [metaData, setMetaData] = useState()
  const [modalVisible, setModalVisible] = useState(false)
  const [inputText, setInputText] = useState('')
  const [editedItem, setEditedItem] = useState(0)
  const [itemTitle, setItemTitle] = useState()
  const [rowID, setRowID] = useState()
  const [nfcTagID, setNfcTagID] = useState()


  useEffect(() => {
    const { nfc_id } = route.params;
    setNfcTagID(nfc_id)
    getMetaData(nfc_id)
  });

  getMetaData = (tag_id) => {
    let api_url = 'http://392f285c6f57.ngrok.io/editMetaData/' + tag_id;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        setRowID(responseJson.id)
        let metaData = [
          { item: 'tag_id', text: 'TagID', value: responseJson.tag_id },
          { item: 'nfc_tag', text: 'NFCTag', value: responseJson.nfc_tag },
          { item: 'media_type', text: 'MediaType', value: responseJson.media_type },
          { item: 'energy_media_type', text: 'EnergyMediaType', value: responseJson.energy_media_type },
          { item: 'meter_point_description', text: 'MeterPointDescription', value: responseJson.meter_point_description },
          { item: 'energy_unit', text: 'EnergyUnit', value: responseJson.energy_unit },
          { item: 'group', text: 'Group', value: responseJson.group },
          { item: 'column_line', text: 'CommonLine(Production)', value: responseJson.column_line },
          { item: 'meter_location', text: 'MeterLocation', value: responseJson.meter_location },
          { item: 'energy_art', text: 'EnergyArt', value: responseJson.energy_art },
          { item: 'supply_area_child', text: 'SupplyArea(Child)', value: responseJson.supply_area_child },
          { item: 'meter_level_structure', text: 'MeterLevelStructure', value: responseJson.meter_level_structure },
          { item: 'supply_area_parent', text: 'SupplyAreaParent', value: responseJson.supply_area_parent },
          { item: 'longtitude', text: 'Longtitude', value: responseJson.longtitude },
          { item: 'latitude', text: 'Latitude', value: responseJson.latitude },
        ]
        setMetaData(metaData)
      })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View>
          <TouchableOpacity onPress={() => _handleLogout()}>
            <Image style={styles.backButton}
              source={require('../assets/images/logo.png')} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  _handleLogout = () => {
    navigation.navigate('Home')
  }

  _handleEditItem = (editedItem) => {
    let newData = metaData.map(item => {
      if (item.item == editedItem) {
        item.value = inputText
        return item
      }
      return item
    })
    setMetaData(newData)
    let alertData = editedItem
    Alert.alert(
      'Are you sure to update?',
      alertData,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => _upDateMetadata(newData) },
      ],
      { cancelable: false },
    );
  }

  _upDateMetadata = (newData) => {
    console.log(newData)
    let formData = new FormData();
    formData.append("id", rowID)
    formData.append("tagID", newData[0].value)
    formData.append("nfcTag", newData[1].value)
    formData.append("mediaType", newData[2].value)
    formData.append("energyMediaType", newData[3].value)
    formData.append("meterPointDescription", newData[4].value)
    formData.append("energyUnit", newData[5].value)
    formData.append("group", newData[6].value)
    formData.append("columnLine", newData[7].value)
    formData.append("meterLocation", newData[8].value)
    formData.append("energyArt", newData[9].value)
    formData.append("supplyAreaChild", newData[10].value)
    formData.append("meterLevelStructure", newData[11].value)
    formData.append("supplyAreaParent", newData[12].value)
    formData.append("longtitude", newData[13].value)
    formData.append("latitude", newData[14].value)


    fetch('http://392f285c6f57.ngrok.io/updateMetaDataMobile/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })
      .then((response) => response.json())
      .then(response => {
        if (response.success == "true") {
          setModalVisible(false)
        } else {
          alert("update error")
        }
      }).catch(err => {
        console.log(err)
      })
  }

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => { setModalVisible(true); setInputText(item.value), setEditedItem(item.item), setItemTitle(item.text) }}
      underlayColor={'#f1f1f1'}>
      <View style={styles.item} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTitle}>
            <Text style={styles.itemTitleText}>{item.text}</Text>
          </View>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.text}>&middot; {item.value} </Text>
        </View>
      </View>
    </TouchableHighlight>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}> TagID:  </Text>
          <Text style={styles.headerTextXY}>{nfcTagID}</Text>
        </View>
        <Image style={{ width: 40, height: 40, marginLeft: '10%', marginBottom: 20 }}
          source={require('../assets/images/metabrand.png')} />
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={metaData}
          keyExtractor={(item) => item.item}
          renderItem={renderItem}
        />
      </View>
      <Modal animationType="fade" visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <View style={styles.logoContainer}>
            <Image style={{ width: 170, height: 170 }}
              source={require('../assets/images/logo.png')} />
          </View>
          <Text style={styles.modalText}></Text>
          <View style={styles.item} >
            <View style={styles.marginLeft}>
              <View style={styles.itemTitle}>
                <Text style={styles.itemTitleText}>{itemTitle}</Text>
              </View>
            </View>
            <View style={styles.itemContent}>
              <TextInput
                onChangeText={(text) => { setInputText(text); console.log('state ', inputText) }}
                defaultValue={inputText}
                editable={true}
                multiline={false}
                maxLength={200}
              />
            </View>
          </View>
          <View style={styles.modelButtonContainer}>
            <TouchableHighlight onPress={() => { _handleEditItem(editedItem); }}
              style={styles.modalButton}>
              <Text style={styles.modalText}>UPDATE</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => { setModalVisible(false) }}
              style={styles.modalButton}>
              <Text style={styles.modalText}>CANCEL</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Consumption', { nfc_id: nfcTagID })}>
          <Image style={{ width: 40, height: 40, marginLeft: '10%', marginBottom: 20 }}
            source={require('../assets/images/next.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );

}


const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#548235',
    borderRadius: 15,
    flexDirection: "row"

  },
  headerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    marginLeft: "20%"

  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerTextXY: {
    fontSize: 38,
    color: '#000000',
  },
  container: {
    backgroundColor: '#548235',
    padding: 5,
    height: '100%'
  },
  contentContainer: {
    height: '75%'
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: 5,
  },
  menu: {
    width: 20,
    height: 2,
    backgroundColor: '#111',
    margin: 2,
    borderRadius: 3,
  },
  text: {
    fontSize: 15,

  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold"

  },
  itemContent: {
    width: '55%',
    height: 35,
    backgroundColor: '#c4d3db',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  itemTitleText: {
    fontSize: 15,
    color: '#ffffff',
  },

  textInput: {
    width: '90%',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30,
    borderColor: 'gray',
    borderBottomWidth: 2,
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    backgroundColor: '#548235',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableHighlight: {
    backgroundColor: 'white',
    marginVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: 20,
    padding: 5,
    marginBottom: 15,
    width: 40,
    height: 40
  },
  itemTitle: {
    borderWidth: 2,
    padding: 10,
    width: 150,
    height: 50,
    borderColor: '#ffffff',
    borderRadius: 10,
    backgroundColor: '#5b9bd5',
    alignItems: "center",
    justifyContent: "center",

  },
  logoContainer: {
    marginBottom: '10%',
    justifyContent: 'flex-end',
    alignItems: "center",
  },
  modalButton: {
    borderWidth: 2,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
    borderRadius: 15,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    margin: 20
  },
  modelButtonContainer: {
    flexDirection: "row",
  }
})

