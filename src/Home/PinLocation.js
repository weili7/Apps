import React, { Component } from 'react'
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps'
import { View, StyleSheet,ActivityIndicator, Text,TouchableOpacity, Dimensions} from 'react-native'
import Geocoder from 'react-native-geocoding';
var {height, width} = Dimensions.get('window')

import LaunchNavigator from 'react-native-launch-navigator';

//for marker
let id = 0;
function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

class PinLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      yourLocation: true,
      destinationLatitude: null,
      destinationLongitude: null,
      Markerlatitude: null,
      Markerlongitude: null,
      error: null,
	  addressComponent: null,
	  locationLoaded:false,
	  markers: [],
	  coordinate:{},
	  addressComponent: null,
    address: null,
	  region: {
		  latitude: 37.78825,
		  longitude: -122.4324,
		  latitudeDelta: 0.0922,
		  longitudeDelta: 0.0421,
	  },
    };
  }

  componentDidMount() {
  //for back button
    navigator.geolocation.getCurrentPosition(
      (position) => {
      /*
        this.setState({
          Markerlatitude: position.coords.latitude,
          Markerlongitude: position.coords.longitude,
          error: null,

      locationLoaded:true
        });
    */
    this.setState({
      region:{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        //latitude: 37.78825,
        //longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
        },
      locationLoaded:true,
      Markerlatitude: position.coords.latitude,
            Markerlongitude: position.coords.longitude,
    });
    //global.currentlatitude = this.state.Markerlatitude;
    //global.currentlongitude = this.state.Markerlongitude;

    this.setState({
      markers:[
      {
        coordinate: { "longitude": this.state.Markerlongitude, "latitude": this.state.Markerlatitude },
        key: id,
        color:'rgba(255,165,0,0)', //afterwards can change to the crabb logo
        title:'You are here',
      },
      {
        coordinate: { "longitude": 100.275207, "latitude": 5.287806},
        key: 1,
        color:'#009688', //afterwards can change to the crabb logo
        title:'National Instruments',
      },
      {
        coordinate: { "longitude": 100.306528, "latitude": 5.333065},
        key: 1,
        color:'#009688', //afterwards can change to the crabb logo
        title:'Queensbay Mall',
      }
      ],
    });

    this.getLocationName();
      },
      (error) => {
      this.setState({ error: error.message })
      console.log("ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRROOOOOOOOOOORRRRRRRRRRRRRRRR")
      this.setState({
      region:{
        latitude: 5.286502,
        longitude: 100.276099,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
        },
      locationLoaded:true,
      Markerlatitude: 5.286502,
            Markerlongitude:100.276099,
      });
      this.setState({
      markers:[
      {
        coordinate: { "longitude": this.state.Markerlongitude, "latitude": this.state.Markerlatitude },
        key: id,
        color:'rgba(255,165,0,0)', //afterwards can change to the crabb logo
        title:'You are here',
      },
      {
        coordinate: { "longitude": 100.275207, "latitude": 5.287806},
        key: id,
        color:'#009688', //afterwards can change to the crabb logo
        title:'National Instruments',
      },
      {
        coordinate: { "longitude": 100.306528, "latitude": 5.333065},
        key: id,
        color:'#009688', //afterwards can change to the crabb logo
        title:'Queensbay Mall',
      }
      ],
    });

    this.getLocationName();
    },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 1000 },
    );
  //maybe can have an initial marker where the coordinate = the current location of user
  /*
  this.setState({
      markers: [
        {
          coordinate: this.state.coordinate
          key: id,
      //key: id++,
          //color: randomColor(),
      color:'rgba(255,165,0,0)', //afterwards can change to the crabb logo
        },
      ],
    });
  */
  }

  getLocationName()
  {
  	Geocoder.init('AIzaSyDTIigvjhkwjaCk3z0jhXThAS8KZVyAW5U');
  	Geocoder.from(this.state.Markerlatitude, this.state.Markerlongitude)
  		.then(json => {
  			var addressComponent = json.results[0].formatted_address;
  			console.log(json.results[0]);
  			this.setState({addressComponent:addressComponent, address: addressComponent})
  			//this.props.callbackForLocation(this.state.Markerlatitude,this.state.Markerlongitude,this.state.addressComponent);
  		})
  		.catch(error => console.warn(error));
  }

  DonePin(){
	  this.props.navigation.navigate('MenuPage');
  }


  onMapPress(e) {
	console.log("Pressed");
	console.log(e.nativeEvent.coordinate); //to get the latitude and longitude
    this.setState({
      markers: [
        //...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          key: id,
		  //key: id++,
          //color: randomColor(),
		  color:'rgba(255,165,0,0)', //afterwards can change to the crabb logo
        },
      ],
	  Markerlatitude:e.nativeEvent.coordinate.latitude,
	  Markerlongitude:e.nativeEvent.coordinate.longitude,
    });
	console.log(this.state.markers);
	this.getLocationName();

  }
  onRegionChange(regionChanged) {
	this.setState({ region:regionChanged });
  }

  /*backup
	<Text>Latitude: {this.state.Markerlatitude}</Text>
	<Text>Longitude: {this.state.Markerlongitude}</Text>
	<Text>Address: {this.state.addressComponent}</Text>
		<View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.DonePin()}
            style={[styles.bubble, styles.button]}
          >
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
  */

  onOkPress = ()=>{
    //console.log("ok")
    LaunchNavigator.setGoogleApiKey('AIzaSyDTIigvjhkwjaCk3z0jhXThAS8KZVyAW5U');
    LaunchNavigator.navigate([this.state.destinationLatitude, this.state.destinationLongitude], {
    })
    .then(() => console.log("Launched navigator"))
    .catch((err) => console.error("Error launching navigator: "+err));
  }

  markerClick(marker){
    if (marker.title == 'You are here'){
      this.setState({address: this.state.addressComponent, destinationLatitude: null, destinationLongitude:null, yourLocation: true})
    }else{
      this.setState({address: marker.title, destinationLatitude: marker.coordinate.latitude, destinationLongitude: marker.coordinate.longitude, yourLocation: false})
    }
  }

  render () {
    var okButton=this.state.yourLocation?
    (
      <Text></Text>
    ):(
      <TouchableOpacity
          style={{width:80, height:25, marginLeft:10, borderRadius: 20, marginRight:10, justifyContent:'center', backgroundColor: '#1c313a', alignItems:'center'}}
          onPress={() =>this.onOkPress()}>
          <Text style={{color: '#66BB6A', justifyContent:'center'}}> Navigate </Text>
      </TouchableOpacity>
    )
	 const map_return=this.state.locationLoaded?
	 (<View style={styles.container}>
		<View style={styles.contentBoxes}>
			<Text style={{width:width-130, marginLeft:15}} multiline={true}>{this.state.address}</Text>
      {okButton}
		</View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map2}
		  loadingEnabled={true}
		  initialRegion={this.state.region}
		  //region is for region to be focused on
		  /*
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
			//latitude: 37.78825,
            //longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
		  */
        >
			{this.state.markers.map(marker => (
				<Marker
				  key={marker.key}
				  coordinate={marker.coordinate}
				  pinColor={marker.color}
          onPress={() => this.markerClick(marker)}
				/>
			  ))}
		</MapView>

      </View>
	):
		<View style={styles.contentBoxes}>
			<Text>Loading...</Text>
		</View>

    return (
		<View style={styles.container}>
			{map_return}
		</View>
    )
  }
}
const styles = StyleSheet.create({
  container: { ... StyleSheet.absoluteFillObject },
  container2:{
	  height:500
  },
  map: { ...StyleSheet.absoluteFillObject },
  map2: {height:height-130, width:width-4, justifyContent:'center', alignSelf:'center'},
  contentBoxes:{
		flexDirection:'row',
    marginTop:5,
		marginLeft:2,
    height:40,
		marginRight:2,
		alignItems:'center',
		justifyContent:'center',
		backgroundColor: 'rgba(360,360,360,0.5)',
	},
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 140,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
	alignItems:'center',
	justifyContent:'center',
    //marginVertical: 20,
	height: 50,
    backgroundColor: 'transparent',
  },
})
export default PinLocation
