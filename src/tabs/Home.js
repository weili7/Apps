import React, {Component} from 'react';
import { AppState, StyleSheet, Text, ScrollView, View, Alert, Image,Dimensions, TextInput, BackHandler, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
import styles from './styles'
import * as firebase from 'firebase'
import {Icon, SearchBar, Tile, Button, List, ListItem, Card} from 'react-native-elements';
import {onFollowPress, updateDetail, moveFirebase, getUserDetails} from '../components/RealTimeDatabase'
import {QRCode} from 'react-native-custom-qr-codes'

var {height, width} = Dimensions.get('window')

class Home extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "Home",
    tabBarIcon: ({tintColor}) => (
      <Icon type='font-awesome' color={tintColor} name='home' size={23}/>
    )
  }

  constructor(props){
    super(props);
    this.state ={
      userid:' ',
      name:' ',
      points: 0,
      refreshing: false,
      loading: true,
      dataReady:false,
      userid:' ',
      reports:[],
      reportsArray:[],
      reportsMade:[],
      reportsTitle:[],
      returnedDetail:[],
      appState: AppState.currentState,
      respond:['Waiting for Respond', 'Under Progress', 'Completed'],
      progress:['progress-one', 'progress-two', 'progress-full'],}
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      this._startup()
      this.getUserDetails()
    })
  }

  getUserDetails(){
    console.log("update")
    var user = firebase.auth().currentUser;
    var details, name, gend, email, photoUrl, uid, emailVerified;

    if (user != null) {
      name = user.displayName
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.
      console.log("  Email Verified: " + emailVerified);
      console.log("  Provider-specific UID: " + uid);
      console.log("  Name: " + name);
      console.log("  Email: " + email);
      console.log("  Photo URL: " + photoUrl);
      this._getDetails(uid)
      this.setState({
        name: name,
        userid: uid,
        refreshing: false,
      })
    }
  }

  test = async(uid) => {
    console.log('testin123')
  }

  _getDetails = async(uid) => {
    const test = await this.test()
    console.log(test)
    const detail = await getUserDetails(uid)
    this.setState({
      points: detail.points,
    })
  }

  completed = async() =>{
    var user = firebase.auth().currentUser;
    const ready = await moveFirebase(user.uid, '-LR6LaCyOl1cI-t_vAcj')
  }

  componentWillMount(){
    var user = firebase.auth().currentUser;
    var lastOnlineRef = firebase.database().ref('users/' +user.uid + '/lastActive');

    var connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', function(snap) {
      if (snap.val() === true) {

    // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
    //    var con = myConnectionsRef.push();

    // When I disconnect, remove this device
    //    con.onDisconnect().remove();

    // Add this device to my connections list
    // this value could contain info about the device or a timestamp too
    lastOnlineRef.set("Online");

    // When I disconnect, update the last time I was seen online
    lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
      }
    });
  }

  componentDidMount() {
    this.getUserDetails()
    AppState.addEventListener('change', this._handleAppStateChange);
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>{
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    }
    );
