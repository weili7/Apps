import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
  TouchableOpacity,
	BackHandler,
} from 'react-native';

import {updateDetail} from '../components/RealTimeDatabase'
import styles from './Styles'
import * as firebase from 'firebase'
import Picker from 'react-native-wheel-picker'
var PickerItem = Picker.Item;

export default class Page2 extends Component<{}> {
	_didFocusSubscription;
	_willBlurSubscription;

	constructor(props) {
		super(props);
		this.state = {
			index : 2,
			gender: ['Male', 'Female'],
			loading: ' ',
			error:' ',
		};
		this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
		BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		)
	}

	componentDidMount() {
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
			BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		);
	}

	onBackButtonPressAndroid = () => {
		this.props.navigation.navigate("Pg1")
		return true
	};

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}

	_doneSetGender= async() => {
    var user = firebase.auth().currentUser;
		const{gender, index} = this.state
    const ready = await updateDetail('gender', gender[index], user.uid)
    this.setState({error:' ', loading:' '})
    this.props.navigation.navigate("Pg3")
  }

  onGenderPress(){
    var user = firebase.auth().currentUser;
    this.setState({error:' ', loading:'loading'})
		const{gender, index} = this.state
    if (gender != null)
    {
				this._doneSetGender()
		}
	}

	onPickerSelect (index) {
		this.setState({
			index: index,
		})
	}

	onLogOutPress(){
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
			console.log("signout")
		})
		this.props.navigation.navigate("Login")
	}

	render () {
		return (
      <View style={styles.container}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'flex-start',marginTop:20, marginBottom:40,}}>
          <Text style={{color:'#1c313a'}}>Welcome!</Text>
					<Text style={{color:'#1c313a'}}>Please setup your profile</Text>
          <Text style={{color:'#1c313a'}}>You are few steps away from success</Text>
        </View>

        <View style={{
          alignItems: 'center',
          justifyContent: 'center'}}>
  				<Text style={{color:'rgba(255,255,255,0.6)',fontSize: 22, marginBottom:0, paddingBottom:0}}>
  				Please select your gender
  				</Text>
  				<Picker style={{width: 150, height: 100}}
  					selectedValue={this.state.index}
  					itemStyle={{color:'rgba(255,255,255,0.6)', fontSize:25}}
  					onValueChange={(index) => this.onPickerSelect(index)}>
  						{this.state.gender.map((value, i) => (
  							<PickerItem label={value} value={i} key={"money"+value}/>
  						))}
  				</Picker>
  				<Text style={{margin: 20, color:'rgba(255,255,255,0.4)'}}>
  					Gender：{this.state.gender[this.state.index]}
  				</Text>
        </View>

				<Text style={styles.loadingOrError}>{this.state.error}</Text>
        <Text style={styles.loadingOrError}>{this.state.loading}</Text>

				<View style = {{alignItems: 'center', justifyContent: 'center',marginTop: 0}}>
	        <TouchableOpacity
	            style={styles.loginButton}
	            onPress={this.onGenderPress.bind(this)}>
	          <Text style={styles.buttonText}>Next</Text>
	        </TouchableOpacity>
				</View>

				<View style = {{alignItems: 'center', justifyContent: 'flex-end',marginBottom:10, flex:1}}>
				<TouchableOpacity   onPress={this.onLogOutPress.bind(this)}>
					<Text style={styles.signUpButtonText}>Log in with another account</Text>
					</TouchableOpacity>
				</View>

			</View>
		);
	}
}
