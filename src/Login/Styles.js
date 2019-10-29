import React from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#43A047',
    alignItems: 'center',
  },
  logoText:{
    marginTop: 5,
    fontSize: 10,
    color:'rgba(255,255,255,0.6)',
    marginBottom:20,
  },
  loginLogo:{
    marginTop:15,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 15,
    width: 230,
    paddingHorizontal: 20,
    color:'rgba(255,255,255,0.8)',
  },
  textContainer: {
    color:'rgba(255,255,255,0.8)',
    padding: 10,
    paddingTop: 15,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
  //  fontWeight: 700,
    color:'#43A047',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
  //  fontSize: 16,
    backgroundColor:'rgba(255,255,255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    padding:8,
    width: 90,
  },
  word: {
      color:'#81C784',
      flexDirection: 'row',
      fontSize: 10,
    },
  signUpButtonText: {
    fontSize: 12,
    color:'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOrError:{
    fontSize: 10,
    color:'#1B5E20',
    marginTop:2,
    marginBottom:0,
  }
});

export default styles;
