import { AppRegistry } from 'react-native';
import App from './App';
import {YellowBox} from 'react-native'
import * as firebase from 'firebase'

//Initialize Firebase

const config = {
  apiKey: "AIzaSyB0GcjJfjvbk4CFetD0Tx0NedHQ7raulbY",
  authDomain: "myrio-19ad9.firebaseapp.com",
  databaseURL: "https://myrio-19ad9.firebaseio.com",
  projectId: "myrio-19ad9",
  storageBucket: "myrio-19ad9.appspot.com",
  messagingSenderId: "117914961895",
  appId: "1:117914961895:web:dbdc84ebdb3a3bc2"
};
firebase.initializeApp(config);

AppRegistry.registerComponent('blank', () => App);


YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])
YellowBox.ignoreWarnings(['firebase.User.prototype.reauthenticateWithCredential is deprecated'])
YellowBox.ignoreWarnings(['source.uri should not be an empty string'])
YellowBox.ignoreWarnings(['Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android as it keeps the timer module awake, and timers can only be called when the app is in the foreground.'])
YellowBox.ignoreWarnings(['`scaleX` supplied to `FormInput` has been deprecated. Use the transform prop instead.'])
YellowBox.ignoreWarnings(['`scaleX` supplied to `View` has been deprecated. Use the transform prop instead.'])
YellowBox.ignoreWarnings(['`scaleY` supplied to `FormInput` has been deprecated. Use the transform prop instead.'])
YellowBox.ignoreWarnings(['`scaleY` supplied to `View` has been deprecated. Use the transform prop instead.'])
YellowBox.ignoreWarnings(['`scaleY` supplied to `TextInput` has been deprecated. Use the transform prop instead.'])
YellowBox.ignoreWarnings(['Warning: Each child in an array or iterator should have a unique "key" prop.'])
YellowBox.ignoreWarnings(['Method `jumpToIndex` is deprecated.'])
