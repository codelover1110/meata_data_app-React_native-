import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import SelectInput from 'react-native-select-input-ios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logo from '../components/Logo';

function Register(props) {
  console.log(props)

  const selectOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ]

  const selectOptions1 = []

  for (let i=1980; i<=2020; i++) {
      selectOptions1.push({ value: (''+i), label: (''+i)})
  }

  const [selectOption, setSelectOption] = useState('Male')
  const [selectOption1, setSelectOption1] = useState('1990')
  const [signEmail, setSignEmail] = useState('')
  const [signPassword, setSignPassword] = useState('')
  const [signName, setSignName] = useState('')
  const [signAge, setSignAge] = useState('')
  const [signLoading, setSignLoading] = useState('')

  _handleFormSubmit = () => {
    let formData = new FormData();
    formData.append("gender", selectOption)
    formData.append("email", signEmail)
    formData.append("password", signPassword)
    formData.append("name", signName)
    formData.append("age", selectOption1)
    console.log(formData);
    if (signEmail == '' || signPassword == ''
      || signName == '') {
      alert("You have to input your information correctly!")
    } else {
      setSignLoading(true)
      fetch('http://8284d74e6474.ngrok.io/adduser/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      })
        .then((response) => response.json())
        .then(response => {
          setSignLoading(false)
          if (response.success == "true") {

            alert("Congratulations!  Your successful Registered!")
            setSignName('');
            setSignPassword('');
            setSignAge('');
            setSignEmail('');
            props.navigation.navigate('Login')
          } else {
            alert("Your email already registed!")
          }
          console.log(response)
        }).catch(err => {
          console.log(err)
        })
    }
  }


  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.registerContainer}>
        <View style={styles.itemcontainer}>
          <Icon
            style={styles.imgIcon} name="email" size={20} color='#000'
          />
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Email"
            placeholderTextColor="#ffffff"
            keyboardType="email-address"
            onSubmitEditing={() => this.password.focus()}
            returnKeyLabel={"next"}
            onChangeText={(text) => setSignEmail(text)}
          />
        </View>
        <View style={styles.itemcontainer}>
          <Icon
            style={styles.imgIcon} name="keyboard" size={20} color='#000'
          />
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Password"
            placeholderTextColor="#ffffff"
            ref={(input) => this.password = input}
            returnKeyLabel={"next"}
            onChangeText={(text) => setSignPassword(text)}
          />
        </View>
        <View style={styles.itemcontainer}>
          <Icon
            style={styles.imgIcon} name="person" size={20} color='#000'
          />
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Name"
            placeholderTextColor="#ffffff"
            returnKeyLabel={"next"}
            onChangeText={(text) => setSignName(text)}
          />
        </View>
        <View style={styles.itemcontainer}>
          <Icon
            style={styles.imgIcon} name="face" size={20} color='#000'
          />
          <View style={styles.selectBoxContainer}>
            <SelectInput
              value={selectOption1}
              options={selectOptions1}
              onSubmitEditing={(value) => setSelectOption1(value)}
              style={styles.selectInput}
            />
          </View>
        </View>
        <View style={styles.itemcontainer}>
          <Icon
            style={styles.imgIcon} name="group" size={20} color='#000'
          />
          <View style={styles.selectBoxContainer}>
            <SelectInput
              value={selectOption}
              options={selectOptions}
              onSubmitEditing={(value) => setSelectOption(value)}
              style={styles.selectInput}
            />
          </View>
        </View>
        {signLoading == true ? <ActivityIndicator size="large" color="#00ff00" />
          : <TouchableOpacity style={styles.button}
            onPress={() => _handleFormSubmit()}>
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#546e7a',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  registerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: "center"
  },

  inputBox: {
    width: 300,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000000',
    marginVertical: 16
  },

  selectBox: {
    width: 300,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    paddingHorizontal: 10,
    // fontSize: 16,
    color: 'red',
    marginVertical: 16
  },

  selectBoxContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: 30,
    // borderWidth: 1,
    borderColor: '#bdc3c7',
    overflow: 'hidden',
    marginVertical: 5,

  },

  button: {
    backgroundColor: '#1c313a',
    width: 300,
    borderRadius: 25,
    marginVertical: 20,
    paddingVertical: 10,
    marginLeft: 30
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: "center"
  },
  itemcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imgIcon: {
    padding: 10
  },
  selectInput: {
    flexDirection: 'row',
    height: 40,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 300,
  },
  selectInputLarge: {
    width: '100%',
    paddingHorizontal: 16
  }
});

export default Register;