//****************** andrew part *****************//
  }


  getDetails = (reportKey) => {
    //console.log(userid)
    return new Promise ((resolve)=>{
      firebase.database().ref('Reports/'+reportKey).once('value',(data)=>{
          //console.log(data.val())
          resolve(data.val())
      })
    })
  }

  getReportDet = async(reportKey) =>{
    var reports = []
  //  console.log(reportKey)
    for (var i=0; i<reportKey.length;i++)
    {
      reports.push(await this.getDetails(reportKey[i]))
    }
    //console.log(reports)
    this.setState({reports:reports, dataReady: true})
    this.setState({loading: false, refreshing:false});
  }

  updateReport = () =>{
    var user = firebase.auth().currentUser;
    var reportsArray=[];
    UserReportRef=firebase.database().ref('/users/'+user.uid+'/ReportsMade')
    GetReportKey= UserReportRef.once("value",(snapshot)=>{
      snapshot.forEach((child)=>{
        reportsArray.push(child.key);
      })
    this.setState({reportsArray:reportsArray})
    this.getReportDet(reportsArray)

    });
  }

  viewComletedReport = () => {
    this.props.navigation.navigate("CompletedReport");
  }

  viewReportDetails = (report) => {
    //console.log()
    this.props.navigation.navigate("UserViewReport", {...report});
    };

  //****************** andrew part *****************//

  onBackButtonPressAndroid = () => {
    Alert.alert("Exit", "Press YES to exit",[{text: 'No'},{text: 'Yes', onPress: () => BackHandler.exitApp()}]);
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
     if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
       console.log('App has come to the foreground!')
     }else{
       console.log('App has come to the background!')
     }
     this.setState({appState: nextAppState});
   }

  _startup = async() => {
    var user = firebase.auth().currentUser;
    console.log("start")
    const ready = await updateDetail('lastActive', "Online", user.uid)
  }

  _click = async() => {
   Alert.alert("hello", "notification")
  }

  _click2 = async() => {
   this.props.navigation.navigate("Contact");
  }


  _click3 = async() => {
   this.props.navigation.navigate("Claim");
  }

  _click4 = async() => {
    var my = firebase.auth().currentUser;
    const ready2 = await updateDetail('points', this.state.points+20000 , my.uid)
    this.setState({points: this.state.points+20000})
  }

  _onRefresh = () => {
    console.log("refresh")
    this.getUserDetails()
    this.setState({refreshing:true})
    this.updateReport ()
    this.refs._scrollView.scrollTo({x:0,y:60, animated:true})
  }

  getDate = (createdAt) =>{
    var time = new Date(createdAt)
    var date = time.toLocaleString()
    return (date)
  }

  render() {

    const reports = (this.state.reportsArray.length == 0)?
    (<View>
         <Text style={{alignItems:'center',alignSelf:'center', marginTop:25}}>No reports submitted</Text>
    </View>
    ):(
      <View style= {{width:width}}>
          {this.state.reports.map((report) => (
            <List>
              <ListItem
                key={report.key}
                title={`${report.title.toUpperCase()}`}
                subtitle={this.getDate(report.createdAt)}
                onPress={() => this.viewReportDetails(report)}
              />
            <Tile
              imageContainerStyle={{opacity:0.6}}
              imageSrc={{uri:report.image}}
              icon={{name:this.state.progress[report.progress], type:'entypo'}}
              title='PROGRESS:'
              caption={this.state.respond[report.progress]}
              titleStyle={{fontSize:13, color:'black', paddingBottom:0, marginBottom:0}}
              captionStyle={{fontSize:15, color:'black', paddingTop:0, marginTop:0, fontWeight:'bold'}}
              featured
              onPress={() => this.viewReportDetails(report)}
            />
            </List>
          )).reverse()
          }
      </View>
    )

    const display = this.state.loading ?
    (
      <View>
        <ActivityIndicator color='#66BB6A' animating={this.state.loading}/>
      </View>
    ):(
      <View style={{width:width,}}>
        <ListItem
          style= {{width:width, }}
          containerStyle ={{backgroundColor: 'white'}}
          title={'Completed Report'}
          onPress={() => this.viewComletedReport()}
        />
        {reports}
      </View>
    )

    return (
      <View style={{flex: 1, alignItems: 'center',}}>
        <View style = {{flexDirection:'row', height:50, width:width, justifyContent:'center', backgroundColor:'#66BB6A'}}>
          <Text style={{color:'white', alignSelf:'center', fontSize:16}}>EDITH</Text>
          <TouchableOpacity
              style={{width:30, height:30, marginTop:12, marginLeft:5, paddingRight:0, backgroundColor: 'transparent', alignItems:'flex-start' }}
              onPress={this._click}>
              <Icon type='entypo' color='rgba(255,255,255,0.9)' name='notification' />
          </TouchableOpacity>
        </View>
      <ScrollView
        refreshControl={
        <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh}/>
        }
        ref='_scrollView'
      >
        <Card
          containerStyle={{width:width -15, alignItems:'center', alignSelf: 'center'}}
          title={`WELCOME ${this.state.name.toUpperCase()}`}
          image={require('../icons/1.jpg')}>
          <Text style={{fontSize:15, marginBottom: 15, marginTop:20, alignItems:'center', alignSelf: 'center'}}>
            You have {this.state.points} points left.
          </Text>
          <Button
            icon={{name: 'code'}}
            backgroundColor='#03A9F4'
            buttonStyle={{width:200, borderRadius: 0, alignItems:'center', alignSelf: 'center', marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='VIEW NOW'
            onPress={this._click2}/>
            <Text style={{fontSize:9, marginBottom: 10, alignItems:'center', alignSelf: 'center'}}>
              Click "View Now" for more details.
            </Text>
        </Card>
      </ScrollView>
      <View style={{justifyContent: 'flex-end', flex:1, marginBottom:10, alignSelf: 'flex-end', marginRight: 10}}>
        <TouchableOpacity
            style={{width:40, height:40, marginTop:0, borderRadius: 25, marginTop:10, marginLeft:0 , backgroundColor: 'rgba(255,255,255,0.8)', alignItems:'center' , justifyContent:'center'}}
            onPress={this._click3}>
            <Image source={require('../icons/logo2-only.png')} style={{height:30, width:30}}/>
        </TouchableOpacity>
      </View>
        <View style={{alignItems:'center', justifyContent:'flex-end', alignSelf:'center'}}>
          <Text style={{alignSelf: 'center', alignItems:'center', fontSize:9}}>
            Thank for your contribution to our lovely Earth.
          </Text>
          <Text style={{alignSelf: 'center', fontSize:9}}>
            You are also a HERO!
          </Text>
      </View>
    </View>
    );
  }
}

