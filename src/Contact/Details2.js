import React from 'react';
import { ScrollView, StyleSheet, Text, View, Alert, Image, BackHandler } from 'react-native';

import { Tile, List, ListItem , Button, Card} from 'react-native-elements';
import Modal from 'react-native-modalbox'

import {checkFollowStatus, onFollowPress, deleteAuth, getUserDetails, updateDetail, addClaim, searchClaim, deleteClaim} from '../components/RealTimeDatabase'
import styles from '../tabs/styles'
import * as firebase from 'firebase'
import {QRCode} from 'react-native-custom-qr-codes'

class Details extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    headerStyle:{backgroundColor:'transparent'},
    headerBackTitle: null,
    headerTruncatedBackTitle: null,
  }

  constructor(props){
    super(props);
    this.state ={check: 0, doneCheck: false, follow: false, lastActive: ' ', points: 0, qr: '', claim: false, lastActive: '', expired: false, expiredTime: 0}
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    this._checkFollowStatus()
    })
  }

  _getQR = async() =>{
    const {userid} = this.props.navigation.state.params;
    var user = firebase.auth().currentUser;
    const qr = await searchClaim(user.uid, userid)
    //this.setState({qr:QR, doneCheck: true})
    if (qr != null){
      console.log(qr)
      this.setState({qr: qr, claim: true})
      lastActive = qr;

      var currentTime = Date.now()
      var activeTime = lastActive
      var offsetTime_ms = currentTime-activeTime
      var offsetTime_s = offsetTime_ms/1000
      var offsetTime_min = offsetTime_s/60
      if (offsetTime_min > 15){
        this.setState({expired: true})
        const qr = await deleteClaim(user.uid, userid)
      }else{
        this.setState({expiredTime: 15 - offsetTime_min})
      }
      var offsetTime_hr = offsetTime_min/60
      var offsetTime_day = offsetTime_hr/24

      var myDate = new Date( activeTime);
      var lastOnline = myDate.toUTCString()
      var timezone = 8
      var malTime = activeTime + 3600000*timezone
      var malDate = new Date(malTime);
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      var hour = (malDate.getUTCHours()<13)?(malDate.getUTCHours()):(malDate.getUTCHours() -12)
      if (hour == 0) {hour = 12}
      var min = (malDate.getUTCMinutes()<10)?('0'+malDate.getUTCMinutes()):(malDate.getUTCMinutes())
      var ampm = (malDate.getUTCHours()<12)?'am':'pm'
      var lastOnline_mal = day[malDate.getUTCDay()] +', '+ malDate.getUTCDate() + ' ' + month[malDate.getUTCMonth()] + ' '+ malDate.getUTCFullYear() + ' '+ hour + ':'+ min+ampm

      //var lastOnline_mal = malDate.getUTCHours()
      console.log('Active '+offsetTime_ms+ 'ms ago')
      console.log('Active '+offsetTime_s+ 's ago')
      console.log('Active '+offsetTime_min+ 'min ago')
      console.log('Active '+offsetTime_hr+ 'hour ago')
      console.log('Active '+offsetTime_day+ 'day ago')
      console.log('Last Active: '+ lastOnline_mal)

      if (offsetTime_s<60){
        this.setState({lastActive: 'Active '+Math.floor(offsetTime_s)+ 's ago'})
      }else if (offsetTime_min<60){
        this.setState({lastActive: 'Active '+Math.floor(offsetTime_min)+ ' min ago'})
      }else if (offsetTime_hr<24){
        this.setState({lastActive: 'Active '+Math.floor(offsetTime_hr)+ ' hour ago'})
      }else if (offsetTime_day<7){
        this.setState({lastActive: 'Active '+Math.floor(offsetTime_day)+ ' day ago'})
      }else{
        this.setState({lastActive: lastOnline_mal})
      }
    }
  }

  _checkFollowStatus = async() =>{
    this.setState({check:check, doneCheck: false})
    const {userid} = this.props.navigation.state.params;
    var user = firebase.auth().currentUser;
    const check = await checkFollowStatus(user.uid, userid)
    this._getDetails()
    this._getQR()
    console.log("check: "+ check)
    this.setState({check:check, doneCheck: true})
  }

      //var currentTime = firebase.database.ServerValue.TIMESTAMP
      //console.log('system time: '+ firebase.database.ServerValue.TIMESTAMP)
      //var activeTime = lastActive
      //var zzz = currentTime-activeTime
      //console.log('Last Active: '+zzz+ 'ms')
      //this.setState({lastActive: })

  componentDidMount() {
    this._getDetails()
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    const {previousScreen, id} = this.props.navigation.state.params;

    if (previousScreen == 'QRCode')
    this.props.navigation.navigate(previousScreen)

    if (previousScreen == 'Contact')
    this.props.navigation.navigate(previousScreen)

    if(previousScreen == 'Search')
    this.props.navigation.navigate(previousScreen, id)
    return true
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  onSentReport (){
    console.log("Report Page")
  }

  onCall(){
    const { phone } = this.props.navigation.state.params;
    console.log("calling " + phone)
  }

  onChat (){
    var my = firebase.auth().currentUser;
    const {userid} = this.props.navigation.state.params;
    this.props.navigation.navigate('Chat', {authid: userid, userid: my.uid, username:my.displayName})
  }

  _click = () => {
   this.setState({
     follow: true
   })
  }

  _click2 = async() => {
    var my = firebase.auth().currentUser;
    const {userid, points} = this.props.navigation.state.params;
      if (this.state.check == 0){
        if (this.state.points>= points){
          console.log("not follow")
          Alert.alert("Confirm Action", "Press ok to redeem",[{text: 'Cancel'}, {text: 'OK', onPress: () => {this._follow()}}]);
        }else{
          Alert.alert("Not enough points", "Recycle more items to gain more points. Press ok to continue",[{text: 'OK'}]);
        }
      }else{
        console.log("follow")
        Alert.alert("Confirm Action", "Press ok to claim. The voucher will only valid for 15 minutes after claim",[{text: 'Cancel'}, {text: 'OK', onPress: () => {this._unfollow()}}]);
      }
  }

    _getDetails = async() => {
      var my = firebase.auth().currentUser;
      const detail = await getUserDetails(my.uid)
      console.log(detail)
      this.setState({
        points: detail.points,
      })
    }

    _follow = async() => {
      var my = firebase.auth().currentUser;
      const {userid, points} = this.props.navigation.state.params;
      const ready = await onFollowPress(my.uid, userid)
      const ready2 = await updateDetail('points', this.state.points-points , my.uid)
      this.setState({points: this.state.points-points})
      this.setState({follow: true})
      this.setState({check: 1})
    }

    _unfollow = async() => {
      var my = firebase.auth().currentUser;
      const {userid} = this.props.navigation.state.params;
      const ready = await deleteAuth(my.uid, userid)
      const ready2 = await addClaim(my.uid, userid)
      this._checkFollowStatus()
      this.setState({follow: false})
      this.setState({check: 0})
      this._getQR()
      this.refs.modalUserid.open()
    }

  render() {
    /*
    <List>
      <ListItem
        title="QR CODE"
        rightTitle="Click for QR CODE"
        onPress={() => this.refs.modalUserid.open()}
        hideChevron
      />
    </List>
    */
    const { name, email, phone, userid, birthday, address, photoURL, lastActive, city, points, details} = this.props.navigation.state.params;

    if (this.state.follow === true){
      setTimeout(() => {this.setState({follow: false})}, 1000)
    }

    const expired = this.state.expired? ('Expired'):('Valid for ' + Math.round(this.state.expiredTime) + ' minutes')

    var qrcode = this.state.claim? (
      <List containerStyle={{width:width -15, alignSelf: 'center', borderTopColor: 'transparent', borderBottomColor: 'transparent'}}>
        <ListItem
          containerStyle={{borderTopColor: 'transparent', borderBottomColor: 'transparent'}}
          title="QR Code"
          rightTitle= {expired}
          hideChevron
          onPress={() => this.refs.modalUserid.open()}
        />
      </List>):(
        <Text></Text>
      )

    const notRedeemOrClaim = this.state.claim?('Use the QR Code to claim your items'):('Not Redeemed (Double Tab Photo to redeem)')
    const followStatus = this.state.doneCheck? ((this.state.check == 0)?
      (<Text style={{alignSelf:'center'}}>{notRedeemOrClaim}</Text>):
      (<Text style={{alignSelf:'center'}}>Redeemed (Double Tab Photo to claim)</Text>)):(<Text></Text>)

    const followOrUnfollow = (this.state.check == 0)? 'redeem': 'claim'

      var profilePic = this.state.follow?(
        <Tile
          imageSrc={{uri: photoURL}}
          imageContainerStyle={{opacity:0.2}}
          activeOpacity= {1}
          onPress={this._click2}
          featured
          caption={'Tap Again to '+ followOrUnfollow}
          captionStyle = {{color: 'black'}}
        />
      ):(
        <Tile
          imageSrc={{uri: photoURL}}
          imageContainerStyle={{}}
          onPress={this._click}
          featured
          title={`${name.toUpperCase()}`}
          caption={`${points} points`}
        />
      )

    return (
    <View>
      <ScrollView>
        {profilePic}
        {followStatus}
        {qrcode}
        <Card
          containerStyle={{width:width -15, alignItems:'center', alignSelf: 'center'}}
          title={`Details`}>
          <Text style={{fontSize:15, marginLeft:10, marginRight:10, alignSelf: 'center', marginBottom: 10, alignItems:'center', alignSelf: 'center'}}>
            {details}
          </Text>
          <Text style={{fontSize:9, marginBottom: 15, marginTop:20, alignItems:'center', alignSelf: 'center'}}>
            *You have {this.state.points} points left.
          </Text>
        </Card>
      </ScrollView>

      <Modal style={styles.modalContainerUserid}
        position={"center"} backButtonClose={true} ref={"modalUserid"} isDisabled={this.state.isDisabled}>
        <Text>Voucher Code</Text>
        <QRCode content={Math.round((this.state.qr)/100000000).toString()} backgroundImage={require('../icons/galaxy2.jpg')} codeStyle='circle'/>
      </Modal>
    </View>
    );
  }
}

export default Details;
