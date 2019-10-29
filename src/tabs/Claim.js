import React from 'react';
import { ScrollView, StyleSheet, Text, Dimensions, View, Button, Alert, Image, BackHandler, TouchableOpacity, ActivityIndicator} from 'react-native';
import styles from './styles'
import * as firebase from 'firebase'

import { List, ListItem, Icon } from 'react-native-elements';
import {getFollowDetails, getClaimDetails} from '../components/RealTimeDatabase'

var {height, width} = Dimensions.get('window')

class Claim extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "Contact",
    tabBarIcon: ({tintColor}) => (
      <Image
        source = {require('../icons/contact.png')}
        style = {{width:22, height:22, tintColor: tintColor}}>
      </Image>)
  }

    constructor(props){
      super(props);
      this.state ={currentState: 'Contact',dataReady: false, users:[], noVoucher:false}
      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    )
      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      this._onRefreshContact()
    )
    }

    componentDidMount() {
      this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      );

      this._onRefreshContact()
    }

    onBackButtonPressAndroid = () => {
      this.props.navigation.navigate("Home")
      return true
    };

    componentWillUnmount() {
      this._didFocusSubscription && this._didFocusSubscription.remove();
      this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    onLearnMore = (user) => {
      console.log(user)
    this.props.navigation.navigate('Details', { ...user , previousScreen:'Contact'});
    };

    _onRefreshContact = async() =>{
      var my = firebase.auth().currentUser;
      const users1 = await getFollowDetails(my.uid)
      const users2 = await getClaimDetails(my.uid)
      users = users1.concat(users2)
      console.log(users)
      if (users == ''){
        this.setState({noVoucher:true})
      }
      users.sort(function(users1, users2){
          if (users1.name>users2.name)
          return 1
          if (users1.name<users2.name)
          return -1
      })
      this.setState({dataReady: true, users:users})
    }

    back = () => {
      console.log("back")
      this.props.navigation.navigate("Home")
    }

    render() {
/*      {users.map((user) => (
        <ListItem
          key={user.login.username}
          roundAvatar
          avatar={{ uri: user.picture.thumbnail }}
          title={`${user.name.first.toUpperCase()} ${user.name.last.toUpperCase()}`}
          subtitle={user.phone}
          onPress={() => this.onLearnMore(user)}
        />
      ))}
      */
      const data = this.state.dataReady? (
        <List>
            {this.state.users.map((user) => (
                <ListItem
                  key={user.userid}
                  roundAvatar
                  avatar={{ uri: user.photoURL }}
                  title={`${user.name.toUpperCase()}`}
                  subtitle={user.phone}
                  onPress={() => this.onLearnMore(user)}
                />
              ))}
        </List>
      ):(
        <View>
          <ActivityIndicator color='#66BB6A' animating={true}/>
        </View>
      )

      const voucher = this.state.noVoucher? (
          <View style={{justifyContent: 'center', alignSelf: 'center', marginTop:15}}>
            <Text style={{justifyContent: 'center', alignSelf: 'center'}}>No Voucher Redeemed</Text>
          </View>
      ):(
        <View>
          {data}
        </View>
      )

    const {users} = this.state
    return (
      <View>
        <View style = {{height:50, width:width, alignItems: 'flex-start', alignSelf: 'flex-start', backgroundColor:'#66BB6A', flexDirection: 'row'}}>
          <TouchableOpacity
              style={{width:25, alignSelf: 'flex-start', marginLeft:10, height:40, marginTop:14, marginLeft:20, backgroundColor: 'transparent', alignItems:'flex-start' }}
              onPress ={() => this.back()}>
              <Icon type='ionicon' color='rgba(255,255,255,0.9)' name='md-arrow-back'/>
          </TouchableOpacity>
          <Text style={{color:'white', marginTop:0, marginLeft:width-295, alignSelf:'center', fontSize:16}}>Redeemed Voucher</Text>
        </View>

        <ScrollView>
          {voucher}
        </ScrollView>
      </View>
    );
  }
}


export default Claim;
