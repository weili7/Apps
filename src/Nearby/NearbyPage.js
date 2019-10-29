import React from 'react';
import { StyleSheet, Text, View, Button, Alert, Image, TouchableOpacity,FlatList,ActivityIndicator, BackHandler} from 'react-native';
import { createStackNavigator, createBottomTabNavigator} from "react-navigation";
import Icon from 'react-native-vector-icons/MaterialIcons';
import VideoItem from './NearbyVideoItem';
import firebase from 'firebase';
//import data from './tryNearby/data.json';
import Geocoder from 'react-native-geocoding';


export default class NearBy extends React.Component{

  _didFocusSubscription;
  _willBlurSubscription;

	static navigationOptions = {
		tabBarLabel: "Nearby",
	}

	constructor(props) {
		super(props);
		this.state = {
			reportsInfo:[],	//used as an array to store all data of the available reports
			reportsMade:[],	//used to get the key of the reports, then from the key get each set of data
			nearbyReports:[],
			//currentLatitude:global.currentLatitude,   //dont know how to use
			//currentLongitude:global.currentLongitude,
			currentLatitude:5.3398523, //default
			currentLongitude:100.2793723, //default
			//currentLatitude:200,
			//currentLongitude:200,
			loading:true,
			locationLoading:true,
			error: null,
			tryData:[ //for testing
					{
						kind: "youtube#video",
						etag: "\"ld9biNPKjAjgjV7EZ4EKeEGrhao/UU2MX4Gbeybci3VccX0386YTpXI\"",
						id: "_EvMYEfF_hQ",
						snippet: {
							timeAgo: "2 hours ago",
							location: "Jalan Skudai Damai, Skudai, Johor",
							channelProfile:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzpZGfeGpYCBiwxxWqV_Qh19i9nRM2oUHA5Tg2QlfMkjTE-vE5",
							publishedAt: "2017-11-21T17:00:22.000Z",
							channelId: "UCftwRNsjfRo08xYE31tkiyw",
							title: "Pothole on Jalan Skudai Damai",
							description:"It is dangerous to road users when they try to dodge the hole.",
							thumbnails: {
								default: {
									"url": "https://i.ytimg.com/vi/_EvMYEfF_hQ/default.jpg",
									"width": 120,
									"height": 90
								},
								medium: {
									"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Newport_Whitepit_Lane_pot_hole.JPG/300px-Newport_Whitepit_Lane_pot_hole.JPG",
									"width": 320,
									"height": 180
								},
								high: {
									"url": "https://i.ytimg.com/vi/_EvMYEfF_hQ/hqdefault.jpg",
									"width": 480,
									"height": 360
								},
								standard: {
									"url": "https://i.ytimg.com/vi/_EvMYEfF_hQ/sddefault.jpg",
									"width": 640,
									"height": 480
								}
							},
							channelTitle: "Kevin Lim",
							tags: [
								"autocomplete",
								"autocomplete interview",
								"autocorrect",
								"google autocomplete",
								"joe keery",
								"joe keery interview",
								"joe keery stranger things",
								"stranger things",
								"stranger things 2",
								"stranger things cast",
								"wired autocomplete",
								"gaten matarazzo interview",
								"stranger things season 2",
								"gaten matarazzo",
								"gaten",
								"webs most searched",
								"google interview",
								"stranger things cast interview",
								"joe keery stranger things 2",
								"joe keery hair",
								"stranger things stars",
								"wired",
								"wired.com"
							],
							categoryId: 24,
							liveBroadcastContent: "none",
							localized: {
								"title": "Stranger Things Cast Answer the Web's Most Searched Questions | WIRED",
								"description": "Stranger Things stars Gaten Matarazzo and Joe Keery take the WIRED Autocomplete Interview and answer the Internet's most searched questions about Stranger Things and themselves. Joe and Gaten answer hard-hitting questions like, \"Is Gaten Matarazzo now?\" and \"Is Joe Keery legit?\"  \n\nStill haven’t subscribed to WIRED on YouTube? ►► http://wrd.cm/15fP7B7 \r\n\r\nCONNECT WITH WIRED\r\nWeb: http://wired.com \r\nTwitter: https://twitter.com/WIRED   \r\nFacebook: https://facebook.com/WIRED\r\nPinterest: https://pinterest.com/wired\r\nGoogle+: https://plus.google.com/+WIRED  \r\nInstagram: http://instagram.com/WIRED \r\nTumblr: http://WIRED.tumblr.com \r\n\r\nWant even more? Subscribe to The Scene: http://bit.ly/subthescene \r\n\r\nABOUT WIRED\r\nWIRED is where tomorrow is realized. Through thought-provoking stories and videos, WIRED explores the future of business, innovation, and culture.\n\nStranger Things Cast Answer the Web's Most Searched Questions | WIRED"
							},
							"defaultAudioLanguage": "en-US"
						},
						"statistics": {
							"viewCount": "13210200",
							"likeCount": "326010",
							"dislikeCount": "5399",
							"favoriteCount": "0",
							"commentCount": "21100"
						}
					},
					{
						"kind": "youtube#video",
						"etag": "\"ld9biNPKjAjgjV7EZ4EKeEGrhao/okUYi-H8TDiSUAKwfAcxSCp7KiQ\"",
						"id": "OHOkdEBpwDc",
						"snippet": {
							"timeAgo": "1 day ago",
							"location": "KFC, Aeon Taman University",
							"publishedAt": "2017-11-21T22:17:28.000Z",
							"channelProfile": "https://www.thehindu.com/sci-tech/technology/internet/article17759222.ece/alternates/FREE_660/02th-egg-person",
							"channelId": "UClFSU9_bUb4Rc6OYfTt5SPw",
							"title": "terrible dining experience in KFC",
							"description":"I couldn't find any clean table to use.The tables are in a mess, full of plates and food residue. Apparently, nobody does the cleaning job",
							"thumbnails": {
								"default": {
									"url": "https://i.ytimg.com/vi/OHOkdEBpwDc/default.jpg",
									"width": 120,
									"height": 90
								},
								"medium": {
									"url": "https://i2-prod.birminghammail.co.uk/incoming/article11694788.ece/ALTERNATES/s615/KFC-Martineau-Place-messy-tables-2.jpg",
									"width": 320,
									"height": 180
								},
								"high": {
									"url": "https://i.ytimg.com/vi/OHOkdEBpwDc/hqdefault.jpg",
									"width": 480,
									"height": 360
								},
								"standard": {
									"url": "https://i.ytimg.com/vi/OHOkdEBpwDc/sddefault.jpg",
									"width": 640,
									"height": 480
								},
								"maxres": {
									"url": "https://i.ytimg.com/vi/OHOkdEBpwDc/maxresdefault.jpg",
									"width": 1280,
									"height": 720
								}
							},
							"channelTitle": "Nurul Adilah",
							"tags": [
								"Jim Carrey",
								"Andy Kaufman",
								"Honest Trailers",
								"Stranger Things",
								"FCC",
								"Pai",
								"Net Neutrality",
								"Ajit Pai",
								"Comcast",
								"AT&T",
								"FTC",
								"Federal Communications Commission",
								"Federal Trade Commission",
								"Charlie Rose",
								"PBS",
								"Sexual Harassment",
								"Sexual Assault",
								"Allegations",
								"CBS",
								"CBS This Morning",
								"Bloomberg",
								"Washington Post",
								"Yvette Vega",
								"sxephil",
								"the philip defranco show",
								"philip defranco show",
								"philip defranco",
								"DeFranco",
								"current events",
								"daily",
								"news",
								"us news"
							],
							"categoryId": "24",
							"liveBroadcastContent": "none",
							"localized": {
								"title": "The Internet Is UNDER ATTACK, Net Neutrality is Dying, and What You Can Do...",
								"description": "Shoutout to dbrand! Get The Grip for 50% Off!: http://www.DeFrancoGrip.com\nTaking Our A's and Putting Them In Your Q's…: https://youtu.be/CZgHbTfALLo\nCheckout The DeFrancoFam!: https://youtu.be/A1gx0-pGc_k\nAudio Only Versions of the PDS:\n-iTunes: http://PDSPodcast.com\n-Soundcloud: https://soundcloud.com/thephilipdefrancoshow\n————————————\nWhy Feminists Are Disowning Lena Dunham Now and The Roy Moore Tax Reform \"Problem\": https://youtu.be/BrsoYVSgYQs\nWhy We Need To Talk About The Insane YouTube Kids Problem… #Elsagate: https://youtu.be/X_K-shDq-kM\n————————————\nTODAY IN AWESOME: \nJim & Andy: The Great Beyond: https://www.youtube.com/watch?v=6kkFV0tgZxQ\nEmoji Movie Honest Trailer: https://www.youtube.com/watch?v=CzmIrPvIzxk\nStranger Things Cast Answer Web’s Most Searched Questions: https://youtu.be/_EvMYEfF_hQ\nJapanese Game Show Slippery Stairs: http://digg.com/2017/slippery-stairs-japanese-game-show\nSecret Link: https://youtu.be/1GIf1fBe4ow\n\nSTORIES:\nNet Neutrality: \nContact your representative! : https://www.battleforthenet.com/ or  https://www.callmycongress.com/\nhttps://apps.fcc.gov/edocs_public/attachmatch/DOC-347868A1.pdf\nhttps://www.politico.com/story/2017/11/20/net-neutrality-repeal-fcc-251824\nhttps://www.washingtonpost.com/news/the-switch/wp/2017/11/21/the-fcc-has-unveiled-its-plan-to-rollback-its-net-neutrality-rules/?utm_term=.40bc6541969e\nhttps://arstechnica.com/tech-policy/2017/11/rip-net-neutrality-fcc-chair-releases-plan-to-deregulate-isps/\n\nCharlie Rose Allegations: \nhttps://www.washingtonpost.com/investigations/eight-women-say-charlie-rose-sexually-harassed-them--with-nudity-groping-and-lewd-calls/2017/11/20/9b168de8-caec-11e7-8321-481fd63f174d_story.html?utm_term=.a633336175be\nhttps://www.nytimes.com/2017/11/20/us/charlie-rose-women.html\nhttps://www.cbsnews.com/news/charlie-rose-suspended-sexual-misconduct-allegations/\nhttp://www.foxnews.com/entertainment/2017/11/21/cbs-news-fires-charlie-rose-following-sexual-misconduct-allegations.html\nhttp://www.businessinsider.com/charlie-rose-accused-of-improper-behavior-by-former-interns-2017-11  \n————————————\nJOIN THE ADVENTURE: http://DeFrancoElite.com\nOH DAMN, WHERE DID YOU GET THAT DOPE SHIRT?!: http://ShopDeFranco.com\n————————————\nFACEBOOK: http://on.fb.me/mqpRW7\nTWITTER: http://Twitter.com/PhillyD\nINSTAGRAM: https://instagram.com/phillydefranco/\nSNAPCHAT: TheDeFrancoFam\nREDDIT: https://www.reddit.com/r/DeFranco\nSOUNDCLOUD: https://soundcloud.com/thephilipdefrancoshow\n————————————\nEdited by:\nJames Girardier - https://twitter.com/jamesgirardier\n\nProduced by:\nAmanda Morones - https://twitter.com/MandaOhDang\n\nMotion Graphics Artist:\nBrian Borst - https://twitter.com/brianjborst\n\nP.O. BOX\nAttn: Philip DeFranco\n16350 Ventura Blvd\nSte D #542\nEncino, CA 91436"
							},
							"defaultAudioLanguage": "en"
						},
						"statistics": {
							"viewCount": "588301362",
							"likeCount": "69961",
							"dislikeCount": "1473",
							"favoriteCount": "0",
							"commentCount": "13283"
						}
					}
				],
		tryData2:[  //for testing
			{ authorityid: 'unspecifiedAuthorityID',
			 description: 'Qwee',
			 imageURLs: { '0': 'https://firebasestorage.googleapis.com/v0/b/tglproject1234-dfcd3.appspot.com/o/Reports%2F-LRgYVAXhHADWKU8varv%2F15426407370000.jpg?alt=media&token=f35c8dbf-094a-4d8e-bcd7-5b7d034f1835' },
			 latitude: 1.559329957413914,
			 location: 'P09, 80990 Johor Bahru, Johor, Malaysia',
			 longitude: 103.6424657329917,
			 publicSetting: 'true',
			 title: 'TryMa',
			 userid: 'unspecifiedUserID2' },
		   { authorityid: 'unspecifiedAuthorityID',
			 description: 'empty',
			 imageURLs: { '0': 'https://firebasestorage.googleapis.com/v0/b/tglproject1234-dfcd3.appspot.com/o/Reports%2F-LRgZn_KI34jp1F-yOxe%2F15426410850000.jpg?alt=media&token=f87d32ca-762c-42c2-9b63-b8c7c8bdf427' },
			 latitude: 1.552614841879922,
			 location: 'Jalan Kempas 2, 80990 Johor Bahru, Johor, Malaysia',
			 longitude: 103.63362718373537,
			 publicSetting: 'true',
			 title: 'N2',
			 userid: 'unspecifiedUserID2' },
		   { authorityid: 'unspecifiedAuthorityID',
			 description: 'Qwe',
			 imageURLs: { '0': 'https://firebasestorage.googleapis.com/v0/b/tglproject1234-dfcd3.appspot.com/o/Reports%2F-LRg_0E-HGU2T007uDuG%2F15426411380000.jpg?alt=media&token=c4d89d0a-1bb7-4b0e-a3c9-ec1b8ba2bcb2' },
			 latitude: 1.548181432884218,
			 location: '24, Jalan Pulai 15, Taman Pulai Utama, 81300 Skudai, Johor, Malaysia',
			 longitude: 103.63151025027037,
			 publicSetting: 'true',
			 title: 'N3',
			 userid: 'unspecifiedUserID2' },{ authorityid: 'unspecifiedAuthorityID',
			 description: 'Qwee',
			 imageURLs: { '0': 'https://firebasestorage.googleapis.com/v0/b/tglproject1234-dfcd3.appspot.com/o/Reports%2F-LRgYVAXhHADWKU8varv%2F15426407370000.jpg?alt=media&token=f35c8dbf-094a-4d8e-bcd7-5b7d034f1835' },
			 latitude: 1.559329957413914,
			 location: 'P09, 80990 Johor Bahru, Johor, Malaysia',
			 longitude: 103.6424657329917,
			 publicSetting: 'true',
			 title: 'TryMa',
			 userid: 'unspecifiedUserID2' } ]
		}

		this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>{
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		this._refresh()
	})
	}

	onBackButtonPressAndroid = () => {
		this.props.navigation.navigate("Home")
		return true
	};

	componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>{
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
			this.setState({
						reportsInfo:[],	//used as an array to store all data of the available reports
						reportsMade:[],	//used to get the key of the reports, then from the key get each set of data
						nearbyReports:[],
						//currentLatitude:global.currentLatitude,   //dont know how to use
						//currentLongitude:global.currentLongitude,
						currentLatitude:5.3398523, //default
						currentLongitude:100.2793723, //default
						//currentLatitude:200,
						//currentLongitude:200,
						loading:true,
						locationLoading:true,
						error: null,})
    }
    )
		//IF WANT TO USE THIS.SETSTATE IN COMPONENT
		//reference:https://stackoverflow.com/questions/38025653/this-setstate-is-not-a-function-when-using-react-with-jquery-inside-componentd
	}

	_refresh(){
		navigator.geolocation.getCurrentPosition(
		  (position) => {
			this.setState({
				currentLatitude: position.coords.latitude,
				currentLongitude: position.coords.longitude,
				locationLoading:false,
				error: null,
			});

		  },
		  (error) => {
			  this.setState({ error: error.message })
			  this.setState({
				currentLatitude:  5.3398523,
				currentLongitude: 100.2793723,
				locationLoading:false,
			});
		  },
		  { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 },
		)


		//Get all reportkey //reference:https://stackoverflow.com/questions/41291980/how-to-get-the-value-of-children-in-firebase-javascript
		var reportsArray=[];
		//Get all reportkey //reference:https://stackoverflow.com/questions/41291980/how-to-get-the-value-of-children-in-firebase-javascript
		UserNearByRef=firebase.database().ref('/Reports')

		GetReportKey= UserNearByRef.once("value",(data)=>{
			data.forEach((child)=>{
				//console.log(child.key+"!!");
				reportsArray.push(child.key);
			})
			this.setState({reportsMade : reportsArray});
			var store=data.toJSON()
			console.log(data.toJSON())
			for (var keyname in store)
			{
				var newobject={};
				newobject[keyname]=store[keyname];
				this.state.reportsInfo.push(newobject);
			}
			//console.log(this.state.reportsMade.length)
			var listReportNearby=[];
			for (var i=0; i<this.state.reportsMade.length;i++){
				var listReport={};
				var nearbyReports=[];
				var keyname=this.state.reportsMade[this.state.reportsMade.length-1-i];
				var titleArray=this.state.reportsInfo[this.state.reportsMade.length-1-i];
				var dataInside = titleArray[keyname]
				diffLat= Math.abs(dataInside.latitude - this.state.currentLatitude);
				diffLong= Math.abs(dataInside.longitude - this.state.currentLongitude);
				isPublic=dataInside.publicSetting
				console.log("diffLat",diffLat)
				console.log("diffLong",diffLong)
				if ( diffLat<0.02 && diffLong <0.01)
				{
					if (isPublic)
					{
						this.state.nearbyReports.push(dataInside)
					}
				}
			}
			this.setState({loading: false});

		});
	}

	componentWillUnmount() {
		this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
	}
