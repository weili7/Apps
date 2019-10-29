import React from 'react';
import { StyleSheet, Alert, Text, View, TouchableOpacity,Image, TextInput, Switch,ScrollView,  BackHandler} from 'react-native';
import {Button,Icon, List, ListItem, Tile} from 'react-native-elements'
import * as firebase from 'firebase'
import {uploadPhoto} from './uploadPhoto';
import {saveReportDetails,editReportDetails, moveFirebase} from './uploadDetails';

import Modal from 'react-native-modalbox'

//import {, DeviceEventEmitter} from 'react-native';
//import { createStackNavigator} from "react-navigation";
//import {Icon} from 'react-native-elements';
//import ModalDropdown from 'react-native-modal-dropdown';
//import UploadImageScreen from './UploadImageScreen';
//import firebase from 'firebase';
//import ImagePicker from 'react-native-image-crop-picker';
//import RNFetchBlob from 'react-native-fetch-blob';
//import ChooseImageScreen from './chooseImageScreen';
//import CustomTextInputMultiline from './CustomTextInput';

const Dimensions = require('Dimensions');
width=Dimensions.get('window').width;
height=Dimensions.get('window').height;

//export default class Report extends React.Component{
class ViewSubmittedReport extends React.Component{
	static navigationOptions = {
		title: "Report",
	};

	constructor(props) {
		super(props);
		this.state = {
			switchValue: false,
			userid:null,
			authorityid:null,

			/*
			reportid:'-LR6NREnUrugm8gTKcEv',
			title: 'this.props.navigation.state.params.title',
			des: 'this.props.navigation.state.params.description',
			createdAt: 1542013137883,
			authorityName: 'this.props.navigation.state.params.authorityName',
			authorityid: 'this.props.navigation.state.params.authorityid',
			img: 'this.props.navigation.state.params.image',
			location:'this.props.navigation.state.params.location',
			latitude:'this.props.navigation.state.params.latitude',
			longitude:'this.props.navigation.state.params.longitude',
			authProgress: 1,
			publicSetting: true,
			*/
			category:this.props.navigation.state.params.category,
			addCategory:0,
			reportid:this.props.navigation.state.params.key,
			title: this.props.navigation.state.params.title,
			des: this.props.navigation.state.params.description,
			createdAt: this.props.navigation.state.params.createdAt,
			authorityName: this.props.navigation.state.params.authorityName,
			authorityid: this.props.navigation.state.params.authorityid,
			img: this.props.navigation.state.params.image,
			location:this.props.navigation.state.params.location,
			latitude:this.props.navigation.state.params.latitude,
			longitude:this.props.navigation.state.params.latitude,
			authProgress: this.props.navigation.state.params.progress,
			publicSetting:this.props.navigation.state.params.publicSetting,
			rightDescription: this.props.navigation.state.params.description,
			res:this.props.navigation.state.params.res,
			type:'Reports',
			borderColor:['lightgrey','transparent'],
			logo: ['ios-add', 'ios-arrow-down',],
			check: ['x-square', 'check-square'],
			addDescription: 0,
			addPhoto:0,
			addLocation:0,
			addAuthority:0,
			number_images:0,
			image: null,
			images: null,
			imagesshow:[],
			imageReturned: null,
			imagesReturned: [],
			progress:['progress-one', 'progress-two', 'progress-full'],
			respond:['Waiting for Respond', 'Under Progress', 'Completed'],
			size: [15,12],
			description:"empty",
			response:"Noted, thank you for your report",
			temporaryData:{description:"Loading...", title:"Loading...", respond:'Loading...'},
			urlArray:null,
		}
	}

	//my version BACK HANDLER (ok for stack navigator)
	componentDidMount() {

		ReportRef=firebase.database().ref('Reports'+"/"+this.state.reportid);
		console.log("will mount")
		//console.log("will mount2",ReportRef)
		ReportData=ReportRef.once('value',(data)=> {
			console.log("entered Report Data")
			this.setState({temporaryData: data.toJSON()});
			/*
			//cannot console log, coz console log too fast
			console.log("data",temporaryData)
			console.log("after entered Report Data")
			console.log('temporaryData', this.state.temporaryData);
			console.log('description', this.state.temporaryData.description);
			console.log('response', this.state.temporaryData.response);
			console.log('imageURLs', this.state.temporaryData.imageURLs);
			console.log('imageURLs TYPE', typeof this.state.temporaryData.imageURLs);
			*/
			k=this.state.temporaryData.imageURLs;
			this.setState({urlArray: k});
			console.log('imageURLs loaded', this.state.urlArray);
		})
	}

