'use strict';

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button, Alert, Image, BackHandler, ActivityIndicator, TouchableOpacity, } from 'react-native';

import * as firebase from 'firebase'
import QRCodeScanner from 'react-native-qrcode-scanner';
import {getUserDetails, updateSessionId, searchSessionId} from '../components/RealTimeDatabase'

class QRCode extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "QRCODE",
    tabBarIcon: ({tintColor}) => (
      <Image
        source = {require('../icons/qr.png')}
        style = {{width:18, height:18, tintColor: tintColor}}>
      </Image>
    )
  }

  constructor(props){
    super(props);
    this.state ={
      currentState: 'Page',
      dataqr: '',
      status: 'Ready',
      ready: false,
    }
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    this.setState({ready: true})
    })
  }

  _onLearnMore = async(sessionId) =>{
    this.setState({ready: false})
    var data = await searchSessionId(sessionId)
    console.log(data)
    if (data[0] == null){
        Alert.alert("Error", "Please scan again",[{text: 'Continue', onPress: this.retry}]);
    }else{
      var user = firebase.auth().currentUser;
      var wait2 = await updateSessionId(sessionId, user.uid)
      this.props.navigation.navigate('Home')
    }
    //const user = await getUserDetails(userid)
    //this.props.navigation.navigate('Details', { ...user , previousScreen:'QRCode', userid});
  }

  retry = () =>{
    //this.scanner.reactivate()
    this.setState({ready: true})
  }

  onSuccess(e) {
    this._onLearnMore(e.data)
 }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
    {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      this.setState({ready: false})
    }
    );
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Home")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  render() {
    const scan = this.state.ready?(
        <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
        ref={(node) => { this.scanner = node }}
        topContent={
          <Text style={styles.centerText}>
            Please scan the <Text style={styles.textBold}>QR_code</Text> to link Edith to your account
          </Text>
        }
        bottomContent={
            <Text style={styles.centerText}></Text>
        }
      />
    ):(
      <View  style={{justifyContent:'center', flex: 1}}>
        <ActivityIndicator color='#66BB6A' animating= {true}/>
      </View>
    )

    return (
      <View style={{flex:1}}>
        {scan}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});


export default QRCode;
