import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Image, Alert, TextInput, Switch,ScrollView, Button, BackHandler, ActivityIndicator} from 'react-native';
import * as firebase from 'firebase'
import ChooseImageScreen from '../Home/chooseImageScreen';
import {uploadPhoto,getURL} from '../Home/uploadPhoto';
import {editPostDetails,uploadPost} from './uploadPostDetails';
import {Icon, FormInput, FormLabel, FormValidationMessage, ListItem, List, Badge} from 'react-native-elements';

class AuthorityPost extends React.Component{
	  _didFocusSubscription;
	  _willBlurSubscription;

    static navigationOptions = {
      tabBarLabel: "Add Feed",
      tabBarIcon: ({tintColor}) => (
        <Image
          source = {require('../icons/book.png')}
          style = {{width:18, height:18, tintColor: tintColor}}>
        </Image>
      )
    }

	constructor(props) {
		super(props);
		this.state = {
			name: ' ',
			email:' ',
			photoPath:' ',
			height:0,
			userid:"1234",
			type:'Reports',
			number_images:0,
			image: null,
			images: null,
			imageReturned: null,
			imagesReturned: [],
			publicSetting:true,
			description:"",
			title:"",
			imageURL:null,
			latitudePinned:null,
			longitudePinned:null,
			addressPinned:null,
			borderColor:['lightgrey','transparent'],
			logo: ['ios-add', 'ios-arrow-down',],
			check: ['x-square', 'check-square'],
			locationReady: 0,
			authorityName: null,
			authorityReady:0,
			size: [15,12],
			addDescription: 0,
			descriptionRightTitle: ' ',
			addPhoto: 0,
			addLocation: 0,
			addAuthority:0,
			submitLoading: false,
		}
		this.imageR=null;
		this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		this.getUserDetails()
  })
	}

	componentDidMount() {
		this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>{
			BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		}
		);
	}

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
		this._willBlurSubscription && this._willBlurSubscription.remove();
	}

	onBackButtonPressAndroid = () => {
		Alert.alert("Exit", "Press YES to exit",[{text: 'No'},{text: 'Yes', onPress: () => BackHandler.exitApp()}]);
		return true
	};

	toggleSwitch=(value)=>{
		this.setState({publicSetting:value})
		console.log('Switch is :'+value)
	}

	toggleSwitch1=()=>{
		if (this.state.switchValue==true){
			this.toggleSwitch(false)
		}else{
			this.toggleSwitch(true)
		}
	}

	submitReport=async()=>{

		if (this.state.submitLoading == false){
		this.setState({submitLoading:true})
		var time = new Date().getTime()

		const detail ={
			"description" : this.state.description,
			"userid" : this.state.userid,
			"description" : this.state.description,
			"title" : this.state.title,
			//"longitude":this.state.longitudePinned,
			//"latitude":this.state.latitudePinned,
			//"location":this.state.addressPinned,
			"authorityName": this.state.authorityName,
			"createdAt":time,
		}
		var newPostKey = firebase.database().ref().child('Reports').push().key;

		const waituploadPost = await uploadPost(this.state.type,newPostKey,detail).catch((error) => {console.log(error)})
		const ready = await editPostDetails(this.state.type,newPostKey,'key',newPostKey).catch((error) => {console.log(error)})

		//const ready4 = await editPostDetails(this.state.type,newPostKey,'createdAt',time).catch((error) => {console.log(error)})
		//const ready5 = await editPostDetails(this.state.type,newPostKey,'progress',0).catch((error) => {console.log(error)})

		if (this.state.number_images===0)
		{
			const ready3 = await editPostDetails(this.state.type,newPostKey,'image',"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBMfsKZ8vh3vaQh3lzRcd26aIFiXe2AL6NadRdkN1ie8hTKgzt").catch((error) => {console.log(error)})
			this.setState({submitLoading:false})
			this.props.navigation.navigate("AuthorityHome")
		}
		else
		{
			var URLarray= [];
			for(var i=0; i<this.state.imageReturned.length;i++)
			{
				//the key = {i} below is needed because inside the array got 2 images, if they dont have unique key,
				//the DOM might mix them up
				//reference: second answer in https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js

				//format:uploadPhoto = (image, key,type, objectID)
				const waitUploadPhoto=await uploadPhoto(this.state.imageReturned[i],i,this.state.type, newPostKey)
				URLreturned=getURL();
				if (i==0){
					const ready2 = await editPostDetails(this.state.type,newPostKey,'image',URLreturned).catch((error) => {console.log(error)})
				}

				URLarray.push(URLreturned);
				//console.log(i)
			}
			//console.log(URLarray)
			this.setState({imageURL:URLarray});
			//console.log(this.state.imageURL);
			//this.updateURL();
			const waitUploadURL = await editPostDetails(this.state.type,newPostKey,'imageURLs',this.state.imageURL).catch((error) => {console.log(error)})
			this.setState({submitLoading:false})
			this.props.navigation.navigate("AuthorityHome")
		}
	}
	}

	myCallback=(dataPassed,dataPassed2)=>{
		this.setState({imageReturned: dataPassed})
		this.setState({number_images: dataPassed2})
		console.log(dataPassed, dataPassed2)
		//setTimeout(() => {this.syncData()}, 300)
	}
	DescriptionCallback=(dataPassed)=>{
		this.setState({description: dataPassed})
	}
	TitleCallback=(dataPassed)=>{
		this.setState({title: dataPassed})
	}
	LocationCallback=(latitude,longitude,address)=>{
		this.setState({latitudePinned: latitude})
		this.setState({longitudePinned: longitude})
		this.setState({addressPinned: address})
	}

	_addDescription(){
		if (this.state.addDescription==1){
		this._closeDescription()
	}else {
		this._closeOthers()
		this.setState({addDescription:1, height:120+20, descriptionRightTitle:' '})
		setTimeout(() => {this.refs.forminput.refs.adddescription.focus(), 300})
		}
	}

	_closeDescription() {
		if (this.state.description == ''){
			this.setState({descriptionRightTitle:' '})
		}else{
			this.setState({descriptionRightTitle:this.state.description})
		}
		this.setState({addDescription:0, height:0,})
	}

	_addPhoto(){
		if (this.state.addPhoto==1){
	//		if (this.state.photo == ''){
	//			this.setState({descriptionRightTitle:' '})
	//		}else{
	//			this.setState({descriptionRightTitle:this.state.description})
	//		}
			this._closePhoto()
	}else {
		this._closeOthers()
		this.setState({addPhoto:1, height: 150})
		setTimeout(() => {300})
		}
	}

	_closePhoto(){
		this.setState({addPhoto:0, height:0})
	}

	_addLocation(){
		if (this.state.addLocation==1){
			this._closeLocation()
	}else {
		this._closeOthers()
		this.setState({addLocation:1, height:150})
		setTimeout(() => {300})
		if (this.state.addressPinned==null){
			this.props.navigation.navigate('Map')
			}
		}
	}

	_closeLocation(){
		this.setState({addLocation:0, height:0})
	}


	_addAuthority(){
		if (this.state.addAuthority==1){
			this._closeAuthority()
	}else {
		this._closeOthers()
		this.setState({addAuthority:1, height:150+20})
		setTimeout(() => {300})
		if (this.state.authorityid==null){
			this.props.navigation.navigate('ReportAuthority')
			}
		}
	}

	_closeAuthority(){
		this.setState({addAuthority:0, height:0})
	}

	_closeOthers = () => {
		this._closePhoto()
		this._closeDescription()
		this._closeLocation()
		this._closeAuthority()
	}

	getUserDetails(){
    var user = firebase.auth().currentUser;
    var details, name, gend, email, photoUrl, uid, emailVerified;

		if (this.state.addressPinned == null){
			this.setState({locationReady:0})
		}else{
			this.setState({locationReady:1})
		}

		if (this.state.authorityid == null){
			this.setState({authorityReady:0})
		}else{
			this.setState({authorityReady:1})
		}


		try{
			const {Markerlatitude, Markerlongitude, addressComponent} = this.props.navigation.state.params;
			this.setState({
				locationReady:1, latitudePinned:Markerlatitude, longitudePinned:Markerlongitude, addressPinned:addressComponent, })
		}catch(err){
			console.log("error")
		}

		try{
			const {authorityid, authority} = this.props.navigation.state.params;
			this.setState({
				authorityReady:1, authorityid:authorityid, authorityName:authority})
		}catch(err){
			console.log("error")
		}


    if (user != null) {
      name = user.displayName
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.
      this.setState({
        name: name,
        email:email,
        photoPath: photoUrl,
        userid: uid,
      })
    }
  }

	render(){

	//	const {Markerlatitude, Markerlongitude, addressComponent} = this.props.navigation.state.params;
		const addDescription = this.state.addDescription?(
			<View>
			<FormInput
			ref='forminput'
			textInputRef = 'adddescription'
			containerStyle={{height:120, width: (WindowWidth-55), marginTop:0, paddingTop:0, alignSelf:'center'}}
			inputStyle={{color:'#1c313a', marginLeft:0, marginRight:0, marginTop:0, paddingTop:0, paddingLeft:10, paddingRight:35}}
			multiline={true}
			numberOfLines = {2}
			maxLength = {200}
			placeholder='Click to Description'
			placeholderTextColor = 'grey'
			underlineColorAndroid = 'rgba(0,0,0,0)'
			value= {this.state.description}
			onChangeText={description => this.setState({description})}/>
			<ListItem
				containerStyle={{marginLeft:20, marginRight:20, borderBottomColor:'lightgrey'}}
				hideChevron
			/>
			</View>
		):(<View></View>)

		const addPhoto = this.state.addPhoto?(
			<View style={styles.photoBox}>
					<ChooseImageScreen callbackFromParent={this.myCallback}/>
			</View>
		):(<View></View>)

		const addLocation = this.state.addLocation?(
			<View style={styles.locationBox}>
				<Text numberOfLines={5} style={{marginLeft:30, marginRight:30}}>
						{this.state.addressPinned}
					</Text>
				<TouchableOpacity style={{backgroundColor:'grey', borderRadius: 7,marginTop: 10}} onPress={()=> this.props.navigation.navigate('Map')}>
					<Text> Edit </Text>
				</TouchableOpacity>
			</View>
		):(<View></View>)

		const addAuthority = this.state.addAuthority?(
			<View style={styles.locationBox}>
				<Text numberOfLines={5} style={{marginLeft:30, marginRight:30}}>{this.state.authorityName}</Text>
				<TouchableOpacity style={{backgroundColor:'grey', borderRadius: 7,marginTop: 10}} onPress={()=> this.props.navigation.navigate('ReportAuthority')}>
					<Text> Edit </Text>
				</TouchableOpacity>
			</View>
		):(<View></View>)

		const submit = this.state.submitLoading?(
			<View style={{flexDirection:'row'}}>
			<Text style={{fontSize:12, color:'rgba(255,255,255,0.7)'}}> Loading </Text>
			<ActivityIndicator color='rgba(255,255,255,0.7)' animating={true}/>
			</View>
		):(
			<Text style={{color:'rgba(255,255,255,0.7)'}}>Submit</Text>
		)

		const{logo, borderColor, size} = this.state

		return(
			<View style={{height:WindowHeight-120, width:WindowWidth-10, marginLeft:5, borderWidth:1, marginTop:20, borderColor:'lightgrey', backgroundColor:'white'}}>
			<ScrollView contentContainerStyle={{}}>
			<View style={{flexDirection:'row', flex:1}}>
			<ListItem
				containerStyle={{width:width-145, height: 55, marginLeft:20, marginRight:20, borderBottomColor:'transparent'}}
				key={this.state.userid}
				roundAvatar
				avatar={{ uri: this.state.photoPath }}
				title={`${this.state.name.toUpperCase()}`}
				hideChevron
			/>

			<TouchableOpacity
					style={{width:75, height:35, marginTop: 10, borderRadius: 15, marginLeft:0, backgroundColor: 'rgba(255,119,26,0.85)', alignItems:'center' , justifyContent:'center'}}
					onPress={()=> this.submitReport()}
			>
					{submit}
			</TouchableOpacity>

			</View>
			<FormInput
				containerStyle={{height:90, width: (WindowWidth-65), alignSelf:'center', borderTopWidth:1, borderTopColor:'lightgrey'}}
				inputStyle={{color:'#1c313a', marginLeft:0, marginRight:0, paddingLeft:10, paddingRight:35}}
				multiline={true}
				numberOfLines = {2}
				maxLength = {50}
				value = {this.state.title}
				placeholder='Click to Add Title'
				placeholderTextColor = 'grey'
				underlineColorAndroid = 'rgba(0,0,0,0)'
				onChangeText={title => this.setState({title})}
				/>
			<ListItem
				containerStyle={{marginLeft:20, marginTop:WindowHeight-490-this.state.height, marginRight:20, borderBottomColor:'lightgrey'}}
				hideChevron
			/>
			<ListItem
				containerStyle={{marginLeft:20, marginRight:20, height:40,backgroundColor:'white', borderBottomColor:borderColor[this.state.addDescription]}}
				title={"Description"}
				titleStyle={{color:'grey'}}
				leftIcon={{name:logo[this.state.addDescription], size: size[this.state.addDescription], type:'ionicon'}}
				hideChevron
				rightTitle={this.state.descriptionRightTitle}
				onPress={()=>{this._addDescription()}}
			/>
			{addDescription}

			<ListItem
				containerStyle={{marginLeft:20, marginRight:20,height:40,backgroundColor:'white', borderBottomColor:borderColor[this.state.addPhoto]}}
				title={"Photo"}
				badge={{value:this.state.number_images, containerStyle:{backgroundColor:'grey'}}}
				titleStyle={{color:'grey'}}
				leftIcon={{name:logo[this.state.addPhoto], size: size[this.state.addPhoto], type:'ionicon'}}
				hideChevron
				onPress={()=>{this._addPhoto()}}
			/>
			{addPhoto}
			</ScrollView>
			</View>
		);
	}
}