	componentWillUnmount() {
	}

	toggleSwitch=(value)=>{
		this.setState({switchValue:value})
		console.log('Switch is :'+value)
	}



	updateDetails = async() => {
		console.log("entered")
		const detail ={
			"description" : this.state.description,
			"publicSetting" : this.state.publicSetting,
			"userid" : this.state.userid,
			"authorityid" : this.state.authorityid,
			"description" : this.state.description,
		}
		//format: saveReportDetails = (type,objectID,details)
		const ready = await saveReportDetails(this.state.type,this.state.reportid,detail).catch((error) => {console.log(error)})
		//console.log(ready)
	}

	updateResponse = async() => {
		console.log("updating Response")
		//format: const editReportDetails = (type,objectID,param,paramDetail) => {
		const ready = await editReportDetails(this.state.type,this.state.reportid,'response',this.state.response).catch((error) => {console.log(error)})
		//console.log(ready)
	}

	submitReport=()=>{
		this.updateDetails();

		if (this.state.number_images===0)
		{

		}
		else
		{
			for(var i=0; i<this.state.imageReturned.length;i++)
			{
				//the key = {i} below is needed because inside the array got 2 images, if they dont have unique key,
				//the DOM might mix them up
				//reference: second answer in https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js

				//format:uploadPhoto = (image, key,type, objectID)
				uploadPhoto(this.state.imageReturned[i],i,thisred.state.type, this.state.reportid)
			}
		}
	}

	submitResponse=()=>{
		this.updateResponse();

	}

	myCallback=(dataPassed,dataPassed2)=>{
		console.log("dataPassed",dataPassed)
		console.log("dataPassed2",dataPassed2)
		this.setState({imageReturned: dataPassed})
		this.setState({number_images: dataPassed2})
	}
	DescriptionCallback=(dataPassed)=>{
		//console.log("Description",dataPassed)
		//this.setState({description: dataPassed})
	}
	ResponseCallback=(dataPassed)=>{
		this.setState({response: dataPassed})
	}

	_detailsClick = async() => {
		this._closeOthers()
		this.refs.details.open()
  	// Alert.alert("hello", "details")
  }

	_moreClick = async() => {
		this.refs.respond.open()
   //Alert.alert("hello", "more")
  }

	onCall(){
		//const { phone } = this.props.navigation.state.params;
		//console.log("calling " + phone)
	}

	onChat (){
		//var my = firebase.auth().currentUser;
		//const {userid} = this.props.navigation.state.params;
		//this.props.navigation.navigate('Chat', {authid: userid, userid: my.uid, username:my.displayName})
	}

	renderImages(URLarrayPassed) {
		console.log("URL loaded 123",URLarrayPassed)
		if (URLarrayPassed)
		{
			arraylength= Object.keys(URLarrayPassed).length;
			console.log("arraylength",arraylength)
			console.log("imagesshow length",this.state.imagesshow.length)
			for(var i=0; i<arraylength;i++)
			{
				this.state.imagesshow.push(<Image key={i} style={styles.imagesStyle} source={{ uri:URLarrayPassed[i]}} />)
			}
			console.log("return imagesshow");
			return this.state.imagesshow;
		}
		else
		{
			//this if else is needed because the loading of this.state.temporaryData.imageURLs is slower than render
			return <Text>No image</Text>
		}
		//the error is because the loading of this.state.temporaryData.imageURLs is slower
		//return <Image style={styles.imagesStyle} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/tglproject1234-dfcd3.appspot.com/o/Reports%2FunspecifiedReportID2%2F15357274240000.jpg?alt=media&token=19d0d028-5d98-406f-b4d7-82b2cc355341' }} />
	}

	_addDescription(){
		if (this.state.addDescription==1){
		this._closeDescription()
		this.setState({addDescription:0, rightDescription:this.state.des})
	}else {
		this._closeOthers()
		this.setState({addDescription:1, height:120+20, rightDescription:' '})
		//setTimeout(() => {this.refs.forminput.refs.adddescription.focus(), 300})
		}
	}

	_closeDescription() {
		if (this.state.des == ''){
			this.setState({des:' '})
		}
		this.setState({addDescription:0, height:0,})
	}

	_addCategory(){
		if (this.state.addCategory==1){
		this._closeCategory()
		this.setState({addCategory:0})
	}else {
		this._closeOthers()
		this.setState({addCategory:1})
		//setTimeout(() => {this.refs.forminput.refs.adddescription.focus(), 300})
		}
	}

