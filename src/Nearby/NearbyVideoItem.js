import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import {Icon} from 'react-native-elements';


export default class VideoItem extends React.Component {

  constructor() {
		super();
		this.state = {
			upToggle: 0,
			colours:['grey', '#cd0000']
		}
	}

	setUpState=()=>{
		if (this.state.upToggle == 0)
		{
			this.setState({upToggle:1});
		}
		else
		{
			this.setState({upToggle:0});
		}
	}

	/*
				<Text style={styles.channelTitleText}>TESTING</Text>
				<View style={styles.descContainer}>
					<Image source={{ uri: video.imageURLs[0] }} style={{marginTop:-5, width:40, height: 40, borderRadius:25 }} />
					<View style={styles.videoDetails}>
						<Text style={styles.channelTitleText}>{video.userid}</Text>
					</View>
				</View>
				<Image source={{ uri: video.imageURLs[0] }} style={{  height: 200 }} />
				<View style={styles.descContainer2}>
					<View style={styles.videoDetails}>
						<Text style={styles.videoStats}>{video.title}</Text>
						<Text numberOfLines={5} style={styles.videoTitle}>{video.description}</Text>
						<Text style={styles.videoStats}>Location: {video.location}</Text>
						<Text style={styles.videoStats}>{video.longitude}</Text>
					</View>
					<TouchableOpacity>
                        <Icon name="thumb-up" size={40} color="#999999"/>
                    </TouchableOpacity>
				</View>
	*/
    render() {
    let video = this.props.video;
	console.log("VVVVV",video)
	return(
			<View style={styles.border}>
				<View style={styles.descContainer}>
					<Image source={{ uri: video.userPhoto}} style={{marginTop:-5, width:40, height: 40, borderRadius:25 }} />
					<View style={styles.videoDetails}>
						<Text style={styles.channelTitleText}>{video.username}</Text>
					</View>
				</View>
				<Image source={{ uri: video.image }} style={{  height: 200 }} />
				<View style={styles.descContainer2}>
					<View style={styles.videoDetails}>
						<Text style={styles.videoStats}>{video.title}</Text>
						<Text numberOfLines={5} style={styles.videoTitle}>{video.description}</Text>
						<Text style={styles.videoStats}>Location: {video.location}</Text>
					</View>
          <TouchableOpacity onPress={()=>this.setUpState()}>
              <Icon name="thump-up" size={40} color={this.state.colours[this.state.upToggle]}/>
          </TouchableOpacity>
				</View>
			</View>
	)
	}
}

function nFormatter(num, digits) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol + ' views';
}


const styles = StyleSheet.create({
  container: {
    padding:15
  },
  border:{
  },
  descContainer:{
	  flexDirection:'row',
	  paddingTop:15,
	  paddingLeft:5,
	  marginBottom:3,
	  backgroundColor: 'white',
	  justifyContent:'center',
	  alignItems: 'center',
  },
  descContainer2:{
	  flexDirection:'row',
	  paddingTop:15,
	  paddingLeft:5,
	  marginBottom:3,
  },
  videoTitle:{
	  fontSize:16
  },
  videoDetails:{
	  flex:1,
	  paddingHorizontal:14,
    marginBottom:15,
	  marginTop:-10 //marginTop negative can be used to adjust the position
  },
  videoStats: {
      fontSize: 14,
      paddingTop: 3,
	  color:"#3c3c3c"
  },
  channelTitleText: {
      fontSize: 24,
      paddingTop: 3,
	  color:"#3c3c3c"
  }
});