/*
	processJumper=async()=>{
		console.log("entered Process Jumper")
		const waitProcess = await this.process();
		var reportsArray=[];
		//Get all reportkey //reference:https://stackoverflow.com/questions/41291980/how-to-get-the-value-of-children-in-firebase-javascript
		UserNearByRef=firebase.database().ref('/Reports')

		GetReportKey= UserNearByRef.once("value",(data)=>{
			data.forEach((child)=>{
				console.log(child.key+"!!");
				reportsArray.push(child.key);
			})
			this.setState({reportsMade : reportsArray});
			var store=data.toJSON()
			console.log(data.toJSON())
			for (var keyname in store)
			{
				var newobject={};
				newobject[keyname]=store[keyname];
				this.state.reportsInfo.push(newobject);
			}
			//console.log(this.state.reportsMade.length)
			var listReportNearby=[];
			for (var i=0; i<this.state.reportsMade.length;i++){
				var listReport={};
				var nearbyReports=[];
				var keyname=this.state.reportsMade[i];
				var titleArray=this.state.reportsInfo[i];
				var dataInside = titleArray[keyname]
				diffLat= Math.abs(dataInside.latitude - this.state.currentLatitude);
				diffLong= Math.abs(dataInside.longitude - this.state.currentLongitude);
				isPublic=dataInside.publicSetting
				console.log("diffLat",diffLat)
				console.log("diffLong",diffLong)
				if ( diffLat<0.02 && diffLong <0.01)
				{
					if (isPublic)
					{
						this.state.nearbyReports.push(dataInside)
					}
				}
			}
			this.setState({loading: false});

		});
	}
	process=()=>{
	  console.log("entered process");
	  return new Promise ((resolve, reject)=>{
		navigator.geolocation.getCurrentPosition(
		  (position) => {
			this.setState({
				currentLatitude: position.coords.latitude,
				currentLongitude: position.coords.longitude,
				locationLoading:false,
			});

		  },
		  (error) => this.setState({ error: error.message }),
		  { enableHighAccuracy: true, timeout: 10, maximumAge: 1000 },
		).then(()=> {
		  console.log("done")
		  resolve(true)
		}).catch((error)=>{
		  console.log("ERROR AT GetGPSporcess")
		  reject(error)
		});
	  })
	}
*/
	//CANNOT USE LIST OR FLATLIST UNDER FLEX VIEW, for this case
	getNearbyReports=()=> {
		console.log(this.state.reportsMade.length)
		if (this.state.nearbyReports.length===0)
		{
			const result= 	(<View>
								  <Text>No Nearby Reports</Text>
							 </View>)

			return result;
		}
		else
		{

			console.log("NEARBY",this.state.nearbyReports)
			//console.log("ALL_ReportInfo",this.state.reportsInfo)
			const result= 	(<View>
								<View>
								 <FlatList
									 data={this.state.nearbyReports}
									 renderItem={(video)=> <VideoItem video={video.item} />}
									 keyExtractor={(item)=>item.description}
									 ItemSeparatorComponent={()=><View style={{height:0.5,backgroundColor:'#E5E5E5'}}/>}
								 />
								 </View>
							</View>)
			return result;
		}
	}
	render(){
		const display = this.state.loading ?
			(
				<View style={{height:WindowHeight, alignItems:'center', justifyContent: 'center', flexDirection:'column'}}>
					<ActivityIndicator animating={this.state.loading}/>
					<Text>Loading...</Text>
				</View>
			):(
			<View>
				{this.getNearbyReports()}
			</View>
			)

		const display2=(
			<View style = {styles.container}>
				<View style = {styles.navBar}>
									<Text style={styles.topBarText}>Reports NearBy</Text>

								</View>
				<View style={styles.body}>
				<FlatList
					 data={this.state.tryData2}
					 renderItem={(video)=> <VideoItem video={video.item} />}
					 keyExtractor={(item)=>item.description}
					 ItemSeparatorComponent={()=><View style={{height:0.5,backgroundColor:'#E5E5E5'}}/>}
				/>
				</View>
			</View>)

		const display3=(
		<View style = {styles.container}>
				<View style = {styles.navBar}>
									<Text style={styles.topBarText}>Reports NearBy</Text>

								</View>
				<View style={styles.body}>
				<FlatList
					 data={this.state.nearbyReports}
					 renderItem={(video)=> <VideoItem video={video.item} />}
					 keyExtractor={(item)=>item.description}
					 ItemSeparatorComponent={()=><View style={{height:0.5,backgroundColor:'#E5E5E5'}}/>}
				/>
				</View>
			</View>)
		const waitGPS = this.state.locationLoading ?
			(
				<View style={{height:WindowHeight, alignItems:'center', justifyContent: 'center', flexDirection:'column'}}>
					<ActivityIndicator animating={this.state.locationLoading}/>
					<Text>Loading Current Location...</Text>
					<Text>Latitude:{this.state.currentLatitude}</Text>
					<Text>Longitude:{this.state.currentLongitude}</Text>
				</View>
			):(
			<View style = {styles.container}>
				<View style={styles.body}>
				<FlatList
					 data={this.state.nearbyReports}
					 renderItem={(video)=> <VideoItem video={video.item} />}
					 keyExtractor={(item)=>item.description}
					 ItemSeparatorComponent={()=><View style={{height:0.5,backgroundColor:'#E5E5E5'}}/>}
				/>
				</View>
			</View>
			)
		const display4= this.state.loading ?
			(
				<View style={{height:WindowHeight, alignItems:'center', justifyContent: 'center', flexDirection:'column'}}>
					<ActivityIndicator animating={this.state.loading}/>
					<Text>Loading...</Text>
				</View>
			):(
		<View style = {styles.container}>
				<View style = {styles.navBar}>
									<Text style={styles.topBarText}>Reports NearBy</Text>

								</View>
				<View style={styles.body}>
				<FlatList
					 data={this.state.nearbyReports}
					 renderItem={(video)=> <VideoItem video={video.item} />}
					 keyExtractor={(item)=>item.description}
					 ItemSeparatorComponent={()=><View style={{height:0.5,backgroundColor:'#E5E5E5'}}/>}
				/>
				</View>
			</View>)
		return(
			<View style = {styles.container}>
				{waitGPS}
			</View>

		);
	}
}


const styles = StyleSheet.create({
  container:{
	flex:1,
  },
    body:{
	  flex:1,
  },
  topBarText:{
	fontSize:30,
	color: '#3c3c3c',
	paddingTop:2
  },
  navBar:{
	  height: 40,
	  backgroundColor: 'white',
	  elevation:3, //to produce the 3D view
	  paddingHorizontal:15,
	  flexDirection: 'row',
	  alignItems: 'center',
	  justifyContent: 'space-between'
  },
  rightNav: {
	  flexDirection: 'row'
  },
  navItem:{
	  marginLeft:25
  },
  tabBar:{
	  backgroundColor: 'white',
	  height:60,
	  borderTopWidth: 0.5,
	  borderColor: '#E5E5E5',
	  flexDirection: 'row',
	  justifyContent: 'space-around'

  },
  tabItem:{
	  alignItems: 'center',
	  justifyContent: 'center'
  },
  tabTitle:{
	  fontSize:11,
	  color: '#3c3c3c',
	  paddingTop: 4
  }
});
