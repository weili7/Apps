import React, {Component} from 'react';
import { AppState, StyleSheet, Text, ScrollView, View, Alert, Image,Dimensions, TextInput, BackHandler, TouchableOpacity, RefreshControl, ActivityIndicator} from 'react-native';
import styles from './styles'
import * as firebase from 'firebase'
import {Icon, SearchBar, Tile, Button, List, ListItem} from 'react-native-elements';
import {onFollowPress, updateDetail, moveFirebase} from '../components/RealTimeDatabase'
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
      name:'',
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
    this.updateReport ()
    this.refs._scrollView.scrollTo({x:0,y:0, animated:true})
  //  this.completed()
  })
  }

  completed = async() =>{
    var user = firebase.auth().currentUser;
    const ready = await moveFirebase(user.uid, '-LR6DMe4EJguAuzmXga0')
  }


  componentWillMount(){
  }

  componentDidMount() {
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
    UserReportRef=firebase.database().ref('/users/'+user.uid+'/ReportsCompleted')
    GetReportKey= UserReportRef.once("value",(snapshot)=>{
      snapshot.forEach((child)=>{
        reportsArray.push(child.key);
      })
    this.setState({reportsArray:reportsArray})
    this.getReportDet(reportsArray)

    });
  }

  viewReportDetails = (report) => {
    //console.log()
    this.props.navigation.navigate("UserViewReport", {...report});
    };

  //****************** andrew part *****************//

  onBackButtonPressAndroid = () => {
    this.props.navigation.navigate("Home")
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _startup = async() => {
    var user = firebase.auth().currentUser;
  }

  _click = async() => {
   Alert.alert("hello", "notification")
  }

  _click2 = async() => {
   this.props.navigation.navigate("Report");
  }

  _click3 = async() => {
   this.refs._scrollView.scrollTo({x:0,y:0, animated:true})
  }

  _onRefresh = () => {
    console.log("refresh")
    this.setState({refreshing:true})
    this.updateReport ()
    this.refs._scrollView.scrollTo({x:0,y:0, animated:true})
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
        <ActivityIndicator color='orange' animating={this.state.loading}/>
      </View>
    ):(
      <View style={{width:width,}}>
        {reports}
      </View>
    )

    return (
      <View style={{
        flex: 1,
        alignItems: 'center',}}>
      <ScrollView
        refreshControl={
        <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh}/>
        }
        ref='_scrollView'
      >
      {display}
      </ScrollView>
      <View style={{justifyContent: 'flex-end', flex:1, marginBottom:10, alignSelf: 'flex-end', marginRight: 10}}>

      <TouchableOpacity
          style={{width:40, height:40, marginTop:0, borderRadius: 25, marginLeft:0 , backgroundColor: 'rgba(255,255,255,0.8)', alignItems:'center' , justifyContent:'center'}}
          onPress={this._click3}>
          <Icon type='entypo' color={'rgba(255,119,26,0.85)'} name='chevron-small-up' size={30}/>
      </TouchableOpacity>

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
