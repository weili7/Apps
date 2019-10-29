import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Dimensions, Text, View, Button, Alert, Image, BackHandler,  ActivityIndicator} from 'react-native';
import styles from './styles'
import {Icon, SearchBar, Tile, List, ListItem} from 'react-native-elements';
import * as firebase from 'firebase'
import {getAllAuth, getUserDetails} from '../components/RealTimeDatabase'
var {height, width} = Dimensions.get('window')

class Contact extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    tabBarLabel: "Redeem",
    tabBarIcon: ({tintColor}) => (
      <Image
        source = {require('../icons/shop.png')}
        style = {{width:23, height:23, tintColor: tintColor}}>
      </Image>)
  }

    constructor(props){
      super(props);
      this.state ={currentState: 'Contact',dataReady: false, users:[] , filterUsers:[], points: 0, filter: false}
      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      this._onRefreshContact()
      this._getDetails()
    })
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

    _onFilter = () => {
      filterUsers = []
      for (var i=0; i<this.state.users.length;i++){
          if (this.state.points > this.state.users[i].points){
              filterUsers.push(this.state.users[i])
          }
        }
      this.setState({filterUsers:filterUsers, filter: !this.state.filter})
      //this.setState({filterUsers: this.state.users})
      //console.log(this.state.filterUsers)
    };

    _getDetails = async() => {
      var my = firebase.auth().currentUser;
      const detail = await getUserDetails(my.uid)
      console.log(detail)
      this.setState({
        points: detail.points,
      })
    }

    _onRefreshContact = async() =>{
      users = []
      var my = firebase.auth().currentUser;
      const usersid = await getAllAuth()
      for (var i=0; i<usersid.length;i++)
        {
          users.push(await getUserDetails(usersid[i]))
        }
      users.sort(function(users1, users2){
          if (users1.name>users2.name)
          return 1
          if (users1.name<users2.name)
          return -1
      })
      this.setState({dataReady: true, users:users})
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

      const users = this.state.filter? (this.state.filterUsers): (this.state.users)

      const filterOrUnfilter = this.state.filter? ("All Voucher"):("Avaliable Voucher")

      const data = this.state.dataReady? (
        <List>
            {users.map((user) => (
                <ListItem
                  containerStyle={{width:width}}
                  key={user.userid}
                  roundAvatar
                  avatar={{ uri: user.photoURL }}
                  title={`${user.name.toUpperCase()}`}
                  subtitle={user.phone}
                  rightTitle={`${user.points} points`}
                  onPress={() => this.onLearnMore(user)}
                />
              ))}
        </List>
      ):(
        <View>
          <ActivityIndicator color='#66BB6A' animating={true}/>
        </View>
      )

    return (
      <View style={{
        flex: 1,
        alignItems: 'center',}}>
        <View style={{height: 0, justifyContent: 'flex-start',alignItems: 'center', backgroundColor: '#66BB6A', paddingVertical:25, paddingHorizontal:width, flexDirection:'row'}}>
          <TouchableOpacity
              style={{width:30, height:40, marginTop:14, marginLeft:0, paddingRight:0, backgroundColor: 'transparent', alignItems:'flex-end' }}
              activeOpacity={1}>
              <Icon type='material-community' color='rgba(255,255,255,0.9)' name='account-search'/>
          </TouchableOpacity>
          <SearchBar
              lightTheme
              containerStyle = {{width:width - 80, marginTop:0, backgroundColor: 'transparent', borderTopColor:'transparent', borderBottomColor:'transparent'}}
              placeholder='   Search'
              placeholderTextColor = '#388E3C'
              inputStyle={{borderRadius: 12, justifyContent:"center", backgroundColor:"rgba(255,255,255, 0.5)"}}
              textInputStyle={{marginLeft:20}}
              noIcon
              onTouchStart ={()=> {this.props.navigation.navigate('Search');}}
              clearIcon = {false}
              showLoadingIcon = {false}
              value ={this.state.name}
              onChangeText={name=> this.setState({name})}/>
              <TouchableOpacity
                  style={{width:30, height:40, marginTop:11, marginLeft:5, paddingRight:0, backgroundColor: 'transparent', alignItems:'flex-start' }}
                  >
              </TouchableOpacity>
            </View>
        <ScrollView>
          {data}
        </ScrollView>
        <TouchableOpacity onPress={this._onFilter}>
            <Text>{filterOrUnfilter}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


export default Contact;
