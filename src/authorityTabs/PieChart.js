import React, { Component } from 'react';
import {  ScrollView , StatusBar,StyleSheet, Text, View, Button, Alert, Image, TouchableOpacity,FlatList,ActivityIndicator, BackHandler} from 'react-native';
import PieChart from 'react-native-pie-chart';
import firebase from 'firebase';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
	alignSelf:'center',
	justifyContent:'space-around',
  },
  title: {
    fontSize: 24,
    margin: 10,
	alignSelf:'center'
  }
});

export default class TestPieChart extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
		title: "Statistics",
	};

	constructor(props) {
		super(props);
		this.state = {
			authorityid:null, //WeiLi change to userid
			type:'Reports',
			reportsReceived:[],
			reportsReceivedDetails:[],
			reportsTitle:[],
			returnedDetail:[],
			loading:true,
			Quality:0,
			Price:0,
			Cleanliness:0,
			Attitude:0,
			Accessibility:0,
			Comfortness:0,
			Others:0,
			NullData:false
		}
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      this.getUserDetails()
    })

	}

  onBackButtonPressAndroid = () => {
      this.props.navigation.navigate("AuthorityHome")
    return true
  };


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
      this.setState({
        name: name,
        email:email,
        photoPath: photoUrl,
        authorityid: uid,
        refreshing: false,
      })
    }

    var reportsArray=[];
    //Get all reportkey //reference:https://stackoverflow.com/questions/41291980/how-to-get-the-value-of-children-in-firebase-javascript
    AuthorityReportRef=firebase.database().ref('/users/'+user.uid+'/ReportsReceived')
    GetReportKey= AuthorityReportRef.once("value",(snapshot)=>{
      snapshot.forEach((child)=>{
        //console.log("here")
        //console.log(child.key+"!!");
        reportsArray.push(child.key);
      })
      this.setState({reportsReceived : reportsArray});


      /*
      //we cannot straight away push snapshot.val()
      var store=snapshot.val()
      for (var keyname in store)
      {
        var newobject={};
        newobject[keyname]=store[keyname];
        console.log("newobject",newobject);
        this.state.reportsInfo.push(snapshot.val());
      }
      */

    }).then(()=>{
            var count = 0
            Reports_received=this.state.reportsReceived
            console.log("ReportsReceived",Reports_received)
            for (i=0; i<Reports_received.length; i++)
            {
              ReportRef=firebase.database().ref('/Reports/'+Reports_received[i])
              GetReportDetails= ReportRef.once("value",(data)=>{
                var dataStorage= data.val()
                console.log(dataStorage.category)
                //this.state.reportsReceivedDetails.push(data.val())
                if (dataStorage.category=="Product Quality")
                {
                  this.setState({Quality: this.state.Quality+ 1});
                }
                else if (dataStorage.category=="Price")
                {
                  this.setState({Price: this.state.Price+1});
                }
                else if (dataStorage.category=="Attitude")
                {
                  this.setState({Attitude: this.state.Attitude+1});
                }
                else if (dataStorage.category=="Cleanliness")
                {
                  this.setState({Cleanliness: this.state.Cleanliness+1});
                }
                else if (dataStorage.category=="Accessibility")
                {
                  this.setState({Accessibility: this.state.Accessibility+1});
                }
                else if (dataStorage.category=="Comfortness")
                {
                  this.setState({Comfortness: this.state.Comfortness+1});
                }
                else if (dataStorage.category=="Others")
                {
                  this.setState({Others: this.state.Others+1});
                }
                else
                {

                }
              }).then(()=>{
                //console.log(count)
                count = count+1
                if (count == this.state.reportsReceived.length){
                  if ((this.state.Quality + this.state.Price + this.state.Cleanliness+this.state.Comfortness+this.state.Accessibility+this.state.Attitude+this.state.Others)==0)
                  {
                    this.setState({NullData:true});
                  }
                  this.setState({loading: false});
                  //console.log(this.state.Quality)
                  //console.log("done loading");
                }
              })
            }
        });
  }

	componentDidMount() {
		//handleAndroidBackButton(this.navigateBack);
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );

	}


  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    console.log("end")
  }

  render() {
    const chart_wh = 250
    const series = [this.state.Quality, this.state.Price,this.state.Cleanliness,this.state.Attitude,this.state.Accessibility,this.state.Comfortness,this.state.Others]
	const sliceColor = ['#F44336','#2196F3','#FFB6C1', '#4CAF50', '#FF9800','#4B0082','#A9A9A9']
	const represents = ["quality","price","cleanliness","attitude","accessibility","comfortness","others"]

	const checkNullData = this.state.NullData ?
		(<View>
			<Text style={styles.title}>No Reports Received</Text>
		</View>
		):(<ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <StatusBar
            hidden={true}
          />
          <Text style={styles.title}>Pie Chart for categories of complaints</Text>
          <PieChart
            chart_wh={chart_wh}
            series={series}
            sliceColor={sliceColor}
          />

    <View style={{flex:1, flexDirection:'row'}} >
		  <Text style={{color:'#2196F3'}}>Price  --  </Text>
      <Text style={{color:'#2196F3'}}>{this.state.Price}</Text>
    </View>

    <View style={{flex:1, flexDirection:'row'}} >
		  <Text style={{color:'#4CAF50'}}>Attitude  --  </Text>
      <Text style={{color:'#4CAF50'}}>{this.state.Attitude}</Text>
    </View>

    <View style={{flex:1, flexDirection:'row'}} >
		  <Text style={{color:'#FFB6C1'}}>Cleanliness  --  </Text>
      <Text style={{color:'#FFB6C1'}}>{this.state.Cleanliness}</Text>
    </View>

    <View style={{flex:1, flexDirection:'row'}} >
		  <Text style={{color:'#FF9800'}}>Accessibility  --  </Text>
      <Text style={{color:'#FF9800'}}>{this.state.Accessibility}</Text>
    </View>

    <View style={{flex:1, flexDirection:'row'}} >
		  <Text style={{color:'#4B0082'}}>Comfortness  --  </Text>
      <Text style={{color:'#4B0082'}}>{this.state.Comfortness}</Text>
    </View>

    <View style={{flex:1, flexDirection:'row'}} >
		  <Text style={{color:'#F44336'}}>Product quality  --  </Text>
      <Text style={{color:'#F44336'}}>{this.state.Quality}</Text>
    </View>

      <View style={{flex:1, flexDirection:'row'}} >
  		  <Text style={{color:'#A9A9A9'}}>Others  --  </Text>
          <Text style={{color:'#A9A9A9'}}>{this.state.Others}</Text>
      </View>

      <View style={{flex:1, flexDirection:'row', marginTop:15}} >
        <Text style={{color:'black'}}>Total --  </Text>
          <Text style={{color:'black'}}>{this.state.Quality + this.state.Price + this.state.Cleanliness+this.state.Comfortness+this.state.Accessibility+this.state.Attitude+this.state.Others}</Text>
      </View>

        </View>
      </ScrollView>)

	const display= this.state.loading ?
		(
			<View style={{height:WindowHeight, alignItems:'center', justifyContent: 'center', flexDirection:'column'}}>
				<ActivityIndicator animating={this.state.loading}/>
				<Text>Loading...</Text>
			</View>
		):(<View>
			{checkNullData}
		</View>)


    return (
		<View style = {styles.container}>
			{display}
		</View>
    );
  }
}