export default Home;



  //****************** andrew part *****************//
/*  getReportsKey=()=> {
		console.log("length",this.state.reportsMade.length);
		console.log("title report",this.state.reportsTitle)
		console.log("title length",this.state.reportsTitle.length)

		if (this.state.reportsMade.length!=0){
			const result=
        (<View>
			       <Text style={{alignItems:'center',alignSelf:'center', marginTop:25}}>No reports submitted</Text>
			  </View>)
			return result;
		}else{
			console.log("title here",this.state.reportsTitle)
			var listReportTitle=[];
			for (var i=0; i<this.state.reportsTitle.length;i++){
				var listReport={};
				var keyname=this.state.reportsMade[i];
				var titleArray=this.state.reportsTitle[i];
				listReport["title"]=titleArray[keyname];
				listReport["key"]=this.state.reportsMade[i];
				listReportTitle.push(listReport);
			}
				console.log("listReportTitle",listReportTitle);

				const result=
        (
          <View style= {{width:width}}>
            {this.state.reports.map((report) => (
              <List>
                <ListItem
                  key={report.key}
                  title={`${report.title.toUpperCase()}`}
                  onPress={() => this.viewReportDetails(report.key)}
                />

                <Tile
                  imageContainerStyle={{opacity:0.6}}
                  imageSrc={require('../icons/galaxy.jpg')}
                  icon={{name:'progress-one', type:'entypo'}}
                  title='PROGRESS:'
                  caption='Waiting for respond'
                  titleStyle={{fontSize:13, color:'black', paddingBottom:0, marginBottom:0}}
                  captionStyle={{fontSize:15, color:'black', paddingTop:0, marginTop:0, fontWeight:'bold'}}
                  featured
                  onPress={() => this.viewReportDetails(report.key)}
                />
              </List>
						)).reverse()
					  }
				</View>)
				return result;
		}
	}
*/
  //****************** andrew part *****************//

  /*      this.setState({reportsMade : reportsArray});
        //this.setState({reportsTitle : snapshot.val()});
        console.log(snapshot.val());

        //we cannot straight away push snapshot.val()
        var store=snapshot.val()
        var newPost = reportsArray.length - this.state.reportsTitle.length

        if (newPost != 0){
          for (var i =0; i != newPost; i++){
          var newobject={};
          var keyname = reportsArray[(this.state.reportsTitle.length + newPost)]
          console.log("keyname    :  " +keyname)
          newobject[keyname]=store[keyname];
          console.log("newobject",newobject);
          this.state.reportsTitle.push(snapshot.val());
        }}

      */

      /*
        getReportDetails = (reportKey) => {
      		console.log("getting details")
      		return new Promise ((resolve, reject)=>{
      			console.log("getting key")
      			ReportRef=firebase.database().ref('/Reports/'+reportKey)
      			GetReportDetail=ReportRef.once("value",(snapshot)=>{
      				console.log(snapshot.val())
      				this.setState({returnedDetail:snapshot.val()})
      				resolve(snapshot.val())
      				}
      				)
      		})
      	}
      */