	_closeCategory() {
		this.setState({addCategory:0})
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
		this._closeCategory()
	}

	//backup
	//{this.state.temporaryData.imageURLs ? this.renderImages(this.state.temporaryData.imageURLs) : null}
	//{this.state.temporaryData.imageURLs ? this.renderImages(this.state.temporaryData.imageURLs) : <Text>No image</Text>}
	//{this.renderImages(this.state.temporaryData.imageURLs)}
	render(){
		//{this.state.urlArray ? this.renderImages(this.state.urlArray) : <Text>No image</Text>}
		const addDescription = this.state.addDescription?(
			<View style={{width: width-40, height:150}}>
				<Text numberOfLines={5} style={{marginLeft:50, alignSelf:'center',alignItems:'center', marginRight:50}}>{this.state.des}</Text>
			</View>
		):(<View></View>)

		const addCategory = this.state.addCategory?(
			<View style={{width: width-40, height:150}}>
				<Text numberOfLines={5} style={{marginLeft:50, alignSelf:'center',alignItems:'center', marginRight:50}}>{this.state.category}</Text>
			</View>
		):(<View></View>)

		const addPhoto = this.state.addPhoto?(
			<View style={{width: width-40, height:150}}>
			<Image
				source = {{uri: this.state.img}}
				style = {{width:220, height:150,alignSelf:'center'}}>
			</Image>
			</View>
		):(<View></View>)

		const addLocation = this.state.addLocation?(
			<View style={{width: width-40, height:150}}>
				<Text numberOfLines={5} style={{marginLeft:50, marginRight:50, alignSelf:'center',alignItems:'center', }}>{this.state.location}</Text>
			</View>
		):(<View></View>)

		const addAuthority = this.state.addAuthority?(
			<View style={{alignSelf:'center',alignItems:'center', width: width-40, height:150}}>
				<Text numberOfLines={5} style={{marginLeft:50, marginRight:50}}>{this.state.authorityName}</Text>
			</View>
		):(<View></View>)

		const{logo, borderColor, size} = this.state

		return(
			<View style={{height:height, flex:1}}>
			<ScrollView contentContainerStyle={styles.container}>

				<View style={styles.title_box}>
						<Text style={{color:'black', marginLeft: 20 ,marginTop:10, }}>Title</Text>
						<Text style={{marginLeft:20, marginRight: 20, marginTop:5}}>{this.state.title}</Text>
					</View>

				<View style={styles.D_box}>
					<Text style={{color:'black', marginLeft:20, marginTop:15, textAlign: 'left'}}>Details</Text>
					<TouchableOpacity
						onPress={this._detailsClick}>
						<Text style={{textAlign:'right',marginLeft:width-110, marginTop:2, color:'rgba(255,119,26,0.85)', fontSize:11}}> VIEW </Text>
					</TouchableOpacity>
				</View>

				<View style={styles.R_box}>
					<Text style={{color:'black', marginTop:10, marginLeft:20}}>Response from Authority</Text>
					<TouchableOpacity
						onPress={this._moreClick}>
						<Text style={{textAlign:'right', color:'rgba(255,119,26,0.85)',marginLeft:width-230, marginTop:2, fontSize:11}}> MORE </Text>
					</TouchableOpacity>
				</View>
				<View style={{
					flex:1,
					flexDirection: 'row',
					//flexWrap: 'wrap',
					//borderWidth: 2,
					//alignSelf:'stretch',
					//marginBottom:5,
					//marginLeft:2,
					//marginRight:2,
					//alignItems: 'flex-start',
					//justifyContent:'space-between',
					height:20,
					width:width-10,
					alignSelf:'center',
					backgroundColor: 'rgba(360,360,360,1)'
				}}>
					<Image
						source = {require('../icons/update.png')}
						style = {{width:18, height:18,marginLeft:23, tintColor:'rgba(255,119,26,0.85)'}}>
					</Image>
					<Text numberOfLines={5} style={{width:width-80, flexDirection:'column',marginRight: 20, marginLeft:10,}}>{this.state.res}</Text>
				</View>
				<View style={{
				borderBottomWidth:1,
				borderColor:'darkgrey',
				backgroundColor:'white', width:width-10, alignSelf:'center',  height:30, marginBottom:5}}>
					<Image
						source = {require('../icons/dot.png')}
						style = {{transform:[{rotate:'90deg'}],marginTop:5, marginLeft: 23, width:18, height:18, tintColor:'rgba(255,119,26,0.85)',}}>
					</Image>
				</View>

				<View style={{borderTopWidth:1,
					borderBottomWidth:1,
					borderColor:'darkgrey',flexDirection:'row', backgroundColor:'white', marginBottom:10, width:width-10, alignSelf:'center', height: 40}}>

					<Icon
						marginLeft={23}
						size={18}
						color='rgba(255,119,26,0.85)'
						name={this.state.progress[this.state.authProgress]}
						type='entypo'/>
					<Text style={{flexDirection:'column',marginTop: 10, marginLeft:10,}}>{this.state.respond[this.state.authProgress]}</Text>
				</View>

				<View style={{borderTopWidth:1,
					borderBottomWidth:1,
					borderColor:'darkgrey',backgroundColor:'white', width:width-10, alignSelf:'center',  height:50}}>
					<Text style={{color:'black', marginTop:10, marginLeft:20}}>Review</Text>
				</View>
				<Text style={{alignItems:'flex-end', marginRight:5, alignSelf:'flex-end'}}>Ref ID:{this.state.reportid}</Text>
				<Text style={{alignItems:'flex-end', marginRight:5, marginBottom:10, alignSelf:'flex-end'}}>{new Date(this.state.createdAt).toLocaleString()}</Text>
				<View style={{alignItems:'center', alignSelf:'center', flexDirection: 'row'}}>
					<Button
						title="Chat"
						buttonStyle={{ backgroundColor:'rgba(255,119,26,0.85)', marginTop: 5 , width: width/3, borderRadius:15,}}
							onPress={this.onChat.bind(this)}
					/>

					<Button
						title="Call Authority"
						buttonStyle={{ backgroundColor:'rgba(255,119,26,0.85)',  marginTop: 5,width: width/3, borderRadius:15}}
							onPress={this.onCall.bind(this)}
					/>
			</View>

			</ScrollView>

			<Modal style={styles.modalContainer}
				position={"center"} backButtonClose={true} ref={"details"} isDisabled={this.state.isDisabled}>
				<Text style={{marginTop:20, fontSize: 20, alignItems:'center'}}>Details</Text>
				<ScrollView>
					<ListItem
						containerStyle={{marginTop:10, marginLeft:20, marginRight:20, width:width-80, height:40,backgroundColor:'white', borderTopWidth:1, borderTopColor:'lightgrey',borderBottomWidth:0}}
						title={"Description"}
						titleStyle={{color:'grey'}}
						leftIcon={{name:logo[this.state.addDescription], size: size[this.state.addDescription], type:'ionicon'}}
						hideChevron
						rightTitle={this.state.rightDescription}
						onPress={()=>{this._addDescription()}}
					/>
					{addDescription}

					<ListItem
						containerStyle={{marginLeft:20, marginRight:20, width:width-80, height:40,backgroundColor:'white', borderTopWidth:1, borderTopColor:'lightgrey',borderBottomWidth:0}}
						title={"Photo"}
						badge={{value:this.state.number_images, containerStyle:{backgroundColor:'grey'}}}
						titleStyle={{color:'grey'}}
						leftIcon={{name:logo[this.state.addPhoto], size: size[this.state.addPhoto], type:'ionicon'}}
						hideChevron
						onPress={()=>{this._addPhoto()}}
					/>
					{addPhoto}

					<ListItem
						containerStyle={{marginTop:10, marginLeft:20, marginRight:20, width:width-80, height:40,backgroundColor:'white', borderTopWidth:1, borderTopColor:'lightgrey',borderBottomWidth:0}}
						title={"Category"}
						titleStyle={{color:'grey'}}
						leftIcon={{name:logo[this.state.addCategory], size: size[this.state.addCategory], type:'ionicon'}}
						hideChevron
						rightTitle={this.state.category}
						onPress={()=>{this._addCategory()}}
					/>
					{addCategory}

					<ListItem
						containerStyle={{marginLeft:20, marginRight:20, width:width-80, height:40,backgroundColor:'white', borderTopWidth:1, borderTopColor:'lightgrey',borderBottomWidth:0}}
						title={"Location"}
						hideChevron
						titleStyle={{color:'grey'}}
						leftIcon={{name:logo[this.state.addLocation], size: size[this.state.addLocation], type:'ionicon'}}
						onPress={()=>{this._addLocation()}}
					/>
					{addLocation}

					<ListItem
					containerStyle={{marginLeft:20, marginRight:20, width:width-80, height:40,backgroundColor:'white', borderTopWidth:1, borderTopColor:'lightgrey',borderBottomWidth:0}}
					title={"Authority"}
					hideChevron
						titleStyle={{color:'grey'}}
						leftIcon={{name:logo[this.state.addAuthority], size: size[this.state.addAuthority], type:'ionicon'}}
						onPress={()=>{this._addAuthority()}}
					/>
					{addAuthority}

					<View style={{flexDirection:'row', flex:1}}>
						<ListItem
							containerStyle={{width:width-80, marginLeft:20, marginRight:20, height:40, borderBottomColor:'lightgrey',  borderTopWidth:1, borderTopColor:'lightgrey',}}
							title={"Public"}
							titleStyle={{color:'grey'}}
							hideChevron
							leftIcon={{name:'ios-add', size: 15, type:'ionicon'}}
						/>
						<Switch
							style={{alignSelf:'flex-end', alignItems:'flex-end', alignContent:'flex-end', marginBottom:5, marginLeft:-75, paddingRight:0}}
							value={this.state.publicSetting}
						/>
					</View>

				</ScrollView>
			</Modal>

			<Modal style={{
				alignItems: 'center',
				height:200,
				width: width - 40,
				borderRadius: 20,
				shadowRadius:10,}}
				position={"center"} backButtonClose={true} ref={"respond"} isDisabled={this.state.isDisabled}>
				<Text style={{marginTop:20, fontSize: 20}}>Respond</Text>
				<Text style={{marginTop:20, fontSize: 14, marginLeft: 15, marginRight:15}} multiline={true} numberOfLines = {3}>{this.state.res}</Text>
			</Modal>

			</View>

		);
	}

}

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