/*
<FormLabel labelStyle={{fontSize:22, alignSelf: 'flex-start', marginTop: 50}}>Title</FormLabel>
<View style={styles.title_box}>
	<CustomTextInputMultiline callbackFromParent={this.TitleCallback}/>
</View>
<Text style={{color:'black'}}>Description]</Text>
<View style={styles.D_box}>
	<CustomTextInputMultiline callbackFromParent={this.DescriptionCallback}/>
</View>
*/



/*
//dropdown backup
<View style={styles.setting_box}>
	<Text textAlign={'left'} style={styles.settingText}>Authority</Text>
	<ModalDropdown
		style={styles.bdropdown}
		textStyle={styles.dropdown_btext}
		dropdownStyle={styles.dropdown}
		dropdownTextStyle={styles.dropdown_text}
		options={['option 1', 'option 2','option 3']}
	/>

*/

export default AuthorityPost;

const styles=StyleSheet.create({
	container:{
		//scrollView cannot put flex:1
		//alignItems:'center',
		//justifyContent: 'center',
		//backgroundColor: '#999'
	},
	text:{
		fontSize: 20,
		color: '#fff'
	},
	setting_box:{
		flexDirection: 'row',
		borderWidth: 2,
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		justifyContent:'space-between',
		height:30,
		backgroundColor: 'rgba(360,360,360,1)'
	},
	title_box:{
		flex:1,
		flexDirection: 'row',
		borderWidth: 2,
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		//alignItems: 'flex-start',
		//justifyContent:'space-between',
		height:50,
		backgroundColor: 'rgba(360,360,360,1)'
	},
	D_box:{
		flex:1,
		flexDirection: 'row',
		//flexWrap: 'wrap',
		borderWidth: 2,
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		//alignItems: 'flex-start',
		//justifyContent:'space-between',
		height:140,
		backgroundColor: 'rgba(360,360,360,1)'
	},
	photoBox:{
		flexDirection:'column',
		alignSelf:'stretch',
		marginBottom:3,
		marginLeft:2,
		marginRight:2,
		alignItems:'center',
		justifyContent:'space-around',
		height: 150,
	},
	locationBox:{
		flexDirection:'column',
		alignSelf:'stretch',
		justifyContent:'center',
		marginBottom:3,
		marginLeft:2,
		marginRight:2,
		alignItems:'center',
		height: 150,
	},
	contentBoxes:{
		flexDirection:'column',
		borderWidth: 2,
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		alignItems:'center',
		justifyContent:'center',
		backgroundColor: 'rgba(360,360,360,1)',
		height: 180
	},
	settingText:{
		fontSize:15,
		color: 'black',
		paddingLeft: 5
	},
	bdropdown:{
		borderColor:"black",
		borderWidth:1,
		backgroundColor: 'black',
	},
	dropdown:{
		borderColor:"black",
		borderWidth:1,
		backgroundColor: 'white',
	},
	dropdown_btext:{
		color: 'white',
		fontSize: 12,
		textAlign: 'center'
	},
	dropdown_text:{
		color: 'black',
		fontSize: 12,
		textAlign: 'center'
	},
	dropdown_2_text: {
		marginVertical: 10,
		marginHorizontal: 6,
		fontSize: 18,
		color: 'white',
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	dropdown_2_dropdown: {
		width: 150,
		height: 300,
		borderColor: 'cornflowerblue',
		borderWidth: 2,
		borderRadius: 3,
	},
	dropdown_2_row: {
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
	},
	  tabItem:{
	  alignItems: 'center',
	  paddingLeft:10,
	  paddingRight:10
	},
});
