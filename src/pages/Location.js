import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Keyboard } from "react-native";

import MapView, { Marker } from "react-native-maps";

const App = ({ navigation }) => {

  const [metaDatas, setMetaDatas] = useState([])
  const [tagID, setTagID] = useState('')
  const [tagType, setTagType] = useState('')
  const [searchContent, setSearchContent] = useState('')
  const [tempMetaData, setTempMetaData] = useState()

  useEffect(() => {
    getMetaDatas()
  }, []);

  getMetaDatas = () => {
    let api_url = 'http://392f285c6f57.ngrok.io/getMetaDatas/';
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        setMetaDatas(responseJson)
        setTempMetaData(responseJson)
      })
  }

  _handleSearch = () => {
    if (searchContent == '') {
      return
    }
    setMetaDatas(tempMetaData)
    let searchData = (metaDatas => metaDatas.filter(x => x.tag_id == searchContent || x.column_line == searchContent
      || x.energy_art == searchContent || x.latitude == searchContent || x.longtitude == searchContent
      || x.media_type == searchContent || x.meta_data_picture == searchContent || x.meter_level_structure == searchContent
      || x.meter_location == searchContent || x.meter_point_description == searchContent || x.nfc_tag == searchContent
      || x.supply_area_child == searchContent || x.supply_area_parent == searchContent))
    setMetaDatas(searchData)
  }

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  _handleMarker = (metaData) => {
    console.log(metaData["tag_id"], "000000000")
    setTagID(metaData["tag_id"])
    setTagType(metaData["media_type"])

  }

  _handleSearchContent = (text) => {
    setSearchContent(text)
    if (text == '') {
      setMetaDatas(tempMetaData)
    }
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image style={styles.backButton}
              source={require('../assets/images/logo.png')} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  _goConsumption = () => {
    if (tagID == '') {
      alert("Select Tag!")
      return
    }
    navigation.navigate('Consumptionlocation', { nfc_id: tagID })
  }
  _goMeataData = () => {
    if (tagID == '') {
      alert("Select Tag!")
      return
    }
    navigation.navigate('Metadata', { nfc_id: tagID })
  }

  mapStyle = [{ "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }];

  return (
    <View style={styles.container}>
      <View style={styles.item} >

        <View style={styles.searchContent}>
          <TextInput
            onChangeText={(text) => { _handleSearchContent(text) }}
            editable={true}
            multiline={false}
            maxLength={200}
            placeholder="search..."
            autoCapitalize="none"
          />
        </View>
        <View>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _handleSearch()}>
              <Image style={styles.searchButton}
                source={require('../assets/images/search.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <MapView
        style={styles.map}
        initialRegion={region}
        customMapStyle={mapStyle}
      >
        {/* <CustomMarker /> */}
        {metaDatas.length > 0 ? metaDatas.map((metaData) =>
          <Marker
            draggable
            coordinate={{
              latitude: parseFloat(metaData["latitude"]),
              longitude: parseFloat(metaData["longtitude"]),
            }}
            onDragEnd={(e) => _handleMarker(e, metaData)}
            title={'TagID: ' + metaData["tag_id"]}
            // description={'Location: ' + metaData["meter_location"]}
            image={require('../assets/images/degreeday.png')}
            onTouchStart={() => _handleMarker(metaData)}
            key={metaData["id"]}
          />) : <Marker
            draggable
            coordinate={{
              latitude: 0,
              longitude: 0,
            }}
            image={require('../assets/images/degreeday.png')}
          />}
      </MapView>
      <View style={styles.itemTag} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTagTitle}>
            <Text style={styles.itemTitleText}>TagID :</Text>
          </View>
        </View>

        <View style={styles.itemContent}>
          <TextInput
            editable={false}
            multiline={false}
            maxLength={200}
            value={tagID}
          />
        </View>
        {/* <View>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _handleLogout()}>
              <Image style={styles.searchButton}
                source={require('../assets/images/search.png')} />
            </TouchableOpacity>
          </View>
        </View> */}
      </View>
      <View style={styles.itemTagType} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTagTitle}>
            <Text style={styles.itemTitleText}>Type :</Text>
          </View>
        </View>

        <View style={styles.itemContent}>
          <TextInput
            editable={false}
            multiline={false}
            maxLength={200}
            value={tagType}
          />
        </View>
        {/* <View>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _handleLogout()}>
              <Image style={styles.searchButton}
                source={require('../assets/images/search.png')} />
            </TouchableOpacity>
          </View>
        </View> */}
      </View>
      <View style={styles.buttonGroup} >
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _goConsumption()}>
              <Image style={styles.buttonSerial}
                source={require('../assets/images/service.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _goConsumption()}>
              <Image style={styles.buttonSerial}
                source={require('../assets/images/consumption.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={() => _goMeataData()}>
          <Image style={{ width: 40, height: 40, marginRight: '70%', marginBottom: 10 }}
            source={require('../assets/images/next.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#548235'
  },
  map: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    bottom: '40%',
  },

  backButton: {
    marginLeft: 20,
    padding: 5,
    marginBottom: 15,
    width: 40,
    height: 40
  },
  item: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    justifyContent: "center",
    top: 10,
    width: '80%'
  },
  itemTag: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    bottom: '33%',
    justifyContent: "center",
    width: '60%'
  },
  itemTagType: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    bottom: '27%',
    justifyContent: "center",
    width: '60%'
  },
  buttonGroup: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    bottom: '12%',
    justifyContent: "center",
    width: '60%'
  },
  marginLeft: {
    marginLeft: 5,
  },
  text: {
    fontSize: 15,

  },

  itemContent: {
    width: '80%',
    height: 35,
    backgroundColor: '#ffffff',
    justifyContent: "center",
  },

  searchContent: {
    width: '80%',
    height: 35,
    backgroundColor: '#ffffff',
    justifyContent: "center",
    paddingLeft: 10,
    // borderTopLeftRadius: 5,
    // borderBottomLeftRadius: 5
  },
  searchButton: {
    width: 35,
    height: 35
  },
  buttonSerial: {
    width: 65,
    height: 65,
  },
  itemTagTitle: {
    borderWidth: 1,
    width: 80,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    paddingLeft: 10
  },
  buttonGroupContainer: {
    marginLeft: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 15,
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    alignItems: "center",
    justifyContent: "center"
  }

});

export default App;