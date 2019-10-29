import React from 'react';
import { ScrollView, StyleSheet, Text, View, Alert, Image, BackHandler, TouchableOpacity, Dimensions} from 'react-native';

import {Icon, SearchBar, Button} from 'react-native-elements';
import styles from './styles'
import * as firebase from 'firebase'

import { List, ListItem } from 'react-native-elements';
//import { users } from './data';
import {getUserDetails, searchAuth, searchPost} from '../components/RealTimeDatabase'

var {height, width} = Dimensions.get('window')

class AuthoritySearch extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

    static navigationOptions = {
      headerStyle:{backgroundColor:'transparent'},
      headerTitleStyle:{paddingBottom:0},
    }

    constructor(props){
      super(props);
      this.state ={currentState: 'Search',dataReady: false, users:[], name:'', id:' ', loading:false , clear:false}
      this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        this.search.focus()
      })
    }

    componentDidMount() {
      this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
      );
    }

    onBackButtonPressAndroid = () => {
      this.props.navigation.navigate("AuthorityHome")
      return true
    };

    componentWillUnmount() {
      this._didFocusSubscription && this._didFocusSubscription.remove();
      this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    onLearnMore = (report) => {
      this.props.navigation.navigate("AuthorityViewReport", {...report})
    };

    _click = async(name) => {
      console.log('name: '+name)
      if (name==''){this.setState({clear:false})}
      else{this.setState({clear:true})}
      this.setState({name:name, loading:true})
      var id = await searchPost(name)
      console.log(id)
      if (name==''){id = 0}
      //this._onSearch(id)
      this.setState({loading:false, dataReady: true, users:id})
    }

    _onSearch = async(id) =>{
      var my = firebase.auth().currentUser;
      var users = []
      console.log(id)
      for (var i=0; i<id.length;i++)
      {
        users.push(await getUserDetails(id[i]))
      }
      this.setState({loading:false})
      console.log(users)
      this.setState({dataReady: true, users:users})
    }

    _back = () => {
      console.log("back")
      this.props.navigation.navigate("AuthorityHome")
    }

    render() {
      const dps = this.state.clear?(
      <View style={{width:width}}>
        <ScrollView>
          <List containerStyle={{borderTopWidth:0, borderBottomWidth:0}}>
            {this.state.users.map((user) => (
                <ListItem
                  key={user.key}
                  roundAvatar
                  avatar={{ uri: user.image }}
                  title={user.title}
                  subtitle={new Date(user.createdAt).toLocaleString()}
                  onPress={() => this.onLearnMore(user)}
                />
              ))}
          </List>
        </ScrollView>
      </View>):(<View></View>)
    return (
      <View style={{
        flex: 1,

        alignItems: 'center',}}>
      <View style={{height: 0, justifyContent: 'flex-start',alignItems: 'center', backgroundColor: '#718792', paddingVertical:30, paddingHorizontal:width, flexDirection:'row'}}>
      <TouchableOpacity
          style={{width:25, height:40, marginTop:15, marginLeft:10, backgroundColor: 'transparent', alignItems:'flex-start' }}
          onPress={this._back}>
          <Icon type='ionicon' color='rgba(255,255,255,0.9)' name='md-arrow-back'/>
      </TouchableOpacity>
      <SearchBar
          ref={search => this.search = search}
          lightTheme
          containerStyle = {{width:width-50, marginTop:0, backgroundColor: 'transparent', borderTopColor:'transparent', borderBottomColor:'transparent'}}
          placeholder='Search Report'
          placeholderTextColor = '#718792'
          inputStyle={{borderRadius: 12, backgroundColor:"rgba(255,255,255, 0.5)"}}
          textInputStyle={{marginLeft:20, color:'rgba(255,119,26,1)' }}
          noIcon
          clearIcon = {this.state.clear}
          showLoadingIcon = {this.state.loading}
          value ={this.state.name}
          onChangeText={name=> this._click(name)}/>
      </View>
      {dps}
    </View>
    );
  }
}


export default AuthoritySearch;