export default ViewSubmittedReport;

const styles=StyleSheet.create({
	modalContainer:{
		alignItems: 'center',
		height: height - 150,
		width: width - 40,
		borderRadius: 20,
		shadowRadius:10,
	},
	container:{
		//scrollView cannot put flex:1
		alignItems:'flex-start',
		//justifyContent: 'center',
		//backgroundColor: '#999'
	},
	text:{
		fontSize: 20,
		color: '#fff',
		marginLeft: 10,
	},
	title_box:{
		borderTopWidth:1,
		borderBottomWidth:1,
		borderColor:'darkgrey',
		flex:1,
		marginTop:5,
		flexDirection: 'column',
		alignSelf:'stretch',
		marginBottom:5,
		marginRight:2,
		height:100,
		marginTop:10,
		width:width-10,
		alignSelf:'center',
		//alignItems: 'flex-start',
		//justifyContent:'space-between',
		backgroundColor: 'rgba(360,360,360,1)'
	},
	setting_box:{
		borderTopWidth:1,
		borderBottomWidth:1,
		borderColor:'darkgrey',
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
	D_box:{	borderTopWidth:1,
		borderBottomWidth:1,
		borderColor:'darkgrey',
		flex:1,
		flexDirection: 'row',
		//flexWrap: 'wrap',
		//borderWidth: 2,
		//alignSelf:'stretch',
		marginBottom:15,
		//marginLeft:2,
		//marginRight:2,
		//alignItems: 'flex-start',
		//justifyContent:'space-between',
		height:50,
		width:width-10,
		alignSelf:'center',
		backgroundColor: 'rgba(360,360,360,1)'
	},
	R_box:{
		borderTopWidth:1,
		borderColor:'darkgrey',
		flex:1,
		flexDirection: 'row',
		//flexWrap: 'wrap',
		//borderWidth: 2,
		//alignSelf:'stretch',
		//marginBottom:5,
		//marginLeft:2,
		//marginRight:2,
		//alignItems: 'flex-start',
		//justifyContent:'space-between',
		height:40,
		width:width-10,
		alignSelf:'center',
		backgroundColor: 'rgba(360,360,360,1)'
	},

	photoBox:{
		flexDirection:'column',
		borderWidth: 2,
		alignSelf:'stretch',
		marginBottom:5,
		marginLeft:2,
		marginRight:2,
		alignItems:'center',
		justifyContent:'space-around',
		backgroundColor: 'rgba(360,360,360,1)',
		height: 250
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
	ImageContainer:{
		flex:1,
		alignSelf: 'stretch',
		flexDirection:'row',
	},
	scrollImageContainer:{
		alignSelf: 'stretch',
		justifyContent:'center',
		alignItems:'center',
		flexDirection:'column',
	},
	imagesStyle:{
		width:200,
		height:200,
		resizeMode: 'contain',
		marginBottom:2,
		marginTop:2,
	},
	verticalContainer:{
		flexDirection:'column',
		justifyContent:'center',
		alignItems:'center',
		borderWidth:2,
		alignSelf: 'stretch',
		width:40,
	},
});
