import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';

import styles from './Styles'

class Logo extends React.Component {
  render() {
    return (
      <View style={styles.loginLogo}>
        <Image style = {{width:170 , height:60}}
          source={require('../icons/logo1.png')}/>
        <Text style = {styles.logoText}>Even Dustbin Is The Hero</Text>
      </View>
    );
  }
}

export default Logo;
