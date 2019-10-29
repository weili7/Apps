import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator, createTabNavigator } from 'react-navigation'

import FirstScreen from './src/FirstScreen'

//import LoginNavigator from './src/Login/LoginNavigator'
import Login from './src/Login/Login'
import SignUp from './src/Login/SignUp'

//import FirstTimeLogin from './src/Login/FirstTimeLogin'
import AuthorityOrUser from './src/Login/AuthorityOrUser'
import Page1 from './src/Login/FirstTimeLoginPage1'
import Page2 from './src/Login/FirstTimeLoginPage2'
import Page3 from './src/Login/FirstTimeLoginPage3'

//import MainTabNavigator from './src/MainTab/MainTabNavigator'
import Home from './src/tabs/Home'
import CompletedReport from './src/tabs/CompletedReport'
import AuthorityCompletedReport from './src/tabs/AuthorityCompletedReport'
import Search from './src/tabs/Search'
import UserViewReport from './src/Home/UserViewReport'
import Report from './src/Home/Report'
import Map from './src/Home/Map'
import ReportAuthority from './src/Home/ReportAuthority'
import NewAuthSearch from './src/Home/NewAuthSearch'

import Read from './src/tabs/Page1'

import Contact from './src/tabs/Contact'
import Claim from './src/tabs/Claim'
import Details from './src/Contact/Details2'
import Chat from './src/Contact/Chat'
import AuthorityChat from './src/Contact/AuthorityChat'

import Profile from './src/tabs/Profile'
import Settings from './src/tabs/Settings'
import Loading from './src/Login/Loading'
import Reauthenticate from './src/Login/Reauthenticate'
import AuthorityReauthenticate from './src/Login/AuthorityReauthenticate'
import AccountDetails from './src/Contact/AccountDetails2'
import PieChart from './src/authorityTabs/PieChart'
import QRCode from './src/tabs/QRcode'

import FeedPage from './src/fake/feed/FeedPage'
import NearbyPage from './src/Nearby/NearbyPage'

import AuthorityHome from './src/authorityTabs/AuthorityHome'
import AuthorityQRCode from './src/authorityTabs/AuthorityQRcode'
import AuthorityFeed from './src/authorityTabs/AuthorityFeed'
import AuthorityContact from './src/authorityTabs/AuthorityContact'
import AuthorityProfile from './src/authorityTabs/AuthorityProfile'
import AuthoritySearch from './src/authorityTabs/AuthoritySearch'
import AuthorityViewReport from './src/authorityTabs/AuthorityViewReport'

var RootStackNavigator = createStackNavigator({
  //  UserViewReport: {screen: UserViewReport},
  //  AccountDetails : {screen: AccountDetails, navigationOptions:{header:null}},
    FirstScreen: {screen: FirstScreen, navigationOptions:{header:null}},

    //LoginNavigator:{screen:LoginNavigator},
    Login: {screen: Login, navigationOptions:{header:null}},
    SignUp:{screen: SignUp, navigationOptions:{header:null}},

    //FirstTimeLogin: {screen: FirstTimeLogin},
    AuthorityOrUser: {screen: AuthorityOrUser, navigationOptions:{header:null}},
    Pg1: {screen: Page1, navigationOptions:{header:null}},
    Pg2: {screen: Page2, navigationOptions:{header:null}},
    Pg3: {screen: Page3, navigationOptions:{header:null}},

    UserViewReport: {screen: UserViewReport},
    Report: {screen: Report},
    CompletedReport:{screen:CompletedReport},
    AuthorityCompletedReport:{screen:AuthorityCompletedReport},
    Map: {screen: Map},
    ReportAuthority:{screen:ReportAuthority},
    NewAuthSearch:{screen:NewAuthSearch, navigationOptions:{header:null}},
    Search: {screen: Search, navigationOptions:{header:null}},
    Details: {screen: Details,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.name.toUpperCase()}`,
        }),
      },
    Chat: {screen: Chat},
    AuthorityChat: {screen: AuthorityChat},

    PieChart: {screen:PieChart},

    AuthorityViewReport:{screen:AuthorityViewReport},
    AuthoritySearch:{screen:AuthoritySearch, navigationOptions:{header:null}},
    AuthorityTabNavigator:{screen: createTabNavigator({
        AuthorityQRCode: {screen: AuthorityQRCode},
        AuthorityFeed: {screen: AuthorityFeed},
        AuthorityHome: {screen: AuthorityHome},
        AuthorityContact: {screen: AuthorityContact},
        AuthorityProfile: {screen: AuthorityProfile},
        },{
          tabBarPosition: 'bottom',
          swipeEnabled: true,
          tabBarOptions:{
            activeTintColor: 'rgba(255,100,26,1)',
            inactiveTintColor: 'grey',
            showIcon: true,
            showLabel: true,
            upperCaseLabel:false,
            headerMode: 'none',
            style:{backgroundColor: 'white',},
            indicatorStyle:{height:0,},
            iconStyle:{
              padding:0,
              margin:0
            },
            labelStyle:{
              fontSize: 7,
              padding:0,
              margin:0
            },
            //tabStyle:{
            //  height:55,
            //},
          },
        }), navigationOptions:{header:null}},

        MainTabNavigator:{screen: createTabNavigator({

            QRCode: {screen: QRCode},
            //Read: {screen: Read},
            FeedNavigator:{screen: createTabNavigator({
                FeedPage:{screen: FeedPage},
                Map:{screen: Map},
              },{
                    tabBarOptions:{
                    showLabel: true,
                    headerMode: 'none',
                    style:{backgroundColor: '#66BB6A'},
                    indicatorStyle:{height:2,},
                    //tabStyle:{
                    //  height:55,
                    //},
                    }
              }), navigationOptions:{
                tabBarLabel: "Feed",
                tabBarIcon: ({tintColor}) => (
                  <Image
                    source = {require('./src/icons/book.png')}
                    style = {{width:18, height:18, tintColor: tintColor}}>
                  </Image>
                )
              }},
            Home: {screen: Home},
            Contact: {screen: Contact},
            Profile: {screen: Profile},
            },{
              tabBarPosition: 'bottom',
              swipeEnabled: true,
              tabBarOptions:{
                activeTintColor: '#66BB6A',
                inactiveTintColor: 'grey',
                showIcon: true,
                showLabel: true,
                upperCaseLabel:false,
                headerMode: 'none',
                style:{backgroundColor: 'white',},
                indicatorStyle:{height:0,},
                iconStyle:{
                  padding:0,
                  margin:0
                },
                labelStyle:{
                  fontSize: 7,
                  padding:0,
                  margin:0
                },
                //tabStyle:{
                //  height:55,
                //},
              },
            }), navigationOptions:{header:null}},

    Claim: {screen: Claim, navigationOptions:{header:null}},

    Reauthenticate: {screen: Reauthenticate},
    AuthorityReauthenticate:{screen:AuthorityReauthenticate},
    Settings: {screen: Settings},
    Loading:{screen: Loading, navigationOptions:{header:null}},

    },{
    headerBackTitleVisible: true,
    navigationOptions:{
        headerStyle:{backgroundColor:'#388E3C',},
        headerTintColor:'#A5D6A7',
    }
    }
  )

export default RootStackNavigator;
